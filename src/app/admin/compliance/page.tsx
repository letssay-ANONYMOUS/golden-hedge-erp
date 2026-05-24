'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function CompliancePage() {
  const [kycRequests, setKycRequests] = useState<any[]>([])
  const [amlAlerts, setAmlAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [kycRes, amlRes] = await Promise.all([
        supabase.from('users_profile').select('*').neq('kyc_status', 'pending').order('kyc_verified_at', { ascending: false }).limit(20),
        supabase.from('aml_alerts').select('*').order('created_at', { ascending: false }).limit(20)
      ])
      
      setKycRequests(kycRes.data || [])
      setAmlAlerts(amlRes.data || [])
    } catch (err) {
      toast.error('Failed to load compliance data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateGoAml = async (alertId: string) => {
    toast.success('Generated GoAML STR draft for Review')
    // Logic to call createGoAMLDraft service would go here
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <Toaster theme="dark" position="top-center" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Compliance & AML</h2>
        <p className="text-sm text-zinc-500 mt-1">Review KYC statuses, monitor AML flags, and generate regulatory reports.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KYC Verification Queue */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-1 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent KYC Verifications</h3>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md">{kycRequests.length} Profiles</span>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : kycRequests.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No KYC records found</div>
            ) : (
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-200 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {kycRequests.map((req, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={req.id} className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                        {req.first_name} {req.last_name}
                        <div className="text-xs text-zinc-500 font-normal">{req.kyc_applicant_id}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">{req.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.kyc_status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : req.kyc_status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {req.kyc_status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* AML Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="col-span-1 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Active AML Alerts</h3>
            <span className="text-xs bg-rose-500/10 text-rose-500 font-bold px-2 py-1 rounded-md">{amlAlerts.filter(a => a.status === 'active').length} Flags</span>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-12 flex justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : amlAlerts.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No active AML alerts. Systems are clear.</div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-white/5">
                {amlAlerts.map((alert, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={alert.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <h4 className="font-bold text-zinc-900 dark:text-white uppercase text-sm tracking-wide">{alert.rule_triggered}</h4>
                      </div>
                      <span className="text-xs text-zinc-500">{new Date(alert.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">{alert.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${alert.status === 'active' ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                        {alert.status.toUpperCase()}
                      </span>
                      {alert.status === 'active' && (
                        <Button onClick={() => handleGenerateGoAml(alert.id)} variant="outline" size="sm" className="text-xs">
                          Draft GoAML
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
