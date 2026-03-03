import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IOU, TAXONOMY_MAP, TAXONOMY_BACKDROPS, TaxonomyType } from '../../types'
import { useAuthStore } from '../../stores/authStore'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { extractFromNarrative, polishContent } from '../../lib/utils'

interface IOUCardPremiumProps {
  iou: IOU
  index: number
}

export default function IOUCardPremium({ iou, index }: IOUCardPremiumProps) {
  const { user } = useAuthStore()
  const [rippleCount, setRippleCount] = useState(iou.ripple_count || 0)
  const [hasRippled, setHasRippled] = useState(false)
  const [rippling, setRippling] = useState(false)

  const parsed = extractFromNarrative(iou.narrative || '')
  const displayTaxonomy = (iou.taxonomy || parsed.taxonomy || 'EMOTIONAL').toUpperCase()
  const cleanNarrative = iou.narrative || parsed.message
  const taxonomy = TAXONOMY_MAP[displayTaxonomy] || TAXONOMY_MAP.EMOTIONAL
  const taxonomyBackdrop = TAXONOMY_BACKDROPS[displayTaxonomy] || TAXONOMY_BACKDROPS.EMOTIONAL
  
  const userMedia = (iou.media_urls?.[0] && iou.media_urls[0].trim()) || null

  const handleRipple = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user || hasRippled || rippling) return
    
    setRippling(true)
    try {
      const { error } = await supabase.from('ripples').insert([{ iou_id: iou.id, user_id: user.id }])
      if (!error) {
        setRippleCount(prev => prev + 1)
        setHasRippled(true)
      }
    } catch (e) { 
      console.error(e) 
    }
    finally { setRippling(false) }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="iou-card-premium group relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {userMedia ? (
          <>
            {userMedia.match(/\.(mp4|webm|mov)$/i) ? (
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                <source src={userMedia} />
              </video>
            ) : (
              <img src={userMedia} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            )}
          </>
        ) : (
          <img src={taxonomyBackdrop} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full min-h-[260px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
              {iou.creator?.username?.[0].toUpperCase() || 'S'}
            </div>
            <div>
              <Link to={`/profile/${iou.creator?.username}`} className="font-semibold text-white hover:text-orange-400 transition-colors">
                @{iou.creator?.username || 'soul'}
              </Link>
              <p className="text-xs text-zinc-500">to <span className="text-orange-400">@{iou.receiver?.username || 'soul'}</span></p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">{taxonomy.label}</span>
          </div>
        </div>

        {/* Narrative */}
        <div className="flex-1">
          <p className="text-lg md:text-xl font-serif italic text-white leading-relaxed">"{polishContent(cleanNarrative) || 'A moment of light...'}"</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">✦</span>
            <span className="text-sm text-zinc-500 font-medium">Recorded</span>
          </div>

          <button
            onClick={handleRipple}
            disabled={!user || hasRippled}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              hasRippled 
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 text-zinc-300'
            } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className={`text-lg ${rippling ? 'animate-pulse' : ''}`}>
              {hasRippled ? '🜛' : '♡'}
            </span>
            <span className="font-semibold">{rippleCount || ''}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}
