import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export default function Admin() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ users: 0, ious: 0, ripples: 0 })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentIOUs, setRecentIOUs] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('tinyiou')

  useEffect(() => {
    if (!user || !isAdmin) return
    loadStats()
  }, [user, isAdmin])

  const loadStats = async () => {
    const [users, ious, ripples, recentU, recentI] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('ious').select('id', { count: 'exact', head: true }),
      supabase.from('ripples').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('ious').select('*, creator:creator_id(username), receiver:receiver_id(username)').order('created_at', { ascending: false }).limit(10),
    ])

    setStats({ users: users.count || 0, ious: ious.count || 0, ripples: ripples.count || 0 })
    setRecentUsers(recentU.data || [])
    setRecentIOUs(recentI.data || [])
    setLoaded(true)
  }

  if (!user) return <div className="text-center py-20">Please sign in</div>
  if (!isAdmin) return <div className="text-center py-20 card">Access Denied</div>
  if (!loaded) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Admin Panel</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center"><p className="text-3xl font-black text-orange-600">{stats.users}</p><p className="text-sm text-surface-muted">Users</p></div>
        <div className="card text-center"><p className="text-3xl font-black text-blue-600">{stats.ious}</p><p className="text-sm text-surface-muted">IOUs</p></div>
        <div className="card text-center"><p className="text-3xl font-black text-green-600">{stats.ripples}</p><p className="text-sm text-surface-muted">Ripples</p></div>
      </div>
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
        {recentUsers.map(u => <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2"><span className="font-semibold">@{u.username}</span></div>)}
      </div>
    </div>
  )
}
