<template>
  <div style="font-family: 'Inter', system-ui, sans-serif;" class="text-gray-900 bg-gray-50">

    <!-- NAV -->
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
          </div>
          <img src="/assets/word-mark/dark/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto" />
          <span class="hidden sm:inline text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium ml-1">For shops</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <a href="/auth/login" class="text-sm text-gray-500 hidden sm:inline">Login</a>
          <button
            @click="openModal"
            class="bg-orange-500 text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-orange-600 transition-colors"
          >
            Claim your spot →
          </button>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="bg-white pt-12 pb-16">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <!-- Left -->
          <div class="lg:col-span-6">
            <div class="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1 mb-5">
              <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span class="text-xs font-semibold text-red-600">{{ spots.remaining }} of {{ spots.total }} Nairobi spots remaining</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Stop losing jobs<br/>to slow quotes.
            </h1>
            <p class="mt-4 text-gray-500 text-lg leading-relaxed">
              Printy turns your rate cards, papers, and finishing into a quote engine — so customers arrive with specs, not questions.
            </p>
            <div class="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                @click="openModal"
                class="bg-orange-500 text-white font-bold rounded-full px-6 py-3 text-base hover:bg-orange-600 transition-colors text-center"
              >
                Claim your spot — it's free
              </button>
              <button
                @click="scrollToMarkup"
                class="border border-gray-300 text-gray-700 font-semibold rounded-full px-6 py-3 text-base hover:border-gray-400 transition-colors text-center"
              >
                See how pricing works →
              </button>
            </div>
            <p class="mt-3 text-xs text-gray-400">No credit card. Setup in 30 min. Nairobi-first.</p>

            <!-- Live counter -->
            <div class="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-semibold text-gray-600">Early access spots used</span>
                <span class="text-xs font-bold text-orange-600">{{ spots.used }} / {{ spots.total }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-orange-500 h-2 rounded-full transition-all duration-500" :style="{ width: spotsBarWidth }"></div>
              </div>
              <p class="mt-2 text-xs text-gray-500">Each shop is manually onboarded. {{ spots.remaining }} spots left for Nairobi.</p>
            </div>
          </div>

          <!-- Right — Interactive quote card -->
          <div class="lg:col-span-6">
            <div
              id="quote-card"
              class="bg-white rounded-2xl border-2 shadow-md p-5 transition-all duration-300"
              :class="cardBorderClass"
            >

              <!-- Card header -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Incoming request</span>
                  <span
                    class="inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="badgeClass"
                  >{{ badgeText }}</span>
                </div>
                <span class="text-xs text-gray-400">Just now</span>
              </div>

              <!-- Product switcher pills -->
              <div class="flex gap-2 mb-4 flex-wrap">
                <button
                  v-for="(_, key) in PRODUCTS"
                  :key="key"
                  @click="switchProduct(key)"
                  class="text-xs font-semibold border rounded-full px-3 py-1 transition-colors"
                  :class="currentProduct === key
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200'"
                >
                  {{ PRODUCT_LABELS[key] }}
                </button>
              </div>

              <!-- Product details -->
              <div :key="currentProduct" class="space-y-2 fade-in">
                <div class="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <span class="text-gray-500">Product</span>
                  <span class="font-semibold text-gray-900">{{ currentProductData.product }}</span>
                </div>
                <div class="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <span class="text-gray-500">Quantity</span>
                  <span class="font-semibold text-gray-900">{{ currentProductData.qty }}</span>
                </div>
                <div class="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <span class="text-gray-500">Paper</span>
                  <span class="font-semibold text-gray-900">{{ currentProductData.paper }}</span>
                </div>
                <div class="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <span class="text-gray-500">Finishing</span>
                  <span class="font-semibold text-gray-900">{{ currentProductData.finish }}</span>
                </div>
                <div class="flex justify-between text-sm py-1.5">
                  <span class="text-gray-500">Turnaround</span>
                  <span class="font-semibold text-gray-900">{{ currentProductData.turn }}</span>
                </div>
              </div>

              <!-- Pricing hint -->
              <div class="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-800">
                💡 Your suggested quote: <strong>{{ currentProductData.price }}</strong> based on your rate card
              </div>

              <!-- Action row -->
              <div v-if="!actionTaken" class="mt-4 grid grid-cols-3 gap-2">
                <button
                  @click="handleAction('accept')"
                  class="bg-green-500 text-white text-xs font-bold rounded-lg py-2.5 hover:bg-green-600 transition-colors"
                >
                  ✓ Accept
                </button>
                <button
                  @click="handleAction('modify')"
                  class="bg-gray-100 text-gray-700 text-xs font-bold rounded-lg py-2.5 hover:bg-gray-200 transition-colors"
                >
                  ✏ Modify
                </button>
                <button
                  @click="handleAction('reject')"
                  class="bg-red-50 text-red-600 text-xs font-bold rounded-lg py-2.5 hover:bg-red-100 transition-colors"
                >
                  ✕ Reject
                </button>
              </div>

              <!-- Response state -->
              <div
                v-if="actionTaken"
                class="mt-3 text-xs text-center font-semibold p-2 rounded-lg"
                :class="actionResultClass"
              >{{ actionResultText }}</div>

              <!-- Reset -->
              <button
                v-if="actionTaken"
                @click="resetCard"
                class="mt-2 w-full text-xs text-gray-400 underline text-center"
              >Try another action</button>
            </div>
            <p class="mt-2 text-center text-xs text-gray-400">← Tap a product or action to see how Printy works</p>
          </div>

        </div>
      </div>
    </section>

    <!-- PAIN POINTS -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-5xl mx-auto px-4">
        <p class="text-orange-500 text-xs font-bold uppercase tracking-widest text-center">Why shops join</p>
        <h2 class="text-center mt-2 text-2xl md:text-3xl font-black text-gray-900">Every print shop owner knows this feeling.</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="text-2xl mb-2">💬</div>
            <h3 class="font-bold text-gray-900">40 WhatsApp messages for one job</h3>
            <p class="mt-1 text-sm text-gray-500">Customers ask price without specs. You ask specs. They disappear. You lose the job.</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="text-2xl mb-2">⚠️</div>
            <h3 class="font-bold text-gray-900">Staff quote differently every time</h3>
            <p class="mt-1 text-sm text-gray-500">Same job, three different prices depending on who picks up the phone.</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="text-2xl mb-2">📉</div>
            <h3 class="font-bold text-gray-900">Finishing costs get forgotten</h3>
            <p class="mt-1 text-sm text-gray-500">Lamination, cutting, binding — forgotten in the rush. Margins leak quietly.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- MARKUP INTELLIGENCE -->
    <section id="markup-section" class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Left copy -->
          <div>
            <span class="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Market intelligence · Zero to One</span>
            <h2 class="mt-4 text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              Know exactly how low you can go before you lose margin.
            </h2>
            <p class="mt-4 text-gray-500 leading-relaxed">
              Printy analyses anonymous pricing signals across shops to compute a market range. You see where your price sits — floor, median, and premium — without any shop ever seeing your rate card.
            </p>
            <div class="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              🔒 <strong>Privacy guaranteed.</strong> We only show ranges once 5+ shops contribute data. Individual rate cards are never visible to anyone.
            </div>
            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">✅ <span>Markup auto-suggested from <strong>market mean &amp; median</strong></span></div>
              <div class="flex items-center gap-2">✅ <span>Range shown: <strong>1.3× – 1.8×</strong> your production cost</span></div>
              <div class="flex items-center gap-2">✅ <span>You see <strong>floor, recommended, premium</strong> — you decide</span></div>
            </div>
          </div>

          <!-- Right — Interactive markup demo -->
          <div>
            <div class="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">Live demo · Adjust your cost</p>

              <!-- Cost slider -->
              <div class="mb-5">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Your production cost (KES)</span>
                  <span class="font-black text-gray-900">{{ cost.toLocaleString() }}</span>
                </div>
                <input
                  v-model.number="cost"
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  class="w-full accent-orange-500 cursor-pointer"
                />
                <div class="flex justify-between text-xs text-gray-400 mt-1"><span>500</span><span>10,000</span></div>
              </div>

              <!-- Market signals -->
              <div class="mb-4 text-xs text-gray-500 bg-white rounded-lg border border-gray-200 p-3">
                <div class="flex justify-between mb-1"><span>Market median (Nairobi)</span><span class="font-semibold text-gray-700">{{ fmtKes(markupMedian) }}</span></div>
                <div class="flex justify-between mb-1"><span>Market mean</span><span class="font-semibold text-gray-700">{{ fmtKes(markupMean) }}</span></div>
                <div class="flex justify-between"><span>Sample size</span><span class="font-semibold text-gray-700">14 shops</span></div>
              </div>

              <!-- Price tiers -->
              <div class="space-y-2">
                <div class="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Floor 1.3×</span>
                    <span class="text-sm text-gray-600">Min safe price</span>
                  </div>
                  <span class="font-bold text-gray-900">{{ fmtKes(markupFloor) }}</span>
                </div>
                <div class="flex items-center justify-between bg-orange-50 border-2 border-orange-400 rounded-lg px-4 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✦ Recommended</span>
                    <span class="text-sm text-gray-700">Market median</span>
                  </div>
                  <span class="font-black text-orange-600">{{ fmtKes(markupMedian) }}</span>
                </div>
                <div class="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Premium 1.8×</span>
                    <span class="text-sm text-gray-600">High-margin quote</span>
                  </div>
                  <span class="font-bold text-green-600">{{ fmtKes(markupPremium) }}</span>
                </div>
              </div>

              <!-- Negotiation room -->
              <div class="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-800">
                Negotiation room: <strong>{{ fmtKes(negRoom) }}</strong> — stay above <span>{{ fmtKes(markupFloor) }}</span>
              </div>

              <p class="mt-3 text-center text-xs text-gray-400 italic">Printy suggests. Your shop decides.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-center text-2xl md:text-3xl font-black text-gray-900">One setup. Cleaner jobs. No calls.</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border border-gray-200 p-5 relative">
            <div class="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-base flex items-center justify-center mb-3">1</div>
            <h3 class="font-bold text-gray-900">Add your shop logic once</h3>
            <p class="mt-1 text-sm text-gray-500">Papers, machines, finishing rates, turnaround. We help you set it up in 30 minutes.</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-base flex items-center justify-center mb-3">2</div>
            <h3 class="font-bold text-gray-900">Customers send structured requests</h3>
            <p class="mt-1 text-sm text-gray-500">Guided by your setup. Size, quantity, paper, finishing — all captured before they message you.</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-base flex items-center justify-center mb-3">3</div>
            <h3 class="font-bold text-gray-900">Accept, modify, or reject</h3>
            <p class="mt-1 text-sm text-gray-500">Full control stays with you. Printy never confirms a job on your behalf.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SCARCITY / FOMO -->
    <section class="py-14 bg-gray-900">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Early access · Nairobi only</span>
            <h2 class="mt-4 text-2xl md:text-3xl font-black text-white leading-tight">
              The first shops to join<br/>own the early-mover advantage.
            </h2>
            <p class="mt-3 text-gray-400 leading-relaxed">
              As buyer traffic grows on Printy, quote-ready shops appear first. Shops joining now get priority placement, founder-assisted setup, and market pricing data before it becomes common.
            </p>
            <p class="mt-4 text-orange-400 font-semibold text-sm">Shops that join later build on a foundation early shops helped create.</p>
          </div>
          <div class="space-y-3">
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <span class="text-green-400 text-lg mt-0.5">✓</span>
              <div>
                <p class="font-semibold text-white text-sm">Priority listing as buyers search</p>
                <p class="text-xs text-gray-400 mt-0.5">Early shops rank higher as the directory grows</p>
              </div>
            </div>
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <span class="text-green-400 text-lg mt-0.5">✓</span>
              <div>
                <p class="font-semibold text-white text-sm">Founder-assisted rate card setup</p>
                <p class="text-xs text-gray-400 mt-0.5">We structure your price list. Later shops set up themselves.</p>
              </div>
            </div>
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
              <span class="text-green-400 text-lg mt-0.5">✓</span>
              <div>
                <p class="font-semibold text-white text-sm">Market pricing intelligence — early access</p>
                <p class="text-xs text-gray-400 mt-0.5">You contribute to and benefit from the first Nairobi print pricing dataset</p>
              </div>
            </div>
            <div class="bg-gray-800 border border-orange-500 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p class="font-black text-white text-sm">{{ spots.remaining }} spots remaining in Nairobi</p>
                <p class="text-xs text-orange-400 mt-0.5">Once filled, next cohort opens in 60 days</p>
              </div>
              <button
                @click="openModal"
                class="bg-orange-500 text-white text-sm font-bold rounded-full px-4 py-2 hover:bg-orange-600 whitespace-nowrap ml-4"
              >
                Claim spot →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-12 bg-white">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-center text-2xl font-black text-gray-900">Before you join</h2>
        <div class="mt-8 space-y-3">
          <div v-for="(faq, i) in FAQS" :key="i" class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <button
              @click="toggleFaq(i)"
              class="w-full text-left px-5 py-4 font-semibold text-gray-900 flex justify-between items-center text-sm"
            >
              {{ faq.q }}
              <span class="text-orange-500 font-bold text-lg ml-4 flex-shrink-0">{{ openFaqIndex === i ? '−' : '+' }}</span>
            </button>
            <div v-if="openFaqIndex === i" class="px-5 pb-4 text-sm text-gray-600">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="py-16 bg-orange-500">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-black text-white leading-tight">
          Answer 100 quote questions<br/>without typing 100 replies.
        </h2>
        <p class="mt-4 text-orange-100 text-lg">{{ spots.remaining }} spots left for Nairobi. Free to start.</p>
        <button
          @click="openModal"
          class="mt-8 bg-white text-orange-500 font-black rounded-full px-10 py-4 text-lg hover:bg-orange-50 transition-colors"
        >
          Claim your free spot →
        </button>
        <p class="mt-3 text-orange-200 text-sm">No payment. No commitment. Setup with founder assistance.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-gray-900 border-t border-gray-800 py-8">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
          </div>
          <img src="/assets/word-mark/light/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto" />
          <span class="text-gray-500 text-sm ml-1">Built for Kenyan print shops.</span>
        </div>
        <div class="flex gap-5 text-sm text-gray-500">
          <a href="/for-shops" class="hover:text-white transition-colors">For shop owners</a>
          <a href="/auth/login" class="hover:text-white transition-colors">Login</a>
        </div>
        <p class="text-gray-600 text-xs">© 2026 Printy. All rights reserved.</p>
      </div>
    </footer>

    <!-- JOIN MODAL -->
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
              <span class="text-xs font-semibold text-red-600">{{ spots.remaining }} spots remaining</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900">Claim your early spot</h3>
            <p class="mt-2 text-gray-500 text-sm">We'll reach out to schedule your free founder-assisted rate card setup.</p>
            <div class="mt-5 space-y-3">
              <input
                v-model="form.shopName"
                type="text"
                placeholder="Shop name"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Your phone (WhatsApp)"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
              <input
                v-model="form.area"
                type="text"
                placeholder="Area / Estate in Nairobi"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <p v-if="submitError" class="mt-3 text-xs text-red-600 text-center">{{ submitError }}</p>
            <button
              @click="submitModal"
              :disabled="submitting"
              class="mt-5 w-full bg-orange-500 text-white font-black rounded-full py-3.5 text-base hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting…' : 'Request my spot →' }}
            </button>
            <p class="mt-3 text-center text-xs text-gray-400">No payment. We contact you within 24 hours.</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- SUCCESS MODAL -->
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
            <p class="mt-2 text-gray-500 text-sm">We'll contact you within 24 hours to schedule your free setup session. Bring your current price list.</p>
            <button
              @click="closeSuccessModal"
              class="mt-5 bg-orange-500 text-white font-bold rounded-full px-8 py-3 hover:bg-orange-600"
            >Done</button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { usePublicApiNoAuth } from '~/shared/api'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'For Print Shop Owners — Printy',
  description: 'Printy turns your rate cards, papers, and finishing into a quote engine — so customers arrive with specs, not questions.',
  ogTitle: 'For Print Shop Owners — Printy',
  ogDescription: 'Printy turns your rate cards, papers, and finishing into a quote engine — so customers arrive with specs, not questions.',
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' as const },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' },
  ],
})

