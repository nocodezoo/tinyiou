import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { TaxonomyType, TAXONOMY_MAP, SPARK_SUGGESTIONS } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Sparkles, Image, Camera } from 'lucide-react'

const TAXONOMY_ICONS: Record<string, string> = {
  EMOTIONAL: '💗', SOUL: '💗', TIME: '⏳', PRESENCE: '✨', CREATIVE: '🎨', ALCHEMY: '🎨',
  SACRIFICIAL: '🤝', STEADFAST: '⚓', RADIANT: '☀️', WISDOM: '🧠', NURTURING: '🌱',
  ADVENTURE: '🧭', GRIT: '🔨', LOYALTY: '🛡️', CURIOSITY: '🔍', BLISS: '🦋', COURAGE: '🎯',
  HUMILITY: '🌊', PATIENCE: '🍃', GENEROSITY: '🎁', INTEGRITY: '⚖️', PASSION: '🔥',
  VITALITY: '⚡', UNITY: '👥', FORGIVENESS: '🕊️', PLAYFUL: '🎉', HEALING: '💊',
}

// Map full taxonomy to DB enum values
const TAXONOMY_DB_MAP: Record<string, string> = {
  EMOTIONAL: 'EMOTIONAL', SOUL: 'EMOTIONAL', RADIANT: 'EMOTIONAL', VITALITY: 'EMOTIONAL', 
  BLISS: 'EMOTIONAL', FORGIVENESS: 'EMOTIONAL', HEALING: 'EMOTIONAL', NURTURING: 'EMOTIONAL',
  TIME: 'TIME', STEADFAST: 'TIME', PATIENCE: 'TIME',
  PRESENCE: 'PRESENCE', UNITY: 'PRESENCE', PLAYFUL: 'PRESENCE', LOYALTY: 'PRESENCE', CURIOSITY: 'PRESENCE',
  CREATIVE: 'CREATIVE', WISDOM: 'CREATIVE', PASSION: 'CREATIVE', ADVENTURE: 'CREATIVE', ALCHEMY: 'CREATIVE',
  SACRIFICIAL: 'SACRIFICIAL', GRIT: 'SACRIFICIAL', COURAGE: 'SACRIFICIAL', INTEGRITY: 'SACRIFICIAL', 
  GENEROSITY: 'SACRIFICIAL', HUMILITY: 'SACRIFICIAL',
}

