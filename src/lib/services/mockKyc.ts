'use server'

import { createClient } from '@/lib/supabase/server'

// This simulates the Third-Party KYC Provider (e.g. SumSub) finishing their background check
// and firing a webhook to our Supabase Edge Function.
export async function simulateKycWebhook(applicantId: string, status: 'completed' | 'rejected') {
  // In a real environment, the third party sends this POST request to our Edge Function URL.
  // We will directly call our Edge Function via the Supabase client to simulate it.
  
  const supabase = await createClient()
  
  // Actually, since we are just mocking this for the frontend to progress,
  // we can also just update the database directly here if the edge function isn't deployed locally,
  // BUT to fully test the architecture, we would call the Edge Function.
  // For safety in this hybrid environment, we'll just update the DB directly as the "mock provider".
  
  const { error } = await supabase
    .from('users_profile')
    .update({
      kyc_status: status === 'completed' ? 'approved' : 'rejected',
      kyc_verified_at: new Date().toISOString()
    })
    .eq('kyc_applicant_id', applicantId)
    
  if (error) throw new Error(error.message)
  
  return { success: true }
}
