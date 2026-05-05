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
        <div class="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-full px-3 py-1 mb-5">
          <span class="w-2 h-2 bg-[#e13515] rounded-full"></span>
          <span class="text-xs font-semibold text-[#e13515]">Nairobi early access</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-[#101828] dark:text-white leading-[1.1] tracking-tight mb-4">
          Claim your shop&apos;s spot before onboarding closes.
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
          Early shops are onboarded manually so pricing, materials, and turnaround rules are set up properly from the start.
        </p>

        <div class="flex justify-center mb-10">
          <button
            @click="openAdjustModal(true)"
            class="bg-[#e13515] text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-[#c42e11] transition-colors"
          >
            Claim your spot — it's free
          </button>
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

    <!-- ── PRODUCTION CALCULATOR DEMO ── -->
    <section id="production-calc" class="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-5xl mx-auto px-4">

        <!-- Section header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-full px-3 py-1 mb-4">
            <span class="w-1.5 h-1.5 bg-[#e13515] rounded-full"></span>
            <span class="text-xs font-semibold text-[#e13515]">Production logic included</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-[#101828] dark:text-white mb-2">
            The market.
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            See the sheets, finishing, and markup behind every quote. Competitor rate cards are never shown.
          </p>
        </div>

        <!-- Rate configurator -->
        <div class="bg-gray-900 rounded-2xl border border-gray-700 mb-6 overflow-hidden">
          <button
            @click="ratePanelOpen = !ratePanelOpen"
            class="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-white">⚙ Your shop rates</span>
              <span class="text-xs text-gray-400 hidden sm:inline">Adjust to match your actual costs — prices update live</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs bg-orange-900/40 text-orange-400 font-semibold px-2 py-0.5 rounded-full">Semi-adjustable</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform" :class="ratePanelOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>
          <div v-if="ratePanelOpen" class="px-5 pb-5 border-t border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">Machine rate / side</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.machine" type="number" min="5" max="100" step="1" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">130gsm SRA3 paper</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.p130" type="number" min="1" max="30" step="0.5" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">150gsm SRA3 paper</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.p150" type="number" min="1" max="30" step="0.5" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">250gsm SRA3 paper</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.p250" type="number" min="2" max="50" step="0.5" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">300gsm SRA3 paper</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.p300" type="number" min="2" max="60" step="0.5" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">Matte lam / SRA3 sheet</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.lam" type="number" min="5" max="80" step="1" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">Saddle-stitch / booklet</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.stitch" type="number" min="5" max="120" step="5" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-400 block mb-1">Cutting — per job</label>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">KES</span>
                  <input v-model.number="rates.cut" type="number" min="100" max="1500" step="50" class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:border-[#e13515]" />
                </div>
              </div>
            </div>
            <p class="mt-3 text-xs text-gray-500">Markup applied: 1.3× floor · 1.55× recommended · 1.8× premium — auto-applied to production cost.</p>
          </div>
        </div>

        <!-- 4 Product cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            v-for="product in calcProducts"
            :key="product.key"
            class="bg-gray-900 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <span class="text-2xl">{{ product.icon }}</span>
                <h3 class="font-black text-white mt-1">{{ product.label }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ product.specs }}</p>
              </div>
              <span class="text-xs bg-blue-900/40 text-blue-300 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">{{ product.badge }}</span>
            </div>

            <div class="flex items-center gap-2 mb-4">
              <label class="text-xs font-semibold text-gray-400 shrink-0">Qty</label>
              <input
                v-model.number="calcQty[product.key]"
                type="number"
                :min="product.minQty"
                :step="product.stepQty"
                class="w-28 bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:border-[#e13515]"
              />
              <span class="text-xs text-gray-500">{{ product.unit }}</span>
            </div>

            <div class="bg-gray-800 rounded-xl p-3 mb-3 space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Production cost</span>
                <span class="font-bold text-gray-200">KES {{ Math.round(product.data.cost).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Floor (1.3×)</span>
                <span class="text-gray-400">KES {{ calcTiers(product.data.cost).floor.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs font-bold bg-[#e13515]/20 border border-[#e13515]/30 rounded-lg px-2 py-1">
                <span class="text-orange-300">★ Recommended (1.55×)</span>
                <span class="text-[#e13515]">KES {{ calcTiers(product.data.cost).recommended.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Premium (1.8×)</span>
                <span class="text-gray-400">KES {{ calcTiers(product.data.cost).premium.toLocaleString() }}</span>
              </div>
            </div>

            <p class="text-[10px] text-gray-500 mb-2.5">Imposition included · {{ product.data.sheets.toLocaleString() }} SRA3 sheets needed</p>

            <button
              @click="openBreakdown(product.key)"
              class="w-full border border-[#e13515]/50 text-[#e13515] font-semibold text-sm rounded-xl py-2.5 hover:bg-[#e13515]/10 transition-colors"
            >
              View imposition &amp; breakdown →
            </button>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400 mb-6">SRA3 (320×450mm) sheet size · 5% waste allowance · Backend imposition logic</p>

        <div class="text-center">
          <button
            @click="openAdjustModal(true)"
            class="inline-flex items-center gap-2 bg-[#e13515] text-white font-bold rounded-full px-8 py-3.5 text-base hover:bg-[#c42e11] transition-colors"
          >
            Printy suggests. The shop decides. — Claim spot →
          </button>
        </div>
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
          <a href="#production-calc" class="border border-white/40 text-white font-semibold rounded-full px-6 py-4 text-base hover:bg-white/10 transition-colors">
            See the market
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

            <!-- Step: Signup -->
            <div v-if="adjustStep === 'signup'" class="p-6 sm:p-8">
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
                <button @click="adjustModalOpen = false" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Cancel</button>
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

    <!-- ── BREAKDOWN MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="breakdownOpen"
          class="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4"
          @click.self="closeBreakdown"
        >
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">

            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div v-if="activeCalcProduct">
                <p class="text-xs font-semibold text-[#e13515] uppercase tracking-widest">{{ activeCalcProduct.specs }}</p>
                <h3 class="font-black text-gray-900 dark:text-white text-lg">Imposition &amp; Cost Breakdown</h3>
              </div>
              <button @click="closeBreakdown" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0 ml-2">✕</button>
            </div>

            <!-- Body -->
            <div v-if="activeCalcProduct" class="px-6 py-5 space-y-6">

              <!-- Quantity adjuster -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div class="flex-1">
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Adjust quantity</p>
                  <input
                    v-model.number="calcQty[activeCalcProduct.key]"
                    type="number"
                    :min="activeCalcProduct.minQty"
                    :step="activeCalcProduct.stepQty"
                    class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-lg font-black focus:outline-none focus:border-[#e13515]"
                  />
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-400">SRA3 sheets</p>
                  <p class="text-2xl font-black text-gray-900 dark:text-white">{{ activeCalcProduct.data.sheets.toLocaleString() }}</p>
                  <p class="text-xs text-gray-400">sheets needed</p>
                </div>
              </div>

              <!-- Imposition visual -->
              <div>
                <p class="text-xs font-bold text-[#e13515] uppercase tracking-widest mb-3">Imposition logic</p>
                <div class="space-y-4">
                  <template v-if="activeCalcProduct.data.imposition?.type === 'booklet'">
                    <div>
                      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Cover (SRA3 → 2-up · folds to A5)</p>
                      <div class="flex gap-1 mb-1">
                        <span v-for="i in 2" :key="i" class="inline-flex items-center justify-center w-10 h-6 bg-orange-100 border border-orange-300 rounded text-[9px] font-bold text-orange-700">CVR</span>
                      </div>
                      <p class="text-xs text-gray-400">1 SRA3 sheet → 2 covers · {{ activeCalcProduct.data.imposition.coverSheets }} cover sheets for {{ calcQty[activeCalcProduct.key] }} copies</p>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Inserts (each SRA3 sheet = 1 folded signature = 4 A5 pages)</p>
                      <div class="flex gap-1 mb-1">
                        <span v-for="i in 4" :key="i" class="inline-flex items-center justify-center w-10 h-6 bg-blue-100 border border-blue-300 rounded text-[9px] font-bold text-blue-700">p{{ (i-1)*2+1 }}-{{ i*2 }}</span>
                      </div>
                      <p class="text-xs text-gray-400">{{ activeCalcProduct.data.imposition.insertsPer }} sheets/booklet × {{ calcQty[activeCalcProduct.key] }} copies = {{ activeCalcProduct.data.imposition.insertSheets }} insert sheets</p>
                    </div>
                  </template>
                  <template v-else>
                    <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{{ activeCalcProduct.data.imposition?.label }} on SRA3 (320×450mm)</p>
                    <div class="inline-block border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                      <div
                        class="gap-1"
                        :style="{ display: 'grid', gridTemplateColumns: `repeat(${activeCalcProduct.data.imposition?.cols ?? 1}, auto)` }"
                      >
                        <span
                          v-for="i in (activeCalcProduct.data.imposition?.up ?? 1)"
                          :key="i"
                          class="inline-flex items-center justify-center w-7 h-5 bg-blue-100 border border-blue-300 rounded text-[9px] font-bold text-blue-700"
                        >#{{ i }}</span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Each cell = one {{ activeCalcProduct.data.imposition?.size }} piece</p>
                  </template>
                </div>
              </div>

              <!-- Cost breakdown -->
              <div>
                <p class="text-xs font-bold text-[#e13515] uppercase tracking-widest mb-3">Cost breakdown</p>

                <!-- Booklet: grouped -->
                <template v-if="activeCalcProduct.key === 'bk'">
                  <div v-for="groupKey in ['cover', 'inner', 'finish']" :key="groupKey" class="mb-3">
                    <template v-if="activeCalcProduct.data.components.some((c: CalcComponent) => c.group === groupKey)">
                      <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 mb-1">
                        <span class="text-xs font-bold text-gray-700 dark:text-gray-200">
                          {{ groupKey === 'cover' ? 'Cover (250gsm)' : groupKey === 'inner' ? 'Inserts (130gsm)' : 'Finishing' }}
                        </span>
                        <span class="text-xs font-bold text-gray-700 dark:text-gray-200">
                          KES {{ Math.round(activeCalcProduct.data.components.filter((c: CalcComponent) => c.group === groupKey).reduce((s: number, c: CalcComponent) => s + c.subtotal, 0)).toLocaleString() }}
                        </span>
                      </div>
                      <div
                        v-for="comp in activeCalcProduct.data.components.filter((c: CalcComponent) => c.group === groupKey)"
                        :key="comp.key"
                        class="flex items-start justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div class="flex-1 min-w-0 pr-2">
                          <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ comp.label }}</p>
                          <p class="text-xs text-gray-400">{{ comp.formula }}</p>
                          <div class="flex items-center gap-1 mt-1">
                            <span class="text-[10px] text-gray-400 shrink-0">Rate:</span>
                            <input
                              v-model.number="rates[comp.rateKey as RateKey]"
                              type="number"
                              min="0"
                              step="1"
                              class="w-16 text-[10px] border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-1.5 py-0.5 font-semibold focus:outline-none focus:border-[#e13515]"
                            />
                            <span class="text-[10px] text-gray-400">{{ comp.rateLabel }}</span>
                          </div>
                        </div>
                        <span class="text-xs font-bold text-gray-900 dark:text-white shrink-0">KES {{ Math.round(comp.subtotal).toLocaleString() }}</span>
                      </div>
                    </template>
                  </div>
                </template>

                <!-- Flat products -->
                <template v-else>
                  <div
                    v-for="comp in activeCalcProduct.data.components"
                    :key="comp.key"
                    class="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div class="flex-1 min-w-0 pr-2">
                      <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ comp.label }}</p>
                      <p class="text-xs text-gray-400">{{ comp.formula }}</p>
                      <div class="flex items-center gap-1 mt-1">
                        <span class="text-[10px] text-gray-400 shrink-0">Rate:</span>
                        <input
                          v-model.number="rates[comp.rateKey as RateKey]"
                          type="number"
                          min="0"
                          step="1"
                          class="w-16 text-[10px] border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-1.5 py-0.5 font-semibold focus:outline-none focus:border-[#e13515]"
                        />
                        <span class="text-[10px] text-gray-400">{{ comp.rateLabel }}</span>
                      </div>
                    </div>
                    <span class="text-xs font-bold text-gray-900 dark:text-white shrink-0">KES {{ Math.round(comp.subtotal).toLocaleString() }}</span>
                  </div>
                </template>

                <div class="flex justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">Total production cost</span>
                  <span class="text-sm font-black text-gray-900 dark:text-white">KES {{ Math.round(activeCalcProduct.data.cost).toLocaleString() }}</span>
                </div>
              </div>

              <!-- Markup tiers -->
              <div>
                <p class="text-xs font-bold text-[#e13515] uppercase tracking-widest mb-3">Pricing tiers (your markup)</p>
                <div class="space-y-2">
                  <div class="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Floor 1.3×</span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">Minimum safe price</span>
                    </div>
                    <span class="font-bold text-gray-900 dark:text-white">KES {{ calcTiers(activeCalcProduct.data.cost).floor.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between border-2 border-[#e13515] bg-orange-50 dark:bg-orange-950/30 rounded-xl px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span class="bg-[#e13515] text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">★ Recommended 1.55×</span>
                      <span class="text-sm text-gray-700 dark:text-gray-300">Market median</span>
                    </div>
                    <span class="font-black text-[#e13515]">KES {{ calcTiers(activeCalcProduct.data.cost).recommended.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">Premium 1.8×</span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">High-margin quote</span>
                    </div>
                    <span class="font-bold text-green-600 dark:text-green-400">KES {{ calcTiers(activeCalcProduct.data.cost).premium.toLocaleString() }}</span>
                  </div>
                  <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
                    Negotiation room: <strong>KES {{ (calcTiers(activeCalcProduct.data.cost).recommended - calcTiers(activeCalcProduct.data.cost).floor).toLocaleString() }}</strong>
                    — stay above KES {{ calcTiers(activeCalcProduct.data.cost).floor.toLocaleString() }} to protect margin
                  </div>
                </div>
              </div>

              <!-- CTA -->
              <div class="text-center pb-2 space-y-2">
                <p class="text-xs text-gray-400 italic">Printy suggests. Your shop decides.</p>
                <button
                  @click="closeBreakdown(); openAdjustModal(true)"
                  class="w-full bg-[#e13515] text-white font-black rounded-full py-3.5 hover:bg-[#c42e11] transition-colors"
                >
                  Use these rates &amp; claim my spot →
                </button>
              </div>

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

// ── Price Adjustment Modal ──────────────────────────────────────────────────── ────────────────────────────────────────────────────
type AdjustStep = 'signup' | 'success'
const adjustModalOpen = ref(false)
const adjustStep = ref<AdjustStep>('signup')

function openAdjustModal(_acceptMarket: boolean = true) {
  adjustStep.value = 'signup'
  adjustModalOpen.value = true
  signupError.value = null
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

watch(adjustModalOpen, (open) => {
  if (!open && import.meta.client) document.body.style.overflow = ''
})

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

// ── Mini Production Calculator ────────────────────────────────────────────────

type RateKey = 'machine' | 'p130' | 'p150' | 'p250' | 'p300' | 'lam' | 'stitch' | 'cut'

interface CalcComponent {
  key: string
  label: string
  formula: string
  subtotal: number
  group: string
  rateKey: RateKey
  rateLabel: string
}

interface CalcImposition {
  type: 'grid' | 'booklet'
  up: number
  cols: number
  rows: number
  label: string
  size: string
  coverSheets?: number
  insertSheets?: number
  insertsPer?: number
}

interface CalcResult {
  sheets: number
  cost: number
  components: CalcComponent[]
  imposition: CalcImposition
}

const rates = reactive<Record<RateKey, number>>({
  machine: 15,
  p130: 5,
  p150: 6,
  p250: 10,
  p300: 12,
  lam: 25,
  stitch: 30,
  cut: 300,
})

const calcQty = reactive<Record<string, number>>({
  bc: 500,
  fl: 1000,
  bk: 24,
  po: 100,
})

function _calcBC(qty: number): CalcResult {
  // SRA3 320×450mm, business card 90×54mm + 3mm bleed = 96×60mm piece
  // Normal: (320÷96)×(450÷60) = 3×7 = 21-up
  const up = 21
  const sheets = Math.ceil((qty / up) * 1.05)
  const paperCost = sheets * rates.p300
  const printCost = sheets * 2 * rates.machine
  const lamCost = sheets * rates.lam
  const cutCost = rates.cut
  return {
    sheets,
    cost: paperCost + printCost + lamCost + cutCost,
    imposition: { type: 'grid', up, cols: 3, rows: 7, label: '21-up (3 cols × 7 rows)', size: '90×54mm business card' },
    components: [
      { key: 'paper',   label: '300gsm Art Card paper',   formula: `${sheets} SRA3 sheets × KES ${rates.p300}`,             subtotal: paperCost, group: 'paper',  rateKey: 'p300',    rateLabel: 'per SRA3 sheet' },
      { key: 'print',   label: 'Printing (duplex)',        formula: `${sheets} sheets × 2 sides × KES ${rates.machine}`,    subtotal: printCost, group: 'print',  rateKey: 'machine', rateLabel: 'per side/click' },
      { key: 'lam',     label: 'Matte lamination',         formula: `${sheets} sheets × KES ${rates.lam}`,                 subtotal: lamCost,   group: 'finish', rateKey: 'lam',     rateLabel: 'per SRA3 sheet' },
      { key: 'cutting', label: 'Cutting (per job)',         formula: 'Fixed rate',                                           subtotal: cutCost,   group: 'finish', rateKey: 'cut',     rateLabel: 'per job' },
    ],
  }
}

function _calcFL(qty: number): CalcResult {
  // A4 (210×297mm) + 3mm bleed = 216×303mm piece, rotated 2-up on SRA3
  const up = 2
  const sheets = Math.ceil((qty / up) * 1.05)
  const paperCost = sheets * rates.p150
  const printCost = sheets * rates.machine
  const cutCost = rates.cut
  return {
    sheets,
    cost: paperCost + printCost + cutCost,
    imposition: { type: 'grid', up, cols: 1, rows: 2, label: '2-up (rotated, 1 col × 2 rows)', size: 'A4 (210×297mm)' },
    components: [
      { key: 'paper',   label: '150gsm Bond paper',        formula: `${sheets} SRA3 sheets × KES ${rates.p150}`,             subtotal: paperCost, group: 'paper',  rateKey: 'p150',    rateLabel: 'per SRA3 sheet' },
      { key: 'print',   label: 'Printing (simplex)',        formula: `${sheets} sheets × 1 side × KES ${rates.machine}`,    subtotal: printCost, group: 'print',  rateKey: 'machine', rateLabel: 'per side/click' },
      { key: 'cutting', label: 'Cutting (per job)',         formula: 'Fixed rate',                                           subtotal: cutCost,   group: 'finish', rateKey: 'cut',     rateLabel: 'per job' },
    ],
  }
}

function _calcBK(qty: number): CalcResult {
  // A5 booklet, 24 pages: cover = 4pp, inserts = 20pp
  // Cover: A4 open (297×210mm) + 3mm bleed = 303×216mm → 2-up on SRA3
  const coverSheets = Math.ceil((qty / 2) * 1.05)
  // Inserts: each SRA3 = 1 folded signature = 4 A5 pages (saddle-stitch)
  const insertsPer = Math.ceil(20 / 4)  // = 5 signatures per booklet
  const insertSheets = Math.ceil(qty * insertsPer * 1.05)
  const coverPaper = coverSheets * rates.p250
  const coverPrint = coverSheets * 2 * rates.machine
  const insertPaper = insertSheets * rates.p130
  const insertPrint = insertSheets * 2 * rates.machine
  const stitchCost = qty * rates.stitch
  return {
    sheets: coverSheets + insertSheets,
    cost: coverPaper + coverPrint + insertPaper + insertPrint + stitchCost,
    imposition: { type: 'booklet', up: 2, cols: 2, rows: 1, label: 'Cover 2-up · Inserts per signature', size: 'A5 finished (148×210mm)', coverSheets, insertSheets, insertsPer },
    components: [
      { key: 'cover_paper',  label: 'Cover paper (250gsm)',     formula: `${coverSheets} SRA3 sheets × KES ${rates.p250} (2-up)`,              subtotal: coverPaper,  group: 'cover',  rateKey: 'p250',    rateLabel: 'per SRA3 sheet' },
      { key: 'cover_print',  label: 'Cover printing (duplex)',  formula: `${coverSheets} sheets × 2 sides × KES ${rates.machine}`,              subtotal: coverPrint,  group: 'cover',  rateKey: 'machine', rateLabel: 'per side/click' },
      { key: 'insert_paper', label: 'Insert paper (130gsm)',    formula: `${insertSheets} SRA3 sheets × KES ${rates.p130} (5 sigs/booklet)`,    subtotal: insertPaper, group: 'inner',  rateKey: 'p130',    rateLabel: 'per SRA3 sheet' },
      { key: 'insert_print', label: 'Insert printing (duplex)', formula: `${insertSheets} sheets × 2 sides × KES ${rates.machine}`,             subtotal: insertPrint, group: 'inner',  rateKey: 'machine', rateLabel: 'per side/click' },
      { key: 'stitch',       label: 'Saddle-stitch binding',    formula: `${qty} booklets × KES ${rates.stitch}`,                              subtotal: stitchCost,  group: 'finish', rateKey: 'stitch',  rateLabel: 'per booklet' },
    ],
  }
}

function _calcPO(qty: number): CalcResult {
  // A3 (297×420mm) + 3mm bleed = 303×426mm → 1-up on SRA3
  const sheets = Math.ceil(qty * 1.05)
  const paperRate = parseFloat((rates.p150 * 1.2).toFixed(2))  // 170gsm ≈ 1.2× 150gsm price
  const paperCost = sheets * paperRate
  const printCost = sheets * rates.machine
  return {
    sheets,
    cost: paperCost + printCost,
    imposition: { type: 'grid', up: 1, cols: 1, rows: 1, label: '1-up on SRA3', size: 'A3 (297×420mm)' },
    components: [
      { key: 'paper', label: '170gsm Bond paper',  formula: `${sheets} SRA3 sheets × KES ${paperRate}`,                subtotal: paperCost, group: 'paper', rateKey: 'p150',    rateLabel: 'per SRA3 sheet (×1.2 for 170gsm)' },
      { key: 'print', label: 'Printing (simplex)', formula: `${sheets} sheets × 1 side × KES ${rates.machine}`,       subtotal: printCost, group: 'print', rateKey: 'machine', rateLabel: 'per side/click' },
    ],
  }
}

function calcTiers(cost: number) {
  return {
    floor: Math.round(cost * 1.3),
    recommended: Math.round(cost * 1.55),
    premium: Math.round(cost * 1.8),
  }
}

const CALC_PRODUCT_DEFS = [
  { key: 'bc', label: 'Business Cards',    icon: '🪪', specs: '300gsm Art Card · Duplex · Matte Lam · Cut', badge: 'SRA3 21-up',       fn: _calcBC, minQty: 100, stepQty: 100, unit: 'pcs' },
  { key: 'fl', label: 'A4 Flyers',         icon: '📄', specs: '150gsm Bond · Simplex · Cut',                badge: 'SRA3 2-up',         fn: _calcFL, minQty: 100, stepQty: 100, unit: 'pcs' },
  { key: 'bk', label: 'A5 Booklet (24pp)', icon: '📒', specs: '250gsm cover · 130gsm inserts · Saddle-stitch', badge: 'Multi-component', fn: _calcBK, minQty: 10,  stepQty: 10,  unit: 'copies' },
  { key: 'po', label: 'A3 Poster',         icon: '🖼️', specs: '170gsm Bond · Simplex',                      badge: 'SRA3 1-up',         fn: _calcPO, minQty: 10,  stepQty: 10,  unit: 'pcs' },
]

const calcProducts = computed(() =>
  CALC_PRODUCT_DEFS.map(def => ({
    ...def,
    qty: calcQty[def.key] ?? def.minQty,
    data: def.fn(calcQty[def.key] ?? def.minQty),
  }))
)

const ratePanelOpen = ref(false)
const breakdownOpen = ref(false)
const activeCalcKey = ref<string | null>(null)

const activeCalcProduct = computed(() =>
  calcProducts.value.find(p => p.key === activeCalcKey.value) ?? null
)

function openBreakdown(key: string) {
  activeCalcKey.value = key
  breakdownOpen.value = true
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

function closeBreakdown() {
  breakdownOpen.value = false
  activeCalcKey.value = null
  if (import.meta.client) document.body.style.overflow = ''
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

