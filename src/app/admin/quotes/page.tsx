'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { requestQuote, priceQuote, acceptQuote } from '@/lib/services/quotes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isActioning, setIsActioning] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadQuotes()
    checkRole()
  }, [])

  const checkRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('users_profile').select('role').eq('id', user.id).single()
      if (profile) setRole(profile.role)
    }
  }

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase.from('quotes').select('*, brokers(name)').order('created_at', { ascending: false })
      if (error) throw error
      setQuotes(data || [])
    } catch (err) {
      toast.error('Failed to load quotes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsActioning(true)
    const formData = new FormData(e.currentTarget)
    try {
      await requestQuote({
        metal_id: formData.get('metal_id') as string,
        purity_grade_id: '999.9',
        weight_grams: Number(formData.get('weight'))
      })
      toast.success('Quote requested')
      loadQuotes()
      e.currentTarget.reset()
    } catch (err: any) {
      toast.error(err.message || 'Failed to request quote')
    } finally {
      setIsActioning(false)
    }
  }

  const handlePriceQuote = async (quoteId: string, weight: number) => {
    setIsActioning(true)
    try {
      // Simulate dealer pricing algorithm
      const baseValue = weight * 70 // $70/g
      const premium = 50 // flat premium
      const total = baseValue + premium

      await priceQuote(quoteId, {
        price_snapshot_id: '11111111-1111-1111-1111-111111111111', // seed
        base_metal_value: baseValue,
        spread_applied: 0,
        premium_applied: premium,
        total_price: total,
        validity_seconds: 300 // 5 mins
      })
      toast.success('Price locked and sent to broker')
      loadQuotes()
    } catch (err: any) {
      toast.error(err.message || 'Failed to price quote')
    } finally {
      setIsActioning(false)
    }
  }

  const handleAcceptQuote = async (quoteId: string) => {
    setIsActioning(true)
    try {
      await acceptQuote(quoteId)
      toast.success('Quote accepted! Order generated.')
      loadQuotes()
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept quote')
    } finally {
      setIsActioning(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Trading Desk</h2>
        <p className="text-sm text-zinc-500 mt-1">Request, price, and execute bullion quotes.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BROKER: Request Quote Form */}
        {(role === 'broker' || role === 'super_admin') && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="col-span-1 bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm h-fit"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Request Quote</h3>
            <form onSubmit={handleRequestQuote} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Asset</label>
                <select name="metal_id" required className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950/50 py-3 px-4 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-amber-500">
                  <option value="XAU">Gold (XAU)</option>
                  <option value="XAG">Silver (XAG)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Size (grams)</label>
                <input name="weight" type="number" required min="1" step="1" className="block w-full rounded-xl border-0 bg-zinc-50 dark:bg-zinc-950/50 py-3 px-4 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-amber-500" placeholder="1000" />
              </div>
              <Button type="submit" disabled={isActioning} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {isActioning ? 'Processing...' : 'Request Price Lock'}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Live Quotes Board */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-2 space-y-4"
        >
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Active Quotes</h3>
          
          {isLoading ? (
             <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
          ) : quotes.length === 0 ? (
             <div className="bg-white dark:bg-zinc-900/50 p-12 rounded-3xl border border-zinc-200 dark:border-white/5 text-center text-zinc-500">No active quotes</div>
          ) : (
            <AnimatePresence>
              {quotes.map((quote, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                  key={quote.id} 
                  className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold text-zinc-900 dark:text-white">{quote.metal_id}</span>
                      <span className="font-semibold text-zinc-900 dark:text-white">{quote.weight_grams}g</span>
                    </div>
                    <p className="text-sm text-zinc-500">Broker: <span className="text-zinc-400">{quote.brokers?.name || 'Unknown'}</span></p>
                    <p className="text-xs text-zinc-600 mt-1">ID: {quote.id.substring(0,8)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'requested' ? 'bg-blue-500/10 text-blue-500' : 
                      quote.status === 'sent_to_broker' ? 'bg-amber-500/10 text-amber-500' :
                      quote.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {quote.status.toUpperCase()}
                    </span>
                    
                    {quote.total_price > 0 && (
                      <div className="text-2xl font-bold text-zinc-900 dark:text-white">${Number(quote.total_price).toLocaleString()}</div>
                    )}

                    <div className="flex gap-2 w-full sm:w-auto mt-2">
                      {(role === 'dealer' || role === 'super_admin') && quote.status === 'requested' && (
                        <Button disabled={isActioning} onClick={() => handlePriceQuote(quote.id, quote.weight_grams)} className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-lg">
                          Set Price
                        </Button>
                      )}
                      
                      {(role === 'broker' || role === 'super_admin') && quote.status === 'sent_to_broker' && (
                        <Button disabled={isActioning} onClick={() => handleAcceptQuote(quote.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                          Accept Quote
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}
