import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

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
      setError('Please enter your email first')
      return
    }
    
    setError('')
    setLoading(true)
    
    const { error } = await signInWithMagicLink(email)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMagicSent(true)
    }
  }

  if (magicSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full card text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-display font-black text-3xl mb-4">Check your email!</h1>
          <p className="text-surface-muted">
            We sent you a magic link to sign in. Click the link in your email and you'll be signed in automatically.
          </p>
          <Link to="/login" className="btn-outline mt-6 inline-flex">
            Back to Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-display font-black text-5xl tracking-tighter uppercase gradient-text">
              TinyIOU
            </span>
          </Link>
          <p className="text-surface-muted mt-2">Welcome back to the ledger</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-surface-muted mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-muted mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-surface-muted">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="btn-outline w-full"
          >
            Send Magic Link Instead
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-surface-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
