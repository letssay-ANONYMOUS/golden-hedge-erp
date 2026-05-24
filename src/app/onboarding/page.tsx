'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { completeProfile } from './actions'
import { simulateKycWebhook } from '@/lib/services/mockKyc'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [applicantId, setApplicantId] = useState<string | null>(null)
  const [kycStatus, setKycStatus] = useState<'idle' | 'verifying' | 'approved'>('idle')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await completeProfile(formData)
      if (res?.error) {
        toast.error(res.error)
      } else if (res?.applicantId) {
        setApplicantId(res.applicantId)
        toast.success('Profile saved. Initiating KYC verification...')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulateKyc = async () => {
    if (!applicantId) return
    setKycStatus('verifying')
    try {
      // Simulate taking 3 seconds to verify
      await new Promise(resolve => setTimeout(resolve, 3000))
      await simulateKycWebhook(applicantId, 'completed')
      setKycStatus('approved')
      toast.success('KYC Approved!')
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (err) {
      toast.error('KYC Failed')
      setKycStatus('idle')
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 font-sans selection:bg-amber-500/30">
      <Toaster theme="dark" position="top-center" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="p-8 md:p-10 bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {!applicantId ? (
              <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Complete your profile</h2>
                  <p className="mt-2 text-sm text-zinc-400">Please provide your details to access the Golden Hedge platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
                      <input name="first_name" type="text" required className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
                      <input name="last_name" type="text" required className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone Number</label>
                    <input name="phone" type="tel" required className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm" placeholder="+971 50 123 4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Requested Role</label>
                    <select name="requested_role" required className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm">
                      <option value="broker">Broker / Institutional Client</option>
                      <option value="dealer">Trading Desk / Dealer</option>
                      <option value="retail">Retail Customer (POS)</option>
                    </select>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                    {isLoading ? 'Saving...' : 'Continue to Verification'}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="kyc" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-8">
                {kycStatus === 'approved' ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Identity Verified</h2>
                    <p className="text-zinc-400">Redirecting to command center...</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 border border-blue-500/20">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verify your identity</h2>
                    <p className="text-zinc-400 mb-8 max-w-sm">To comply with global regulations, we require identity verification before trading.</p>
                    
                    <Button 
                      onClick={handleSimulateKyc} 
                      disabled={kycStatus === 'verifying'} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                      {kycStatus === 'verifying' ? (
                        <div className="flex items-center gap-2">
                           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                           Verifying with Provider...
                        </div>
                      ) : 'Launch KYC Provider (Mock)'}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
