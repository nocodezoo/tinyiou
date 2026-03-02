import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Profile as ProfileType, IOU } from '../../types'
import { motion } from 'framer-motion'
import IOUCardPremium from '../../components/v2/IOUCardPremium'
import MindMap from '../../components/v2/MindMap'
import { Lock, Unlock, Save, X, Edit3, Camera, Info } from 'lucide-react'

const getFallbackAvatar = (username: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${username}&backgroundColor=0a0a0b`

// Tooltip component
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-orange-500"></div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { username } = useParams()
  const { profile: currentUser, user } = useAuthStore()
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [iousGiven, setIousGiven] = useState<IOU[]>([])
  const [iousReceived, setIousReceived] = useState<IOU[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editData, setEditData] = useState({ username: '', full_name: '', bio: '', is_private: false, avatar_url: '' as string | null })
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isOwnProfile = !username || username === currentUser?.username

  useEffect(() => { loadProfile() }, [username])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const lookupName = username || currentUser?.username
      if (!lookupName) return
      const { data: profileData } = await supabase.from('profiles').select('*').eq('username', lookupName.toLowerCase()).single()
      if (!profileData) { setLoading(false); return }
      setProfile(profileData)
      setEditData({ username: profileData.username || '', full_name: profileData.full_name || '', bio: profileData.bio || '', is_private: profileData.is_private || false, avatar_url: profileData.avatar_url || null })

      const { data: receivedData } = await supabase.from('ious').select('*, creator:creator_id(username, avatar_url), receiver:receiver_id(username, avatar_url), ripples:ripples(count)').eq('receiver_id', profileData.id).order('created_at', { ascending: false }).limit(50)
      setIousReceived((receivedData || []).map(iou => ({ ...iou, ripple_count: iou.ripples?.[0]?.count || 0 })))

      const { data: givenData } = await supabase.from('ious').select('*, creator:creator_id(username, avatar_url), receiver:receiver_id(username, avatar_url), ripples:ripples(count)').eq('creator_id', profileData.id).order('created_at', { ascending: false }).limit(50)
      setIousGiven((givenData || []).map(iou => ({ ...iou, ripple_count: iou.ripples?.[0]?.count || 0 })))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    try {
      const { data, error } = await supabase.storage.from('avatars').upload(`user_${user.id}.jpg`, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      setEditData({ ...editData, avatar_url: publicUrl })
      if (profile) setProfile({ ...profile, avatar_url: publicUrl })
    } catch (err) { console.error('Upload error:', err) }
  }

  const handleSave = async () => {
    if (!user || !profile) return
    setSaving(true)
    setError('')
    try {
      if (editData.username !== profile.username) {
        const { data: existing } = await supabase.from('profiles').select('id').eq('username', editData.username.toLowerCase()).neq('id', user.id).single()
        if (existing) { setError('Username already taken'); setSaving(false); return }
      }
      const { error: updateError } = await supabase.from('profiles').update({ username: editData.username.toLowerCase(), full_name: editData.full_name, bio: editData.bio.slice(0, 100), is_private: editData.is_private }).eq('id', user.id)
      if (updateError) throw updateError
      setProfile({ ...profile, ...editData })
      setEditing(false)
    } catch (e: any) { console.error(e); setError(e.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const togglePrivacy = async () => {
    if (!user) return
    try {
      const newValue = !editData.is_private
      await supabase.from('profiles').update({ is_private: newValue }).eq('id', user.id)
      setEditData({ ...editData, is_private: newValue })
      if (profile) setProfile({ ...profile, is_private: newValue })
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!profile) return <div className="flex flex-col items-center justify-center min-h-[60vh] px-6"><div className="text-6xl mb-6">◇</div><h2 className="text-2xl font-bold text-white mb-2">Soul Not Found</h2><Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">Return Home</Link></div>

  const isOwner = user?.id === profile.id
  const totalResonance = [...iousGiven, ...iousReceived].reduce((a, b) => a + (b.ripple_count || 0), 0)
  const displayIous = activeTab === 'received' ? iousReceived : iousGiven
  const avatarSrc = profile.avatar_url || getFallbackAvatar(profile.username)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {editing ? (
          <div className="bg-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="p-2 bg-zinc-700 rounded-lg"><X className="w-5 h-5 text-white" /></button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold">{saving ? '...' : 'Save'}</button>
              </div>
            </div>
            {error && <div className="mb-4 p-3 bg-red-500/20 rounded text-red-400 text-sm">{error}</div>}
            <div className="flex items-center gap-6 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-zinc-700 flex items-center justify-center overflow-hidden">
                  <img src={editData.avatar_url || getFallbackAvatar(editData.username)} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full"><Camera className="w-4 h-4 text-white" /></button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center bg-zinc-900 rounded-xl overflow-hidden">
                  <span className="px-4 text-zinc-500 font-bold">@</span>
                  <input value={editData.username} onChange={e => setEditData({ ...editData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} className="flex-1 bg-transparent text-white font-bold py-3 outline-none text-lg" maxLength={20} />
                </div>
                <input value={editData.full_name} onChange={e => setEditData({ ...editData, full_name: e.target.value })} className="w-full bg-zinc-900 text-white font-bold py-3 px-4 rounded-xl outline-none text-lg" placeholder="Display name" maxLength={50} />
              </div>
            </div>
            <textarea value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value.slice(0, 100) })} className="w-full bg-zinc-900 text-white py-3 px-4 rounded-xl outline-none resize-none h-24 mb-4" placeholder="Bio..." maxLength={100} />
            <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl">
              <div><p className="text-white font-bold text-lg">{editData.is_private ? 'Private' : 'Public'}</p><p className="text-zinc-500 text-sm">{editData.is_private ? 'Only you can see' : 'Anyone can see'}</p></div>
              <button onClick={togglePrivacy} className={`p-3 rounded-full ${editData.is_private ? 'bg-red-500' : 'bg-green-500'}`}>{editData.is_private ? <Lock className="w-6 h-6 text-white" /> : <Unlock className="w-6 h-6 text-white" />}</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-3xl bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 ring-4 ring-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <img src={avatarSrc} alt={profile.username} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-orange-400 text-sm font-bold uppercase tracking-widest">Soul Identity</p>
                {profile.is_private && <Lock className="w-5 h-5 text-red-400" />}
              </div>
              <h1 className="text-5xl font-black text-white truncate">@{profile.username}</h1>
              {profile.full_name && <p className="text-xl text-zinc-400 font-serif italic truncate">{profile.full_name}</p>}
              {profile.bio && <p className="text-zinc-500 mt-2 text-lg leading-relaxed">"{profile.bio}"</p>}
            </div>
            <div className="flex gap-3">
              <Tooltip text="Times others honored you">
                <div className="bg-zinc-800 px-5 py-4 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-orange-400">{iousReceived.length}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Radiance</p>
                </div>
              </Tooltip>
              <Tooltip text="Total ripples on your IOUs">
                <div className="bg-zinc-800 px-5 py-4 rounded-2xl text-center">
                  <p className="text-3xl font-bold text-amber-400">{totalResonance}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Resonance</p>
                </div>
              </Tooltip>
            </div>
          </div>
        )}

        {isOwnProfile && !editing && (
          <div className="flex gap-3 mt-6">
            <button onClick={() => setEditing(true)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-zinc-700">
              <Edit3 className="w-5 h-5" /> Edit Profile
            </button>
            <Link to="/create" className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-lg font-bold text-center hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              Create IOU
            </Link>
          </div>
        )}
      </motion.div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveTab('received')} className={`px-5 py-2 rounded-xl text-base font-bold ${activeTab === 'received' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          Received ({iousReceived.length})
        </button>
        <button onClick={() => setActiveTab('given')} className={`px-5 py-2 rounded-xl text-base font-bold ${activeTab === 'given' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          Sent ({iousGiven.length})
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-orange-400">◇</span> Connections</h2>
        <MindMap profileId={profile.id} currentUsername={profile.username} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><span className="text-orange-400">◈</span> {activeTab === 'received' ? 'Received' : 'Sent'}</h2>
        {displayIous.length === 0 ? (
          <div className="text-center py-12 bg-zinc-800/50 rounded-2xl">
            <p className="text-zinc-500 text-lg">No IOUs yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayIous.map((iou, i) => <IOUCardPremium key={iou.id} iou={iou} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
