export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-zinc-500 mt-1">Overview of your operations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500">Sales Today</h3>
          <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">$0.00</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500">Open AML Alerts</h3>
          <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">0</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500">Pending Payments</h3>
          <p className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">$0.00</p>
        </div>
      </div>
    </div>
  )
}
