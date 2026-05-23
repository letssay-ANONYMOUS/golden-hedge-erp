import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PosInterface() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950 flex-col">
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-amber-600">Golden Hedge POS</h1>
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Exit POS</Link>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h2>
             <input 
               type="text" 
               placeholder="Scan barcode or search..." 
               className="w-96 rounded-md border-0 bg-white dark:bg-zinc-800 py-2.5 px-3 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-amber-500" 
             />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-amber-500 transition-colors">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-3"></div>
              <h3 className="font-medium text-sm text-zinc-900 dark:text-white">Gold Kilobar 999.9</h3>
              <p className="text-xs text-zinc-500 mt-1">1000g</p>
            </div>
          </div>
        </div>
        
        <aside className="w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
             <h2 className="font-bold text-zinc-900 dark:text-white">Current Order</h2>
             <p className="text-xs text-zinc-500">Walk-in Customer</p>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
             <div className="text-center text-sm text-zinc-500 mt-10">Cart is empty</div>
          </div>
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
             <div className="flex justify-between mb-2 text-sm text-zinc-500">
                <span>Subtotal</span>
                <span>$0.00</span>
             </div>
             <div className="flex justify-between mb-4 text-sm text-zinc-500">
                <span>Making Charge</span>
                <span>$0.00</span>
             </div>
             <div className="flex justify-between mb-6 font-bold text-lg text-zinc-900 dark:text-white">
                <span>Total</span>
                <span>$0.00</span>
             </div>
             <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl shadow-sm">
               Pay Now
             </button>
          </div>
        </aside>
      </main>
    </div>
  )
}
