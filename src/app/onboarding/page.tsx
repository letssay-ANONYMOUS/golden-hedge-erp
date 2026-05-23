'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { completeProfile } from './actions'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await completeProfile(formData)
      if (res?.error) toast.error(res.error)
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 font-sans selection:bg-amber-500/30">
      <Toaster theme="dark" position="top-center" />
      
      {/* Premium Background Blur effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="p-8 md:p-10 bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Complete your profile</h2>
            <p className="mt-2 text-sm text-zinc-400">Please provide your details to access the Golden Hedge platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
                <input
                  name="first_name"
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
                <input
                  name="last_name"
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone Number</label>
              <input
                name="phone"
                type="tel"
                required
                className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
                placeholder="+971 50 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Requested Role</label>
              <select
                name="requested_role"
                required
                className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
              >
                <option value="broker">Broker / Institutional Client</option>
                <option value="dealer">Trading Desk / Dealer</option>
                <option value="retail">Retail Customer (POS)</option>
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]"
            >
              {isLoading ? 'Saving...' : 'Complete Profile & Enter'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
