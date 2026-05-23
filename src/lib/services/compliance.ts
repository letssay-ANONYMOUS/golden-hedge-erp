'use server'

import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function createGoAMLDraft(data: {
  report_type: string;
  subject_broker_id?: string;
  suspicion_reason: string;
  narrative: string;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('organization_id, role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'compliance_officer'].includes(profile.role)) {
    throw new Error('Forbidden')
  }

  const { data: draft, error } = await supabase.from('goaml_report_drafts').insert({
    organization_id: profile.organization_id,
    report_type: data.report_type,
    subject_broker_id: data.subject_broker_id,
    suspicion_reason: data.suspicion_reason,
    narrative: data.narrative,
    status: 'draft'
  }).select().single()

  if (error) throw error

  await logAuditEvent('create_goaml_draft', 'goaml_report_drafts', draft.id, { data })

  return draft
}
