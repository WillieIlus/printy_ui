import { dashboardForProto, protoHomeRoute, protoRoleFor, type ProtoRole } from '~/shared/workspace'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  await auth.initialize(true)

  if (!auth.isAuthenticated) {
    return navigateTo(`/sign-in?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  let requested: ProtoRole | null = null
  if (to.path.startsWith('/app/admin')) requested = 'admin'
  if (to.path.startsWith('/app/printer')) requested = 'printer'
  if (to.path.startsWith('/app/manager')) requested = 'manager'
  if (to.path.startsWith('/app/buyer')) requested = 'buyer'

  if (requested) {
    const dashboardRole = dashboardForProto(requested)
    if (!auth.setActiveRole(dashboardRole)) {
      return navigateTo(protoHomeRoute(protoRoleFor(auth.dashboardRole)), { redirectCode: 302 })
    }
    const workflow = useWorkflowStore()
    workflow.setRole(requested)
  }
})