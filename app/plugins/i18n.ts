import { createI18n } from 'vue-i18n'

import en from '../../locales/en.json'
import sw from '../../locales/sw.json'

export default defineNuxtPlugin((nuxtApp) => {
  const initialLocale = useState<'en' | 'sw'>('app-language', () => 'en')

  const i18n = createI18n({
    legacy: false,
    locale: initialLocale.value,
    fallbackLocale: 'en',
    messages: {
      en,
      sw,
    },
  })

  nuxtApp.vueApp.use(i18n)

  return {
    provide: {
      i18n,
    },
  }
})
