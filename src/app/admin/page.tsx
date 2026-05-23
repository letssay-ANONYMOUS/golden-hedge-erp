'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { getDashboardMetrics } from '@/lib/services/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getDashboardMetrics().then(setData).catch(console.error)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Command Center</h2>
        <p className="text-sm text-zinc-500 mt-1">Real-time overview of hedge fund operations.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Sales Today', value: `$${Number(data.business.sales_today).toLocaleString()}`, color: 'bg-emerald-500/10 text-emerald-500' },
          { title: 'Sales This Month', value: `$${Number(data.business.sales_this_month).toLocaleString()}`, color: 'bg-amber-500/10 text-amber-500' },
          { title: 'Pending Payments', value: `$${Number(data.business.pending_payment_amount).toLocaleString()}`, color: 'bg-blue-500/10 text-blue-500' },
          { title: 'Active AML Holds', value: data.compliance.active_holds, color: 'bg-rose-500/10 text-rose-500' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-white/5 overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl ${stat.color} opacity-20`} />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="col-span-2 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#d97706' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Inventory Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.inventory.map((inv: any) => (
                <div key={inv.metal_id} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">{inv.metal_id}</span>
                    <span className="text-amber-500">{inv.total_available_grams}g</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, (inv.total_available_grams / 50000) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
