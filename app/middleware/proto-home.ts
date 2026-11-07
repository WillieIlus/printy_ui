import { protoHomeRoute, protoRoleFor } from '~/shared/workspace'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (to.path === '/app' || to.path === '/app/') {
    return navigateTo(protoHomeRoute(protoRoleFor(auth.dashboardRole)), { redirectCode: 302 })
  }
})