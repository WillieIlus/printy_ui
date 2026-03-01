import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'

export interface SubscriptionPlanInfo {
  id: number
  name: string
  plan_type: string
  price: string
  billing_period: string
  max_printing_machines: number
  max_finishing_machines: number
}

export interface SubscriptionInfo {
  plan: {
    id: number
    name: string
    plan_type: string
    price: string
    billing_period: string
  } | null
  plan_name: string
  status: string
  limits: {
    max_printing_machines: number
    max_finishing_machines: number
  }
  usage: {
    printing_machines: number
    finishing_machines: number
  }
  expires_at: string | null
  can_add_printing_machine: boolean
  can_add_finishing_machine: boolean
}

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    byShop: {} as Record<string, SubscriptionInfo>,
    plans: [] as SubscriptionPlanInfo[],
    loading: false,
    plansLoading: false,
  }),

  getters: {
    getSubscription: (state) => (shopSlug: string) => state.byShop[shopSlug] ?? null,
    canAddPrintingMachine: (state) => (shopSlug: string) =>
      state.byShop[shopSlug]?.can_add_printing_machine ?? true,
    canAddFinishingMachine: (state) => (shopSlug: string) =>
      state.byShop[shopSlug]?.can_add_finishing_machine ?? true,
  },

  actions: {
    async fetchSubscription(shopSlug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const data = await $api<SubscriptionInfo>(API.shopSubscription(shopSlug))
        this.byShop = { ...this.byShop, [shopSlug]: data }
        return data
      } catch (err) {
        const next = { ...this.byShop }
        delete next[shopSlug]
        this.byShop = next
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchPlans() {
      this.plansLoading = true
      try {
        const { $api } = useNuxtApp()
        this.plans = await $api<SubscriptionPlanInfo[]>(API.plans())
        return this.plans
      } catch (err) {
        throw err
      } finally {
        this.plansLoading = false
      }
    },

    clearShop(shopSlug: string) {
      const next = { ...this.byShop }
      delete next[shopSlug]
      this.byShop = next
    },
  },
})
