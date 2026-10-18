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
        <!-- rate card controls -->
        <div class="mb-4 rounded-2xl border p-3.5 sm:p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex flex-wrap items-end gap-3">
            <label class="min-w-[190px] flex-1">
              <ML>Product</ML>
              <select
                v-model="productKey"
                class="mt-1 w-full rounded-lg border px-2.5 py-2 font-mono2 text-[11px] outline-none"
                :style="{ borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }"
                @change="schedulePreview"
              >
                <option v-for="p in productOptions" :key="p.key" :value="p.key">
                  {{ p.label }} · {{ p.size }}
                </option>
              </select>
            </label>
            <label class="w-[118px]">
              <ML>Quantity</ML>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                step="1"
                class="mt-1 w-full rounded-lg border px-2.5 py-2 font-mono2 text-[12px] font-semibold outline-none"
                :style="{ borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }"
                @change="onQuantityChange"
              >
            </label>
            <div class="w-[126px]">
              <ML>Print, 1 side</ML>
              <RcField
                :value="printingValue('single_print_base')"
                prefix="KSh"
                :width="126"
                row-key="__printing__"
                field="single_print_base"
                :invalid="Boolean(printingError('single_print_base'))"
                :error="printingError('single_print_base')"
                @change="(v) => setGlobalPrint('single_print_base', v)"
              />
            </div>
            <div class="w-[126px]">
              <ML>Print, 2 sides</ML>
              <RcField
                :value="printingValue('double_print_base')"
                prefix="KSh"
                :width="126"
                row-key="__printing__"
                field="double_print_base"
                placeholder="2 × one side"
                :invalid="Boolean(printingError('double_print_base'))"
                :error="printingError('double_print_base')"
                @change="(v) => setGlobalPrint('double_print_base', v)"
              />
            </div>
            <div class="w-[126px]">
              <ML>Heavy surcharge</ML>
              <RcField
                :value="printingValue('heavy_paper_surcharge')"
                prefix="KSh"
                :width="126"
                row-key="__printing__"
                field="heavy_paper_surcharge"
                :invalid="Boolean(printingError('heavy_paper_surcharge'))"
                :error="printingError('heavy_paper_surcharge')"
                @change="(v) => setGlobalPrint('heavy_paper_surcharge', v)"
              />
            </div>
            <div class="w-[126px]">
              <ML>Surcharge from</ML>
              <div class="mt-1 inline-flex items-center gap-1 rounded-lg border px-2 py-1.5" :style="{ width: '126px', borderColor: printingError('surcharge_threshold_gsm') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }">
                <input
                  :value="printingValue('surcharge_threshold_gsm')"
                  type="text"
                  inputmode="numeric"
                  data-row="__printing__"
                  data-field="surcharge_threshold_gsm"
                  class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                  @change="setSurchargeThreshold(($event.target as HTMLInputElement).value)"
                >
                <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">gsm</span>
              </div>
              <span v-if="printingError('surcharge_threshold_gsm')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
                {{ printingError('surcharge_threshold_gsm') }}
              </span>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">Finishing included</span>
            <button
              v-for="f in activeFinishRows"
              :key="f.key"
              type="button"
              class="press-key rounded-full border px-2.5 py-1 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.08em]"
              :style="selectedFinishingKeys.includes(f.key)
                ? { borderColor: 'var(--accent)', background: 'var(--accent)', color: 'var(--accentInk)' }
                : { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--sub)' }"
              @click="toggleFinishing(f.key)"
            >
              {{ f.label }}
            </button>
            <span v-if="!activeFinishRows.length" class="text-[11px] text-[var(--sub)]">No active finishing services</span>
            <span class="ml-auto font-mono2 text-[10px] uppercase tracking-[0.1em] text-[var(--sub)]">
              {{ activeFinishRows.length ? formatMoney(selectedFinishingTotal) + ' finishing' : '' }}
            </span>
          </div>

          <div v-if="previewing" class="mt-2 flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
            <Loader2 :size="11" class="animate-spin" /> Recalculating from the backend…
          </div>
          <div v-if="previewError" class="mt-2 text-[11.5px] leading-snug" style="color: #C81E44">{{ previewError }}</div>
          <div v-else-if="previewWarnings.length" class="mt-2 text-[11px] leading-snug text-[var(--sub)]">{{ previewWarnings[0] }}</div>
        </div>

        <!-- PAPER / PRINTING TABLE -->
        <div v-if="tab === 'paper' || tab === 'printing'" class="space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 class="font-disp text-[18px] font-bold tracking-tight">
                {{ tab === 'paper' ? 'Paper stock' : 'Printing rates' }}
              </h2>
              <p class="mt-0.5 text-[12px] text-[var(--sub)]">
                Orange inputs are editable. Blue calculated values come from the backend using imposition, waste caps and the selected finishing.
              </p>
            </div>
            <div class="font-mono2 text-[10px] uppercase tracking-[0.1em] text-[var(--sub)]">
              {{ tablePreview?.billable_sheets ?? '—' }} billable · {{ tablePreview?.good_sheets ?? '—' }} good sheets
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="overflow-x-auto">
              <div class="min-w-[1160px]">
                <div class="grid grid-cols-[minmax(170px,1.4fr)_54px_112px_96px_96px_96px_110px_130px_130px_110px_110px_60px] items-center gap-2 border-b px-3 py-2.5 font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
                  <span>Stock</span>
                  <span>GSM</span>
                  <span>Paper / sheet</span>
                  <span class="text-right">Print 1s</span>
                  <span class="text-right">Print 2s</span>
                  <span class="text-right">Surcharge</span>
                  <span class="text-right">Finishing</span>
                  <span class="text-right">Qty total 1s</span>
                  <span class="text-right">Qty total 2s</span>
                  <span class="text-right">Unit 1s</span>
                  <span class="text-right">Unit 2s</span>
                  <span class="text-center">On</span>
                </div>

                <div
                  v-for="row in paperRows"
                  :key="row.key"
                  class="grid grid-cols-[minmax(170px,1.4fr)_54px_112px_96px_96px_96px_110px_130px_130px_110px_110px_60px] items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
                  :style="{
                    borderColor: 'var(--line)',
                    background: dirtyRows.includes(row.key) ? 'rgba(245,166,35,.07)' : 'transparent',
                    opacity: row.active ? 1 : 0.45,
                  }"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 text-[12.5px] font-semibold">
                      <span class="truncate">{{ row.label }}</span>
                      <span v-if="dirtyRows.includes(row.key)" class="h-1.5 w-1.5 shrink-0 rounded-full" style="background: #B45309" title="Unsaved row" />
                    </div>
                    <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.size }} · {{ row.paper_type }}</div>
                  </div>
                  <span class="font-mono2 text-[12px] font-semibold">{{ row.gsm }}g</span>
                  <RcField
                    :value="row.paper_base_price"
                    prefix="KSh"
                    :width="112"
                    :row-key="row.key"
                    field="paper_base_price"
                    :invalid="Boolean(fieldError(`${row.key}:paper_base_price`))"
                    :error="fieldError(`${row.key}:paper_base_price`)"
                    @change="(v) => setNum(paperRows, row, 'paper_base_price', v)"
                    @enter="focusNext(paperRows, row.key, 'paper_base_price')"
                  />
                  <span class="text-right font-mono2 text-[11.5px]">{{ formatMoney(previewRow(row.key)?.single.printing) }}</span>
                  <span class="text-right font-mono2 text-[11.5px]">
                    <template v-if="previewRow(row.key)?.double">{{ formatMoney(previewRow(row.key)?.double?.printing) }}</template>
                    <template v-else>N/A</template>
                  </span>
                  <span class="text-right font-mono2 text-[11.5px]" :title="`Applied at ${row.surcharge_threshold_gsm}gsm and above`">
                    <template v-if="previewRow(row.key)?.surcharge_applies">{{ formatMoney(previewRow(row.key)?.single.surcharge) }}</template>
                    <template v-else>—</template>
                  </span>
                  <span class="text-right font-mono2 text-[11.5px]">
                    <template v-if="selectedFinishingKeys.length">{{ formatMoney(previewRow(row.key)?.single.finishing) }}</template>
                    <template v-else>—</template>
                  </span>
                  <span class="text-right font-mono2 text-[11.5px] font-bold">{{ formatMoney(previewRow(row.key)?.single.total) }}</span>
                  <span class="text-right font-mono2 text-[11.5px] font-bold">
                    <template v-if="previewRow(row.key)?.double">{{ formatMoney(previewRow(row.key)?.double?.total) }}</template>
                    <template v-else>N/A</template>
                  </span>
                  <span class="text-right font-mono2 text-[11px]">{{ formatMoney(previewRow(row.key)?.single.unit) }}</span>
                  <span class="text-right font-mono2 text-[11px]">
                    <template v-if="previewRow(row.key)?.double">{{ formatMoney(previewRow(row.key)?.double?.unit) }}</template>
                    <template v-else>N/A</template>
                  </span>
                  <div class="flex justify-center">
                    <RcToggle :on="row.active" @change="(b) => setBool(paperRows, row, 'active', b)" />
                  </div>
                </div>
                <div v-if="!paperRows.length" class="px-4 py-10 text-center text-[12.5px] text-[var(--sub)]">
                  No paper stock yet. Add stock in shop setup, then set its paper cost here.
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5 rounded-xl p-3.5" :style="{ background: 'var(--panel2)' }">
            <Sparkles :size="14" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              Paper and printing bill on the capped billable sheet count; finishing bills on good sheets. A dash means the service is not included; N/A means that side or stock is not available. Prices are calculated server-side.
            </p>
          </div>
        </div>

        <!-- FINISHING -->
        <div v-else-if="tab === 'finishing'" class="space-y-4">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Finishing services</h2>
            <p class="mt-0.5 text-[12px] text-[var(--sub)]">
              How each service bills and its rate. The charge shown uses the selected quantity and the backend minimum-charge rule.
            </p>
          </div>

          <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="overflow-x-auto">
              <div class="min-w-[840px]">
                <div class="grid grid-cols-[minmax(190px,1fr)_110px_126px_126px_150px_60px] items-center gap-2 border-b px-3 py-2.5 font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
                  <span>Service</span>
                  <span>Bills</span>
                  <span>Rate</span>
                  <span>Minimum</span>
                  <span class="text-right">At {{ quantity }} pcs</span>
                  <span class="text-center">On</span>
                </div>
                <div
                  v-for="row in finishRows"
                  :key="row.key"
                  class="grid grid-cols-[minmax(190px,1fr)_110px_126px_126px_150px_60px] items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
                  :style="{
                    borderColor: 'var(--line)',
                    background: dirtyRows.includes(row.key) ? 'rgba(245,166,35,.07)' : 'transparent',
                    opacity: row.active ? 1 : 0.45,
                  }"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 text-[12.5px] font-semibold">
                      <span class="truncate">{{ row.label }}</span>
                      <span v-if="dirtyRows.includes(row.key)" class="h-1.5 w-1.5 shrink-0 rounded-full" style="background: #B45309" title="Unsaved row" />
                    </div>
                    <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.unit }}</div>
                  </div>
                  <span class="rounded-lg px-2 py-1 text-center font-mono2 text-[10px] uppercase tracking-[0.08em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">
                    {{ basisLabel(row) }}
                  </span>
                  <RcField
                    :value="row.price"
                    prefix="KSh"
                    :width="126"
                    :row-key="row.key"
                    field="price"
                    :invalid="Boolean(fieldError(`${row.key}:price`))"
                    :error="fieldError(`${row.key}:price`)"
                    @change="(v) => setNum(finishRows, row, 'price', v)"
                    @enter="focusNext(finishRows, row.key, 'price')"
                  />
                  <RcField
                    :value="row.minimum_charge"
                    prefix="KSh"
                    :width="126"
                    :row-key="row.key"
                    field="minimum_charge"
                    placeholder="none"
                    :invalid="Boolean(fieldError(`${row.key}:minimum_charge`))"
                    :error="fieldError(`${row.key}:minimum_charge`)"
                    @change="(v) => setNum(finishRows, row, 'minimum_charge', v)"
                    @enter="focusNext(finishRows, row.key, 'minimum_charge')"
                  />
                  <div class="text-right">
                    <div class="font-mono2 text-[12px] font-bold">{{ formatMoney(finishingPreview(row.key)?.final_total) }}</div>
                    <div v-if="finishingPreview(row.key)?.minimum_applied" class="text-[9.5px] text-[var(--sub)]">minimum applied</div>
                    <div v-else-if="finishingPreview(row.key)" class="text-[9.5px] text-[var(--sub)]">{{ finishingPreview(row.key)?.quantity_basis }}</div>
                  </div>
                  <div class="flex justify-center">
                    <RcToggle :on="row.active" @change="(b) => setBool(finishRows, row, 'active', b)" />
                  </div>
                </div>
                <div v-if="!finishRows.length" class="px-4 py-10 text-center text-[12.5px] text-[var(--sub)]">
                  No finishing services yet. Add them in shop setup, then set their rates here.
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2.5 rounded-xl p-3.5" :style="{ background: 'var(--panel2)' }">
            <Scissors :size="14" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
              Minimum charge applies only when the calculated charge is below it. Flat services charge once when selected.
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

      <!-- ── production preview rail ── -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="overflow-hidden rounded-3xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="relative overflow-hidden p-5" :style="{ background: 'color-mix(in srgb, var(--accent) 9%, transparent)' }">
            <ML>Your production cost</ML>
            <div class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
              {{ tablePreview?.product.label ?? 'Choose a product' }} · {{ quantity }} pcs
            </div>
            <template v-if="lowestActivePreview">
              <div class="mt-2.5 font-disp text-[30px] font-bold leading-none tracking-tight" style="color: var(--accent)">
                {{ formatMoney(lowestActivePreview.single.total) }}
              </div>
              <div class="mt-1.5 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
                single-sided · {{ formatMoney(lowestActivePreview.single.unit) }} each
              </div>
              <div v-if="lowestActivePreview.double" class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
                double-sided · {{ formatMoney(lowestActivePreview.double.total) }} · {{ formatMoney(lowestActivePreview.double.unit) }} each
              </div>
            </template>
            <div v-else class="mt-3 text-[12px] text-[var(--sub)]">
              Activate a stock to preview production cost.
            </div>
          </div>

          <div class="space-y-2 p-5">
            <div class="flex items-center justify-between text-[11.5px] text-[var(--sub)]">
              <span>Billable sheets</span>
              <span class="font-mono2">{{ tablePreview?.billable_sheets ?? '—' }} ({{ tablePreview?.good_sheets ?? '—' }} good)</span>
            </div>
            <div class="flex items-center justify-between text-[11.5px] text-[var(--sub)]">
              <span>Spoilage added</span>
              <span class="font-mono2">{{ tablePreview?.waste_sheets_added ?? '—' }} sheets</span>
            </div>
            <div class="flex items-center justify-between text-[11.5px] text-[var(--sub)]">
              <span>Finishing included</span>
              <span class="font-mono2">{{ formatMoney(selectedFinishingTotal) }}</span>
            </div>

            <div v-if="tablePreview?.finishings.filter((f) => f.selected).length" class="my-2 border-t" :style="{ borderColor: 'var(--line)' }" />
            <div
              v-for="item in tablePreview?.finishings.filter((f) => f.selected) ?? []"
              :key="item.key"
              class="flex items-start justify-between gap-3"
            >
              <div>
                <div class="text-[11.5px] font-medium">{{ item.label }}</div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
                  {{ item.quantity_basis }}{{ item.minimum_applied ? ' · minimum applied' : '' }}
                </div>
              </div>
              <span class="font-mono2 text-[11px]">{{ formatMoney(item.final_total) }}</span>
            </div>

            <div class="mt-3 flex items-start gap-2 rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <TrendingUp :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" />
              <p class="text-[11px] leading-relaxed text-[var(--sub)]">
                Calculated from this rate card, imposition and the capped billable-sheet policy. Buyer totals and manager margin are not part of the printer view.
              </p>
            </div>
            <div v-if="tablePreview?.spoilage_capped" class="rounded-lg px-2.5 py-2 text-[10.5px] leading-snug" style="background: rgba(245,166,35,.12); color: #B45309">
              Spoilage hit the configured cap; the billable count is capped.
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
              Raise all paper 5%
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
      <div class="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
        <template v-if="justSaved">
          <span class="inline-flex items-center gap-2 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" style="color: #0E7A45">
            <Check :size="15" /> {{ completed ? 'Rate card saved — live on the marketplace' : 'Rate card saved as a draft' }}
          </span>
        </template>
        <template v-else>
          <AlertTriangle :size="15" style="color: #B45309" class="shrink-0" />
          <span class="min-w-[200px] flex-1 text-[12.5px] text-[var(--sub)]">
            {{ saveError || `${dirtyRowCount} ${dirtyRowCount === 1 ? 'row has' : 'rows have'} unsaved edits. Quotes still use your last saved prices.` }}
          </span>
          <button
            v-if="conflictVersion"
            @click="reloadLatest"
            class="press-key inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em]"
            :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }"
          >
            <RefreshCw :size="13" /> Reload latest
          </button>
          <button
            v-if="dirty"
            @click="discardChanges"
            class="press-key inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em]"
            :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
          >
            Discard
          </button>
          <button
            @click="publish"
            :disabled="!canSave"
            class="press-key inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-60"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          >
            <Loader2 v-if="saving" :size="14" class="animate-spin" />
            <Save v-else :size="14" />
            {{ saving ? 'Saving…' : completed ? 'Save changes' : 'Save & publish' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  AlertTriangle, ArrowLeft, BadgeCheck, Check, Coins, Copy, Layers, Loader2,
  Package, Printer as PrinterIcon, RefreshCw, Save, Scissors, Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { ksh2 } from '~/shared/workflow/pricing'

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
  client_price?: string | null
  estimated_total?: string | null
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

interface PreviewSide {
  paper: string
  printing: string
  surcharge: string
  finishing: string
  total: string
  unit: string
  per_sheet: string
  sheets: number
}

interface PreviewRow {
  key: string
  label: string
  gsm: number
  size: string
  active: boolean
  surcharge_applies: boolean
  single: PreviewSide
  double: PreviewSide | null
}

interface PreviewFinishing {
  key: string
  label: string
  selected: boolean
  rate: string
  quantity_basis: string
  raw_total: string
  minimum_applied: boolean
  final_total: string
  final_total_with_minimum?: string
}

interface TableProductOption {
  key: string
  label: string
  size: string
  min_qty: number
}

interface TablePreview {
  currency: string
  quantity: number
  product: TableProductOption
  product_options: TableProductOption[]
  finishing_keys: string[]
  finishings: PreviewFinishing[]
  copies_per_sheet: number
  good_sheets: number
  billable_sheets: number
  waste_sheets_added: number
  max_billable_sheets: number
  spoilage_capped: boolean
  rows: PreviewRow[]
  warnings: string[]
}

interface RateCardSetup {
  paper_rows: PaperRow[]
  finishing_rows: FinishingRow[]
  shop_details: ShopDetails
  summary: Summary
  example_quote: ExampleQuote
  table_preview?: TablePreview
  market_label?: string
  completed: boolean
  version?: string
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
const version = ref('0')

const tablePreview = ref<TablePreview | null>(null)
const previewing = ref(false)
const previewError = ref('')
const quantity = ref(100)
const productKey = ref('business-cards')
const selectedFinishingKeys = ref<string[]>([])

const dirty = ref(false)
const dirtyRows = ref<string[]>([])
const fieldErrors = ref<Record<string, string>>({})
const justSaved = ref(false)
const saving = ref(false)
const saveError = ref('')
const conflictVersion = ref('')
let saveTimer: number | null = null
let previewTimer: number | null = null

const shopName = computed(() => shopDetails.value.shop_name.trim() || 'Your shop')

function toNum(v: string | number | null | undefined): number {
  if (v == null || v === '') return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

interface RateCardBaseline {
  paperRows: PaperRow[]
  finishingRows: FinishingRow[]
  shopDetails: ShopDetails
  version: string
}

const baseline = ref<RateCardBaseline | null>(null)

function snapshot(): RateCardBaseline {
  return clone({
    paperRows: paperRows.value,
    finishingRows: finishRows.value,
    shopDetails: shopDetails.value,
    version: version.value,
  })
}

function applyPayload(payload: RateCardSetup, options: { syncPreview?: boolean } = {}) {
  paperRows.value = payload.paper_rows ?? []
  finishRows.value = payload.finishing_rows ?? []
  shopDetails.value = payload.shop_details ?? { shop_name: '', whatsapp_number: '', location_area: '' }
  summary.value = payload.summary ?? null
  exampleQuote.value = payload.example_quote ?? null
  marketGuides.value = payload.market_guides ?? {}
  pricingSettings.value = payload.pricing_settings ?? pricingSettings.value
  completed.value = Boolean(payload.completed)
  version.value = payload.version ?? '0'
  if (options.syncPreview && payload.table_preview) {
    tablePreview.value = payload.table_preview
    quantity.value = payload.table_preview.quantity
    productKey.value = payload.table_preview.product.key
    selectedFinishingKeys.value = [...payload.table_preview.finishing_keys]
  }
}

function resetEditingState() {
  dirty.value = false
  dirtyRows.value = []
  fieldErrors.value = {}
  previewError.value = ''
  saveError.value = ''
  conflictVersion.value = ''
}

async function load() {
  loading.value = true
  errorText.value = ''
  noShop.value = false
  try {
    const payload = await api<RateCardSetup>(API.rateCard.setup)
    applyPayload(payload, { syncPreview: true })
    baseline.value = snapshot()
    resetEditingState()
  } catch (e) {
    const msg = getApiErrorMessage(e, 'Your rate card could not be loaded.')
    errorText.value = msg
    noShop.value = msg.includes('Complete shop setup before setting your rate card')
  } finally {
    loading.value = false
  }
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  load()
})

onBeforeUnmount(() => {
  if (saveTimer) window.clearTimeout(saveTimer)
  if (previewTimer) window.clearTimeout(previewTimer)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave(() => {
  if (!dirty.value) return true
  return window.confirm('You have unsaved price changes. Leave this page and discard them?')
})

function markDirtyRow(key: string) {
  if (!dirtyRows.value.includes(key)) {
    dirtyRows.value = [...dirtyRows.value, key]
  }
}

function touch(key?: string) {
  dirty.value = true
  justSaved.value = false
  saveError.value = ''
  conflictVersion.value = ''
  if (key) markDirtyRow(key)
}

function setError(key: string, message: string) {
  fieldErrors.value = { ...fieldErrors.value, [key]: message }
  previewError.value = 'Fix the highlighted cells to recalculate.'
}

function clearError(key: string) {
  if (!(key in fieldErrors.value)) return
  const next = { ...fieldErrors.value }
  delete next[key]
  fieldErrors.value = next
  if (Object.keys(next).length === 0) previewError.value = ''
}

function fieldError(key: string): string {
  return fieldErrors.value[key] || ''
}

function parseMoney(raw: string, allowEmpty = false): { value: string | null, error: string | null } {
  const text = String(raw ?? '')
    .trim()
    .replace(/^KSh\s*/i, '')
    .replace(/,/g, '')
  if (text === '') {
    return allowEmpty ? { value: null, error: null } : { value: null, error: 'Enter a price.' }
  }
  if (text.startsWith('-')) return { value: null, error: 'Price cannot be negative.' }
  if (!/^\d+(\.\d{0,2})?$/.test(text)) return { value: null, error: 'Use numbers only, e.g. 15.00.' }
  const amount = Number(text)
  if (!Number.isFinite(amount)) return { value: null, error: 'Enter a valid price.' }
  return { value: amount.toFixed(2), error: null }
}

function parseThreshold(raw: string): { value: number | null, error: string | null } {
  const text = String(raw ?? '').trim()
  if (!/^\d+$/.test(text)) return { value: null, error: 'Use a whole GSM value, e.g. 250.' }
  const gsm = Number(text)
  if (!Number.isFinite(gsm) || gsm < 1) return { value: null, error: 'GSM must be at least 1.' }
  return { value: gsm, error: null }
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
  const key = `${row.key}:${String(field)}`
  const parsed = parseMoney(raw, field === 'minimum_charge')
  if (parsed.error) {
    setError(key, parsed.error)
    return
  }
  clearError(key)
  if ((target[field] ?? null) !== parsed.value) {
    ;(target as Record<string, unknown>)[field as string] = parsed.value
    touch(row.key)
    schedulePreview()
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
  touch(row.key)
  schedulePreview()
}

const activeFinishRows = computed(() => finishRows.value.filter((row) => row.active))

function primaryPaperRow(): PaperRow | undefined {
  return paperRows.value.find((row) => row.active) ?? paperRows.value[0]
}

function printingValue(field: 'single_print_base' | 'double_print_base' | 'heavy_paper_surcharge' | 'surcharge_threshold_gsm'): string {
  const row = primaryPaperRow()
  if (!row) return ''
  const value = row[field]
  return value == null ? '' : String(value)
}

function printingError(field: string): string {
  return fieldError(`__printing__:${field}`)
}

function setGlobalPrint(field: 'single_print_base' | 'double_print_base' | 'heavy_paper_surcharge', raw: string) {
  const key = `__printing__:${field}`
  const parsed = parseMoney(raw, field === 'double_print_base')
  if (parsed.error) {
    setError(key, parsed.error)
    return
  }
  clearError(key)
  let changed = false
  paperRows.value = paperRows.value.map((row) => {
    if ((row[field] ?? null) !== parsed.value) changed = true
    return { ...row, [field]: parsed.value }
  })
  if (changed) {
    paperRows.value.forEach((row) => markDirtyRow(row.key))
    touch()
    schedulePreview()
  }
}

function setSurchargeThreshold(raw: string) {
  const key = '__printing__:surcharge_threshold_gsm'
  const parsed = parseThreshold(raw)
  if (parsed.error) {
    setError(key, parsed.error)
    return
  }
  clearError(key)
  let changed = false
  paperRows.value = paperRows.value.map((row) => {
    if (row.surcharge_threshold_gsm !== parsed.value) changed = true
    return { ...row, surcharge_threshold_gsm: parsed.value as number }
  })
  if (changed) {
    paperRows.value.forEach((row) => markDirtyRow(row.key))
    touch()
    schedulePreview()
  }
}

function previewRow(key: string): PreviewRow | undefined {
  return tablePreview.value?.rows.find((row) => row.key === key)
}

function finishingPreview(key: string): PreviewFinishing | undefined {
  return tablePreview.value?.finishings.find((row) => row.key === key)
}

function formatMoney(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  return Number.isFinite(amount) ? ksh2(amount) : '—'
}

function formatOrNa(value: string | number | null | undefined): string {
  return value == null || value === '' ? 'N/A' : formatMoney(value)
}

const selectedFinishingTotal = computed(() => {
  const selected = tablePreview.value?.finishings.filter((row) => row.selected) ?? []
  return selected.reduce((total, row) => total + toNum(row.final_total), 0)
})

const previewWarnings = computed(() => tablePreview.value?.warnings ?? [])

const lowestActivePreview = computed<PreviewRow | undefined>(() => {
  const active = tablePreview.value?.rows.filter((row) => row.active) ?? []
  return [...active].sort((a, b) => toNum(a.single.total) - toNum(b.single.total))[0]
})

function schedulePreview() {
  if (previewTimer) window.clearTimeout(previewTimer)
  if (Object.keys(fieldErrors.value).length > 0) {
    previewError.value = 'Fix the highlighted cells to recalculate.'
    return
  }
  previewTimer = window.setTimeout(() => {
    void refreshPreview()
  }, 300)
}

async function refreshPreview() {
  if (Object.keys(fieldErrors.value).length > 0) return
  previewing.value = true
  previewError.value = ''
  try {
    tablePreview.value = await api<TablePreview>(API.rateCard.preview, {
      method: 'POST',
      body: {
        paper_rows: paperRows.value,
        finishing_rows: finishRows.value,
        quantity: Math.max(1, Math.round(Number(quantity.value) || 1)),
        product_key: productKey.value,
        finishing_keys: selectedFinishingKeys.value,
      },
    })
  } catch (e) {
    previewError.value = getApiErrorMessage(e, 'Totals could not be recalculated. Your edits are still here.')
  } finally {
    previewing.value = false
  }
}

function onQuantityChange() {
  quantity.value = Math.max(1, Math.round(Number(quantity.value) || 1))
  schedulePreview()
}

function toggleFinishing(key: string) {
  selectedFinishingKeys.value = selectedFinishingKeys.value.includes(key)
    ? selectedFinishingKeys.value.filter((item) => item !== key)
    : [...selectedFinishingKeys.value, key]
  schedulePreview()
}

function focusNext(rows: { key: string }[], rowKey: string, field: string) {
  const index = rows.findIndex((row) => row.key === rowKey)
  const next = rows[index + 1]
  if (!next) return
  const input = document.querySelector<HTMLInputElement>(`input[data-row="${next.key}"][data-field="${field}"]`)
  input?.focus()
  input?.select()
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

const hasFieldErrors = computed(() => Object.keys(fieldErrors.value).length > 0)
const canSave = computed(() => dirty.value && !saving.value && !hasFieldErrors.value)
const dirtyRowCount = computed(() => dirtyRows.value.length)
const productOptions = computed<TableProductOption[]>(() => tablePreview.value?.product_options ?? [
  { key: 'business-cards', label: 'Business Cards', size: '90×55mm', min_qty: 100 },
])

function raisePaperFive() {
  paperRows.value = paperRows.value.map((row) => ({
    ...row,
    paper_base_price: (Math.round(toNum(row.paper_base_price) * 1.05 * 100) / 100).toFixed(2),
  }))
  paperRows.value.forEach((row) => markDirtyRow(row.key))
  touch()
  schedulePreview()
}

async function resetToDefaults() {
  loading.value = true
  errorText.value = ''
  try {
    const payload = await api<RateCardSetup>(API.rateCard.setup)
    applyPayload(payload, { syncPreview: true })
    baseline.value = snapshot()
    resetEditingState()
  } catch (e) {
    errorText.value = getApiErrorMessage(e, 'The rate card could not be reset.')
    resetEditingState()
  } finally {
    loading.value = false
  }
}

function discardChanges() {
  if (!baseline.value) return
  paperRows.value = clone(baseline.value.paperRows)
  finishRows.value = clone(baseline.value.finishingRows)
  shopDetails.value = clone(baseline.value.shopDetails)
  version.value = baseline.value.version
  resetEditingState()
  justSaved.value = false
  void refreshPreview()
}

async function reloadLatest() {
  if (dirty.value && !window.confirm('Reload the latest saved rate card and discard your unsaved edits?')) return
  await load()
}

async function publish() {
  if (saving.value) return
  if (hasFieldErrors.value) {
    previewError.value = 'Fix the highlighted cells before saving.'
    return
  }
  saving.value = true
  saveError.value = ''
  conflictVersion.value = ''
  try {
    const saved = await api<RateCardSetup>(API.rateCard.setup, {
      method: 'PATCH',
      body: {
        paper_rows: paperRows.value,
        finishing_rows: finishRows.value,
        shop_details: shopDetails.value,
        expected_version: version.value,
      },
    })
    applyPayload(saved)

    let live = Boolean(saved.completed)
    if (ready.value && !live) {
      try {
        const done = await api<{ completed: boolean, version?: string }>(API.rateCard.complete, { method: 'POST' })
        live = Boolean(done.completed)
        if (done.version) version.value = done.version
      } catch (e) {
        // The draft is saved; only the live flip failed — tell the printer instead of hiding it.
        saveError.value = getApiErrorMessage(e, 'Your rate card was saved, but publishing it live failed. Please try again.')
      }
    }
    completed.value = live
    const publishError = saveError.value
    baseline.value = snapshot()
    resetEditingState()
    if (publishError) saveError.value = publishError
    await refreshPreview()
    justSaved.value = !saveError.value
    if (saveTimer) window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      justSaved.value = false
    }, 2600)
  } catch (e) {
    const data = (e as { data?: { code?: string, version?: string } }).data
    if (data?.code === 'rate_card_version_conflict') {
      conflictVersion.value = data.version ?? ''
      saveError.value = 'Another tab or person saved this rate card after you loaded it. Reload the latest version before saving; your edits are still here.'
    } else {
      saveError.value = getApiErrorMessage(e, 'Your rate card could not be saved. Your edits are still here.')
    }
  } finally {
    saving.value = false
  }
}
</script>