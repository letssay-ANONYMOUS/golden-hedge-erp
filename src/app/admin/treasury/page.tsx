'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function TreasuryDashboard() {
  const [exposure, setExposure] = useState<any[]>([])
  const [hedgeOrders, setHedgeOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
    
    // Subscribe to DB changes to auto-refresh exposure
    const sub = supabase.channel('treasury_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hedge_orders' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_bars' }, () => loadData())
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [])

  const loadData = async () => {
    try {
      const [expRes, ordersRes] = await Promise.all([
        supabase.from('net_exposure').select('*'),
        supabase.from('hedge_orders').select('*').order('created_at', { ascending: false }).limit(20)
      ])
      
      if (expRes.error) throw expRes.error
      if (ordersRes.error) throw ordersRes.error

      setExposure(expRes.data || [])
      setHedgeOrders(ordersRes.data || [])
    } catch (err: any) {
      toast.error('Failed to load treasury data: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualHedge = async (metalId: string, grams: number) => {
    toast.info(`Triggering manual hedge for ${grams}g ${metalId}...`)
    // In a real app, this would call a secure Server Action that invokes the brokerClient.
    // For demo purposes we insert the order directly.
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('hedge_orders').insert({
        metal_id: metalId,
        direction: 'short',
        quantity_grams: grams,
        quantity_oz: grams / 31.1035,
        trigger_price_usd: 2400, // mock spot
        status: 'pending',
        created_by: user?.id
      })
      if (error) throw error
      toast.success('Hedge order submitted to broker queue')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const getExposureColor = (netGrams: number, metalId: string) => {
    // Hardcoded thresholds for UI based on PRD config
    const threshold = metalId === 'XAU' ? 250 : 5000;
    if (netGrams >= threshold) return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    if (netGrams >= threshold * 0.8) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Treasury & Risk</h2>
        <p className="text-sm text-zinc-500 mt-1">Real-time net exposure and automated hedging engine controls.</p>
      </motion.div>
      
      {/* Net Exposure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
        ) : (
          ['XAU', 'XAG'].map((metal) => {
            const exp = exposure.find(e => e.metal_id === metal) || { physical_held_grams: 0, hedged_short_grams: 0, net_exposure_grams: 0 }
            const colorClass = getExposureColor(Number(exp.net_exposure_grams), metal)
            const threshold = metal === 'XAU' ? 250 : 5000

            return (
              <motion.div key={metal} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-3xl border ${colorClass} relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold font-mono">{metal} Net Exposure</h3>
                    <p className="text-sm opacity-80">Threshold: {threshold}g</p>
                  </div>
                  <Button 
                    onClick={() => handleManualHedge(metal, Number(exp.net_exposure_grams))}
                    disabled={Number(exp.net_exposure_grams) <= 0}
                    variant="outline" 
                    className="bg-zinc-950 border-white/10 text-white hover:bg-zinc-800"
                  >
                    Manual Hedge
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm opacity-80 mb-1">Unhedged Physical Risk (Net)</div>
                    <div className="text-5xl font-black font-mono tracking-tighter">{Number(exp.net_exposure_grams).toLocaleString()}g</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-current/20">
                    <div>
                      <div className="text-xs opacity-80">Physical Inventory</div>
                      <div className="text-lg font-bold">{Number(exp.physical_held_grams).toLocaleString()}g</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Short Hedges</div>
                      <div className="text-lg font-bold">{Number(exp.hedged_short_grams).toLocaleString()}g</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Hedge Orders Log */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-white/5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Hedging Engine Execution Log</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950/50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Metal</th>
                <th className="px-6 py-4 font-medium">Qty (g)</th>
                <th className="px-6 py-4 font-medium">Qty (oz)</th>
                <th className="px-6 py-4 font-medium">Trigger Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Broker ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {hedgeOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-zinc-500">No hedge executions found</td></tr>
              ) : (
                hedgeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-zinc-500">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{order.metal_id}</td>
                    <td className="px-6 py-4">{Number(order.quantity_grams).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono">{Number(order.quantity_oz).toFixed(2)}</td>
                    <td className="px-6 py-4">${Number(order.trigger_price_usd).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'filled' ? 'bg-emerald-500/10 text-emerald-500' :
                        order.status === 'partial_fill' ? 'bg-amber-500/10 text-amber-500' :
                        order.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.broker_order_id || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
