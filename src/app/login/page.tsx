'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signUp } from '@/app/auth/actions'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        const res = await signIn(formData)
        if (res?.error) toast.error(res.error)
      } else {
        const res = await signUp(formData)
        if (res?.error) toast.error(res.error)
        else if (res?.success) toast.success(res.success, { duration: 10000 })
      }
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
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="p-8 md:p-10 bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 mb-4 ring-1 ring-amber-500/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Golden Hedge</h2>
            <p className="mt-2 text-sm text-zinc-400">Enterprise Bullion ERP Platform</p>
          </div>

          <div className="flex p-1 bg-zinc-950/50 rounded-lg mb-8 ring-1 ring-white/5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${!isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-3 px-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : isLogin ? 'Sign in to platform' : 'Create account'}
              </Button>
            </motion.form>
          </AnimatePresence>

          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-zinc-500 hover:text-amber-500 transition-colors">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
