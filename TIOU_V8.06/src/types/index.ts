export interface Profile {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface IOU {
  id: string
  creator_id: string
  receiver_id: string
  taxonomy: TaxonomyType
  narrative: string
  media_urls: string[] | null
  created_at: string
  creator?: Profile
  receiver?: Profile
  ripples?: Ripple[]
  ripple_count?: number
}

export type TaxonomyType = 
  | 'EMOTIONAL' | 'TIME' | 'PRESENCE' | 'CREATIVE' | 'SACRIFICIAL'
  | 'STEADFAST' | 'RADIANT' | 'WISDOM' | 'NURTURING' | 'ADVENTURE'
  | 'GRIT' | 'LOYALTY' | 'CURIOSITY' | 'BLISS' | 'COURAGE'
  | 'HUMILITY' | 'PATIENCE' | 'GENEROSITY' | 'INTEGRITY' | 'PASSION'
  | 'VITALITY' | 'UNITY' | 'FORGIVENESS' | 'PLAYFUL' | 'HEALING'
  | 'ALCHEMY' | 'SOUL'

export const TAXONOMY_MAP: Record<TaxonomyType, { icon: string; label: string; color: string }> = {
  EMOTIONAL: { icon: 'ph-heart', label: 'Soul', color: 'red' },
  SOUL: { icon: 'ph-heart', label: 'Soul', color: 'red' },
  TIME: { icon: 'ph-hourglass-medium', label: 'Time', color: 'blue' },
  PRESENCE: { icon: 'ph-sparkle', label: 'Presence', color: 'yellow' },
  CREATIVE: { icon: 'ph-palette', label: 'Alchemy', color: 'purple' },
  ALCHEMY: { icon: 'ph-palette', label: 'Alchemy', color: 'purple' },
  SACRIFICIAL: { icon: 'ph-hand-heart', label: 'Offering', color: 'orange' },
  STEADFAST: { icon: 'ph-anchor', label: 'Anchor', color: 'cyan' },
  RADIANT: { icon: 'ph-sun', label: 'Luminous', color: 'yellow' },
  WISDOM: { icon: 'ph-brain', label: 'Insight', color: 'indigo' },
  NURTURING: { icon: 'ph-plant', label: 'Vitality', color: 'green' },
  ADVENTURE: { icon: 'ph-compass', label: 'Quest', color: 'rose' },
  GRIT: { icon: 'ph-hammer', label: 'Steel', color: 'gray' },
  LOYALTY: { icon: 'ph-shield-check', label: 'Loyal', color: 'blue' },
  CURIOSITY: { icon: 'ph-magnifying-glass', label: 'Seek', color: 'emerald' },
  BLISS: { icon: 'ph-butterfly', label: 'Euphor', color: 'pink' },
  COURAGE: { icon: 'ph-target', label: 'Lion', color: 'red' },
  HUMILITY: { icon: 'ph-waves', label: 'Grace', color: 'blue' },
  PATIENCE: { icon: 'ph-wind', label: 'Zen', color: 'gray' },
  GENEROSITY: { icon: 'ph-gift', label: 'Nobility', color: 'orange' },
  INTEGRITY: { icon: 'ph-scales', label: 'Honor', color: 'slate' },
  PASSION: { icon: 'ph-flame', label: 'Ignite', color: 'orange' },
  VITALITY: { icon: 'ph-lightning', label: 'Pulse', color: 'yellow' },
  UNITY: { icon: 'ph-users-three', label: 'Circle', color: 'blue' },
  FORGIVENESS: { icon: 'ph-bird', label: 'Release', color: 'blue' },
  PLAYFUL: { icon: 'ph-confetti', label: 'Spark', color: 'pink' },
  HEALING: { icon: 'ph-first-aid', label: 'Mend', color: 'red' },
}

export const TAXONOMY_BACKDROPS: Record<string, string> = {
  EMOTIONAL: 'https://images.unsplash.com/photo-1518199266791-bd373292454a?q=80&w=1000&auto=format&fit=crop',
  SOUL: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=1000&auto=format&fit=crop',
  RADIANT: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop',
  VITALITY: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
  BLISS: 'https://images.unsplash.com/photo-1499209974431-9eaa37a11144?q=80&w=1000&auto=format&fit=crop',
  FORGIVENESS: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
  HEALING: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop',
  NURTURING: 'https://images.unsplash.com/photo-1416870213491-c9303e65a50e?q=80&w=1000&auto=format&fit=crop',
  TIME: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop',
  STEADFAST: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
  PATIENCE: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=1000&auto=format&fit=crop',
  PRESENCE: 'https://images.unsplash.com/photo-1528722828814-77b9b83acfbd?q=80&w=1000&auto=format&fit=crop',
  UNITY: 'https://images.unsplash.com/photo-1529156069898-49953e39b30f?q=80&w=1000&auto=format&fit=crop',
  PLAYFUL: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop',
  LOYALTY: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop',
  CURIOSITY: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
  CREATIVE: 'https://images.unsplash.com/photo-1460661419201-cl8a6b106c5b?q=80&w=1000&auto=format&fit=crop',
  ALCHEMY: 'https://images.unsplash.com/photo-1532187863486-abf9d3a35223?q=80&w=1000&auto=format&fit=crop',
  WISDOM: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000&auto=format&fit=crop',
  PASSION: 'https://images.unsplash.com/photo-1464802686167-b939a67a06f1?q=80&w=1000&auto=format&fit=crop',
  ADVENTURE: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop',
  SACRIFICIAL: 'https://images.unsplash.com/photo-1518049360730-330ef7cae944?q=80&w=1000&auto=format&fit=crop',
  GRIT: 'https://images.unsplash.com/photo-1530124566582-a618bc2615ad?q=80&w=1000&auto=format&fit=crop',
  COURAGE: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?q=80&w=1000&auto=format&fit=crop',
  INTEGRITY: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop',
  GENEROSITY: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop',
  HUMILITY: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop',
}

export const SPARK_SUGGESTIONS: Partial<Record<TaxonomyType, string[]>> = {
  EMOTIONAL: ["You held space for me when...", "Felt so seen when you...", "Support during the transition..."],
  TIME: ["Grateful for the help with...", "You gave me back my time by...", "Showing up for that hour meant..."],
  CREATIVE: ["This piece you made changed...", "Your unique eye transformed...", "Lending your magic to the project..."],
  PRESENCE: ["Your face in the crowd was...", "Just being there was enough...", "I wasn't alone because..."],
  SACRIFICIAL: ["I know what it cost you...", "Your huge sacrifice for me...", "Putting my needs above yours..."],
  STEADFAST: ["Never wavering even when...", "You stood by me during...", "The anchor in my storm..."],
  RADIANT: ["You lit up the room by...", "The energy you brought to...", "Your joy today was contagious..."],
  WISDOM: ["That insight you shared about...", "Your guidance helped me see...", "Pure wisdom when you said..."],
  NURTURING: ["The way you cared for...", "Healing energy when I was...", "Gentle encouragement during..."],
  ADVENTURE: ["The wild journey we took...", "Spur of moment trip to...", "Bringing the thrill of the new..."],
  GRIT: ["The way you powered through...", "Never giving up on...", "Your determination during..."],
  LOYALTY: ["Sticking with me through...", "Friendship shown when...", "You have my back..."],
  CURIOSITY: ["Asking why about...", "Exploring the depths of...", "The way you seek to learn..."],
  BLISS: ["Total joy when...", "Pure magic in the moment...", "You brought high vibration..."],
  COURAGE: ["Facing fear for...", "Standing for what is right...", "Bravery in face of..."],
  HUMILITY: ["Grace you showed during...", "Knowing when to be quiet...", "Ego aside for..."],
  PATIENCE: ["Waiting for right time...", "Calm you kept during...", "Giving me space to grow..."],
  GENEROSITY: ["Above and beyond with...", "Gift of your...", "Sharing everything with..."],
  INTEGRITY: ["Doing right thing for...", "Being true to your word...", "Strength of character in..."],
  PASSION: ["Fire you put into...", "You inspired me by...", "Love for what you do..."],
  VITALITY: ["Life energy brought to...", "Recharging my soul with...", "You made me feel alive..."],
  UNITY: ["Bringing us together for...", "Building the bridge during...", "One frequency, one heart..."],
  FORGIVENESS: ["Letting old weight go...", "Moving forward with peace...", "Returning to the light after..."],
  PLAYFUL: ["Lightening the vibe with...", "Remembering to be child...", "Laughter shared during..."],
  HEALING: ["The way you mended my...", "Balm for my soul when...", "Spirit restoration via..."],
}

export interface Ripple { id: string; iou_id: string; user_id: string; created_at: string; user?: Profile }
export interface Message { id: string; sender_id: string; receiver_id: string; content: string; created_at: string; sender?: Profile; receiver?: Profile }
export interface Notification { id: string; user_id: string; type: NotificationType; reference_id: string | null; message: string; is_read: boolean; created_at: string }
export type NotificationType = 'iou_created' | 'ripple_added' | 'friend_request' | 'friend_accepted' | 'message_received'
