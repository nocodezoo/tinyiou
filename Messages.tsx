import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Message, Profile } from '../types'
import { Send, MessageCircle, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'

const EMOJI_PICKER = ['🕊️', '✨', '🧡', '🌱', '🧠', '⛵']

export default function Messages() {
  const { user, profile } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [recentRecipients, setRecentRecipients] = useState<string[]>([])
  const [chatUsers, setChatUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    loadRecentRecipients()
    loadRecentChats()
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadRecentRecipients = async () => {
    if (!user) return
    const { data } = await supabase
      .from('ious')
      .select('receiver:receiver_id(username)')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    const usernames = [...new Set(data?.map((i: any) => i.receiver?.username).filter(Boolean))] as string[]
    setRecentRecipients(usernames.slice(0, 5))
  }

  const loadMessages = async () => {
    if (!user || !selectedUser) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  // Load messages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      loadMessages()
    }
  }, [selectedUser?.id])

  useEffect(() => {
    if (!user) return
    const ch = supabase.channel('mr').on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
    }, () => { loadMessages(); loadRecentChats(); }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [user, selectedUser?.id])

  const loadRecentChats = async () => {
    if (!user) return
    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, sender:sender_id(username, avatar_url, full_name), receiver:receiver_id(username, avatar_url, full_name)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
    
    const userMap = new Map()
    data?.forEach((m: any) => {
      const other = m.sender_id === user.id ? m.receiver : m.sender
      if (other && other.username && !userMap.has(other.id)) userMap.set(other.id, other)
    })
    setChatUsers(Array.from(userMap.values()))
  }

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.trim() || sending) return
    
    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('') // Clear input immediately
    
    try {
      const { error } = await supabase.from('messages').insert({ 
        sender_id: user.id, 
        receiver_id: selectedUser.id, 
        content: messageContent 
      })
      
      if (error) {
        console.error('Send error:', error)
        // Restore message on error
        setNewMessage(messageContent)
        return
      }
      
      // Add message locally immediately for instant feedback
      const newMsg: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: messageContent,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMsg])
      
      // Reload to get proper data
      await loadMessages()
      await loadRecentChats()
      await supabase.from('notifications').insert({
        user_id: selectedUser.id,
        type: 'new_message',
        title: 'New Message',
        body: `${(user as any).username} sent you a message`,
        link: `/messages?user=${(user as any).username}`
      })
    } catch (err) {
      console.error('Send error:', err)
      setNewMessage(messageContent)
    } finally {
      setSending(false)
    }
  }

  const handleSelectRecipient = async (username: string) => {
    const { data } = await supabase.from('profiles').select('id, username, avatar_url').ilike('username', username).single()
    if (data) {
      setSelectedUser(data)
    }
  }

  if (!user) return <div className="text-center py-20 text-white">Please sign in</div>

  return (
    <div className=" mx-auto px-4">
      {/* Header - Alerts style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Resonance</h1>
          <p className="text-zinc-500 text-sm">Chat with your connections</p>
        </div>
      </div>

      {/* Quick Recipient Buttons */}
      {recentRecipients.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recentRecipients.map(u => (
              <button 
                key={u}
                onClick={() => handleSelectRecipient(u)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all ${
                  selectedUser?.username === u 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                @{u}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 md:gap-6 h-[60vh]">
        {/* Chat Window - Dark */}
        <div className="flex-1 bg-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-700 flex items-center gap-3 bg-zinc-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold">
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white">@{selectedUser.username}</h3>
                  <p className="text-xs text-zinc-500">Resonance chat</p>
                </div>
              </div>

              {/* Messages - Dark bg */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-800">
                {messages
                  .filter(m => m.sender_id === selectedUser.id || m.receiver_id === selectedUser.id)
                  .map(m => (
                    <div 
                      key={m.id} 
                      className={cn(
                        'flex',
                        m.sender_id === user.id ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className={cn(
                        'max-w-[80%] p-3 rounded-2xl text-sm font-medium',
                        m.sender_id === user.id 
                          ? 'bg-orange-500 text-white rounded-br-none' 
                          : 'bg-zinc-700 text-white rounded-bl-none'
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Bar */}
              <div className="flex gap-2 p-2 border-t border-zinc-700 bg-zinc-800 overflow-x-auto">
                {EMOJI_PICKER.map(e => (
                  <button 
                    key={e} 
                    onClick={() => setNewMessage(p => p + e)} 
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Input - Black text */}
              <div className="p-3 border-t border-zinc-700 flex gap-2 bg-zinc-800">
                <input 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && !sending && sendMessage()} 
                  className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Type a message..." 
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Or use quick chat buttons above</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
