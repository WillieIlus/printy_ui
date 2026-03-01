import { useState } from "react";

type PageType = "home" | "components";

export function App() {
  const [page, setPage] = useState<PageType>("home");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {page === "home" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F05224] to-[#bb2513] shadow-lg shadow-[#F05224]/25">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Printy</h1>
                <p className="text-sm text-gray-500">Quoting & Pricing Engine</p>
              </div>
            </div>

            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Vue/Nuxt Component Library
            </h2>
            <p className="mb-8 text-gray-600">
              This project contains Vue 3 single-file components built with Tailwind CSS 
              and the Flamingo (#F05224) color palette. Check the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-[#F05224]">vue-components/</code> folder.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "AppNavbar.vue", desc: "Sticky navigation with flamingo branding, mobile menu, user avatar" },
                { name: "FormInput.vue", desc: "VeeValidate + UInput wrapper with icons, password toggle, error states" },
                { name: "DashboardShell.vue", desc: "Dashboard layout with stats cards, header, and content slot" },
                { name: "ShopCard.vue", desc: "Shop overview card with capabilities, stats, and action buttons" },
                { name: "ShopDetailPricing.vue", desc: "Full shop detail with materials table, pricing, products, finishing" },
                { name: "QuoteBuilder.vue", desc: "Quote page with items, cost breakdowns, totals, and PDF export" },
                { name: "TemplateTweaker.vue", desc: "Template config with live pricing — toggle finishing to update price" },
                { name: "AppFooter.vue", desc: "Site footer with flamingo gradient logo and navigation links" },
              ].map((comp) => (
                <div key={comp.name} className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef4ee]">
                      <svg className="h-4 w-4 text-[#F05224]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{comp.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{comp.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#F05224]/20 bg-[#fef4ee] p-6">
              <h3 className="mb-2 text-sm font-bold text-[#F05224]">Flamingo Color Palette</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { shade: "50", hex: "#fef4ee" },
                  { shade: "100", hex: "#fde6d7" },
                  { shade: "200", hex: "#fbc9ad" },
                  { shade: "300", hex: "#f7a37a" },
                  { shade: "400", hex: "#f37344" },
                  { shade: "500", hex: "#f05224" },
                  { shade: "600", hex: "#e13515" },
                  { shade: "700", hex: "#bb2513" },
                  { shade: "800", hex: "#942018" },
                  { shade: "900", hex: "#781d16" },
                  { shade: "950", hex: "#410b09" },
                ].map((c) => (
                  <div key={c.shade} className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-lg shadow-sm" style={{ backgroundColor: c.hex }} />
                    <span className="text-[10px] text-gray-500">{c.shade}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPage("components")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F05224] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F05224]/25 transition-all hover:bg-[#e13515]"
            >
              View Component Details
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {page === "components" && (
        <div className="mx-auto max-w-4xl px-4 py-12">
          <button
            onClick={() => setPage("home")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to overview
          </button>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">Component Documentation</h1>
          <p className="mb-8 text-gray-600">All components are in <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-[#F05224]">vue-components/</code> — copy any file into your Nuxt project.</p>

          <div className="space-y-6">
            {[
              {
                name: "AppNavbar.vue",
                props: ["isLoggedIn: boolean", "userName: string", "userInitials: string"],
                features: ["Sticky top-0 with backdrop blur", "Logo with flamingo gradient", "Desktop + mobile responsive nav", "User avatar dropdown when logged in", "Search + notification icons", "Transition animations on mobile menu"],
              },
              {
                name: "FormInput.vue",
                props: ["name, label, type, placeholder, icon", "disabled, required, hideLabel"],
                features: ["VeeField integration for validation", "Leading icon support (UIcon)", "Password show/hide toggle", "Error state with red border + icon", "Focus ring with flamingo color", "Accessible with labels + IDs"],
              },
              {
                name: "DashboardShell.vue",
                props: ["userName, userInitials", "showStats: boolean", "stats: StatItem[]"],
                features: ["AppNavbar included at top", "Page title + subtitle via slots", "Actions slot for top-right buttons", "4 stats cards with icons, values, trends", "Trend arrows (up/down) with color coding"],
              },
              {
                name: "ShopCard.vue",
                props: ["shop: Shop object", "headerGradient: string"],
                features: ["Gradient header with shop name + status", "Capability pills (Digital, Large Format, etc)", "3-column stats (Machines, Materials, Templates)", "Last quote timestamp", "View Details + New Quote action buttons"],
              },
              {
                name: "ShopDetailPricing.vue",
                props: ["shopName, shopLocation"],
                features: ["4-tab navigation: Materials, Pricing, Products, Finishing", "Full materials table with type, size, weight, cost, stock", "Digital pricing table (per sheet/side)", "Large format pricing table (per m²)", "Product template cards grid", "Finishing services with enable/disable status"],
              },
              {
                name: "QuoteBuilder.vue",
                props: ["(self-contained demo data)"],
                features: ["Quote header with ID, status badge, action buttons", "Customer details form (name, phone, email)", "Quote items with full cost breakdowns", "Digital item: sheets × sides × price formula", "Large format item: area × rates + eyelets", "Quote totals with VAT calculation", "Notes textarea + Download PDF / Send buttons"],
              },
              {
                name: "TemplateTweaker.vue",
                props: ["(self-contained with reactive state)"],
                features: ["Product type selector (Cards, Flyers, Posters, Banners)", "Size dropdown + quantity input", "Single/double side toggle buttons", "Paper selection with per-sheet cost", "Finishing toggles (Cutting, Lamination, Eyelets)", "LIVE price preview that updates on any change", "Formula reference card", "Per-unit price calculation"],
              },
            ].map((comp) => (
              <div key={comp.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-lg font-bold text-gray-900">{comp.name}</h3>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {comp.props.map((p) => (
                    <code key={p} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{p}</code>
                  ))}
                </div>
                <ul className="space-y-1">
                  {comp.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F05224]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
