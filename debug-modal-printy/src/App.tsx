import { useState, useMemo } from 'react'
import { ShoppingCart, Package, Search, Store, SlidersHorizontal } from 'lucide-react'
import { QuoteProvider, useQuote } from './context/QuoteContext'
import { products } from './data/mockData'
import type { Product } from './types'
import ProductCard from './components/ProductCard'
import ProductTweakModal from './components/ProductTweakModal'
import QuoteDrawer from './components/QuoteDrawer'

function AppContent() {
  const { itemCount } = useQuote()
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tweakModalOpen, setTweakModalOpen] = useState(false)
  const [tweakProduct, setTweakProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })

  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const p of products) {
      if (p.category) cats.add(p.category)
    }
    return Array.from(cats).sort()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.shop?.name && p.shop.name.toLowerCase().includes(q))
      )
    }
    return filtered
  }, [categoryFilter, searchQuery])

  function openTweak(product: Product) {
    setTweakProduct(product)
    setTweakModalOpen(true)
  }

  function showToast(message: string) {
    setToast({ message, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }

  function onItemAdded() {
    showToast(`${tweakProduct?.name ?? 'Product'} added to your quote draft!`)
  }

  return (
    <div className="min-h-screen bg-amber-50/80 dark:bg-stone-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Printy</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">Print Shop Quoting</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products, categories, shops…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 pl-10 pr-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quote cart button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors shadow-md shadow-amber-500/20"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Quote Draft</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-stone-900">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 pl-10 pr-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100 sm:text-4xl flex items-center gap-3">
            <Store className="h-8 w-8 text-amber-500" />
            Product Gallery
          </h2>
          <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">
            Browse products from print shops across Kenya. Click any product to customize and add to your quote.
          </p>
        </div>

        {/* Category filter pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !categoryFilter
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onTweak={openTweak}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-16 text-center">
            <Package className="mx-auto h-16 w-16 text-stone-200 dark:text-stone-700" />
            <h3 className="mt-4 text-lg font-semibold text-stone-700 dark:text-stone-300">No products found</h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {searchQuery ? 'Try a different search term.' : 'No products match the selected filter.'}
            </p>
            {(searchQuery || categoryFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('') }}
                className="mt-4 px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* How it works section */}
        <section className="mt-16 mb-8">
          <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 text-center mb-8">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <SlidersHorizontal className="h-8 w-8" />,
                title: 'Browse & Tweak',
                desc: 'Find products from print shops. Customize paper, quantity, sides, color, and finishing.',
              },
              {
                icon: <ShoppingCart className="h-8 w-8" />,
                title: 'Build Your Quote',
                desc: 'Add multiple products to your quote draft. Review estimated pricing in real-time.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Submit & Get Quote',
                desc: 'Submit your request. The shop reviews and provides a final price for your order.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="text-center p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold mb-3">
                  {idx + 1}
                </div>
                <h4 className="font-semibold text-stone-800 dark:text-stone-100">{step.title}</h4>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            © 2025 Printy — Print Shop Quoting Platform
          </p>
          <div className="flex gap-4 text-sm text-stone-400 dark:text-stone-500">
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">About</span>
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Help</span>
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>

      {/* Tweak Modal */}
      {tweakProduct && (
        <ProductTweakModal
          product={tweakProduct}
          shopSlug={tweakProduct.shop?.slug || ''}
          open={tweakModalOpen}
          onClose={() => setTweakModalOpen(false)}
          onAdded={onItemAdded}
        />
      )}

      {/* Quote Drawer */}
      <QuoteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Toast notification */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium shadow-2xl">
            <svg className="h-5 w-5 text-green-400 dark:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <QuoteProvider>
      <AppContent />
    </QuoteProvider>
  )
}
