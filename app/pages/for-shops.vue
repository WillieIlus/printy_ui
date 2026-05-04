<template>
  <div class="bg-gray-50 dark:bg-gray-950 text-[#101828] dark:text-gray-100 min-h-screen">

    <!-- ── NAV ── -->
    <nav class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
          </div>
          <img
            :src="isDark ? '/assets/word-mark/light/printy-word-mark-03.svg' : '/assets/word-mark/dark/printy-word-mark-03.svg'"
            alt="Printy" class="h-4 w-auto"
          />
        </NuxtLink>
        <div class="flex items-center gap-3">
          <a href="/auth/login" class="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline hover:text-gray-900 dark:hover:text-white transition-colors">Login</a>
          <button
            @click="openAdjustModal(true)"
            class="bg-[#e13515] text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-[#c42e11] transition-colors"
          >
            Claim Spot
          </button>
        </div>
      </div>
    </nav>

    <!-- ── HERO ── -->
    <section class="bg-white dark:bg-gray-900 pt-12 pb-10 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-full px-3 py-1 mb-5">
          <span class="w-2 h-2 bg-[#e13515] rounded-full"></span>
          <span class="text-xs font-semibold text-[#e13515]">Nairobi-first · limited early setup</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#101828] dark:text-white leading-[1.1] tracking-tight mb-4">
          How much do you charge for<br class="hidden sm:inline" /> 50 Booklets?
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
          See how other Nairobi shops are pricing the same job. Adjust to match your costs, then claim your spot.
        </p>

        <!-- Interactive price input -->
        <div class="flex items-center gap-3 max-w-sm mx-auto mb-4">
          <div class="flex-1 flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 focus-within:border-[#e13515] transition-colors">
            <span class="text-sm font-semibold text-gray-400 shrink-0">KES</span>
            <input
              v-model.number="heroPrice"
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="e.g. 3500"
              class="flex-1 text-lg font-black text-[#101828] dark:text-white bg-transparent focus:outline-none placeholder-gray-300"
              @keydown.enter="checkMarketFit"
            />
          </div>
          <button
            @click="checkMarketFit"
            class="bg-[#e13515] hover:bg-[#c42e11] text-white font-bold rounded-xl px-5 py-3.5 text-sm transition-colors whitespace-nowrap shrink-0"
          >
            Check Market Fit →
          </button>
        </div>
        <p class="text-xs text-gray-400 mb-8">Enter your current price for 50 booklets (A5, 300gsm, stapled)</p>

        <!-- Secondary CTAs -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            @click="openAdjustModal(true)"
            class="bg-[#e13515] text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-[#c42e11] transition-colors"
          >
            Claim your spot — it's free
          </button>
          <a href="#pricing-demo" class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full px-6 py-3 text-sm hover:border-gray-400 transition-colors">
            See market pricing →
          </a>
        </div>

        <!-- Scarcity progress -->
        <div class="max-w-xs mx-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Nairobi early access</span>
          </div>
          <div class="flex items-center gap-3 mb-1">
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-[#e13515] rounded-full transition-all" :style="{ width: `${(spots.used / spots.total) * 100}%` }"></div>
            </div>
            <span class="text-sm font-black text-[#101828] dark:text-white whitespace-nowrap">{{ spots.used }} / {{ spots.total }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ spots.remaining }} spots left. Each shop is manually onboarded.</p>
        </div>
      </div>
    </section>

    <!-- ── MARKET PULSE ── -->
    <section
      id="market-pulse"
      class="py-10 transition-all duration-500"
      :class="marketPulseActive ? 'bg-gray-900' : 'bg-gray-100 dark:bg-gray-900'"
    >
      <div class="max-w-3xl mx-auto px-4">
        <div class="rounded-2xl overflow-hidden border" :class="marketPulseActive ? 'border-gray-700 bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'">

          <!-- Header -->
          <div class="px-5 py-4 border-b" :class="marketPulseActive ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest" :class="marketPulseActive ? 'text-slate-400' : 'text-gray-500'">
                  Market Intelligence · Nairobi
                </p>
                <p class="font-bold mt-0.5" :class="marketPulseActive ? 'text-white' : 'text-gray-900 dark:text-white'">
                  50 Booklets — A5, 300gsm, Saddle-stitched
                </p>
              </div>
              <div v-if="marketPulseActive && heroPrice > 0" class="text-right">
                <p class="text-xs" :class="marketPulseActive ? 'text-slate-400' : 'text-gray-500'">Your price</p>
                <p class="text-lg font-black" :class="heroDeviationClass">KES {{ heroPrice.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Market stats -->
          <div class="px-5 py-5">
            <div class="grid grid-cols-2 gap-4 mb-5">
              <div class="rounded-xl p-4 text-center" :class="marketPulseActive ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'">
                <p class="text-xs font-semibold mb-1" :class="marketPulseActive ? 'text-slate-400' : 'text-gray-500'">Nairobi Median</p>
                <p class="text-xl font-black" :class="marketPulseActive ? 'text-white' : 'text-gray-900 dark:text-white'">KES {{ BOOKLET_MEDIAN.toLocaleString() }}</p>
              </div>
              <div class="rounded-xl p-4 text-center" :class="marketPulseActive ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'">
                <p class="text-xs font-semibold mb-1" :class="marketPulseActive ? 'text-slate-400' : 'text-gray-500'">Nairobi Mean</p>
                <p class="text-xl font-black" :class="marketPulseActive ? 'text-white' : 'text-gray-900 dark:text-white'">KES {{ BOOKLET_MEAN.toLocaleString() }}</p>
              </div>
            </div>

            <!-- Deviation badge -->
            <div v-if="marketPulseActive && heroPrice > 0" class="rounded-lg px-4 py-3 mb-5 text-sm font-semibold" :class="deviationBadgeClass">
              {{ deviationMessage }}
            </div>

            <!-- Markup adjuster -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-semibold" :class="marketPulseActive ? 'text-slate-400' : 'text-gray-500'">Adjust markup to protect margins</span>
                <span class="text-xs font-bold" :class="marketPulseActive ? 'text-white' : 'text-gray-900 dark:text-white'">{{ markupSlider.toFixed(1) }}×</span>
              </div>
              <input
                v-model.number="markupSlider"
                type="range"
                min="1.3"
                max="1.8"
                step="0.05"
                class="w-full h-2 rounded-full accent-[#e13515] cursor-pointer"
              />
              <div class="flex justify-between text-[10px] mt-1" :class="marketPulseActive ? 'text-slate-500' : 'text-gray-400'">
                <span>1.3× (safe floor)</span>
                <span>1.8× (premium)</span>
              </div>
            </div>

            <!-- Calculated quote -->
            <div class="rounded-xl px-4 py-3 flex items-center justify-between" :class="marketPulseActive ? 'bg-[#e13515]/20 border border-[#e13515]/40' : 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'">
              <span class="text-sm font-semibold" :class="marketPulseActive ? 'text-orange-300' : 'text-orange-700 dark:text-orange-400'">Calculated quote at {{ markupSlider.toFixed(1) }}×</span>
              <span class="text-lg font-black text-[#e13515]">KES {{ calculatedQuote.toLocaleString() }}</span>
            </div>

            <p class="text-[10px] text-center mt-3" :class="marketPulseActive ? 'text-slate-500' : 'text-gray-400'">
              Anonymous Nairobi data · Competitor rate cards are never shown
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ── PRICE CARD GRID ── -->
    <section id="pricing-demo" class="py-12 bg-gray-50 dark:bg-gray-950">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-black text-[#101828] dark:text-white mb-2">
            Market pricing in Nairobi
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ locationData?.sufficient_data ? 'Live data from active shops' : 'Example market preview — grows as more shops join' }} ·
            <span class="font-semibold">Anonymised · No individual rates exposed</span>
          </p>
          <p v-if="locationData?.warning" class="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-full inline-block px-3 py-1">
            {{ locationData.warning }}
          </p>
        </div>

        <!-- 4 product cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            v-for="product in PRODUCT_CARDS"
            :key="product.key"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div class="text-2xl mb-2">{{ product.icon }}</div>
            <h3 class="font-black text-gray-900 dark:text-white text-sm mb-0.5">{{ product.label }}</h3>
            <p class="text-[10px] text-gray-400 mb-4">{{ product.specs }}</p>

            <template v-if="getProductData(product.key)">
              <div class="mb-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Market range</p>
                <p class="text-lg font-black text-[#101828] dark:text-white">
                  KES {{ getProductData(product.key)!.market_range.low.toLocaleString() }}
                  <span class="text-sm text-gray-400">–</span>
                  {{ getProductData(product.key)!.market_range.high.toLocaleString() }}
                </p>
              </div>
              <p class="text-[10px] text-gray-400">{{ getProductData(product.key)!.shops_contributing }}+ shops in Nairobi</p>
            </template>
            <template v-else>
              <div class="mb-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Market range (example)</p>
                <p class="text-lg font-black text-[#101828] dark:text-white">
                  KES {{ product.fallbackLow.toLocaleString() }}
                  <span class="text-sm text-gray-400">–</span>
                  {{ product.fallbackHigh.toLocaleString() }}
                </p>
              </div>
              <p class="text-[10px] text-amber-500">Example data · based on market estimates</p>
            </template>
          </div>
        </div>

        <!-- Grid CTAs -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="openAdjustModal(true)"
            class="bg-[#e13515] text-white font-bold rounded-full px-8 py-3.5 text-base hover:bg-[#c42e11] transition-colors"
          >
            Accept these prices &amp; sign up
          </button>
          <button
            @click="openAdjustModal(false)"
            class="border-2 border-[#e13515] text-[#e13515] font-bold rounded-full px-8 py-3.5 text-base hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
          >
            These don't match my shop — adjust
          </button>
        </div>
        <p class="text-xs text-center text-gray-400 mt-3">No credit card required · Setup in 30 min</p>
      </div>
    </section>

    <!-- ── WHY IT HELPS ── -->
    <section class="py-10 bg-white dark:bg-gray-900">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-center text-xl md:text-2xl font-black text-[#101828] dark:text-white mb-6">Built for the pricing problems print shops face every day.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Customers ask "how much?" without specs</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Quantity, size, paper, and finishing often arrive late — after your team has already guessed.</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="text-2xl mb-2">⚠️</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Staff quote from memory</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Different people quote differently. Printy gives your team a consistent, shop-defined base.</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="text-2xl mb-2">📉</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Negotiation without a safe floor</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Without a clear minimum, it's easy to discount below a healthy margin. Printy shows your floor.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CLAIM SPOT CTA ── -->
    <section class="py-16 bg-[#e13515]">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-5">
          <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span class="text-xs font-semibold text-white">{{ spots.remaining }} of {{ spots.total }} Nairobi spots remaining</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
          Claim your spot — it's free.
        </h2>
        <p class="text-red-100 text-base leading-relaxed mb-8">
          Structure your pricing, protect your margins, and receive cleaner quote-ready requests from Nairobi customers.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="openAdjustModal(true)"
            class="bg-white text-[#e13515] font-black rounded-full px-10 py-4 text-lg hover:bg-red-50 transition-colors"
          >
            Check my shop pricing →
          </button>
          <a href="#pricing-demo" class="border border-white/40 text-white font-semibold rounded-full px-6 py-4 text-base hover:bg-white/10 transition-colors">
            See market pricing
          </a>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-red-200">
          <span>No credit card</span>
          <span>·</span>
          <span>Setup in 30 min</span>
          <span>·</span>
          <span>Nairobi-first</span>
          <span>·</span>
          <span>Private rate cards never exposed</span>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="bg-gray-900 border-t border-gray-800 py-8">
      <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
          </div>
          <img src="/assets/word-mark/light/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto" />
          <span class="text-gray-500 text-sm ml-1">Built for Kenyan print shops.</span>
        </NuxtLink>
        <div class="flex gap-5 text-sm text-gray-500">
          <a href="/for-shops" class="hover:text-white transition-colors">For shop owners</a>
          <a href="/auth/login" class="hover:text-white transition-colors">Login</a>
        </div>
        <p class="text-gray-600 text-xs">© {{ currentYear }} Printy. All rights reserved.</p>
      </div>
    </footer>

    <!-- ── PRICE ADJUSTMENT MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="adjustModalOpen"
          class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          @click.self="adjustModalOpen = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button @click="adjustModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold leading-none z-10">✕</button>

            <!-- Step: Price comparison -->
            <div v-if="adjustStep === 'compare'" class="p-6 sm:p-8">
              <h3 class="text-xl font-black text-gray-900 mb-1">Set your shop's pricing</h3>
              <p class="text-sm text-gray-500 mb-6">Market baseline shown. Adjust to match your actual costs.</p>

              <!-- Comparison table -->
              <div class="overflow-x-auto -mx-2 mb-6">
                <table class="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                      <th class="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Market Low–High</th>
                      <th class="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Price Low–High</th>
                      <th class="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in priceRows"
                      :key="row.key"
                      class="border-b border-gray-100 last:border-0"
                    >
                      <td class="py-3 px-2">
                        <p class="font-semibold text-gray-900 text-xs">{{ row.label }}</p>
                        <p class="text-[10px] text-gray-400">{{ row.specs }}</p>
                      </td>
                      <td class="py-3 px-2 text-right text-xs text-gray-500 whitespace-nowrap">
                        KES {{ row.marketLow.toLocaleString() }} – {{ row.marketHigh.toLocaleString() }}
                      </td>
                      <td class="py-3 px-2">
                        <div class="flex items-center gap-1.5 justify-center">
                          <input
                            v-model.number="(userPrices[row.key] ??= { low: 0, high: 0 }).low"
                            type="number"
                            min="0"
                            class="w-20 text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-center font-semibold focus:outline-none focus:border-[#e13515]"
                          />
                          <span class="text-gray-400 text-xs">–</span>
                          <input
                            v-model.number="(userPrices[row.key] ??= { low: 0, high: 0 }).high"
                            type="number"
                            min="0"
                            class="w-20 text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-center font-semibold focus:outline-none focus:border-[#e13515]"
                          />
                        </div>
                      </td>
                      <td class="py-3 px-2 text-center">
                        <span class="text-sm">{{ getPriceStatus(row).icon }}</span>
                        <p class="text-[10px] mt-0.5" :class="getPriceStatus(row).textClass">{{ getPriceStatus(row).label }}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Below-market warning -->
              <div v-if="hasLowPriceWarning" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
                <span class="text-amber-500 text-lg shrink-0">⚠️</span>
                <p class="text-xs text-amber-700 leading-relaxed">
                  One or more of your prices is significantly below the Nairobi market median.
                  Consider adjusting your markup to protect your margins.
                  Printy suggests — your shop always decides.
                </p>
              </div>

              <!-- Markup hint -->
              <div class="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-5">
                <p class="text-xs text-gray-500 mb-2">Quick markup guide for reference</p>
                <div class="flex gap-3">
                  <div v-for="m in MARKUP_HINTS" :key="m.label" class="flex-1 text-center">
                    <p class="text-xs font-bold text-gray-900">{{ m.label }}</p>
                    <p class="text-[10px] text-gray-400">{{ m.desc }}</p>
                  </div>
                </div>
              </div>

              <p class="text-[10px] text-gray-400 text-center mb-5">Competitor rate cards are never shared. All market data is fully anonymised.</p>

              <div class="flex gap-3">
                <button
                  @click="adjustStep = 'signup'"
                  class="flex-1 bg-[#e13515] text-white font-black rounded-full py-3.5 hover:bg-[#c42e11] transition-colors text-base"
                >
                  Save &amp; create my shop →
                </button>
                <button @click="adjustModalOpen = false" class="px-5 text-sm font-semibold rounded-full py-3.5 border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </div>

            <!-- Step: Signup -->
            <div v-else-if="adjustStep === 'signup'" class="p-6 sm:p-8">
              <!-- FOMO ticker -->
              <div class="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3 mb-5">
                <div class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <p class="text-xs font-semibold text-white">Nairobi: {{ spots.remaining }} spots remaining</p>
                </div>
                <div class="flex items-center gap-1">
                  <span v-for="i in Math.min(spots.used, 5)" :key="i" class="w-5 h-5 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-[8px] text-gray-400 font-bold -ml-1">P</span>
                  <span class="text-[10px] text-gray-400 ml-1">already claimed theirs</span>
                </div>
              </div>

              <h3 class="text-xl font-black text-gray-900 mb-1">Create my shop &amp; go live</h3>
              <p class="text-sm text-gray-500 mb-5">Your pricing will be saved and your spot reserved.</p>

              <div class="space-y-3">
                <input v-model="signupForm.shopName" type="text" placeholder="Shop name" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]" />
                <input v-model="signupForm.whatsapp" type="tel" placeholder="WhatsApp number (+254...)" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]" />
                <input v-model="signupForm.email" type="email" placeholder="Email address" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]" />
                <input v-model="signupForm.password" type="password" placeholder="Password (min 8 characters)" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]" />
                <input v-model="signupForm.confirmPassword" type="password" placeholder="Confirm password" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]" />
                <label class="flex items-start gap-3 cursor-pointer">
                  <input v-model="signupForm.acceptedTerms" type="checkbox" class="mt-0.5 accent-[#e13515]" />
                  <span class="text-xs text-gray-500">I agree to Printy's <a href="/terms" class="text-[#e13515] underline">terms of service</a> and understand my rate card is private.</span>
                </label>
              </div>

              <p v-if="signupError" class="mt-3 text-xs text-red-600 text-center">{{ signupError }}</p>

              <button
                @click="submitSignup"
                :disabled="signupSubmitting"
                class="mt-5 w-full bg-[#e13515] text-white font-black rounded-full py-4 text-base hover:bg-[#c42e11] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ signupSubmitting ? 'Creating your shop…' : 'Create my shop & go live →' }}
              </button>

              <div class="mt-3 flex items-center justify-between">
                <button @click="adjustStep = 'compare'" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to pricing</button>
                <p class="text-xs text-gray-400">No payment. You approve before anything goes live.</p>
              </div>
            </div>

            <!-- Step: Success -->
            <div v-else-if="adjustStep === 'success'" class="p-6 sm:p-8 text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
              <h3 class="text-2xl font-black text-gray-900 mb-2">Your shop is live!</h3>
              <p class="text-gray-500 text-sm mb-6">Account created and spot claimed. We'll reach out within 24 hours to schedule your pricing setup session.</p>
              <NuxtLink to="/dashboard" class="inline-block bg-[#e13515] text-white font-black rounded-full px-10 py-4 text-base hover:bg-[#c42e11] transition-colors">
                Go to dashboard →
              </NuxtLink>
              <button @click="adjustModalOpen = false" class="mt-3 block w-full text-xs text-gray-400 hover:text-gray-600 transition-colors">Close</button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { usePublicApiNoAuth } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'For Print Shop Owners — Printy',
  description: 'See how other Nairobi print shops are pricing. Adjust to match your costs, claim your free early-access spot.',
  ogTitle: 'For Print Shop Owners — Printy',
  ogDescription: 'See how other Nairobi print shops are pricing. Adjust to match your costs, claim your free early-access spot.',
})

