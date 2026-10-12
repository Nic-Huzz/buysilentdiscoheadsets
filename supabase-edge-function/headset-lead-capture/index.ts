import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}


Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, tag, name, metadata } = await req.json()

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
      .select('id, tags, metadata')
      .eq('email', cleanEmail)
      .single()

    let contactId: string

    if (existing) {
      const currentTags = existing.tags || []
      const updatedTags = currentTags.includes(tag) ? currentTags : [...currentTags, tag]
      const mergedMetadata = metadata
        ? { ...(existing.metadata || {}), ...metadata, last_activity: new Date().toISOString() }
        : existing.metadata || {}

      const { error } = await supabase
        .from('external_contacts')
        .update({ tags: updatedTags, metadata: mergedMetadata })
        .eq('id', existing.id)
      if (error) throw error
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
          metadata: metadata ? { ...metadata, last_activity: new Date().toISOString() } : {},
        })
        .select('id')
        .single()
      if (error) throw error
      contactId = data.id
    }

    // Add to MailerLite and trigger welcome sequence for popup signups
    const mailerliteApiKey = Deno.env.get('MAILERLITE_API_KEY')
    if (mailerliteApiKey && (tag === 'popup-free-headsets' || tag === 'popup-discount')) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailerliteApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: cleanEmail,
            name: name || undefined,
            groups: ['200817537597835023'],
          }),
        })
      } catch (err) {
        console.error('MailerLite error:', err)
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
