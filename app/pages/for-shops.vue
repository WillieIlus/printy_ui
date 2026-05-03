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
          <NuxtLink
            :to="shopSignupRoute"
            class="bg-[#e13515] text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-[#c42e11] transition-colors"
          >
            Claim your spot
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- ── HERO ── -->
    <section class="bg-white dark:bg-gray-900 pt-12 pb-10 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          <!-- Left: copy -->
          <div class="lg:pt-2">
            <!-- Scarcity badge -->
            <div class="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-full px-3 py-1 mb-6">
              <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span class="text-xs font-semibold text-red-600 dark:text-red-400">
                {{ spots.remaining }} of {{ spots.total }} Nairobi spots remaining
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-black text-[#101828] dark:text-white leading-[1.1] tracking-tight">
              Stop losing jobs to slow quotes.
            </h1>
            <p class="mt-4 text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
              Printy turns your rate cards, papers, and finishing into a quote engine — so customers arrive with specs, not questions.
            </p>

            <div class="mt-7 flex flex-col sm:flex-row gap-3">
              <NuxtLink
                :to="shopSignupRoute"
                class="bg-[#e13515] text-white font-bold rounded-full px-6 py-3 text-base hover:bg-[#c42e11] transition-colors text-center"
              >
                Claim your spot — it's free
              </NuxtLink>
              <a
                href="#pricing-demo"
                class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full px-6 py-3 text-base hover:border-gray-400 dark:hover:border-gray-400 transition-colors text-center"
              >
                See how pricing works →
              </a>
            </div>

            <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">No credit card. Setup in 30 min. Nairobi-first.</p>

            <!-- Progress block -->
            <div class="mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">Early access spots used</p>
              <div class="flex items-center gap-3 mb-2">
                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#e13515] rounded-full transition-all"
                    :style="{ width: `${(spots.used / spots.total) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-black text-[#101828] dark:text-white whitespace-nowrap">
                  {{ spots.used }} / {{ spots.total }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Each shop is manually onboarded. {{ spots.remaining }} spots left for Nairobi.</p>
            </div>
          </div>

          <!-- Right: interactive demo card -->
          <div id="pricing-demo" class="w-full">
            <div
              class="rounded-2xl shadow-xl overflow-hidden border transition-colors"
              :class="isDark
                ? 'bg-white border-gray-200 text-[#101828]'
                : 'bg-[#101828] border-slate-700 text-white'"
            >
              <!-- Card header -->
              <div
                class="px-5 py-3.5 flex items-center justify-between border-b"
                :class="isDark ? 'border-gray-200' : 'border-slate-700'"
              >
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">
                    Incoming request
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Action status badge -->
                  <span
                    v-if="!demoStore.actionType"
                    class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-500"
                  >Awaiting review</span>
                  <span
                    v-else-if="demoStore.actionType === 'accepted'"
                    class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-400/20 text-green-500"
                  >Accepted</span>
                  <span
                    v-else-if="demoStore.actionType === 'modified'"
                    class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-400"
                  >Modified</span>
                  <span
                    v-else-if="demoStore.actionType === 'rejected'"
                    class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-red-400/20 text-red-400"
                  >Rejected</span>
                  <span class="text-[10px]" :class="isDark ? 'text-[#667085]' : 'text-slate-500'">Just now</span>
                </div>
              </div>

              <!-- Product tabs -->
              <div class="px-5 pt-4">
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="tab in PRODUCT_TABS"
                    :key="tab.key"
                    @click="selectProduct(tab.key)"
                    class="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                    :class="demoStore.currentProduct === tab.key
                      ? 'bg-[#e13515] text-white'
                      : isDark
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>

              <!-- Specs -->
              <div class="px-5 pt-4 space-y-0">
                <div
                  v-for="spec in currentSpecs"
                  :key="spec.label"
                  class="flex justify-between items-center py-2 border-b text-sm"
                  :class="isDark ? 'border-gray-100' : 'border-slate-700/60'"
                >
                  <span :class="isDark ? 'text-[#667085]' : 'text-slate-400'">{{ spec.label }}</span>
                  <span class="font-semibold" :class="isDark ? 'text-[#101828]' : 'text-white'">{{ spec.value }}</span>
                </div>
              </div>

              <!-- Quantity slider -->
              <div class="px-5 pt-4">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <span class="text-xs font-semibold" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">Quantity</span>
                  <div class="flex items-center gap-2">
                    <input
                      :value="demoStore.quantity"
                      type="number"
                      :min="currentConfig.minQty"
                      :max="currentConfig.maxQty"
                      :step="currentConfig.step"
                      inputmode="numeric"
                      class="w-28 rounded-lg border px-3 py-1.5 text-right text-sm font-black focus:outline-none"
                      :class="isDark
                        ? 'border-gray-300 bg-gray-50 text-[#101828] focus:border-[#e13515]'
                        : 'border-slate-600 bg-slate-900 text-white focus:border-[#e13515]'"
                      @input="onQuantityInput"
                    >
                    <span class="text-[11px] font-semibold uppercase tracking-wide" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">pcs</span>
                  </div>
                </div>
                <input
                  type="range"
                  :value="demoStore.quantity"
                  :min="currentConfig.minQty"
                  :max="currentConfig.maxQty"
                  :step="currentConfig.step"
                  @input="onSliderInput"
                  class="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  :class="isDark ? 'accent-[#e13515]' : 'accent-[#e13515]'"
                />
                <div class="flex justify-between text-[10px] mt-1" :class="isDark ? 'text-gray-400' : 'text-slate-500'">
                  <span>{{ currentConfig.minQty.toLocaleString() }}</span>
                  <span>{{ currentConfig.maxQty.toLocaleString() }}</span>
                </div>
              </div>

              <!-- Quote range -->
              <div class="px-5 pt-4 pb-4">
                <div v-if="previewLoading" class="text-xs mb-1" :class="isDark ? 'text-gray-400' : 'text-slate-400'">
                  Calculating…
                </div>
                <div v-else>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-semibold" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">
                      {{ isExamplePreview ? 'Example preview' : 'Suggested quote range' }}
                    </span>
                    <span
                      v-if="isExamplePreview"
                      class="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-500 font-semibold uppercase"
                    >fallback</span>
                  </div>
                  <p class="text-lg font-black leading-tight" :class="isDark ? 'text-[#101828]' : 'text-white'">
                    KES {{ displayMinPrice.toLocaleString() }}
                    <span class="text-base font-semibold" :class="isDark ? 'text-[#667085]' : 'text-slate-400'"> – </span>
                    KES {{ displayMaxPrice.toLocaleString() }}
                  </p>
                  <p class="text-xs mt-0.5" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">
                    {{ isExamplePreview ? 'Based on typical rate card markup' : 'Based on your rate card' }}
                  </p>
                  <p v-if="previewSupportText" class="mt-2 text-xs leading-5" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">
                    {{ previewSupportText }}
                  </p>
                </div>
              </div>

              <div v-if="isExamplePreview" class="px-5 pb-4">
                <label class="mb-1 block text-[10px] font-semibold uppercase tracking-wide" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">
                  Production cost fallback (KES)
                </label>
                <input
                  :value="fallbackProductionCost"
                  type="number"
                  min="0"
                  inputmode="numeric"
                  class="w-full rounded-lg border px-3 py-2 text-sm font-semibold focus:outline-none"
                  :class="isDark
                    ? 'border-gray-300 bg-gray-50 text-[#101828] focus:border-[#e13515]'
                    : 'border-slate-600 bg-slate-900 text-white focus:border-[#e13515]'"
                  @input="onProductionCostInput"
                >
                <p class="mt-2 text-[11px] leading-5" :class="isDark ? 'text-gray-500' : 'text-slate-400'">
                  Market guidance appears after 5+ comparable shops. Until then, this uses your rate card. Competitor rate cards are never shown.
                </p>
              </div>

              <!-- ── MODIFY MODE ── -->
              <div v-if="editMode" class="px-5 pb-5 border-t" :class="isDark ? 'border-gray-200' : 'border-slate-700'">
                <p class="text-xs font-semibold mt-3 mb-2" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">Edit quote range (KES)</p>
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label class="text-[10px] mb-1 block" :class="isDark ? 'text-gray-400' : 'text-slate-500'">Min</label>
                    <input
                      v-model.number="editMin"
                      type="number"
                      min="0"
                      class="w-full rounded-lg px-3 py-2 text-sm font-semibold border focus:outline-none"
                      :class="isDark
                        ? 'bg-gray-50 border-gray-300 text-[#101828] focus:border-[#e13515]'
                        : 'bg-slate-800 border-slate-600 text-white focus:border-[#e13515]'"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] mb-1 block" :class="isDark ? 'text-gray-400' : 'text-slate-500'">Max</label>
                    <input
                      v-model.number="editMax"
                      type="number"
                      min="0"
                      class="w-full rounded-lg px-3 py-2 text-sm font-semibold border focus:outline-none"
                      :class="isDark
                        ? 'bg-gray-50 border-gray-300 text-[#101828] focus:border-[#e13515]'
                        : 'bg-slate-800 border-slate-600 text-white focus:border-[#e13515]'"
                    />
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="saveModify" class="flex-1 bg-[#e13515] text-white text-sm font-bold rounded-lg py-2 hover:bg-[#c42e11] transition-colors">
                    Save draft
                  </button>
                  <button @click="editMode = false" class="px-4 text-sm font-semibold rounded-lg py-2 transition-colors"
                    :class="isDark ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
                    Cancel
                  </button>
                </div>
              </div>

              <!-- ── REJECT MODE ── -->
              <div v-else-if="rejectMode" class="px-5 pb-5 border-t" :class="isDark ? 'border-gray-200' : 'border-slate-700'">
                <p class="text-xs font-semibold mt-3 mb-2" :class="isDark ? 'text-[#667085]' : 'text-slate-400'">Quick reject reason</p>
                <div class="flex flex-wrap gap-2 mb-3">
                  <button
                    v-for="r in REJECT_REASONS"
                    :key="r"
                    @click="rejectInput = r"
                    class="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    :class="rejectInput === r
                      ? 'bg-red-500 text-white border-red-500'
                      : isDark
                        ? 'border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
                        : 'border-slate-600 text-slate-300 hover:border-red-400 hover:text-red-400'"
                  >{{ r }}</button>
                </div>
                <div class="flex gap-2">
                  <button @click="saveReject" class="flex-1 bg-red-500 text-white text-sm font-bold rounded-lg py-2 hover:bg-red-600 transition-colors">
                    Confirm reject
                  </button>
                  <button @click="rejectMode = false" class="px-4 text-sm font-semibold rounded-lg py-2 transition-colors"
                    :class="isDark ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
                    Cancel
                  </button>
                </div>
              </div>

              <!-- ── ACTION BUTTONS (no action taken) ── -->
              <div
                v-else-if="!demoStore.actionType"
                class="px-5 pb-5 flex gap-2 border-t"
                :class="isDark ? 'border-gray-200' : 'border-slate-700'"
              >
                <button
                  @click="handleAccept"
                  class="flex-1 mt-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg py-2.5 transition-colors"
                >✓ Accept</button>
                <button
                  @click="handleModify"
                  class="flex-1 mt-3 text-sm font-bold rounded-lg py-2.5 border transition-colors"
                  :class="isDark ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'"
                >✏ Modify</button>
                <button
                  @click="handleReject"
                  class="flex-1 mt-3 text-sm font-bold rounded-lg py-2.5 border transition-colors"
                  :class="isDark ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'"
                >✕ Reject</button>
              </div>

              <!-- ── POST-ACTION STATE ── -->
              <div
                v-else
                class="px-5 pb-5 border-t"
                :class="isDark ? 'border-gray-200' : 'border-slate-700'"
              >
                <!-- Accepted -->
                <div v-if="demoStore.actionType === 'accepted'" class="mt-3">
                  <div class="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2.5 mb-3">
                    <span class="text-green-500 text-base">✓</span>
                    <div>
                      <p class="text-xs font-bold text-green-700 dark:text-green-400">Quote accepted</p>
                      <p class="text-[10px] text-green-600 dark:text-green-500">KES {{ displayMinPrice.toLocaleString() }} – KES {{ displayMaxPrice.toLocaleString() }}</p>
                    </div>
                  </div>
                  <button @click="demoStore.reset()" class="w-full text-xs py-2 rounded-lg border transition-colors"
                    :class="isDark ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-slate-700 text-slate-400 hover:bg-slate-800'">
                    Try a different action
                  </button>
                </div>

                <!-- Modified -->
                <div v-else-if="demoStore.actionType === 'modified'" class="mt-3">
                  <div class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2.5 mb-3">
                    <span class="text-blue-500 text-base">✏</span>
                    <div>
                      <p class="text-xs font-bold text-blue-700 dark:text-blue-400">Modified draft saved</p>
                      <p class="text-[10px] text-blue-600 dark:text-blue-500">
                        KES {{ (demoStore.modifiedMin ?? 0).toLocaleString() }} – KES {{ (demoStore.modifiedMax ?? 0).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                  <button @click="demoStore.reset()" class="w-full text-xs py-2 rounded-lg border transition-colors"
                    :class="isDark ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-slate-700 text-slate-400 hover:bg-slate-800'">
                    Try a different action
                  </button>
                </div>

                <!-- Rejected -->
                <div v-else-if="demoStore.actionType === 'rejected'" class="mt-3">
                  <div class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2.5 mb-3">
                    <span class="text-red-500 text-base">✕</span>
                    <div>
                      <p class="text-xs font-bold text-red-700 dark:text-red-400">Rejected</p>
                      <p class="text-[10px] text-red-600 dark:text-red-500">{{ demoStore.rejectReason }}</p>
                    </div>
                  </div>
                  <button @click="demoStore.reset()" class="w-full text-xs py-2 rounded-lg border transition-colors"
                    :class="isDark ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-slate-700 text-slate-400 hover:bg-slate-800'">
                    Try a different action
                  </button>
                </div>
              </div>

              <!-- Card footer note -->
              <div class="px-5 pb-4">
                <p class="text-[10px] text-center" :class="isDark ? 'text-gray-400' : 'text-slate-500'">
                  This is a live demo. State is saved in your browser.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── PAIN ── -->
    <section class="py-10 bg-gray-50 dark:bg-gray-950">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-center text-xl md:text-2xl font-black text-[#101828] dark:text-white mb-6">Built for the pricing problems print shops face every day.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Customers ask "how much?" without specs</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Quantity, size, paper, and finishing often arrive late — after your team has already guessed.</p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div class="text-2xl mb-2">⚠️</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Staff quote from memory</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Different people quote differently when finishing, wastage, or turnaround is forgotten.</p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div class="text-2xl mb-2">📉</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Negotiation without a safe floor</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Without a clear minimum, it's easy to discount below a healthy margin.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="py-10 bg-white dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-center text-xl md:text-2xl font-black text-[#101828] dark:text-white mb-6">How Printy helps your shop quote cleaner.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="w-9 h-9 rounded-full bg-[#e13515] text-white font-black text-base flex items-center justify-center mb-3">1</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Set your shop logic</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Products, papers, finishing, turnaround, costs, and markup ranges.</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="w-9 h-9 rounded-full bg-[#e13515] text-white font-black text-base flex items-center justify-center mb-3">2</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Receive better-prepared requests</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Customers choose clearer specs before your team starts quoting.</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div class="w-9 h-9 rounded-full bg-[#e13515] text-white font-black text-base flex items-center justify-center mb-3">3</div>
            <h3 class="font-bold text-gray-900 dark:text-white text-sm">Reply with control</h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Accept, adjust the range, or reject requests that do not fit your shop.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FOUNDER + FOMO ── -->
    <section id="pricing-check" class="py-14 bg-gray-900 dark:bg-gray-950">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 class="text-2xl md:text-3xl font-black text-white leading-tight">Start with a pricing setup check.</h2>
            <p class="mt-4 text-gray-400 leading-relaxed text-sm">
              For early Nairobi shops, we help review your common price list, papers, finishing, and markup range so you do not start from an empty dashboard.
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">Nairobi-first</span>
              <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">Limited assisted setup slots</span>
              <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">Priority early visibility</span>
              <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">Competitor rate cards never shown</span>
            </div>
            <p class="mt-4 text-orange-400 text-xs">We onboard only a few shops per area first so pricing setup is done properly.</p>
          </div>
          <div>
            <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div class="inline-flex items-center gap-2 bg-red-950 border border-red-800 rounded-full px-3 py-1 mb-5">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span class="text-xs font-semibold text-red-400">{{ spots.remaining }} of {{ spots.total }} slots remaining</span>
              </div>
              <button
                @click="openModal"
                class="w-full bg-[#e13515] text-white font-black rounded-xl py-3.5 text-base hover:bg-[#c42e11] transition-colors"
              >
                Check my shop pricing →
              </button>
              <p class="mt-3 text-center text-xs text-gray-500">Bring your price list or PDF. You approve before anything goes live.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section class="py-10 bg-white dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-center text-xl font-black text-[#101828] dark:text-white mb-6">Before you join</h2>
        <div class="space-y-3">
          <div v-for="(faq, i) in FAQS" :key="i" class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              @click="openFaqIndex = openFaqIndex === i ? null : i"
              class="w-full text-left px-5 py-4 font-semibold text-gray-900 dark:text-white flex justify-between items-center text-sm"
            >
              {{ faq.q }}
              <span class="text-[#e13515] font-bold text-lg ml-4 flex-shrink-0">{{ openFaqIndex === i ? '−' : '+' }}</span>
            </button>
            <div v-if="openFaqIndex === i" class="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CLAIM SPOT ── -->
    <section id="claim-spot" class="py-16 bg-[#e13515]">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-black text-white leading-tight">
          Claim your spot — it's free.
        </h2>
        <p class="mt-4 text-red-100 text-base leading-relaxed">
          Use Printy to structure your shop pricing, protect your margins, and receive cleaner quote-ready requests from Nairobi customers.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            :to="shopSignupRoute"
            class="bg-white text-[#e13515] font-black rounded-full px-10 py-4 text-lg hover:bg-red-50 transition-colors"
          >
            Claim your spot →
          </NuxtLink>
          <a
            href="#pricing-demo"
            class="border border-white/40 text-white font-semibold rounded-full px-6 py-4 text-base hover:bg-white/10 transition-colors"
          >
            See how pricing works
          </a>
        </div>
        <p class="mt-5 text-red-200 text-sm">No credit card. Setup in 30 min. Nairobi-first.</p>
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

    <!-- ── JOIN MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">✕</button>
            <div class="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1 mb-4">
              <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span class="text-xs font-semibold text-red-600">{{ spots.remaining }} slots remaining</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900">Check my shop pricing</h3>
            <p class="mt-2 text-gray-500 text-sm">We'll reach out to schedule your free founder-assisted pricing setup.</p>
            <div class="mt-5 space-y-3">
              <input
                v-model="form.shopName"
                type="text"
                placeholder="Shop name"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Your phone (WhatsApp)"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]"
              />
              <input
                v-model="form.area"
                type="text"
                placeholder="Area / Estate in Nairobi"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e13515]"
              />
            </div>
            <p v-if="submitError" class="mt-3 text-xs text-red-600 text-center">{{ submitError }}</p>
            <button
              @click="submitModal"
              :disabled="submitting"
              class="mt-5 w-full bg-[#e13515] text-white font-black rounded-full py-3.5 text-base hover:bg-[#c42e11] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting…' : 'Request my spot →' }}
            </button>
            <p class="mt-3 text-center text-xs text-gray-400">No payment. We contact you within 24 hours.</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── SUCCESS MODAL ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showSuccessModal"
          class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          @click.self="closeSuccessModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h3 class="text-xl font-black text-gray-900">You're on the list!</h3>
            <p class="mt-2 text-gray-500 text-sm">We'll contact you within 24 hours to schedule your free pricing setup. Bring your current price list or PDF.</p>
            <button
              @click="closeSuccessModal"
              class="mt-5 bg-[#e13515] text-white font-bold rounded-full px-8 py-3 hover:bg-[#c42e11] transition-colors"
            >Done</button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { useApi, usePublicApiNoAuth } from '~/shared/api'
import { useForShopsDemoStore, type ProductKey } from '~/stores/forShopsDemo'
import { useAuthStore } from '~/stores/auth'
import type { CalculatorPreviewResponse } from '~/types/api/calculator'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'For Print Shop Owners — Printy',
  description: 'Stop losing jobs to slow quotes. Printy turns your rate cards into a quote engine — so customers arrive with specs, not questions.',
  ogTitle: 'For Print Shop Owners — Printy',
  ogDescription: 'Stop losing jobs to slow quotes. Printy turns your rate cards into a quote engine — so customers arrive with specs, not questions.',
})

// ── Color mode ────────────────────────────────────────────────────────────────
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// ── Stores ────────────────────────────────────────────────────────────────────
const demoStore = useForShopsDemoStore()
const authStore = useAuthStore()

// ── API ───────────────────────────────────────────────────────────────────────
const noAuthApi = usePublicApiNoAuth()
const api = useApi()
const shopSignupRoute = {
  path: '/auth/signup',
  query: { type: 'shop' },
}

// ── Spots ─────────────────────────────────────────────────────────────────────
const { data: spotsData } = useAsyncData(
  'early-access-spots',
  () => noAuthApi<{ total: number; used: number; remaining: number }>('/leads/spots/').catch(() => null),
)
const spots = computed(() => spotsData.value ?? { total: 20, used: 12, remaining: 8 })

// ── Product configs ───────────────────────────────────────────────────────────
const PRODUCT_TABS: Array<{ key: ProductKey; label: string }> = [
  { key: 'business_card', label: 'Business Cards' },
  { key: 'flyer', label: 'A4 Flyers' },
  { key: 'booklet', label: 'Booklet' },
]

interface ProductConfig {
  label: string
  paper: string
  finishing: string
  turnaround: string
  defaultQty: number
  minQty: number
  maxQty: number
  step: number
  previewPayload: (qty: number) => Record<string, unknown>
  productionCost: (qty: number) => number
}

const PRODUCT_CONFIGS: Record<ProductKey, ProductConfig> = {
  business_card: {
    label: 'Business Cards',
    paper: '350gsm Art Card',
    finishing: 'Matte Lam + Round Corners',
    turnaround: '24–48 hrs',
    defaultQty: 500,
    minQty: 100,
    maxQty: 10000,
    step: 50,
    previewPayload: (qty) => ({
      product_type: 'business_card',
      quantity: qty,
      finished_size: '90x55mm',
      paper_stock: '350gsm',
      requested_gsm: 350,
      requested_paper_category: 'artcard',
      print_sides: 'DUPLEX',
      color_mode: 'COLOR',
      lamination: 'matt-lamination',
      corner_rounding: true,
    }),
    productionCost: (qty) => Math.round((qty / 1000) * 3200),
  },
  flyer: {
    label: 'A4 Flyers',
    paper: '150gsm Art Paper',
    finishing: 'Single-sided print',
    turnaround: '24 hrs',
    defaultQty: 1000,
    minQty: 100,
    maxQty: 10000,
    step: 100,
    previewPayload: (qty) => ({
      product_type: 'flyer',
      quantity: qty,
      finished_size: 'A4',
      requested_gsm: 150,
      requested_paper_category: 'matt',
      print_sides: 'SIMPLEX',
      color_mode: 'COLOR',
    }),
    productionCost: (qty) => Math.round((qty / 1000) * 2200),
  },
  booklet: {
    label: 'Booklet',
    paper: '100gsm Inside + 250gsm Cover',
    finishing: '16pp, saddle-stitched',
    turnaround: '48–72 hrs',
    defaultQty: 100,
    minQty: 50,
    maxQty: 2000,
    step: 25,
    previewPayload: (qty) => ({
      product_type: 'booklet',
      quantity: qty,
      finished_size: 'A5',
      total_pages: 16,
      cover_stock: '250gsm',
      insert_stock: '100gsm',
      requested_cover_gsm: 250,
      requested_insert_gsm: 100,
      binding_type: 'saddle_stitch',
      cover_lamination: 'none',
    }),
    productionCost: (qty) => Math.round(qty * 140),
  },
}

const currentConfig = computed(() => PRODUCT_CONFIGS[demoStore.currentProduct])

const currentSpecs = computed(() => {
  const cfg = currentConfig.value
  return [
    { label: 'Product', value: cfg.label },
    { label: 'Quantity', value: `${demoStore.quantity.toLocaleString()} pcs` },
    { label: 'Paper', value: cfg.paper },
    { label: 'Finishing', value: cfg.finishing },
    { label: 'Turnaround', value: cfg.turnaround },
  ]
})

// ── Calculator preview ────────────────────────────────────────────────────────
const previewData = ref<CalculatorPreviewResponse | null>(null)
const previewLoading = ref(false)
const previewError = ref(false)

let previewTimer: ReturnType<typeof setTimeout> | null = null

async function fetchPreview() {
  previewLoading.value = true
  previewError.value = false
  try {
    const payload = currentConfig.value.previewPayload(demoStore.quantity)
    const res = await noAuthApi<CalculatorPreviewResponse>('/calculator/public-preview/', {
      method: 'POST' as const,
      body: payload,
    })
    previewData.value = res
  } catch {
    previewError.value = true
    previewData.value = null
  } finally {
    previewLoading.value = false
  }
}

function debouncedFetchPreview(delay = 500) {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => fetchPreview(), delay)
}

// Fallback pricing
const fallbackProductionCost = computed(() => {
  return demoStore.productionCostOverride ?? currentConfig.value.productionCost(demoStore.quantity)
})

const fallbackMin = computed(() => Math.round(fallbackProductionCost.value * 1.3))
const fallbackMax = computed(() => Math.round(fallbackProductionCost.value * 1.8))

function parseKes(val: string | null | undefined): number | null {
  if (!val) return null
  const n = parseInt(val.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? null : n
}

const isExamplePreview = computed(() => {
  if (previewError.value || !previewData.value) return true
  return !previewData.value.can_calculate
})

const suggestedMinPrice = computed(() => {
  if (!isExamplePreview.value && previewData.value) {
    const value = parseKes(previewData.value.min_price) ?? parseKes(previewData.value.total)
    if (value) return value
  }
  return fallbackMin.value
})

const suggestedMaxPrice = computed(() => {
  if (!isExamplePreview.value && previewData.value) {
    const value = parseKes(previewData.value.max_price)
    if (value) return value
  }
  return fallbackMax.value
})

const displayMinPrice = computed(() => {
  if (demoStore.actionType === 'modified' && demoStore.modifiedMin != null) return demoStore.modifiedMin
  return suggestedMinPrice.value
})

const displayMaxPrice = computed(() => {
  if (demoStore.actionType === 'modified' && demoStore.modifiedMax != null) return demoStore.modifiedMax
  return suggestedMaxPrice.value
})

const previewSupportText = computed(() => {
  if (previewError.value) {
    return 'Backend preview is unavailable right now, so this example falls back to a safe range.'
  }
  if (isExamplePreview.value) {
    return previewData.value?.summary ?? 'This example preview uses fallback markup until matching pricing data is available.'
  }

  return previewData.value?.matches_count
    ? `Live preview from ${previewData.value.matches_count} matching shop${previewData.value.matches_count === 1 ? '' : 's'}.`
    : 'Live preview from the calculator pricing engine.'
})

// ── Slider ────────────────────────────────────────────────────────────────────
function onSliderInput(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value, 10)
  updateQuantity(v)
}

function normalizeQuantity(value: number) {
  const { minQty, maxQty, step } = currentConfig.value
  if (!Number.isFinite(value)) return demoStore.quantity
  const clamped = Math.min(maxQty, Math.max(minQty, value))
  return Math.round(clamped / step) * step
}

function updateQuantity(rawValue: number) {
  const next = normalizeQuantity(rawValue)
  demoStore.setQuantity(next)
  debouncedFetchPreview()
}

function onQuantityInput(e: Event) {
  const value = Number.parseInt((e.target as HTMLInputElement).value, 10)
  updateQuantity(value)
}

function onProductionCostInput(e: Event) {
  const value = Number.parseInt((e.target as HTMLInputElement).value, 10)
  demoStore.setProductionCostOverride(Number.isFinite(value) && value >= 0 ? value : null)
}

// ── Product selection ─────────────────────────────────────────────────────────
function selectProduct(key: ProductKey) {
  demoStore.selectProduct(key)
  previewData.value = null
  editMode.value = false
  rejectMode.value = false
  debouncedFetchPreview(200)
}

// ── Actions ───────────────────────────────────────────────────────────────────
const editMode = ref(false)
const rejectMode = ref(false)
const editMin = ref(0)
const editMax = ref(0)
const rejectInput = ref('')

const REJECT_REASONS = [
  'Outside our product range',
  'Quantity too low',
  'Turnaround too tight',
  'Paper not available',
  'Other',
]

function handleAccept() {
  demoStore.accept()
  maybeSaveToBackend('accepted')
}

function handleModify() {
  editMin.value = displayMinPrice.value
  editMax.value = displayMaxPrice.value
  editMode.value = true
  rejectMode.value = false
}

function handleReject() {
  rejectInput.value = REJECT_REASONS[0]!
  rejectMode.value = true
  editMode.value = false
}

function saveModify() {
  const min = Math.max(0, editMin.value || 0)
  const max = Math.max(min, editMax.value || 0)
  demoStore.modify(min, max)
  editMode.value = false
  maybeSaveToBackend('modified', min, max)
}

function saveReject() {
  const reason = rejectInput.value || REJECT_REASONS[0]!
  demoStore.reject(reason)
  rejectMode.value = false
  maybeSaveToBackend('rejected', undefined, undefined, reason)
}

async function maybeSaveToBackend(
  action: 'accepted' | 'modified' | 'rejected',
  modMin?: number,
  modMax?: number,
  reason?: string,
) {
  if (!authStore.isAuthenticated) return
  try {
    await api('/leads/demo-actions/', {
      method: 'POST' as const,
      body: {
        selected_product: demoStore.currentProduct,
        quantity: demoStore.quantity,
        suggested_min: suggestedMinPrice.value,
        suggested_max: suggestedMaxPrice.value,
        action,
        modified_min: modMin ?? null,
        modified_max: modMax ?? null,
        reject_reason: reason ?? '',
      },
    })
  } catch {
    // non-critical — local state is already saved
  }
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Will Printy control my prices?', a: 'No. You set your own prices, materials, finishing, turnaround, and markup ranges.' },
  { q: 'Will other shops see my rate card?', a: 'No. Private shop rate cards are not exposed. Market guidance uses anonymous signals only.' },
  { q: 'Do I need to enter everything myself?', a: 'Early Nairobi shops can get founder-assisted setup from an existing price list or PDF.' },
]
const openFaqIndex = ref<number | null>(null)

// ── Modal ─────────────────────────────────────────────────────────────────────
const showModal = ref(false)
const showSuccessModal = ref(false)
const form = reactive({ shopName: '', phone: '', area: '' })
const submitting = ref(false)
const submitError = ref<string | null>(null)

function openModal() {
  showModal.value = true
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  submitError.value = null
  if (import.meta.client) document.body.style.overflow = ''
}

function closeSuccessModal() {
  showSuccessModal.value = false
  if (import.meta.client) document.body.style.overflow = ''
}

async function submitModal() {
  if (!form.shopName.trim() || !form.phone.trim() || !form.area.trim()) {
    submitError.value = 'Please fill in all fields.'
    return
  }
  submitting.value = true
  submitError.value = null
  try {
    await noAuthApi('/leads/apply/', {
      method: 'POST' as const,
      body: { shop_name: form.shopName.trim(), phone: form.phone.trim(), area: form.area.trim() },
    })
    closeModal()
    showSuccessModal.value = true
    form.shopName = ''
    form.phone = ''
    form.area = ''
    if (import.meta.client) document.body.style.overflow = 'hidden'
  } catch (e: unknown) {
    const data = (e as { data?: { detail?: string } })?.data
    submitError.value = data?.detail ?? 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const currentYear = new Date().getFullYear()

// ── Init preview on mount ─────────────────────────────────────────────────────
onMounted(() => {
  demoStore.hydrate()
  fetchPreview()
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
  if (previewTimer) clearTimeout(previewTimer)
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
