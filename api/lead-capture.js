import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qlwfcfypnoptsocdpxuv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({})
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

    // Check if contact already exists
    const { data: existing } = await supabase
      .from('external_contacts')
      .select('id, tags')
      .eq('email', cleanEmail)
      .single()

    if (existing) {
      // Append tag if not already present
      const currentTags = existing.tags || []
      if (!currentTags.includes(tag)) {
        const { error } = await supabase
          .from('external_contacts')
          .update({ tags: [...currentTags, tag] })
          .eq('id', existing.id)

        if (error) throw error
      }

      return res.status(200).json({ success: true, action: 'updated', id: existing.id })
    } else {
      // Create new contact
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

      return res.status(200).json({ success: true, action: 'created', id: data.id })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
