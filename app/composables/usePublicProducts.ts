import type { Product } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
import { productCategoryName } from '~/utils/product'

type UsePublicProductsOptions = {
  key?: string
}

export function usePublicProducts(options: UsePublicProductsOptions = {}) {
  const key = options.key ?? 'public-products'

  const asyncData = useAsyncData<Product[]>(key, () => getAllProducts(), {
    default: () => [],
  })

  const publicProducts = computed(() => asyncData.data.value)

  const categories = computed(() => {
    const names = new Set<string>()
    for (const product of publicProducts.value) {
      const name = productCategoryName(product)
      if (name) names.add(name)
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  })

  return {
    data: asyncData.data,
    pending: asyncData.pending,
    error: asyncData.error,
    status: asyncData.status,
    refresh: asyncData.refresh,
    execute: asyncData.execute,
    clear: asyncData.clear,
    publicProducts,
    categories,
  }
}
