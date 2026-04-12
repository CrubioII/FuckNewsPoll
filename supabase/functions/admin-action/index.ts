import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, token: bodyToken } = await req.json()
    
    // Get token from body or Authorization header
    const authHeader = req.headers.get('Authorization')
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const providedToken = bodyToken || headerToken
    
    const adminToken = Deno.env.get('ADMIN_TOKEN')
    
    console.log('Action:', action)
    console.log('Provided token length:', providedToken?.length)
    console.log('Admin token set?', !!adminToken)

    if (!adminToken || providedToken !== adminToken) {
      console.error('Unauthorized attempt')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Use Service Role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    switch (action) {
      case 'start': {
        const { error } = await supabase
          .from('app_state')
          .update({ is_active_round: true, updated_at: new Date().toISOString() })
          .eq('id', 1)
        if (error) throw error
        break
      }
      case 'stop': {
        const { data: counts } = await supabase
          .from('vote_counts')
          .select('mago_count, camilo_count')
          .single()
        const winner = counts && Number(counts.mago_count) >= Number(counts.camilo_count) ? 'mago' : 'camilo'
        const { error } = await supabase
          .from('app_state')
          .update({ is_active_round: false, winner, updated_at: new Date().toISOString() })
          .eq('id', 1)
        if (error) throw error
        break
      }
      case 'reset': {
        const { error: deleteError } = await supabase
          .from('votos')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows
        if (deleteError) throw deleteError

        const { error: updateError } = await supabase
          .from('app_state')
          .update({ is_active_round: false, winner: null, updated_at: new Date().toISOString() })
          .eq('id', 1)
        if (updateError) throw updateError
        break
      }
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
