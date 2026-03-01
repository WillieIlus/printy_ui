<!-- QuoteBuilder.vue — Full quote page with items, breakdown, and totals -->
<template>
  <div class="space-y-6">
    <!-- Quote Header -->
    <div class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-flamingo-50">
          <svg class="h-6 w-6 text-flamingo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Quote #QT-2024-0047</h2>
          <p class="text-sm text-gray-500">Quick Print Nairobi · Created Jan 15, 2024</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700">
          <span class="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
          Draft
        </span>
        <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          Save Draft
        </button>
        <button class="rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          Send Quote
        </button>
      </div>
    </div>

    <!-- Customer Info -->
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Customer Details</h3>
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Customer Name</label>
          <input type="text" placeholder="e.g. Jane Wanjiru" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" placeholder="+254 7XX XXX XXX" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" placeholder="jane@company.co.ke" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20" />
        </div>
      </div>
    </div>

    <!-- Quote Items -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">Quote Items</h3>
        <button class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      <!-- Item Card 1: Digital -->
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
          <div class="flex items-center gap-3">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">1</span>
            <span class="text-sm font-semibold text-gray-900">A5 Flyers</span>
            <span class="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">DIGITAL</span>
          </div>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4 grid gap-4 sm:grid-cols-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Sheet Size</label>
              <div class="text-sm font-semibold text-gray-900">SRA3</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Quantity</label>
              <div class="text-sm font-semibold text-gray-900">1,000 pieces (250 sheets)</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Sides</label>
              <div class="text-sm font-semibold text-gray-900">Double-sided</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Material</label>
              <div class="text-sm font-semibold text-gray-900">150gsm Gloss</div>
            </div>
          </div>

          <!-- Cost Breakdown -->
          <div class="rounded-xl bg-gray-50 p-4">
            <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Cost Breakdown</div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Material (250 sheets × KES 8)</span>
                <span class="font-medium text-gray-900">KES 2,000</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Printing (250 × 2 sides × KES 45)</span>
                <span class="font-medium text-gray-900">KES 22,500</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Cutting (1,000 pcs × KES 1)</span>
                <span class="font-medium text-gray-900">KES 1,000</span>
              </div>
              <div class="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <span class="font-semibold text-gray-900">Subtotal</span>
                <span class="text-lg font-bold text-flamingo-600">KES 25,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Item Card 2: Large Format -->
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
          <div class="flex items-center gap-3">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">2</span>
            <span class="text-sm font-semibold text-gray-900">Vinyl Banner</span>
            <span class="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600">LARGE FORMAT</span>
          </div>
          <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4 grid gap-4 sm:grid-cols-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Dimensions</label>
              <div class="text-sm font-semibold text-gray-900">2m × 1m</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Quantity</label>
              <div class="text-sm font-semibold text-gray-900">3 pieces</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Area</label>
              <div class="text-sm font-semibold text-gray-900">6.00 m²</div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-500">Material</label>
              <div class="text-sm font-semibold text-gray-900">Vinyl 440gsm</div>
            </div>
          </div>

          <div class="rounded-xl bg-gray-50 p-4">
            <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Cost Breakdown</div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Material (6 m² × KES 450)</span>
                <span class="font-medium text-gray-900">KES 2,700</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Printing (6 m² × KES 350)</span>
                <span class="font-medium text-gray-900">KES 2,100</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Eyelets (24 pcs × KES 20)</span>
                <span class="font-medium text-gray-900">KES 480</span>
              </div>
              <div class="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <span class="font-semibold text-gray-900">Subtotal</span>
                <span class="text-lg font-bold text-flamingo-600">KES 5,280</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Summary / Totals -->
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <!-- Notes -->
        <div class="flex-1">
          <label class="mb-2 block text-sm font-medium text-gray-700">Notes to Customer</label>
          <textarea
            rows="3"
            placeholder="Any additional notes, terms, or delivery instructions..."
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
          ></textarea>
        </div>

        <!-- Totals -->
        <div class="w-full lg:w-80">
          <div class="rounded-xl bg-gray-50 p-5">
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">A5 Flyers</span>
                <span class="font-medium">KES 25,500</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Vinyl Banner (×3)</span>
                <span class="font-medium">KES 5,280</span>
              </div>
              <div class="h-px bg-gray-200"></div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700">Subtotal</span>
                <span class="font-semibold">KES 30,780</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">VAT (16%)</span>
                <span class="font-medium">KES 4,925</span>
              </div>
              <div class="h-px bg-gray-200"></div>
              <div class="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
                <span class="font-semibold">Total</span>
                <span class="text-xl font-extrabold">KES 35,705</span>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <button class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              Download PDF
            </button>
            <button class="rounded-xl bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
              Send to Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
