import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

interface Connection {
  username: string
  avatar_url: string | null
  type: 'given' | 'received' | 'both'
  count: number
}

interface MindMapProps {
  profileId: string
  currentUsername: string
}

export default function MindMap({ profileId, currentUsername }: MindMapProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConnections()
  }, [profileId])

  const loadConnections = async () => {
    try {
      const { data: given } = await supabase
        .from('ious')
        .select('*, receiver:receiver_id(username, avatar_url)')
        .eq('creator_id', profileId)
        .limit(50)

      const { data: received } = await supabase
        .from('ious')
        .select('*, creator:creator_id(username, avatar_url)')
        .eq('receiver_id', profileId)
        .limit(50)

      const connMap = new Map<string, Connection>()

      ;(given || []).forEach(iou => {
        if (iou.receiver && iou.receiver.username !== currentUsername) {
          const existing = connMap.get(iou.receiver.username)
          if (existing) {
            existing.count += 1
            if (existing.type === 'received') existing.type = 'both'
          } else {
            connMap.set(iou.receiver.username, {
              username: iou.receiver.username,
              avatar_url: iou.receiver.avatar_url,
              type: 'given',
              count: 1
            })
          }
        }
      })

      ;(received || []).forEach(iou => {
        if (iou.creator && iou.creator.username !== currentUsername) {
          const existing = connMap.get(iou.creator.username)
          if (existing) {
            existing.count += 1
            if (existing.type === 'given') existing.type = 'both'
          } else {
            connMap.set(iou.creator.username, {
              username: iou.creator.username,
              avatar_url: iou.creator.avatar_url,
              type: 'received',
              count: 1
            })
          }
        }
      })

      const connArray = Array.from(connMap.values()).slice(0, 12)
      setConnections(connArray)
    } catch (e) {
      console.error('Error loading connections:', e)
    } finally {
      setLoading(false)
    }
  }

  const getNodeColor = (type: Connection['type']) => {
    switch (type) {
      case 'both': return 'from-green-400 to-emerald-500'
      case 'given': return 'from-orange-400 to-red-500'
      case 'received': return 'from-blue-400 to-purple-500'
    }
  }

  const getNodeGlow = (type: Connection['type']) => {
    switch (type) {
      case 'both': return 'shadow-[0_0_20px_rgba(74,222,128,0.8)]'
      case 'given': return 'shadow-[0_0_20px_rgba(251,146,60,0.8)]'
      case 'received': return 'shadow-[0_0_20px_rgba(96,165,250,0.8)]'
    }
  }

  const getGradient = (type: Connection['type']) => {
    switch (type) {
      case 'both': return 'linear-gradient(90deg, transparent, #4ade80, #10b981, transparent)'
      case 'given': return 'linear-gradient(90deg, transparent, #fb923c, #f97316, transparent)'
      case 'received': return 'linear-gradient(90deg, transparent, #60a5fa, #3b82f6, transparent)'
    }
  }

  // Smaller node sizes
  const getNodeSize = (count: number) => {
    const base = 36
    const max = 52
    return Math.min(base + count * 2, max)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-16 card-luxury">
        <div className="text-4xl mb-4 text-zinc-600">◇</div>
        <p className="text-zinc-500">No connections yet</p>
        <p className="text-zinc-600 text-sm mt-2">Give some IOUs to see your network!</p>
      </div>
    )
  }

  // Smaller container dimensions
  const containerWidth = 520
  const containerHeight = 280
  const centerX = 260 // half of containerWidth
  const centerY = 140 // half of containerHeight
  const orbitRadius = 100 // smaller orbit

  return (
    <div 
      className="relative mx-auto card-luxury overflow-visible"
      style={{ width: '100%', maxWidth: 560, height: 280 }}
    >
      {/* CSS for glowing lines */}
      <style>{`
        .connection-line {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 2px;
          transform-origin: left center;
          animation: line-pulse 2s ease-in-out infinite;
        }
        @keyframes line-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Connection Lines */}
      {connections.map((conn, i) => {
        const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2
        const nodeSize = getNodeSize(conn.count)
        
        // Smaller line calculation
        const lineLength = Math.sqrt(
          Math.pow(orbitRadius * Math.cos(angle), 2) + 
          Math.pow(orbitRadius * Math.sin(angle), 2)
        ) - nodeSize / 2
        
        const rotation = angle * 180 / Math.PI
        
        return (
          <div
            key={`line-${conn.username}`}
            className="connection-line absolute"
            style={{
              width: `${lineLength}px`,
              background: getGradient(conn.type),
              transform: `rotate(${rotation}deg)`,
              left: centerX,
              top: centerY,
            }}
          />
        )
      })}

      {/* Central Node - smaller */}
      <div 
        className="absolute z-30"
        style={{ 
          left: centerX, 
          top: centerY, 
          transform: 'translate(-50%, -50%)' 
        }}
      >
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-[0_0_25px_rgba(249,115,22,0.8)] ring-3 ring-orange-500/60"
          style={{ width: 48, height: 48 }}
        >
          {currentUsername[0].toUpperCase()}
        </motion.div>
      </div>

      {/* Connection Nodes - smaller */}
      {connections.map((conn, i) => {
        const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2
        const x = centerX + orbitRadius * Math.cos(angle)
        const y = centerY + orbitRadius * Math.sin(angle)
        const nodeSize = getNodeSize(conn.count)
        
        return (
          <motion.div
            key={conn.username}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            className="absolute z-20"
            style={{
              left: x - nodeSize / 2,
              top: y - nodeSize / 2,
            }}
          >
            <Link
              to={`/profile/${conn.username}`}
              className={`block rounded-full bg-gradient-to-br ${getNodeColor(conn.type)} p-0.5 transition-all cursor-pointer ${getNodeGlow(conn.type)} hover:scale-125`}
              style={{ width: nodeSize, height: nodeSize }}
              title={`@${conn.username} (${conn.count} IOUs)`}
            >
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                {conn.avatar_url ? (
                  <img src={conn.avatar_url} alt={conn.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-[10px]">{conn.username[0].toUpperCase()}</span>
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
