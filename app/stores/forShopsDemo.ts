import { getBrowserStorage } from '~/utils/browser-storage'

export type ProductKey = 'business_card' | 'flyer' | 'booklet'
export type ActionType = 'accepted' | 'modified' | 'rejected'

interface DemoState {
  currentProduct: ProductKey
  quantity: number
  actionType: ActionType | null
  modifiedMin: number | null
  modifiedMax: number | null
  rejectReason: string | null
  productionCostOverride: number | null
}

const STORAGE_KEY = 'printy-for-shops-demo'

const PRODUCT_DEFAULTS: Record<ProductKey, number> = {
  business_card: 500,
  flyer: 1000,
  booklet: 100,
}

function defaultState(): DemoState {
  return {
    currentProduct: 'business_card',
    quantity: PRODUCT_DEFAULTS.business_card,
    actionType: null,
    modifiedMin: null,
    modifiedMax: null,
    rejectReason: null,
    productionCostOverride: null,
  }
}

function isProductKey(value: unknown): value is ProductKey {
  return value === 'business_card' || value === 'flyer' || value === 'booklet'
}

function isActionType(value: unknown): value is ActionType {
  return value === 'accepted' || value === 'modified' || value === 'rejected'
}

function loadFromStorage(): Partial<DemoState> {
  try {
    const raw = getBrowserStorage().getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw) as Partial<DemoState>
    const product = isProductKey(parsed.currentProduct) ? parsed.currentProduct : undefined
    const quantity = typeof parsed.quantity === 'number' && Number.isFinite(parsed.quantity) ? parsed.quantity : undefined

    return {
      currentProduct: product,
      quantity,
      actionType: isActionType(parsed.actionType) ? parsed.actionType : null,
      modifiedMin: typeof parsed.modifiedMin === 'number' && Number.isFinite(parsed.modifiedMin) ? parsed.modifiedMin : null,
      modifiedMax: typeof parsed.modifiedMax === 'number' && Number.isFinite(parsed.modifiedMax) ? parsed.modifiedMax : null,
      rejectReason: typeof parsed.rejectReason === 'string' ? parsed.rejectReason : null,
      productionCostOverride: typeof parsed.productionCostOverride === 'number' && Number.isFinite(parsed.productionCostOverride)
        ? parsed.productionCostOverride
        : null,
    }
  } catch {
    return {}
  }
}

function saveToStorage(state: DemoState) {
  try {
    getBrowserStorage().setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore browser storage failures
  }
}

export const useForShopsDemoStore = defineStore('forShopsDemo', () => {
  const defaults = defaultState()

  const currentProduct = ref<ProductKey>(defaults.currentProduct)
  const quantity = ref<number>(defaults.quantity)
  const actionType = ref<ActionType | null>(defaults.actionType)
  const modifiedMin = ref<number | null>(defaults.modifiedMin)
  const modifiedMax = ref<number | null>(defaults.modifiedMax)
  const rejectReason = ref<string | null>(defaults.rejectReason)
  const productionCostOverride = ref<number | null>(defaults.productionCostOverride)
  const hydrated = ref(false)

  function snapshot(): DemoState {
    return {
      currentProduct: currentProduct.value,
      quantity: quantity.value,
      actionType: actionType.value,
      modifiedMin: modifiedMin.value,
      modifiedMax: modifiedMax.value,
      rejectReason: rejectReason.value,
      productionCostOverride: productionCostOverride.value,
    }
  }

  function persist() {
    if (!import.meta.client) return
    saveToStorage(snapshot())
  }

  function hydrate() {
    if (!import.meta.client || hydrated.value) return

    const saved = loadFromStorage()
    const nextProduct = saved.currentProduct ?? defaults.currentProduct

    currentProduct.value = nextProduct
    quantity.value = saved.quantity ?? PRODUCT_DEFAULTS[nextProduct]
    actionType.value = saved.actionType ?? null
    modifiedMin.value = saved.modifiedMin ?? null
    modifiedMax.value = saved.modifiedMax ?? null
    rejectReason.value = saved.rejectReason ?? null
    productionCostOverride.value = saved.productionCostOverride ?? null
    hydrated.value = true
  }

  function selectProduct(key: ProductKey) {
    currentProduct.value = key
    quantity.value = PRODUCT_DEFAULTS[key]
    actionType.value = null
    modifiedMin.value = null
    modifiedMax.value = null
    rejectReason.value = null
    productionCostOverride.value = null
    persist()
  }

  function setQuantity(value: number) {
    quantity.value = value
    persist()
  }

  function setProductionCostOverride(value: number | null) {
    productionCostOverride.value = value
    persist()
  }

  function accept() {
    actionType.value = 'accepted'
    modifiedMin.value = null
    modifiedMax.value = null
    rejectReason.value = null
    persist()
  }

  function modify(min: number, max: number) {
    actionType.value = 'modified'
    modifiedMin.value = min
    modifiedMax.value = max
    rejectReason.value = null
    persist()
  }

  function reject(reason: string) {
    actionType.value = 'rejected'
    rejectReason.value = reason || 'No reason given'
    modifiedMin.value = null
    modifiedMax.value = null
    persist()
  }

  function reset() {
    actionType.value = null
    modifiedMin.value = null
    modifiedMax.value = null
    rejectReason.value = null
    persist()
  }

  return {
    currentProduct,
    quantity,
    actionType,
    modifiedMin,
    modifiedMax,
    rejectReason,
    productionCostOverride,
    hydrated,
    hydrate,
    selectProduct,
    setQuantity,
    setProductionCostOverride,
    accept,
    modify,
    reject,
    reset,
  }
})
