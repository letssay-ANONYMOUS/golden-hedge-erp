'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAvailableProducts, processCheckout } from '@/lib/services/pos'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

export default function PosInterface() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showReceipt, setShowReceipt] = useState<any>(null)

  useEffect(() => {
    getAvailableProducts()
      .then(setProducts)
      .catch((err) => toast.error('Failed to load products'))
      .finally(() => setIsLoading(false))
  }, [])

  const addToCart = (product: any) => {
    if (cart.find(item => item.id === product.id)) {
      toast.error('Item already in cart')
      return
    }
    // Calculate base price dynamically
    const basePrice = product.metal_id === 'XAU' ? product.weight_grams * 70 : product.weight_grams * 1
    setCart([...cart, { ...product, customPrice: basePrice, basePrice }])
  }

  const updateCustomPrice = (id: string, newPrice: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, customPrice: newPrice } : item))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  // Simplified pricing: Assume base price of $70/g for Gold and $1/g for Silver (in reality this comes from live_prices)
  const calculatePrice = (product: any) => {
    const rate = product.metal_id === 'XAU' ? 70 : 1
    return product.weight_grams * rate
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.customPrice), 0)
  const makingCharge = cart.length * 50 // $50 flat making charge per bar
  const total = subtotal + makingCharge

  const handleCheckout = async () => {
    if (cart.length === 0) return

    // PRD Section 3.3 & 3.1: Validate negotiation bounds (Max 3% Gold, Max 10% Silver)
    for (const item of cart) {
      const discount = 1 - (item.customPrice / item.basePrice)
      if (item.metal_id === 'XAU' && discount > 0.03) {
        toast.error(`Gold discount exceeds 3% bound on bar ${item.bar_serial_number || item.id.substring(0,6)}! Manager override required.`)
        return
      }
      if (item.metal_id === 'XAG' && discount > 0.10) {
        toast.error(`Silver discount exceeds 10% bound on bar ${item.bar_serial_number || item.id.substring(0,6)}! Manager override required.`)
        return
      }
    }

    setIsProcessing(true)
    try {
      await processCheckout({
        barIds: cart.map(c => c.id),
        subtotal,
        makingCharge,
        totalAmount: total,
        paymentMethod: 'credit_card'
      })
      toast.success('Checkout successful!')
      
      // Setup receipt data
      setShowReceipt({
        id: `BR01-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(6, '0')}`,
        date: new Date().toLocaleString(),
        items: cart,
        subtotal,
        makingCharge,
        total
      })
      
      setCart([])
      // Refresh products
      const newProducts = await getAvailableProducts()
      setProducts(newProducts)
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 flex-col font-sans">
      <Toaster theme="dark" position="top-center" />
      
      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black p-8 w-full max-w-md rounded-none shadow-2xl font-mono">
            <div className="text-center border-b-2 border-black pb-4 mb-4">
              <h2 className="text-2xl font-black">GOLDEN HEDGE</h2>
              <p className="text-xs uppercase">Dubai HQ - Branch 01</p>
              <p className="text-xs uppercase mt-2">TRN: 100293948500003</p>
            </div>
            <div className="text-sm mb-6">
              <div className="flex justify-between"><span>Inv:</span><span>{showReceipt.id}</span></div>
              <div className="flex justify-between"><span>Date:</span><span>{showReceipt.date}</span></div>
            </div>
            <div className="space-y-3 border-b border-dashed border-zinc-400 pb-4 mb-4">
              {showReceipt.items.map((item: any, i: number) => (
                <div key={i} className="text-sm flex justify-between">
                  <span>{item.weight_grams}g {item.metal_id} Bar</span>
                  <span>${Number(item.customPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="text-sm space-y-1 mb-6">
              <div className="flex justify-between"><span>Subtotal:</span><span>${showReceipt.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Making Charge:</span><span>${showReceipt.makingCharge.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total:</span><span>${showReceipt.total.toFixed(2)}</span></div>
            </div>
            <div className="text-center text-xs text-zinc-500 uppercase mt-8 pt-4 border-t border-dashed border-zinc-400">
              <p>Thank you for your business.</p>
              <p>Returns accepted within 24 hours only.</p>
            </div>
            <div className="mt-8 flex gap-4 print:hidden">
              <Button variant="outline" className="w-full text-black border-black hover:bg-zinc-100" onClick={() => setShowReceipt(null)}>Close</Button>
              <Button className="w-full bg-black text-white hover:bg-zinc-800" onClick={() => window.print()}>Print Receipt</Button>
            </div>
          </motion.div>
        </div>
      )}

      <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold">GH</div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Terminal</h1>
        </div>
        <Link href="/admin" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Exit POS</Link>
      </header>
      
      <main className="flex-1 flex overflow-hidden print:hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Available Inventory</h2>
             <input 
               type="text" 
               placeholder="Scan barcode or search..." 
               className="w-96 rounded-xl border-0 bg-white dark:bg-zinc-900 py-3 px-4 shadow-sm text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-200 dark:ring-white/5 focus:ring-2 focus:ring-amber-500 transition-shadow" 
             />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
                >
                  <div className="aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                    {product.metal_id === 'XAU' ? '🪙' : '⚪'}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{product.metal_id} Bar</h3>
                  <p className="text-sm text-zinc-500 mt-1">{product.weight_grams}g • SN: {product.serial_number?.substring(0,8) || product.id.substring(0,6)}</p>
                  <div className="mt-4 text-lg font-bold text-amber-600">${(product.metal_id === 'XAU' ? product.weight_grams * 70 : product.weight_grams * 1).toLocaleString()}</div>
                </motion.div>
              ))}
              {products.length === 0 && <div className="col-span-full text-center text-zinc-500 py-12">No available inventory.</div>}
            </motion.div>
          )}
        </div>
        
        <aside className="w-[400px] bg-white dark:bg-zinc-900/80 backdrop-blur-xl border-l border-zinc-200 dark:border-white/5 flex flex-col shadow-2xl z-20">
          <div className="p-6 border-b border-zinc-200 dark:border-white/5">
             <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Current Order</h2>
             <p className="text-sm text-amber-600 mt-1">Walk-in Retail</p>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
             <AnimatePresence>
               {cart.map(item => (
                 <motion.div 
                   key={item.id}
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="flex justify-between items-center mb-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-white/5"
                 >
                   <div className="flex-1 mr-4">
                     <h4 className="font-medium text-sm text-zinc-900 dark:text-white">{item.metal_id} {item.weight_grams}g</h4>
                     <p className="text-xs text-zinc-500 mt-0.5 mb-2">Base: ${item.basePrice.toLocaleString()}</p>
                     <div className="flex items-center gap-2">
                       <span className="text-xs text-zinc-500">$</span>
                       <input 
                         type="number" 
                         value={item.customPrice} 
                         onChange={(e) => updateCustomPrice(item.id, Number(e.target.value))}
                         className="w-full max-w-[100px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-sm text-zinc-900 dark:text-white"
                       />
                     </div>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-400 p-2 rounded-md hover:bg-rose-500/10 transition-colors">
                     ✕
                   </button>
                 </motion.div>
               ))}
             </AnimatePresence>
             {cart.length === 0 && <div className="text-center text-sm text-zinc-500 mt-20">Scan items to add to cart</div>}
          </div>
          <div className="p-6 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950">
             <div className="flex justify-between mb-3 text-sm text-zinc-500">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900 dark:text-white">${subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between mb-6 text-sm text-zinc-500">
                <span>Making Charge</span>
                <span className="font-medium text-zinc-900 dark:text-white">${makingCharge.toLocaleString()}</span>
             </div>
             <div className="flex justify-between mb-6 font-bold text-2xl text-zinc-900 dark:text-white">
                <span>Total</span>
                <span className="text-amber-500">${total.toLocaleString()}</span>
             </div>
             <button 
               onClick={handleCheckout}
               disabled={cart.length === 0 || isProcessing}
               className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all hover:shadow-[0_0_30px_rgba(217,119,6,0.4)]"
             >
               {isProcessing ? 'Processing...' : 'Pay Now'}
             </button>
          </div>
        </aside>
      </main>
    </div>
  )
}
