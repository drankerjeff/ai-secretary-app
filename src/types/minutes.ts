export type MinutesStatus = 'uploading' | 'transcribing' | 'generating' | 'completed' | 'failed'

export interface NextAction {
  task: string
  assignee?: string
  due_date?: string
}

export interface MinutesMetadata {
  assemblyai_id?: string
  status: MinutesStatus
  audio_url?: string
  error?: string
  discussed_topics?: string[]
  decisions?: string[]
  next_actions?: NextAction[]
  summary?: string
}

export interface MinutesDocument {
  id: string
  title: string
  status: MinutesStatus
  transcription?: string
  discussed_topics: string[]
  decisions: string[]
  next_actions: NextAction[]
  summary?: string
  audio_url?: string
  created_at: string
  error?: string
}