// ── Types ───────────────────────────────────────────────────────────────────

type ProductKey = 'bizcard' | 'flyer' | 'booklet'
type ActionType = 'accept' | 'modify' | 'reject'

interface SpotsData {
  total: number
  used: number
  remaining: number
}

interface ProductSpec {
  product: string
  qty: string
  paper: string
  finish: string
  turn: string
  price: string
}

// ── Static data ──────────────────────────────────────────────────────────────

const PRODUCTS: Record<ProductKey, ProductSpec> = {
  bizcard: { product: 'Business Cards', qty: '500 pcs', paper: '350gsm Art Card', finish: 'Matte Lam + Round Corners', turn: '24–48 hrs', price: 'KES 2,800 – KES 3,400' },
  flyer: { product: 'A4 Flyers', qty: '1,000 pcs', paper: '90gsm Bond', finish: 'None', turn: '48–72 hrs', price: 'KES 4,200 – KES 5,100' },
  booklet: { product: 'A5 Booklet (20pp)', qty: '100 copies', paper: '80gsm Bond inner / 250gsm Art Card cover', finish: 'Saddle-stitch binding', turn: '3–5 days', price: 'KES 18,000 – KES 22,000' },
}

const PRODUCT_LABELS: Record<ProductKey, string> = {
  bizcard: 'Business Cards',
  flyer: 'A4 Flyers',
  booklet: 'Booklet',
}

