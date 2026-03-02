import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Profile as ProfileType, IOU } from '../../types'
import { motion } from 'framer-motion'
import IOUCardPremium from '../../components/v2/IOUCardPremium'
import MindMap from '../../components/v2/MindMap'
import { Lock, Unlock, Save, X, Edit3, Camera, Image } from 'lucide-react'

const PROFILE_COPY = {
  no_entries: "This soul hasn't been illuminated yet",
  create_first: "Be the first to acknowledge them",
}

export default function Profile() {
  const { username } = useParams()
  const { profile: currentUser, user, updateProfile } = useAuthStore()
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [iousGiven, setIousGiven] = useState<IOU[]>([])
  const [iousReceived, setIousReceived] = useState<IOU[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editData, setEditData] = useState({ username: '', full_name: '', bio: '', is_private: false })
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isOwnProfile = !username || username === currentUser?.username

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const lookupName = username || currentUser?.username
      if (!lookupName) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', lookupName.toLowerCase())
        .single()

      if (!profileData) { setLoading(false); return }

      setProfile(profileData)
      setEditData({
        username: profileData.username || '',
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        is_private: profileData.is_private || false
      })

      // Get IOUs received (radiance)
      const { data: receivedData } = await supabase
        .from('ious')
        .select('*, creator:creator_id(username, avatar_url), receiver:receiver_id(username, avatar_url), ripples:ripples(count)')
        .eq('receiver_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(50)

      const received = (receivedData || []).map(iou => ({ ...iou, ripple_count: iou.ripples?.[0]?.count || 0 }))
      setIousReceived(received)

      // Get IOUs given
      const { data: givenData } = await supabase
        .from('ious')
        .select('*, creator:creator_id(username, avatar_url), receiver:receiver_id(username, avatar_url), ripples:ripples(count)')
        .eq('creator_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(50)

      const given = (givenData || []).map(iou => ({ ...iou, ripple_count: iou.ripples?.[0]?.count || 0 }))
      setIousGiven(given)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`user_${user.id}.jpg`, file, { upsert: true })
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path)
      
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      setEditData({ ...editData, avatar_url: publicUrl })
      if (profile) setProfile({ ...profile, avatar_url: publicUrl })
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return
    setSaving(true)
    setError('')
    try {
      if (editData.username !== profile.username) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', editData.username.toLowerCase())
          .neq('id', user.id)
          .single()
        
        if (existing) {
          setError('Username already taken')
          setSaving(false)
          return
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: editData.username.toLowerCase(),
          full_name: editData.full_name,
          bio: editData.bio.slice(0, 100),
          is_private: editData.is_private
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile({ ...profile, ...editData })
      setEditing(false)
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Failed to save')
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-6xl mb-6">◇</div>
        <h2 className="text-2xl font-bold text-white mb-2">Soul Not Found</h2>
        <p className="text-zinc-500 mb-8">This frequency doesn't exist in our ledger</p>
        <Link to="/" className="btn-luxury">Return Home</Link>
      </div>
    )
  }

  const isOwner = user?.id === profile.id
  const totalResonance = [...iousGiven, ...iousReceived].reduce((a, b) => a + (b.ripple_count || 0), 0)
  const displayIous = activeTab === 'received' ? iousReceived : iousGiven

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-luxury mb-12"
      >
        {editing ? (
          /* Edit Mode */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"><X className="w-5 h-5 text-white" /></button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-orange-600 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center overflow-hidden">
                    {editData.avatar_url || editData.username ? (
                      <img 
                        src={editData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${editData.username}`} 
                        alt={editData.username} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">{editData.username[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    className="hidden" 
                  />
                </div>
                <div>
                  <p className="font-bold text-white">Profile Photo</p>
                  <p className="text-xs text-zinc-400">Click camera to change</p>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">@username</label>
                <div className="flex items-center bg-gray-800 rounded-xl overflow-hidden">
                  <span className="px-4 text-gray-400 font-bold">@</span>
                  <input 
                    value={editData.username} 
                    onChange={e => setEditData({ ...editData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    className="flex-1 bg-transparent text-white font-bold py-3 outline-none"
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Display Name</label>
                <input 
                  value={editData.full_name} 
                  onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                  className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-xl outline-none"
                  maxLength={50}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Bio <span className="text-gray-500">({editData.bio.length}/100)</span>
                </label>
                <textarea 
                  value={editData.bio} 
                  onChange={e => setEditData({ ...editData, bio: e.target.value.slice(0, 100) })}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl outline-none resize-none h-24"
                  placeholder="Tell us about yourself..."
                  maxLength={100}
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                <div>
                  <p className="font-bold text-white">{editData.is_private ? 'Private' : 'Public'}</p>
                  <p className="text-xs text-gray-400">{editData.is_private ? 'Only you can see your profile' : 'Anyone can see your profile'}</p>
                </div>
                <button 
                  onClick={togglePrivacy}
                  className={`p-3 rounded-full transition ${editData.is_private ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {editData.is_private ? <Lock className="w-5 h-5 text-white" /> : <Unlock className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="avatar-premium">
              <div className="avatar-premium-inner w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl md:text-6xl font-bold text-zinc-600">
                    {profile.username[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <p className="text-orange-400 text-sm font-medium tracking-widest uppercase">
                  Soul Identity
                </p>
                {profile.is_private && <Lock className="w-4 h-4 text-red-400" />}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
                @{profile.username}
              </h1>
              {profile.full_name && (
                <p className="text-xl text-zinc-400 font-serif italic mb-4">
                  {profile.full_name}
                </p>
              )}
              {profile.bio && (
                <p className="text-zinc-500 max-w-lg leading-relaxed">
                  "{profile.bio}"
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="stat-pill-premium">
                <p className="text-3xl font-bold text-orange-400">{iousReceived.length}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Radiance</p>
              </div>
              <div className="stat-pill-premium">
                <p className="text-3xl font-bold text-amber-400">{totalResonance}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Resonance</p>
              </div>
            </div>
          </div>
        )}

        {isOwner && !editing && (
          <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-white/10">
            <button onClick={() => setEditing(true)} className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-600">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <Link to="/create" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">
              Create Ripple
            </Link>
          </div>
        )}
      </motion.div>

      {/* Given/Received Tabs */}
      {isOwner && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'received' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Received ({iousReceived.length})
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'given' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Given ({iousGiven.length})
          </button>
        </div>
      )}

      {/* Mind Map - Connections Network */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-orange-400">◇</span>
          Connection Network
        </h2>
        <MindMap profileId={profile.id} currentUsername={profile.username} />
      </motion.div>

      {/* Ledger Entries */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-orange-400">◈</span>
          {activeTab === 'received' ? 'Received' : 'Given'}
        </h2>

        {displayIous.length === 0 ? (
          <div className="text-center py-16 card-luxury">
            <div className="text-5xl mb-4">✦</div>
            <p className="text-zinc-400 text-lg mb-2">{PROFILE_COPY.no_entries}</p>
            {!isOwner && (
              <Link to="/create" className="btn-luxury inline-flex mt-4">
                {PROFILE_COPY.create_first}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayIous.map((iou, i) => (
              <IOUCardPremium key={iou.id} iou={iou} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
