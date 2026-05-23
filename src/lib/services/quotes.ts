'use server'

import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function requestQuote(data: {
  metal_id: string;
  purity_grade_id: string;
  weight_grams: number;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: brokerUser } = await supabase.from('broker_users').select('broker_id').eq('user_profile_id', user.id).single()
  
  if (!brokerUser) throw new Error('Only broker users can request quotes')

  const { data: broker } = await supabase.from('brokers').select('organization_id').eq('id', brokerUser.broker_id).single()

  const { data: quote, error } = await supabase.from('quotes').insert({
    organization_id: broker!.organization_id,
    broker_id: brokerUser.broker_id,
    broker_user_id: user.id,
    status: 'requested',
    metal_id: data.metal_id,
    purity_grade_id: data.purity_grade_id,
    weight_grams: data.weight_grams,
    total_price: 0, // Pending dealer pricing
    created_by: user.id
  }).select().single()

  if (error) throw error

  await logAuditEvent('request_quote', 'quotes', quote.id, { data })

  return quote
}

export async function priceQuote(quoteId: string, data: {
  price_snapshot_id: string;
  base_metal_value: number;
  spread_applied: number;
  premium_applied: number;
  total_price: number;
  validity_seconds: number;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'dealer'].includes(profile.role)) throw new Error('Forbidden')

  const expiryTimestamp = new Date(Date.now() + data.validity_seconds * 1000).toISOString()

  const { data: quote, error } = await supabase.from('quotes').update({
    status: 'sent_to_broker',
    price_snapshot_id: data.price_snapshot_id,
    base_metal_value: data.base_metal_value,
    spread_applied: data.spread_applied,
    premium_applied: data.premium_applied,
    total_price: data.total_price,
    validity_seconds: data.validity_seconds,
    expiry_timestamp: expiryTimestamp,
    approved_by: user.id
  }).eq('id', quoteId).select().single()

  if (error) throw error

  await logAuditEvent('price_quote', 'quotes', quoteId, { data })

  return quote
}

export async function acceptQuote(quoteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: quote } = await supabase.from('quotes').select('*').eq('id', quoteId).single()
  if (!quote) throw new Error('Quote not found')
  
  if (new Date(quote.expiry_timestamp) < new Date()) {
    await supabase.from('quotes').update({ status: 'expired' }).eq('id', quoteId)
    throw new Error('Quote expired')
  }

  const { data: updated, error } = await supabase.from('quotes').update({
    status: 'accepted'
  }).eq('id', quoteId).select().single()

  if (error) throw error

  // Convert to order
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    organization_id: quote.organization_id,
    broker_id: quote.broker_id,
    quote_id: quote.id,
    status: 'pending_payment',
    total_amount: quote.total_price,
    created_by: user.id
  }).select().single()

  if (orderError) throw orderError

  await logAuditEvent('accept_quote', 'quotes', quoteId, {})

  return { quote: updated, order }
}
