import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TaxonomyType } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Content Polish Function - transforms raw input into polished display
export function polishContent(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return ''
  let cleaned = text.trim()
  
  // Filter out super short garbage
  if (cleaned.length < 8 && !cleaned.includes(' ')) return ''
  
  // Common misspellings fix
  const misspellings: Record<string, string> = {
    'remeber': 'remember', 'rember': 'remember', 'lemeb er': 'remember',
    'thier': 'their', 'teh': 'the', 'loe': 'love', 'luv': 'love',
    'bra': 'bro', 'yah': 'yeah', 'ya': 'you', 'u ': 'you ',
    'gonna': 'going to', 'wanna': 'want to', 'gotta': 'got to',
    'totally!': 'totally.', 'awesome!': 'awesome.', 'cool!': 'cool.',
    'thanks...': 'thanks.', '  ': ' '
  }
  
  const lower = cleaned.toLowerCase()
  for (const [bad, good] of Object.entries(misspellings)) {
    if (lower.includes(bad)) {
      cleaned = cleaned.replace(new RegExp(bad, 'gi'), good)
    }
  }
  
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  
  // Add period if missing
  if (cleaned.length > 0 && 
      !cleaned.endsWith('.') && 
      !cleaned.endsWith('!') && 
      !cleaned.endsWith('?') && 
      !cleaned.endsWith('"')) {
    cleaned += '.'
  }
  
  return cleaned
}

// Extract taxonomy from narrative (format: "TAXONOMY | message")
export function extractFromNarrative(narrative: string): { taxonomy: TaxonomyType; message: string } {
  if (narrative.includes(' | ')) {
    const parts = narrative.split(' | ')
    const possibleTaxonomy = parts[0]?.trim().toUpperCase()
    
    // Check if it's a valid taxonomy
    const validTaxonomies: TaxonomyType[] = [
      'EMOTIONAL', 'TIME', 'PRESENCE', 'CREATIVE', 'SACRIFICIAL',
      'STEADFAST', 'RADIANT', 'WISDOM', 'NURTURING', 'ADVENTURE',
      'GRIT', 'LOYALTY', 'CURIOSITY', 'BLISS', 'COURAGE',
      'HUMILITY', 'PATIENCE', 'GENEROSITY', 'INTEGRITY', 'PASSION',
      'VITALITY', 'UNITY', 'FORGIVENESS', 'PLAYFUL', 'HEALING'
    ]
    
    if (possibleTaxonomy && validTaxonomies.includes(possibleTaxonomy as TaxonomyType)) {
      return {
        taxonomy: possibleTaxonomy as TaxonomyType,
        message: parts.slice(1).join(' | ')
      }
    }
  }
  
  return {
    taxonomy: 'EMOTIONAL',
    message: narrative
  }
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return then.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
