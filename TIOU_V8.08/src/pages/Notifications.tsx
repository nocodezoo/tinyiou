import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  link: string
  is_read: boolean
  created_at: string
}

export default function Notifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadNotifications()
    
    // Poll for new notifications every 5 seconds as backup
    const interval = setInterval(() => {
      loadNotifications()
    }, 5000)
    
    // Real-time subscription
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id.eq.${user.id}`
      }, () => {
        loadNotifications()
      })
      .subscribe()
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) {
        console.log('Notifications error:', error.message)
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
      // Ignore
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'iou_received': return '✦'
      case 'new_message': return '💬'
      case 'ripple': return '🜛'
      default: return '🔔'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500">Please sign in to see alerts</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <span className="text-orange-400">🔔</span> Alerts
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity:30">✦</div>
          <p className="text-zinc-500 text-lg">No alerts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={n.link || '/'}
                onClick={() => markAsRead(n.id)}
                className={`block p-4 rounded-2xl transition-all ${
                  n.is_read 
                    ? 'bg-zinc-900/50 border border-zinc-800' 
                    : 'bg-zinc-800 border border-orange-500/30 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${n.is_read ? 'text-zinc-400' : 'text-white'}`}>
                      {n.title}
                    </p>
                    <p className="text-zinc-500 text-sm truncate">{n.body}</p>
                    <p className="text-zinc-600 text-xs mt-1">{formatTime(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
