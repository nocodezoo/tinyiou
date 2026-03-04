import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Search, Users, Compass } from 'lucide-react'

export default function Discover() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadTrending() }, [])

  const loadTrending = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      const validProfiles = (data || []).filter(p => p.username || p.full_name)
      setTrending(validProfiles)
    } catch (error) {
      console.error('Error loading trending:', error)
      setTrending([])
    }
  }

  const searchUsers = async () => {
    if (!query.trim()) { loadTrending(); return }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(50)
      const validProfiles = (data || []).filter(p => p.username || p.full_name)
      setUsers(validProfiles)
    } catch (error) {
      console.error('Error searching:', error)
      setUsers([])
    }
    setLoading(false)
  }

  const getInitial = (username: string | null, fullName: string | null) => {
    if (username) return username[0]?.toUpperCase() || '?'
    if (fullName) return fullName[0]?.toUpperCase() || '?'
    return '?'
  }

  const getDisplayName = (username: string | null, fullName: string | null) => {
    if (username) return username
    if (fullName) return fullName
    return ''
  }

  const displayUsers = users.length > 0 ? users : trending
  const showResults = users.length > 0

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Discover</h1>
          <p className="text-zinc-500 text-sm">Find and honor others</p>
        </div>
      </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchUsers()}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            placeholder="Search for @username or name" 
          />
        </div>
        <button 
          onClick={searchUsers} 
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users className="w-5 h-5" />
            <h2 className="font-bold text-sm uppercase">
              {showResults ? `Results (${users.length})` : `All Users (${trending.length})`}
            </h2>
          </div>
          
          {displayUsers.length === 0 ? (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 text-center">
              <p className="text-zinc-500">No users found yet</p>
            </div>
          ) : (
            displayUsers.map((u: any, i: number) => (
              <motion.div 
                key={u.id} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: i * 0.03 }} 
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center gap-4"
              >
                <Link 
                  to={`/create?user=${u.username}`}
                  className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center overflow-hidden flex-shrink-0"
                >
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-orange-500">{getInitial(u.username, u.full_name)}</span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/create?user=${u.username}`}
                    className="font-bold text-white hover:text-orange-500 block truncate"
                  >
                    @{getDisplayName(u.username, u.full_name)}
                  </Link>
                  {u.full_name && u.username && (
                    <p className="text-sm text-zinc-400 truncate">{u.full_name}</p>
                  )}
                </div>
                <Link 
                  to={`/create?user=${u.username}`}
                  className="px-4 py-2 bg-orange-500/20 text-orange-500 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition"
                >
                  Honor
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