// ── Color mode ────────────────────────────────────────────────────────────────
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// ── Auth + API ────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const noAuthApi = usePublicApiNoAuth()

// ── Spots ─────────────────────────────────────────────────────────────────────
const { data: spotsData } = useAsyncData('early-access-spots', async () => {
  try {
    const res = await noAuthApi<{ total_spots: number; claimed_spots: number; remaining_spots: number }>('/public/early-access/?city=Nairobi')
    return { total: res.total_spots, used: res.claimed_spots, remaining: res.remaining_spots }
  } catch {
    try {
      return await noAuthApi<{ total: number; used: number; remaining: number }>('/leads/spots/')
    } catch {
      return null
    }
  }
})
const spots = computed(() => spotsData.value ?? { total: 20, used: 12, remaining: 8 })

// ── Location pricing ──────────────────────────────────────────────────────────
interface ProductPricingData {
  market_range: { low: number; high: number }
  median: number
  mean: number
  shops_contributing: number
}

interface LocationPricingResponse {
  location: string
  shops_in_location: number
  pricing_data: Record<string, ProductPricingData>
  sufficient_data: boolean
  warning: string | null
  fallback_used: boolean
  fallback_location: string | null
}

const { data: locationData } = useAsyncData('location-pricing', () =>
  noAuthApi<LocationPricingResponse>('/shops/location-pricing/?location=Nairobi').catch(() => null),
)

