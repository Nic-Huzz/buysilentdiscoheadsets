import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function buildWelcomeEmail(tag: string): string {
  const spotifyLinks: Record<string, string> = {
    'breathwork-playlist': '<p style="margin-top:20px;"><a href="https://open.spotify.com/playlist/3QerAp22uDXUJ1n8Bq0NwJ?si=9e07f61dab6444d9" style="color:#5e17eb;font-weight:600;">Listen to our Breathwork Playlist on Spotify →</a></p>',
    'dance-playlist': '<p style="margin-top:20px;"><a href="https://open.spotify.com/playlist/6Ftw0T93Qjo48TJcFY9aC5?si=d05f6427289d4b75" style="color:#5e17eb;font-weight:600;">Listen to our Dance Playlist on Spotify →</a></p>',
  }

  const playlistBlock = spotifyLinks[tag] || ''

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f;">
      <p>Hey,</p>
      <p>Welcome - this month we're giving away 5 free headsets with any order above 10.</p>
      <div style="background:#5e17eb;color:#fff;text-align:center;padding:16px;border-radius:8px;font-size:20px;font-weight:700;letter-spacing:1px;margin:20px 0;">5 FREE HEADSETS - ORDERS ABOVE 10</div>
      <p><a href="https://buysilentdiscoheadphones.com/#packages" style="color:#5e17eb;font-weight:600;">Build Your Package →</a></p>
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
      <p style="margin-top:20px;">This offer is valid through the end of the month.</p>
      <p>Talk soon,<br>Nic<br><span style="color:#86868b;font-size:14px;">Founder, Buy Silent Disco Headphones<br>400-hour certified breathwork facilitator</span></p>
    </div>
  `
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, tag, name } = await req.json()

    if (!email || !tag) {
      return new Response(
        JSON.stringify({ error: 'Email and tag are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!email.includes('@') || !email.includes('.')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const cleanEmail = email.toLowerCase().trim()

    // Check if contact exists
    const { data: existing } = await supabase
      .from('external_contacts')
      .select('id, tags')
      .eq('email', cleanEmail)
      .single()

    let contactId: string

    if (existing) {
      const currentTags = existing.tags || []
      if (!currentTags.includes(tag)) {
        const { error } = await supabase
          .from('external_contacts')
          .update({ tags: [...currentTags, tag] })
          .eq('id', existing.id)
        if (error) throw error
      }
      contactId = existing.id
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
      contactId = data.id
    }

    // Send welcome email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Nic Huzz <nic@nichuzz.com>',
            to: cleanEmail,
            subject: 'Your 5 free headsets + the 5 principles behind 200+ sessions',
            html: buildWelcomeEmail(tag),
          }),
        })
      } catch (err) {
        console.error('Resend error:', err)
      }
    }

    return new Response(
      JSON.stringify({ success: true, action: existing ? 'updated' : 'created', id: contactId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
