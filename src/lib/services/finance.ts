'use server'

import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function confirmPayment(paymentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'finance_manager'].includes(profile.role)) {
    throw new Error('Forbidden')
  }

  const { data: payment, error } = await supabase.from('payments').update({
    status: 'confirmed',
    confirmed_by: user.id,
    confirmed_at: new Date().toISOString()
  }).eq('id', paymentId).select().single()

  if (error) throw error

  await logAuditEvent('confirm_payment', 'payments', paymentId, {})

  return payment
}