export default function CreateIOU() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [input, setInput] = useState({ receiver: '', taxonomy: 'EMOTIONAL' as TaxonomyType, message: '', image: '' as string | null })
  const [receiverProfile, setReceiverProfile] = useState<{ id: string; username: string } | null>(null)
  const [recentRecipients, setRecentRecipients] = useState<string[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!user) return
    const fetchRecent = async () => {
      const { data } = await supabase.from('ious').select('receiver:receiver_id(username)').eq('creator_id', user.id).order('created_at', { ascending: false }).limit(6)
      const usernames = [...new Set(data?.map((i: any) => i.receiver?.username).filter(Boolean))] as string[]
      setRecentRecipients(usernames.slice(0, 3))
    }
    fetchRecent()
  }, [user])

  const handleReceiverSearch = async () => {
    if (!input.receiver) return
    const { data } = await supabase.from('profiles').select('id, username').ilike('username', input.receiver.replace('@', '')).single()
    if (data) { setReceiverProfile(data); setStep(1); } 
    else alert('Soul handle not found.')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from('iou_images').upload(`p_${Date.now()}`, file)
      if (error) throw error
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('iou_images').getPublicUrl(data.path)
        setInput({ ...input, image: publicUrl })
        setPreview(publicUrl)
      }
    } catch (error) { console.error(error); alert('Upload failed.'); }
    finally { setLoading(false); }
  }

  const toggleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch (e) { alert('Camera access denied'); }
  }

  const handleSubmit = async () => {
    if (!user || !receiverProfile || !input.message) return
    setLoading(true)
    setError('')
    try {
      // Map taxonomy to DB enum value
      const dbTaxonomy = TAXONOMY_DB_MAP[input.taxonomy] || 'EMOTIONAL'
      
      console.log('Submitting IOU:', { 
        creator_id: user.id, 
        receiver_id: receiverProfile.id, 
        taxonomy: dbTaxonomy, 
        narrative: `${input.taxonomy} | ${input.message}` 
      })
      
      const { data, error } = await supabase.from('ious').insert({ 
        creator_id: user.id, 
        receiver_id: receiverProfile.id, 
        taxonomy: dbTaxonomy, 
        narrative: `${input.taxonomy} | ${input.message}`, 
        media_urls: input.image ? [input.image] : []
      }).select()
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('IOU created:', data)
      navigate('/')
    } catch (err: any) { 
      console.error('Submit error:', err)
      setError(err.message || 'Failed to commit') 
    }
    finally { setLoading(false); }
  }

  const taxonomyEntries = Object.entries(TAXONOMY_MAP) as [TaxonomyType, { label: string }][]

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        {['Select Soul', 'Frequency', 'Tell Story', 'Capture', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${i < step ? 'bg-orange-500 text-white' : i === step ? 'bg-orange-100 text-orange-600 border-2 border-orange-500' : 'bg-gray-100 text-gray-400'}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < 4 && <div className={`w-8 h-0.5 mx-1 rounded-full ${i < step ? 'bg-orange-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold">{error}</div>}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center"><span className="text-3xl">@</span></div>
              <h2 className="text-2xl font-black mb-1 text-gray-900">Who do you honor?</h2>
              <p className="text-gray-500 text-sm">Enter the soul handle</p>
            </div>
            <div className="relative mb-4">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl font-black">@</span>
              <input value={input.receiver} onChange={e => setInput({ ...input, receiver: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleReceiverSearch()}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 pl-12 pr-5 text-xl font-bold text-gray-900 placeholder:text-gray-300 focus:border-orange-400 outline-none" placeholder="handle" />
            </div>
            {recentRecipients.length > 0 && (
              <div className="pt-3 pb-2">
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Recently:</p>
                <div className="flex flex-wrap gap-2">{recentRecipients.map(u => <button key={u} onClick={() => setInput({ ...input, receiver: u })} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:border-orange-400">@{u}</button>)}</div>
              </div>
            )}
            <button onClick={handleReceiverSearch} disabled={!input.receiver} className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-40">Continue <ArrowRight className="w-4 h-4 inline" /></button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-5 shadow-xl">
            <p className="text-xs font-bold uppercase text-gray-400 mb-4 ml-1">Select Frequency</p>
            <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
              {taxonomyEntries.map(([key, { label }]) => (
                <button key={key} onClick={() => setInput({ ...input, taxonomy: key })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${input.taxonomy === key ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                  <span className="text-xl mb-0.5">{TAXONOMY_ICONS[key] || '✨'}</span>
                  <span className={`text-[9px] font-bold ${input.taxonomy === key ? 'text-orange-600' : 'text-gray-500'}`}>{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-bold text-lg italic">Narrative →</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><span className="text-3xl">✍️</span></div>
              <h2 className="text-2xl font-black mb-1 text-gray-900">Tell the story</h2>
              <p className="text-gray-500 text-sm">What happened between you?</p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">{SPARK_SUGGESTIONS[input.taxonomy]?.map(s => <button key={s} onClick={() => setInput({ ...input, message: s })} className="px-2 py-1 bg-gray-100 hover:bg-orange-100 text-[10px] font-medium text-gray-600 rounded-full">{s}</button>)}</div>
              <textarea value={input.message} onChange={e => setInput({ ...input, message: e.target.value })} className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-base font-medium text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 outline-none resize-none" rows={3} placeholder="Describe the moment..." />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
              <button onClick={() => setStep(3)} disabled={!input.message} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold disabled:opacity-40">Evidence →</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-5 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center"><Camera className="w-7 h-7 text-purple-600" /></div>
              <h2 className="text-xl font-black mb-1 text-gray-900">Capture (optional)</h2>
            </div>
            <div className="flex gap-2 mb-3">
              <label className="flex-1 py-3 text-xs font-bold uppercase bg-gray-900 text-white rounded-xl text-center cursor-pointer"><Image className="w-4 h-4 inline mr-1" /> Gallery<input type="file" accept="image/*,video/*" className="hidden" onChange={handleImageUpload} /></label>
              <button onClick={toggleCamera} className="flex-1 py-3 text-xs font-bold uppercase bg-white text-gray-900 rounded-xl border-2 border-gray-200"><Camera className="w-4 h-4 inline mr-1" /> Camera</button>
            </div>
            {preview && <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-3"><img src={preview} alt="Preview" className="w-full h-full object-cover" /><button onClick={() => { setPreview(null); setInput({ ...input, image: null }); }} className="absolute top-2 right-2 px-2 py-1 bg-white/20 text-white rounded-lg text-xs">✕</button></div>}
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold">{input.image ? 'Continue' : 'Skip'}</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center"><Check className="w-7 h-7 text-green-600" /></div>
              <h2 className="text-xl font-black text-gray-900">Ready to commit</h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">{TAXONOMY_ICONS[input.taxonomy]}</div><div><p className="text-[10px] uppercase font-bold text-gray-400">Frequency</p><p className="font-black text-gray-900">{input.taxonomy}</p></div></div>
              <hr className="border-gray-200" />
              <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Narrative</p><p className="text-base font-medium italic text-gray-800">"{input.message}"</p></div>
              <hr className="border-gray-200" />
              <div><p className="text-[10px] uppercase font-bold text-gray-400">To</p><p className="font-black text-lg text-gray-900">@{receiverProfile?.username}</p></div>
              {input.image && <img src={input.image} alt="Evidence" className="w-full rounded-xl" />}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(3)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold">Back</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold disabled:opacity-40">{loading ? '...' : <><Sparkles className="w-4 h-4 inline mr-1" />Commit</>}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
