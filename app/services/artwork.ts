import { API } from '~/shared/api-paths'

export interface ArtworkDetected {
  pages: number | null
  width_mm: number | null
  height_mm: number | null
}

export interface ArtworkSuggestion {
  field: string
  value: string | number
}

export interface ArtworkUploadResponse {
  artwork_id: number
  file_url: string
  upload_status: 'idle' | 'uploading' | 'uploaded' | 'failed'
  analysis_status: 'idle' | 'analysing' | 'analysed' | 'failed' | 'skipped'
  analysis_error: string | null
  detected: ArtworkDetected | null
  suggestions: ArtworkSuggestion[]
  warnings: string[]
  confidence: string | null
}

export interface UploadProgressEvent {
  loaded: number
  total: number
}

export function uploadArtworkXHR(
  file: File,
  apiBase: string,
  onProgress: (event: UploadProgressEvent) => void,
  signal?: AbortSignal,
): Promise<ArtworkUploadResponse> {
  return new Promise((resolve, reject) => {
    const url = `${apiBase}${API.artworkUpload()}`
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress({ loaded: event.loaded, total: event.total })
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as ArtworkUploadResponse)
        } catch {
          reject(new Error('Invalid server response'))
        }
      } else {
        let message = 'Upload failed'
        try {
          const body = JSON.parse(xhr.responseText) as Record<string, unknown>
          message = String(body.error ?? body.detail ?? body.message ?? message)
        } catch {
          // Fall back to the default message when the server response is not JSON.
        }
        reject(new Error(message))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.onabort = () => reject(new DOMException('Upload cancelled', 'AbortError'))

    if (signal) {
      signal.addEventListener('abort', () => xhr.abort())
    }

    xhr.open('POST', url)
    xhr.setRequestHeader('Accept', 'application/json')

    const formData = new FormData()
    formData.append('file', file)
    xhr.send(formData)
  })
}
