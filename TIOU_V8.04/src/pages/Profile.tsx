import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Profile as ProfileType, IOU } from '../types'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import IOUCard from '../components/IOUCard'

export default function Profile() {
  const { username } = useParams()
  const { profile: currentUser, user, updateProfile } = useAuthStore()
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [ious, setIous] = useState<IOU[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ full_name: '', bio: '', avatar_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadProfile() }, [username])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const lookupName = username || currentUser?.username
      if (!lookupName) return

      const { data: profileData } = await supabase.from('profiles').select('*').eq('username', lookupName.toLowerCase()).single()

      if (!profileData) { setLoading(false); return }

      setProfile(profileData)
      setEditData({ full_name: profileData.full_name || '', bio: profileData.bio || '', avatar_url: profileData.avatar_url || '' })

      const { data: iousData } = await supabase.from('ious')
        .select('*, creator:creator_id(username, avatar_url, full_name), receiver:receiver_id(username, avatar_url, full_name), ripples:ripples(count)')
        .eq('receiver_id', profileData.id).order('created_at', { ascending: false }).limit(50)

      const mapped = (iousData || []).map(iou => ({ ...iou, ripple_count: iou.ripples?.[0]?.count || 0 }))
      setIous(mapped)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile(editData)
    if (!error) { setIsEditing(false); loadProfile() }
    setSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)
    try {
      const { data } = await supabase.storage.from('iou_images').upload(`avatars/${Date.now()}_${file.name}`, file)
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('iou_images').getPublicUrl(data.path)
        setEditData({ ...editData, avatar_url: publicUrl })
      }
    } catch (error) { console.error('Error:', error) }
    finally { setSaving(false) }
  }

  const togglePrivacy = async () => {
    if (!profile) return
    await supabase.from('profiles').update({ is_private: !profile.is_private }).eq('id', profile.id)
    loadProfile()
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!profile) return <div className="text-center py-20 card"><h2 className="text-2xl font-bold mb-4">Profile not found</h2><Link to="/" className="btn-primary"><ArrowLeft className="w-5 h-5" />Back to Home</Link></div>

  const isOwner = user?.id === profile.id
  const totalResonance = ious.reduce((a, b) => a + (b.ripple_count || 0), 0)

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-surface-muted hover:text-surface-text mb-6"><ArrowLeft className="w-5 h-5" />Return to Ledger</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl mb-16">
        <div className="dashboard-centered">
          <div className="avatar-frame"> 
            <div className="avatar-v30"> 
              {(isEditing ? editData.avatar_url : profile.avatar_url) ? 
                <img src={isEditing ? editData.avatar_url : profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-200">{profile.username[0].toUpperCase()}</div>}
              {isEditing && <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"><i className="ph-bold ph-camera text-white text-3xl" /><input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} /></label>}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            {isEditing ? (
              <div className="space-y-4 w-full max-w-md">
                <div><label className="text-micro text-gray-400 mb-2 block">Display Name</label><input type="text" value={editData.full_name} onChange={e => setEditData({...editData, full_name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-center text-xl font-bold" placeholder="Display Name" /></div>
                <div><label className="text-micro text-gray-400 mb-2 block">Soul Proclamation</label><textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-sm text-center resize-none h-20" placeholder="Your bio..." /></div>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900">{profile.full_name || `@${profile.username}`}</h1>
                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] my-4">@{profile.username}</p>
                {profile.bio && <p className="text-sm md:text-base font-medium text-slate-500 max-w-lg italic mx-auto">"{profile.bio}"</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            {!isEditing && (
              <div className="flex gap-6 justify-center flex-wrap">
                <div className="stat-pill-modern stat-radiance flex-1 max-w-[160px]"><p className="text-3xl font-black text-orange-600">{ious.length}</p><p className="text-micro text-orange-400">Radiance</p></div>
                <div className="stat-pill-modern stat-resonance flex-1 max-w-[160px]"><p className="text-3xl font-black text-blue-600">{totalResonance}</p><p className="text-micro text-blue-400">Resonance</p></div>
              </div>
            )}

            {isOwner && (
              <div className="flex items-center gap-3 pt-4">
                {isEditing ? (
                  <button onClick={handleSave} disabled={saving} className="px-12 py-3 bg-orange-600 text-white rounded-full font-black">{saving ? 'Saving...' : 'Commit'}</button>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-black hover:border-orange-600">Modify</button>
                    <button onClick={togglePrivacy} className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-black hover:border-orange-600">{profile.is_private ? <><Lock className="w-4 h-4 inline" /> Secure</> : 'Open'}</button>
                  </>
                )}
                {isEditing && <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-100 rounded-full font-black">Cancel</button>}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="space-y-8 pb-20">
        <div className="flex justify-between border-b pb-4"><h2 className="text-xl font-black italic">Recorded Frequency.</h2><span className="text-micro text-gray-300">{ious.length} Entries</span></div>
        {ious.length === 0 ? <div className="text-center py-12 card"><p className="text-surface-muted">No IOUs yet</p></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{ious.map((iou, i) => <motion.div key={iou.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}><IOUCard iou={iou} /></motion.div>)}</div>}
      </div>
    </div>
  )
}
