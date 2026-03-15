/**
 * Load Google Maps JavaScript API with Places library.
 * Use for autocomplete, geocoding, and map preview in admin forms.
 */
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (el: HTMLElement, opts?: object) => { setCenter: (c: { lat: number; lng: number }) => void; setZoom: (z: number) => void }
        Marker: new (opts?: { map?: unknown; position?: { lat: number; lng: number } }) => { setPosition: (p: { lat: number; lng: number }) => void }
        places: {
          Autocomplete: new (input: HTMLInputElement, opts?: { fields?: string[] }) => {
            addListener: (event: string, cb: () => void) => void
            getPlace: () => {
              geometry?: { location?: { lat: () => number; lng: () => number } }
              name?: string
              formatted_address?: string
              address_components?: Array<{ types: string[]; long_name: string }>
              place_id?: string
            }
          }
        }
      }
    }
  }
}

let googleMapsPromise: Promise<typeof window.google> | null = null

export function useGoogleMaps() {
  const config = useRuntimeConfig()

  const loadGoogleMaps = (): Promise<typeof window.google> => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Google Maps can only load in the browser'))
    }

    if (window.google?.maps) {
      return Promise.resolve(window.google)
    }

    if (googleMapsPromise) {
      return googleMapsPromise
    }

    const apiKey = (config.public.googleMapsApiKey as string) || ''
    if (!apiKey) {
      return Promise.reject(new Error('Google Maps API key not configured (NUXT_PUBLIC_GOOGLE_MAPS_API_KEY)'))
    }

    googleMapsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-google-maps="true"]',
      ) as HTMLScriptElement | null

      if (existing) {
        if (window.google?.maps) {
          resolve(window.google)
        } else {
          existing.addEventListener('load', () => resolve(window.google!))
          existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
        }
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.dataset.googleMaps = 'true'

      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google)
        } else {
          reject(new Error('Google Maps loaded but API unavailable'))
        }
      }

      script.onerror = () => reject(new Error('Failed to load Google Maps'))
      document.head.appendChild(script)
    })

    return googleMapsPromise
  }

  return { loadGoogleMaps }
}
