import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export interface Machine {
  id: number
  name: string
  machine_type?: string
  type?: string
  type_display?: string
  max_width_mm?: number | null
  max_height_mm?: number | null
  min_gsm?: number | null
  max_gsm?: number | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface MachineCreateInput {
  name: string
  machine_type?: string
  type?: string
  max_width_mm?: number | null
  max_height_mm?: number | null
  min_gsm?: number | null
  max_gsm?: number | null
  is_active?: boolean
}

export const useMachineStore = defineStore('machine', {
  state: () => ({
    machines: [] as Machine[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    machineOptions: (state) =>
      state.machines.map((m) => ({ label: m.name, value: m.id })),
    activeMachines: (state) => state.machines.filter((m) => m.is_active !== false),
  },

  actions: {
    async fetchMachines(shopSlug: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const response = await $api<Machine[] | { results: Machine[] }>(API.shopMachines(shopSlug))
        this.machines = Array.isArray(response) ? response : (response?.results ?? [])
        return this.machines
      } catch (err) {
        this.error = parseApiError(err, 'Failed to fetch machines')
        this.machines = []
        throw err
      } finally {
        this.loading = false
      }
    },

    async createMachine(shopSlug: string, data: MachineCreateInput) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const payload = {
          name: data.name,
          machine_type: data.machine_type ?? data.type ?? 'DIGITAL',
          max_width_mm: data.max_width_mm ?? null,
          max_height_mm: data.max_height_mm ?? null,
          min_gsm: data.min_gsm ?? null,
          max_gsm: data.max_gsm ?? null,
          is_active: data.is_active ?? true,
        }
        const machine = await $api<Machine>(API.shopMachines(shopSlug), {
          method: 'POST',
          body: payload,
        })
        this.machines.push(machine)
        return { success: true, machine }
      } catch (err) {
        const message = parseApiError(err, 'Failed to create machine')
        this.error = message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateMachine(shopSlug: string, id: number, data: Partial<MachineCreateInput>) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const machine = await $api<Machine>(API.shopMachineDetail(shopSlug, id), {
          method: 'PATCH',
          body: data,
        })
        const idx = this.machines.findIndex((m) => m.id === id)
        if (idx >= 0) this.machines[idx] = machine
        return { success: true, machine }
      } catch (err) {
        this.error = parseApiError(err, 'Failed to update machine')
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteMachine(shopSlug: string, id: number) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api(API.shopMachineDetail(shopSlug, id), { method: 'DELETE' })
        this.machines = this.machines.filter((m) => m.id !== id)
        return { success: true }
      } catch (err) {
        this.error = parseApiError(err, 'Failed to delete machine')
        throw err
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.machines = []
      this.error = null
    },
  },
})
