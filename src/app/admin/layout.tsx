import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users_profile').select('*').eq('id', user.id).single()

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-amber-600">Golden Hedge</h1>
          <p className="text-xs text-zinc-500 mt-1">{profile?.role || 'User'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Dashboard</Link>
          <Link href="/admin/quotes" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Quotes & Orders</Link>
          <Link href="/admin/inventory" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Inventory</Link>
          <Link href="/admin/brokers" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Brokers</Link>
          <Link href="/admin/finance" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Finance</Link>
          <Link href="/admin/compliance" className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">Compliance</Link>
          <Link href="/pos" className="block px-4 py-2 text-sm font-medium rounded-md text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">Launch POS</Link>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <form action="/auth/sign-out" method="post">
            <button className="w-full px-4 py-2 text-sm font-medium text-left rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600">Sign Out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
