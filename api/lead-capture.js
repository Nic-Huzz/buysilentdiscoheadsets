const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://qlwfcfypnoptsocdpxuv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const RESEND_API_KEY = process.env.RESEND_API_KEY

function buildWelcomeEmail(tag) {
  const spotifyLinks = {
    'breathwork-playlist': '<p style="margin-top:20px;"><a href="https://open.spotify.com/playlist/3QerAp22uDXUJ1n8Bq0NwJ?si=9e07f61dab6444d9" style="color:#5e17eb;font-weight:600;">Listen to our Breathwork Playlist on Spotify →</a></p>',
    'dance-playlist': '<p style="margin-top:20px;"><a href="https://open.spotify.com/playlist/6Ftw0T93Qjo48TJcFY9aC5?si=d05f6427289d4b75" style="color:#5e17eb;font-weight:600;">Listen to our Dance Playlist on Spotify →</a></p>',
  }

  const playlistBlock = spotifyLinks[tag] || ''

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f;">
      <p>Hey,</p>
      <p>Welcome - here's your 10% discount code:</p>
      <div style="background:#5e17eb;color:#fff;text-align:center;padding:16px;border-radius:8px;font-size:24px;font-weight:700;letter-spacing:2px;margin:20px 0;">WELCOME10</div>
      <p><a href="https://buysilentdiscoheadphones.com/#packages" style="color:#5e17eb;font-weight:600;">Shop Now - 10% Off →</a></p>
      <p>After 200+ sessions and 400 hours of breathwork certification, these are the 5 principles I build every session off:</p>
      <div style="background:#f5f3f7;padding:20px;border-radius:8px;margin:20px 0;">
        <p style="margin:8px 0;"><strong>1. Safety is key</strong> - participants can only go as deep or feel as high as they feel safe</p>
        <p style="margin:8px 0;"><strong>2. They leave feeling great</strong> - every session ends with movement</p>
        <p style="margin:8px 0;"><strong>3. Clear on the peaks</strong> - design the peak highs and peak lows intentionally</p>
        <p style="margin:8px 0;"><strong>4. Never have attendees sitting still passively consuming for more than 5 minutes</strong> - keep the energy and session fresh and moving</p>
        <p style="margin:8px 0;"><strong>5. Connect them to the mission</strong> - they need to feel why they're here</p>
      </div>
      <p>Noise-cancelling headphones are how I deliver on principle #1. The moment external distractions disappear, participants feel safe enough to actually let go. It changed everything for my sessions.</p>
      ${playlistBlock}
      <p style="margin-top:20px;">This code is valid for 72 hours.</p>
      <p>Talk soon,<br>Nic<br><span style="color:#86868b;font-size:14px;">Founder, Buy Silent Disco Headphones<br>400-hour certified breathwork facilitator</span></p>
    </div>
  `
}

async function sendWelcomeEmail(email, tag) {
  if (!RESEND_API_KEY) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Nic Huzz <nic@nichuzz.com>',
        to: email,
        subject: 'Your 10% off + the 5 principles behind 200+ sessions',
        html: buildWelcomeEmail(tag),
      }),
    })
  } catch (err) {
    console.error('Resend error:', err)
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, tag, name } = req.body

    if (!email || !tag) {
      return res.status(400).json({ error: 'Email and tag are required' })
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const cleanEmail = email.toLowerCase().trim()

    const { data: existing } = await supabase
      .from('external_contacts')
      .select('id, tags')
      .eq('email', cleanEmail)
      .single()

    if (existing) {
      const currentTags = existing.tags || []
      if (!currentTags.includes(tag)) {
        const { error } = await supabase
          .from('external_contacts')
          .update({ tags: [...currentTags, tag] })
          .eq('id', existing.id)
        if (error) throw error
      }
      // Send welcome email even for returning contacts with new tags
      await sendWelcomeEmail(cleanEmail, tag)
      return res.status(200).json({ success: true, action: 'updated', id: existing.id })
    } else {
      const { data, error } = await supabase
        .from('external_contacts')
        .insert({
          email: cleanEmail,
          name: name || null,
          source: 'headset-sales',
          tags: [tag],
          subscribed: true,
        })
        .select('id')
        .single()
      if (error) throw error
      // Send welcome email
      await sendWelcomeEmail(cleanEmail, tag)
      return res.status(200).json({ success: true, action: 'created', id: data.id })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
