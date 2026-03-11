import { X, Trash2, ShoppingCart, Package, Send } from 'lucide-react'
import { useQuote } from '../context/QuoteContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function QuoteDrawer({ open, onClose }: Props) {
  const { items, removeItem, clearQuote } = useQuote()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
              Quote Draft ({items.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearQuote}
                className="text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 dark:text-stone-500 px-6">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Your quote is empty</p>
              <p className="text-sm mt-1">Click "Tweak" on any product to customize and add it.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {items.map(item => (
                <div key={item.id} className="px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-stone-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {item.quantity} pcs • {item.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided'}
                        {item.color_mode === 'BW' ? ' • B&W' : ' • Color'}
                      </p>
                      {item.paper && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          📄 {item.paper.sheet_size} {item.paper.gsm}gsm {item.paper.paper_type}
                        </p>
                      )}
                      {item.material && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          🧱 {item.material.material_type ?? item.material.name}
                        </p>
                      )}
                      {item.finishings.length > 0 && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          ✨ {item.finishings.map(f => f.name).join(', ')}
                        </p>
                      )}
                      {item.special_instructions && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 italic">
                          "{item.special_instructions}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-stone-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 dark:border-stone-700 px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Total items</span>
              <span className="font-semibold text-stone-800 dark:text-stone-100">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Total quantity</span>
              <span className="font-semibold text-stone-800 dark:text-stone-100">
                {items.reduce((sum, i) => sum + i.quantity, 0).toLocaleString()} pcs
              </span>
            </div>
            <button className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
              <Send className="h-4 w-4" />
              Submit Quote Request
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
