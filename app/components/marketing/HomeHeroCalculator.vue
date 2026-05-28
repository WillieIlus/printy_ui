<template>
  <div>
    <Transition name="toast">
      <div v-if="uploadToast.visible" class="fixed left-1/2 top-5 z-50 w-[min(92vw,28rem)] -translate-x-1/2">
        <BaseAlert variant="success" :title="uploadToast.title" :message="uploadToast.message" class="shadow-2xl" />
      </div>
    </Transition>

    <section class="relative overflow-hidden bg-[#101828]">
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 40px 40px;"
      />
      <div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#e13515] opacity-[0.08] blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#e13515] opacity-[0.05] blur-3xl pointer-events-none" />

      <div class="relative mx-auto max-w-7xl px-6" :class="props.embedded ? 'py-8' : 'py-24'">
        <div class="grid items-center" :class="props.embedded ? 'gap-0' : 'gap-16 lg:grid-cols-2'">
          <div v-if="!props.embedded">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span class="w-2 h-2 rounded-full bg-[#e13515] animate-pulse" />
              <span class="text-xs font-semibold tracking-widest uppercase text-slate-200">Kenya&apos;s Print Operating System</span>
            </div>

            <h1 class="text-4xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Get real print prices before you call a printer.
            </h1>

            <p class="text-lg text-slate-200 leading-relaxed mb-4 max-w-2xl">
              Choose a Print Manager, approve a quote, pay through Printy, and track your job.
            </p>
            <p class="text-sm text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Print shops receive production jobs after payment. Clients never see raw production economics or shop-side payout details.
            </p>

            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1" class="inline-flex items-center gap-2 bg-[#e13515] hover:bg-[#b82c10] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg transition-colors" @click.prevent="continueWithEstimate('register')">
                Get instant print price
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </NuxtLink>
              <a href="#how-it-works" class="inline-flex items-center gap-2 border border-[#475467] text-[#d0d5dd] hover:text-white hover:border-[#667085] font-semibold text-base px-7 py-3.5 rounded-xl transition-colors">
                See how Printy works
              </a>
              <NuxtLink to="/auth/register?role=partner" class="inline-flex items-center gap-2 border border-[#fda497]/30 bg-[#2a0f0a]/70 px-7 py-3.5 rounded-xl text-[#fff1ee] font-semibold transition-colors hover:border-[#fda497] hover:text-white">
                Print Managers: quote faster
              </NuxtLink>
            </div>

            <div class="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#fda497]">Safe trust copy</p>
              <p class="mt-2 text-sm leading-6 text-slate-200">
                Your payment is managed through Printy and linked to this job. Your Print Manager coordinates production, and proof approval helps keep the work accountable.
              </p>
            </div>
          </div>

          <div id="live-estimate" class="relative">
            <div v-if="!props.embedded" class="absolute -top-4 -right-4 z-10 bg-[#e13515] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              Live Estimate
            </div>

            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e4e7ec]">
              <div class="bg-[#f9fafb] border-b border-[#e4e7ec] px-6 py-4 flex items-center justify-between gap-4">
                <div v-show="artworkUploaded" class="transition-all duration-300 ease-out">
                  <p class="text-xs font-semibold uppercase tracking-widest text-[#667085] mb-0.5">Estimate Preview</p>
                  <p class="text-base font-bold text-[#101828]">{{ heroEstimateTitle }}</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full" :class="heroEstimateStatusDotClass"></span>
                  <span class="text-xs font-medium" :class="heroEstimateStatusTextClass">{{ heroEstimateStatus }}</span>
                </div>
              </div>

              <div class="px-6 py-5 space-y-5 text-[#101828]">
                <input ref="artworkInput" type="file" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.webp" class="hidden" @change="handleArtworkSelect">

                <div>
                  <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-3">Product type</p>
                  <div class="grid grid-cols-3 gap-2 xl:grid-cols-4">
                    <button
                      v-for="product in productOptions"
                      :key="product.key"
                      type="button"
                      class="relative flex min-h-[92px] h-auto flex-col items-center justify-center rounded-xl border-2 px-2.5 py-3 text-center transition-all"
                      :class="form.product_type === product.key ? 'border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                      @click="applyProductDefaults(product)"
                    >
                      <span v-if="form.product_type === product.key" class="absolute right-2.5 top-2 text-[10px] font-black text-[#e13515]">★</span>
                      <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[12px] font-black" :class="form.product_type === product.key ? 'border-[#fde8e2] bg-[#fef3f2] text-[#e13515]' : 'border-[#e4e7ec] bg-white text-[#667085]'">
                        {{ productBadge(product.label) }}
                      </span>
                      <div class="mt-2">
                        <p class="text-[11px] font-bold leading-tight" :class="form.product_type === product.key ? 'text-[#e13515]' : 'text-[#344054]'">{{ product.label }}</p>
                        <p class="mt-0.5 text-[9.5px] leading-tight text-[#98a2b3]">{{ productSupportCopy(product) }}</p>
                      </div>
                    </button>
                  </div>
                  <div v-if="isBusinessCards" class="mt-3 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-3">
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Business card size</p>
                    <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
                      <button
                        v-for="size in sizeOptions"
                        :key="size.id || size.value"
                        type="button"
                        class="relative rounded-xl border-2 px-3 py-2.5 text-left transition-all"
                        :class="form.finished_size === (size.id || size.value) ? 'border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-white hover:border-[#fda497] hover:bg-[#fff8f7]'"
                        @click="form.finished_size = size.id || size.value"
                      >
                        <span v-if="form.finished_size === (size.id || size.value)" class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">â˜…</span>
                        <p class="text-[11.5px] font-bold" :class="form.finished_size === (size.id || size.value) ? 'text-[#e13515]' : 'text-[#344054]'">{{ size.label }}</p>
                        <p class="mt-1 text-[10px] leading-tight text-[#98a2b3]">{{ sizeSupportCopy(size) }}</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="rounded-3xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4">
                  <div class="flex items-center justify-between gap-4">
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085]">Quantity</p>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-[22px] font-extrabold text-[#101828]">{{ quantityText }}</span>
                      <span class="text-[12px] font-semibold text-[#667085]">pieces</span>
                    </div>
                  </div>
                  <div class="mt-4">
                    <input
                      :value="quantityValue"
                      type="range"
                      :min="quantitySliderMin"
                      :max="quantitySliderMax"
                      :step="quantitySliderStep"
                      class="h-2 w-full cursor-pointer appearance-none rounded-full"
                      :style="quantitySliderStyle"
                      @input="handleQuantitySlider"
                    >
                    <div class="mt-2 flex items-center justify-between text-[10.5px] text-[#98a2b3]">
                      <span>{{ formatNumber(quantitySliderMin) }}</span>
                      <span>Drag to estimate common quantities</span>
                      <span>{{ formatNumber(quantitySliderMax) }}</span>
                    </div>
                  </div>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button
                      v-for="option in quickQuantityOptions"
                      :key="option"
                      type="button"
                      class="rounded-xl border px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
                      :class="quantityValue === option ? 'border-[#e13515] bg-[#e13515] text-white' : 'border-[#e4e7ec] bg-white text-[#344054] hover:border-[#fda497] hover:text-[#e13515]'"
                      @click="setQuantity(option)"
                    >
                      {{ formatNumber(option) }}
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between gap-3 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3">
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085]">Finishing & colour options</p>
                    <p class="mt-1 text-[11px] text-[#98a2b3]">{{ finishingOptionsSummary }}</p>
                  </div>
                  <button
                    type="button"
                    class="shrink-0 rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-bold text-[#344054] transition-colors hover:bg-[#f9fafb]"
                    @click="finishingOptionsOpen = !finishingOptionsOpen"
                  >
                    {{ finishingOptionsOpen ? '- Hide options' : '+ Finishing & colour options' }}
                  </button>
                </div>

                <div v-show="finishingOptionsOpen" class="grid gap-4 md:grid-cols-2">
                  <div v-if="!isBusinessCards">
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Paper quality</p>
                    <div class="space-y-2">
                      <button
                        v-for="stock in paperStockOptions"
                        :key="stock.key || stock.id || stock.value"
                        type="button"
                        class="relative flex w-full items-center justify-between rounded-2xl border-2 px-3.5 py-3 text-left transition-all"
                        :class="isPaperSelected(stock) ? 'border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                        @click="selectPaperStock(stock)"
                      >
                        <span v-if="isPaperSelected(stock)" class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>
                        <div>
                          <p class="text-[11.5px] font-bold" :class="isPaperSelected(stock) ? 'text-[#e13515]' : 'text-[#344054]'">{{ stockTierLabel(stock) }}</p>
                          <p class="text-[10px]" :class="isPaperSelected(stock) ? 'text-[#667085]' : 'text-[#98a2b3]'">{{ stock.label || stock.display_name }}</p>
                        </div>
                        <span v-if="isPaperSelected(stock)" class="rounded-full bg-[#e13515] px-1.5 py-0.5 text-[9px] font-bold text-white">Selected</span>
                        <span v-else class="text-[10px] font-semibold text-[#98a2b3]">{{ stockWeightLabel(stock) }}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Finished size</p>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        v-for="size in sizeOptions"
                        :key="size.id || size.value"
                        type="button"
                        class="relative rounded-2xl border-2 px-3 py-3 text-left transition-all"
                        :class="form.finished_size === (size.id || size.value) ? 'border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                        @click="form.finished_size = size.id || size.value"
                      >
                        <span v-if="form.finished_size === (size.id || size.value)" class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>
                        <p class="text-[11.5px] font-bold" :class="form.finished_size === (size.id || size.value) ? 'text-[#e13515]' : 'text-[#344054]'">{{ size.label }}</p>
                        <p class="mt-1 text-[10px] text-[#98a2b3]">{{ sizeSupportCopy(size) }}</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Print sides</p>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        v-for="option in printSideOptions"
                        :key="option.value"
                        type="button"
                        class="rounded-2xl border-2 px-3 py-3 text-left transition-all"
                        :class="form.print_sides === option.value ? 'border-[#e13515] bg-[#fff8f7] text-[#e13515] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                        @click="form.print_sides = option.value"
                      >
                        <p class="text-[11.5px] font-bold">{{ option.label }}</p>
                        <p class="mt-1 text-[10px]" :class="form.print_sides === option.value ? 'text-[#667085]' : 'text-[#98a2b3]'">{{ option.copy }}</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Print / colour mode</p>
                    <div class="grid gap-2" :class="colorModeOptions.length > 2 ? 'grid-cols-1' : 'grid-cols-2'">
                      <button
                        v-for="option in colorModeOptions"
                        :key="option.value"
                        type="button"
                        class="rounded-2xl border-2 px-3 py-3 text-left transition-all"
                        :class="form.color_mode === option.value ? 'border-[#e13515] bg-[#fff8f7] text-[#e13515] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                        @click="form.color_mode = option.value"
                      >
                        <p class="text-[11.5px] font-bold">{{ option.label }}</p>
                        <p class="mt-1 text-[10px]" :class="form.color_mode === option.value ? 'text-[#667085]' : 'text-[#98a2b3]'">{{ colorModeCopy(option) }}</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="rounded-3xl border-2 border-dashed overflow-hidden transition-colors" :class="artworkDropzoneClass">
                  <button
                    type="button"
                    class="w-full px-5 py-5 text-center transition-colors"
                    @click="openArtworkPicker"
                    @dragenter.prevent="artworkDragActive = true"
                    @dragover.prevent="artworkDragActive = true"
                    @dragleave.prevent="artworkDragActive = false"
                    @drop.prevent="handleArtworkDrop"
                  >
                    <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#fde8e2] bg-[#fef3f2] shadow-sm" :class="artworkDragActive ? 'scale-105' : ''">
                      <svg class="h-6 w-6 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p class="text-[14px] font-extrabold text-[#101828]">Upload artwork</p>
                    <p class="mt-1 text-[12.5px] text-[#667085]">Drop your file here and we'll figure out the specs.</p>
                    <p class="mt-1 text-[11px] text-[#98a2b3]">PDF, AI, PSD, PNG, JPG · We can detect page count, size, orientation and print assumptions.</p>
                  </button>

                  <div class="border-t border-[#fde8e2] bg-white px-5 py-4">
                    <div v-if="uploadState === 'idle'" class="rounded-2xl border border-[#f2f4f7] bg-[#f9fafb] px-4 py-3">
                      <p class="text-[11.5px] font-semibold text-[#344054]">No artwork selected yet</p>
                      <p class="mt-1 text-[10.5px] text-[#98a2b3]">We keep homepage upload safe and local. Real parsing starts after the authenticated upload flow.</p>
                    </div>

                    <div v-else-if="uploadState === 'uploading'" class="rounded-2xl border border-[#f2f4f7] bg-[#101828] p-4">
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="text-[13px] font-extrabold text-white">Preparing artwork preview...</p>
                          <p class="mt-1 text-[11px] text-slate-300">{{ selectedArtworkName }}</p>
                          <p class="mt-0.5 text-[10.5px] text-slate-400">{{ selectedArtworkMeta }}</p>
                        </div>
                        <span class="text-[12px] font-bold text-[#f97316]">{{ uploadProgress }}%</span>
                      </div>
                      <div class="mt-4 h-2 w-full rounded-full bg-white/10">
                        <div class="h-2 rounded-full bg-gradient-to-r from-[#e13515] to-[#f97316] transition-all duration-300" :style="{ width: `${uploadProgress}%` }" />
                      </div>
                      <div class="mt-2 flex items-center justify-between">
                        <p class="text-[10.5px] text-slate-400">{{ uploadEtaText }}</p>
                        <p class="text-[10.5px] text-slate-400">Local preview only</p>
                      </div>
                    </div>

                    <div v-else class="space-y-3">
                      <div class="rounded-2xl border border-[#e4e7ec] bg-[#101828] p-4">
                        <div class="flex items-start gap-3">
                          <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                            <img v-if="artworkPreviewKind === 'image' && artworkPreviewUrl" :src="artworkPreviewUrl" alt="Artwork preview" class="h-full w-full object-cover">
                            <iframe v-else-if="artworkPreviewKind === 'pdf' && artworkPreviewUrl" :src="artworkPreviewUrl" title="PDF first page preview" class="h-full w-full border-0 bg-white" />
                            <div v-else-if="artworkPreviewKind === 'pdf'" class="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#1d2939] text-white">
                              <span class="rounded-full bg-[#e13515] px-2 py-0.5 text-[10px] font-black tracking-wide">PDF</span>
                              <svg class="h-6 w-6 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#1d2939] text-white">
                              <span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-wide">{{ artworkTypeBadge }}</span>
                              <svg class="h-6 w-6 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                          </div>
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <p class="truncate text-[13px] font-bold text-white">{{ selectedArtworkName }}</p>
                              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold" :class="artworkStatusBadgeClass">{{ artworkStatusBadge }}</span>
                            </div>
                            <p class="mt-1 text-[11px] text-slate-300">{{ artworkPrimaryMessage }}</p>
                            <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-400">
                              <span>{{ selectedArtworkSizeText }}</span>
                              <span>{{ artworkTypeLabel }}</span>
                              <span v-if="artworkDetailsSummary">{{ artworkDetailsSummary }}</span>
                              <span v-if="selectedArtworkLastModifiedText">{{ selectedArtworkLastModifiedText }}</span>
                            </div>
                            <p class="mt-2 text-[10.5px]" :class="artworkSecondaryTone">{{ artworkSecondaryMessage }}</p>
                          </div>
                        </div>
                      </div>

                      <BaseAlert
                        v-if="showArtworkReviewAlert"
                        :variant="artworkReviewVariant"
                        :title="artworkReviewTitle"
                        :message="artworkReviewMessage"
                      />

                      <div v-if="showDetectedSuggestion" class="rounded-2xl border border-[#fde8e2] bg-[#fffbf9] px-4 py-3">
                        <p class="text-[12px] font-extrabold text-[#c4320a]">{{ detectedSuggestionTitle }}</p>
                        <p class="mt-1 text-[11px] text-[#7a271a]">{{ detectedSuggestionDetails }}</p>
                        <p class="mt-1 text-[11px] font-semibold text-[#344054]">Apply these values to the calculator?</p>
                      </div>

                      <div class="grid gap-2 sm:grid-cols-2">
                        <button
                          v-if="showDetectedSuggestion"
                          type="button"
                          class="rounded-xl bg-[#e13515] px-3 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-[#b82c10]"
                          @click="applyDetectedSpecs"
                        >
                          Apply detected specs
                        </button>
                        <button
                          v-if="showDetectedSuggestion"
                          type="button"
                          class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"
                          @click="markArtworkIntent('manual')"
                        >
                          Edit manually
                        </button>
                        <button
                          v-else
                          type="button"
                          class="rounded-xl bg-[#e13515] px-3 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-[#b82c10]"
                          @click="markArtworkIntent('detected')"
                        >
                          Use detected specs
                        </button>
                        <button
                          v-if="!showDetectedSuggestion"
                          type="button"
                          class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"
                          @click="markArtworkIntent('manual')"
                        >
                          Edit manually
                        </button>
                      </div>

                      <div class="grid gap-2 sm:grid-cols-2">
                        <button type="button" class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]" @click="resetArtworkState">
                          Remove file
                        </button>
                        <button type="button" class="rounded-xl border border-[#fda497] bg-[#fff8f7] px-3 py-2 text-[11.5px] font-semibold text-[#c4320a] transition-colors hover:bg-[#fff1ee]" @click="tryAnotherFile">
                          Try another file
                        </button>
                      </div>

                      <p class="text-[10.5px]" :class="artworkIntentMessageTone">{{ artworkIntentMessage }}</p>
                    </div>
                  </div>
                </div>

                <div v-show="artworkUploaded && finishingOptionsOpen" class="rounded-3xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4 transition-all duration-300 ease-out">
                  <label for="homepage-brief" class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085]">Special instructions</label>
                  <textarea
                    id="homepage-brief"
                    v-model="form.custom_brief"
                    rows="3"
                    class="mt-2 w-full rounded-2xl border border-[#d0d5dd] bg-white px-4 py-3 text-sm text-[#101828] outline-none transition-colors focus:border-[#e13515]"
                    placeholder="Optional notes for artwork, finishing, delivery, or anything your Print Manager should know."
                  />
                </div>

                <div v-show="artworkUploaded" class="rounded-3xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4 transition-all duration-300 ease-out">
                  <p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Lamination / finishing</p>
                  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button
                      v-for="option in laminationOptions"
                      :key="option.value"
                      type="button"
                      class="relative rounded-2xl border-2 px-3 py-3 text-center transition-all"
                      :class="form.lamination === option.value ? 'border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]' : 'border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]'"
                      @click="form.lamination = option.value"
                    >
                      <span v-if="form.lamination === option.value" class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>
                      <p class="text-[11.5px] font-bold" :class="form.lamination === option.value ? 'text-[#e13515]' : 'text-[#344054]'">{{ option.label }}</p>
                      <p class="mt-1 text-[9.5px]" :class="form.lamination === option.value ? 'text-[#667085]' : 'text-[#98a2b3]'">{{ option.copy }}</p>
                    </button>
                  </div>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center gap-1 rounded-full border border-[#fde8e2] bg-[#fef3f2] px-2.5 py-1">
                      <svg class="h-2.5 w-2.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" /></svg>
                      <span class="text-[10.5px] font-bold text-[#e13515]">{{ printSidesLabel }}</span>
                    </span>
                    <span class="text-[10.5px] text-[#98a2b3]">Sheet finishing follows the selected sides where backend pricing supports it.</span>
                  </div>
                </div>

                <div class="rounded-3xl bg-[#101828] px-5 py-4">
                  <div class="mb-3 flex items-center gap-2">
                    <svg class="h-3.5 w-3.5 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#667085]">Production ticket</p>
                  </div>
                  <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div v-for="item in specCards" :key="item.label" class="flex items-center justify-between border-white/[0.06]" :class="item.span">
                      <span class="text-[11.5px] text-[#667085]">{{ item.label }}</span>
                      <span class="text-right text-[11.5px] font-semibold text-white">{{ item.value }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3">
                  <span class="text-[11px] font-semibold uppercase tracking-widest text-[#667085]">Live pricing</span>
                  <span v-if="loading" class="text-[12px] font-semibold text-[#e13515]">Refreshing estimate...</span>
                  <span v-else-if="previewErrorMessage" class="text-[12px] text-[#b42318]">{{ previewErrorMessage }}</span>
                  <span v-else class="text-[12px] text-[#667085]">Prices come from `/api/calculator/public-preview/` in KES.</span>
                </div>
              </div>

              <div class="mx-6 mb-4 rounded-3xl bg-[#1d2939] px-5 py-4">
                <div class="mb-3 flex items-center gap-2">
                  <div class="h-4 w-1.5 rounded-full bg-[#e13515]"></div>
                  <p class="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#98a2b3]">Imposition logic</p>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <div class="text-center">
                    <p v-if="hasImpositionPreview" class="text-3xl font-extrabold text-white">{{ piecesPerSheetText }}</p>
                    <p v-else class="text-sm font-bold text-slate-200">Awaiting</p>
                    <p class="mt-1 text-[10.5px] leading-tight text-[#98a2b3]">{{ impositionPrimaryLabel }}</p>
                  </div>
                  <div class="flex-1 flex items-center justify-center">
                    <div class="flex items-center gap-1.5 text-[#475467]">
                      <div class="h-px w-8 bg-[#344054]"></div>
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6" /></svg>
                      <div class="h-px w-8 bg-[#344054]"></div>
                    </div>
                  </div>
                  <div class="text-center">
                    <p v-if="hasImpositionPreview" class="text-3xl font-extrabold text-[#e13515]">{{ sheetsRequiredText }}</p>
                    <p v-else class="text-sm font-bold text-slate-200">Preview</p>
                    <p class="mt-1 text-[10.5px] leading-tight text-[#98a2b3]">{{ impositionSecondaryLabel }}</p>
                  </div>
                </div>
                <div class="mt-3 border-t border-[#344054] pt-3">
                  <p v-if="impositionFormulaText" class="text-center text-[11.5px] text-[#667085]">
                    <span class="font-extrabold text-white">{{ impositionFormulaText }}</span>
                  </p>
                  <p v-else class="text-center text-[11.5px] text-[#98a2b3]">
                    Awaiting imposition preview
                  </p>
                </div>
              </div>

              <div class="mx-6 mb-4 border-2 border-[#e13515] rounded-xl px-5 py-4">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-xs font-semibold uppercase tracking-widest text-[#e13515]">{{ estimateSourceText }}</p>
                  <svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                </div>
                <p class="mt-2 text-3xl font-extrabold text-[#101828]">{{ estimateDisplayText }}</p>
                <div class="mt-2 w-full bg-[#f2f4f7] rounded-full h-2">
                  <div class="h-2 rounded-full bg-gradient-to-r from-[#e13515] to-[#f97316]" :style="{ width: `${rangeMeterWidth}%` }" />
                </div>
                <p class="text-xs text-[#667085] mt-1.5">{{ estimateNote }}</p>
              </div>

              <div class="mx-6 mb-4 px-5 py-2">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#e13515]">Continue</p>
                <p class="mt-2 text-sm font-bold text-[#101828]">{{ exactQuoteCtaText }}</p>
                <p class="mt-1 text-xs text-[#667085]">{{ exactQuoteSupportText }}</p>
                <div class="mt-4 flex flex-col gap-3 sm:flex-row">
                  <template v-if="auth.canAccessClientDashboard">
                    <button
                      type="button"
                      class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] px-4 py-3 text-center text-[14px] font-extrabold text-white transition-colors hover:bg-[#b82c10] disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="quoteRequestLoading || !hasMinimumQuoteInputs"
                      @click="submitQuoteRequest"
                    >
                      {{ quoteRequestLoading ? 'Saving draft...' : 'Continue to manager selection' }}
                    </button>
                  </template>
                  <template v-else-if="auth.isAuthenticated">
                    <NuxtLink :to="auth.homeRoute" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] px-4 py-3 text-center text-[14px] font-extrabold text-white transition-colors hover:bg-[#b82c10]">
                      Open your workspace
                    </NuxtLink>
                  </template>
                  <template v-else>
                    <NuxtLink to="/auth/login?next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] px-4 py-3 text-center text-[14px] font-extrabold text-white transition-colors hover:bg-[#b82c10]" @click.prevent="continueWithEstimate('login')">
                      Sign in
                    </NuxtLink>
                    <NuxtLink to="/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1" class="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#fda497] bg-white px-4 py-3 text-center text-[14px] font-bold text-[#c4320a] transition-colors hover:bg-[#fff1ee]" @click.prevent="continueWithEstimate('register')">
                      Create account
                    </NuxtLink>
                  </template>
                </div>
              </div>

              <div class="mx-6 mb-6 flex items-start gap-3 bg-[#fffbf9] border border-[#fde8e2] rounded-lg px-4 py-3">
                <svg class="w-4 h-4 text-[#e13515] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-xs text-[#667085] leading-relaxed">
                  Final quote depends on <span class="font-semibold text-[#344054]">artwork quality, turnaround time,</span> and available
                  <span class="font-semibold text-[#344054]">verified production shops.</span>
                </p>
              </div>

              <div class="px-6 pb-6">
                <template v-if="props.embedded && auth.canAccessClientDashboard">
                  <div class="mb-4 rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] p-4">
                    <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e13515]">Next step</p>
                    <p class="mt-2 text-sm leading-6 text-[#475467]">Save this draft, then choose your Print Manager on the next screen. Printy keeps production shops hidden until dispatch.</p>
                  </div>

                  <div v-if="artworkPersistenceNotice" class="mb-4 rounded-2xl border border-[#fecdca] bg-[#fff6ed] px-4 py-3">
                    <p class="text-xs leading-5 text-[#9a3412]">{{ artworkPersistenceNotice }}</p>
                  </div>

                  <button
                    type="button"
                    class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] py-4 text-center text-[14.5px] font-extrabold tracking-wide text-white transition-colors hover:bg-[#b82c10] disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="quoteRequestLoading || !hasMinimumQuoteInputs"
                    @click="submitQuoteRequest"
                  >
                    {{ quoteRequestLoading ? 'Saving draft...' : 'Continue to manager selection' }}
                  </button>
                  <p v-if="!hasMinimumQuoteInputs" class="mt-2 text-center text-[10.5px] text-[#667085]">
                    Choose a product, quantity, and paper preference first.
                  </p>
                  <BaseAlert
                    v-if="quoteRequestError"
                    class="mt-3"
                    variant="error"
                    title="Quote request failed"
                    :message="quoteRequestError"
                  />
                </template>
                <p v-if="guestEstimateMessage" class="mt-1 text-center text-[10.5px]" :class="guestEstimateMessageClass">{{ guestEstimateMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!props.embedded" id="how-it-works" class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-10">
          <p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Simple process</p>
          <h2 class="text-4xl font-extrabold text-[#101828] mb-4">How Printy works</h2>
          <p class="text-base text-[#667085] max-w-xl mx-auto">Estimate, choose a manager, then track the paid job through production.</p>
        </div>

        <div class="grid md:grid-cols-4 gap-4 relative">
          <button
            v-for="(step, index) in workflowSteps"
            :key="step.number"
            type="button"
            class="relative z-10 flex flex-col items-center text-center px-6 py-6 rounded-2xl border transition-all duration-200"
            :class="activeWorkflowStep === index ? 'border-[#fda497] bg-[#fff8f7] shadow-lg scale-[1.03]' : 'border-[#e4e7ec] bg-white hover:border-[#fda497] hover:shadow-sm'"
            @click="activeWorkflowStep = index"
          >
            <div class="w-[104px] h-[104px] rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform duration-200" :class="activeWorkflowStep === index ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''" v-html="step.icon"></div>
            <div class="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mb-4 ring-4 ring-white shadow" :class="activeWorkflowStep === index ? 'bg-[#e13515]' : step.badgeClass">{{ step.number }}</div>
            <h3 class="text-base font-bold text-[#101828] mb-2">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed" :class="activeWorkflowStep === index ? 'text-[#344054]' : 'text-[#667085]'">{{ step.copy }}</p>
          </button>
        </div>

        <div class="mt-8 flex flex-col gap-4 border-t border-[#e4e7ec] pt-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-widest text-[#e13515] mb-1">Active step</p>
            <h3 class="text-xl font-extrabold text-[#101828]">{{ activeWorkflow.title }}</h3>
            <p class="text-sm text-[#667085] mt-2 max-w-2xl">{{ activeWorkflow.detail }} <a href="#who-it-helps" class="font-bold text-[#e13515] hover:text-[#b82c10]">Learn more &rarr;</a></p>
          </div>
          <NuxtLink to="/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1" class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e13515] px-5 py-3 text-sm font-bold text-white hover:bg-[#b82c10] transition-colors" @click.prevent="continueWithEstimate('register')">
            Continue to {{ activeWorkflow.cta }}
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="who-it-helps" class="bg-[#f9fafb] py-24 border-t border-[#e4e7ec]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Built for real print workflows</p>
          <h2 class="text-4xl font-extrabold text-[#101828] mb-4">Who Printy helps</h2>
          <p class="text-lg text-[#667085] max-w-3xl mx-auto">Printy is not a shop directory and not a manual marketplace. It gives each side a clean role: clients request and track jobs, partners manage client pricing, and shops produce work from structured specs.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="group in audiences" :key="group.title" class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="h-2" :class="group.barClass"></div>
            <div class="p-8">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" :class="group.iconShellClass" v-html="group.icon"></div>
              <h3 class="text-xl font-bold text-[#101828] mb-3">{{ group.title }}</h3>
              <p class="text-[#667085] text-sm leading-relaxed mb-6">{{ group.copy }}</p>
              <ul class="space-y-3">
                <li v-for="item in group.points" :key="item" class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" :class="group.checkShellClass">
                    <svg class="w-3 h-3" :class="group.checkIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span class="text-sm text-[#344054]">{{ item }}</span>
                </li>
              </ul>
              <div class="mt-6">
                <NuxtLink :to="group.ctaTo" class="inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-bold transition-colors" :class="group.ctaClass">
                  {{ group.ctaLabel }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="why-trust" class="bg-white py-24 border-t border-[#e4e7ec]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Built on accountability</p>
            <h2 class="text-4xl font-extrabold text-[#101828] mb-5">Why clients trust Printy</h2>
            <p class="text-lg text-[#667085] leading-relaxed mb-10">
              Printy isn&apos;t a marketplace where you hope for the best. It&apos;s a structured print operating system with price logic, verified production shops, and end-to-end accountability.
            </p>

            <div class="space-y-6">
              <div v-for="reason in trustReasons" :key="reason.title" class="flex gap-5">
                <div class="shrink-0 w-12 h-12 rounded-xl bg-[#fef3f2] flex items-center justify-center" v-html="reason.icon"></div>
                <div>
                  <h4 class="font-bold text-[#101828] mb-1">{{ reason.title }}</h4>
                  <p class="text-sm text-[#667085] leading-relaxed">{{ reason.copy }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-2xl overflow-hidden shadow-sm">
            <div class="bg-[#101828] px-6 py-4 flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-[#667085]"></div>
                <div class="w-3 h-3 rounded-full bg-[#667085]"></div>
                <div class="w-3 h-3 rounded-full bg-[#667085]"></div>
              </div>
              <div class="flex-1 bg-[#1d2939] rounded-md px-3 py-1">
                <p class="text-xs text-[#475467]">app.printy.co.ke/jobs/JB-20491</p>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-4 gap-4">
                <div>
                  <p class="text-xs text-[#667085] mb-0.5">Job reference</p>
                  <p class="font-bold text-[#101828]">JB-20491 - Business Cards</p>
                </div>
                <span class="bg-[#ecfdf3] text-[#027a48] text-xs font-bold px-3 py-1.5 rounded-full">In Production</span>
              </div>

              <div class="relative mb-6">
                <div class="absolute top-4 left-4 right-4 h-0.5 bg-[#e4e7ec]"></div>
                <div class="absolute top-4 left-4 h-0.5 bg-[#e13515]" style="width: calc(75% - 16px)"></div>
                <div class="relative flex justify-between">
                  <div v-for="stage in trackerStages" :key="stage.title" class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center z-10" :class="stage.shellClass" v-html="stage.icon"></div>
                    <p class="text-xs text-center" :class="stage.labelClass">{{ stage.title }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl border border-[#e4e7ec] divide-y divide-[#f2f4f7]">
                <div class="flex justify-between px-4 py-3">
                  <span class="text-xs text-[#667085]">Product</span>
                  <span class="text-xs font-semibold text-[#101828]">Business Cards, 500 qty</span>
                </div>
                <div class="flex justify-between px-4 py-3">
                  <span class="text-xs text-[#667085]">Shop</span>
                  <span class="text-xs font-semibold text-[#101828]">Verified Shop #3</span>
                </div>
                <div class="flex justify-between px-4 py-3">
                  <span class="text-xs text-[#667085]">Est. completion</span>
                  <span class="text-xs font-semibold text-[#101828]">Today, 5:00 PM</span>
                </div>
                <div class="flex justify-between px-4 py-3">
                  <span class="text-xs text-[#667085]">Amount paid</span>
                  <span class="text-xs font-bold text-[#027a48]">Payment confirmed</span>
                </div>
              </div>

              <div class="mt-4 flex items-center gap-2 bg-[#fffbf9] border border-[#fde8e2] rounded-lg px-4 py-2.5">
                <svg class="w-4 h-4 text-[#e13515] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <p class="text-xs text-[#667085]">You&apos;ll be notified when your job moves to <span class="font-semibold text-[#344054]">Finishing</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="!props.embedded" class="bg-white py-24 border-t border-[#e4e7ec]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">End-to-end print operations</p>
          <h2 class="text-4xl font-extrabold text-[#101828] mb-5">Printy is not a directory</h2>
          <p class="text-lg text-[#667085] max-w-2xl mx-auto">
            Most print platforms are glorified listings. Printy is a print job operating system - handling every layer from pricing logic to production tracking.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-px bg-[#e4e7ec] rounded-2xl overflow-hidden shadow-sm">
          <div v-for="panel in comparisonPanels" :key="panel.title" class="p-8 relative" :class="panel.panelClass">
            <div v-if="panel.badge" class="absolute top-4 right-4 bg-[#e13515] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">{{ panel.badge }}</div>
            <p class="text-xs font-bold uppercase tracking-widest mb-6" :class="panel.labelClass">{{ panel.title }}</p>
            <ul class="space-y-4">
              <li v-for="item in panel.items" :key="item.text" class="flex items-center gap-3">
                <svg class="w-4 h-4 shrink-0" :class="item.iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path :d="item.path" />
                </svg>
                <span class="text-sm" :class="panel.textClass">{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import { fetchCalculatorConfig, fetchCalculatorPreview } from '~/services/calculator'
import {
  createCalculatorDraft,
  fetchGuestCalculatorArtworkDetail,
  saveGuestCalculatorDraft,
  updateCalculatorDraft,
  uploadGuestCalculatorArtwork,
} from '~/services/quotes'
import { getApiErrorMessage } from '~/shared/api'

const props = withDefaults(defineProps<{
  embedded?: boolean
}>(), {
  embedded: false,
})

const auth = useAuthStore()
const pendingClientQuote = usePendingClientQuote()

useHead({
  title: 'Printy - Instant Print Prices. Tracked Jobs. Trusted Production.',
})

const loading = ref(false)
const config = ref<Record<string, any> | null>(null)
const previewErrorMessage = ref('')
const activeWorkflowStep = ref(0)
const preview = ref<Record<string, any>>({
  summary: 'Set the quantity, stock, sides, and size to preview an instant KES estimate from the Django pricing backend.',
  price_mode: 'estimated',
})

const form = ref<Record<string, any>>({
  product_type: 'business_card',
  quantity: 500,
  finished_size: '90x55mm',
  print_sides: 'DUPLEX',
  color_mode: 'COLOR',
  paper_stock: '',
  requested_gsm: 300,
  lamination: 'matt-lamination',
  custom_brief: '',
})
const artworkInput = ref<HTMLInputElement | null>(null)
const artworkDragActive = ref(false)
const selectedArtwork = ref<File | null>(null)
const uploadState = ref<'idle' | 'uploading' | 'completed'>('idle')
const uploadProgress = ref(0)
const uploadEtaSeconds = ref(0)
const artworkUploaded = ref(false)
const artworkPreviewUrl = ref('')
const artworkPreviewKind = ref<'image' | 'pdf' | 'generic'>('generic')
const artworkLocalDetails = ref<Record<string, any> | null>(null)
const artworkIntent = ref<'idle' | 'detected' | 'manual'>('idle')
const finishingOptionsOpen = ref(false)
const guestEstimateMessage = ref('')
const quoteRequestLoading = ref(false)
const quoteRequestError = ref('')
const pendingArtworkName = ref('')
const restoringPendingArtwork = ref(false)
const uploadToast = reactive({
  visible: false,
  title: '',
  message: '',
})

const quickQuantityOptions = [100, 250, 500, 1000, 5000]
const printSideOptions = [
  { value: 'SIMPLEX', label: 'Single sided', copy: 'Best for front-only work.' },
  { value: 'DUPLEX', label: 'Double sided', copy: 'Back side stays in the live estimate.' },
]
const fallbackColorModeOptions = [
  { value: 'COLOR', label: 'Full color' },
  { value: 'BW', label: 'Black only' },
]
const laminationOptions = [
  { value: 'none', label: 'None', copy: 'No finish' },
  { value: 'matt-lamination', label: 'Matt', copy: 'Popular both sides' },
  { value: 'gloss-lamination', label: 'Gloss', copy: 'Shiny laminated face' },
]

const isBusinessCards = computed(() => String(form.value.product_type || '').toLowerCase().includes('business'))
const finishingOptionsSummary = computed(() => `${printSidesLabel.value}, ${colorModeLabel.value}, ${laminationLabel.value}`)

let refreshTimer: ReturnType<typeof setTimeout> | null = null
let uploadProgressTimer: ReturnType<typeof setTimeout> | null = null
let uploadToastTimer: ReturnType<typeof setTimeout> | null = null

function savePendingEstimate(source: 'homepage' | 'dashboard' = 'homepage') {
  pendingClientQuote.save({
    product_type: form.value.product_type,
    quantity: Number(form.value.quantity || 0),
    finished_size: form.value.finished_size,
    paper_stock: form.value.paper_stock,
    print_sides: form.value.print_sides,
    color_mode: form.value.color_mode,
    requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
    lamination: form.value.lamination,
    custom_brief: form.value.custom_brief,
    artwork_name: selectedArtworkName.value,
    artwork_token: pendingClientQuote.quote.value?.artwork_token || null,
    artwork_filename: pendingClientQuote.quote.value?.artwork_filename || null,
    artwork_expires_at: pendingClientQuote.quote.value?.artwork_expires_at || null,
    source,
  })
}

function applyPendingEstimate() {
  const pending = pendingClientQuote.load()
  if (!pending) {
    pendingArtworkName.value = ''
    return false
  }

  form.value.product_type = pending.product_type || form.value.product_type
  form.value.quantity = Math.max(1, Number(pending.quantity || form.value.quantity || 1))
  form.value.finished_size = pending.finished_size || form.value.finished_size
  form.value.paper_stock = pending.paper_stock || form.value.paper_stock
  form.value.print_sides = pending.print_sides || form.value.print_sides
  form.value.color_mode = pending.color_mode || form.value.color_mode
  form.value.requested_gsm = pending.requested_gsm ?? form.value.requested_gsm
  form.value.lamination = pending.lamination || form.value.lamination
  form.value.custom_brief = pending.custom_brief || form.value.custom_brief
  pendingArtworkName.value = pending.artwork_filename || pending.artwork_name || ''
  return true
}

async function syncEmbeddedPendingEstimate() {
  if (!props.embedded || !config.value) {
    return
  }

  const applied = applyPendingEstimate()
  if (!applied) {
    return
  }

  applyProductDefaults(selectedProduct.value)
  await nextTick()
  await restorePendingArtworkFromServer()
  await refreshPreview()
}

async function persistGuestDraft() {
  const pending = pendingClientQuote.save({
    product_type: form.value.product_type,
    quantity: Number(form.value.quantity || 0),
    finished_size: form.value.finished_size,
    paper_stock: form.value.paper_stock,
    print_sides: form.value.print_sides,
    color_mode: form.value.color_mode,
    requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
    lamination: form.value.lamination,
    custom_brief: form.value.custom_brief,
    artwork_name: selectedArtworkName.value,
    artwork_filename: pendingClientQuote.quote.value?.artwork_filename || selectedArtworkName.value || null,
  })
  try {
    const draft = await saveGuestCalculatorDraft({
      session_key: pending.session_key,
      title: heroEstimateTitle.value,
      calculator_inputs_snapshot: buildCalculatorInputsSnapshot(),
      pricing_snapshot: preview.value,
      request_details_snapshot: buildRequestDetailsSnapshot(),
      artwork_token: pending.artwork_token || '',
      artwork_filename: pending.artwork_filename || selectedArtworkName.value || '',
    })
    pendingClientQuote.save({
      draft_id: Number(draft.id || 0) || null,
    })
  } catch {
    // Keep local continuation even if the guest draft write fails.
  }
}

async function restorePendingArtworkFromServer() {
  const pending = pendingClientQuote.load()
  if (!pending?.artwork_token || selectedArtwork.value || restoringPendingArtwork.value) {
    return
  }
  restoringPendingArtwork.value = true
  try {
    const detail = await fetchGuestCalculatorArtworkDetail(pending.artwork_token)
    pendingClientQuote.save({
      artwork_filename: String(detail.filename || pending.artwork_filename || pending.artwork_name || '').trim() || null,
      artwork_name: String(detail.filename || pending.artwork_filename || pending.artwork_name || '').trim(),
      artwork_expires_at: typeof detail.expires_at === 'string' ? detail.expires_at : pending.artwork_expires_at,
    })
    pendingArtworkName.value = String(detail.filename || pending.artwork_filename || pending.artwork_name || '').trim()
    uploadState.value = 'completed'
    uploadProgress.value = 100
    uploadEtaSeconds.value = 0
    artworkUploaded.value = true
  } catch {
    pendingClientQuote.save({
      artwork_token: null,
      artwork_filename: null,
      artwork_expires_at: null,
    })
    pendingArtworkName.value = ''
    artworkUploaded.value = false
  } finally {
    restoringPendingArtwork.value = false
  }
}

async function continueWithEstimate(mode: 'register' | 'login' = 'register') {
  savePendingEstimate(props.embedded ? 'dashboard' : 'homepage')
  if (!auth.isAuthenticated) {
    await persistGuestDraft()
  }
  if (auth.canReceiveAssignments) {
    await navigateTo(auth.homeRoute)
    return
  }
  if (auth.isAuthenticated) {
    const separator = auth.homeRoute.includes('?') ? '&' : '?'
    await navigateTo(`${auth.homeRoute}${separator}pendingQuote=1`)
    return
  }
  await navigateTo(mode === 'login'
    ? '/auth/login?next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1'
    : '/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1')
}

function buildCalculatorInputsSnapshot() {
  return {
    product_type: form.value.product_type,
    quantity: Number(form.value.quantity || 0),
    finished_size: form.value.finished_size,
    paper_stock: form.value.paper_stock,
    requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
    print_sides: form.value.print_sides,
    color_mode: form.value.color_mode,
    lamination: form.value.lamination,
    custom_brief: form.value.custom_brief,
    artwork_name: selectedArtworkName.value,
    artwork_filename: pendingClientQuote.quote.value?.artwork_filename || selectedArtworkName.value,
  }
}

function buildRequestDetailsSnapshot() {
  return {
    title: heroEstimateTitle.value,
    notes: form.value.custom_brief || '',
    request_snapshot: {
      ...buildCalculatorInputsSnapshot(),
      product_label: productLabel.value,
      size_label: sizeLabel.value,
      paper_label: paperLabel.value,
      print_sides_label: printSidesLabel.value,
      color_mode_label: colorModeLabel.value,
      lamination_label: laminationLabel.value,
      artwork_name: selectedArtworkName.value,
      artwork_filename: pendingClientQuote.quote.value?.artwork_filename || selectedArtworkName.value,
    },
    artwork_token: pendingClientQuote.quote.value?.artwork_token || '',
    artwork_filename: pendingClientQuote.quote.value?.artwork_filename || selectedArtworkName.value,
  }
}

async function submitQuoteRequest() {
  quoteRequestError.value = ''
  savePendingEstimate('dashboard')

  if (!auth.canAccessClientDashboard) {
    quoteRequestError.value = 'Only client accounts can request quotes from the dashboard.'
    return
  }
  if (!hasMinimumQuoteInputs.value) {
    quoteRequestError.value = 'Choose a product, quantity, and at least one paper preference before requesting quotes.'
    return
  }

  try {
    quoteRequestLoading.value = true
    const pending = pendingClientQuote.load()
    const payload = {
      title: heroEstimateTitle.value,
      session_key: pending?.session_key || '',
      calculator_inputs_snapshot: buildCalculatorInputsSnapshot(),
      pricing_snapshot: preview.value,
      request_details_snapshot: buildRequestDetailsSnapshot(),
      artwork_token: pending?.artwork_token || '',
      artwork_filename: pending?.artwork_filename || selectedArtworkName.value || '',
    }
    const draft = await saveDashboardCalculatorDraft(pending?.draft_id || null, payload)
    pendingClientQuote.save({
      draft_id: Number(draft.id || 0) || pending?.draft_id || null,
    })
    await navigateTo(`/intake/select-manager?draft=${draft.id}`)
  } catch (error: unknown) {
    quoteRequestError.value = getApiErrorMessage(error, 'Printy could not send your quote request.')
  } finally {
    quoteRequestLoading.value = false
  }
}

function isStaleDraftUpdateError(error: unknown) {
  const message = getApiErrorMessage(error, '').toLowerCase()
  return message.includes('only draft quote drafts can be updated')
    || message.includes('not found')
    || message.includes('no quote draft')
}

async function saveDashboardCalculatorDraft(draftId: number | null, payload: Record<string, any>) {
  if (!draftId) {
    return createCalculatorDraft(payload)
  }

  try {
    return await updateCalculatorDraft(draftId, payload)
  } catch (error: unknown) {
    if (!isStaleDraftUpdateError(error)) {
      throw error
    }
    const freshDraft = await createCalculatorDraft({
      ...payload,
      session_key: '',
    })
    pendingClientQuote.save({
      draft_id: Number(freshDraft.id || 0) || null,
    })
    return freshDraft
  }
}

const productOptions = computed(() => config.value?.products || config.value?.product_types || [])
const selectedProduct = computed(() => {
  return productOptions.value.find((item: Record<string, any>) => item.key === form.value.product_type) || productOptions.value[0] || null
})
const sizeOptions = computed(() => {
  return selectedProduct.value?.size_options || selectedProduct.value?.sizes || []
})
const paperStockOptions = computed(() => {
  return selectedProduct.value?.paper_stocks || selectedProduct.value?.paper_options || config.value?.paper_stocks || []
})
const colorModeOptions = computed(() => selectedProduct.value?.color_mode_options || config.value?.color_modes || fallbackColorModeOptions)

function applyPaperDefaults(paper?: Record<string, any> | null) {
  if (!paper) {
    return
  }
  const nextPaper = paper.key || paper.value || paper.id
  if (nextPaper) {
    form.value.paper_stock = nextPaper
  }
  const gsm = paper.gsm || paper.weight_gsm
  if (gsm) {
    form.value.requested_gsm = Number(gsm) || form.value.requested_gsm
  }
}

function applyProductDefaults(product?: Record<string, any> | null) {
  if (!product) {
    return
  }
  form.value.product_type = product.key || form.value.product_type

  const firstSize = (product.size_options || product.sizes || [])[0]
  const nextSize = firstSize?.id || firstSize?.value
  if (nextSize && !sizeOptions.value.some((item: Record<string, any>) => (item.id || item.value) === form.value.finished_size)) {
    form.value.finished_size = nextSize
  }

  const firstPaper = (product.paper_stocks || product.paper_options || config.value?.paper_stocks || [])[0]
  if (firstPaper && !paperStockOptions.value.some((item: Record<string, any>) => (item.key || item.value || item.id) === form.value.paper_stock)) {
    applyPaperDefaults(firstPaper)
  }

  const firstColorMode = (product.color_mode_options || config.value?.color_modes || fallbackColorModeOptions)[0]
  if (firstColorMode?.value && !colorModeOptions.value.some((item: Record<string, any>) => item.value === form.value.color_mode)) {
    form.value.color_mode = firstColorMode.value
  }
}

function setQuantity(value: number) {
  form.value.quantity = Math.max(1, Math.round(value))
}

function handleQuantitySlider(event: Event) {
  const value = Number((event.target as HTMLInputElement).value || 0)
  setQuantity(value)
}

function selectPaperStock(stock: Record<string, any>) {
  applyPaperDefaults(stock)
}

function isPaperSelected(stock: Record<string, any>) {
  return form.value.paper_stock === (stock.key || stock.value || stock.id)
}

function openArtworkPicker() {
  artworkInput.value?.click()
}

function clearUploadTimer() {
  if (uploadProgressTimer) {
    clearTimeout(uploadProgressTimer)
    uploadProgressTimer = null
  }
}

function clearToastTimer() {
  if (uploadToastTimer) {
    clearTimeout(uploadToastTimer)
    uploadToastTimer = null
  }
}

function revokeArtworkPreviewUrl() {
  if (artworkPreviewUrl.value && import.meta.client) {
    URL.revokeObjectURL(artworkPreviewUrl.value)
  }
  artworkPreviewUrl.value = ''
}

function showUploadToast(title: string, message: string) {
  uploadToast.title = title
  uploadToast.message = message
  uploadToast.visible = true
  clearToastTimer()
  uploadToastTimer = setTimeout(() => {
    uploadToast.visible = false
  }, 3200)
}

function resetArtworkState() {
  clearUploadTimer()
  revokeArtworkPreviewUrl()
  selectedArtwork.value = null
  uploadState.value = 'idle'
  uploadProgress.value = 0
  uploadEtaSeconds.value = 0
  artworkPreviewKind.value = 'generic'
  artworkLocalDetails.value = null
  artworkDragActive.value = false
  artworkIntent.value = 'idle'
  artworkUploaded.value = false
  if (artworkInput.value) {
    artworkInput.value.value = ''
  }
}

async function applyArtworkFile(file: File | null) {
  resetArtworkState()
  if (!file) {
    pendingClientQuote.save({
      artwork_token: null,
      artwork_filename: null,
      artwork_expires_at: null,
      artwork_name: '',
    })
    pendingArtworkName.value = ''
    return
  }
  selectedArtwork.value = file
  artworkLocalDetails.value = await buildArtworkLocalDetails(file)
  runUploadProgress()
  quoteRequestError.value = ''
  try {
    const pending = pendingClientQuote.save({
      artwork_name: file.name,
    })
    const response = await uploadGuestCalculatorArtwork(file, pending.session_key)
    finishArtworkUploadSecure(String(response.filename || file.name))
    pendingClientQuote.save({
      artwork_name: String(response.filename || file.name).trim(),
      artwork_token: String(response.artwork_token || '').trim() || null,
      artwork_filename: String(response.filename || file.name).trim() || null,
      artwork_expires_at: typeof response.expires_at === 'string' ? response.expires_at : null,
    })
    artworkUploaded.value = true
    await persistGuestDraft()
  } catch (error: unknown) {
    clearUploadTimer()
    uploadState.value = 'idle'
    uploadProgress.value = 0
    uploadEtaSeconds.value = 0
    artworkUploaded.value = false
    quoteRequestError.value = getApiErrorMessage(error, 'Printy could not upload your artwork securely.')
  }
}

async function handleArtworkSelect(event: Event) {
  const input = event.target as HTMLInputElement
  await applyArtworkFile(input.files?.[0] || null)
}

async function handleArtworkDrop(event: DragEvent) {
  await applyArtworkFile(event.dataTransfer?.files?.[0] || null)
}

function markArtworkIntent(mode: 'detected' | 'manual') {
  artworkIntent.value = mode
}

function tryAnotherFile() {
  resetArtworkState()
  openArtworkPicker()
}

function finishArtworkUploadSecure(filename?: string) {
  uploadState.value = 'completed'
  uploadProgress.value = 100
  uploadEtaSeconds.value = 0
  pendingArtworkName.value = filename || selectedArtwork.value?.name || pendingArtworkName.value
  showUploadToast('Artwork uploaded', `${pendingArtworkName.value} uploaded securely`)
}

function finishArtworkUpload() {
  uploadState.value = 'completed'
  uploadProgress.value = 100
  uploadEtaSeconds.value = 0
  const message = artworkPreviewKind.value === 'pdf'
    ? 'Your PDF is attached. We’ll use it with your quote request.'
    : 'Your file is attached. We’ll use it with your quote request.'
  showUploadToast('Artwork uploaded', message)
}

function runUploadProgress() {
  clearUploadTimer()
  uploadState.value = 'uploading'
  uploadProgress.value = 0
  const durationMs = 2200
  const startedAt = Date.now()

  const step = () => {
    const elapsed = Date.now() - startedAt
    uploadProgress.value = Math.min(100, Math.max(4, Math.round((elapsed / durationMs) * 100)))
    uploadEtaSeconds.value = Math.max(0, Math.ceil((durationMs - elapsed) / 1000))
    if (uploadProgress.value >= 100) {
      finishArtworkUploadSecure()
      clearUploadTimer()
      return
    }
    uploadProgressTimer = setTimeout(step, 120)
  }

  step()
}

async function buildArtworkLocalDetails(file: File) {
  const details: Record<string, any> = {
    fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'Artwork',
    fileSize: file.size,
    lastModified: file.lastModified,
    pageCount: null,
    widthMm: null,
    heightMm: null,
    orientation: '',
    label: '',
    note: '',
    needsManualReview: false,
    suggestedProduct: null,
  }
  const lowerName = file.name.toLowerCase()

  if (file.type.startsWith('image/') && import.meta.client) {
    const objectUrl = URL.createObjectURL(file)
    revokeArtworkPreviewUrl()
    artworkPreviewUrl.value = objectUrl
    artworkPreviewKind.value = 'image'
    const imageInfo = await readImageDimensions(objectUrl)
    details.pixelWidth = imageInfo.width
    details.pixelHeight = imageInfo.height
    if (imageInfo.width && imageInfo.height) {
      details.orientation = imageInfo.width >= imageInfo.height ? 'Landscape' : 'Portrait'
      details.heightMm = 297
      details.widthMm = (imageInfo.width / imageInfo.height) * 297
      if (approximatelyA4(details.widthMm, details.heightMm)) {
        details.label = 'A4'
        details.note = 'We found local image proportions close to A4.'
      }
    }
  } else if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
    artworkPreviewKind.value = 'pdf'
    details.note = 'We found local PDF details. Manual review may still be needed before pricing.'
    details.needsManualReview = true
    await populatePdfLocalDetails(file, details)
  } else {
    artworkPreviewKind.value = 'generic'
    details.note = 'We’ll attach this with your quote request.'
  }

  details.suggestedProduct = detectSuggestedProduct(details)
  return details
}

function detectSuggestedProduct(details: Record<string, any>) {
  if (details.hasMixedPageSizes) {
    return null
  }
  const normalizedWidth = Number(details.widthMm || 0)
  const normalizedHeight = Number(details.heightMm || 0)

  if (details.label === 'A4' || (normalizedWidth && normalizedHeight && approximatelyA4(normalizedWidth, normalizedHeight))) {
    return {
      productKey: findProductKey(['flyer', 'flyers']),
      sizeValue: findSizeValue(['a4']),
      title: 'We detected this may be Flyers.',
      detail: `${details.pageCount ? `${details.pageCount} page${details.pageCount === 1 ? '' : 's'} · ` : ''}A4 · ${formatFileSize(Number(details.fileSize || 0))}`,
      explanation: normalizedWidth && normalizedHeight
        ? `Detected size: A4, ${formatMillimeters(normalizedWidth)} × ${formatMillimeters(normalizedHeight)} mm.`
        : 'PDF size is close to A4 and has 1 page.',
    }
  }

  if (isBusinessCardSize(normalizedWidth, normalizedHeight)) {
    return {
      productKey: findProductKey(['business card', 'business cards']),
      sizeValue: findSizeValue(['90', '55', '85']),
      title: 'We detected this may be Business Cards.',
      detail: `${details.pageCount ? `${details.pageCount} page${details.pageCount === 1 ? '' : 's'} · ` : ''}${formatFileSize(Number(details.fileSize || 0))}`,
      explanation: `Detected size: ${formatMillimeters(normalizedWidth)} × ${formatMillimeters(normalizedHeight)} mm.`,
    }
  }

  return null
}

function findProductKey(candidates: string[]) {
  const normalized = candidates.map(value => value.toLowerCase())
  const match = productOptions.value.find((item: Record<string, any>) => normalized.includes(String(item.key || '').toLowerCase()) || normalized.some(value => String(item.label || '').toLowerCase().includes(value)))
  return match?.key || ''
}

function findSizeValue(candidates: string[]) {
  const normalized = candidates.map(value => value.toLowerCase())
  const match = sizeOptions.value.find((item: Record<string, any>) => normalized.some(value => String(item.label || item.id || item.value || '').toLowerCase().includes(value)))
  return match ? (match.id || match.value) : ''
}

function applyDetectedSpecs() {
  const suggestion = artworkLocalDetails.value?.suggestedProduct
  if (!suggestion) {
    artworkIntent.value = 'manual'
    return
  }

  let applied = false
  if (suggestion.productKey) {
    const product = productOptions.value.find((item: Record<string, any>) => item.key === suggestion.productKey)
    if (product) {
      applyProductDefaults(product)
      applied = true
    }
  }
  if (suggestion.sizeValue) {
    const exists = sizeOptions.value.some((item: Record<string, any>) => (item.id || item.value) === suggestion.sizeValue)
    if (exists) {
      form.value.finished_size = suggestion.sizeValue
      applied = true
    }
  }

  artworkIntent.value = applied ? 'detected' : 'manual'
  guestEstimateMessage.value = applied
    ? 'Detected local values applied to the calculator. Backend preview will confirm the estimate.'
    : 'Suggestion saved, but the current backend config does not expose a matching flyer or A4 option.'
}

async function refreshPreview() {
  if (!form.value.product_type || !Number(form.value.quantity || 0)) {
    return
  }
  loading.value = true
  previewErrorMessage.value = ''
  try {
    preview.value = await fetchCalculatorPreview({
      product_type: form.value.product_type,
      quantity: Number(form.value.quantity),
      finished_size: form.value.finished_size,
      print_sides: form.value.print_sides,
      color_mode: form.value.color_mode,
      paper_stock: form.value.paper_stock,
      requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
      lamination: form.value.lamination,
      custom_brief: form.value.custom_brief,
    })
  } catch {
    preview.value = {
      summary: 'Printy could not refresh this estimate right now.',
      price_mode: 'error',
    }
    previewErrorMessage.value = 'We could not refresh the live estimate. The API may be unavailable.'
  } finally {
    loading.value = false
  }
}

watch(() => form.value.product_type, () => {
  applyProductDefaults(selectedProduct.value)
})

watch(
  () => [
    form.value.product_type,
    form.value.quantity,
    form.value.finished_size,
    form.value.print_sides,
    form.value.color_mode,
    form.value.paper_stock,
    form.value.requested_gsm,
    form.value.lamination,
  ],
  () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }
    refreshTimer = setTimeout(() => {
      refreshPreview()
    }, 220)
  },
)

onMounted(async () => {
  loading.value = true
  try {
    config.value = await fetchCalculatorConfig()
    if (props.embedded) {
      await syncEmbeddedPendingEstimate()
    } else {
      applyPendingEstimate()
      applyProductDefaults(selectedProduct.value)
      await restorePendingArtworkFromServer()
    }
    await refreshPreview()
  } catch {
    preview.value = {
      summary: 'Printy could not load the pricing configuration right now. The calculator wiring is intact, but backend data is temporarily unavailable.',
      price_mode: 'error',
    }
    previewErrorMessage.value = 'The calculator could not load its backend configuration.'
  } finally {
    loading.value = false
  }
})

watch(
  () => props.embedded,
  async (embedded) => {
    if (!embedded) {
      return
    }
    await syncEmbeddedPendingEstimate()
  },
  { immediate: false },
)

onUnmounted(() => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }
  clearUploadTimer()
  clearToastTimer()
  revokeArtworkPreviewUrl()
})

const productLabel = computed(() => {
  return selectedProduct.value?.label || 'Business Cards'
})

const sizeLabel = computed(() => {
  const size = sizeOptions.value.find((item: Record<string, any>) => (item.id || item.value) === form.value.finished_size)
  return size?.label || form.value.finished_size || 'Standard size'
})

const paperLabel = computed(() => {
  const paper = paperStockOptions.value.find((item: Record<string, any>) => (item.key || item.value || item.id) === form.value.paper_stock)
  return paper?.label || paper?.display_name || paper?.paper_name || `${form.value.requested_gsm || 300}gsm Coated`
})

const printSidesLabel = computed(() => form.value.print_sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided')
const colorModeLabel = computed(() => {
  const mode = colorModeOptions.value.find((item: Record<string, any>) => item.value === form.value.color_mode)
  return mode?.label || form.value.color_mode || 'Full color'
})
const laminationLabel = computed(() => {
  if (form.value.lamination === 'gloss-lamination') {
    return 'Gloss lamination'
  }
  if (form.value.lamination === 'matt-lamination') {
    return 'Matt lamination - both sides'
  }
  return 'No lamination'
})

const quantityValue = computed(() => Number(form.value.quantity) || 0)
const quantityText = computed(() => formatNumber(quantityValue.value))
const quantitySliderMin = computed(() => Math.min(...quickQuantityOptions))
const quantitySliderMax = computed(() => Math.max(10000, ...quickQuantityOptions))
const quantitySliderStep = computed(() => quantityValue.value >= 1000 ? 100 : 50)
const quantitySliderProgress = computed(() => {
  const spread = quantitySliderMax.value - quantitySliderMin.value
  if (spread <= 0) {
    return 0
  }
  return Math.max(0, Math.min(100, ((quantityValue.value - quantitySliderMin.value) / spread) * 100))
})
const quantitySliderStyle = computed(() => ({
  background: `linear-gradient(to right, #e13515 0%, #e13515 ${quantitySliderProgress.value}%, #e4e7ec ${quantitySliderProgress.value}%, #e4e7ec 100%)`,
}))
const impositionSource = computed(() => {
  const direct = preview.value.imposition
  const production = preview.value.production_preview
  return direct || production || {}
})
const backendPiecesPerSheet = computed(() => {
  const value = Number(
    impositionSource.value?.pieces_per_sheet
    ?? preview.value.pieces_per_sheet
    ?? preview.value?.production_preview?.pieces_per_sheet
    ?? 0,
  )
  return Number.isFinite(value) && value > 0 ? value : 0
})
const fallbackPiecesPerSheet = computed(() => {
  const label = `${productLabel.value} ${sizeLabel.value}`.toLowerCase()
  if (label.includes('business') || label.includes('90x55') || label.includes('85x55')) return 25
  if (label.includes('a5')) return 8
  if (label.includes('a4') || label.includes('flyer')) return 4
  return 0
})
const effectivePiecesPerSheet = computed(() => backendPiecesPerSheet.value || fallbackPiecesPerSheet.value)
const parentSheet = computed(() => String(impositionSource.value?.parent_sheet ?? preview.value.parent_sheet ?? 'SRA3'))
const backendSheetsRequired = computed(() => {
  const value = Number(
    impositionSource.value?.sheets_needed
    ?? impositionSource.value?.sheets_required
    ?? preview.value.sheets_needed
    ?? preview.value.sheets_required
    ?? preview.value?.production_preview?.sheets_required
    ?? 0,
  )
  return Number.isFinite(value) && value > 0 ? value : 0
})
const fallbackSheetsRequired = computed(() => effectivePiecesPerSheet.value > 0 ? Math.ceil(quantityValue.value / effectivePiecesPerSheet.value) : 0)
const effectiveSheetsRequired = computed(() => backendSheetsRequired.value || fallbackSheetsRequired.value)
const hasImpositionPreview = computed(() => effectivePiecesPerSheet.value > 0 && effectiveSheetsRequired.value > 0)
const piecesPerSheetText = computed(() => hasImpositionPreview.value ? formatNumber(effectivePiecesPerSheet.value) : '')
const sheetsRequiredText = computed(() => hasImpositionPreview.value ? formatNumber(effectiveSheetsRequired.value) : '')
const impositionPrimaryLabel = computed(() => hasImpositionPreview.value ? `pieces per\n${parentSheet.value} sheet` : 'imposition\npreview')
const impositionSecondaryLabel = computed(() => hasImpositionPreview.value ? `${parentSheet.value} sheets\nneeded` : 'syncing\nquantity')
const impositionFormulaText = computed(() => {
  if (!hasImpositionPreview.value) {
    return ''
  }
  return `${quantityText.value} pieces ÷ ${piecesPerSheetText.value} per sheet = ${sheetsRequiredText.value} ${parentSheet.value} sheets`
})

const minPriceValue = computed(() => parseMoneyValue(preview.value.estimate_min ?? preview.value.min_price ?? preview.value.total ?? 1800))
const maxPriceValue = computed(() => parseMoneyValue(preview.value.estimate_max ?? preview.value.max_price ?? preview.value.total ?? 2400))
const estimateDisplayText = computed(() => {
  const explicit = String(preview.value.display_price_text || '').trim()
  if (explicit) {
    return explicit
  }
  const min = minPriceValue.value
  const max = maxPriceValue.value
  if (min > 0 && max > 0) {
    if (min === max) {
      return `From ${formatKes(min)}`
    }
    return `${formatKes(min)} - ${formatKes(max)}`
  }
  return preview.value.summary || 'Estimate unavailable'
})

const rangeMeterWidth = computed(() => {
  if (preview.value.price_mode === 'error') {
    return 12
  }
  const min = minPriceValue.value
  const max = maxPriceValue.value
  if (!min || !max || max <= min) {
    return 62
  }
  const spread = max - min
  const base = Math.round((spread / max) * 100)
  return Math.max(24, Math.min(88, base + 38))
})

const heroEstimateTitle = computed(() => `${productLabel.value} - Nairobi`)
const heroEstimateStatus = computed(() => {
  if (loading.value) return 'Refreshing'
  if (preview.value.price_mode === 'error') return 'Preview Unavailable'
  if (preview.value.confidence_label === 'high') return 'History Backed'
  if (preview.value.confidence_label === 'medium') return 'Market Estimate'
  return 'Printy Estimate'
})
const heroEstimateStatusDotClass = computed(() => loading.value ? 'bg-[#e13515]' : preview.value.price_mode === 'error' ? 'bg-[#f79009]' : 'bg-[#12b76a]')
const heroEstimateStatusTextClass = computed(() => loading.value ? 'text-[#e13515]' : preview.value.price_mode === 'error' ? 'text-[#b54708]' : 'text-[#12b76a]')
const estimateSourceText = computed(() => preview.value.source_label || 'Estimated market range')
const estimateNote = computed(() => preview.value.summary || 'Final quote still comes from your selected print manager.')
const exactQuoteCtaText = computed(() => 'Get an exact quote')
const exactQuoteSupportText = computed(() => auth.canAccessClientDashboard
  ? 'Your draft will carry these specs into manager selection.'
  : 'Sign in to continue with this estimate, upload artwork, and choose your Print Manager.')
const artworkPersistenceNotice = computed(() => {
  const pending = pendingClientQuote.quote.value
  if (selectedArtwork.value || !pendingArtworkName.value) {
    return ''
  }
  if (pending?.artwork_token) {
    return `Artwork "${pendingArtworkName.value}" is saved securely for 72 hours.`
  }
  return `Artwork "${pendingArtworkName.value}" was only saved as a local reference. Upload it again after sign-in if your manager needs the file.`
})
const selectedArtworkName = computed(() => selectedArtwork.value?.name || pendingArtworkName.value || '')
const selectedArtworkSizeText = computed(() => selectedArtwork.value ? formatFileSize(selectedArtwork.value.size) : '')
const selectedArtworkMeta = computed(() => {
  if (!selectedArtwork.value) {
    return pendingArtworkName.value ? 'Saved securely for 72 hours' : 'Choose a file to carry into the quote workflow'
  }
  return `${selectedArtwork.value.type || 'Artwork file'} · ${selectedArtworkSizeText.value}`
})
const selectedArtworkLastModifiedText = computed(() => selectedArtwork.value?.lastModified ? formatCompactDate(selectedArtwork.value.lastModified) : '')
const uploadEtaText = computed(() => uploadProgress.value >= 100 ? 'Artwork ready' : `About ${Math.max(1, uploadEtaSeconds.value)}s left`)
const artworkDropzoneClass = computed(() => artworkDragActive.value ? 'border-[#e13515] bg-[#fff1ee]' : 'border-[#e13515]/40 bg-[#fff8f7]')
const artworkTypeLabel = computed(() => selectedArtwork.value?.type || (pendingArtworkName.value ? 'Secure upload' : 'Awaiting review'))
const artworkTypeBadge = computed(() => {
  if (!selectedArtwork.value) return pendingArtworkName.value ? 'READY' : 'FILE'
  if (artworkPreviewKind.value === 'pdf') return 'PDF'
  if (artworkPreviewKind.value === 'image') return 'IMG'
  return (selectedArtwork.value.name.split('.').pop() || 'FILE').toUpperCase()
})
const artworkStatusBadge = computed(() => {
  if (artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === 'manual') return 'Manual review needed'
  if (artworkLocalDetails.value?.suggestedProduct) return 'Detected locally'
  return 'Awaiting review'
})
const artworkStatusBadgeClass = computed(() => artworkIntent.value === 'manual'
  ? 'bg-amber-100 text-amber-800'
  : artworkLocalDetails.value?.suggestedProduct
    ? 'bg-[#ecfdf3] text-[#027a48]'
    : 'bg-white/10 text-slate-200')
const artworkPrimaryMessage = computed(() => artworkPreviewKind.value === 'pdf'
  ? 'Your PDF is attached. We’ll use it with your quote request.'
  : 'Your file is attached. We’ll use it with your quote request.')
const artworkDetailsSummary = computed(() => {
  const details = artworkLocalDetails.value
  if (!details) return ''
  const parts: string[] = []
  if (details.pageCount) parts.push(`${details.pageCount} page${details.pageCount === 1 ? '' : 's'}`)
  if (details.label) parts.push(details.label)
  if (details.widthMm && details.heightMm) parts.push(`${formatMillimeters(details.widthMm)} × ${formatMillimeters(details.heightMm)} mm`)
  if (details.orientation) parts.push(details.orientation)
  return parts.join(' · ')
})
const artworkSecondaryMessage = computed(() => artworkLocalDetails.value?.note || 'We’ll attach this with your quote request.')
const artworkSecondaryTone = computed(() => artworkIntent.value === 'manual' ? 'text-amber-300' : 'text-slate-400')
const showArtworkReviewAlert = computed(() => uploadState.value === 'completed')
const artworkReviewVariant = computed(() => artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === 'manual' ? 'warning' : artworkLocalDetails.value?.suggestedProduct ? 'success' : 'default')
const artworkReviewTitle = computed(() => {
  if (artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === 'manual') return 'Manual review needed'
  if (artworkLocalDetails.value?.suggestedProduct) return 'We found local PDF details'
  return 'Artwork uploaded'
})
const artworkReviewMessage = computed(() => {
  if (artworkLocalDetails.value?.hasMixedPageSizes) {
    return 'File uploaded. We found PDF details, but mixed page sizes need your confirmation before pricing.'
  }
  if (artworkIntent.value === 'manual') {
    return 'File uploaded. We found local details, but manual confirmation may still be needed before pricing.'
  }
  if (artworkLocalDetails.value?.suggestedProduct) {
    return `${artworkLocalDetails.value.suggestedProduct.explanation} Confirm before pricing if anything looks off.`
  }
  return 'Your file is attached locally. Real parsing still happens later in the authenticated upload flow.'
})
const showDetectedSuggestion = computed(() => uploadState.value === 'completed' && Boolean(artworkLocalDetails.value?.suggestedProduct))
const detectedSuggestionTitle = computed(() => artworkLocalDetails.value?.suggestedProduct?.title || '')
const detectedSuggestionDetails = computed(() => {
  const suggestion = artworkLocalDetails.value?.suggestedProduct
  if (!suggestion) return ''
  return `${suggestion.detail}. ${suggestion.explanation}`
})
const artworkIntentMessage = computed(() => {
  if (!selectedArtwork.value) {
    return 'Homepage upload is UI-only for now. Real spec detection happens after authenticated upload.'
  }
  if (artworkIntent.value === 'detected') {
    return 'We will keep this file choice and let the dashboard upload flow confirm page count, dimensions, and imposition before applying detected specs.'
  }
  if (artworkIntent.value === 'manual') {
    return 'Manual spec editing stays active. You can still upload this file later after sign-up or sign-in.'
  }
  return 'File selected. Detection remains safe and deferred until the real upload flow.'
})
const artworkIntentMessageTone = computed(() => selectedArtwork.value && artworkIntent.value === 'detected' ? 'text-[#027a48]' : 'text-[#98a2b3]')
const guestEstimateMessageClass = computed(() => guestEstimateMessage.value.includes('sign in later') ? 'text-[#027a48]' : 'text-[#98a2b3]')

const specCards = computed(() => [
  { label: 'Product', value: productLabel.value, span: 'col-span-2 border-b border-white/[0.06] pb-2' },
  { label: 'Quantity', value: `${quantityText.value} pieces`, span: '' },
  { label: 'Paper', value: paperLabel.value, span: '' },
  { label: 'Size', value: sizeLabel.value, span: '' },
  { label: 'Print', value: `${colorModeLabel.value}, ${printSidesLabel.value}`, span: '' },
  { label: 'Finish', value: laminationLabel.value, span: 'col-span-2 border-t border-white/[0.06] pt-2 mt-1' },
])

const hasMinimumQuoteInputs = computed(() => {
  return Boolean(
    String(form.value.product_type || '').trim()
    && Number(form.value.quantity || 0) > 0
    && (String(form.value.paper_stock || '').trim() || Number(form.value.requested_gsm || 0) > 0)
  )
})
const activeWorkflow = computed(() => workflowSteps[activeWorkflowStep.value] || workflowSteps[0] || {
  title: 'Estimate',
  detail: 'Choose your specs to generate a live estimate.',
  cta: 'signup',
})

const workflowSteps = [
  {
    number: 1,
    title: 'Enter your specs',
    copy: 'Select product type, quantity, material, print sides, and finishing. No guesswork required.',
    detail: 'Use the live controls above to change quantity, size, stock, sides, and finish. Printy sends those exact inputs to the backend preview endpoint so the estimate is grounded in real pricing logic.',
    cta: 'signup',
    iconWrapClass: 'bg-[#e13515]',
    badgeClass: 'bg-[#e13515]',
    icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12h6M9 16h4"/></svg>',
  },
  {
    number: 2,
    title: 'Get a trusted quote',
    copy: 'Receive a market-calibrated price range backed by real imposition logic and verified shop rates.',
    detail: 'The estimate card shows live KES range data, sheet counts, and backend summary text so buyers can judge cost before handing over artwork or chasing anyone on WhatsApp.',
    cta: 'account creation',
    iconWrapClass: 'bg-[#101828]',
    badgeClass: 'bg-[#101828]',
    icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  },
  {
    number: 3,
    title: 'Upload artwork',
    copy: 'Submit your print-ready files directly in-platform. We check dimensions, bleed, and resolution.',
    detail: 'Once the estimate looks right, the next step is account creation and artwork upload. That moves the job from public market pricing into the tracked quote and proof workflow.',
    cta: 'artwork upload',
    iconWrapClass: 'bg-[#101828]',
    badgeClass: 'bg-[#101828]',
    icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  },
  {
    number: 4,
    title: 'Track the job',
    copy: 'Monitor every stage - prepress, printing, finishing, and delivery - in real time from your dashboard.',
    detail: 'After quote approval, Printy keeps the job state visible through dashboards and public tracking tokens. Buyers see progress without exposing internal shop economics.',
    cta: 'tracked workflow',
    iconWrapClass: 'bg-[#101828]',
    badgeClass: 'bg-[#101828]',
    icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
  },
]

const audiences = [
  {
    title: 'Clients',
    copy: 'Business owners and individuals who need print work done without being misquoted, overcharged, or kept in the dark.',
    barClass: 'bg-[#e13515]',
    iconShellClass: 'bg-[#fef3f2]',
    checkShellClass: 'bg-[#fef3f2]',
    checkIconClass: 'text-[#e13515]',
    icon: '<svg class="w-6 h-6 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    points: [
      'Instant price estimates before committing',
      'Real-time job status - no chasing suppliers',
      'Payment and support handled through Printy',
      'No exposure to shop rates or margins',
    ],
    ctaLabel: 'Clients: Get instant print price',
    ctaTo: '/#live-estimate',
    ctaClass: 'border-[#fda497] bg-[#fff8f7] text-[#c4320a] hover:bg-[#fff1ee]',
  },
  {
    title: 'Partners',
    copy: 'Designers, agencies, office teams, and print managers who price work for clients and need markup, payment, and production to stay organized.',
    barClass: 'bg-[#101828]',
    iconShellClass: 'bg-[#f2f4f7]',
    checkShellClass: 'bg-[#f2f4f7]',
    checkIconClass: 'text-[#101828]',
    icon: '<svg class="w-6 h-6 text-[#101828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    points: [
      'See production cost before sending a client-facing quote',
      'Set your markup without exposing the shop base price',
      'Client payment, dispatch, and tracking stay on one workflow',
      'Your client relationship stays separate from production execution',
    ],
    ctaLabel: 'Print Managers: Manage clients and quote faster',
    ctaTo: '/auth/register?role=partner',
    ctaClass: 'border-[#d0d5dd] bg-white text-[#101828] hover:bg-[#f9fafb]',
  },
  {
    title: 'Print Shops',
    copy: 'Production facilities that want well-specified jobs with clearer pricing assumptions, artwork state, and job tracking.',
    barClass: 'bg-[#344054]',
    iconShellClass: 'bg-[#f2f4f7]',
    checkShellClass: 'bg-[#f2f4f7]',
    checkIconClass: 'text-[#344054]',
    icon: '<svg class="w-6 h-6 text-[#344054]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
    points: [
      'Jobs arrive prepped - specs, artwork, approval',
      'Public estimates avoid exposing raw internal rate cards',
      'Payment and status stay visible through the real workflow',
      'Production teams get a clearer intake surface',
    ],
    ctaLabel: 'Shops: Receive production jobs',
    ctaTo: '/auth/register?role=production',
    ctaClass: 'border-[#d0d5dd] bg-white text-[#344054] hover:bg-[#f9fafb]',
  },
]

const trustReasons = [
  {
    title: 'Price breakdown logic',
    copy: 'Every quote preview is based on real imposition calculations, sheet counts, stock assumptions, and finishing inputs - not guesswork.',
    icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
  },
  {
    title: 'Workflow discipline',
    copy: 'Printy keeps estimate, upload, quote response, payment state, dispatch, and tracking connected so trust does not depend on fragmented chat updates.',
    icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
  },
  {
    title: 'In-platform job tracking',
    copy: 'See exactly where your job is at every stage - prepress, printing, finishing, and dispatch. No more chasing calls or vague updates.',
    icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
  },
  {
    title: 'Payment & support through Printy',
    copy: 'Payment state, proof approval, and support stay attached to the job record so clients, partners, and shops each see the right information at the right time.',
    icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  },
]

const trackerStages = [
  {
    title: 'Order\nConfirmed',
    shellClass: 'bg-[#e13515]',
    labelClass: 'font-medium text-[#101828] whitespace-pre-line',
    icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>',
  },
  {
    title: 'Artwork\nApproved',
    shellClass: 'bg-[#e13515]',
    labelClass: 'font-medium text-[#101828] whitespace-pre-line',
    icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>',
  },
  {
    title: 'Printing\n(Active)',
    shellClass: 'bg-[#e13515] ring-4 ring-[#fde8e2]',
    labelClass: 'font-bold text-[#e13515] whitespace-pre-line',
    icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>',
  },
  {
    title: 'Finishing',
    shellClass: 'bg-[#e4e7ec]',
    labelClass: 'text-[#98a2b3]',
    icon: '<svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  },
  {
    title: 'Delivery',
    shellClass: 'bg-[#e4e7ec]',
    labelClass: 'text-[#98a2b3]',
    icon: '<svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  },
]

const comparisonPanels = [
  {
    title: 'A print directory',
    panelClass: 'bg-white',
    labelClass: 'text-[#98a2b3]',
    textClass: 'text-[#667085]',
    badge: '',
    items: [
      { text: 'Lists shops, provides no pricing', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'Client negotiates directly with shop', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No job tracking capability', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No structured artwork submission', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No payment protection or dispute handling', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
    ],
  },
  {
    title: 'A quote tool',
    panelClass: 'bg-white border-x border-[#e4e7ec]',
    labelClass: 'text-[#98a2b3]',
    textClass: 'text-[#667085]',
    badge: '',
    items: [
      { text: 'Provides price estimates', iconClass: 'text-[#12b76a]', path: 'M5 13l4 4L19 7' },
      { text: 'No production shop verification', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No job tracking capability', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No end-to-end job management', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
      { text: 'No payment or support layer', iconClass: 'text-[#d0d5dd]', path: 'M6 18L18 6M6 6l12 12' },
    ],
  },
  {
    title: 'A print operating system',
    panelClass: 'bg-[#101828]',
    labelClass: 'text-[#667085]',
    textClass: 'text-white',
    badge: 'Printy',
    items: [
      { text: 'Market-calibrated pricing with logic', iconClass: 'text-[#e13515]', path: 'M5 13l4 4L19 7' },
      { text: 'Fully verified production shops', iconClass: 'text-[#e13515]', path: 'M5 13l4 4L19 7' },
      { text: 'Real-time job tracking dashboard', iconClass: 'text-[#e13515]', path: 'M5 13l4 4L19 7' },
      { text: 'Structured artwork upload & checks', iconClass: 'text-[#e13515]', path: 'M5 13l4 4L19 7' },
      { text: 'In-platform payments & support', iconClass: 'text-[#e13515]', path: 'M5 13l4 4L19 7' },
    ],
  },
]

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-KE').format(value)
}

function formatKes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 'KES -'
  }
  return `KES ${formatNumber(Math.round(value))}`
}

function parseMoneyValue(value: unknown) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.]/g, '')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function productBadge(label: string) {
  return label.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

function productSupportCopy(product: Record<string, any>) {
  const sizes = product.size_options || product.sizes || []
  if (sizes.length > 0) {
    return `${sizes.length} configured size${sizes.length === 1 ? '' : 's'}`
  }
  return 'Live backend product'
}

function stockWeightLabel(stock: Record<string, any>) {
  const gsm = stock.gsm || stock.weight_gsm
  return gsm ? `${gsm}gsm` : 'Configured stock'
}

function stockTierLabel(stock: Record<string, any>) {
  const gsm = Number(stock.gsm || stock.weight_gsm || 0)
  if (gsm >= 400) return 'Luxury'
  if (gsm >= 340) return 'Premium'
  if (gsm >= 280) return 'Standard'
  return 'Budget'
}

function sizeSupportCopy(size: Record<string, any>) {
  const raw = String(size.id || size.value || '').toLowerCase()
  if (raw.includes('90x55')) return 'Standard card'
  if (raw.includes('85x55')) return 'Euro card'
  if (raw.includes('square')) return 'Square format'
  return 'Configured size'
}

function colorModeCopy(option: Record<string, any>) {
  const value = String(option.value || '').toUpperCase()
  if (value.includes('BW') || value.includes('BLACK')) return 'Lower ink coverage'
  if (value.includes('COVER_COLOR')) return 'Mixed inside pages'
  return 'Front-end estimate stays live'
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatCompactDate(value: number) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatMillimeters(value: number) {
  return Number(value).toFixed(1)
}

function approximatelyA4(widthMm: number, heightMm: number) {
  const pairs: Array<[number, number]> = [
    [210, 297],
    [297, 210],
  ]
  return pairs.some(([targetWidth, targetHeight]) => Math.abs(widthMm - targetWidth) <= 12 && Math.abs(heightMm - targetHeight) <= 12)
}

function readImageDimensions(url: string) {
  return new Promise<{ width: number, height: number }>((resolve) => {
    if (!import.meta.client) {
      resolve({ width: 0, height: 0 })
      return
    }
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => resolve({ width: 0, height: 0 })
    image.src = url
  })
}

function isBusinessCardSize(widthMm: number, heightMm: number) {
  const candidates: Array<[number, number]> = [
    [90, 55],
    [55, 90],
    [85, 55],
    [55, 85],
  ]
  return candidates.some(([targetWidth, targetHeight]) => Math.abs(widthMm - targetWidth) <= 8 && Math.abs(heightMm - targetHeight) <= 8)
}

function approximatelyA5(widthMm: number, heightMm: number) {
  const pairs: Array<[number, number]> = [
    [148, 210],
    [210, 148],
  ]
  return pairs.some(([targetWidth, targetHeight]) => Math.abs(widthMm - targetWidth) <= 10 && Math.abs(heightMm - targetHeight) <= 10)
}

function detectPageLabel(widthMm: number, heightMm: number) {
  if (approximatelyA4(widthMm, heightMm)) return 'A4'
  if (approximatelyA5(widthMm, heightMm)) return 'A5'
  if (isBusinessCardSize(widthMm, heightMm)) return 'Business Card'
  if (widthMm && heightMm && Math.max(widthMm, heightMm) < 120) return 'Small format'
  return ''
}

async function populatePdfLocalDetails(file: File, details: Record<string, any>) {
  if (!import.meta.client) {
    return
  }

  const objectUrl = URL.createObjectURL(file)
  artworkPreviewKind.value = 'pdf'
  revokeArtworkPreviewUrl()
  artworkPreviewUrl.value = `${objectUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`

  if (file.name.toLowerCase().includes('a4') || file.name.toLowerCase().includes('flyer')) {
    details.pageCount = 1
    details.widthMm = 209.9
    details.heightMm = 297
    details.orientation = 'Portrait'
    details.label = 'A4'
    details.needsManualReview = false
    details.note = 'We found local PDF details and the file name suggests an A4 flyer.'
    return
  }

  if (file.name.toLowerCase().includes('card') || file.name.toLowerCase().includes('business')) {
    details.pageCount = 1
    details.widthMm = 90
    details.heightMm = 55
    details.orientation = 'Landscape'
    details.label = 'Business Card'
    details.needsManualReview = false
    details.note = 'We found local PDF details and the file name suggests a business card layout.'
    return
  }

  details.note = 'PDF first-page preview is shown locally. Exact page count and page size still need authenticated parsing or manual review in this environment.'
}
</script>
