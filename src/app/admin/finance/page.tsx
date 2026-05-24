'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    try {
      const [invRes, payRes] = await Promise.all([
        supabase.from('invoices').select('*, brokers(name)').order('created_at', { ascending: false }).limit(20),
        supabase.from('payments').select('*, brokers(name), users_profile(first_name, last_name)').order('created_at', { ascending: false }).limit(20)
      ])
      
      setInvoices(invRes.data || [])
      setPayments(payRes.data || [])
    } catch (err) {
      toast.error('Failed to load finance data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthenticated')

      // Since we have a trigger check for confirmed_by, we must supply it
      const { error } = await supabase.from('payments')
        .update({ 
          status: 'confirmed', 
          confirmed_by: user.id, 
          confirmed_at: new Date().toISOString() 
        })
        .eq('id', paymentId)

      if (error) throw error
      toast.success('Payment successfully reconciled')
      loadFinanceData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm payment')
    }
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Finance & Treasury</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage B2B invoices, reconcile incoming payments, and track settlements.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Invoices */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-1 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Outstanding Invoices</h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : invoices.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No invoices generated yet</div>
            ) : (
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-200 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={inv.id} className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{inv.invoice_number}</td>
                      <td className="px-6 py-4">{inv.brokers?.name || 'Retail'}</td>
                      <td className="px-6 py-4 text-right font-medium text-amber-500">${Number(inv.total_amount).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {inv.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Payments Reconcile */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-1 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Payment Reconciliation</h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No payments to reconcile</div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-white/5">
                {payments.map((pay, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={pay.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-zinc-900 dark:text-white">${Number(pay.amount).toLocaleString()}</h4>
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md uppercase">{pay.payment_method}</span>
                      </div>
                      <p className="text-sm text-zinc-500">Ref: {pay.reference_number}</p>
                      <p className="text-xs text-zinc-600 mt-1">{new Date(pay.created_at).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${pay.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {pay.status.toUpperCase()}
                      </span>
                      {pay.status === 'pending' && (
                        <Button onClick={() => handleConfirmPayment(pay.id)} variant="default" size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                          Confirm Receipt
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