const FAQS = [
  { q: 'Will Printy control my prices?', a: 'No. You enter your own rates. Printy structures what you already know and suggests a market range. You set the final price.' },
  { q: 'Will other shops see my rate card?', a: 'Never. Market ranges are computed from anonymous signals with a minimum of 5 shops. No competitor sees your private pricing.' },
  { q: 'How long does setup take?', a: 'Early shops get founder-assisted setup — bring your price list and we structure it with you. Under 30 minutes for most shops.' },
  { q: 'Is Printy a directory?', a: 'No. The listing is the visible layer. The real product is a quote-readiness engine built on your own pricing logic, papers, machines, and finishing rates.' },
]

// ── Spots (API) ──────────────────────────────────────────────────────────────

const noAuthApi = usePublicApiNoAuth()
const { data: spotsData } = useAsyncData(
  'early-access-spots',
  () => noAuthApi<SpotsData>('/leads/spots/').catch(() => null),
)
const spots = computed<SpotsData>(() => spotsData.value ?? { total: 20, used: 12, remaining: 8 })
const spotsBarWidth = computed(() => `${Math.min(Math.round((spots.value.used / spots.value.total) * 100), 100)}%`)

// ── Quote card ────────────────────────────────────────────────────────────────

const currentProduct = ref<ProductKey>('bizcard')
const actionTaken = ref(false)
const actionType = ref<ActionType | null>(null)
const currentProductData = computed(() => PRODUCTS[currentProduct.value])

