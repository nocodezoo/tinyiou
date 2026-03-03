import { Link } from 'react-router-dom'
import { IOU, TAXONOMY_MAP, TAXONOMY_BACKDROPS, TaxonomyType } from '../types'
import { useAuthStore } from '../stores/authStore'
import { motion } from 'framer-motion'
import { extractFromNarrative, polishContent } from '../lib/utils'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface IOUCardProps {
  iou: IOU
  onProfileClick?: (username: string) => void
}

export default function IOUCard({ iou, onProfileClick }: IOUCardProps) {
  const { user } = useAuthStore()
  const [rippleCount, setRippleCount] = useState(iou.ripple_count || 0)
  const [hasRippled, setHasRippled] = useState(false)

  const { taxonomy: displayTaxonomy, message: cleanNarrative } = extractFromNarrative(iou.narrative)
  
  const mediaUrl = iou.media_urls?.[0] || TAXONOMY_BACKDROPS[displayTaxonomy] || TAXONOMY_BACKDROPS.EMOTIONAL
  const isVideo = mediaUrl?.toLowerCase().includes('.webm') || mediaUrl?.toLowerCase().includes('.mp4') || mediaUrl?.toLowerCase().includes('.mov')
  
  const taxonomy = TAXONOMY_MAP[displayTaxonomy] || TAXONOMY_MAP.EMOTIONAL

  const handleRipple = async () => {
    if (!user || hasRippled) return

    try {
      const { error } = await supabase
        .from('ripples')
        .insert([{ iou_id: iou.id, user_id: user.id }])

      if (!error) {
        setRippleCount(prev => prev + 1)
        setHasRippled(true)
      }
    } catch (error) {
      console.error('Error adding ripple:', error)
    }
  }

  const handleProfileClick = (e: React.MouseEvent, username?: string) => {
    e.stopPropagation()
    if (onProfileClick && username) {
      onProfileClick(username)
    }
  }

  return (
    <motion.article
      className="iou-card flex flex-col pt-10 relative overflow-hidden rounded-[2.5rem]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onProfileClick?.(iou.receiver?.username || '')}
    >
      {mediaUrl && (
        isVideo ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{ backgroundColor: 'black' }}>
            <source src={mediaUrl} type={mediaUrl.toLowerCase().includes('.mov') ? 'video/quicktime' : 'video/mp4'} />
          </video>
        ) : (
          <img src={mediaUrl} alt="IOU backdrop" className="absolute inset-0 w-full h-full object-cover z-0" loading="lazy" />
        )
      )}
      
      {mediaUrl && <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px] z-[1]" />}
      
      <div className="content-layer dimmed relative z-[10] flex-1 flex flex-col" style={{ pointerEvents: 'none' }}>
        <div className="text-left mb-6 flex items-center gap-4" style={{ pointerEvents: 'auto' }}>
          <div className="w-10 h-10 rounded-2xl bg-[#0f1419] text-white flex items-center justify-center font-black">
            {iou.creator?.username?.[0].toUpperCase() || 'S'}
          </div>
          <div>
            <p className="font-black text-sm text-gray-900 cursor-pointer hover:text-orange-500" onClick={(e) => handleProfileClick(e, iou.creator?.username)}>
              @{iou.creator?.username || 'soul'}
            </p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:text-orange-500" onClick={(e) => handleProfileClick(e, iou.receiver?.username)}>
              to @{iou.receiver?.username || 'soul'}
            </p>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black italic text-left flex-1 text-gray-900 leading-snug" style={{ pointerEvents: 'none' }}>
          {cleanNarrative ? `“${polishContent(cleanNarrative)}”` : ""}
        </h3>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <span className="text-[12px] font-black uppercase text-gray-700 tracking-widest">{taxonomy.label}</span>
          </div>
          
          <button onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer transition-all active:scale-125 bg-transparent border-none p-0">
            <span className={`text-3xl ${rippleCount > 0 ? 'text-orange-500' : 'text-gray-200'}`}>
              {hasRippled ? '🧡' : '🤍'}
            </span>
            <span className="text-lg font-black text-gray-700">{rippleCount || ""}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}