function getProductData(key: string): ProductPricingData | null {
  return locationData.value?.pricing_data?.[key] ?? null
}

// ── Hero interactive question ─────────────────────────────────────────────────
const heroPrice = ref(0)
const marketPulseActive = ref(false)
const markupSlider = ref(1.5)

// Fallback demo market data for 50 booklets
const BOOKLET_MEDIAN = 4500
const BOOKLET_MEAN = 4820

const heroPriceDeviation = computed(() => {
  if (!heroPrice.value || heroPrice.value <= 0) return null
  return ((heroPrice.value - BOOKLET_MEDIAN) / BOOKLET_MEDIAN) * 100
})

const heroDeviationClass = computed(() => {
  const dev = heroPriceDeviation.value
  if (dev === null) return 'text-white'
  if (dev >= -10) return 'text-green-400'
  if (dev >= -20) return 'text-amber-400'
  return 'text-red-400'
})

const deviationMessage = computed(() => {
  const dev = heroPriceDeviation.value
  if (dev === null) return ''
  const pct = Math.abs(Math.round(dev))
  if (dev > 10) return `✓ Your price is ${pct}% above the Nairobi median — strong positioning.`
  if (dev >= -10) return `✓ Your price is within 10% of the Nairobi median — well-positioned.`
  if (dev >= -20) return `⚠ Your price is ${pct}% below the Nairobi median. Adjust markup to protect margins.`
  return `⚠ Your price is ${pct}% below market average. This price is 12% below market average. Adjust markup to protect margins.`
})

