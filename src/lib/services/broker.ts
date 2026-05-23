'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function createBroker(data: { name: string; registration_number?: string; country?: string }) {
  const supabase = await createClient()
  const admin = createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('organization_id, role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'admin', 'compliance_officer'].includes(profile.role)) {
    throw new Error('Forbidden')
  }

  const { data: broker, error } = await supabase.from('brokers').insert({
    organization_id: profile.organization_id,
    name: data.name,
    registration_number: data.registration_number,
    country: data.country,
    status: 'pending_review'
  }).select().single()

  if (error) throw error

  // Create default limits
  await supabase.from('broker_limits').insert({
    broker_id: broker.id,
    max_open_exposure_usd: 100000,
    max_quote_size_oz: 32.15, // ~1kg
    requires_prefunding: true
  })

  await logAuditEvent('create_broker', 'brokers', broker.id, { data })
  
  return broker
}

export async function getBrokers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('brokers').select(`*, broker_limits(*)`)
  if (error) throw error
  return data
}
