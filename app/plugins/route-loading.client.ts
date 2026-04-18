import { useRouteLoading } from '~/composables/useRouteLoading'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const routeLoading = useRouteLoading()

  router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) return
    routeLoading.start(to.fullPath)
  })

  router.afterEach(() => {
    routeLoading.finish()
  })

  router.onError(() => {
    routeLoading.fail()
  })

  nuxtApp.hook('page:finish', () => {
    routeLoading.finish()
  })

  nuxtApp.hook('app:error', () => {
    routeLoading.fail()
  })
})
