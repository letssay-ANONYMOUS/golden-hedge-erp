import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { applicantId, reviewStatus } = payload // Mock SumSub style payload

    if (!applicantId || !reviewStatus) {
      throw new Error('Missing applicantId or reviewStatus')
    }

    // Initialize Supabase Client with Service Role Key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Map provider status to our DB status
    let status = 'pending'
    if (reviewStatus === 'completed') status = 'approved'
    if (reviewStatus === 'rejected') status = 'rejected'
    if (reviewStatus === 'pending') status = 'manual_review'

    // Update the profile
    const { error: updateError } = await supabaseClient
      .from('users_profile')
      .update({
        kyc_status: status,
        kyc_verified_at: new Date().toISOString()
      })
      .eq('kyc_applicant_id', applicantId)

    if (updateError) throw updateError

    // Log the webhook
    await supabaseClient
      .from('kyc_webhook_logs')
      .insert({
        applicant_id: applicantId,
        event_type: reviewStatus,
        payload: payload
      })

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 400 })
  }
})
