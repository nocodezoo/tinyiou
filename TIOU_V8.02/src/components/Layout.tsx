import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/', label: 'Wall' },
  { to: '/discover', label: 'Discover' },
  { to: '/create', label: 'Create' },
  { to: '/messages', label: 'Chat' },
  { to: '/notifications', label: 'Alerts' },
]

export default function Layout() {
  const { profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface-bg pb-20">
      {/* Top Navigation - Original Style */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-12 py-4 md:py-6 bg-white border-b border-[#eff3f4] flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4 sm:gap-0">
        <Link to="/" className="flex items-center gap-4 cursor-pointer self-start sm:self-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg">
            i
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
            TinyIOU
          </h1>
        </Link>

        <div className="flex items-center gap-4 md:gap-10 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/about" className="nav-link">About</Link>
            <NavLink to="/" className={({ isActive }) => cn('nav-link', isActive && 'active')}>
              Wall
            </NavLink>
            <Link to="/messages" className="nav-link">Chat</Link>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {profile?.username && (
              <div className="flex flex-col items-end pl-4 md:pl-6 border-l border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                    Active
                  </span>
                </div>
                <Link 
                  to={`/profile/${profile.username}`} 
                  className="text-sm md:text-lg font-black text-gray-900 cursor-pointer hover:text-orange-600 transition-colors uppercase"
                >
                  @{profile.username}
                </Link>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="nav-link text-red-500 font-black text-xs md:text-sm"
            >
              Exit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto pt-32 md:pt-28">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#eff3f4] md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'p-3 rounded-xl transition-colors flex flex-col items-center gap-1',
                  isActive ? 'text-primary' : 'text-surface-muted'
                )
              }
            >
              <span className="text-[10px] font-bold">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-white fixed bottom-0 w-full z-50 border-t border-[#eff3f4] text-center hidden md:block">
        <div className="flex justify-center gap-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link to="/privacy#gdpr" className="hover:text-primary transition-colors">GDPR</Link>
          <Link to="/privacy#ccpa" className="hover:text-primary transition-colors">CCPA</Link>
          <button 
            onClick={() => {
              localStorage.removeItem('tinyiou_consentv221')
              window.location.reload()
            }} 
            className="hover:text-primary border-none bg-transparent font-black tracking-widest text-gray-300 uppercase cursor-pointer"
          >
            Cookies
          </button>
        </div>
        <span className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300">
          Build v2.0 • Next-Gen
        </span>
      </footer>
    </div>
  )
}
