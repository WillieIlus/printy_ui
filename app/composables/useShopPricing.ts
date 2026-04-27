import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface ShopMachine {
  id: number
  name: string
  machine_type: string
  max_width_mm: number
  max_height_mm: number
  min_gsm: number | null
  max_gsm: number | null
  is_active: boolean
}

export interface PrintRate {
  id: number
  machine_id: number
  machine_name: string
  sheet_size: string
  color_mode: string
  single_price: string
  double_price: string | null
  duplex_surcharge: string
  duplex_surcharge_enabled: boolean
  is_active: boolean
  is_default: boolean
}

export interface PrintRatePayload {
  sheet_size: string
  color_mode: string
  single_price: string | number
  is_active?: boolean
}

export interface VolumeDiscount {
  id: number
  name: string
  min_quantity: number
  discount_percent: string
  is_active: boolean
}

export interface VolumeDiscountPayload {
  name: string
  min_quantity: number
  discount_percent: string | number
  is_active?: boolean
}

export function useShopPricing(shopSlug: MaybeRefOrGetter<string | null>) {
  const api = useApi()
  const getSlug = () => toValue(shopSlug)

  // ── Machines ──────────────────────────────────────────────────────
  async function listMachines(): Promise<ShopMachine[]> {
    const slug = getSlug()
    if (!slug) return []
    const data = await api<ShopMachine[] | { results: ShopMachine[] }>(API.shopMachines(slug))
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function createDefaultMachine(): Promise<ShopMachine> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<ShopMachine>(API.shopMachines(slug), {
      method: 'POST',
      body: {
        name: 'Main press',
        machine_type: 'DIGITAL',
        max_width_mm: 320,
        max_height_mm: 450,
      },
    })
  }

  // ── Print rates ───────────────────────────────────────────────────
  async function listRatesForMachine(machineId: number): Promise<Omit<PrintRate, 'machine_id' | 'machine_name'>[]> {
    const data = await api<Omit<PrintRate, 'machine_id' | 'machine_name'>[] | { results: Omit<PrintRate, 'machine_id' | 'machine_name'>[] }>(
      API.machinePrintRates(machineId),
    )
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function loadAllRates(): Promise<PrintRate[]> {
    const machines = await listMachines()
    const allRates: PrintRate[] = []
    await Promise.all(
      machines.map(async (m) => {
        const rates = await listRatesForMachine(m.id)
        rates.forEach(r => allRates.push({ ...r, machine_id: m.id, machine_name: m.name }))
      }),
    )
    allRates.sort((a, b) => a.sheet_size.localeCompare(b.sheet_size) || a.color_mode.localeCompare(b.color_mode))
    return allRates
  }

  async function createRate(machineId: number, payload: PrintRatePayload): Promise<PrintRate> {
    const rate = await api<Omit<PrintRate, 'machine_id' | 'machine_name'>>(
      API.machinePrintRates(machineId),
      { method: 'POST', body: payload },
    )
    return { ...rate, machine_id: machineId, machine_name: '' }
  }

  async function updateRate(machineId: number, rateId: number, payload: Partial<PrintRatePayload>): Promise<PrintRate> {
    const rate = await api<Omit<PrintRate, 'machine_id' | 'machine_name'>>(
      API.machinePrintRateDetail(machineId, rateId),
      { method: 'PATCH', body: payload },
    )
    return { ...rate, machine_id: machineId, machine_name: '' }
  }

  async function deleteRate(machineId: number, rateId: number): Promise<void> {
    return api<void>(API.machinePrintRateDetail(machineId, rateId), { method: 'DELETE' })
  }

  // ── Volume discounts ──────────────────────────────────────────────
  async function listDiscounts(): Promise<VolumeDiscount[]> {
    const slug = getSlug()
    if (!slug) return []
    const data = await api<VolumeDiscount[] | { results: VolumeDiscount[] }>(API.shopPricingDiscounts(slug))
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function createDiscount(payload: VolumeDiscountPayload): Promise<VolumeDiscount> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<VolumeDiscount>(API.shopPricingDiscounts(slug), { method: 'POST', body: payload })
  }

  async function updateDiscount(id: number, payload: Partial<VolumeDiscountPayload>): Promise<VolumeDiscount> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<VolumeDiscount>(API.shopPricingDiscountDetail(slug, id), { method: 'PATCH', body: payload })
  }

  async function deleteDiscount(id: number): Promise<void> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<void>(API.shopPricingDiscountDetail(slug, id), { method: 'DELETE' })
  }

  return {
    listMachines,
    createDefaultMachine,
    loadAllRates,
    createRate,
    updateRate,
    deleteRate,
    listDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  }
}
