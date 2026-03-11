import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  X, Loader2, Package, Minus, Plus, Palette, Lightbulb,
  Check, AlertCircle
} from 'lucide-react'
import { cn } from '../utils/cn'
import type { Product, Paper, MaterialItem, FinishingRate, TweakForm, QuoteItemFinishingPayload } from '../types'
import { getShopDataForProduct } from '../data/mockData'
import { useQuote } from '../context/QuoteContext'

interface Props {
  product: Product
  shopSlug: string
  open: boolean
  onClose: () => void
  onAdded?: () => void
}

export default function ProductTweakModal({ product, shopSlug: _shopSlug, open, onClose, onAdded }: Props) {
  const { addItem } = useQuote()
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [papers, setPapers] = useState<Paper[]>([])
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [finishingRates, setFinishingRates] = useState<FinishingRate[]>([])
  const [successMessage, setSuccessMessage] = useState('')

  const minQty = product.min_quantity || 100

  const [form, setForm] = useState<TweakForm>({
    quantity: minQty,
    sides: (product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
    color_mode: 'COLOR',
    paper: null,
    material: null,
    finishings: [],
    special_instructions: '',
  })

  const updateForm = useCallback((updates: Partial<TweakForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }, [])

  const resetForm = useCallback(() => {
    const defaultFinishings: QuoteItemFinishingPayload[] = (product.finishing_options ?? [])
      .filter(o => o.is_default)
      .map(o => ({ finishing_rate: o.finishing_rate }))

    setForm({
      quantity: minQty,
      sides: (product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
      color_mode: 'COLOR',
      paper: null,
      material: null,
      finishings: defaultFinishings,
      special_instructions: '',
    })
    setSuccessMessage('')
  }, [product, minQty])

  const loadShopData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600))
      const data = getShopDataForProduct(product)
      setPapers(data.papers)
      setMaterials(data.materials)
      setFinishingRates(data.finishings)
    } catch {
      setLoadError('Could not load product options.')
    } finally {
      setLoading(false)
    }
  }, [product])

  useEffect(() => {
    if (open) {
      resetForm()
      loadShopData()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open, resetForm, loadShopData])

  const toggleFinishing = useCallback((id: number, checked: boolean) => {
    setForm(prev => {
      if (checked) {
        return { ...prev, finishings: [...prev.finishings, { finishing_rate: id }] }
      } else {
        return { ...prev, finishings: prev.finishings.filter(f => f.finishing_rate !== id) }
      }
    })
  }, [])

  const selectedPaperLabel = useMemo(() => {
    if (!form.paper) return null
    const p = papers.find(x => x.id === form.paper)
    return p ? `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}` : null
  }, [form.paper, papers])

  const selectedMaterialLabel = useMemo(() => {
    if (!form.material) return null
    const m = materials.find(x => x.id === form.material)
    return m ? (m.material_type ?? m.name ?? '') : null
  }, [form.material, materials])

  const selectedFinishingLabels = useMemo(() => {
    return form.finishings
      .map(f => finishingRates.find(r => r.id === f.finishing_rate)?.name)
      .filter(Boolean) as string[]
  }, [form.finishings, finishingRates])

  const needsPaperOrFinishing = useMemo(() => {
    if (product.pricing_mode === 'SHEET' && papers.length && !form.paper) return true
    if (product.pricing_mode === 'LARGE_FORMAT' && materials.length && !form.material) return true
    if (finishingRates.length && !form.finishings.length) return true
    return false
  }, [product.pricing_mode, papers, materials, finishingRates, form])

  const estimatedTotal = useMemo(() => {
    if (!product.price_hint?.can_calculate) return null
    let base = product.price_hint.total || 0
    // Adjust based on quantity ratio
    const defaultQty = product.min_quantity || 100
    const ratio = form.quantity / defaultQty
    let total = base * ratio

    // Duplex markup
    if (form.sides === 'DUPLEX' && product.default_sides !== 'DUPLEX') {
      total *= 1.4
    }

    // Add finishing costs
    form.finishings.forEach(f => {
      const rate = finishingRates.find(r => r.id === f.finishing_rate)
      if (rate) {
        const price = parseFloat(rate.price) || 0
        if (rate.charge_unit === 'FLAT') {
          total += price
        } else {
          total += price * form.quantity
        }
      }
    })

    return {
      total: Math.round(total),
      perUnit: Math.round(total / form.quantity * 100) / 100,
    }
  }, [product, form, finishingRates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))

      const selectedPaper = form.paper ? papers.find(p => p.id === form.paper) : null
      const selectedMaterial = form.material ? materials.find(m => m.id === form.material) : null
      const selectedFinishings = form.finishings
        .map(f => finishingRates.find(r => r.id === f.finishing_rate))
        .filter(Boolean) as FinishingRate[]

      addItem({
        product,
        quantity: Math.max(minQty, form.quantity),
        sides: form.sides,
        color_mode: form.color_mode,
        paper: selectedPaper,
        material: selectedMaterial,
        finishings: selectedFinishings,
        special_instructions: form.special_instructions.trim() || undefined,
      })

      setSuccessMessage(`${product.name} added to your quote!`)
      onAdded?.()

      setTimeout(() => {
        onClose()
      }, 1200)
    } catch {
      setLoadError('Could not add to quote. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Tweak Quote — {product.name}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                Customize paper, quantity, finishing, and other options before adding to your quote.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[200px] p-6 space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">Loading options…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && loadError && (
            <div className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
              <p className="font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Could not open quote options.
              </p>
              <p className="mt-1">{loadError}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={loadShopData}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-sm rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Loaded content */}
          {!loading && !loadError && (
            <>
              {/* Product info row */}
              <div className="flex items-center gap-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 p-4">
                <div className="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-600 overflow-hidden">
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-8 w-8 text-stone-400 dark:text-stone-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-800 dark:text-stone-100 truncate">{product.name}</p>
                  {product.category && (
                    <p className="text-xs text-stone-500 dark:text-stone-400">{product.category}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {product.final_size && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                        {product.final_size}
                      </span>
                    )}
                    {product.imposition_summary && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                        {product.imposition_summary}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                      {product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateForm({ quantity: Math.max(minQty, form.quantity - 50) })}
                      className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={form.quantity}
                      min={minQty}
                      onChange={e => updateForm({ quantity: parseInt(e.target.value) || minQty })}
                      onBlur={() => updateForm({ quantity: Math.max(minQty, form.quantity || minQty) })}
                      className="w-24 text-center rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => updateForm({ quantity: form.quantity + 50 })}
                      className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-stone-400">min {minQty}</span>
                  </div>
                </div>

                {/* Sides (SHEET mode only) */}
                {product.pricing_mode === 'SHEET' && (
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Sides</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['SIMPLEX', 'DUPLEX'] as const).map(side => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => updateForm({ sides: side })}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                            form.sides === side
                              ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                              : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
                          )}
                        >
                          {side === 'SIMPLEX' ? 'Single-sided' : 'Double-sided'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color mode (SHEET mode only) */}
                {product.pricing_mode === 'SHEET' && (
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Color</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateForm({ color_mode: 'COLOR' })}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-all flex items-center justify-center gap-1',
                          form.color_mode === 'COLOR'
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                            : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                        )}
                      >
                        <Palette className="h-4 w-4" />
                        Color
                      </button>
                      <button
                        type="button"
                        onClick={() => updateForm({ color_mode: 'BW' })}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                          form.color_mode === 'BW'
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                            : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                        )}
                      >
                        B&W
                      </button>
                    </div>
                  </div>
                )}

                {/* Paper (SHEET mode) */}
                {product.pricing_mode === 'SHEET' && papers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Paper type / grammage</label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                      {papers.map(p => (
                        <label
                          key={p.id}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                            form.paper === p.id
                              ? 'bg-amber-50 dark:bg-amber-900/20'
                              : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                          )}
                        >
                          <input
                            type="radio"
                            name="paper"
                            checked={form.paper === p.id}
                            onChange={() => updateForm({ paper: p.id })}
                            className="accent-amber-500"
                          />
                          <span className="text-sm text-stone-700 dark:text-stone-200">
                            {p.sheet_size} {p.gsm}gsm {p.paper_type}
                          </span>
                          <span className="ml-auto text-xs text-stone-400">KES {p.selling_price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material (LARGE_FORMAT mode) */}
                {product.pricing_mode === 'LARGE_FORMAT' && materials.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Material</label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                      {materials.map(m => (
                        <label
                          key={m.id}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                            form.material === m.id
                              ? 'bg-amber-50 dark:bg-amber-900/20'
                              : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                          )}
                        >
                          <input
                            type="radio"
                            name="material"
                            checked={form.material === m.id}
                            onChange={() => updateForm({ material: m.id })}
                            className="accent-amber-500"
                          />
                          <span className="text-sm text-stone-700 dark:text-stone-200">
                            {m.material_type ?? m.name}
                          </span>
                          <span className="ml-auto text-xs text-stone-400">
                            KES {m.selling_price}/{m.unit}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finishing options */}
                {finishingRates.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Finishing</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                      {finishingRates.map(fr => {
                        const isChecked = form.finishings.some(f => f.finishing_rate === fr.id)
                        return (
                          <label
                            key={fr.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => toggleFinishing(fr.id, e.target.checked)}
                              className="accent-amber-500 h-4 w-4 rounded"
                            />
                            <span className="text-sm text-stone-700 dark:text-stone-200 flex-1">{fr.name}</span>
                            <span className="text-xs text-stone-400">KES {fr.price}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Hint for complete quote */}
                {needsPaperOrFinishing && (
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 shrink-0" />
                      For a complete quote
                    </p>
                    <ul className="mt-1 ml-6 list-disc space-y-0.5 text-amber-700 dark:text-amber-300">
                      {product.pricing_mode === 'SHEET' && papers.length > 0 && !form.paper && (
                        <li>Select paper for accurate pricing</li>
                      )}
                      {product.pricing_mode === 'LARGE_FORMAT' && materials.length > 0 && !form.material && (
                        <li>Select material for accurate pricing</li>
                      )}
                      {finishingRates.length > 0 && form.finishings.length === 0 && (
                        <li>Consider adding finishing (lamination, binding, etc.)</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Special instructions */}
                <div>
                  <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">
                    Special instructions
                  </label>
                  <textarea
                    value={form.special_instructions}
                    onChange={e => updateForm({ special_instructions: e.target.value })}
                    placeholder="Any notes for the shop (optional)"
                    rows={2}
                    className="w-full rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                {/* Price preview section */}
                <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Quote Summary
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Product</span>
                    <span className="font-medium text-stone-800 dark:text-stone-100">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Quantity</span>
                    <span className="font-medium text-stone-800 dark:text-stone-100">{form.quantity} pcs</span>
                  </div>
                  {product.pricing_mode === 'SHEET' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 dark:text-stone-400">Sides</span>
                      <span className="font-medium text-stone-800 dark:text-stone-100">
                        {form.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided'}
                      </span>
                    </div>
                  )}
                  {product.pricing_mode === 'SHEET' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 dark:text-stone-400">Color</span>
                      <span className="font-medium text-stone-800 dark:text-stone-100">
                        {form.color_mode === 'COLOR' ? 'Full Color' : 'Black & White'}
                      </span>
                    </div>
                  )}
                  {selectedPaperLabel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 dark:text-stone-400">Paper</span>
                      <span className="font-medium text-stone-800 dark:text-stone-100">{selectedPaperLabel}</span>
                    </div>
                  )}
                  {selectedMaterialLabel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 dark:text-stone-400">Material</span>
                      <span className="font-medium text-stone-800 dark:text-stone-100">{selectedMaterialLabel}</span>
                    </div>
                  )}
                  {selectedFinishingLabels.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 dark:text-stone-400">Finishing</span>
                      <span className="font-medium text-stone-800 dark:text-stone-100 text-right max-w-[60%]">
                        {selectedFinishingLabels.join(', ')}
                      </span>
                    </div>
                  )}

                  {estimatedTotal && (
                    <div className="border-t border-amber-200/60 dark:border-amber-800/30 pt-2 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">Est. total</span>
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          KES {estimatedTotal.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-stone-400">
                        <span>Per item</span>
                        <span>KES {estimatedTotal.perUnit.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-stone-400 pt-1">
                    Final price computed by the shop after submission.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {submitting ? 'Adding…' : 'Add to Quote'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
