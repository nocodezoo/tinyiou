import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Floating particles component
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1
      })
    }
    
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251, 146, 60, ${p.opacity})`
        ctx.fill()
      })
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(251, 146, 60, ${0.1 * (1 - dist / 120)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

export default function About() {
  const frequencies = [
    { icon: '💗', label: 'Soul', color: 'from-pink-500 to-rose-500' },
    { icon: '⏳', label: 'Time', color: 'from-amber-500 to-orange-500' },
    { icon: '✨', label: 'Presence', color: 'from-yellow-400 to-amber-400' },
    { icon: '🎨', label: 'Alchemy', color: 'from-purple-500 to-fuchsia-500' },
    { icon: '🤝', label: 'Sacrificial', color: 'from-cyan-500 to-blue-500' },
    { icon: '⚓', label: 'Steadfast', color: 'from-blue-500 to-indigo-500' },
    { icon: '☀️', label: 'Radiant', color: 'from-yellow-500 to-orange-500' },
    { icon: '🧠', label: 'Wisdom', color: 'from-indigo-500 to-purple-500' },
    { icon: '🌱', label: 'Nurturing', color: 'from-green-500 to-emerald-500' },
    { icon: '🧭', label: 'Adventure', color: 'from-orange-500 to-red-500' },
    { icon: '🔨', label: 'Grit', color: 'from-gray-600 to-gray-800' },
    { icon: '🛡️', label: 'Loyalty', color: 'from-slate-500 to-zinc-500' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden relative">
      <Particles />
      
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -80, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" 
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              ✦
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Tiny<span className="text-orange-400">IOU</span>
            </span>
          </Link>
          <Link to="/" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            Enter Wall
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Social Ledger <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              of Light.
            </span>
          </motion.h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto italic font-light">
            A protocol for human connection. A digital archive for the invisible ripples we create in each other's lives.
          </p>
        </motion.div>

        {/* Sliding frequency showcase */}
        <div className="mt-16 overflow-hidden">
          <motion.div 
            className="flex gap-4"
            animate={{ x: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...frequencies, ...frequencies].map((freq, i) => (
              <div 
                key={i}
                className={`flex-shrink-0 px-6 py-3 rounded-full bg-gradient-to-r ${freq.color} text-white font-bold text-sm shadow-lg`}
              >
                {freq.icon} {freq.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What It Is */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-bold text-sm tracking-[0.3em] uppercase mb-4">The Vision</p>
            <h2 className="text-4xl md:text-6xl font-black text-white">Beyond Likes & Comments.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                Traditional social media measures <span className="text-orange-400 font-bold">attention</span> and <span className="text-orange-400 font-bold">envy</span>. 
                TinyIOU measures <span className="text-amber-400 font-bold">Presence, Resilience, and Radiance</span>.
              </p>
              <p className="text-lg text-zinc-300 leading-relaxed">
                It is a permanent ledger where the smallest acts of <span className="text-yellow-400 font-bold">kindness</span>, <span className="text-yellow-400 font-bold">courage</span>, and <span className="text-yellow-400 font-bold">creative alchemy</span> are memorialized forever.
              </p>
            </motion.div>

            <div className="grid gap-4">
              {[
                { icon: '💗', label: 'Radiance', desc: 'Your Output' },
                { icon: '⟡', label: 'Resonance', desc: 'Your Impact' },
                { icon: '◈', label: 'Connection', desc: 'Your Network' },
                { icon: '✦', label: 'Legacy', desc: 'Your Archive' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/20 rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-white font-black text-xl">{stat.label}</p>
                    <p className="text-zinc-500 text-sm">{stat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-bold text-sm tracking-[0.3em] uppercase mb-4">The Protocol</p>
            <h2 className="text-4xl md:text-6xl font-black text-white">How it Works.</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: '✍️', title: 'Memorialize', desc: 'Capture a moment of light. Select a frequency and record the ripple.' },
              { num: '02', icon: '📸', title: 'Evidence', desc: 'Attach proof. Upload an image or video to show how light was created.' },
              { num: '03', icon: '✦', title: 'Resonate', desc: 'Commit to the Wall. Watch the ledger grow as others resonate.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="text-[12rem] font-black text-orange-500/10 absolute -top-20 left-1/2 -translate-x-1/2 -z-10 leading-none">
                  {step.num}
                </div>
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(249,115,22,0.4)]">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why People Use It */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white mb-16 italic"
          >
            Why we build <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">with light.</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'True Validation', desc: "It's not just words. When you post an IOU, you're anchoring a specific frequency that matters." },
              { title: 'Legacy Economy', desc: 'Your profile is a dynamic archive of your social impact. Build a ledger that reflects who you truly are.' },
              { title: 'High Frequency', desc: 'By training our eyes to look for Light, we change the frequency of our lives.' },
              { title: 'Privacy Control', desc: 'Choose when to shine and when to be invisible. You own your radiance.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 text-left hover:border-orange-500/30 transition-colors"
              >
                <h4 className="text-xl font-bold text-orange-400 mb-2">{item.title}</h4>
                <p className="text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl">
            ✦
          </div>
          <span className="font-display font-bold text-xl text-white">
            Tiny<span className="text-orange-400">IOU</span>
          </span>
        </div>
        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Social Ledger of Light • Build v2.0</p>
      </footer>
    </div>
  )
}
