import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET_NAME = 'audio-files'

/**
 * Upload an audio buffer to Supabase Storage under the given user's prefix.
 * Creates the bucket if it does not exist (private bucket).
 * Returns the public URL of the uploaded file.
 */
export async function uploadAudioToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  userId: string
): Promise<string> {
  const supabase = createAdminClient()

  // Ensure bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    throw new Error(`Failed to list storage buckets: ${listError.message}`)
  }

  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME) ?? false
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
    })
    if (createError) {
      throw new Error(`Failed to create storage bucket: ${createError.message}`)
    }
  }

  const ext = filename.split('.').pop()?.toLowerCase() ?? 'bin'
  const safeFilename = `${Date.now()}.${ext}`
  const storagePath = `${userId}/${safeFilename}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Failed to upload audio file: ${uploadError.message}`)
  }

  // Generate a signed URL valid for 24 hours so AssemblyAI can fetch the file
  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 60 * 60 * 24)

  if (signedError || !signedData?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${signedError?.message ?? 'unknown error'}`)
  }

  return signedData.signedUrl
}
