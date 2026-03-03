import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function About() {
  const frequencies = [
    { icon: '💗', label: 'Soul', desc: 'Emotional depth and heart connection' },
    { icon: '⏳', label: 'Time', desc: 'Moments that transcend temporal boundaries' },
    { icon: '✨', label: 'Presence', desc: 'Being fully present with someone' },
    { icon: '🎨', label: 'Alchemy', desc: 'Creative transformation and innovation' },
    { icon: '🤝', label: 'Offering', desc: 'Going beyond for another' },
    { icon: '⚓', label: 'Anchor', desc: 'Reliable presence through challenges' },
    { icon: '☀️', label: 'Luminous', desc: 'Illuminating others with your light' },
    { icon: '🧠', label: 'Insight', desc: 'Sharing knowledge and insight' },
    { icon: '🌱', label: 'Vitality', desc: 'Growing and supporting others' },
    { icon: '🧭', label: 'Quest', desc: 'Bold journeys taken together' },
    { icon: '🔨', label: 'Steel', desc: 'Perseverance and determination' },
    { icon: '🛡️', label: 'Loyal', desc: 'Unwavering commitment' },
    { icon: '🔍', label: 'Seek', desc: 'Curiosity and exploration' },
    { icon: '🦋', label: 'Euphor', desc: 'Pure joy and bliss' },
    { icon: '🦁', label: 'Lion', desc: 'Bravery and courage' },
    { icon: '🌊', label: 'Grace', desc: 'Humble service and humility' },
    { icon: '🍃', label: 'Zen', desc: 'Patience and inner peace' },
    { icon: '🎁', label: 'Nobility', desc: 'Generous spirit and giving' },
    { icon: '⚖️', label: 'Honor', desc: 'Living with integrity' },
    { icon: '🔥', label: 'Ignite', desc: 'Passion and enthusiasm' },
    { icon: '⚡', label: 'Pulse', desc: 'Energy and vitality' },
    { icon: '👥', label: 'Circle', desc: 'Unity and togetherness' },
    { icon: '🕊️', label: 'Release', desc: 'Forgiveness and letting go' },
    { icon: '🎉', label: 'Spark', desc: 'Playfulness and joy' },
    { icon: '🩹', label: 'Mend', desc: 'Healing and recovery' },
    { icon: '🌟', label: 'Star', desc: 'Radiant personality' },
    { icon: '💫', label: 'Dream', desc: 'Vision and aspirations' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl">
              ✦
            </div>
            <span className="font-bold text-xl text-white">Tiny<span className="text-orange-400">IOU</span></span>
          </Link>
          <Link to="/" className="px-5 py-2 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition">
            Enter Wall
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6 text-white">
              Beyond <span className="text-orange-400">Likes</span> & <span className="text-orange-400">Comments</span>
            </h1>
            <p className="text-2xl md:text-3xl text-zinc-400 font-display">
              A protocol for human connection. A digital archive for the invisible ripples we create in each other's lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision - Two Bubbles */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-bold text-sm tracking-[0.3em] uppercase mb-4">The Vision</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white">Capture the Light You Create</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Bubble 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-3xl p-8 min-h-[280px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <p className="text-2xl md:text-3xl font-bold text-white font-display leading-relaxed relative z-10">
                Traditional social media measures <span className="text-orange-400">attention</span> and <span className="text-orange-400">envy</span>.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white font-display leading-relaxed mt-4 relative z-10">
                TinyIOU measures <span className="text-amber-400">Presence</span>, <span className="text-amber-400">Resilience</span>, and <span className="text-amber-400">Radiance</span>.
              </p>
            </motion.div>

            {/* Bubble 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-3xl p-8 min-h-[280px] flex flex-col justify-center"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <p className="text-2xl md:text-3xl font-bold text-white font-display leading-relaxed relative z-10">
                It is a permanent ledger where the smallest acts of <span className="text-yellow-400">kindness</span>, <span className="text-yellow-400">courage</span>, and <span className="text-yellow-400">creative alchemy</span> are memorialized forever.
              </p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {[
              { icon: '💗', label: 'Radiance', stat: 'Your Output' },
              { icon: '⟡', label: 'Resonance', stat: 'Your Impact' },
              { icon: '◈', label: 'Connection', stat: 'Your Network' },
              { icon: '✦', label: 'Legacy', stat: 'Your Archive' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-white font-bold">{item.label}</p>
                <p className="text-zinc-500 text-sm">{item.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Glass icons */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-bold text-sm tracking-[0.3em] uppercase mb-4">The Protocol</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white">How it Works</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Memorialize', desc: 'Capture a moment of light. Select a frequency and record the ripple.' },
              { num: '02', title: 'Evidence', desc: 'Attach proof. Upload an image or video to show how light was created.' },
              { num: '03', title: 'Resonate', desc: 'Commit to the Wall. Watch the ledger grow as others resonate.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="text-[10rem] font-black text-orange-500/10 absolute -top-16 left-1/2 -translate-x-1/2 -z-10 leading-none">
                  {step.num}
                </div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All 27 Frequency Types */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-bold text-sm tracking-[0.3em] uppercase mb-4">Ways to Honor</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white">Frequencies of Light</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {frequencies.map((freq, i) => (
              <motion.div
                key={freq.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                viewport={{ once: true }}
                className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-3 text-center hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-zinc-900 hover:border-orange-500/50 transition-all duration-300 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{freq.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{freq.label}</p>
                <p className="text-zinc-500 text-xs">{freq.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-16"
          >
            Why we build with <span className="text-orange-400">light</span>
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
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left"
              >
                <h4 className="text-orange-400 font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl">
            ✦
          </div>
          <span className="font-bold text-xl text-white">Tiny<span className="text-orange-400">IOU</span></span>
        </div>
        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Social Ledger of Light • Build V8.07 • TinyIOU</p>
      </footer>
    </div>
  )
}
