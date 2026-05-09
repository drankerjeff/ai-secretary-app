import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })

export class AssemblyAIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssemblyAIError'
  }
}

/**
 * Submit an audio file URL to AssemblyAI for transcription.
 * Returns the transcription job ID (assemblyai_id) to be polled later.
 */
export async function createTranscription(audioUrl: string): Promise<string> {
  let transcript
  try {
    transcript = await client.transcripts.submit({
      audio_url: audioUrl,
      speech_models: ['universal-2'],
      language_code: 'ja',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AssemblyAI submission failed'
    throw new AssemblyAIError(message)
  }

  return transcript.id
}

export interface TranscriptionStatusResult {
  status: 'queued' | 'processing' | 'completed' | 'error'
  text?: string
  error?: string
}

/**
 * Poll AssemblyAI for the current status of a transcription job.
 */
export async function getTranscriptionStatus(
  transcriptionId: string
): Promise<TranscriptionStatusResult> {
  let transcript
  try {
    transcript = await client.transcripts.get(transcriptionId)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AssemblyAI status check failed'
    throw new AssemblyAIError(message)
  }

  const status = transcript.status as TranscriptionStatusResult['status']

  if (status === 'completed') {
    return { status, text: transcript.text ?? undefined }
  }

  if (status === 'error') {
    return { status, error: transcript.error ?? 'Transcription failed' }
  }

  return { status }
}
