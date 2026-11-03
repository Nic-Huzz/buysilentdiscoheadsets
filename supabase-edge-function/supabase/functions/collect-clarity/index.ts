import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const token = Deno.env.get('CLARITY_API_TOKEN')
  if (!token) {
    return new Response(JSON.stringify({ error: 'CLARITY_API_TOKEN not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const baseUrl = 'https://www.clarity.ms/export-data/api/v1/project-live-insights'
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const results: { dimension: string; metrics: number; errors: string[] }[] = []

  for (const dimension of ['URL', 'Source']) {
    try {
      const res = await fetch(`${baseUrl}?numOfDays=3&dimension1=${dimension}`, { headers })

      if (!res.ok) {
        results.push({ dimension, metrics: 0, errors: [`HTTP ${res.status}: ${res.statusText}`] })
        continue
      }

      const data = await res.json()
      const rows = []

      for (const metric of data) {
        rows.push({
          period_days: 3,
          dimension,
          metric_name: metric.metricName,
          data: metric.information || [],
        })
      }

      if (rows.length > 0) {
        const { error } = await supabase.from('clarity_snapshots').insert(rows)
        if (error) {
          results.push({ dimension, metrics: rows.length, errors: [error.message] })
        } else {
          results.push({ dimension, metrics: rows.length, errors: [] })
        }
      }
    } catch (err) {
      results.push({ dimension, metrics: 0, errors: [(err as Error).message] })
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
