import { Package, Ruler, Grid2x2, Hash, SlidersHorizontal } from 'lucide-react'
import type { Product } from '../types'

interface Props {
  product: Product
  onTweak: (product: Product) => void
}

export default function ProductCard({ product, onTweak }: Props) {
  const priceDisplay = product.price_hint?.price_display || 'Get Quote'
  const total = product.price_hint?.total
  const perUnit = product.price_hint?.per_unit

  return (
    <article
      className="group rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden hover:border-amber-300 dark:hover:border-amber-700/50 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onTweak(product)}
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-stone-200 dark:text-stone-700" />
          </div>
        )}
        {/* Shop label */}
        {product.shop && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border border-stone-200 dark:border-stone-700 px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300">
              🏪 {product.shop.name}
            </span>
          </div>
        )}
        {/* Pricing mode badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100/90 dark:bg-amber-900/70 text-amber-700 dark:text-amber-300 backdrop-blur-sm">
            {product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>
        {product.category && (
          <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{product.category}</p>
        )}

        {/* Details */}
        <div className="mt-3 space-y-1.5">
          {product.final_size && (
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Ruler className="h-3.5 w-3.5 shrink-0" />
              <span>{product.final_size}</span>
            </div>
          )}
          {product.imposition_summary && (
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Grid2x2 className="h-3.5 w-3.5 shrink-0" />
              <span>Fits on {product.imposition_summary}</span>
            </div>
          )}
          {product.min_quantity && (
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Hash className="h-3.5 w-3.5 shrink-0" />
              <span>Min {product.min_quantity} pcs</span>
            </div>
          )}
          {product.finishing_summary && product.finishing_summary.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.finishing_summary.map(finish => (
                <span
                  key={finish}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                >
                  {finish}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {total && perUnit ? (
              <>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  KES {total.toLocaleString()}
                </div>
                <div className="text-sm text-stone-500 dark:text-stone-400">
                  KES {perUnit.toFixed(2)} / pc
                </div>
              </>
            ) : (
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {priceDisplay}
              </div>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onTweak(product) }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Tweak
          </button>
        </div>
      </div>
    </article>
  )
}
