'use server'

import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function getAvailableProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory_bars').select('*, metal_id').eq('status', 'available')
  if (error) throw error
  return data
}

export async function processCheckout(data: {
  barIds: string[];
  subtotal: number;
  makingCharge: number;
  totalAmount: number;
  paymentMethod: string;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('organization_id').eq('id', user.id).single()
  if (!profile) throw new Error('No organization')

  // Transaction-like approach using RPC or multiple calls (Supabase JS doesn't support interactive transactions directly without RPC, 
  // so we will simulate it safely by updating status first).
  
  // 1. Lock bars
  const { error: lockError } = await supabase.from('inventory_bars')
    .update({ status: 'delivered' })
    .in('id', data.barIds)
    .eq('status', 'available')
    
  if (lockError) throw new Error('Failed to secure inventory')

  // 2. Create POS Session if none exists (placeholder for simplicity, usually one per shift)
  const { data: session } = await supabase.from('pos_sessions').insert({
    organization_id: profile.organization_id,
    cashier_id: user.id,
    status: 'open',
    opening_cash: 0
  }).select().single()

  // 3. Create POS Sale
  const { data: sale, error: saleError } = await supabase.from('pos_sales').insert({
    organization_id: profile.organization_id,
    session_id: session!.id,
    total_amount: data.totalAmount,
    tax_amount: 0,
    net_amount: data.totalAmount,
    status: 'completed',
    created_by: user.id
  }).select().single()

  if (saleError) throw saleError

  // 4. Record Payment
  await supabase.from('payments').insert({
    organization_id: profile.organization_id,
    payment_type: 'inbound',
    amount: data.totalAmount,
    currency: 'USD',
    method: data.paymentMethod,
    status: 'confirmed',
    reference_number: `POS-${sale.id}`
  })

  await logAuditEvent('pos_checkout', 'pos_sales', sale.id, data)

  return { success: true, saleId: sale.id }
}
