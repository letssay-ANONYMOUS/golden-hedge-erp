'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const requestedRole = formData.get('requested_role') as string

  // Note: RLS prevents users from inserting into users_profile if the trigger already created it. 
  // Wait, our trigger `01_core.sql` creates the profile on auth.users insert.
  // So we just UPDATE the existing profile.
  const { error } = await supabase.from('users_profile').update({
    full_name: fullName,
    // Add phone or other metadata if we had it, but we only have full_name and role.
    // requested_role would ideally go to a separate request table, or we just keep it simple.
  }).eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  redirect('/admin')
}
