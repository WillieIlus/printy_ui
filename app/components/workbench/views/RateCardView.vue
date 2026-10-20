<template>
  <div class="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-8 sm:px-6">
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
          Type a price in the master panel and every row updates. Adjust any cell, then save once —
          these rates are exactly what your quotes charge.
        </p>
      </div>

      <!-- status + owner guidance checklist -->
      <div
        class="w-full max-w-[300px] rounded-2xl border p-4"
        :style="{ borderColor: isLive ? '#0E7A45' : 'var(--line)', background: 'var(--panel)' }"
      >
        <div class="flex items-center justify-between">
          <ML>Go live checklist</ML>
          <span class="font-mono2 text-[10px] font-bold" :style="{ color: isLive ? '#0E7A45' : '#B45309' }">
            {{ isLive ? 'Live' : 'Draft' }}
          </span>
        </div>

        <template v-if="setupStatus">
          <div class="mt-1.5 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
            {{ setupStatus.completed_steps }} of {{ setupStatus.total_steps }} steps done
          </div>

          <ul class="mt-3 space-y-2">
            <li
              v-for="step in setupStatus.steps"
              :key="step.code"
              class="flex items-start gap-2 text-[11.5px] leading-snug"
            >
              <component
                :is="step.done ? CheckCircle2 : Circle"
                :size="13"
                class="mt-0.5 shrink-0"
                :style="{ color: step.done ? '#0E7A45' : 'var(--sub)' }"
              />
              <span :style="{ color: step.done ? 'var(--sub)' : 'var(--text)' }">{{ step.title }}</span>
            </li>
          </ul>

          <NuxtLink
            v-if="setupStatus.next_step"
            :to="setupStatus.next_step.route"
            class="mt-2.5 block text-[11.5px] leading-relaxed text-[var(--accent)]"
          >
            Next: {{ setupStatus.next_step.hint }}
          </NuxtLink>
        </template>

        <div
          v-if="dirty"
          class="mt-2.5 flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-mono2 text-[9px] uppercase tracking-[0.12em]"
          :style="{ background: 'rgba(245,166,35,.12)', color: '#B45309' }"
        >
          <AlertTriangle :size="11" /> unsaved edits
        </div>

        <!-- Confirm and go live -->
        <div v-if="!isLive" class="mt-3">
          <button
            @click="confirm"
            :disabled="!setupStatus?.is_ready_to_confirm || confirming"
            class="press-key inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          >
            <Loader2 v-if="confirming" :size="13" class="animate-spin" />
            <Rocket v-else :size="13" />
            {{ confirming ? 'Confirming…' : 'Confirm and go live' }}
          </button>
          <p v-if="!setupStatus?.is_ready_to_confirm" class="mt-2 text-[10.5px] leading-relaxed text-[var(--sub)]">
            Finish every step above to unlock this button.
          </p>
          <p v-if="confirmError" class="mt-2 text-[10.5px] leading-relaxed" style="color: #C81E44">
            {{ confirmError }}
          </p>
        </div>

        <div
          v-else
          class="mt-3 flex items-center gap-2 rounded-lg px-2.5 py-2.5 font-mono2 text-[9px] uppercase tracking-[0.12em]"
          :style="{ background: 'rgba(47,191,113,.12)', color: '#0E7A45' }"
        >
          <BadgeCheck :size="12" /> You are live to managers
        </div>
      </div>
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

    <template v-else>
      <!-- ── 1. MAIN PRICE PANEL (autofocused) ── -->
      <section
        class="mt-7 rounded-2xl border p-4 sm:p-5"
        :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }"
        aria-label="Master prices"
      >
        <div class="flex items-center gap-2">
          <Coins :size="14" style="color: var(--accent)" />
          <span class="font-disp text-[15px] font-bold tracking-tight">Master prices</span>
          <span class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">
            one screen · everything below follows these
          </span>
        </div>
        <div class="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <label class="block">
            <ML>Print, 1 side</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('single_print') ? '#C81E44' : 'var(--accent)', background: 'var(--panel2)' }"
            >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">KSh</span>
              <input
                ref="masterFirstInput"
                :value="masterSettings.single_print"
                type="text"
                inputmode="decimal"
                autofocus
                data-field="master_single_print"
                class="w-full bg-transparent font-mono2 text-[13px] font-bold outline-none"
                @input="setMaster('single_print', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('single_print')"
              >
            </div>
            <span v-if="masterError('single_print')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('single_print') }}
            </span>
          </label>
          <label class="block">
            <ML>Print, 2 sides</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('double_print') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">KSh</span>
              <input
                :value="masterSettings.double_print ?? ''"
                type="text"
                inputmode="decimal"
                placeholder="2 × one side"
                data-field="master_double_print"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none placeholder:opacity-50"
                @input="setMaster('double_print', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('double_print')"
              >
            </div>
            <span v-if="masterError('double_print')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('double_print') }}
            </span>
          </label>
          <label class="block">
            <ML>Heavy surcharge</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('surcharge') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">KSh</span>
              <input
                :value="masterSettings.surcharge"
                type="text"
                inputmode="decimal"
                data-field="master_surcharge"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                @input="setMaster('surcharge', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('surcharge')"
              >
            </div>
            <span v-if="masterError('surcharge')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('surcharge') }}
            </span>
          </label>
          <label class="block">
            <ML>Surcharge from</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('surcharge_threshold_gsm') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <input
                :value="String(masterSettings.surcharge_threshold_gsm)"
                type="text"
                inputmode="numeric"
                data-field="master_surcharge_threshold_gsm"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                @input="setMaster('surcharge_threshold_gsm', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('surcharge_threshold_gsm')"
              >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">gsm</span>
            </div>
            <span v-if="masterError('surcharge_threshold_gsm')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('surcharge_threshold_gsm') }}
            </span>
          </label>
          <label class="block">
            <ML>Gloss, 1 side</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('gloss_first_side') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">KSh</span>
              <input
                :value="masterSettings.gloss_first_side"
                type="text"
                inputmode="decimal"
                data-field="master_gloss_first_side"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                @input="setMaster('gloss_first_side', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('gloss_first_side')"
              >
            </div>
            <span v-if="masterError('gloss_first_side')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('gloss_first_side') }}
            </span>
          </label>
          <label class="block">
            <ML>Matt, 1 side</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('matt_first_side') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <span class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">KSh</span>
              <input
                :value="masterSettings.matt_first_side"
                type="text"
                inputmode="decimal"
                data-field="master_matt_first_side"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                @input="setMaster('matt_first_side', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('matt_first_side')"
              >
            </div>
            <span v-if="masterError('matt_first_side')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('matt_first_side') }}
            </span>
          </label>
          <label class="block">
            <ML>2nd side ×</ML>
            <div
              class="mt-1 inline-flex w-full items-center gap-1 rounded-lg border px-2 py-1.5"
              :style="{ borderColor: masterError('lamination_second_multiplier') ? '#C81E44' : 'var(--line)', background: 'var(--panel2)' }"
            >
              <input
                :value="masterSettings.lamination_second_multiplier"
                type="text"
                inputmode="decimal"
                data-field="master_lamination_second_multiplier"
                class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none"
                @input="setMaster('lamination_second_multiplier', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent="focusMasterNext('lamination_second_multiplier')"
              >
            </div>
            <span v-if="masterError('lamination_second_multiplier')" class="mt-1 block text-[10px] leading-snug" style="color: #C81E44">
              {{ masterError('lamination_second_multiplier') }}
            </span>
          </label>
        </div>
        <div v-if="previewing" class="mt-2.5 flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
          <Loader2 :size="11" class="animate-spin" /> Recalculating from the backend…
        </div>
        <div v-if="previewError" class="mt-2.5 text-[11.5px] leading-snug" style="color: #C81E44">{{ previewError }}</div>
        <div v-else-if="previewWarnings.length" class="mt-2.5 text-[11px] leading-snug text-[var(--sub)]">{{ previewWarnings[0] }}</div>
      </section>

      <!-- ── 2. PAPER & PRINTING TABLE ── -->
      <section class="mt-6 space-y-3" aria-label="Paper and printing table">
        <div class="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Paper &amp; printing</h2>
            <p class="mt-0.5 max-w-[70ch] text-[12px] leading-relaxed text-[var(--sub)]">
              Every column comes from the backend resolver — the same numbers your quotes charge.
              Override cells are optional per-row pins; leave them blank to follow the master prices.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <label class="w-[160px]">
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
            <label class="w-[100px]">
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
            <button
              v-if="anyOverrides"
              @click="resetAllOverrides"
              class="press-key mt-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.1em]"
              :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }"
            >
              <RotateCcw :size="11" /> Reset all overrides
            </button>
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="overflow-x-auto">
            <div class="min-w-[1220px]">
              <div
                class="grid grid-cols-[minmax(160px,1.3fr)_48px_104px_92px_92px_88px_96px_96px_56px_268px_52px] items-center gap-2 border-b px-3 py-2.5 font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]"
                :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }"
              >
                <span>Stock</span>
                <span>GSM</span>
                <span>Paper cost</span>
                <span class="text-right">Print alone 1s</span>
                <span class="text-right">Print alone 2s</span>
                <span class="text-right">Surcharge</span>
                <span class="text-right">Total 1s</span>
                <span class="text-right">Total 2s</span>
                <span class="text-center">2-side</span>
                <span class="pl-1">Overrides (blank = master)</span>
                <span class="text-center">On</span>
              </div>

              <div
                v-for="row in paperRows"
                :key="row.key"
                class="grid grid-cols-[minmax(160px,1.3fr)_48px_104px_92px_92px_88px_96px_96px_56px_268px_52px] items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
                :style="{
                  borderColor: 'var(--line)',
                  background: rowOverridden(row) ? 'rgba(245,166,35,.06)' : 'transparent',
                  opacity: row.active ? 1 : 0.45,
                }"
                :data-row-id="row.key"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 text-[12.5px] font-semibold">
                    <span class="truncate">{{ row.label }}</span>
                    <span
                      v-if="rowOverridden(row)"
                      class="rounded-full px-1.5 py-[1px] font-mono2 text-[8px] uppercase tracking-[0.1em]"
                      :style="{ background: 'rgba(245,166,35,.16)', color: '#B45309' }"
                    >override</span>
                  </div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ row.size }} · {{ row.paper_type }}</div>
                </div>
                <span class="font-mono2 text-[12px] font-semibold">{{ row.gsm }}g</span>
                <RcField
                  :value="row.paper_base_price"
                  prefix="KSh"
                  :width="104"
                  :row-key="row.key"
                  field="paper_base_price"
                  :invalid="Boolean(fieldError(`${row.key}:paper_base_price`))"
                  :error="fieldError(`${row.key}:paper_base_price`)"
                  @change="(v) => setNum(paperRows, row, 'paper_base_price', v)"
                  @enter="focusNext(paperRows, row.key, 'paper_base_price')"
                />
                <span class="text-right font-mono2 text-[11.5px]">{{ formatMoney(previewRow(row.key)?.printing_alone_one_side) }}</span>
                <span class="text-right font-mono2 text-[11.5px]">
                  <template v-if="previewRow(row.key)?.double_sided_available">{{ formatMoney(previewRow(row.key)?.printing_alone_both_sides) }}</template>
                  <template v-else>N/A</template>
                </span>
                <span class="text-right font-mono2 text-[11.5px]">
                  <template v-if="previewRow(row.key)?.surcharge_applies">{{ formatMoney(previewRow(row.key)?.surcharge_rate) }}</template>
                  <template v-else>—</template>
                </span>
                <span class="text-right font-mono2 text-[12px] font-bold">{{ formatMoney(previewRow(row.key)?.total_one_side) }}</span>
                <span class="text-right font-mono2 text-[12px] font-bold">
                  <template v-if="previewRow(row.key)?.double_sided_available">{{ formatMoney(previewRow(row.key)?.total_both_sides) }}</template>
                  <template v-else>N/A</template>
                </span>
                <div class="flex justify-center">
                  <RcToggle
                    :on="row.double_sided_enabled"
                    @change="(b) => setDoubleSided(row, b)"
                  />
                </div>
                <div class="flex items-center gap-1">
                  <RcField
                    :value="row.override_single_print"
                    prefix="1s"
                    :width="76"
                    :row-key="row.key"
                    field="override_single_print"
                    placeholder="master"
                    :invalid="Boolean(fieldError(`${row.key}:override_single_print`))"
                    :error="fieldError(`${row.key}:override_single_print`)"
                    @change="(v) => setOverride(row, 'override_single_print', v)"
                  />
                  <RcField
                    :value="row.override_double_print"
                    prefix="2s"
                    :width="76"
                    :row-key="row.key"
                    field="override_double_print"
                    placeholder="master"
                    :invalid="Boolean(fieldError(`${row.key}:override_double_print`))"
                    :error="fieldError(`${row.key}:override_double_print`)"
                    @change="(v) => setOverride(row, 'override_double_print', v)"
                  />
                  <RcField
                    :value="row.override_surcharge"
                    prefix="Sch"
                    :width="76"
                    :row-key="row.key"
                    field="override_surcharge"
                    placeholder="master"
                    :invalid="Boolean(fieldError(`${row.key}:override_surcharge`))"
                    :error="fieldError(`${row.key}:override_surcharge`)"
                    @change="(v) => setOverride(row, 'override_surcharge', v)"
                  />
                  <button
                    v-if="rowOverridden(row)"
                    class="press-key flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    :style="{ border: '1px solid var(--line)', color: 'var(--sub)' }"
                    :title="`Reset ${row.label} overrides`"
                    :data-reset-row="row.key"
                    @click="resetRowOverrides(row)"
                  >
                    <RotateCcw :size="11" />
                  </button>
                </div>
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
      </section>

      <!-- ── 3. FINISHING TABLE ── -->
      <section class="mt-6 space-y-3" aria-label="Finishing table">
        <div class="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">Finishing</h2>
            <p class="mt-0.5 max-w-[70ch] text-[12px] leading-relaxed text-[var(--sub)]">
              Lamination rates follow the master panel; every other rate is yours. The charge column
              uses the selected quantity and the backend minimum-charge rule.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono2 text-[10px] uppercase tracking-[0.1em] text-[var(--sub)]">Included</span>
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
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="overflow-x-auto">
            <div class="min-w-[860px]">
              <div class="grid grid-cols-[minmax(190px,1fr)_110px_126px_126px_150px_44px_52px] items-center gap-2 border-b px-3 py-2.5 font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
                <span>Service</span>
                <span>Bills</span>
                <span>Rate</span>
                <span>Minimum</span>
                <span class="text-right">At {{ quantity }} pcs</span>
                <span class="text-center">Rst</span>
                <span class="text-center">On</span>
              </div>
              <div
                v-for="row in finishRows"
                :key="row.key"
                class="grid grid-cols-[minmax(190px,1fr)_110px_126px_126px_150px_44px_52px] items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
                :style="{
                  borderColor: 'var(--line)',
                  background: finishOverridden(row) ? 'rgba(245,166,35,.06)' : 'transparent',
                  opacity: row.active ? 1 : 0.45,
                }"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 text-[12.5px] font-semibold">
                    <span class="truncate">{{ row.label }}</span>
                    <span
                      v-if="finishOverridden(row)"
                      class="rounded-full px-1.5 py-[1px] font-mono2 text-[8px] uppercase tracking-[0.1em]"
                      :style="{ background: 'rgba(245,166,35,.16)', color: '#B45309' }"
                    >override</span>
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
                  @change="(v) => setFinishField(row, 'price', v)"
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
                  @change="(v) => setFinishField(row, 'minimum_charge', v)"
                  @enter="focusNext(finishRows, row.key, 'minimum_charge')"
                />
                <div class="text-right">
                  <div class="font-mono2 text-[12px] font-bold">{{ formatMoney(finishingPreview(row.key)?.final_total) }}</div>
                  <div v-if="finishingPreview(row.key)?.minimum_applied" class="text-[9.5px] text-[var(--sub)]">minimum applied</div>
                  <div v-else-if="finishingPreview(row.key)" class="text-[9.5px] text-[var(--sub)]">{{ finishingPreview(row.key)?.quantity_basis }}</div>
                </div>
                <div class="flex justify-center">
                  <button
                    v-if="finishOverridden(row)"
                    class="press-key flex h-6 w-6 items-center justify-center rounded-md"
                    :style="{ border: '1px solid var(--line)', color: 'var(--sub)' }"
                    :title="`Reset ${row.label}`"
                    :data-reset-finish="row.key"
                    @click="resetFinishRow(row)"
                  >
                    <RotateCcw :size="11" />
                  </button>
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
            Per-unit services charge the greater of quantity × rate and the minimum; flat services
            charge the flat rate once for any quantity above zero. Lamination both-sides is derived
            from the master first-side price × (1 + multiplier).
          </p>
        </div>
      </section>

      <!-- ── 4. SHOP & READINESS ── -->
      <section class="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Shop and readiness">
        <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex items-center gap-2">
            <Package :size="14" style="color: var(--accent)" />
            <span class="font-disp text-[13px] font-bold">Shop profile</span>
          </div>
          <p class="mt-1 text-[11.5px] leading-relaxed text-[var(--sub)]">
            Shown on the marketplace card next to your prices.
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

        <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex items-center gap-2">
            <Sparkles :size="14" style="color: var(--accent)" />
            <span class="font-disp text-[13px] font-bold">Readiness</span>
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
            v-if="(summary?.completion_feed ?? []).length"
            class="mt-3 border-t pt-3"
            :style="{ borderColor: 'var(--line)' }"
          >
            <div class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">What unlocks next</div>
            <div class="mt-1.5 space-y-1">
              <div v-for="item in summary?.completion_feed ?? []" :key="item" class="flex items-start gap-2 text-[11px] leading-snug text-[var(--sub)]">
                <span class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--accent)" />
                {{ item }}
              </div>
            </div>
          </div>
          <div
            v-if="exampleQuote && !exampleQuote.is_complete"
            class="mt-3 flex items-start gap-2.5 rounded-xl p-3"
            :style="{ background: 'rgba(245,166,35,.1)', border: '1px solid rgba(245,166,35,.35)' }"
          >
            <AlertTriangle :size="14" class="mt-0.5 shrink-0" style="color: #B45309" />
            <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">{{ exampleQuote.status_text }}</p>
          </div>
        </div>
      </section>
    </template>

    <!-- ── save bar ── -->
    <div
      v-if="dirty || justSaved || saving || saveError"
      class="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
      :style="{ borderColor: 'var(--line)', background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }"
    >
      <div class="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
        <template v-if="justSaved">
          <span class="inline-flex items-center gap-2 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" style="color: #0E7A45">
            <Check :size="15" /> {{ isLive ? 'Rate card saved' : 'Rate card saved as a draft' }}
          </span>
        </template>
        <template v-else>
          <AlertTriangle :size="15" style="color: #B45309" class="shrink-0" />
          <span class="min-w-[200px] flex-1 text-[12.5px] text-[var(--sub)]">
            {{ saveError || 'You have unsaved edits. Quotes still use your last saved prices.' }}
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
            {{ saving ? 'Saving…' : 'Save draft' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  AlertTriangle, ArrowLeft, BadgeCheck, Check, CheckCircle2, Circle, Coins, Loader2,
  Package, RefreshCw, Rocket, RotateCcw, Save, Scissors, Sparkles,
} from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { ksh2 } from '~/shared/workflow/pricing'

interface ShopDetails {
  shop_name: string
  whatsapp_number: string
  location_area: string
}

interface MasterSettings {
  single_print: string
  double_print: string | null
  surcharge: string
  surcharge_threshold_gsm: number
  gloss_first_side: string
  matt_first_side: string
  lamination_second_multiplier: string
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
  override_single_print: string | null
  override_double_print: string | null
  override_surcharge: string | null
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
  override_rate: string | null
  override_minimum: string | null
  active: boolean
}

interface ExampleQuote {
  title: string
  paper_label: string
  sheets_needed: number
  missing_fields: string[]
  is_complete: boolean
  is_active: boolean
  status_text: string
  production_cost: string | null
}

interface ProductCatalogRow {
  key: string
  label: string
  available: boolean
  missing_items: string[]
  reason: string | null
}

interface Summary {
  pricing_items_added: number
  paper_rows_added: number
  finishing_rows_added: number
  products_unlocked: number
  product_catalog: ProductCatalogRow[]
  completion_feed: string[]
  next_suggestions: string[]
}

interface PreviewRow {
  key: string
  label: string
  gsm: number
  size: string
  active: boolean
  surcharge_applies: boolean
  paper_cost: string
  printing_alone_one_side: string
  printing_alone_both_sides: string | null
  surcharge_rate: string
  total_one_side: string
  total_both_sides: string | null
  double_sided_available: boolean
  override_single_print: string | null
  override_double_print: string | null
  override_surcharge: string | null
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
  master_settings: MasterSettings
  product: TableProductOption
  product_options: TableProductOption[]
  finishing_keys: string[]
  finishings: PreviewFinishing[]
  good_sheets: number
  billable_sheets: number
  rows: PreviewRow[]
  warnings: string[]
}

interface SetupStep {
  code: string
  title: string
  hint: string
  done: boolean
  route: string
}

interface SetupStatus {
  is_confirmed: boolean
  is_ready_to_confirm: boolean
  completed_steps: number
  total_steps: number
  next_step: SetupStep | null
  steps: SetupStep[]
}

interface RateCardSetup {
  paper_rows: PaperRow[]
  finishing_rows: FinishingRow[]
  shop_details: ShopDetails
  summary: Summary
  example_quote: ExampleQuote
  table_preview?: TablePreview
  completed: boolean
  is_confirmed?: boolean
  setup_status?: SetupStatus
  master_settings?: MasterSettings
  version?: string
  pricing_settings: Record<string, unknown>
}

const DEFAULT_MASTER: MasterSettings = {
  single_print: '15.00',
  double_print: null,
  surcharge: '10.00',
  surcharge_threshold_gsm: 250,
  gloss_first_side: '5.00',
  matt_first_side: '15.00',
  lamination_second_multiplier: '2.00',
}

const MASTER_FIELD_ORDER = [
  'single_print',
  'double_print',
  'surcharge',
  'surcharge_threshold_gsm',
  'gloss_first_side',
  'matt_first_side',
  'lamination_second_multiplier',
] as const

type MasterField = (typeof MASTER_FIELD_ORDER)[number]

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

const masterSettings = ref<MasterSettings>({ ...DEFAULT_MASTER })
const paperRows = ref<PaperRow[]>([])
const finishRows = ref<FinishingRow[]>([])
const shopDetails = ref<ShopDetails>({ shop_name: '', whatsapp_number: '', location_area: '' })
const summary = ref<Summary | null>(null)
const exampleQuote = ref<ExampleQuote | null>(null)
const completed = ref(false)
const version = ref('0')
const setupStatus = ref<SetupStatus | null>(null)
const confirming = ref(false)
const confirmError = ref('')
const justConfirmed = ref(false)

const tablePreview = ref<TablePreview | null>(null)
const previewing = ref(false)
const previewError = ref('')
const quantity = ref(100)
const productKey = ref('business-cards')
const selectedFinishingKeys = ref<string[]>([])

const dirty = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const justSaved = ref(false)
const saving = ref(false)
const saveError = ref('')
const conflictVersion = ref('')
let saveTimer: number | null = null
let previewTimer: number | null = null

const masterFirstInput = ref<HTMLInputElement | null>(null)

const shopName = computed(() => shopDetails.value.shop_name.trim() || 'Your shop')
const isLive = computed(() => Boolean(setupStatus.value?.is_confirmed ?? completed.value))

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
  masterSettings: MasterSettings
  version: string
}

