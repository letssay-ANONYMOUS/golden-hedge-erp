'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()

  // Ensure user is authorized
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: business } = await supabase.from('business_dashboard').select('*').single()
  const { data: inventory } = await supabase.from('inventory_dashboard').select('*')
  const { data: compliance } = await supabase.from('compliance_dashboard').select('*').single()

  // Generate some mock chart data for the last 7 days since we don't have historical view set up for time-series yet
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: Math.floor(Math.random() * 50000) + 10000,
      purchases: Math.floor(Math.random() * 30000) + 5000,
    }
  })

  return {
    business: business || { sales_today: 0, sales_this_month: 0, pending_payment_amount: 0 },
    inventory: inventory || [],
    compliance: compliance || { open_aml_alerts: 0, open_compliance_cases: 0, active_holds: 0 },
    chartData
  }
}
