import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Notification } from '../types'
import { motion } from 'framer-motion'
import { Bell, AlertCircle } from 'lucide-react'

export default function Notifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    try {
      const { data, error: err } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (err) {
        // Table might not exist, show empty state
        console.log('Notifications table not available:', err.message)
        setNotifications([])
      } else {
        setNotifications(data || [])
      }
    } catch (e) {
      setNotifications([])
    }
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      loadNotifications()
    } catch (e) {
      // Ignore errors
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-8">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign in required</h2>
          <p className="text-zinc-500">Please sign in to view notifications</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center gap-3 py-8"
      >
        <Bell className="w-8 h-8 text-orange-500" />
        <h1 className="font-display font-black text-3xl">Notifications</h1>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[#2a2a2d] rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[#2a2a2d] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-8 text-center">
          <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No notifications yet</p>
          <p className="text-zinc-600 text-sm mt-2">When someone sends you an IOU, you'll see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`bg-[#1c1c1f] border rounded-xl p-4 cursor-pointer transition-colors ${
                n.is_read ? 'border-[#2a2a2d]' : 'border-orange-500/30 hover:border-orange-500'
              }`}
            >
              <p className="text-white">{n.message || 'New notification'}</p>
              <p className="text-zinc-500 text-sm mt-1">
                {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recently'}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
