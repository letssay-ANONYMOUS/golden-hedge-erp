'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const phone = formData.get('phone') as string
  const requestedRole = formData.get('requested_role') as string

  // Note: RLS prevents users from inserting into users_profile if the trigger already created it. 
  // Wait, our trigger `01_core.sql` creates the profile on auth.users insert.
  // So we just UPDATE the existing profile.
  const applicantId = `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  const { error } = await supabase.from('users_profile').update({
    first_name: firstName,
    last_name: lastName,
    kyc_applicant_id: applicantId,
    kyc_status: 'pending'
  }).eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { applicantId }
}
