import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

// Glass Icon Components
const CameraIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const SparkleIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

// Floating particle system
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []
    
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 4 + 1,
        alpha: Math.random() * 0.7 + 0.2
      })
    }
    
    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        ctx.shadowBlur = 20
        ctx.shadowColor = 'rgba(249, 115, 22, 0.6)'
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251, 146, 60, ${p.alpha})`
        ctx.fill()
      })
      
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (dist < 180) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(251, 146, 60, ${0.08 * (1 - dist / 180)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
      
      ctx.shadowBlur = 0
      animId = requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

// Scrolling IOU cards on the right
function ScrollingIOUs() {
  const ious = [
    { id: 1, from: 'sarah_m', to: 'mike_r', message: 'Always being there when I needed someone to listen...', taxonomy: 'Presence' },
    { id: 2, from: 'alex_k', to: 'jordan_b', message: 'Teaching me patience through every challenge...', taxonomy: 'Wisdom' },
    { id: 3, from: 'taylor_s', to: 'casey_m', message: 'The way you make everyone feel welcome...', taxonomy: 'Radiant' },
    { id: 4, from: 'morgan_l', to: 'riley_j', message: 'Your creative vision that brings magic to everything...', taxonomy: 'Alchemy' },
    { id: 5, from: 'drew_p', to: 'quinn_h', message: 'Never giving up even when it got hard...', taxonomy: 'Grit' },
    { id: 6, from: 'jamie_w', to: 'avery_k', message: 'Your generous spirit inspires me daily...', taxonomy: 'Generosity' },
    { id: 7, from: 'riley_t', to: 'sam_n', message: 'Standing by me through every storm...', taxonomy: 'Loyalty' },
    { id: 8, from: 'casey_r', to: 'parker_l', message: 'Your courage to be yourself is infectious...', taxonomy: 'Courage' },
  ]

  return (
    <div className="fixed right-0 top-0 bottom-0 w-1/3 hidden lg:block overflow-hidden z-10">
      <div className="flex flex-col gap-4 animate-scroll-vertical py-8">
        {[...ious, ...ious, ...ious].map((iou, i) => (
          <motion.div
            key={`${iou.id}-${i}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mx-4 p-4 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-md border border-orange-500/20 rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-400 text-sm font-bold">@{iou.from}</span>
              <span className="text-zinc-500">→</span>
              <span className="text-amber-400 text-sm font-bold">@{iou.to}</span>
            </div>
            <p className="text-white text-sm italic font-serif">"{iou.message}"</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400">
                {iou.taxonomy}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

// Glass icon component
function GlassIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
      {children}
    </div>
  )
}

// Floating card with glow effect
function FloatingCard({ icon, title, description, delay, position }: { icon: React.ReactNode; title: string; description: string; delay: number; position: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`absolute ${position}`}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          boxShadow: [
            '0 0 20px rgba(249, 115, 22, 0.2)',
            '0 0 40px rgba(249, 115, 22, 0.4)',
            '0 0 20px rgba(249, 115, 22, 0.2)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-64 p-5 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-md border border-orange-500/30 rounded-2xl"
      >
        {icon}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </motion.div>
    </motion.div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { signInWithGoogle, user, loading: authLoading } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google auth failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <ParticleCanvas />
      <ScrollingIOUs />
      
      {/* Left side - Login */}
      <div className="relative z-20 w-full lg:w-2/3 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-5xl shadow-[0_0_50px_rgba(249,115,22,0.5)]">
            ✦
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2">
            <span className="text-white">Tiny</span><span className="electric-glow-subtle">IOU</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-serif italic">
            Where light becomes legacy
          </p>
        </motion.div>

        {/* Floating Cards with Glass Icons */}
        <FloatingCard 
          icon={<GlassIcon><CameraIcon /></GlassIcon>}
          title="Capture the Invisible" 
          description="Memorialize moments of light that often go unnoticed"
          delay={0.2}
          position="top-32 left-8"
        />
        <FloatingCard 
          icon={<GlassIcon><BuildingIcon /></GlassIcon>}
          title="Build Your Legacy" 
          description="Create a permanent record of your impact"
          delay={0.4}
          position="bottom-32 left-16"
        />
        <FloatingCard 
          icon={<GlassIcon><SparkleIcon /></GlassIcon>}
          title="Multiply the Light" 
          description="Watch your ripples spread across the network"
          delay={0.6}
          position="top-48 right-8"
        />

        {/* Auth Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-black text-white text-center mb-6">
              {isSignUp ? 'Join the Ledger' : 'Enter the Wall'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none text-lg"
                required
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none text-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-50 text-lg"
              >
                {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-900 text-zinc-500">or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white text-zinc-900 font-bold py-4 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-zinc-500 text-base mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-orange-400 font-bold hover:underline text-lg"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>

        <p className="relative z-10 text-zinc-600 text-sm mt-8">
          By entering, you agree to capture the light.
        </p>
      </div>
    </div>
  )
}