const cardBorderClass = computed(() => {
  if (!actionTaken.value) return 'border-gray-200'
  if (actionType.value === 'accept') return 'border-[#16A34A] bg-[#F0FDF4]'
  if (actionType.value === 'reject') return 'border-[#DC2626] bg-[#FEF2F2]'
  return 'border-[#F97316] bg-[#FFF7ED]'
})

const badgeText = computed(() => {
  if (!actionTaken.value) return 'Awaiting review'
  if (actionType.value === 'accept') return 'Accepted'
  if (actionType.value === 'reject') return 'Declined'
  return 'Counter-sent'
})

const badgeClass = computed(() => {
  if (!actionTaken.value) return 'bg-green-100 text-green-700'
  if (actionType.value === 'accept') return 'bg-green-100 text-green-700'
  if (actionType.value === 'reject') return 'bg-red-100 text-red-700'
  return 'bg-orange-100 text-orange-700'
})

const actionResultText = computed(() => {
  if (actionType.value === 'accept') return '✓ Job accepted — customer notified'
  if (actionType.value === 'reject') return '✕ Declined — customer notified with reason'
  return '✏ Counter-quote sent to customer'
})

const actionResultClass = computed(() => {
  if (actionType.value === 'accept') return 'bg-green-50 text-green-700'
  if (actionType.value === 'reject') return 'bg-red-50 text-red-600'
  return 'bg-orange-50 text-orange-700'
})

function switchProduct(key: ProductKey) {
  if (actionTaken.value) resetCard()
  currentProduct.value = key
}

function handleAction(action: ActionType) {
  actionTaken.value = true
  actionType.value = action
}

function resetCard() {
  actionTaken.value = false
  actionType.value = null
}

// ── Markup calculator ─────────────────────────────────────────────────────────

const cost = ref(2000)
const markupFloor = computed(() => Math.round(cost.value * 1.3 / 100) * 100)
const markupMedian = computed(() => Math.round(cost.value * 1.55 / 100) * 100)
const markupPremium = computed(() => Math.round(cost.value * 1.8 / 100) * 100)
const markupMean = computed(() => Math.round(cost.value * 1.62 / 100) * 100)
const negRoom = computed(() => markupMedian.value - markupFloor.value)
const fmtKes = (n: number) => 'KES ' + n.toLocaleString()

// ── FAQ ───────────────────────────────────────────────────────────────────────

const openFaqIndex = ref<number | null>(null)
function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

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

// ── Scroll helper ─────────────────────────────────────────────────────────────

function scrollToMarkup() {
  if (import.meta.client) {
    document.getElementById('markup-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}

// ── Cleanup ───────────────────────────────────────────────────────────────────

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.35s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
