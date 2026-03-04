import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { IOU } from '../../types'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import IOUCardPremium from '../../components/v2/IOUCardPremium'

// EXPERT MARKETING COPY - REIMAGINED
const HERO_COPY = {
  headline: "Where Gratitude Becomes Immortal",
  subheadline: "The world's most sophisticated ledger for capturing the invisible moments that transform relationships into legacies.",
  cta_primary: "Begin Your Legacy",
  cta_secondary: "Witness the Light",
}

const SOCIAL_PROOF = {
  title: "Join the Movement",
  metrics: [
    { value: "2,847", label: "Ripples Created" },
    { value: "1,203", label: "Souls Illuminated" },
    { value: "847", label: "Communities United" },
  ]
}

const VALUE_PROPOSITIONS = [
  {
    icon: "✦",
    title: "Capture the Invisible",
    description: "The moments that matter most—the quiet acts of kindness, the unseen sacrifices—are now immortalized forever."
  },
  {
    icon: "◈",
    title: "Build Your Legacy", 
    description: "Every IOU is a brick in the cathedral of who you are. A permanent archive of your impact on others."
  },
  {
    icon: "⟡",
    title: "Multiply the Light",
    description: "When you acknowledge someone publicly, you don't just validate them—you inspire everyone watching."
  }
]

export default function Feed() {
  const { profile, user } = useAuthStore()
  const [ious, setIous] = useState<IOU[]>([])
  const [loading, setLoading] = useState(true)
  const [hideHero, setHideHero] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95])

  const fetchIOUs = async () => {
    try {
      const { data } = await supabase
        .from('ious')
        .select(`
          *,
          creator:creator_id(username, avatar_url, full_name),
          receiver:receiver_id(username, avatar_url, full_name),
          ripples:ripples(count)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      const mapped = (data || []).map(iou => ({
        ...iou,
        ripple_count: iou.ripples?.[0]?.count || 0
      }))

      setIous(mapped)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIOUs()

    const channel = supabase
      .channel('feed-v2')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ious' }, fetchIOUs)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const scrollToFeed = () => {
    document.getElementById('ledger-anchor')?.scrollIntoView({ behavior: 'smooth' })
    setHideHero(true)
  }

  return (
    <div className="relative">
      {/* Hero Section - Completely Reimagined */}
      <AnimatePresence>
        {!hideHero && (
          <motion.section 
            ref={heroRef}
            style={{ opacity: heroOpacity, scale: heroScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 md:px-12 py-8 overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-500/5 to-transparent rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              {/* TinyIOU Logo with Electric Glow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                className="mb-1"
              >
                <h2 className="font-display text-2xl md:text-8xl lg:text-9xl font-black tracking-tight"><span className="text-white">Tiny</span><span className="electric-glow-subtle">IOU</span></h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-orange-400 font-medium tracking-[0.3em] uppercase text-sm mb-1">
                  The Gratitude Protocol
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.15 }}
                className="flex items-center justify-center my-8"
              >
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6"
              >
                {HERO_COPY.headline.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'text-gradient-luxury' : 'text-white'}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-serif italic"
              >
                {HERO_COPY.subheadline}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Link
                  to={user ? "/create" : "/register"}
                  className="btn-luxury text-lg px-12 py-5"
                >
                  {HERO_COPY.cta_primary}
                </Link>
                
                <button 
                  onClick={scrollToFeed}
                  className="btn-ghost-luxury text-zinc-400 hover:text-white"
                >
                  {HERO_COPY.cta_secondary} ↓
                </button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center gap-8 md:gap-16 mt-12"
            >
              {SOCIAL_PROOF.metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white font-display">{metric.value}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Value Propositions - New Section */}
      <section className="py-24 px-6 border-y border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {VALUE_PROPOSITIONS.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury text-center"
              >
                <div className="text-4xl mb-1">{prop.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">{prop.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ledger - Feed Section */}
      <section id="ledger-anchor" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-1">
              The Ledger
            </h2>
            <p className="text-zinc-500 text-lg font-serif italic">
              Where light becomes eternal
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-16 h-16 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ious.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 card-luxury"
            >
              <div className="text-6xl mb-6">✦</div>
              <p className="text-zinc-400 text-xl mb-8">
                The ledger awaits its first entry
              </p>
              <Link to={user ? "/create" : "/register"} className="btn-luxury inline-flex">
                Create the First Ripple
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ious.map((iou, index) => (
                <IOUCardPremium key={iou.id} iou={iou} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 text-center border-t border-zinc-800 mt-12">
        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">TinyIOU • Build V8.07</p>
      </footer>
    </div>
  )
}
