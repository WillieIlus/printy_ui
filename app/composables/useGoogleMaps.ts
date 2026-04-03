declare global {
  interface Window {
    google?: {
      maps: {
        importLibrary: (name: string) => Promise<any>
      }
    }
  }
}

type GoogleMapsApi = NonNullable<typeof window.google>
type GoogleMapsMapLibrary = {
  Map: new (element: HTMLElement, options?: Record<string, unknown>) => any
}
type GoogleMapsPlacesLibrary = {
  Autocomplete: new (
    input: HTMLInputElement,
    options?: { fields?: string[]; types?: string[] }
  ) => {
    addListener: (event: string, callback: () => void) => void
    getPlace: () => {
      geometry?: { location?: { lat: () => number; lng: () => number } }
      name?: string
      formatted_address?: string
      address_components?: Array<{ types: string[]; long_name: string; short_name: string }>
      place_id?: string
    }
  }
}
type GoogleMapsMarkerLibrary = {
  AdvancedMarkerElement: new (options?: {
    map?: unknown
    position?: { lat: number; lng: number }
    title?: string
    content?: Node
  }) => {
    map?: unknown
    position?: { lat: number; lng: number }
    title?: string
    content?: Node
  }
}

let googleMapsPromise: Promise<GoogleMapsApi> | null = null

function appendGoogleMapsScript(apiKey: string): Promise<GoogleMapsApi> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]') as HTMLScriptElement | null

    if (existing) {
      if (window.google?.maps?.importLibrary) {
        resolve(window.google)
      } else {
        existing.addEventListener('load', () => {
          if (window.google?.maps?.importLibrary) resolve(window.google)
          else reject(new Error('Google Maps loaded but importLibrary is unavailable'))
        })
        existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'

    script.onload = () => {
      if (window.google?.maps?.importLibrary) {
        resolve(window.google)
      } else {
        reject(new Error('Google Maps loaded but importLibrary is unavailable'))
      }
    }

    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

export function useGoogleMaps() {
  const config = useRuntimeConfig()

  async function loadGoogleMaps(): Promise<GoogleMapsApi> {
    if (typeof window === 'undefined') {
      throw new Error('Google Maps can only load in the browser')
    }

    if (window.google?.maps?.importLibrary) {
      return window.google
    }

    if (googleMapsPromise) {
      return googleMapsPromise
    }

    const apiKey = (config.public.googleMapsApiKey as string) || ''
    if (!apiKey) {
      throw new Error('Google Maps API key not configured (NUXT_PUBLIC_GOOGLE_MAPS_API_KEY)')
    }

    googleMapsPromise = appendGoogleMapsScript(apiKey)
    return googleMapsPromise
  }

  async function importLibraries() {
    const google = await loadGoogleMaps()
    const [mapsLibrary, placesLibrary, markerLibrary] = await Promise.all([
      google.maps.importLibrary('maps') as Promise<GoogleMapsMapLibrary>,
      google.maps.importLibrary('places') as Promise<GoogleMapsPlacesLibrary>,
      google.maps.importLibrary('marker') as Promise<GoogleMapsMarkerLibrary>,
    ])

    return {
      google,
      mapsLibrary,
      placesLibrary,
      markerLibrary,
    }
  }

  return {
    loadGoogleMaps,
    importLibraries,
  }
}
