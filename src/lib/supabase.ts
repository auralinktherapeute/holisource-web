import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dqmujlqxpmcwscztrrdt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Therapeute = {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  photo_url?: string
  specialite: string
  ville: string
  code_postal: string
  description: string
  tarif_min?: number
  tarif_max?: number
  modalite: 'presentiel' | 'distanciel' | 'les_deux'
  calendly_url?: string
  slug: string
  statut: 'approved'
}
