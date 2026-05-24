'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToSpotPrices } from '@/lib/services/spotPrice'

// Fixed FX rate for UAE as per standard
const FX_RATE = 3.6725
const GOLD_SPREAD = 0.02 // 2% margin
const SILVER_SPREAD = 0.05 // 5% margin

export default function PublicPriceBoard() {
  const [spotPrices, setSpotPrices] = useState<{ XAU: number; XAG: number } | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isStale, setIsStale] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToSpotPrices((prices) => {
      setSpotPrices(prices)
      setLastUpdated(new Date())
      setIsStale(false)
    })

    // Check for stale prices every 10 seconds
    const staleCheck = setInterval(() => {
      if (lastUpdated && (new Date().getTime() - lastUpdated.getTime() > 60000)) {
        setIsStale(true)
      }
    }, 10000)

    return () => {
      unsubscribe()
      clearInterval(staleCheck)
    }
  }, [lastUpdated])

  // Calculate prices based on PRD Formula: XAU * FX * (1 +/- spread) * (karat/24)
  const calculatePrice = (baseOz: number, isBuy: boolean, spread: number, fineness: number) => {
    // 1 Troy Ounce = 31.1034768 grams
    const baseGrams = baseOz / 31.1034768
    const aedGrams = baseGrams * FX_RATE
    const factor = isBuy ? (1 - spread) : (1 + spread)
    return aedGrams * factor * fineness
  }

  if (!spotPrices) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full" />
      </div>
    )
  }

  const products = [
    { name: 'Gold 24K', buy: calculatePrice(spotPrices.XAU, true, GOLD_SPREAD, 1), sell: calculatePrice(spotPrices.XAU, false, GOLD_SPREAD, 1), unit: 'AED/g' },
    { name: 'Gold 22K', buy: calculatePrice(spotPrices.XAU, true, GOLD_SPREAD, 22/24), sell: calculatePrice(spotPrices.XAU, false, GOLD_SPREAD, 22/24), unit: 'AED/g' },
    { name: 'Gold 18K', buy: calculatePrice(spotPrices.XAU, true, GOLD_SPREAD, 18/24), sell: calculatePrice(spotPrices.XAU, false, GOLD_SPREAD, 18/24), unit: 'AED/g' },
    { name: 'Silver 999', buy: calculatePrice(spotPrices.XAG, true, SILVER_SPREAD, 0.999), sell: calculatePrice(spotPrices.XAG, false, SILVER_SPREAD, 0.999), unit: 'AED/g' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md z-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-amber-500">Golden Hedge</h1>
          <p className="text-zinc-400 mt-1 uppercase tracking-widest text-sm font-semibold">Live Market Exchange</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${isStale ? 'text-rose-500' : 'text-emerald-500'}`}>
              {isStale ? 'CONNECTION LOST' : 'LIVE FEED'}
            </span>
            <motion.div 
              animate={{ opacity: isStale ? 1 : [1, 0.2, 1] }} 
              transition={{ repeat: Infinity, duration: isStale ? 0 : 1 }} 
              className={`w-3 h-3 rounded-full ${isStale ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]'}`} 
            />
          </div>
          <span className="text-zinc-500 text-sm mt-1">
            Last Updated: {lastUpdated?.toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 p-8 grid grid-cols-1 gap-6 content-center max-w-7xl mx-auto w-full">
        
        {/* Table Headers */}
        <div className="grid grid-cols-3 px-8 pb-4 text-zinc-500 font-bold uppercase tracking-widest text-lg border-b border-white/5">
          <div>Product</div>
          <div className="text-right text-emerald-500/80">We Buy</div>
          <div className="text-right text-rose-500/80">We Sell</div>
        </div>

        {/* Rows */}
        <div className="space-y-4">
          <AnimatePresence>
            {products.map((p, i) => (
              <motion.div 
                key={p.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-3 bg-zinc-900/40 border border-white/5 p-8 rounded-3xl items-center hover:bg-zinc-800/40 transition-colors"
              >
                <div className="text-5xl font-bold tracking-tight text-zinc-100">{p.name}</div>
                <div className="text-right">
                  <motion.div 
                    key={p.buy} 
                    initial={{ scale: 1.1, color: '#10b981' }} 
                    animate={{ scale: 1, color: '#ffffff' }} 
                    className="text-6xl font-black font-mono tracking-tighter"
                  >
                    {p.buy.toFixed(2)}
                  </motion.div>
                  <div className="text-zinc-500 font-bold tracking-widest uppercase mt-2">{p.unit}</div>
                </div>
                <div className="text-right">
                  <motion.div 
                    key={p.sell} 
                    initial={{ scale: 1.1, color: '#f43f5e' }} 
                    animate={{ scale: 1, color: '#ffffff' }} 
                    className="text-6xl font-black font-mono tracking-tighter"
                  >
                    {p.sell.toFixed(2)}
                  </motion.div>
                  <div className="text-zinc-500 font-bold tracking-widest uppercase mt-2">{p.unit}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>

      {/* Footer Ticker */}
      <footer className="bg-zinc-900 border-t border-white/10 py-4 px-8 flex justify-between text-zinc-500 font-mono text-sm">
        <div>FX BASE: USD/AED {FX_RATE.toFixed(4)}</div>
        <div className="flex gap-8">
          <div>SPOT XAU: <span className="text-white">${spotPrices.XAU.toFixed(2)}</span></div>
          <div>SPOT XAG: <span className="text-white">${spotPrices.XAG.toFixed(2)}</span></div>
        </div>
      </footer>
    </div>
  )
}
