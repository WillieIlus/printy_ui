export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-stone-800">Printy</h1>
          <p className="mt-1 text-lg text-stone-500">Print Shop Quoting — Nuxt/Vue Conversion</p>
        </div>

        {/* Instructions card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          <div className="bg-stone-800 text-white px-6 py-4">
            <h2 className="font-bold text-lg">🚀 Getting Started</h2>
            <p className="text-sm text-stone-300 mt-1">All Vue/Nuxt files are in the <code className="bg-stone-700 px-1.5 py-0.5 rounded text-amber-300">nuxt-app/</code> directory</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-stone-50 rounded-xl p-4 font-mono text-sm space-y-1">
              <p className="text-stone-400"># Install & run locally</p>
              <p className="text-stone-800">cd nuxt-app</p>
              <p className="text-stone-800">npm install</p>
              <p className="text-stone-800">npm run dev</p>
            </div>

            <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wider mt-6">📁 Project Structure</h3>
            <div className="grid gap-2 text-sm">
              {[
                ['app.vue', 'Root component with toast notifications'],
                ['layouts/default.vue', 'Header, footer, quote drawer button'],
                ['pages/index.vue', 'Product gallery with search & category filters'],
                ['pages/shops/[slug].vue', 'Shop-specific catalog page'],
                ['components/ProductTweakModal.vue', '✨ Quote customization modal (fixed!)'],
                ['components/ProductCard.vue', 'Product display card'],
                ['components/QuoteDrawer.vue', 'Slide-out quote sidebar'],
                ['stores/quote.ts', 'Pinia store for quote state'],
                ['composables/useProductPriceDisplay.ts', 'Price formatting composable'],
                ['shared/types.ts', 'TypeScript interfaces'],
                ['shared/mockData.ts', 'Sample products & shop data'],
              ].map(([file, desc]) => (
                <div key={file} className="flex gap-3 items-start">
                  <code className="shrink-0 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">{file}</code>
                  <span className="text-stone-500">{desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50">
              <h4 className="font-bold text-amber-800 flex items-center gap-2">
                <span>🔧</span> Modal Fix Details
              </h4>
              <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc list-inside">
                <li>Uses <code className="bg-amber-100 px-1 rounded">{'<Teleport to="body">'}</code> instead of UModal for reliability</li>
                <li>Vue <code className="bg-amber-100 px-1 rounded">{'<Transition>'}</code> with named CSS animations</li>
                <li>Body scroll lock via <code className="bg-amber-100 px-1 rounded">watch(modelValue)</code></li>
                <li>Data loads on <code className="bg-amber-100 px-1 rounded">watch(open → true)</code>, not onMounted race</li>
                <li>Proper <code className="bg-amber-100 px-1 rounded">defineModel</code> for v-model two-way binding</li>
                <li>Click backdrop or press Escape to close</li>
                <li>Success toast + auto-close after adding item</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
