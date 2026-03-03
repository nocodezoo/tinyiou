import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Menu, X, Info, LogOut, Home, Search, PlusCircle, MessageCircle, Bell } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Search },
  { to: '/create', label: 'Create', icon: PlusCircle },
  { to: '/messages', label: 'Inbox', icon: MessageCircle },
  { to: '/notifications', label: 'Alerts', icon: Bell },
]

export default function Layout() {
  const { profile, signOut, user } = useAuthStore()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setMenuOpen(false)
    await signOut()
    navigate('/login')
  }

  const handleAbout = () => {
    setMenuOpen(false)
    navigate('/about')
  }

  const handleProfile = () => {
    setMenuOpen(false)
    if (profile) navigate(`/profile/${profile.username}`)
  }

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className={cn(
        "nav-glass transition-all duration-300 fixed top-0 left-0 right-0 z-50",
        scrolled ? "py-3" : "py-4"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              ✦
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Tiny<span className="text-orange-400">IOU</span>
            </span>
          </Link>

          {/* Menu Button */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {menuOpen ? <X className="w-12 h-12 text-white" /> : <Menu className="w-12 h-12 text-white" />}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-14 w-56 bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  {user && profile ? (
                    <>
                      <button onClick={handleProfile} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold">
                          {profile.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold">@{profile.username}</p>
                          <p className="text-xs text-zinc-400">View profile</p>
                        </div>
                      </button>
                      <hr className="border-zinc-700" />
                      <button onClick={handleAbout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                        <Info className="w-5 h-5 text-zinc-400" />
                        <span className="text-white font-medium">About</span>
                      </button>
                      <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition-colors text-left">
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Logoff</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-center text-orange-400 font-medium hover:bg-white/10">
                      Sign In
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-24">
        <Outlet />
      </main>

      {/* Bottom TikTok-Style Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-around h-16">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors relative",
                isActive ? "text-orange-400" : "text-zinc-500 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-12 h-12", isActive && "fill-orange-400/20")} />
                  <span className={cn("text-[10px] font-medium mt-1", isActive && "text-orange-400")}>
                    {label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute bottom-0 w-12 h-0.5 bg-orange-400 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
