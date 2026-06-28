import { API } from '~/shared/api-paths'

export async function fetchCalculatorConfig() {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.calculator.config, { auth: false })
}

export async function fetchCalculatorPreview(payload: Record<string, any>) {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.calculator.publicPreview, {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export async function fetchDashboardCalculatorPreview(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.calculator.dashboardPreview, {
    method: 'POST',
    body: payload,
  })
}
