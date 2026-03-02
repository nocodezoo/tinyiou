import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link to="/" className="flex items-center gap-3 mb-10 no-underline">
            <div className="w-9 h-9 bg-[#0f1419] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">i</div>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-[#0f1419]">TinyIOU</span>
          </Link>
          <h1 className="hero-text text-6xl md:text-8xl mb-4">Terms of Use</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Effective: March 15, 2024</p>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">1. The Social Ledger</h2>
            <p>TinyIOU is a non-monetary ledger designed for tracking micro-appreciation and community kindness. By using this platform, you acknowledge that "IOUs" created here have no cash value and cannot be redeemed for legal currency or physical goods.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">2. User-Generated Gratitude</h2>
            <p>You are solely responsible for the content (narratives and images) you post. TinyIOU is a space for high-vibrational energy. We reserve the right to remove content that is hateful, harassing, or discordant with the spirit of community kindness.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">3. Soul IDs & Conduct</h2>
            <p>Your Soul ID (username) is your anchor. You agree not to impersonate others or attempt to disrupt the ledger's frequency. One human, one Soul ID.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">4. Liability Waiver</h2>
            <p>TinyIOU is provided "as is." We are not liable for any emotional resonance, ripples, or real-world interactions stemming from the use of the service. You use the ledger at your own risk and frequency.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">5. Evolution</h2>
            <p>These terms may evolve as the protocol expands. Continued use of TinyIOU signifies your alignment with the updated terms.</p>
          </div>
        </motion.section>

        <footer className="mt-32 pt-10 border-t border-gray-100 flex justify-between items-center bg-white">
          <span className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Build v2.0</span>
          <Link to="/" className="text-orange-500 font-black uppercase text-xs tracking-widest hover:underline">Return to Wall</Link>
        </footer>
      </div>
    </div>
  )
}
