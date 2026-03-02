import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 bg-white/80 backdrop-blur-md border-b border-[#eff3f4] flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">i</div>
          <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">TinyIOU</h1>
        </Link>
        <Link to="/" className="bg-gray-900 text-white font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">
          Enter Wall
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 md:px-24 text-center max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-title text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8"
        >
          The Social Ledger <br /> <span className="gradient-text">of Light.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-3xl text-gray-500 font-medium max-w-3xl mx-auto italic"
        >
          TinyIOU is a protocol for human connection. A digital archive for the invisible ripples we create in each other's lives.
        </motion.p>
      </section>

      {/* What It Is - The Concept */}
      <section className="py-20 bg-gray-50 border-y border-gray-100 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-black uppercase text-orange-600 tracking-[0.4em] mb-4">The Vision</h3>
            <h4 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Beyond Likes & Comments.</h4>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
              Traditional social media measures attention and envy. TinyIOU measures <strong>Presence, Resilience, and Radiance</strong>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              It is a permanent ledger where the smallest acts of kindness, courage, and creative alchemy are memorialized forever. We call these <strong>IOUs</strong>—not as debts to be paid, but as ripples to be acknowledged.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-[2.5rem] shadow-xl"
            >
              <i className="ph-duotone ph-heart text-5xl text-red-500 mb-4 block"></i>
              <p className="font-black uppercase text-[10px] tracking-widest text-gray-400">Radiance</p>
              <p className="text-2xl font-black">Your Output</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-[2.5rem] shadow-xl mt-8"
            >
              <i className="ph-duotone ph-sparkle text-5xl text-yellow-500 mb-4 block"></i>
              <p className="font-black uppercase text-[10px] tracking-widest text-gray-400">Power</p>
              <p className="text-2xl font-black">Your Impact</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h3 className="text-xs font-black uppercase text-orange-600 tracking-[0.4em] mb-4">The Protocol</h3>
            <h4 className="text-5xl md:text-6xl font-black tracking-tight">How it Works.</h4>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="step-number text-[10rem] font-black text-gray-50 absolute -top-20 left-1/2 -translate-x-1/2 -z-10">01</div>
              <div className="w-20 h-20 bg-orange-600 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-xl">
                <i className="ph-bold ph-pencil-simple text-4xl"></i>
              </div>
              <h5 className="text-2xl font-black mb-4">Memorialize</h5>
              <p className="text-gray-500 font-medium px-4">Capture a moment of light. Select one of 25 frequencies—Soul, Time, Alchemy, or Grit—and record the ripple.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="step-number text-[10rem] font-black text-gray-50 absolute -top-20 left-1/2 -translate-x-1/2 -z-10">02</div>
              <div className="w-20 h-20 bg-gray-900 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-xl">
                <i className="ph-bold ph-video-camera text-4xl"></i>
              </div>
              <h5 className="text-2xl font-black mb-4">Evidence</h5>
              <p className="text-gray-500 font-medium px-4">Attach absolute proof. Upload an image or a 5-second video clip to show the world how light was created.</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="step-number text-[10rem] font-black text-gray-50 absolute -top-20 left-1/2 -translate-x-1/2 -z-10">03</div>
              <div className="w-20 h-20 bg-orange-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-xl">
                <i className="ph-bold ph-globe text-4xl"></i>
              </div>
              <h5 className="text-2xl font-black mb-4">Resonate</h5>
              <p className="text-gray-500 font-medium px-4">Commit to the Wall. Watch the collective ledger grow. Others resonate with your message, expanding its Power.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why People Use It */}
      <section className="py-32 bg-orange-600 text-white px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h4 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-12 italic uppercase leading-none"
          >
            Why we build <br /> with light.
          </motion.h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-2xl font-bold uppercase tracking-tighter">True Validation</p>
              <p className="text-orange-100 font-medium">It's not just words. When you post an IOU, you are anchoring a specific frequency of human interaction that matters.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-2xl font-bold uppercase tracking-tighter">Legacy Economy</p>
              <p className="text-orange-100 font-medium">Your profile is a dynamic archive of your social impact. Build a ledger that reflects who you truly are to your tribe.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-2xl font-bold uppercase tracking-tighter">High Frequency</p>
              <p className="text-orange-100 font-medium">By training our eyes to look for "Light," we change the frequency of our own lives and the communities around us.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-2xl font-bold uppercase tracking-tighter">Privacy Control</p>
              <p className="text-orange-100 font-medium">Choose when to shine and when to be invisible. You own your data—you own your radiance.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white px-8 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">i</div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">TinyIOU</h1>
        </div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300">Social Ledger of Light • Build v2.0</p>
      </footer>
    </div>
  )
}
