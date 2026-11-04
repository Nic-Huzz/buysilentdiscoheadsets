import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ImapFlow } from 'npm:imapflow@1.0.171'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const imapHost = Deno.env.get('IMAP_HOST') || 'mail.privateemail.com'
  const imapUser = Deno.env.get('IMAP_USER')
  const imapPass = Deno.env.get('IMAP_PASS')

  if (!imapUser || !imapPass) {
    return new Response(JSON.stringify({ error: 'IMAP credentials not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get all leads with their emails
  const { data: leads, error: leadsError } = await supabase
    .from('sales_deals')
    .select('id, contact_name, contact_email, last_contact_date')
    .eq('product_type', 'headset_sales')
    .not('contact_email', 'is', null)

  if (leadsError || !leads?.length) {
    return new Response(JSON.stringify({ error: leadsError?.message || 'No leads with emails' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const leadEmails = new Map(leads.map(l => [l.contact_email.toLowerCase(), l]))

  try {
    const client = new ImapFlow({
      host: imapHost,
      port: 993,
      secure: true,
      auth: { user: imapUser, pass: imapPass },
      logger: false,
    })

    await client.connect()

    const lock = await client.getMailboxLock('Sent')
    const updates: { name: string; email: string; date: string; id: string }[] = []

    try {
      // Search sent emails from last 90 days
      const since = new Date()
      since.setDate(since.getDate() - 90)

      for await (const msg of client.fetch(
        { since },
        { envelope: true }
      )) {
        const toAddresses = msg.envelope?.to || []
        const sentDate = msg.envelope?.date

        if (!sentDate) continue

        const dateStr = new Date(sentDate).toISOString().split('T')[0]

        for (const addr of toAddresses) {
          const email = addr.address?.toLowerCase()
          if (!email) continue

          const lead = leadEmails.get(email)
          if (!lead) continue

          // Update if this is more recent than current last_contact_date
          if (!lead.last_contact_date || dateStr > lead.last_contact_date) {
            updates.push({
              name: lead.contact_name,
              email,
              date: dateStr,
              id: lead.id,
            })
            // Update the map so we track the latest date
            lead.last_contact_date = dateStr
          }
        }
      }
    } finally {
      lock.release()
    }

    await client.logout()

    // Batch update Supabase
    let updated = 0
    for (const u of updates) {
      const { error } = await supabase
        .from('sales_deals')
        .update({ last_contact_date: u.date })
        .eq('id', u.id)

      if (!error) updated++
    }

    return new Response(JSON.stringify({
      success: true,
      leads_checked: leads.length,
      updates_found: updates.length,
      updates_applied: updated,
      details: updates.map(u => ({ name: u.name, last_contact: u.date })),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({
      error: (err as Error).message,
      stack: (err as Error).stack,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
