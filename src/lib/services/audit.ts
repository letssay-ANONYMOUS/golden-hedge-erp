'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string,
  details: any
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const adminClient = createAdminClient()

  // Get user's organization
  const { data: profile } = await adminClient
    .from('users_profile')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error('No organization found')

  const { error } = await adminClient.from('audit_logs').insert({
    user_id: user.id,
    organization_id: profile.organization_id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  })

  if (error) {
    console.error('Audit log error:', error)
  }
}
