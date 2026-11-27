import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// SHA256 hash for Meta CAPI (requires lowercase, trimmed input)
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.toLowerCase().trim())
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Send Lead event to Meta Conversions API
async function sendMetaCAPI(email: string, req: Request, metadata?: Record<string, unknown>) {
  const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN')
  const pixelId = '2258374091587901'
  if (!accessToken) return

  try {
    const hashedEmail = await sha256(email)
    const eventTime = Math.floor(Date.now() / 1000)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || ''
    const clientUa = req.headers.get('user-agent') || ''

    const userData: Record<string, unknown> = {
      em: [hashedEmail],
      client_ip_address: clientIp,
      client_user_agent: clientUa,
    }

    // Pass fbp/fbc click cookies if the client sent them
    if (metadata?.fbp) userData.fbp = metadata.fbp
    if (metadata?.fbc) userData.fbc = metadata.fbc

    // Hash and include phone number (WhatsApp) for stronger matching
    if (metadata?.whatsapp) {
      const cleanPhone = String(metadata.whatsapp).replace(/[^0-9+]/g, '')
      if (cleanPhone.length >= 7) {
        userData.ph = [await sha256(cleanPhone)]
      }
    }

    const eventData: Record<string, unknown> = {
      event_name: 'Lead',
      event_time: eventTime,
      action_source: 'website',
      event_source_url: 'https://buysilentdiscoheadphones.com',
      user_data: userData,
    }

    // Deduplication: match event_id with client-side pixel
    if (metadata?.event_id) eventData.event_id = metadata.event_id

    // Value-based optimization: send deal value so Meta optimizes for high-value leads
    if (metadata?.estimated_total) {
      const numericValue = parseInt(String(metadata.estimated_total).replace(/[^0-9]/g, ''))
      if (numericValue > 0) {
        eventData.custom_data = { value: numericValue, currency: 'USD' }
      }
    }

    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [eventData],
        access_token: accessToken,
      }),
    })
  } catch (err) {
    console.error('Meta CAPI error:', err)
  }
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
          source: (metadata?.utm?.utm_source) || 'headset-sales',
          tags: [tag],
          subscribed: true,
          metadata: metadata ? { ...metadata, last_activity: new Date().toISOString() } : {},
        })
        .select('id')
        .single()
      if (error) throw error
      contactId = data.id
    }

    // Auto-create sales_deals entry for quote requests
    if (tag === 'quote-request' && metadata) {
      try {
        const headsets = parseInt(metadata.headsets) || 0
        const transmitters = parseInt(metadata.transmitters) || 0
        const estimatedValue = parseInt(String(metadata.estimated_total).replace(/[^0-9]/g, '')) || 0

        const { data: existingDeal } = await supabase
          .from('sales_deals')
          .select('id')
          .eq('contact_email', cleanEmail)
          .eq('product_type', 'headset_sales')
          .single()

        if (!existingDeal) {
          await supabase
            .from('sales_deals')
            .insert({
              user_id: 'ebe69854-2ebd-4236-a437-3a362f5e1af4',
              contact_name: name || cleanEmail.split('@')[0],
              contact_email: cleanEmail,
              source: (metadata.utm?.utm_source) || 'Website',
              product_type: 'headset_sales',
              value: estimatedValue,
              status: 'lead',
              notes: `${headsets} headphones + ${transmitters} transmitter(s). ${metadata.estimated_total || 'Value TBC'}. ${metadata.country || 'Country TBC'}. Auto-created from landing page form.`,
            })
        }
      } catch (err) {
        console.error('sales_deals insert error:', err)
      }
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

    // Send Lead event to Meta Conversions API (server-side)
    if (['popup-free-headsets', 'popup-discount', 'quote-request',
         'breathwork-playlist', 'dance-playlist', '5-principles'].includes(tag)) {
      await sendMetaCAPI(cleanEmail, req, metadata)
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
