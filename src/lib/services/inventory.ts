'use server'

import { createClient } from '@/lib/supabase/server'
import { logAuditEvent } from './audit'

export async function receiveInventoryLot(data: {
  supplier_id: string;
  metal_id: string;
  purity_grade_id: string;
  gross_weight_grams: number;
  net_weight_grams: number;
  vault_location_id: string;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('users_profile').select('organization_id, role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'admin', 'inventory_manager'].includes(profile.role)) {
    throw new Error('Forbidden')
  }

  // Insert Lot
  const { data: lot, error } = await supabase.from('inventory_lots').insert({
    organization_id: profile.organization_id,
    supplier_id: data.supplier_id,
    metal_id: data.metal_id,
    purity_grade_id: data.purity_grade_id,
    gross_weight_grams: data.gross_weight_grams,
    net_weight_grams: data.net_weight_grams,
    received_date: new Date().toISOString().split('T')[0],
    vault_location_id: data.vault_location_id,
    status: 'available'
  }).select().single()

  if (error) throw error

  // Log movement
  await supabase.from('inventory_movements').insert({
    organization_id: profile.organization_id,
    inventory_type: 'lot',
    lot_id: lot.id,
    movement_type: 'received',
    quantity: data.net_weight_grams,
    destination_location_id: data.vault_location_id,
    moved_by: user.id
  })

  await logAuditEvent('receive_lot', 'inventory_lots', lot.id, { data })

  return lot
}

export async function getInventoryLots() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory_lots').select(`*, suppliers(name), vault_locations(name, vaults(name))`)
  if (error) throw error
  return data
}
