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
    const { action, token } = await req.json()
    const adminToken = Deno.env.get('ADMIN_TOKEN')
    
    console.log('Incoming action:', action)
    console.log('Token matches?', token === adminToken)

    if (!adminToken || token !== adminToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

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
        const { error } = await supabase
          .from('app_state')
          .update({ is_active_round: false, updated_at: new Date().toISOString() })
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
          .update({ is_active_round: false, updated_at: new Date().toISOString() })
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
