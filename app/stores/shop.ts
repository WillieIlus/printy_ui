import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'
import type {
  ShopFinishingRatePatch,
  ShopFinishingRateRecord,
  ShopMachinePatch,
  ShopMachineRecord,
  ShopPaperPatch,
  ShopPaperRecord,
  ShopPatch,
  ShopRecord,
} from '~/shared/types'

/**
 * Print-shop setup: the shop profile plus its paper stock, finishing rates
 * and printing machines. Everything is scoped to the signed-in shop owner.
 */
export const useShopStore = defineStore('shop', {
  state: () => ({
    shops: [] as ShopRecord[],
    activeSlug: '' as string,
    papers: [] as ShopPaperRecord[],
    finishings: [] as ShopFinishingRateRecord[],
    machines: [] as ShopMachineRecord[],
    loading: false,
    saving: false,
    error: '' as string,
  }),
  getters: {
    active: (state) => state.shops.find((shop) => shop.slug === state.activeSlug) ?? state.shops[0] ?? null,
    hasShop: (state) => state.shops.length > 0,
    identifier(state): number | string {
      const shop = state.shops.find((item) => item.slug === state.activeSlug) ?? state.shops[0]
      return shop ? shop.id : ''
    },
  },
  actions: {
    async fetchShops() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<ShopRecord[] | { results: ShopRecord[] }>(API.shop.list)
        this.shops = normalizeApiList(payload) as ShopRecord[]
        if (!this.activeSlug || !this.shops.some((shop) => shop.slug === this.activeSlug)) {
          this.activeSlug = this.shops[0]?.slug ?? ''
        }
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your shop profile.")
      } finally {
        this.loading = false
      }
    },
    setActive(slug: string) {
      this.activeSlug = slug
    },
    async updateShop(patch: ShopPatch) {
      const shop = this.active
      if (!shop) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const updated = await api<ShopRecord>(API.shop.detail(shop.slug), { method: 'PATCH', body: patch })
        const idx = this.shops.findIndex((item) => item.slug === shop.slug)
        if (idx >= 0) this.shops[idx] = updated
        return updated
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't save your shop profile.")
        throw error
      } finally {
        this.saving = false
      }
    },

    async fetchPapers() {
      const id = this.identifier
      if (!id) return
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<ShopPaperRecord[] | { results: ShopPaperRecord[] }>(API.shop.papers(id))
        this.papers = normalizeApiList(payload) as ShopPaperRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your paper stock.")
      } finally {
        this.loading = false
      }
    },
    async createPaper(patch: ShopPaperPatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const created = await api<ShopPaperRecord>(API.shop.papers(id), { method: 'POST', body: patch })
        this.papers.push(created)
        return created
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't add that paper.")
        throw error
      } finally {
        this.saving = false
      }
    },
    async updatePaper(paperId: number, patch: ShopPaperPatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const updated = await api<ShopPaperRecord>(API.shop.paper(id, paperId), { method: 'PATCH', body: patch })
        const idx = this.papers.findIndex((item) => item.id === paperId)
        if (idx >= 0) this.papers[idx] = updated
        return updated
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't update that paper.")
        throw error
      } finally {
        this.saving = false
      }
    },
    async adjustPaper(paperId: number, adjustment: number) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const updated = await api<ShopPaperRecord>(API.shop.paperAdjust(id, paperId), {
          method: 'POST',
          body: { adjustment },
        })
        const idx = this.papers.findIndex((item) => item.id === paperId)
        if (idx >= 0) this.papers[idx] = updated
        return updated
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't adjust that stock level.")
        throw error
      } finally {
        this.saving = false
      }
    },

    async fetchFinishings() {
      const id = this.identifier
      if (!id) return
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<ShopFinishingRateRecord[] | { results: ShopFinishingRateRecord[] }>(
          API.shop.finishingRates(id),
        )
        this.finishings = normalizeApiList(payload) as ShopFinishingRateRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your finishing rates.")
      } finally {
        this.loading = false
      }
    },
    async createFinishing(patch: ShopFinishingRatePatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const created = await api<ShopFinishingRateRecord>(API.shop.finishingRates(id), { method: 'POST', body: patch })
        this.finishings.push(created)
        return created
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't add that finishing service.")
        throw error
      } finally {
        this.saving = false
      }
    },
    async updateFinishing(rateId: number, patch: ShopFinishingRatePatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const updated = await api<ShopFinishingRateRecord>(API.shop.finishingRate(id, rateId), {
          method: 'PATCH',
          body: patch,
        })
        const idx = this.finishings.findIndex((item) => item.id === rateId)
        if (idx >= 0) this.finishings[idx] = updated
        return updated
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't update that finishing rate.")
        throw error
      } finally {
        this.saving = false
      }
    },

    async fetchMachines() {
      const id = this.identifier
      if (!id) return
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<ShopMachineRecord[] | { results: ShopMachineRecord[] }>(API.shop.machines(id))
        this.machines = normalizeApiList(payload) as ShopMachineRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your machines.")
      } finally {
        this.loading = false
      }
    },
    async createMachine(patch: ShopMachinePatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const created = await api<ShopMachineRecord>(API.shop.machines(id), { method: 'POST', body: patch })
        this.machines.push(created)
        return created
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't add that machine.")
        throw error
      } finally {
        this.saving = false
      }
    },
    async updateMachine(machineId: number, patch: ShopMachinePatch) {
      const id = this.identifier
      if (!id) return null
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const updated = await api<ShopMachineRecord>(API.shop.machine(id, machineId), {
          method: 'PATCH',
          body: patch,
        })
        const idx = this.machines.findIndex((item) => item.id === machineId)
        if (idx >= 0) this.machines[idx] = updated
        return updated
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't update that machine.")
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
