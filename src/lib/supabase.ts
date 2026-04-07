import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string ?? ''

if (!url || !key || url.includes('your-project')) {
  console.warn('Supabase environment variables nisu postavljene.')
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder'
)

export interface Topic {
  id: string
  section_id: string
  title: string
  slug: string
  short_desc: string
  subtitle: string
  body: string
  disclaimer: string
  icon_svg: string
  cover_image: string
  visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TopicItem {
  id: string
  topic_id: string
  icon: string
  title: string
  description: string
  link: string
  sort_order: number
}

export interface TopicImage {
  id: string
  topic_id: string
  url: string
  alt: string
  sort_order: number
}

export interface TopicDocument {
  id: string
  topic_id: string
  title: string
  url: string
  file_type: string
  sort_order: number
}

export interface Section {
  id: string
  title: string
  slug: string
  sort_order: number
}

export interface ForumTopic {
  id: string
  title: string
  slug: string
  intro: string
  call_to_action: string
  cover_image: string
  sort_order: number
  created_at: string
}

export interface ForumPost {
  id: string
  topic_id: string
  author_name: string
  is_admin: boolean
  content: string
  image_url: string
  created_at: string
}

export interface ForumReply {
  id: string
  post_id: string
  author_name: string
  is_admin: boolean
  content: string
  image_url: string
  created_at: string
}

export interface SurveyPoll {
  id: string
  title: string
  question: string
  expires_at: string | null
  is_closed: boolean
  sort_order: number
  created_at: string
}

export interface SurveyOption {
  id: string
  poll_id: string
  label: string
  sort_order: number
}

export interface SurveyVote {
  id: string
  poll_id: string
  option_id: string
  voter_name: string
  created_at: string
}

export interface WallPost {
  id: string
  wall_type: 'predlozi' | 'problemi'
  author_name: string
  content: string
  image_url: string
  created_at: string
}

export interface WallReply {
  id: string
  post_id: string
  content: string
  image_url: string
  created_at: string
}

export type ProjectCategory =
  | 'Urbani razvoj'
  | 'Infrastruktura'
  | 'Javni prevoz'
  | 'Životna sredina'
  | 'Glas zajednice'

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Urbani razvoj',
  'Infrastruktura',
  'Javni prevoz',
  'Životna sredina',
  'Glas zajednice',
]

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  status: 'aktivan' | 'zavrsen' | 'planiran'
  cover_image: string
  date_text: string
  partner: string
  category: string
  phase_current: number
  phase_total: number
  progress_pct: number
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface ProjectDocument {
  id: string
  project_id: string
  title: string
  url: string
  file_type: string
  sort_order: number
}

export interface Initiative {
  id: string
  title: string
  slug: string
  description: string
  status: 'aktivan' | 'zavrsen'
  cover_image: string
  date_text: string
  category: string
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface InitiativeDocument {
  id: string
  initiative_id: string
  title: string
  url: string
  file_type: string
  sort_order: number
}

export interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Fond {
  id: string
  name: string
  description: string
  sort_order: number
  visible: boolean
  created_at: string
}

export interface ProjectPhase {
  id: string
  project_id: string
  title: string
  description: string
  status: 'planirano' | 'u_toku' | 'zavrseno'
  cover_image: string
  sort_order: number
  created_at: string
}

export interface Activity {
  id: string
  parent_type: 'project' | 'initiative'
  parent_id: string
  title: string
  slug: string
  activity_date: string
  short_desc: string
  description: string
  goals: string
  status: 'planirano' | 'u_toku' | 'zavrseno'
  cover_image: string
  partners: string
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface ActivityDocument {
  id: string
  activity_id: string
  title: string
  url: string
  file_type: string
  sort_order: number
}

export interface ActivityGalleryImage {
  id: string
  activity_id: string
  url: string
  alt: string
  sort_order: number
}
