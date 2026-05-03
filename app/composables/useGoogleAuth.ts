import { API } from '~/shared/api-paths'

interface GoogleCredentialResponse {
  credential: string
  select_by?: string
}

export interface GoogleAuthResult {
  success: boolean
  error?: string
  access?: string
  refresh?: string
  user?: {
    id: number
    email: string
    name: string
    role: string
    is_email_verified: boolean
  }
}

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary: (name: string) => Promise<unknown>
      }
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          prompt: (callback?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void
          cancel: () => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

let gsiLoaded = false
let gsiLoading: Promise<void> | null = null

function loadGsiScript(): Promise<void> {
  if (gsiLoaded) return Promise.resolve()
  if (gsiLoading) return gsiLoading

  gsiLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      gsiLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Google Sign-In.'))
    document.head.appendChild(script)
  })

  return gsiLoading
}

export function useGoogleAuth() {
  const config = useRuntimeConfig()
  const clientId = (config.public.googleClientId as string | undefined) || ''

  const isConfigured = computed(() => Boolean(clientId))

  async function signInWithGoogle(role: 'client' | 'shop_owner' = 'client'): Promise<GoogleAuthResult> {
    if (!clientId) return { success: false, error: 'Google Sign-In is not configured.' }
    if (import.meta.server) return { success: false, error: 'Google Sign-In requires a browser.' }

    try {
      await loadGsiScript()
    } catch {
      return { success: false, error: 'Could not load Google Sign-In. Check your connection.' }
    }

    const apiBase = (config.public.apiBase as string).replace(/\/$/, '')

    return new Promise((resolve) => {
      window.google!.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: GoogleCredentialResponse) => {
          try {
            const result = await $fetch<{ access: string; refresh: string; user: GoogleAuthResult['user'] }>(
              `${apiBase}${API.auth.socialGoogle}`,
              {
                method: 'POST',
                body: { id_token: response.credential, role },
              },
            )
            resolve({ success: true, access: result.access, refresh: result.refresh, user: result.user })
          } catch (err: unknown) {
            const message = (err as { data?: { detail?: string } })?.data?.detail
              ?? (err instanceof Error ? err.message : 'Google sign-in failed.')
            resolve({ success: false, error: message })
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      window.google!.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          resolve({ success: false, error: 'Google sign-in was cancelled or blocked by browser settings.' })
        }
      })
    })
  }

  return { isConfigured, signInWithGoogle }
}
