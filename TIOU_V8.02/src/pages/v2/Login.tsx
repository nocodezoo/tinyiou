import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { motion } from 'framer-motion'

// EXPERT MARKETING COPY
const AUTH_COPY = {
  welcome_headline: "Enter the Ledger",
  welcome_subtext: "Where gratitude becomes immortal. Where light becomes legacy.",
  email_placeholder: "your@frequency.com",
  password_placeholder: "••••••••••",
  login_cta: "Enter",
  signup_cta: "Join the Movement",
  magic_link: "Send me a magic link instead",
  no_account: "Ready to illuminate?",
  footer: "By entering, you agree to spread light."
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithMagicLink } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email first')
      return
    }
    setLoading(true)
    const { error } = await signInWithMagicLink(email)
    if (error) {
      setError(error.message)
    } else {
      setMagicSent(true)
    }
    setLoading(false)
  }

  if (magicSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full card-luxury text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-4xl">⟡</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">
            Check Your Frequency
          </h1>
          <p className="text-zinc-400 mb-8">
            A magic link has been sent to your email. Click it to enter the ledger.
          </p>
          <Link to="/login" className="text-orange-400 hover:text-orange-300">
            ← Return to entrance
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 bg-black/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-4xl mb-8 shadow-lg glow-orange">
            ✦
          </div>
          <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
            Where Light<br/>
            <span className="text-gradient-luxury">Becomes Legacy</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Join the most sophisticated gratitude protocol ever created. 
            Capture the invisible moments. Build your eternal legacy.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-white text-sm font-bold">
                  {String.fromCharCode(64+i)}
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-sm">
              <span className="text-white font-semibold">2,847</span> souls illuminated
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-2xl">
              ✦
            </div>
            <span className="font-display font-bold text-2xl">Tiny<span className="text-orange-400">IOU</span></span>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {AUTH_COPY.welcome_headline}
          </h1>
          <p className="text-zinc-500 mb-8">
            {AUTH_COPY.welcome_subtext}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury"
                placeholder={AUTH_COPY.email_placeholder}
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury"
                placeholder={AUTH_COPY.password_placeholder}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entering...
                </span>
              ) : (
                AUTH_COPY.login_cta
              )}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full py-3 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              {AUTH_COPY.magic_link}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-zinc-500 mb-4">
              {AUTH_COPY.no_account}
            </p>
            <Link to="/register" className="btn-ghost-luxury w-full">
              {AUTH_COPY.signup_cta}
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-600">
            {AUTH_COPY.footer}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
