import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { getBrowserStorage } from '~/utils/browser-storage'

export type AppLanguage = 'en' | 'sw'

const STORAGE_KEY = 'printy-language'
const storage = getBrowserStorage()

export function useLanguagePreference() {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const locale = useState<AppLanguage>('app-language', () => 'en')
  const loading = useState<boolean>('app-language-loading', () => false)

  const options = [
    { value: 'en' as const, label: 'English', shortLabel: 'EN' },
    { value: 'sw' as const, label: 'Swahili', shortLabel: 'SW' },
  ]

  function normalizeLanguage(value: unknown): AppLanguage {
    return value === 'sw' ? 'sw' : 'en'
  }

  function persistLocal(value: AppLanguage) {
    if (!import.meta.client) return
    storage.setItem(STORAGE_KEY, value)
    document.documentElement.setAttribute('lang', value)
  }

  function readLocal(): AppLanguage {
    return normalizeLanguage(storage.getItem(STORAGE_KEY))
  }

  async function setLanguage(next: AppLanguage) {
    const normalized = normalizeLanguage(next)
    locale.value = normalized
    persistLocal(normalized)

    if (!authStore.isAuthenticated) return

    loading.value = true
    try {
      const result = await userStore.updateMe({ preferred_language: normalized })
      if (result.success) {
        await authStore.fetchMe()
      }
    } finally {
      loading.value = false
    }
  }

  async function initializeLanguage() {
    const preferred = normalizeLanguage(authStore.user?.preferred_language ?? readLocal())
    locale.value = preferred
    persistLocal(preferred)
  }

  watch(
    () => authStore.user?.preferred_language,
    (value) => {
      if (!value) return
      const normalized = normalizeLanguage(value)
      locale.value = normalized
      persistLocal(normalized)
    },
    { immediate: true },
  )

  return {
    locale,
    loading,
    options,
    setLanguage,
    initializeLanguage,
  }
}
