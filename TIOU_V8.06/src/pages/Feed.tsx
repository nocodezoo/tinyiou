import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { IOU, Profile, Taxonomy } from '../types'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Repeat, Sparkles } from 'lucide-react'

export default function Feed() {
  const { user } = useAuthStore()
  const [ious, setIous] = useState<any[]>([])
  const [taggedIous, setTaggedIous] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"my" | "tagged">("my")

  useEffect(() => {
    if (user) {
      loadIOUs()
      loadTaggedIOUs()
    }
  }, [user])

  const loadIOUs = async () => {
    try {
      const { data } = await supabase
        .from('ious')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setIous(data || [])
    } catch (error) {
      console.error('Error loading IOUs:', error)
      setIous([])
    }
    setLoading(false)
  }

  const loadTaggedIOUs = async () => {
    try {
      // Get IOUs where user is mentioned in the body
      const { data } = await supabase
        .from('ious')
        .select('*, profiles(username, full_name, avatar_url)')
        .ilike('body', `%@${user?.username}%`)
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Also get IOUs where user is in the tags
      const { data: taggedData } = await supabase
        .from('iou_tags')
        .select('iou_id, ious(*, profiles(username, full_name, avatar_url))')
        .eq('profile_id', user.id)
      
      // Combine and dedupe
      const tagged = (data || []).filter(i => i.user_id !== user.id)
      
      // Add from iou_tags
      if (taggedData) {
        taggedData.forEach((t: any) => {
          if (t.ious && !tagged.find(i => i.id === t.ious.id)) {
            tagged.push(t.ious)
          }
        })
      }
      
      setTaggedIous(tagged)
    } catch (error) {
      console.error('Error loading tagged IOUs:', error)
      setTaggedIous([])
    }
  }

  const displayIous = activeTab === "my" ? ious : taggedIous

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Sign in to see your IOUs</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="py-8"
      >
        <h1 className="font-display font-black text-4xl text-center mb-2">Resonance</h1>
        <p className="text-zinc-400 text-center mb-8">Your threads of connection</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#1c1c1f] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "my" 
                ? "bg-orange-500 text-white" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My IOUs
          </button>
          <button
            onClick={() => setActiveTab("tagged")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === "tagged" 
                ? "bg-orange-500 text-white" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Tagged in ({taggedIous.length})
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-[#2a2a2d] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#2a2a2d] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayIous.length === 0 ? (
          <div className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-8 text-center">
            <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">
              {activeTab === "my" 
                ? "No IOUs yet. Create your first one!" 
                : "No IOUs where you're tagged yet."}
            </p>
            <Link 
              to="/create" 
              className="inline-block mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium"
            >
              Create IOU
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayIous.map((iou: any, i: number) => (
              <motion.div 
                key={iou.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1c1c1f] border border-[#2a2a2d] rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Link 
                    to={`/profile/${iou.profiles?.username}`} 
                    className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center overflow-hidden"
                  >
                    {iou.profiles?.avatar_url ? (
                      <img src={iou.profiles.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-orange-500 font-black">
                        {iou.profiles?.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    )}
                  </Link>
                  <div>
                    <Link 
                      to={`/profile/${iou.profiles?.username}`} 
                      className="font-bold hover:text-orange-500"
                    >
                      @{iou.profiles?.username || 'unknown'}
                    </Link>
                    <p className="text-xs text-zinc-500">
                      {new Date(iou.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-white mb-3 whitespace-pre-wrap">{iou.body}</p>
                
                {iou.taxonomy && (
                  <div className="flex items-center gap-2 text-orange-400 text-sm">
                    <span>{getTaxonomyEmoji(iou.taxonomy)}</span>
                    <span className="font-medium">{iou.taxonomy}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function getTaxonomyEmoji(taxonomy: string): string {
  const map: Record<string, string> = {
    EMOTIONAL: '💕',
    TIME: '⏰',
    PRESENCE: '🤝',
    CREATIVE: '🎨',
    SACRIFICIAL: '🫶',
    STEADFAST: '💪',
    RADIANT: '✨',
    WISDOM: '🧠',
    NURTURING: '🌱',
    ADVENTURE: '🚀',
    GRIT: '🔥',
    LOYALTY: '🏆',
    CURIOSITY: '🔍',
    BLISS: '😊',
    COURAGE: '⚡',
  }
  return map[taxonomy] || '✨'
}
