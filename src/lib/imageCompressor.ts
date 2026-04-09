import { supabase } from './supabase'

const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 0.75

function resizeToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let w = img.width
      let h = img.height

      if (w > MAX_WIDTH || h > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        blob => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/webp',
        QUALITY,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export async function compressAndUpload(file: File): Promise<string> {
  const blob = await resizeToBlob(file)
  const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

  const { error } = await supabase.storage.from('uploads').upload(path, blob, {
    contentType: 'image/webp',
    upsert: true,
  })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from('uploads').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const path = `forum/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from('uploads').upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from('uploads').getPublicUrl(path)
  return data.publicUrl
}