const baseline = ref<RateCardBaseline | null>(null)

function snapshot(): RateCardBaseline {
  return clone({
    paperRows: paperRows.value,
    finishingRows: finishRows.value,
    shopDetails: shopDetails.value,
    masterSettings: masterSettings.value,
    version: version.value,
  })
}

function applyPayload(payload: RateCardSetup, options: { syncPreview?: boolean } = {}) {
  paperRows.value = (payload.paper_rows ?? []).map((row) => ({
    ...row,
    override_single_print: row.override_single_print ?? null,
    override_double_print: row.override_double_print ?? null,
    override_surcharge: row.override_surcharge ?? null,
  }))
  finishRows.value = (payload.finishing_rows ?? []).map((row) => ({
    ...row,
    override_rate: row.override_rate ?? null,
    override_minimum: row.override_minimum ?? null,
  }))
  shopDetails.value = payload.shop_details ?? { shop_name: '', whatsapp_number: '', location_area: '' }
  summary.value = payload.summary ?? null
  exampleQuote.value = payload.example_quote ?? null
  completed.value = Boolean(payload.completed)
  version.value = payload.version ?? '0'
  if (payload.setup_status) setupStatus.value = payload.setup_status
  if (payload.master_settings) {
    masterSettings.value = { ...DEFAULT_MASTER, ...payload.master_settings }
  }
  if (options.syncPreview && payload.table_preview) {
    tablePreview.value = payload.table_preview
    quantity.value = payload.table_preview.quantity
    productKey.value = payload.table_preview.product.key
    selectedFinishingKeys.value = [...payload.table_preview.finishing_keys]
  }
}

