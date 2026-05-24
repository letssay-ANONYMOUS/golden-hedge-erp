'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdvancedInventoryPage() {
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadLots()
  }, [])

  const loadLots = async () => {
    try {
      // Only get lots that haven't been fully split into bars yet (assuming we can identify them)
      // For simplicity, we just fetch all bulk lots
      const { data, error } = await supabase.from('inventory_lots').select('*').order('created_at', { ascending: false }).limit(10)
      if (error) throw error
      setLots(data || [])
    } catch (err) {
      toast.error('Failed to load inventory lots')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMintBars = async (lotId: string, grossWeight: number) => {
    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthenticated')

      // Mock processing a 1kg lot into ten 100g bars
      const numBars = Math.floor(grossWeight / 100)
      if (numBars <= 0) throw new Error('Lot too small to mint standard 100g bars')

      const newBars = Array.from({ length: numBars }).map((_, i) => ({
        lot_id: lotId,
        bar_serial_number: `GH-${lotId.substring(0, 4).toUpperCase()}-${String(i+1).padStart(3, '0')}`,
        weight_grams: 100,
        status: 'available' as const
      }))

      const { error } = await supabase.from('inventory_bars').insert(newBars)
      if (error) throw error

      toast.success(`Successfully minted ${numBars} serialized bars (100g each) from lot!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to mint bars')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Advanced Inventory Ops</h2>
        <p className="text-sm text-zinc-500 mt-1">Process bulk incoming lots, assay purities, and mint serialized bars.</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Bulk Lot Barring (Minting)</h3>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
          ) : lots.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">No bulk lots available to process</div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-white/5">
              {lots.map((lot, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={lot.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white uppercase text-sm tracking-wide">{lot.lot_number}</h4>
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md font-mono">{lot.metal_id}</span>
                    </div>
                    <p className="text-sm text-zinc-400">Gross: <span className="font-medium text-white">{Number(lot.gross_weight).toLocaleString()}g</span> | Net: {Number(lot.net_weight).toLocaleString()}g</p>
                    <p className="text-xs text-zinc-600 mt-1">Received: {new Date(lot.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                      onClick={() => handleMintBars(lot.id, lot.gross_weight)} 
                      disabled={isProcessing}
                      variant="default" 
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Mint 100g Bars
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
