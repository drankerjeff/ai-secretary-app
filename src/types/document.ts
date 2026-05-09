export type DocumentType = 'email' | 'report' | 'general'

export interface Suggestion {
  type: 'spelling' | 'grammar' | 'style' | 'punctuation'
  original: string
  suggested: string
  explanation: string
}

export interface ProofreadResult {
  documentId: string
  original: string
  corrected: string
  suggestions: Suggestion[]
  createdAt: string
}

export interface ProofreadMetadata {
  suggestions: Suggestion[]
  documentType: DocumentType
}