function resetEditingState() {
  dirty.value = false
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
    await nextTick()
    focusMasterInput()
  } catch (e) {
    const msg = getApiErrorMessage(e, 'Your rate card could not be loaded.')
    errorText.value = msg
    noShop.value = msg.includes('Complete shop setup before setting your rate card')
  } finally {
    loading.value = false
  }
}

function focusMasterInput() {
  const input = masterFirstInput.value
    ?? document.querySelector<HTMLInputElement>('input[data-field="master_single_print"]')
  input?.focus()
  input?.select()
}

function focusMasterNext(current: MasterField) {
  const index = MASTER_FIELD_ORDER.indexOf(current)
  const nextField = MASTER_FIELD_ORDER[index + 1]
  if (!nextField) return
  const input = document.querySelector<HTMLInputElement>(`input[data-field="master_${nextField}"]`)
  input?.focus()
  input?.select()
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

watch(loading, (value) => {
  if (!value) void nextTick(focusMasterInput)
})

function touch() {
  dirty.value = true
  justSaved.value = false
  saveError.value = ''
  conflictVersion.value = ''
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

function parseMultiplier(raw: string): { value: string | null, error: string | null } {
  const text = String(raw ?? '').trim().replace(/,/g, '')
  if (text === '') return { value: null, error: 'Enter a multiplier, e.g. 2.' }
  if (!/^\d+(\.\d{0,2})?$/.test(text)) return { value: null, error: 'Use numbers only, e.g. 2.' }
  const amount = Number(text)
  if (!Number.isFinite(amount) || amount < 0) return { value: null, error: 'Multiplier cannot be negative.' }
  return { value: amount.toFixed(2), error: null }
}

function masterError(field: MasterField): string {
  return fieldError(`master:${field}`)
}

function setMaster(field: MasterField, raw: string) {
  const key = `master:${field}`
  let value: string | number | null = null
  if (field === 'surcharge_threshold_gsm') {
    const parsed = parseThreshold(raw)
    if (parsed.error) {
      setError(key, parsed.error)
      return
    }
    clearError(key)
    value = parsed.value
  } else if (field === 'lamination_second_multiplier') {
    const parsed = parseMultiplier(raw)
    if (parsed.error) {
      setError(key, parsed.error)
      return
    }
    clearError(key)
    value = parsed.value
  } else {
    const parsed = parseMoney(raw, field === 'double_print')
    if (parsed.error) {
      setError(key, parsed.error)
      return
    }
    clearError(key)
    value = parsed.value
  }
  const next = { ...masterSettings.value, [field]: value }
  const changed = JSON.stringify(next) !== JSON.stringify(masterSettings.value)
  masterSettings.value = next
  if (changed) {
    touch()
    schedulePreview()
  }
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
    touch()
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
  touch()
  schedulePreview()
}

function setDoubleSided(row: PaperRow, value: boolean) {
  row.double_sided_enabled = value
  row.supports_double_side = value
  touch()
  schedulePreview()
}

function setOverride(row: PaperRow, field: 'override_single_print' | 'override_double_print' | 'override_surcharge', raw: string) {
  const key = `${row.key}:${field}`
  const parsed = parseMoney(raw, true)
  if (parsed.error) {
    setError(key, parsed.error)
    return
  }
  clearError(key)
  if ((row[field] ?? null) !== parsed.value) {
    row[field] = parsed.value
    touch()
    schedulePreview()
  }
}

function rowOverridden(row: PaperRow): boolean {
  return row.override_single_print != null
    || row.override_double_print != null
    || row.override_surcharge != null
}

const anyOverrides = computed(() => paperRows.value.some((row) => rowOverridden(row)))

function resetRowOverrides(row: PaperRow) {
  row.override_single_print = null
  row.override_double_print = null
  row.override_surcharge = null
  clearError(`${row.key}:override_single_print`)
  clearError(`${row.key}:override_double_print`)
  clearError(`${row.key}:override_surcharge`)
  touch()
  schedulePreview()
}

function resetAllOverrides() {
  paperRows.value.forEach((row) => {
    row.override_single_print = null
    row.override_double_print = null
    row.override_surcharge = null
  })
  touch()
  schedulePreview()
}

function finishBaselineRow(key: string): FinishingRow | undefined {
  return baseline.value?.finishingRows.find((row) => row.key === key)
}

function finishOverridden(row: FinishingRow): boolean {
  const base = finishBaselineRow(row.key)
  if (!base) return false
  return row.price !== base.price || (row.minimum_charge ?? null) !== (base.minimum_charge ?? null)
}

function setFinishField(row: FinishingRow, field: 'price' | 'minimum_charge', raw: string) {
  setNum(finishRows.value, row, field, raw)
}

function resetFinishRow(row: FinishingRow) {
  const base = finishBaselineRow(row.key)
  if (!base) return
  row.price = base.price
  row.minimum_charge = base.minimum_charge
  row.override_rate = null
  row.override_minimum = null
  clearError(`${row.key}:price`)
  clearError(`${row.key}:minimum_charge`)
  touch()
  schedulePreview()
}

const activeFinishRows = computed(() => finishRows.value.filter((row) => row.active))

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

const previewWarnings = computed(() => tablePreview.value?.warnings ?? [])

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
        master_settings: masterSettings.value,
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

function basisLabel(row: FinishingRow): string {
  return BASIS_LABELS[row.pricing_mode] || row.pricing_mode || row.unit
}

const activePaper = computed(() => paperRows.value.filter((r) => r.active))
const activeFinish = computed(() => finishRows.value.filter((r) => r.active))

const checks = computed(() => [
  { label: 'Paper stock priced', ok: activePaper.value.some((p) => toNum(p.single_side_price) > 0) },
  { label: 'Printing rates set', ok: activePaper.value.some((p) => toNum(p.double_side_price ?? 0) > 0) },
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

const hasFieldErrors = computed(() => Object.keys(fieldErrors.value).length > 0)
const canSave = computed(() => dirty.value && !saving.value && !hasFieldErrors.value)
const productOptions = computed<TableProductOption[]>(() => tablePreview.value?.product_options ?? [
  { key: 'business-cards', label: 'Business Cards', size: '90×55mm', min_qty: 100 },
])

async function discardChanges() {
  if (!baseline.value) return
  paperRows.value = clone(baseline.value.paperRows)
  finishRows.value = clone(baseline.value.finishingRows)
  shopDetails.value = clone(baseline.value.shopDetails)
  masterSettings.value = clone(baseline.value.masterSettings)
  version.value = baseline.value.version
  resetEditingState()
  justSaved.value = false
  await refreshPreview()
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
        master_settings: masterSettings.value,
        expected_version: version.value,
      },
    })
    applyPayload(saved)

    // A save is a draft. Confirmation is a separate, explicit action
    // (Phase 3A / D1): the owner presses "Confirm and go live".
    completed.value = Boolean(saved.completed)
    baseline.value = snapshot()
    resetEditingState()
    await refreshPreview()
    justSaved.value = true
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

async function confirm() {
  if (confirming.value || saving.value) return
  // Confirmation must operate on the saved copy, so flush unsaved edits first.
  if (dirty.value) {
    await publish()
    if (dirty.value || saveError.value) return
  }
  confirming.value = true
  confirmError.value = ''
  try {
    const done = await api<{ completed: boolean, version?: string }>(
      API.rateCard.complete,
      { method: 'POST' },
    )
    if (done.version) version.value = done.version
    completed.value = Boolean(done.completed)
    const refreshed = await api<RateCardSetup>(API.rateCard.setup)
    applyPayload(refreshed)
    baseline.value = snapshot()
    justConfirmed.value = true
    if (saveTimer) window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      justConfirmed.value = false
    }, 3200)
  } catch (e) {
    const data = (e as { data?: { detail?: string, missing_steps?: SetupStep[] } }).data
    confirmError.value = data?.detail
      || getApiErrorMessage(e, 'We could not confirm your rate card. Please finish the steps below and try again.')
    await load()
  } finally {
    confirming.value = false
  }
}
</script>
