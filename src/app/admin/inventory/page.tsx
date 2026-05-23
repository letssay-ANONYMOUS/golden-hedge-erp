'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { getInventoryLots, receiveInventoryLot } from '@/lib/services/inventory'
import { Button } from '@/components/ui/button'

export default function InventoryPage() {
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    loadLots()
  }, [])

  const loadLots = async () => {
    try {
      const data = await getInventoryLots()
      setLots(data)
    } catch (err) {
      toast.error('Failed to load inventory')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    const formData = new FormData(e.currentTarget)
    try {
      await receiveInventoryLot({
        supplier_id: '11111111-1111-1111-1111-111111111111', // Assuming seed supplier exists
        metal_id: formData.get('metal_id') as string,
        purity_grade_id: formData.get('metal_id') === 'XAU' ? '999.9' : '999.0',
        gross_weight_grams: Number(formData.get('weight')),
        net_weight_grams: Number(formData.get('weight')),
        vault_location_id: '11111111-1111-1111-1111-111111111111' // Assuming seed vault location
      })
      toast.success('Lot received successfully')
      loadLots()
      e.currentTarget.reset()
    } catch (err: any) {
      toast.error(err.message || 'Failed to receive lot')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Vault Inventory</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage inbound lots and serialized bars.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-1 bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm"
        >
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Receive New Lot</h3>
          <form onSubmit={handleAddLot} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Metal Type</label>
              <select name="metal_id" required className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950/50 py-3 px-4 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-amber-500">
                <option value="XAU">Gold (XAU)</option>
                <option value="XAG">Silver (XAG)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Net Weight (grams)</label>
              <input name="weight" type="number" required min="1" step="0.01" className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950/50 py-3 px-4 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-amber-500" placeholder="1000" />
            </div>
            <Button type="submit" disabled={isAdding} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]">
              {isAdding ? 'Processing...' : 'Register Lot into Vault'}
            </Button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-2 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Vault Receipts</h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : lots.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No lots in inventory</div>
            ) : (
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-200 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4">Lot ID</th>
                    <th className="px-6 py-4">Metal</th>
                    <th className="px-6 py-4">Purity</th>
                    <th className="px-6 py-4 text-right">Net Weight</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={lot.id} className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{lot.id.substring(0,8)}...</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold text-zinc-900 dark:text-white">{lot.metal_id}</span></td>
                      <td className="px-6 py-4">{lot.purity_grade_id}</td>
                      <td className="px-6 py-4 text-right font-medium text-amber-500">{lot.net_weight_grams}g</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${lot.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {lot.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
