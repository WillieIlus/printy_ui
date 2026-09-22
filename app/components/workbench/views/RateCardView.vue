<template>
  <div class="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-8 sm:px-6">
    <!-- header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <NuxtLink
          to="/app/printer"
          class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft :size="12" /> Back to the floor
        </NuxtLink>
        <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <Coins :size="12" style="color: var(--accent)" /> {{ shopName }} · rate card
        </div>
        <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
          Set your prices once.<span class="block text-[var(--sub)]">Quote every job instantly.</span>
        </h1>
        <p class="mt-2 max-w-[56ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
          These rates power every quote Printy sends on your behalf. Change a number here and the
          calculator, the marketplace and your job requests all update immediately.
        </p>
      </div>

      <!-- readiness -->
      <div
        class="w-full max-w-[290px] rounded-2xl border p-4"
        :style="{
          borderColor: ready ? 'var(--accent)' : 'var(--line)',
          background: 'var(--panel)',
        }"
      >
        <div class="flex items-center justify-between">
          <ML>Rate card status</ML>
          <span class="font-mono2 text-[10px] font-bold" :style="{ color: ready ? '#0E7A45' : '#B45309' }">
            {{ doneCount }}/{{ checks.length }}
          </span>
        </div>
        <div class="mt-2.5 h-1.5 overflow-hidden rounded-full" :style="{ background: 'var(--line)' }">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ background: ready ? '#0E7A45' : 'var(--accent)', width: `${(doneCount / checks.length) * 100}%` }"
          />
        </div>
        <div class="mt-3 space-y-1.5">
          <div v-for="c in checks" :key="c.label" class="flex items-center gap-2 text-[11.5px]">
            <span
              class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
              :style="c.ok ? { background: '#0E7A45' } : { boxShadow: 'inset 0 0 0 1.5px var(--line)' }"
            >
              <Check v-if="c.ok" :size="9" stroke-width="4" class="text-white" />
            </span>
            <span :style="{ color: c.ok ? 'var(--ink)' : 'var(--sub)' }">{{ c.label }}</span>
          </div>
        </div>
        <div
          v-if="completed"
          class="mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-mono2 text-[9px] uppercase tracking-[0.12em]"
          :style="{ background: 'rgba(47,191,113,.12)', color: '#0E7A45' }"
        >
          <BadgeCheck :size="11" /> live on the marketplace
        </div>
      </div>
    </div>

    <!-- tabs -->
    <div class="mt-7 flex flex-wrap gap-1.5 border-b pb-3" :style="{ borderColor: 'var(--line)' }">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="tab = t.id"
        class="press-key relative flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors"
        :style="{
          background: tab === t.id ? 'var(--accent)' : 'var(--panel)',
          color: tab === t.id ? 'var(--accentInk)' : 'var(--sub)',
        }"
      >
        <component :is="t.icon" :size="13" />
        {{ t.label }}
        <span
          class="rounded-full px-1.5 py-[1px] text-[9px]"
          :style="{ background: tab === t.id ? 'rgba(0,0,0,.18)' : 'var(--panel2)' }"
        >
          {{ t.count }}
        </span>
      </button>
    </div>

    <!-- loading / error -->
    <div v-if="loading" class="mt-16 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading your rate card…</span>
    </div>
    <div v-else-if="errorText" class="mt-16 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <AlertTriangle :size="22" style="color: #C81E44" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ errorText }}</p>
      <button
        @click="load"
        class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
      >
        <RefreshCw :size="12" /> Try again
      </button>
      <NuxtLink
        v-if="noShop"
        to="/app/printer"
        class="press-key mt-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        :style="{ borderColor: 'var(--line)', color: 'var(--accent)' }"
      >
        <ArrowLeft :size="12" /> Go to my dashboard
      </NuxtLink>
    </div>

    <div v-else class="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
      <!-- ── editor ── -->
      <div>
        <!-- PAPER -->
        <div v-if="tab === 'paper'" class="space-y-4">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Paper stock</h2>
            <p class="mt-0.5 text-[12px] text-[var(--sub)]">
              Price per SRA3 sheet. Print bases live with the stock they run on.
            </p>
          </div>

          <div class="hidden gap-2.5 px-3 pb-1.5 font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--sub)] md:flex">
            <span class="w-[170px]">Stock</span>
            <span class="w-[54px]">GSM</span>
            <span class="w-[96px]">Market</span>
            <span class="w-[96px]">Paper /sheet</span>
            <span class="w-[96px]">Print 1s</span>
            <span class="w-[96px]">Print 2s</span>
            <span class="w-[96px]">Surcharge</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="row in paperRows"
              :key="row.key"
              class="flex flex-wrap items-center gap-2.5 rounded-xl border p-3"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)', opacity: row.active ? 1 : 0.45 }"
            >
              <div class="w-[170px] shrink-0">
                <div class="text-[12.5px] font-semibold">{{ row.label }}</div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.size }}</div>
              </div>
              <span class="w-[54px] shrink-0 font-mono2 text-[12px] font-semibold">{{ row.gsm }}g</span>
              <div class="w-[96px] shrink-0">
                <span
                  v-if="guideFor(row)?.has_enough_data"
                  class="rounded-lg px-2 py-1 font-mono2 text-[9px] uppercase tracking-[0.08em]"
                  :style="{
                    background: 'var(--panel2)',
                    color: aboveGuide(row) ? '#0E7A45' : '#B45309',
                  }"
                >
                  mkt ≈ {{ ksh2(Number(guideFor(row)?.median ?? 0)) }}
                </span>
                <span v-else class="font-mono2 text-[9px] text-[var(--sub)]">no guide yet</span>
              </div>
              <RcField
                :value="row.paper_base_price"
                prefix="KSh"
                :width="96"
                @change="(v) => setNum(paperRows, row, 'paper_base_price', v)"
              />
              <RcField
                :value="row.single_print_base"
                prefix="KSh"
                :width="96"
                @change="(v) => setNum(paperRows, row, 'single_print_base', v)"
              />
              <RcField
                :value="row.double_print_base ?? ''"
                prefix="KSh"
                :width="96"
                :disabled="!row.double_sided_enabled"
                :placeholder="row.double_sided_enabled ? '' : '1-sided'"
                @change="(v) => setNum(paperRows, row, 'double_print_base', v)"
              />
              <RcField
                :value="row.heavy_paper_surcharge"
                prefix="KSh"
                :width="96"
                :disabled="row.gsm < row.surcharge_threshold_gsm"
                @change="(v) => setNum(paperRows, row, 'heavy_paper_surcharge', v)"
              />
              <div class="ml-auto flex items-center gap-2">
                <RcToggle :on="row.active" @change="(b) => setBool(paperRows, row, 'active', b)" />
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5 rounded-xl p-3.5" :style="{ background: 'var(--panel2)' }">
            <Sparkles :size="14" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              The surcharge column only applies to stock at or above {{ DEFAULT_HEAVY_THRESHOLD }}gsm.
              Client price per sheet = paper + printing (+ surcharge), calculated server-side — screen numbers are rounded for editing.
            </p>
          </div>
        </div>

        <!-- PRINTING -->
        <div v-else-if="tab === 'printing'" class="space-y-4">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Printing rates</h2>
            <p class="mt-0.5 text-[12px] text-[var(--sub)]">
              Per sheet, on the SRA3 digital press your stocks run on.
            </p>
          </div>

          <div class="hidden gap-2.5 px-3 pb-1.5 font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--sub)] lg:flex">
            <span class="w-[190px]">Machine</span>
            <span class="w-[96px]">Sheet</span>
            <span class="w-[76px]">Ink</span>
            <span class="w-[96px]">1 side</span>
            <span class="w-[96px]">2 sides</span>
            <span class="w-[96px]">Surcharge</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="row in paperRows"
              :key="row.key"
              class="flex flex-wrap items-center gap-2.5 rounded-xl border p-3"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)', opacity: row.active ? 1 : 0.45 }"
            >
              <div class="w-[190px] shrink-0">
                <div class="text-[12.5px] font-semibold">Digital press · {{ row.label }}</div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.gsm }}g · colour</div>
              </div>
              <span class="w-[96px] shrink-0 font-mono2 text-[12px] font-semibold">{{ row.size }}</span>
              <span class="w-[76px] shrink-0 font-mono2 text-[10.5px] font-semibold" style="color: var(--accent)">Colour</span>
              <RcField
                :value="row.single_print_base"
                prefix="KSh"
                :width="96"
                @change="(v) => setNum(paperRows, row, 'single_print_base', v)"
              />
              <RcField
                :value="row.double_print_base ?? ''"
                prefix="KSh"
                :width="96"
                :disabled="!row.double_sided_enabled"
                :placeholder="row.double_sided_enabled ? '' : '1-sided'"
                @change="(v) => setNum(paperRows, row, 'double_print_base', v)"
              />
              <RcField
                :value="row.heavy_paper_surcharge"
                prefix="KSh"
                :width="96"
                :disabled="row.gsm < row.surcharge_threshold_gsm"
                @change="(v) => setNum(paperRows, row, 'heavy_paper_surcharge', v)"
              />
              <div class="ml-auto flex items-center gap-2">
                <RcToggle :on="row.active" @change="(b) => setBool(paperRows, row, 'active', b)" />
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5 rounded-xl p-3.5" :style="{ background: 'var(--panel2)' }">
            <Sparkles :size="14" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              Printing rates are attached to the paper stock they run on, so a job is always quoted off
              the exact sheet it uses. Edit them here or from Paper stock — they're the same number.
            </p>
          </div>
        </div>

        <!-- FINISHING -->
        <div v-else-if="tab === 'finishing'" class="space-y-4">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Finishing services</h2>
            <p class="mt-0.5 text-[12px] text-[var(--sub)]">
              How each service bills and its rate. Minimum charge protects you on tiny runs.
            </p>
          </div>

          <div class="hidden gap-2.5 px-3 pb-1.5 font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--sub)] lg:flex">
            <span class="w-[190px]">Service</span>
            <span class="w-[110px]">Bills</span>
            <span class="w-[120px]">Rate</span>
            <span class="w-[120px]">Minimum</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="row in finishRows"
              :key="row.key"
              class="flex flex-wrap items-center gap-2.5 rounded-xl border p-3"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)', opacity: row.active ? 1 : 0.45 }"
            >
              <div class="w-[190px] shrink-0">
                <div class="text-[12.5px] font-semibold">{{ row.label }}</div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.unit }}</div>
              </div>
              <span
                class="w-[110px] shrink-0 rounded-lg px-2 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.1em] text-center"
                :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
              >
                {{ basisLabel(row) }}
              </span>
              <RcField
                :value="row.price"
                prefix="KSh"
                :width="120"
                @change="(v) => setNum(finishRows, row, 'price', v)"
              />
              <RcField
                :value="row.minimum_charge ?? ''"
                prefix="KSh"
                :width="120"
                :placeholder="'none'"
                @change="(v) => setNum(finishRows, row, 'minimum_charge', v)"
              />
              <div class="ml-auto flex items-center gap-2">
                <RcToggle :on="row.active" @change="(b) => setBool(finishRows, row, 'active', b)" />
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5 rounded-xl p-3.5" :style="{ background: 'var(--panel2)' }">
            <Scissors :size="14" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              Minimum charge is only applied when the run total is below it.
            </p>
          </div>
        </div>

        <!-- READINESS -->
        <div v-else class="space-y-4">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Readiness & shop</h2>
            <p class="mt-0.5 text-[12px] text-[var(--sub)]">
              What publishes with this rate card — and what your clients see about your shop.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <div class="font-disp text-[26px] font-bold leading-none" style="color: var(--accent)">{{ summary?.pricing_items_added ?? 0 }}</div>
              <div class="mt-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">priced items</div>
            </div>
            <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <div class="font-disp text-[26px] font-bold leading-none" style="color: var(--accent)">{{ summary?.products_unlocked ?? 0 }}</div>
              <div class="mt-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">products you can quote</div>
            </div>
            <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <div class="font-disp text-[26px] font-bold leading-none" style="color: var(--accent)">{{ summary?.paper_rows_added ?? 0 }} + {{ summary?.finishing_rows_added ?? 0 }}</div>
              <div class="mt-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">sheets + services live</div>
            </div>
          </div>

          <div
            v-if="(summary?.product_catalog ?? []).length"
            class="rounded-2xl border p-4"
            :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <Sparkles :size="14" style="color: var(--accent)" />
                <span class="font-disp text-[13px] font-bold">Products you can offer</span>
              </div>
              <span
                class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.1em]"
                :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
              >
                min 100 pieces
              </span>
            </div>
            <p class="mt-1 text-[11.5px] leading-relaxed text-[var(--sub)]">
              Each product needs a priced sheet stock plus any finishing it calls for. Green means buyers can quote it at
              100 pieces right now.
            </p>
            <div class="mt-3 space-y-1.5">
              <div
                v-for="row in summary?.product_catalog ?? []"
                :key="row.key"
                class="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                :style="row.available ? { borderColor: 'rgba(47,191,113,.35)', background: 'rgba(47,191,113,.06)' } : { borderColor: 'var(--line)', background: 'var(--panel2)' }"
              >
                <span class="flex h-2 w-2 shrink-0 rounded-full" :style="row.available ? { background: '#0E7A45' } : { background: '#B45309' }" />
                <div class="min-w-0 flex-1">
                  <div class="text-[12.5px] font-semibold">{{ row.label }}</div>
                  <div v-if="row.available && row.sample" class="truncate text-[10.5px] text-[var(--sub)]">
                    {{ row.sample_size }} pcs · {{ row.sample.sheets_needed }} SRA3 sheets · {{ sampleCost(row) }}
                  </div>
                  <div v-else class="truncate text-[10.5px] text-[var(--sub)]">{{ missingText(row) }}</div>
                </div>
                <span
                  class="shrink-0 rounded-full px-2 py-[1px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]"
                  :style="row.available ? { background: 'rgba(47,191,113,.14)', color: '#0E7A45' } : { background: 'rgba(245,166,35,.14)', color: '#B45309' }"
                >
                  {{ row.available ? 'Ready' : 'Needs setup' }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="(summary?.completion_feed ?? []).length"
            class="rounded-2xl border p-4"
            :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
          >
            <div class="flex items-center gap-2">
              <TrendingUp :size="14" style="color: var(--accent)" />
              <span class="font-disp text-[13px] font-bold">What unlocks next</span>
            </div>
            <div class="mt-2.5 space-y-1">
              <div v-for="item in summary?.completion_feed ?? []" :key="item" class="flex items-start gap-2 text-[11.5px] text-[var(--sub)]">
                <span class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--accent)" />
                {{ item }}
              </div>
            </div>
            <div v-if="(summary?.next_suggestions ?? []).length" class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-for="s in summary?.next_suggestions ?? []"
                :key="s"
                class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.1em]"
                :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
              >
                {{ s }}
              </span>
            </div>
          </div>

          <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="flex items-center gap-2">
              <Package :size="14" style="color: var(--accent)" />
              <span class="font-disp text-[13px] font-bold">Shop profile</span>
            </div>
            <p class="mt-1 text-[11.5px] leading-relaxed text-[var(--sub)]">
              Shown on the marketplace card. Your SLA promise and production days stay in the shop profile schedule.
            </p>
            <div class="mt-3 space-y-2.5">
              <div>
                <ML>Shop name</ML>
                <RcText v-model="shopDetails.shop_name" @input="touch" />
              </div>
              <div class="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <ML>WhatsApp number</ML>
                  <RcText v-model="shopDetails.whatsapp_number" @input="touch" />
                </div>
                <div>
                  <ML>Location area</ML>
                  <RcText v-model="shopDetails.location_area" @input="touch" />
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="exampleQuote && !exampleQuote.is_complete"
            class="flex items-start gap-2.5 rounded-xl p-3.5"
            :style="{ background: 'rgba(245,166,35,.1)', border: '1px solid rgba(245,166,35,.35)' }"
          >
            <AlertTriangle :size="14" class="mt-0.5 shrink-0" style="color: #B45309" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              {{ exampleQuote.status_text }}
            </p>
          </div>
        </div>
      </div>

      <!-- ── live preview rail ── -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="overflow-hidden rounded-3xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="relative overflow-hidden p-5" :style="{ background: 'color-mix(in srgb, var(--accent) 9%, transparent)' }">
            <ML>What a client would pay</ML>
            <div class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
              {{ exampleQuote?.is_active ? exampleQuote?.title : 'Waiting for an active 300gsm+ stock' }}
            </div>
            <template v-if="exampleQuote && exampleQuote.is_active && Number(clientPrice) > 0">
              <div class="mt-2.5 font-disp text-[32px] font-bold leading-none tracking-tight" style="color: var(--accent)">
                {{ ksh(clientPrice) }}
              </div>
              <div class="mt-1.5 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
                {{ ksh2(Number(clientPrice) / 100) }} per card
              </div>
            </template>
            <div v-else class="mt-3 text-[12px] text-[var(--sub)]">
              Activate a 300gsm or 350gsm stock to preview.
            </div>
          </div>

          <div v-if="exampleQuote && exampleQuote.is_active" class="space-y-2 p-5">
            <div
              v-for="item in exampleQuote.line_items"
              :key="item.key"
              v-show="item.active"
              class="flex items-start justify-between gap-3"
            >
              <div>
                <div class="text-[12px] font-medium">{{ item.label }}</div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ item.detail }}</div>
              </div>
              <span class="font-mono2 text-[11.5px]">{{ item.total ? ksh2(Number(item.total)) : ksh2(0) }}</span>
            </div>

            <div class="my-2 border-t" :style="{ borderColor: 'var(--line)' }" />
            <div class="flex items-center justify-between">
              <span class="text-[12px] font-semibold">You receive</span>
              <span class="font-mono2 text-[14px] font-bold" style="color: #0E7A45">{{ ksh2(Number(productionCost)) }}</span>
            </div>
            <div class="flex items-center justify-between text-[11.5px] text-[var(--sub)]">
              <span>Printy fee</span><span class="font-mono2">{{ ksh2(Number(printyFee)) }}</span>
            </div>
            <div class="flex items-center justify-between text-[11.5px] text-[var(--sub)]">
              <span>Gross margin</span><span class="font-mono2">{{ grossMarginPct }} · {{ ksh2(grossMargin) }}</span>
            </div>

            <div class="mt-3 flex items-start gap-2 rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <TrendingUp :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" />
              <p class="text-[11px] leading-relaxed text-[var(--sub)]">
                {{ exampleQuote?.sheets_needed ?? '—' }} SRA3 sheets on {{ exampleQuote?.paper_label ?? 'your active stock' }}.
                These figures come from the live rate card — not this screen.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-3 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex items-center gap-2">
            <Copy :size="13" style="color: var(--accent)" />
            <span class="font-disp text-[13px] font-bold">Bulk actions</span>
          </div>
          <div class="mt-2.5 grid gap-1.5">
            <button
              @click="raisePaperFive"
              class="press-key rounded-lg border px-3 py-2 text-left font-mono2 text-[10px] uppercase tracking-[0.1em]"
              :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
            >
              Raise all stock 5%
            </button>
            <button
              @click="resetToDefaults"
              class="press-key rounded-lg border px-3 py-2 text-left font-mono2 text-[10px] uppercase tracking-[0.1em]"
              :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
            >
              Reset to Printy defaults
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- ── save bar ── -->
    <div
      v-if="dirty || justSaved || saving || saveError"
      class="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
      :style="{ borderColor: 'var(--line)', background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }"
    >
      <div class="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3.5 sm:px-6">
        <template v-if="justSaved">
          <span class="inline-flex items-center gap-2 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" style="color: #0E7A45">
            <Check :size="15" /> {{ completed ? 'Rate card saved — live on the marketplace' : 'Rate card saved as a draft' }}
          </span>
        </template>
        <template v-else>
          <AlertTriangle :size="15" style="color: #B45309" class="shrink-0" />
          <span class="text-[12.5px] text-[var(--sub)]">
            {{ saveError || 'You have unsaved rate changes. Quotes still use your last saved prices.' }}
          </span>
          <button
            @click="publish"
            :disabled="saving"
            class="press-key ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-60"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          >
            <Loader2 v-if="saving" :size="14" class="animate-spin" />
            <Save v-else :size="14" />
            {{ saving ? 'Saving…' : 'Publish rate card' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AlertTriangle, ArrowLeft, BadgeCheck, Check, Coins, Copy, Layers, Loader2,
  Package, Printer as PrinterIcon, RefreshCw, Save, Scissors, Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { ksh, ksh2 } from '~/shared/workflow/pricing'

type Tab = 'paper' | 'printing' | 'finishing' | 'readiness'

interface ShopDetails {
  shop_name: string
  whatsapp_number: string
  location_area: string
}

interface PaperRow {
  key: string
  id: string
  label: string
  paper_name: string
  gsm: number
  paper_type: string
  category: string
  size: string
  paper_base_price: string
  single_print_base: string
  double_print_base: string | null
  heavy_paper_surcharge: string
  surcharge_threshold_gsm: number
  single_side_price: string
  double_side_price: string | null
  double_sided_enabled: boolean
  supports_double_side: boolean
  quantity_in_stock: number
  active: boolean
}

interface FinishingRow {
  key: string
  id: string
  label: string
  name: string
  pricing_mode: string
  unit: string
  price: string
  minimum_charge: string | null
  active: boolean
}

interface ExampleLineItem {
  key: string
  label: string
  active: boolean
  detail: string
  total: string | null
}

interface ExampleQuote {
  title: string
  paper_label: string
  sheets_needed: number
  missing_fields: string[]
  is_complete: boolean
  is_active: boolean
  status_text: string
  line_items: ExampleLineItem[]
  production_cost: string | null
  client_price: string | null
  estimated_total: string | null
}

interface ProductCatalogSample {
  sheets_needed: number
  total_production_cost: string | null
  [key: string]: unknown
}

interface ProductCatalogRow {
  key: string
  label: string
  min_qty: number
  sample_size: number
  available: boolean
  status: string
  missing_items: string[]
  reason: string | null
  sample: ProductCatalogSample | null
}

interface Summary {
  pricing_items_added: number
  paper_rows_added: number
  finishing_rows_added: number
  products_unlocked: number
  unlocked_products: string[]
  product_catalog: ProductCatalogRow[]
  capability_preview: unknown[]
  completion_feed: string[]
  next_suggestions: string[]
}

interface MarketGuide {
  min: string | null
  max: string | null
  median: string | null
  mean: string | null
  sample_count: number
  has_enough_data: boolean
  message: string | null
}

function missingText(row: ProductCatalogRow) {
  const items = row.missing_items ?? []
  if (items.length) return `Needs: ${items.join(' · ')}`
  return row.reason || 'Needs setup to quote this product'
}

function sampleCost(row: ProductCatalogRow) {
  const cost = row.sample?.total_production_cost
  const n = cost == null ? null : Number(cost)
  return n == null || !Number.isFinite(n) || n <= 0 ? '—' : `≈ ${ksh2(n)}`
}

interface RowMarketGuide {
  single_side_price?: MarketGuide | null
  double_side_price?: MarketGuide | null
  price?: MarketGuide | null
}

interface RateCardSetup {
  paper_rows: PaperRow[]
  finishing_rows: FinishingRow[]
  shop_details: ShopDetails
  summary: Summary
  example_quote: ExampleQuote
  market_label?: string
  completed: boolean
  pricing_settings: {
    broker_margin_percent: string
    service_margin_percent: string
    broker_margin_locked: boolean
    service_margin_locked: boolean
  }
  market_guides?: Record<string, RowMarketGuide>
}

const DEFAULT_HEAVY_THRESHOLD = 250
const BASIS_LABELS: Record<string, string> = {
  per_sheet: 'per sheet',
  per_piece: 'per piece',
  flat_per_job: 'flat',
  per_book: 'per book',
}

const { api } = useApi()

const loading = ref(true)
const errorText = ref('')
const noShop = ref(false)
const tab = ref<Tab>('paper')

const paperRows = ref<PaperRow[]>([])
const finishRows = ref<FinishingRow[]>([])
const shopDetails = ref<ShopDetails>({ shop_name: '', whatsapp_number: '', location_area: '' })
const summary = ref<Summary | null>(null)
const exampleQuote = ref<ExampleQuote | null>(null)
const marketGuides = ref<Record<string, RowMarketGuide>>({})
const pricingSettings = ref<RateCardSetup['pricing_settings']>({
  broker_margin_percent: '75.00',
  service_margin_percent: '0.00',
  broker_margin_locked: true,
  service_margin_locked: true,
})
const completed = ref(false)

const dirty = ref(false)
const justSaved = ref(false)
const saving = ref(false)
const saveError = ref('')
let saveTimer: number | null = null

const shopName = computed(() => shopDetails.value.shop_name.trim() || 'Your shop')

function toNum(v: string | number | null | undefined): number {
  if (v == null || v === '') return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function applyPayload(payload: RateCardSetup) {
  paperRows.value = payload.paper_rows ?? []
  finishRows.value = payload.finishing_rows ?? []
  shopDetails.value = payload.shop_details ?? { shop_name: '', whatsapp_number: '', location_area: '' }
  summary.value = payload.summary ?? null
  exampleQuote.value = payload.example_quote ?? null
  marketGuides.value = payload.market_guides ?? {}
  pricingSettings.value = payload.pricing_settings ?? pricingSettings.value
  completed.value = Boolean(payload.completed)
}

async function load() {
  loading.value = true
  errorText.value = ''
  noShop.value = false
  try {
    applyPayload(await api<RateCardSetup>(API.rateCard.setup))
  } catch (e) {
    const msg = getApiErrorMessage(e, 'Your rate card could not be loaded.')
    errorText.value = msg
    noShop.value = msg.includes('Complete shop setup before setting your rate card')
  } finally {
    loading.value = false
  }
}

onMounted(load)

onBeforeUnmount(() => {
  if (saveTimer) window.clearTimeout(saveTimer)
})

function touch() {
  dirty.value = true
  justSaved.value = false
  saveError.value = ''
}

function cleanNum(raw: string, prev: string | null): string | null {
  const text = String(raw ?? '').replace(/[^\d.]/g, '')
  if (text === '') return prev ?? null
  const n = Number(text)
  if (!Number.isFinite(n) || n < 0) return prev ?? null
  return (Math.round(n * 100) / 100).toString()
}

function setNum<T extends { key: string }>(
  rows: T[],
  row: T,
  field: keyof T,
  raw: string,
) {
  const idx = rows.findIndex((r) => r.key === row.key)
  const target = idx >= 0 ? rows[idx] : undefined
  if (!target) return
  const prev = (target[field] ?? null) as string | null
  const cleaned = cleanNum(raw, prev)
  if (cleaned !== prev) {
    ;(target as Record<string, unknown>)[field as string] = cleaned
    touch()
  }
}

function setBool<T extends { key: string }>(
  rows: T[],
  row: T,
  field: keyof T,
  value: boolean,
) {
  const idx = rows.findIndex((r) => r.key === row.key)
  const target = idx >= 0 ? rows[idx] : undefined
  if (!target) return
  ;(target as Record<string, unknown>)[field as string] = value
  touch()
}

function guideFor(row: PaperRow): MarketGuide | undefined {
  const guide = marketGuides.value[row.key] ?? marketGuides.value[row.id]
  return guide?.single_side_price ?? guide?.double_side_price ?? guide?.price ?? undefined
}

function aboveGuide(row: PaperRow): boolean {
  const guide = guideFor(row)
  if (!guide?.has_enough_data || !guide.median) return true
  return toNum(row.single_side_price) >= toNum(guide.median)
}

function basisLabel(row: FinishingRow): string {
  return BASIS_LABELS[row.pricing_mode] || row.pricing_mode || row.unit
}

const activePaper = computed(() => paperRows.value.filter((r) => r.active))
const activeFinish = computed(() => finishRows.value.filter((r) => r.active))

const checks = computed(() => [
  { label: 'Paper stock priced', ok: activePaper.value.some((p) => toNum(p.single_side_price) > 0) },
  { label: 'Printing rates set', ok: activePaper.value.some((p) => toNum(p.double_side_price) > 0) },
  { label: 'Finishing services', ok: activeFinish.value.some((f) => toNum(f.price) > 0) },
  {
    label: 'Shop contact details',
    ok: Boolean(
      shopDetails.value.shop_name.trim()
      && shopDetails.value.whatsapp_number.trim()
      && shopDetails.value.location_area.trim(),
    ),
  },
  { label: 'Quote proof ready', ok: Boolean(exampleQuote.value?.is_complete) },
])

const doneCount = computed(() => checks.value.filter((c) => c.ok).length)
const ready = computed(() => checks.value.length > 0 && checks.value.every((c) => c.ok))

const tabs = computed(() => [
  { id: 'paper' as Tab, label: 'Paper stock', icon: Layers, count: activePaper.value.length },
  { id: 'printing' as Tab, label: 'Printing', icon: PrinterIcon, count: activePaper.value.length },
  { id: 'finishing' as Tab, label: 'Finishing', icon: Scissors, count: activeFinish.value.length },
  { id: 'readiness' as Tab, label: 'Readiness', icon: BadgeCheck, count: summary.value?.products_unlocked ?? 0 },
])

const pricingLines = computed(() => {
  const breakdown = (exampleQuote.value as ExampleQuote & { pricing_breakdown?: Record<string, string> | null }).pricing_breakdown
  if (!breakdown) return null
  return {
    client: toNum(breakdown.client_price),
    production: toNum(breakdown.production_cost),
    gross: toNum(breakdown.gross_margin),
    grossPct: breakdown.gross_margin_percent ?? '',
    printy: toNum(breakdown.printy_fee),
  }
})
const clientPrice = computed(() => pricingLines.value?.client || toNum(exampleQuote.value?.client_price))
const productionCost = computed(() => pricingLines.value?.production || toNum(exampleQuote.value?.production_cost))
const printyFee = computed(() => pricingLines.value?.printy ?? 0)
const grossMargin = computed(() =>
  pricingLines.value ? pricingLines.value.gross : Math.max(0, clientPrice.value - productionCost.value - printyFee.value),
)
const grossMarginPct = computed(
  () => pricingLines.value?.grossPct
    || (clientPrice.value > 0 ? `${Math.round((grossMargin.value / clientPrice.value) * 100)}%` : '—'),
)

function raisePaperFive() {
  const up = (v: string | null): string | null =>
    v == null || v === '' ? v : (Math.round(toNum(v) * 1.05 * 100) / 100).toString()
  paperRows.value = paperRows.value.map((row) => ({
    ...row,
    paper_base_price: up(row.paper_base_price)!,
    single_print_base: up(row.single_print_base)!,
    double_print_base: up(row.double_print_base),
    heavy_paper_surcharge: up(row.heavy_paper_surcharge)!,
  }))
  touch()
}

async function resetToDefaults() {
  loading.value = true
  errorText.value = ''
  try {
    applyPayload(await api<RateCardSetup>(API.rateCard.setup))
    dirty.value = false
    saveError.value = ''
  } catch (e) {
    errorText.value = getApiErrorMessage(e, 'The rate card could not be reset.')
    dirty.value = false
  } finally {
    loading.value = false
  }
}

async function publish() {
  if (saving.value) return
  saving.value = true
  saveError.value = ''
  try {
    const saved = await api<RateCardSetup>(API.rateCard.setup, {
      method: 'PATCH',
      body: {
        paper_rows: paperRows.value,
        finishing_rows: finishRows.value,
        shop_details: shopDetails.value,
      },
    })
    applyPayload(saved)

    let live = Boolean(saved.completed)
    if (ready.value && !live) {
      try {
        const done = await api<{ completed: boolean }>(API.rateCard.complete, { method: 'POST' })
        live = Boolean(done.completed)
      } catch (e) {
        // The draft is saved; only the live flip failed — tell the printer instead of hiding it.
        saveError.value = getApiErrorMessage(e, 'Your rate card was saved, but publishing it live failed. Please try again.')
      }
    }
    completed.value = live
    dirty.value = false
    justSaved.value = !saveError.value
    if (saveTimer) window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      justSaved.value = false
    }, 2600)
  } catch (e) {
    saveError.value = getApiErrorMessage(e, 'Your rate card could not be saved.')
  } finally {
    saving.value = false
  }
}
</script>