export default defineNuxtPlugin(() => {
  const languageCookie = useCookie<'en' | 'sw'>('printy-language', { default: () => 'en' })
  const locale = useState<'en' | 'sw'>('app-language', () => languageCookie.value === 'sw' ? 'sw' : 'en')

  return {
    provide: {
      locale,
    },
  }
})
