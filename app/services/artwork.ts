import { API } from '~/shared/api-paths'

export interface ArtworkDetected {
  pages: number | null
  width_mm: number | null
  height_mm: number | null
  size_label?: string | null
}

export interface ArtworkPageSize {
  width_mm: number
  height_mm: number
  label?: string | null
}

export interface ArtworkBookletAnalysis {
  raw_pages: number
  normalized_pages: number
  cover_pages: number
  insert_pages: number
  needs_rule_of_4_padding: boolean
}

export interface ArtworkSuggestion {
  field: string
  value: string | number
  label?: string
  confidence?: 'low' | 'medium' | 'high'
}

export interface ArtworkSuggestedProduct {
  type: string
  label: string
  confidence: 'low' | 'medium' | 'high'
  reason: string
}

export interface ArtworkUploadResponse {
  artwork_id: number
  file_url: string
  preview_image: string | null
  upload_status: 'idle' | 'uploading' | 'uploaded' | 'failed'
  analysis_status: 'idle' | 'analysing' | 'analysed' | 'success' | 'manual_review' | 'failed' | 'skipped'
  analysis_error: string | null
  analysis_warnings: string[]
  detected_pages: number | null
  detected_width_mm: number | null
  detected_height_mm: number | null
  detected: ArtworkDetected | null
  detected_product_type?: string | null
  page_count?: number | null
  page_sizes?: ArtworkPageSize[]
  dominant_page_size?: ArtworkPageSize | null
  has_mixed_page_sizes?: boolean
  booklet?: ArtworkBookletAnalysis | null
  suggested_product: ArtworkSuggestedProduct | null
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
