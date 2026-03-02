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

  const handleSelectRecent = async (username: string) => {
    setInput({ ...input, receiver: username })
    const { data } = await supabase.from('profiles').select('id, username').ilike('username', username).single()
    if (data) {
      setReceiverProfile(data)
      setStep(1)
    }
  }

  const handleReceiverSearch = async () => {
    if (!input.receiver) return
    const { data } = await supabase.from('profiles').select('id, username').ilike('username', input.receiver.replace('@', '')).single()
    if (data) { setReceiverProfile(data); setStep(1); } 
    else alert('Soul handle not found.')
  }

  const handleTaxonomySelect = (key: TaxonomyType) => {
    setInput({ ...input, taxonomy: key })
    setStep(2)
  }

  const handleMessageSubmit = () => {
    if (input.message.trim()) {
      setStep(3)
    }
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
      const dbTaxonomy = TAXONOMY_DB_MAP[input.taxonomy] || 'EMOTIONAL'
      const { error } = await supabase.from('ious').insert({ 
        creator_id: user.id, 
        receiver_id: receiverProfile.id, 
        taxonomy: dbTaxonomy, 
        narrative: `${input.taxonomy} | ${input.message}`, 
        media_urls: input.image ? [input.image] : []
      }).select()
      if (error) throw error
      navigate('/')
    } catch (err: any) { 
      console.error('Submit error:', err)
      setError(err.message || 'Failed to commit') 
    }
    finally { setLoading(false); }
  }

  const taxonomyEntries = Object.entries(TAXONOMY_MAP) as [TaxonomyType, { label: string }][]

  const StepIcon = ({ num, active, completed }: { num: number; active: boolean; completed: boolean }) => (
    <motion.div 
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        completed 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-[0_0_20px_rgba(74,222,128,0.6)]' 
          : active 
            ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-[0_0_20px_rgba(251,146,60,0.6)]'
            : 'bg-zinc-700 text-zinc-400'
      }`}
      animate={active ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {completed ? <Check className="w-5 h-5" /> : num}
    </motion.div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress Steps - Glowing Circles */}
      <div className="flex items-center justify-center mb-6 gap-2">
        {['Select Soul', 'Frequency', 'Tell Story', 'Capture', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center">
            <StepIcon num={i + 1} active={step === i} completed={step > i} />
            {i < 4 && (
              <motion.div 
                className={`w-8 h-0.5 mx-1 rounded-full ${i < step ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-zinc-700'}`}
              />
            )}
          </div>
        ))}
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm font-bold">{error}</div>}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-zinc-800 rounded-3xl p-5 shadow-xl max-w-sm mx-auto">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)]"><span className="text-2xl text-white">@</span></div>
              <h2 className="text-xl font-black mb-1 text-white">Who do you honor?</h2>
              <p className="text-zinc-500 text-sm">Enter the soul handle</p>
            </div>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl font-black">@</span>
              <input value={input.receiver} onChange={e => setInput({ ...input, receiver: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleReceiverSearch()}
                className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-lg font-bold text-white placeholder-zinc-500 focus:border-orange-500 outline-none" placeholder="handle" />
            </div>
            {recentRecipients.length > 0 && (
              <div className="pt-2 pb-2">
                <p className="text-xs font-bold uppercase text-zinc-500 mb-2">Recently honored:</p>
                <div className="flex flex-wrap gap-2">
                  {recentRecipients.map(u => (
                    <button 
                      key={u} 
                      onClick={() => handleSelectRecent(u)}
                      className="px-3 py-1.5 rounded-lg border-2 border-orange-500/50 bg-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white transition-all"
                    >
                      @{u}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleReceiverSearch} disabled={!input.receiver} className="w-full mt-3 bg-orange-500 text-white py-2.5 rounded-xl font-bold transition disabled:opacity-40 shadow-[0_0_20px_rgba(249,115,22,0.4)]">Continue <ArrowRight className="w-4 h-4 inline" /></button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-zinc-800 rounded-3xl p-4 shadow-xl">
            <p className="text-xs font-bold uppercase text-zinc-500 mb-3 ml-1">Select Frequency</p>
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {taxonomyEntries.map(([key, { label }]) => (
                <button key={key} onClick={() => handleTaxonomySelect(key)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all ${input.taxonomy === key ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'}`}>
                  <span className="text-xl mb-0.5">{TAXONOMY_ICONS[key] || '✨'}</span>
                  <span className={`text-[7px] font-bold ${input.taxonomy === key ? 'text-orange-400' : 'text-zinc-500'}`}>{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="w-full bg-zinc-700 text-zinc-300 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-600"><ArrowLeft className="w-4 h-4" /> Back</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-zinc-800 rounded-3xl p-5 shadow-xl">
            <div className="text-center mb-3">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]"><span className="text-2xl text-white">✍️</span></div>
              <h2 className="text-xl font-black mb-1 text-white">Tell the story</h2>
              <p className="text-zinc-500 text-sm">What happened between you?</p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">{SPARK_SUGGESTIONS[input.taxonomy]?.map(s => <button key={s} onClick={() => { setInput({ ...input, message: s }); setStep(3); }} className="px-2 py-1 bg-zinc-700 hover:bg-orange-500/50 text-[10px] font-medium text-zinc-300 hover:text-white rounded-full transition-all">{s}</button>)}</div>
              <textarea value={input.message} onChange={e => setInput({ ...input, message: e.target.value })} onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleMessageSubmit(); }}
                className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-xl p-3 text-base font-medium text-white placeholder-zinc-500 focus:border-orange-500 outline-none resize-none" rows={3} placeholder="Describe the moment..." />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setStep(1)} className="px-3 py-2 bg-zinc-700 text-zinc-300 rounded-lg font-bold flex items-center gap-1 hover:bg-zinc-600"><ArrowLeft className="w-3 h-3" /> Back</button>
              <button onClick={handleMessageSubmit} disabled={!input.message} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold disabled:opacity-40 shadow-[0_0_15px_rgba(249,115,22,0.4)]">Evidence →</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-zinc-800 rounded-3xl p-4 shadow-xl">
            <div className="text-center mb-3">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]"><Camera className="w-6 h-6 text-white" /></div>
              <h2 className="text-lg font-black mb-1 text-white">Capture (optional)</h2>
            </div>
            <div className="flex gap-2 mb-3">
              <label className="flex-1 py-2 text-xs font-bold uppercase bg-zinc-900 text-white rounded-xl text-center cursor-pointer hover:bg-zinc-700 transition"><Image className="w-4 h-4 inline mr-1" /> Gallery<input type="file" accept="image/*,video/*" className="hidden" onChange={handleImageUpload} /></label>
              <button onClick={toggleCamera} className="flex-1 py-2 text-xs font-bold uppercase bg-zinc-900 text-white rounded-xl border-2 border-zinc-700 hover:border-zinc-600 transition"><Camera className="w-4 h-4 inline mr-1" /> Camera</button>
            </div>
            {preview && <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden mb-3"><img src={preview} alt="Preview" className="w-full h-full object-cover" /><button onClick={() => { setPreview(null); setInput({ ...input, image: null }); }} className="absolute top-2 right-2 px-2 py-1 bg-white/20 text-white rounded-lg text-xs">✕</button></div>}
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-3 py-2 bg-zinc-700 text-zinc-300 rounded-lg font-bold hover:bg-zinc-600 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]">{input.image ? 'Continue' : 'Skip'}</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-zinc-800 rounded-3xl p-5 shadow-xl">
            <div className="text-center mb-3">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]"><Check className="w-6 h-6 text-white" /></div>
              <h2 className="text-lg font-black text-white">Ready to commit</h2>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-lg">{TAXONOMY_ICONS[input.taxonomy]}</div><div><p className="text-[10px] uppercase font-bold text-zinc-500">Frequency</p><p className="font-black text-white">{input.taxonomy}</p></div></div>
              <hr className="border-zinc-700" />
              <div><p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Narrative</p><p className="text-sm font-medium italic text-zinc-300">"{input.message}"</p></div>
              <hr className="border-zinc-700" />
              <div><p className="text-[10px] uppercase font-bold text-zinc-500">To</p><p className="font-black text-lg text-white">@{receiverProfile?.username}</p></div>
              {input.image && <img src={input.image} alt="Evidence" className="w-full rounded-xl" />}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setStep(3)} className="px-3 py-2 bg-zinc-700 text-zinc-300 rounded-lg font-bold hover:bg-zinc-600 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold disabled:opacity-40 shadow-[0_0_15px_rgba(249,115,22,0.4)]">{loading ? '...' : <><Sparkles className="w-4 h-4 inline mr-1" />Commit</>}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
