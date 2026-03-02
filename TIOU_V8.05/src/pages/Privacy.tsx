import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Privacy() {
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
          <h1 className="hero-text text-6xl md:text-8xl mb-4">Privacy Policy</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Last Updated: March 15, 2024</p>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">1. Data Transmission</h2>
            <p>We use Supabase for secure authentication and database management. When you join the ledger, we store your email (for access) and your Soul ID. We do not sell your data to third parties. Ever.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">2. Visual Backdrops</h2>
            <p>Images uploaded to the ledger are stored in our secure media buckets. These images are public by nature as part of the Wall feed. Do not upload visuals you wish to remain private.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">3. Cookie Usage</h2>
            <p>We use essential cookies and local storage to keep you logged in and remember your preferences. No tracking pixels. No ad-tech. Purely functional for the ledger's operation.</p>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">4. Your Rights</h2>
            <p>You own your frequency. You can request to export your digital ledger or delete your Soul ID at any time by contacting our resonance team.</p>
          </div>
        </motion.section>

        <motion.section 
          id="gdpr" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700 border-t pt-12 mt-12"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">5. GDPR Rights (European Users)</h2>
            <p className="mb-4">If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access</strong> – Request a copy of your personal data</li>
              <li><strong>Right to Rectification</strong> – Correct inaccurate data</li>
              <li><strong>Right to Erasure</strong> – Request deletion ("Right to be Forgotten")</li>
              <li><strong>Right to Data Portability</strong> – Request data in machine-readable format</li>
              <li><strong>Right to Object</strong> – Object to processing of your data</li>
            </ul>
            <p className="mt-4">Contact: <strong>privacy@tinyiou.com</strong></p>
          </div>
        </motion.section>

        <motion.section 
          id="ccpa" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700 border-t pt-12 mt-12"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">6. CCPA Rights (California Residents)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Know</strong> – Request what we collect</li>
              <li><strong>Right to Delete</strong> – Request deletion</li>
              <li><strong>Right to Opt-Out</strong> – Opt-out of data sales</li>
              <li><strong>Right to Non-Discrimination</strong> – No discrimination for exercising rights</li>
            </ul>
            <p className="mt-4"><strong>We do NOT sell your data.</strong> Contact: <strong>privacy@tinyiou.com</strong></p>
          </div>
        </motion.section>

        <motion.section 
          id="cookies" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700 border-t pt-12 mt-12"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">7. Cookie Policy</h2>
            <p><strong>Essential Cookies:</strong> Authentication & session management</p>
            <p><strong>We DON'T use:</strong> Tracking, ads, analytics, or marketing pixels</p>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-12 text-lg leading-relaxed text-gray-700 border-t pt-12 mt-12"
        >
          <div>
            <h2 className="text-3xl font-black mb-4 text-[#0f1419]">Contact</h2>
            <p>privacy@tinyiou.com</p>
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