const deviationBadgeClass = computed(() => {
  const dev = heroPriceDeviation.value
  if (dev === null) return ''
  if (dev >= -10) return 'bg-green-900/30 text-green-400 border border-green-700'
  if (dev >= -20) return 'bg-amber-900/30 text-amber-400 border border-amber-700'
  return 'bg-red-900/30 text-red-400 border border-red-700'
})

const calculatedQuote = computed(() => {
  const base = heroPrice.value > 0 ? heroPrice.value / 1.5 : BOOKLET_MEDIAN / 1.5
  return Math.round(base * markupSlider.value)
})

function checkMarketFit() {
  marketPulseActive.value = true
  if (import.meta.client) {
    const el = document.getElementById('market-pulse')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// ── Product cards ─────────────────────────────────────────────────────────────
const PRODUCT_CARDS = [
  {
    key: 'booklets',
    label: 'Booklets',
    icon: '📚',
    specs: '50 units · A5 · 300gsm · Stapled',
    fallbackLow: 3200,
    fallbackHigh: 5500,
  },
  {
    key: 'flyers',
    label: 'A4 Flyers',
    icon: '📄',
    specs: '500 units · A5 · 150gsm · Uncut',
    fallbackLow: 1800,
    fallbackHigh: 3200,
  },
  {
    key: 'posters',
    label: 'Posters',
    icon: '🖼️',
    specs: '10 units · A2 · 200gsm · Uncut',
    fallbackLow: 3000,
    fallbackHigh: 6000,
  },
  {
    key: 'business_cards',
    label: 'Business Cards',
    icon: '🪪',
    specs: '500 units · 250gsm · Unlaminated',
    fallbackLow: 1500,
    fallbackHigh: 3500,
  },
]

// ── Price Adjustment Modal ────────────────────────────────────────────────────
type AdjustStep = 'compare' | 'signup' | 'success'
const adjustModalOpen = ref(false)
const adjustStep = ref<AdjustStep>('compare')

interface PriceRow {
  key: string
  label: string
  specs: string
  marketLow: number
  marketHigh: number
  marketMedian: number
}

const priceRows = computed<PriceRow[]>(() =>
  PRODUCT_CARDS.map((p) => {
    const d = getProductData(p.key)
    return {
      key: p.key,
      label: p.label,
      specs: p.specs,
      marketLow: d?.market_range.low ?? p.fallbackLow,
      marketHigh: d?.market_range.high ?? p.fallbackHigh,
      marketMedian: d?.median ?? Math.round((p.fallbackLow + p.fallbackHigh) / 2),
    }
  }),
)

// User-editable prices (per product)
const userPrices = reactive<Record<string, { low: number; high: number }>>({})

function initUserPrices(acceptMarket: boolean) {
  priceRows.value.forEach((row) => {
    userPrices[row.key] = {
      low: acceptMarket ? row.marketLow : row.marketLow,
      high: acceptMarket ? row.marketHigh : row.marketHigh,
    }
  })
}

function openAdjustModal(acceptMarket: boolean) {
  initUserPrices(acceptMarket)
  adjustStep.value = 'compare'
  adjustModalOpen.value = true
  signupError.value = null
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

watch(adjustModalOpen, (open) => {
  if (!open && import.meta.client) document.body.style.overflow = ''
})

// Status indicator logic
interface PriceStatus {
  icon: string
  label: string
  textClass: string
}

function getPriceStatus(row: PriceRow): PriceStatus {
  const userLow = userPrices[row.key]?.low ?? 0
  if (!userLow || userLow <= 0) return { icon: '⬜', label: 'Enter price', textClass: 'text-gray-400' }

  const deviation = ((userLow - row.marketMedian) / row.marketMedian) * 100
  if (deviation >= -10) return { icon: '🟢', label: 'Within market', textClass: 'text-green-600' }
  if (deviation >= -20) return { icon: '🟡', label: `${Math.abs(Math.round(deviation))}% below`, textClass: 'text-amber-600' }
  return { icon: '🔴', label: `${Math.abs(Math.round(deviation))}% below`, textClass: 'text-red-600' }
}

const hasLowPriceWarning = computed(() =>
  priceRows.value.some((row) => {
    const userLow = userPrices[row.key]?.low ?? 0
    if (!userLow) return false
    return ((userLow - row.marketMedian) / row.marketMedian) * 100 < -10
  }),
)

const MARKUP_HINTS = [
  { label: '1.3×', desc: 'Safe floor' },
  { label: '1.5×', desc: 'Recommended' },
  { label: '1.8×', desc: 'Premium' },
]

// ── Signup ────────────────────────────────────────────────────────────────────
const signupForm = reactive({
  shopName: '',
  whatsapp: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
})
const signupSubmitting = ref(false)
const signupError = ref<string | null>(null)

async function submitSignup() {
  signupError.value = null
  if (!signupForm.shopName.trim()) { signupError.value = 'Shop name is required.'; return }
  if (!signupForm.whatsapp.trim()) { signupError.value = 'WhatsApp number is required.'; return }
  if (!signupForm.email.trim()) { signupError.value = 'Email is required.'; return }
  if (signupForm.password.length < 8) { signupError.value = 'Password must be at least 8 characters.'; return }
  if (signupForm.password !== signupForm.confirmPassword) { signupError.value = 'Passwords do not match.'; return }
  if (!signupForm.acceptedTerms) { signupError.value = 'Please accept the terms of service.'; return }

  signupSubmitting.value = true
  try {
    await noAuthApi('/auth/register/', {
      method: 'POST' as const,
      body: {
        email: signupForm.email.trim(),
        password: signupForm.password,
        name: signupForm.shopName.trim(),
        first_name: signupForm.shopName.trim(),
        last_name: '',
        role: 'shop_owner',
      },
    })

    await authStore.login(signupForm.email.trim(), signupForm.password)

    noAuthApi('/leads/apply/', {
      method: 'POST' as const,
      body: {
        shop_name: signupForm.shopName.trim(),
        phone: signupForm.whatsapp.trim(),
        area: 'Nairobi',
      },
    }).catch(() => {})

    adjustStep.value = 'success'
  } catch (err: unknown) {
    const e = err as { data?: { detail?: string; email?: string[] } }
    signupError.value = e?.data?.detail ?? e?.data?.email?.[0] ?? 'Something went wrong. Please try again.'
  } finally {
    signupSubmitting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const currentYear = new Date().getFullYear()

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
