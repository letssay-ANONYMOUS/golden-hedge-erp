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

  // Fetch last 7 days of sales for chart
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: recentSales } = await supabase
    .from('pos_sales')
    .select('created_at, total_amount')
    .gte('created_at', sevenDaysAgo.toISOString())

  // Aggregate sales by date
  const salesByDate: Record<string, number> = {}
  if (recentSales) {
    recentSales.forEach(sale => {
      if (!sale.created_at) return;
      const dateStr = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' })
      salesByDate[dateStr] = (salesByDate[dateStr] || 0) + Number(sale.total_amount)
    })
  }

  // Create 7 day array, filling 0s if no sales
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' })
    return {
      date: dateStr,
      sales: salesByDate[dateStr] || 0,
    }
  })

  return {
    business: business || { sales_today: 0, sales_this_month: 0, pending_payment_amount: 0 },
    inventory: inventory || [],
    compliance: compliance || { open_aml_alerts: 0, open_compliance_cases: 0, active_holds: 0 },
    chartData
  }
}
