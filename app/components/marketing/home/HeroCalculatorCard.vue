<template>
  <section
    class="space-y-6 rounded-[1.9rem] border border-[var(--p-calculator-border)] bg-[var(--p-calculator-surface)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:p-6"
    style="--p-text: var(--p-calculator-text); --p-text-muted: var(--p-calculator-muted); --p-border: var(--p-calculator-border); --p-surface: var(--p-calculator-surface); --p-input-bg: var(--p-calculator-surface); --p-bg-soft: var(--p-calculator-bg); --p-primary-soft: color-mix(in srgb, var(--p-primary) 16%, transparent);"
  >
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-2">
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--p-primary)]">Precision Print Console</p>
        <div class="space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-[var(--p-calculator-text)] md:text-[2rem]">Configure your print job like a finished machine, not a mockup.</h2>
          <p class="max-w-2xl text-sm leading-6 text-[var(--p-calculator-muted)]">
            Set the job, inspect the production readout, then send it to matching shops.
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 text-[11px] font-semibold text-[var(--p-calculator-muted)]">
        <span class="console-status-pill">Live pricing config</span>
        <span class="console-status-pill">Buyer friendly flow</span>
        <span class="console-status-pill">Light + dark ready</span>
      </div>
    </div>

    <BasePanel
      v-if="hasMounted && resumePromptVisible && guestDraft"
      variant="console"
      class="p-4 md:p-5"
    >
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[var(--p-calculator-text)]">You have an unfinished draft.</p>
          <p class="text-sm text-[var(--p-calculator-muted)]">Attach it to your dashboard or continue here without losing the saved configuration.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseButton variant="primary" size="sm" @click="attachGuestDraft">Attach to dashboard</BaseButton>
          <BaseButton variant="secondary" size="sm" @click="resumeGuestDraft">Continue here</BaseButton>
          <BaseButton variant="ghost" size="sm" @click="draftRecoveryStore.dismissResumePrompt()">Dismiss</BaseButton>
        </div>
      </div>
    </BasePanel>

    <BasePanel
      v-if="configLoading"
      variant="display"
      class="flex h-36 items-center justify-center p-6 text-sm text-[var(--p-calculator-muted)]"
    >
      <div class="flex items-center gap-2">
        <Icon name="lucide:loader-2" class="size-4 animate-spin" />
        <span>Loading calculator options...</span>
      </div>
    </BasePanel>

    <div
      v-else-if="configError"
      class="rounded-[1.6rem] border border-[var(--p-error)]/40 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
    >
      {{ configError }}
    </div>

    <form v-else class="space-y-6" @submit.prevent="submitPreview">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-2">
            <BasePanel variant="console" class="p-4">
              <BaseSelect
                id="job-type"
                label="Product / job type"
                :model-value="selectedProductType"
                :options="productOptions"
                hint="Start with the format you want to price."
                @update:model-value="store.selectProduct"
              />
            </BasePanel>

            <BasePanel v-if="paperTiers.length && !isLargeFormatProduct" variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Paper quality</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Paper</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tier in paperTiers"
                  :key="tier.id"
                  type="button"
                  class="paper-tier-btn"
                  :class="selectedPaperTierId === tier.id ? 'paper-tier-btn-active' : 'paper-tier-btn-idle'"
                  @click="selectPaperTier(tier.id)"
                >
                  <span v-if="tier.recommended" class="paper-tier-star">★</span>
                  <span class="paper-tier-label">{{ tier.label }}</span>
                  <span class="paper-tier-gsm">{{ tier.gsm }}gsm</span>
                </button>
              </div>
            </BasePanel>
            <BasePanel v-else-if="primaryPaperField && !isBookletProduct && !isLargeFormatProduct" variant="console" class="p-4">
              <BaseSelect
                v-if="primaryPaperOptions.length"
                id="paper-pref"
                :label="primaryPaperField.key === 'cover_stock' ? 'Cover stock / grammage' : 'Paper / grammage'"
                :model-value="stringValue(primaryPaperField.key)"
                :options="primaryPaperOptions.map(option => ({ label: humanOptionLabel(option.value, option.label), value: option.value }))"
                hint="Choose stock now or let the shop advise later."
                @update:model-value="updateField(primaryPaperField, $event)"
              />
              <div v-else class="space-y-2">
                <p class="text-sm font-medium text-[var(--p-calculator-text)]">Paper / grammage</p>
                <div class="console-inline-readout">Let the shop advise</div>
              </div>
            </BasePanel>

            <BasePanel v-if="colorModeOptions.length && !isLargeFormatProduct" variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Printing mode</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Color mode</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="mode in colorModeOptions"
                  :key="mode.value"
                  type="button"
                  class="paper-tier-btn"
                  :class="selectedColorMode === mode.value ? 'paper-tier-btn-active' : 'paper-tier-btn-idle'"
                  @click="selectColorMode(mode.value)"
                >
                  <span class="paper-tier-label">{{ mode.label }}</span>
                </button>
              </div>
            </BasePanel>

            <BasePanel v-if="sizeOptions.length" variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Job size</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Finished size</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in sizeOptions"
                  :key="size.id"
                  type="button"
                  class="size-option-btn"
                  :class="selectedSizeId === size.id ? 'size-option-btn-active' : 'size-option-btn-idle'"
                  @click="selectSize(size.id)"
                >
                  <span v-if="size.recommended" class="size-option-star">★</span>
                  <span class="size-option-label">{{ size.label }}</span>
                  <span class="size-option-dims">{{ size.width_mm }} × {{ size.height_mm }} mm</span>
                </button>
                <button
                  v-if="allowCustomSize"
                  type="button"
                  class="size-option-btn"
                  :class="isCustomSize ? 'size-option-btn-active' : 'size-option-btn-idle'"
                  @click="selectSize('custom')"
                >
                  <span class="size-option-label">Custom</span>
                  <span class="size-option-dims">Enter dimensions</span>
                </button>
              </div>
              <div v-if="allowCustomSize && isCustomSize" class="space-y-3 pt-1">
                <div v-if="isLargeFormatProduct" class="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)]">
                  <BaseSelect
                    id="large-format-unit"
                    label="Unit"
                    :model-value="stringValue('input_unit') || 'mm'"
                    :options="largeFormatUnitOptions"
                    @update:model-value="(v: string) => updateLargeFormatUnit(v)"
                  />
                  <BaseInput
                    id="custom-width"
                    :label="`Width (${largeFormatUnitLabel})`"
                    type="number"
                    min="0.1"
                    step="0.1"
                    inputmode="decimal"
                    :model-value="stringValue('width_input')"
                    @update:model-value="(v: string) => updateLargeFormatDimension('width_input', v)"
                  />
                  <BaseInput
                    id="custom-height"
                    :label="`Height (${largeFormatUnitLabel})`"
                    type="number"
                    min="0.1"
                    step="0.1"
                    inputmode="decimal"
                    :model-value="stringValue('height_input')"
                    @update:model-value="(v: string) => updateLargeFormatDimension('height_input', v)"
                  />
                </div>
                <div v-else class="grid grid-cols-2 gap-3">
                  <BaseInput
                    id="custom-width"
                    label="Width (mm)"
                    type="number"
                    min="10"
                    inputmode="numeric"
                    :model-value="stringValue('custom_width_mm')"
                    @update:model-value="(v: string) => store.setField('custom_width_mm', v ? Number(v) : null)"
                  />
                  <BaseInput
                    id="custom-height"
                    label="Height (mm)"
                    type="number"
                    min="10"
                    inputmode="numeric"
                    :model-value="stringValue('custom_height_mm')"
                    @update:model-value="(v: string) => store.setField('custom_height_mm', v ? Number(v) : null)"
                  />
                </div>
              </div>
            </BasePanel>
            <BasePanel v-else-if="sizeField" variant="console" class="p-4">
              <BaseSelect
                id="finished-size"
                label="Finished size"
                :model-value="stringValue(sizeField.key)"
                :options="fieldOptions(sizeField)"
                hint="Choose the final trimmed size."
                @update:model-value="updateField(sizeField, $event)"
              />
            </BasePanel>

            <BasePanel v-if="isLargeFormatProduct && largeFormatMaterialField" variant="console" class="p-4">
              <BaseSelect
                id="large-format-material"
                label="Material"
                :model-value="stringValue(largeFormatMaterialField.key)"
                :options="fieldOptions(largeFormatMaterialField)"
                hint="Choose the material family the shop should price."
                @update:model-value="updateField(largeFormatMaterialField, $event)"
              />
            </BasePanel>

            <BasePanel v-if="isLargeFormatProduct && largeFormatSubtypeField" variant="console" class="p-4">
              <BaseSelect
                id="large-format-subtype"
                label="Format"
                :model-value="stringValue(largeFormatSubtypeField.key)"
                :options="fieldOptions(largeFormatSubtypeField)"
                hint="Tell shops whether this is a banner, poster, sticker, or board."
                @update:model-value="updateField(largeFormatSubtypeField, $event)"
              />
            </BasePanel>
          </div>

          <BasePanel v-if="allowCustomPaperRequest && !isLargeFormatProduct" variant="console" class="p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="console-panel-kicker">Paper request</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Need a different paper?</h3>
              </div>
              <button
                type="button"
                class="shrink-0 text-xs font-medium text-[var(--p-primary)] underline underline-offset-2 hover:no-underline"
                @click="toggleCustomPaperMode"
              >
                {{ isCustomPaperMode ? 'Use standard paper' : 'Request different paper' }}
              </button>
            </div>
            <template v-if="isCustomPaperMode">
              <div class="mt-3 space-y-3">
                <BaseTextarea
                  id="paper-request-note"
                  v-model="paperRequestNote"
                  label="Paper request note"
                  placeholder="e.g. 400gsm duplex board, soft-touch lamination, 170gsm silk..."
                  :rows="3"
                  hint="The shop will confirm availability and pricing."
                  class="[&_textarea]:resize-none"
                />
                <div class="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                  <Icon name="lucide:alert-triangle" class="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                  <span>Requested paper needs shop confirmation. Pricing shown is an estimate only.</span>
                </div>
              </div>
            </template>
          </BasePanel>

          <div v-if="isBookletProduct" class="grid gap-4 md:grid-cols-3">
            <BasePanel variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Cover</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Cover paper</h3>
              </div>
              <div v-if="coverPaperTiers.length" class="flex flex-wrap gap-2">
                <button
                  v-for="tier in coverPaperTiers"
                  :key="tier.id"
                  type="button"
                  class="paper-tier-btn"
                  :class="selectedCoverPaperId === tier.id ? 'paper-tier-btn-active' : 'paper-tier-btn-idle'"
                  @click="selectCoverPaper(tier.id)"
                >
                  <span v-if="tier.recommended" class="paper-tier-star">★</span>
                  <span class="paper-tier-label">{{ tier.label }}</span>
                  <span class="paper-tier-gsm">{{ tier.gsm }}gsm</span>
                </button>
              </div>
              <div v-else class="console-inline-readout">Let the shop advise</div>
            </BasePanel>

            <BasePanel variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Inside pages</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Inside paper</h3>
              </div>
              <div v-if="insertPaperTiers.length" class="flex flex-wrap gap-2">
                <button
                  v-for="tier in insertPaperTiers"
                  :key="tier.id"
                  type="button"
                  class="paper-tier-btn"
                  :class="selectedInsertPaperId === tier.id ? 'paper-tier-btn-active' : 'paper-tier-btn-idle'"
                  @click="selectInsertPaper(tier.id)"
                >
                  <span v-if="tier.recommended" class="paper-tier-star">★</span>
                  <span class="paper-tier-label">{{ tier.label }}</span>
                  <span class="paper-tier-gsm">{{ tier.gsm }}gsm</span>
                </button>
              </div>
              <div v-else class="console-inline-readout">Let the shop advise</div>
            </BasePanel>

            <BasePanel variant="console" class="space-y-3 p-4">
              <div>
                <p class="console-panel-kicker">Booklet content</p>
                <h3 class="text-sm font-semibold text-[var(--p-calculator-text)]">Total pages</h3>
              </div>
              <BaseInput
                id="total-pages"
                label="Total pages"
                type="number"
                min="4"
                step="1"
                inputmode="numeric"
                hint="Include cover pages."
                :model-value="stringValue('total_pages')"
                @update:model-value="(v: string) => store.setField('total_pages', v ? Number(v) : null)"
              />
            </BasePanel>
          </div>

          <BasePanel variant="console" class="overflow-hidden p-0">
            <div class="console-panel-header">
              <div>
                <p class="console-panel-kicker">Primary control</p>
                <h3 class="text-base font-semibold text-[var(--p-calculator-text)]">{{ isBookletProduct ? 'Number of booklets' : 'Quantity' }}</h3>
              </div>
              <span class="console-status-pill">Quantity control</span>
            </div>
            <div class="grid gap-5 p-4 md:grid-cols-[164px_minmax(0,1fr)] md:p-5">
              <div>
                <BaseInput
                  id="calculator-quantity"
                  :label="quantityLabel"
                  :model-value="quantityInputValue"
                  type="number"
                  min="1"
                  inputmode="numeric"
                  hint="Type an exact quantity."
                  class="console-quantity-input"
                  @update:model-value="updateQuantity"
                />
              </div>
              <div class="space-y-3">
                <div class="console-slider-wrap">
                  <input
                    :value="sliderValue"
                    :min="sliderMin"
                    :max="sliderMax"
                    type="range"
                    class="calculator-slider"
                    :style="sliderStyle"
                    @input="updateQuantity(($event.target as HTMLInputElement).value)"
                  >
                </div>
                <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-calculator-muted)]">
                  <span>Min {{ sliderMinLabel }}</span>
                  <span>Max {{ sliderMaxLabel }}</span>
                </div>
              </div>
            </div>
          </BasePanel>

          <div class="grid gap-4">
            <BasePanel variant="console" class="p-4 md:p-5">
              <div class="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p class="console-panel-kicker">Artwork module</p>
                  <h3 class="text-base font-semibold text-[var(--p-calculator-text)]">Upload artwork</h3>
                </div>
                <span class="console-status-pill">Optional upload</span>
              </div>

              <label v-if="!selectedFileName" class="console-upload-zone group">
                <input ref="artworkFileInput" class="hidden" type="file" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" @change="handleFileSelection">
                <div class="console-upload-icon">
                  <Icon name="lucide:cloud-upload" class="size-5 text-[var(--p-primary)] transition-transform group-hover:-translate-y-0.5" />
                </div>
                <div class="space-y-1 text-center">
                  <p class="text-sm font-semibold text-[var(--p-calculator-text)]">Drop file or browse from device</p>
                  <p class="text-[11px] uppercase tracking-[0.18em] text-[var(--p-calculator-muted)]">PDF AI PSD PNG JPG</p>
                </div>
              </label>

              <div v-else class="space-y-3">
                <!-- Upload in progress: full progress card -->
                <UploadProgressHelper
                  v-if="uploadStatus === 'uploading'"
                  :file-name="selectedFileName ?? ''"
                  :file-size="totalBytes"
                  :uploaded-bytes="uploadedBytes"
                  :total-bytes="totalBytes"
                  :progress="totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0"
                  :speed-bytes-per-second="speedBytesPerSecond"
                  :eta-seconds="etaSeconds"
                  state="uploading"
                  @remove="cancelUpload"
                />

                <!-- Post-upload: file row + suggestions / error -->
                <template v-else>
                  <div class="flex items-center gap-3 rounded-xl border border-[color:color-mix(in_srgb,var(--p-border)_84%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_98%,white)] px-4 py-3">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[color:color-mix(in_srgb,var(--p-border)_84%,transparent)] bg-white">
                      <img
                        v-if="artworkPreviewImageUrl"
                        :src="artworkPreviewImageUrl"
                        alt="Artwork preview"
                        class="h-full w-full object-cover"
                      >
                      <Icon v-else :name="artworkPreviewFallbackIcon" class="size-6" :class="artworkStatusIconClass" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-[var(--p-calculator-text)]">{{ selectedFileName }}</p>
                      <p class="text-xs text-[var(--p-calculator-muted)]">{{ artworkMetaLine }}</p>
                    </div>
                    <button type="button" class="shrink-0 text-[var(--p-calculator-muted)] transition hover:text-[var(--p-calculator-text)]" @click="removeArtwork">
                      <Icon name="lucide:x" class="size-4" />
                    </button>
                  </div>

                  <div
                    v-if="uploadStatusMessage"
                    class="space-y-2 rounded-xl border px-4 py-3"
                    :class="artworkStatusPanelClass"
                  >
                    <div class="flex items-start gap-2">
                      <Icon :name="artworkStatusMessageIcon" class="mt-0.5 size-4 shrink-0" />
                      <div class="space-y-1">
                        <p class="text-sm font-semibold">{{ artworkStatusTitle }}</p>
                        <p class="text-xs">{{ uploadStatusMessage }}</p>
                        <p v-if="analysisStatus === 'failed'" class="text-xs">
                          Please confirm the pages, size, cover paper, and inside paper before continuing.
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <BaseButton variant="ghost" size="sm" @click="removeArtwork">Remove file</BaseButton>
                      <BaseButton variant="ghost" size="sm" @click="tryAnotherFile">Try another file</BaseButton>
                      <BaseButton
                        v-if="uploadStatus === 'uploaded' && analysisStatus !== 'analysed'"
                        variant="primary"
                        size="sm"
                        @click="continueManually"
                      >
                        Continue manually
                      </BaseButton>
                    </div>
                  </div>

                  <div v-else-if="artworkSuggestionsVisible && (artworkSuggestedProduct || artworkSuggestions.length)" class="space-y-3 rounded-xl border border-[color:color-mix(in_srgb,var(--p-primary)_28%,var(--p-border))] bg-[color:color-mix(in_srgb,var(--p-primary)_5%,white)] p-4">
                    <div class="flex items-start gap-2">
                      <Icon name="lucide:sparkles" class="mt-0.5 size-4 shrink-0 text-[var(--p-primary)]" />
                      <div class="space-y-0.5">
                        <p class="text-sm font-semibold text-[var(--p-calculator-text)]">{{ artworkDetectedLabel }}</p>
                        <p class="text-xs text-[var(--p-calculator-muted)]">{{ artworkSuggestionCopy }}</p>
                        <p v-if="artworkSuggestedProduct?.reason" class="text-xs text-[var(--p-calculator-muted)]">{{ artworkSuggestedProduct.reason }}</p>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <BaseButton v-if="artworkSuggestions.length" variant="primary" size="sm" @click="applyArtworkSuggestions">Use detected setup</BaseButton>
                      <BaseButton variant="ghost" size="sm" @click="artworkSuggestionsVisible = false">Ignore</BaseButton>
                    </div>
                  </div>

                  <div v-if="artworkWarnings.length" class="space-y-1">
                    <p
                      v-for="warning in artworkWarnings"
                      :key="warning"
                      class="flex items-center gap-1.5 text-xs"
                      :class="artworkWarningClass"
                    >
                      <Icon name="lucide:alert-triangle" class="size-3 shrink-0" />
                      {{ warning }}
                    </p>
                  </div>
                </template>
              </div>
            </BasePanel>

            <BasePanel variant="console" class="overflow-hidden p-0">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
                @click="showMoreDetails = !showMoreDetails"
              >
                <div class="min-w-0">
                  <p class="console-panel-kicker">Secondary controls</p>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-semibold text-[var(--p-calculator-text)]">More job details</h3>
                    <span
                      v-if="moreDetailsSummary"
                      class="truncate text-xs font-medium text-[var(--p-calculator-muted)]"
                    >
                      {{ moreDetailsSummary }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="console-status-pill">{{ showMoreDetails ? 'Open' : 'Collapsed' }}</span>
                  <Icon
                    name="lucide:chevron-down"
                    class="size-4 text-[var(--p-calculator-muted)] transition-transform"
                    :class="showMoreDetails ? 'rotate-180' : ''"
                  />
                </div>
              </button>

              <div v-if="showMoreDetails" class="space-y-4 border-t border-[color:color-mix(in_srgb,var(--p-border)_48%,transparent)] p-4 md:p-5">
                <BasePanel variant="console" class="p-4 md:p-5">
                  <div class="mb-4">
                    <p class="console-panel-kicker">Job notes</p>
                    <h3 class="text-base font-semibold text-[var(--p-calculator-text)]">Anything the shop should know?</h3>
                  </div>
                  <BaseTextarea
                    id="custom-notes"
                    v-model="requestNotes"
                    label="Notes / custom brief"
                    placeholder="Needs to be ready by Friday morning, matte finish preferred, delivery to Westlands..."
                    :rows="4"
                    hint="Use this for deadlines, finishing preferences, or delivery notes."
                    class="[&_textarea]:resize-none"
                  />
                </BasePanel>

                <BasePanel v-if="finishingGroups.length" variant="console" class="p-4 md:p-5">
                  <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p class="console-panel-kicker">Secondary controls</p>
                      <h3 class="text-base font-semibold text-[var(--p-calculator-text)]">Finishing options</h3>
                    </div>
                    <p class="text-sm text-[var(--p-calculator-muted)]">Clear selected and unselected states.</p>
                  </div>
                  <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div v-for="group in finishingGroups" :key="group.key" class="space-y-3">
                      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]/85">{{ group.label }}</p>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="chip in group.chips"
                          :key="chip.key"
                          type="button"
                          class="calculator-chip"
                          :class="chip.active ? 'calculator-chip-active' : 'calculator-chip-idle'"
                          @click="selectFinishingChip(group.key, chip)"
                        >
                          <Icon v-if="chip.active" name="lucide:check-circle-2" class="size-3.5" />
                          <Icon v-else name="lucide:circle" class="size-3.5 opacity-45" />
                          <span>{{ chip.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </BasePanel>
              </div>
            </BasePanel>
          </div>
        </div>

        <div class="space-y-4 lg:sticky lg:top-[92px] lg:self-start">
          <BasePanel variant="display" class="overflow-hidden border-[color:color-mix(in_srgb,var(--p-primary)_18%,var(--p-border))]">
            <div class="console-display-header">
              <div class="flex items-center gap-3">
                <div class="console-display-badge">
                  <Icon name="lucide:factory" class="size-4" />
                </div>
                <div>
                  <p class="console-panel-kicker">Instrument readout</p>
                  <h3 class="text-sm font-bold uppercase tracking-[0.22em] text-[var(--p-calculator-text)]">Production preview</h3>
                </div>
              </div>
              <BaseBadge v-if="preview" tone="primary" size="sm">Marketplace live</BaseBadge>
            </div>

            <div v-if="!showProductionPreview" class="space-y-4 px-5 py-8 text-center">
              <div class="mx-auto flex size-14 items-center justify-center rounded-[1.4rem] bg-[color:color-mix(in_srgb,var(--p-calculator-bg)_72%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                <Icon name="lucide:layers" class="size-6 text-[var(--p-calculator-muted)]" />
              </div>
              <p class="text-sm leading-6 text-[var(--p-calculator-muted)]">Configure the job and this readout will show sheet fit, finishing flow, and pricing logic.</p>
            </div>

            <div v-else class="divide-y divide-[color:color-mix(in_srgb,var(--p-border)_22%,transparent)]">
              <div v-if="bookletMissingMessages.length" class="space-y-2 p-5">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-[var(--p-calculator-muted)]">Complete the job details</p>
                <p v-for="msg in bookletMissingMessages" :key="msg" class="text-xs leading-5 text-[var(--p-calculator-muted)]">→ {{ msg }}</p>
              </div>

              <div v-if="largeFormatProductionData" class="grid gap-4 p-5">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="console-display-cell">
                    <p class="console-cell-label">Roll layout</p>
                    <p class="console-cell-value">{{ largeFormatProductionData.itemsPerRow != null ? `${largeFormatProductionData.itemsPerRow}-across` : '-' }}</p>
                    <p class="console-cell-note">{{ largeFormatProductionData.rollWidthLabel }}</p>
                  </div>
                  <div class="console-display-cell">
                    <p class="console-cell-label">Used material length</p>
                    <p class="console-cell-value">{{ largeFormatProductionData.usedLengthLabel }}</p>
                    <p class="console-cell-note">{{ largeFormatProductionData.orientationLabel }}</p>
                  </div>
                </div>
                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="console-display-cell">
                    <p class="console-cell-label">Printed area</p>
                    <p class="console-cell-value">{{ largeFormatProductionData.printedAreaLabel }}</p>
                    <p class="console-cell-note">Artwork coverage</p>
                  </div>
                  <div class="console-display-cell">
                    <p class="console-cell-label">Charged area</p>
                    <p class="console-cell-value">{{ largeFormatProductionData.chargedAreaLabel }}</p>
                    <p class="console-cell-note">Material billing base</p>
                  </div>
                  <div class="console-display-cell">
                    <p class="console-cell-label">Waste</p>
                    <p class="console-cell-value">{{ largeFormatProductionData.wasteAreaLabel }}</p>
                    <p class="console-cell-note">{{ largeFormatProductionData.rowsLabel }}</p>
                  </div>
                </div>
                <div class="space-y-1 text-xs leading-5 text-[var(--p-calculator-muted)]">
                  <p v-if="largeFormatProductionData.finishedSizeLabel">Finished size — {{ largeFormatProductionData.finishedSizeLabel }}</p>
                  <p v-if="largeFormatProductionData.tilingLabel">{{ largeFormatProductionData.tilingLabel }}</p>
                  <p v-if="largeFormatProductionData.overlapLabel">{{ largeFormatProductionData.overlapLabel }}</p>
                </div>
              </div>

              <div v-else-if="productionData && !isBookletProduct" class="grid gap-4 p-5">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="console-display-cell">
                    <p class="console-cell-label">How it fits on a sheet</p>
                    <p class="console-cell-value">{{ productionData.piecesPerSheet != null ? `${productionData.piecesPerSheet}-up` : '-' }}</p>
                    <p class="console-cell-note">{{ productionData.parentSheet ? `on ${productionData.parentSheet}` : 'per sheet' }}</p>
                  </div>
                  <div class="console-display-cell">
                    <p class="console-cell-label">Sheets needed</p>
                    <p class="console-cell-value">{{ productionData.sheetsRequired != null ? productionData.sheetsRequired.toLocaleString() : '-' }}</p>
                    <p class="console-cell-note">for {{ Number(form.quantity || 0).toLocaleString() || '0' }} finished pieces</p>
                  </div>
                </div>
                <p class="text-xs leading-5 text-[var(--p-calculator-muted)]">{{ productionData.impositionLabel || 'Optimized to keep paper waste low.' }}</p>
              </div>

              <div v-if="bookletProductionData" class="grid gap-4 p-5">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="console-display-cell">
                    <p class="console-cell-label">Pages</p>
                    <p class="console-cell-value">{{ bookletProductionData.normalizedPages ?? '-' }}</p>
                    <p class="console-cell-note">{{ bookletProductionData.blankPagesAdded ? `+${bookletProductionData.blankPagesAdded} blank added` : 'no blanks added' }}</p>
                  </div>
                  <div class="console-display-cell">
                    <p class="console-cell-label">Sheets total</p>
                    <p class="console-cell-value">{{ ((bookletProductionData.coverSheets ?? 0) + (bookletProductionData.insertSheets ?? 0)).toLocaleString() }}</p>
                    <p class="console-cell-note">{{ bookletProductionData.coverSheets }} cover + {{ bookletProductionData.insertSheets }} insert</p>
                  </div>
                </div>
                <div class="space-y-1 text-xs leading-5 text-[var(--p-calculator-muted)]">
                  <p v-if="bookletProductionData.coverPaperLabel">Cover — {{ bookletProductionData.coverPaperLabel }}</p>
                  <p v-if="bookletProductionData.insertPaperLabel">Inside — {{ bookletProductionData.insertPaperLabel }}</p>
                  <p v-if="bookletProductionData.bindingLabel">Binding — {{ bookletProductionData.bindingLabel }}</p>
                </div>
              </div>

              <div v-if="(finishingStatusItems.length || productionData?.cuttingRequired) && !isLargeFormatProduct" class="space-y-3 p-5">
                <p class="console-cell-label">After printing</p>
                <div v-if="productionData?.cuttingRequired" class="console-finish-row">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:scissors" class="size-3.5 text-green-500" />
                    <span class="text-xs font-semibold text-[var(--p-calculator-text)]">Precision cutting included</span>
                  </div>
                  <span class="console-row-detail">Enabled</span>
                </div>
                <div
                  v-for="item in finishingStatusItems"
                  :key="item.key"
                  class="console-finish-row"
                >
                  <div class="flex min-w-0 items-center gap-2">
                    <Icon
                      :name="item.status === 'selected' ? 'lucide:check-circle-2' : (item.status === 'expected' ? 'lucide:info' : 'lucide:sparkles')"
                      class="size-3.5 shrink-0"
                      :class="item.status === 'selected' ? 'text-green-500' : 'text-[var(--p-primary)]/70'"
                    />
                    <span class="truncate text-xs font-semibold text-[var(--p-calculator-text)]">{{ item.name }}</span>
                  </div>
                  <span class="console-row-detail">{{ item.detail }}</span>
                </div>
              </div>

              <div v-if="pricingBreakdown" class="space-y-3 p-5">
                <p class="console-cell-label">Price logic</p>
                <div class="console-price-box">
                  <p v-if="priceExplanationTotal" class="text-sm font-semibold text-[var(--p-calculator-text)]">{{ priceExplanationTotal }}</p>
                  <p v-if="largeFormatPricingSummary" class="text-xs text-[var(--p-calculator-muted)]">{{ largeFormatPricingSummary }}</p>
                  <p v-if="pricingBreakdown.formula" class="font-mono text-[11px] text-[var(--p-calculator-muted)]">formula: {{ pricingBreakdown.formula }}</p>
                </div>
                <div v-if="pricingBreakdown.lines?.length" class="space-y-1.5">
                  <p v-for="(line, i) in pricingBreakdown.lines" :key="i" class="text-xs text-[var(--p-calculator-muted)]">
                    - {{ line.label }}<span v-if="line.amount"> - {{ line.amount }}</span>
                  </p>
                </div>
              </div>

              <div v-if="preview?.warnings?.length || preview?.assumptions?.length" class="grid gap-4 p-5">
                <div v-if="preview?.warnings?.length" class="space-y-1.5">
                  <p class="console-cell-label">Notes</p>
                  <p v-for="warning in preview.warnings" :key="warning" class="text-xs leading-5 text-[var(--p-calculator-muted)]">- {{ warning }}</p>
                </div>
                <div v-if="preview?.assumptions?.length" class="space-y-1.5">
                  <p class="console-cell-label">Assumed for pricing</p>
                  <p v-for="assumption in preview.assumptions" :key="assumption" class="text-xs leading-5 text-[var(--p-calculator-muted)]">- {{ assumption }}</p>
                </div>
              </div>

              <div v-if="preview?.breakdown" class="bg-[color:color-mix(in_srgb,var(--p-calculator-bg)_30%,transparent)]">
                <button
                  type="button"
                  class="flex w-full items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-calculator-muted)] transition hover:text-[var(--p-calculator-text)]"
                  @click="showFullBreakdown = !showFullBreakdown"
                >
                  <span>{{ showFullBreakdown ? 'Hide technical breakdown' : 'Show technical breakdown' }}</span>
                  <Icon name="lucide:chevron-down" class="size-3 transition-transform" :class="showFullBreakdown ? 'rotate-180' : ''" />
                </button>
                <div v-if="showFullBreakdown" class="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-4 text-[10px]">
                  <div
                    v-for="(val, key) in preview.breakdown"
                    :key="key"
                    class="rounded-xl border border-[color:color-mix(in_srgb,var(--p-border)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_76%,transparent)] px-3 py-2"
                  >
                    <p class="truncate font-medium uppercase tracking-[0.14em] text-[var(--p-calculator-muted)]">{{ String(key).replace(/_/g, ' ') }}</p>
                    <p class="mt-1 truncate font-bold text-[var(--p-calculator-text)]">{{ val }}</p>
                  </div>
                </div>
              </div>
            </div>
          </BasePanel>

          <BasePanel variant="console" class="space-y-4 border-[color:color-mix(in_srgb,var(--p-primary)_24%,var(--p-border))] bg-[color:color-mix(in_srgb,var(--p-surface)_98%,white)] p-4">
            <BaseButton
              class="!h-14 !w-full !rounded-[1.25rem] !text-base !font-bold uppercase tracking-[0.16em]"
              variant="primary"
              size="lg"
              type="submit"
              block
              :disabled="previewLoading"
            >
              {{ previewLoading ? 'Getting prices...' : 'Show matching shops' }}
            </BaseButton>
            <p class="text-center text-[11px] text-[var(--p-calculator-muted)]">
              <span v-if="syncState === 'saving'">Saving draft...</span>
              <span v-else-if="hasMounted && syncState === 'saved' && lastSavedAt">Draft saved {{ formatSavedTime(lastSavedAt) }}</span>
              <span v-else-if="syncState === 'error'">Draft save failed. We&apos;ll try again.</span>
            </p>
            <div class="flex items-center justify-center gap-4 text-xs font-medium text-[var(--p-calculator-muted)]">
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:shield-check" class="size-4 text-green-500" />
                <span>No signup needed</span>
              </div>
              <div class="h-1 w-1 rounded-full bg-[var(--p-border)]" />
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:zap" class="size-4 text-amber-500" />
                <span>Instant results</span>
              </div>
            </div>
          </BasePanel>
        </div>
      </div>
    </form>

    <div
      v-if="previewError"
      class="rounded-[1.6rem] border border-[var(--p-error)]/40 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
    >
      {{ previewError }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BasePanel from '~/components/ui/BasePanel.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import type { CalculatorFieldConfig, ColorModeOption, PaperTierOption, PricingBreakdown, ProductionPreview, SizeOption } from '~/types/api/calculator'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { humanOptionLabel } from '~/utils/fieldLabels'
import { uploadArtworkXHR } from '~/services/artwork'
import type { ArtworkSuggestion, ArtworkDetected, ArtworkSuggestedProduct } from '~/services/artwork'
import { getApiBase, resolveMediaUrl } from '~/shared/runtime-url'
import { usePrintyToast } from '~/composables/usePrintyToast'
import UploadProgressHelper from '~/components/ui/UploadProgressHelper.vue'

type FieldOption = {
  label: string
  value: string
}

type FinishingChip = {
  key: string
  label: string
  active: boolean
  type: 'boolean' | 'select'
  value: boolean | string
}

type FinishingGroup = {
  key: string
  label: string
  chips: FinishingChip[]
}

type FinishingStatusItem = {
  key: string
  name: string
  status: 'selected' | 'expected' | 'common'
  detail: string
}

const store = useCalculatorStore()
const authStore = useAuthStore()
const draftRecoveryStore = useCalculatorDraftRecoveryStore()
const toast = usePrintyToast()
const {
  configLoading,
  configError,
  selectedProductType,
  selectedProduct,
  productOptions,
  fields,
  form,
  preview,
  previewLoading,
  previewLoaded,
  previewError,
} = storeToRefs(store)
const { guestDraft, requestNotes, resumePromptVisible, selectedFileName, syncState, lastSavedAt } = storeToRefs(draftRecoveryStore)

const hasMounted = ref(false)
const showFullBreakdown = ref(false)
const showMoreDetails = ref(false)
const lastPreviewErrorToast = ref<string | null>(null)
const lastMissingFieldsToast = ref('')
const uploadToastId = ref<string | null>(null)
const isCustomPaperMode = ref(false)
const paperRequestNote = ref('')

type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'failed'
type AnalysisStatus = 'idle' | 'analysing' | 'analysed' | 'failed' | 'skipped'
const uploadStatus = ref<UploadStatus>('idle')
const analysisStatus = ref<AnalysisStatus>('idle')
const artworkStatusMessage = ref<string | null>(null)
const analysisErrorMessage = ref<string | null>(null)
const artworkSuggestions = ref<ArtworkSuggestion[]>([])
const artworkWarnings = ref<string[]>([])
const artworkSuggestionsVisible = ref(false)
const artworkDetected = ref<ArtworkDetected | null>(null)
const artworkPreviewImage = ref<string | null>(null)
const artworkSuggestedProduct = ref<ArtworkSuggestedProduct | null>(null)
const artworkFileInput = ref<HTMLInputElement | null>(null)
const uploadedBytes = ref(0)
const totalBytes = ref(0)
const speedBytesPerSecond = ref<number | null>(null)
const etaSeconds = ref<number | null>(null)
const speedWindow: Array<{ loaded: number; time: number }> = []
let xhrAbortController: AbortController | null = null
const suppressAutoSelections = ref(false)

const runtimeConfig = useRuntimeConfig()
const _apiBase = computed(() => getApiBase(runtimeConfig.public))

const finishingFieldKeys = new Set([
  'lamination',
  'cover_lamination',
  'folding',
  'cutting',
  'binding_type',
  'corner_rounding',
  'cut_type',
])

onMounted(async () => {
  hasMounted.value = true
  if (!store.config) {
    try {
      await store.loadConfig()
    } catch {
      // configError is set by the store; component shows error state via v-else-if="configError"
    }
  }
  await draftRecoveryStore.maybeResumeFromRoute(store)
})

watchDebounced(
  () => [
    selectedProductType.value,
    JSON.stringify(form.value),
    JSON.stringify(preview.value ?? null),
    requestNotes.value,
    selectedFileName.value,
  ],
  async () => {
    await draftRecoveryStore.autosave({
      form: {
        ...form.value,
        product_type: selectedProductType.value,
      },
      preview: (preview.value as Record<string, unknown> | null) ?? null,
      isAuthenticated: authStore.isAuthenticated,
      isClient: authStore.isClient,
      selectedProductId: null,
    })
  },
  { debounce: 800, maxWait: 2500 },
)

const moreDetailsSelections = computed(() => {
  const selections: string[] = []
  const activeFinishingCount = finishingGroups.value.reduce(
    (count, group) => count + group.chips.filter(chip => chip.active && chip.label !== 'None').length,
    0,
  )

  if (activeFinishingCount > 0) {
    selections.push(
      activeFinishingCount === 1 ? '1 finishing selected' : `${activeFinishingCount} finishings selected`,
    )
  }

  if (requestNotes.value.trim()) {
    selections.push('Notes added')
  }

  return selections
})

const moreDetailsSummary = computed(() => moreDetailsSelections.value.join(' • '))

const artworkPreviewImageUrl = computed(() => (
  artworkPreviewImage.value ? resolveMediaUrl(artworkPreviewImage.value, runtimeConfig.public) : null
))
const artworkPreviewFallbackIcon = computed(() => (
  selectedFileName.value?.toLowerCase().endsWith('.pdf') ? 'lucide:file-text' : artworkStatusIcon.value
))
const artworkSizeLabel = computed(() => {
  if (artworkDetected.value?.size_label) return artworkDetected.value.size_label
  const width = artworkDetected.value?.width_mm
  const height = artworkDetected.value?.height_mm
  if (typeof width !== 'number' || typeof height !== 'number') return null
  return matchKnownSize(width, height)
})
const artworkMetaLine = computed(() => {
  const parts: string[] = []
  const pages = artworkDetected.value?.pages
  if (typeof pages === 'number' && pages > 0) {
    parts.push(`${pages} ${pages === 1 ? 'page' : 'pages'}`)
  }
  if (artworkSizeLabel.value) {
    parts.push(artworkSizeLabel.value)
  } else if (
    typeof artworkDetected.value?.width_mm === 'number'
    && typeof artworkDetected.value?.height_mm === 'number'
  ) {
    parts.push(`${artworkDetected.value.width_mm} x ${artworkDetected.value.height_mm} mm`)
  }
  if (totalBytes.value > 0) {
    parts.push(formatFileSize(totalBytes.value))
  }
  return parts.join(' · ') || 'File attached'
})

const artworkDetectedLabel = computed(() => {
  if (!artworkSuggestedProduct.value) return 'We detected your PDF'
  return artworkSuggestedProduct.value.confidence === 'low'
    ? `This file might be ${artworkSuggestedProduct.value.label}.`
    : `We detected this may be ${artworkSuggestedProduct.value.label}.`
})
const artworkSuggestionCopy = computed(() => {
  const parts = [artworkMetaLine.value]
  if (!artworkSuggestions.value.length) {
    parts.push('Please confirm the setup manually before pricing.')
  } else if (artworkSuggestedProduct.value?.confidence === 'low') {
    parts.push('Please confirm before pricing.')
  } else {
    parts.push('Apply these values to the calculator?')
  }
  return parts.filter(Boolean).join(' ')
})
const uploadStatusMessage = computed(() => {
  if (uploadStatus.value === 'failed') {
    return artworkStatusMessage.value ?? 'File upload failed. Please try again.'
  }
  if (uploadStatus.value === 'uploaded' && analysisStatus.value === 'failed') {
    return analysisErrorMessage.value
      ? `File uploaded successfully. We could not read the PDF details automatically. (${analysisErrorMessage.value})`
      : 'File uploaded successfully. We could not read the PDF details automatically.'
  }
  if (uploadStatus.value === 'uploaded' && analysisStatus.value === 'skipped') {
    return 'File uploaded successfully. Automatic PDF analysis was skipped for this file type.'
  }
  return null
})
const artworkStatusTitle = computed(() => {
  if (uploadStatus.value === 'failed') return 'Upload failed'
  if (analysisStatus.value === 'failed') return 'Manual review needed'
  if (analysisStatus.value === 'skipped') return 'Manual setup needed'
  return 'Artwork attached'
})
const artworkStatusMessageIcon = computed(() => {
  if (uploadStatus.value === 'failed') return 'lucide:circle-alert'
  if (analysisStatus.value === 'failed') return 'lucide:triangle-alert'
  return 'lucide:info'
})
const artworkStatusIcon = computed(() => {
  if (uploadStatus.value === 'failed') return 'lucide:file-x'
  if (analysisStatus.value === 'failed') return 'lucide:file-warning'
  if (analysisStatus.value === 'skipped') return 'lucide:file-info'
  return 'lucide:file-check'
})
const artworkStatusIconClass = computed(() => {
  if (uploadStatus.value === 'failed') return 'text-[var(--p-error,#dc2626)]'
  if (analysisStatus.value === 'failed') return 'text-amber-500'
  if (analysisStatus.value === 'skipped') return 'text-sky-500'
  return 'text-green-500'
})
const artworkStatusPanelClass = computed(() => {
  if (uploadStatus.value === 'failed') {
    return 'border-[var(--p-error)]/35 bg-[var(--p-error-soft)] text-[var(--p-error,#dc2626)]'
  }
  if (analysisStatus.value === 'failed') {
    return 'border-amber-300 bg-amber-50 text-amber-800'
  }
  return 'border-sky-300 bg-sky-50 text-sky-800'
})
const artworkWarningClass = computed(() => (
  analysisStatus.value === 'skipped'
    ? 'text-sky-700'
    : 'text-amber-600 dark:text-amber-400'
))
const hasMoreDetailsError = computed(() =>
  /finish|lamination|binding|fold|corner|cut|brief|note/i.test(previewError.value ?? ''),
)

watch(hasMoreDetailsError, (hasError) => {
  if (hasError) {
    showMoreDetails.value = true
  }
}, { immediate: true })

watch(previewError, (message) => {
  const normalized = message?.trim() || null
  if (!normalized || normalized === lastPreviewErrorToast.value) return
  lastPreviewErrorToast.value = normalized
  toast.priceFailed(normalized)
})

const sizeField = computed(() => getField('finished_size'))
const sizeOptions = computed<SizeOption[]>(() => selectedProduct.value?.size_options ?? [])
const allowCustomSize = computed(() => selectedProduct.value?.allow_custom_size ?? false)
const selectedSizeId = computed(() => stringValue('finished_size'))
const isCustomSize = computed(() => selectedSizeId.value === 'custom')
const isLargeFormatProduct = computed(() => selectedProductType.value === 'large_format')
const largeFormatUnitOptions: FieldOption[] = [
  { label: 'Millimetres', value: 'mm' },
  { label: 'Centimetres', value: 'cm' },
  { label: 'Metres', value: 'm' },
  { label: 'Inches', value: 'in' },
]
const largeFormatUnitLabel = computed(() => stringValue('input_unit') || 'mm')
const largeFormatMaterialField = computed(() => getField('material_type'))
const largeFormatSubtypeField = computed(() => getField('product_subtype'))

watch(
  () => selectedProduct.value?.key,
  () => {
    if (suppressAutoSelections.value) return
    const sizes = sizeOptions.value
    if (!sizes.length) return
    const current = stringValue('finished_size')
    if (current === 'custom') return
    if (sizes.some(s => s.id === current)) {
      if (
        isLargeFormatProduct.value
        && form.value.width_mm == null
        && form.value.height_mm == null
        && form.value.width_input == null
        && form.value.height_input == null
      ) {
        selectSize(current)
      }
      return
    }
    const rec = sizes.find(s => s.recommended) ?? sizes[0]
    if (rec) selectSize(rec.id)
  },
  { immediate: true },
)

const isBookletProduct = computed(() => selectedProductType.value === 'booklet')
const quantityLabel = computed(() => {
  if (isBookletProduct.value) return 'Number of booklets'
  if (isLargeFormatProduct.value) return 'Units'
  return 'Pieces'
})

const coverPaperTiers = computed<PaperTierOption[]>(() => selectedProduct.value?.cover_paper_options ?? [])
const selectedCoverPaperId = computed(() => stringValue('cover_stock'))
const insertPaperTiers = computed<PaperTierOption[]>(() => selectedProduct.value?.insert_paper_options ?? [])
const selectedInsertPaperId = computed(() => stringValue('insert_stock'))

watch(
  () => selectedProduct.value?.key,
  () => {
    if (suppressAutoSelections.value) return
    const covers = coverPaperTiers.value
    if (covers.length) {
      const current = stringValue('cover_stock')
      if (!current || !covers.some(t => t.id === current)) {
        const rec = covers.find(t => t.recommended) ?? covers[0]
        if (rec) store.setField('cover_stock', rec.id)
      }
    }
    const inserts = insertPaperTiers.value
    if (inserts.length) {
      const current = stringValue('insert_stock')
      if (!current || !inserts.some(t => t.id === current)) {
        const rec = inserts.find(t => t.recommended) ?? inserts[0]
        if (rec) store.setField('insert_stock', rec.id)
      }
    }
  },
  { immediate: true },
)

const bookletProductionData = computed(() => {
  const pp: ProductionPreview | null | undefined = preview.value?.production_preview
  if (!pp || !isBookletProduct.value) return null
  if (pp.booklet_normalized_pages == null && pp.booklet_cover_sheets == null) return null
  return {
    normalizedPages: pp.booklet_normalized_pages,
    blankPagesAdded: pp.booklet_blank_pages_added ?? 0,
    coverPages: pp.booklet_cover_pages,
    insertPages: pp.booklet_insert_pages,
    coverSheets: pp.booklet_cover_sheets,
    insertSheets: pp.booklet_insert_sheets,
    bindingLabel: pp.booklet_binding_label,
    coverPaperLabel: pp.booklet_cover_paper_label,
    insertPaperLabel: pp.booklet_insert_paper_label,
  }
})

const largeFormatProductionData = computed(() => {
  const pp: ProductionPreview | null | undefined = preview.value?.production_preview
  if (!pp || !isLargeFormatProduct.value) return null
  if (pp.roll_width_mm == null && pp.used_length_m == null && pp.charged_area_m2 == null) return null

  const finishWidth = pp.input_size_m?.width
  const finishHeight = pp.input_size_m?.height
  const panelCount = pp.tiling?.panel_count ?? 0

  return {
    itemsPerRow: pp.items_per_row,
    rows: pp.rows,
    rollWidthLabel: pp.roll_width_m != null ? `${pp.roll_width_m.toFixed(2)} m roll width` : 'Roll width on request',
    usedLengthLabel: pp.used_length_m != null ? `${pp.used_length_m.toFixed(2)} m` : '-',
    orientationLabel: pp.orientation ? `${pp.orientation === 'rotated' ? 'Rotated' : 'Standard'} placement` : 'Orientation on request',
    printedAreaLabel: pp.printed_area_m2 != null ? `${pp.printed_area_m2.toFixed(2)} m²` : '-',
    chargedAreaLabel: pp.charged_area_m2 != null ? `${pp.charged_area_m2.toFixed(2)} m²` : '-',
    wasteAreaLabel: pp.waste_area_m2 != null ? `${pp.waste_area_m2.toFixed(2)} m²` : '-',
    rowsLabel: pp.rows != null ? `${pp.rows} row${pp.rows === 1 ? '' : 's'}` : 'Rows on request',
    finishedSizeLabel: finishWidth != null && finishHeight != null
      ? `${finishWidth.toFixed(2)} × ${finishHeight.toFixed(2)} m`
      : null,
    tilingLabel: pp.tiling?.required
      ? `Tiled into ${panelCount} panel${panelCount === 1 ? '' : 's'}.`
      : 'Prints as one continuous panel.',
    overlapLabel: pp.overlap_area_m2 && pp.overlap_area_m2 > 0
      ? `Overlap adds ${pp.overlap_area_m2.toFixed(2)} m² of extra print area.`
      : null,
  }
})

const MISSING_FIELD_LABELS: Record<string, string> = {
  total_pages: 'Add total pages',
  cover_stock: 'Choose cover paper',
  insert_stock: 'Choose inside pages paper',
  quantity: 'Add number of booklets',
  finished_size: 'Choose a finished size',
  paper_stock: 'Choose paper',
  material_type: 'Choose a material',
  width_mm: 'Add width',
  height_mm: 'Add height',
  pages: 'Total pages must be greater than 4',
}

const bookletMissingMessages = computed(() => {
  if (!previewLoaded.value || preview.value?.can_calculate !== false) return []
  return (preview.value?.missing_fields ?? []).map(f => MISSING_FIELD_LABELS[f] ?? f.replace(/_/g, ' '))
})

watch(bookletMissingMessages, (messages) => {
  if (!messages.length) {
    lastMissingFieldsToast.value = ''
    return
  }

  const previewKey = messages.join('|')
  if (previewKey === lastMissingFieldsToast.value) return
  lastMissingFieldsToast.value = previewKey
  toast.missingFields(messages)
})

const primaryPaperField = computed(() => getField('paper_stock') ?? getField('cover_stock') ?? null)
const primaryPaperOptions = computed(() => primaryPaperField.value ? fieldOptions(primaryPaperField.value) : [])

const paperTiers = computed<PaperTierOption[]>(() => selectedProduct.value?.paper_options ?? [])
const selectedPaperTierId = computed(() => stringValue('paper_stock'))

const colorModeOptions = computed<ColorModeOption[]>(() => selectedProduct.value?.color_mode_options ?? [])
const selectedColorMode = computed(() => stringValue('color_mode'))
const allowCustomPaperRequest = computed(() => selectedProduct.value?.allow_custom_paper_request ?? false)

watch(
  () => preview.value?.matches_count,
  (count) => {
    if (!previewLoaded.value || !preview.value?.can_calculate || !count) return
    toast.priceReady(count)
  },
)

watch(
  () => selectedProduct.value?.key,
  () => {
    if (suppressAutoSelections.value) return
    const modes = colorModeOptions.value
    if (!modes.length) return
    const current = stringValue('color_mode')
    if (!current || !modes.some(m => m.value === current)) {
      const defaultMode = selectedProduct.value?.defaults?.color_mode as string | undefined
      const match = defaultMode ? modes.find(m => m.value === defaultMode) : null
      store.setField('color_mode', (match ?? modes[0])?.value ?? 'COLOR')
    }
  },
  { immediate: true },
)

watch(
  () => selectedProductType.value,
  () => {
    isCustomPaperMode.value = false
    paperRequestNote.value = ''
    store.setField('paper_selection_mode', null)
    store.setField('requested_paper_note', null)
  },
)

watch(paperRequestNote, (note) => {
  store.setField('requested_paper_note', note || null)
})

watch(
  () => selectedProduct.value?.key,
  () => {
    if (suppressAutoSelections.value) return
    const tiers = paperTiers.value
    if (!tiers.length) return
    const current = stringValue('paper_stock')
    if (tiers.some(t => t.id === current)) return
    const rec = tiers.find(t => t.recommended) ?? tiers[0]
    if (rec) store.setField('paper_stock', rec.id)
  },
  { immediate: true },
)

watch(
  () => selectedProduct.value?.key,
  () => {
    if (suppressAutoSelections.value || !isLargeFormatProduct.value) return
    const materialField = largeFormatMaterialField.value
    if (materialField?.options?.length) {
      const current = stringValue(materialField.key)
      const validValues = materialField.options.map(option => String(option.value ?? option.key ?? ''))
      if (!current || !validValues.includes(current)) {
        const first = validValues[0]
        if (first) store.setField(materialField.key, first)
      }
    }

    const subtypeField = largeFormatSubtypeField.value
    if (subtypeField?.options?.length) {
      const current = stringValue(subtypeField.key)
      const validValues = subtypeField.options.map(option => String(option.value ?? option.key ?? ''))
      if (!current || !validValues.includes(current)) {
        const first = validValues[0]
        if (first) store.setField(subtypeField.key, first)
      }
    }
  },
  { immediate: true },
)

const finishingGroups = computed<FinishingGroup[]>(() =>
  fields.value
    .filter(field => finishingFieldKeys.has(field.key))
    .map((field) => {
      if (field.type === 'boolean') {
        return {
          key: field.key,
          label: finishingGroupLabel(field),
          chips: [
            {
              key: `${field.key}-toggle`,
              label: chipLabel(field.label),
              active: booleanValue(field.key),
              type: 'boolean',
              value: true,
            },
          ],
        }
      }

      const options = fieldOptions(field)
      const selectedValue = stringValue(field.key)
      const chips = options.map(option => ({
        key: `${field.key}-${option.value}`,
        label: optionLabel(option.label),
        active: selectedValue === option.value,
        type: 'select' as const,
        value: option.value,
      }))

      return {
        key: field.key,
        label: finishingGroupLabel(field),
        chips,
      }
    }),
)

const defaultQuantity = computed(() => {
  const fallback = Number(selectedProduct.value?.defaults?.quantity ?? 100)
  return Number.isFinite(fallback) && fallback > 0 ? fallback : 100
})

const quantityNumber = computed(() => {
  const raw = Number(form.value.quantity ?? defaultQuantity.value)
  return Number.isFinite(raw) && raw > 0 ? raw : defaultQuantity.value
})

const sliderMin = 1

const sliderMax = computed(() => {
  const candidate = Math.max(defaultQuantity.value * 100, quantityNumber.value, 1000)
  return Math.min(candidate, 100000)
})

const sliderValue = computed(() => clampQuantity(quantityNumber.value))
const quantityInputValue = computed(() => stringValue('quantity') || String(defaultQuantity.value))
const sliderMinLabel = computed(() => sliderMin.toLocaleString())
const sliderMaxLabel = computed(() => sliderMax.value.toLocaleString())

const sliderStyle = computed(() => {
  const percent = ((sliderValue.value - sliderMin) / Math.max(sliderMax.value - sliderMin, 1)) * 100
  return {
    background: `linear-gradient(90deg, var(--p-primary) 0%, color-mix(in srgb, var(--p-primary) 82%, white) ${percent}%, color-mix(in srgb, var(--p-border) 34%, transparent) ${percent}%, color-mix(in srgb, var(--p-border) 34%, transparent) 100%)`,
  }
})

const productionData = computed((): {
  piecesPerSheet: number | null
  sheetsRequired: number | null
  parentSheet: string | null
  impositionLabel: string | null
  cuttingRequired: boolean | null
  selectedFinishings: string[]
  suggestedFinishings: string[]
} | null => {
  const pp: ProductionPreview | null | undefined = preview.value?.production_preview
  if (!pp) return null
  return {
    piecesPerSheet: pp.pieces_per_sheet,
    sheetsRequired: pp.sheets_required,
    parentSheet: pp.parent_sheet,
    impositionLabel: pp.imposition_label,
    cuttingRequired: pp.cutting_required,
    selectedFinishings: pp.selected_finishings ?? [],
    suggestedFinishings: pp.suggested_finishings ?? [],
  }
})

const pricingBreakdown = computed((): PricingBreakdown | null => preview.value?.pricing_breakdown ?? null)

const priceExplanationTotal = computed((): string | null => {
  const bd = pricingBreakdown.value
  if (!bd) return null
  const fmt = (n: number | null | undefined) => (n != null ? `KES ${n.toLocaleString()}` : null)
  const total = fmt(bd.total_per_sheet)
  if (total) return `${total} per sheet`
  const estimate = fmt(bd.estimated_total)
  if (estimate) return `${estimate} estimated total`
  return estimate
})

const largeFormatPricingSummary = computed(() => {
  const bd = pricingBreakdown.value
  if (!bd || !isLargeFormatProduct.value) return null
  const parts: string[] = []
  if (bd.method === 'per_linear_meter' && bd.charged_length_m != null && bd.rate != null) {
    parts.push(`${bd.charged_length_m.toFixed(2)} lm at KES ${bd.rate.toLocaleString()} per lm`)
  } else if (bd.charged_area_m2 != null && bd.rate != null) {
    parts.push(`${bd.charged_area_m2.toFixed(2)} m² at KES ${bd.rate.toLocaleString()} per m²`)
  }
  if (bd.minimum_charge_applied) {
    parts.push('minimum charge applied')
  }
  return parts.join(' · ') || null
})

const finishingStatusItems = computed((): FinishingStatusItem[] => {
  if (!finishingGroups.value.length) return []
  const requiredFields = selectedProduct.value?.required_fields ?? []
  const optionalFields = selectedProduct.value?.optional_fields ?? []

  return finishingGroups.value.flatMap((group): FinishingStatusItem[] => {
    const activeChip = group.chips.find(chip => chip.active)

    if (activeChip && activeChip.label !== 'None') {
      return [{ key: group.key, name: group.label, status: 'selected', detail: activeChip.label }]
    }

    const isCuttingLike = group.key === 'cutting' || group.key === 'cut_type'
    if (requiredFields.includes(group.key) || isCuttingLike) {
      return [{ key: group.key, name: group.label, status: 'expected', detail: 'Expected' }]
    }
    if (optionalFields.includes(group.key)) {
      return [{ key: group.key, name: group.label, status: 'common', detail: 'Add-on' }]
    }
    return []
  })
})

const showProductionPreview = computed(() =>
  finishingStatusItems.value.length > 0
    || largeFormatProductionData.value !== null
    || (productionData.value !== null && !isBookletProduct.value)
    || bookletProductionData.value !== null
    || bookletMissingMessages.value.length > 0
    || (!!preview.value && (
      (preview.value.assumptions?.length ?? 0) > 0
      || (preview.value.warnings?.length ?? 0) > 0
    )),
)

function getField(key: string): CalculatorFieldConfig | null {
  return fields.value.find(field => field.key === key) ?? null
}

function stringValue(key: string): string {
  const value = form.value[key]
  return value == null ? '' : String(value)
}

function booleanValue(key: string): boolean {
  return Boolean(form.value[key])
}

function updateBoolean(key: string, value: boolean) {
  store.setField(key, value)
}

function updateField(field: CalculatorFieldConfig, rawValue: string) {
  if (field.type === 'number') {
    store.setField(field.key, rawValue === '' ? null : Number(rawValue))
    return
  }
  store.setField(field.key, rawValue)
}

function fieldOptions(field: CalculatorFieldConfig): FieldOption[] {
  return store.fieldOptions(field)
}

function selectSize(id: string) {
  if (!isLargeFormatProduct.value) {
    store.setField('finished_size', id)
    if (id === 'custom') {
      store.setField('custom_width_mm', null)
      store.setField('custom_height_mm', null)
    }
    return
  }

  if (id === 'custom') {
    store.setField('finished_size', id)
    store.setField('size_mode', 'custom')
    store.setField('width_mm', null)
    store.setField('height_mm', null)
    store.setField('width_input', null)
    store.setField('height_input', null)
    return
  }

  const size = sizeOptions.value.find(option => option.id === id)
  if (!size) {
    store.setField('finished_size', id)
    return
  }

  store.setField('finished_size', id)
  store.setField('size_mode', 'custom')
  store.setField('input_unit', 'mm')
  store.setField('width_mm', size.width_mm)
  store.setField('height_mm', size.height_mm)
  store.setField('width_input', size.width_mm)
  store.setField('height_input', size.height_mm)
}

function selectCoverPaper(id: string) {
  store.setField('cover_stock', id)
}

function selectInsertPaper(id: string) {
  store.setField('insert_stock', id)
}

function selectPaperTier(id: string) {
  store.setField('paper_stock', id)
}

function selectColorMode(value: string) {
  store.setField('color_mode', value)
}

function toggleCustomPaperMode() {
  isCustomPaperMode.value = !isCustomPaperMode.value
  if (isCustomPaperMode.value) {
    store.setField('paper_selection_mode', 'custom_request')
  } else {
    store.setField('paper_selection_mode', null)
    store.setField('requested_paper_note', null)
    paperRequestNote.value = ''
  }
}

function updateLargeFormatDimension(key: 'width_input' | 'height_input', rawValue: string) {
  store.setField('size_mode', 'custom')
  store.setField(key, rawValue === '' ? null : Number(rawValue))
  store.setField(key === 'width_input' ? 'width_mm' : 'height_mm', null)
}

function updateLargeFormatUnit(rawValue: string) {
  store.setField('size_mode', 'custom')
  store.setField('input_unit', rawValue || 'mm')
  store.setField('width_mm', null)
  store.setField('height_mm', null)
}

function clampQuantity(value: number): number {
  return Math.min(Math.max(Math.round(value), sliderMin), sliderMax.value)
}

function updateQuantity(rawValue: string) {
  const parsed = Number(rawValue)
  store.setField('quantity', Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null)
}

function finishingGroupLabel(field: CalculatorFieldConfig): string {
  if (field.key === 'cover_lamination') return 'Lamination'
  if (field.key === 'cut_type') return 'Cutting'
  if (field.key === 'corner_rounding') return 'Corners'
  if (field.key === 'binding_type') return 'Binding'
  return field.label
}

function optionLabel(label: string): string {
  if (/^no /i.test(label)) return 'None'
  return label
}

function chipLabel(label: string): string {
  if (label === 'Corner rounding') return 'Rounded corners'
  return label
}

function selectFinishingChip(fieldKey: string, chip: FinishingChip) {
  if (chip.type === 'boolean') {
    updateBoolean(fieldKey, !chip.active)
    return
  }
  store.setField(fieldKey, chip.value)
}

async function handleFileSelection(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  selectedFileName.value = file.name
  draftRecoveryStore.updateSelectedFileName(file.name)
  draftRecoveryStore.setArtworkRefs([{ name: file.name, source: 'local-selection' }])

  artworkSuggestions.value = []
  artworkWarnings.value = []
  artworkSuggestionsVisible.value = false
  artworkDetected.value = null
  artworkPreviewImage.value = null
  artworkSuggestedProduct.value = null
  artworkStatusMessage.value = null
  analysisErrorMessage.value = null
  uploadedBytes.value = 0
  totalBytes.value = file.size
  speedBytesPerSecond.value = null
  etaSeconds.value = null
  speedWindow.length = 0

  uploadStatus.value = 'uploading'
  analysisStatus.value = file.name.toLowerCase().endsWith('.pdf') ? 'analysing' : 'skipped'
  uploadToastId.value = toast.uploadStarted(file.name, formatFileSize(file.size))
  xhrAbortController = new AbortController()

  try {
    const result = await uploadArtworkXHR(
      file,
      _apiBase.value,
      (ev) => {
        const now = Date.now()
        uploadedBytes.value = ev.loaded
        totalBytes.value = ev.total

        speedWindow.push({ loaded: ev.loaded, time: now })
        const cutoff = now - 3000
        while (speedWindow.length > 1 && speedWindow[0]!.time < cutoff) speedWindow.shift()

        if (speedWindow.length >= 2) {
          const oldest = speedWindow[0]!
          const elapsed = (now - oldest.time) / 1000
          const delta = ev.loaded - oldest.loaded
          speedBytesPerSecond.value = elapsed > 0.1 ? delta / elapsed : null
        }

        if (speedBytesPerSecond.value && ev.total > 0) {
          etaSeconds.value = (ev.total - ev.loaded) / speedBytesPerSecond.value
        }

        if (uploadToastId.value) {
          const percent = ev.total > 0 ? (ev.loaded / ev.total) * 100 : 0
          toast.uploadProgress(uploadToastId.value, percent, speedBytesPerSecond.value, etaSeconds.value)
        }
      },
      xhrAbortController.signal,
    )

    store.setArtworkId(result.artwork_id)
    artworkDetected.value = result.detected ?? {
      pages: result.detected_pages,
      width_mm: result.detected_width_mm,
      height_mm: result.detected_height_mm,
    }
    artworkPreviewImage.value = result.preview_image
    artworkSuggestedProduct.value = result.suggested_product
    artworkSuggestions.value = result.suggestions ?? []
    artworkWarnings.value = result.analysis_warnings?.length ? result.analysis_warnings : (result.warnings ?? [])
    artworkSuggestionsVisible.value = result.analysis_status === 'analysed' && (Boolean(result.suggested_product) || (result.suggestions ?? []).length > 0)
    uploadStatus.value = result.upload_status
    analysisStatus.value = result.analysis_status
    analysisErrorMessage.value = result.analysis_error
    artworkStatusMessage.value = null

    if (result.upload_status === 'uploaded' && result.analysis_status === 'analysed') {
      toast.uploadComplete(file.name, uploadToastId.value ?? undefined)
    } else if (result.upload_status === 'uploaded' && analysisStatus.value === 'failed') {
      toast.uploadAnalysisFailed(file.name, uploadToastId.value ?? undefined)
    } else if (result.upload_status === 'uploaded' && analysisStatus.value === 'skipped') {
      toast.info('Artwork uploaded', 'Your file was uploaded. Set the print details manually before pricing.', { context: 'upload' })
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      selectedFileName.value = null
      draftRecoveryStore.updateSelectedFileName(null)
      draftRecoveryStore.setArtworkRefs([])
      uploadStatus.value = 'idle'
      analysisStatus.value = 'idle'
    } else {
      artworkStatusMessage.value = error instanceof Error
        ? error.message
        : 'File upload failed. Please try again.'
      analysisErrorMessage.value = null
      uploadStatus.value = 'failed'
      analysisStatus.value = 'idle'
      toast.uploadFailed(artworkStatusMessage.value, uploadToastId.value ?? undefined)
    }
  } finally {
    xhrAbortController = null
    // Reset input so re-selecting the same file triggers change
    input.value = ''
  }
}

function cancelUpload() {
  xhrAbortController?.abort()
}

function removeArtwork() {
  cancelUpload()
  selectedFileName.value = null
  draftRecoveryStore.updateSelectedFileName(null)
  draftRecoveryStore.setArtworkRefs([])
  artworkSuggestions.value = []
  artworkWarnings.value = []
  artworkSuggestionsVisible.value = false
  artworkDetected.value = null
  artworkPreviewImage.value = null
  artworkSuggestedProduct.value = null
  artworkStatusMessage.value = null
  analysisErrorMessage.value = null
  uploadStatus.value = 'idle'
  analysisStatus.value = 'idle'
  uploadedBytes.value = 0
  totalBytes.value = 0
  speedBytesPerSecond.value = null
  etaSeconds.value = null
  store.setArtworkId(null)
}

async function tryAnotherFile() {
  removeArtwork()
  await nextTick()
  artworkFileInput.value?.click()
}

function continueManually() {
  artworkSuggestionsVisible.value = false
}

async function applyArtworkSuggestions() {
  const productTypeSuggestion = artworkSuggestions.value.find(
    suggestion => suggestion.field === 'product_type' && typeof suggestion.value === 'string',
  )
  const otherSuggestions = artworkSuggestions.value.filter(suggestion => suggestion !== productTypeSuggestion)

  if (productTypeSuggestion && typeof productTypeSuggestion.value === 'string') {
    suppressAutoSelections.value = true
    store.selectProduct(productTypeSuggestion.value, { resetDefaults: false })
    clearNonDetectedFields()
    await nextTick()
  }

  for (const suggestion of otherSuggestions) {
    if (suggestion.field === 'total_pages') {
      store.setField('total_pages', Number(suggestion.value))
    } else if (suggestion.field === 'finished_size') {
      const sizeId = String(suggestion.value)
      const activeSizeOptions = store.selectedProduct?.size_options ?? []
      const found = activeSizeOptions.find(s => s.id === sizeId || s.label === sizeId)
      if (found) store.setField('finished_size', found.id)
    }
  }

  suppressAutoSelections.value = false
  artworkSuggestionsVisible.value = false
  toast.success('Detected setup applied', 'We updated the calculator with the PDF details we could confirm.', { context: 'calculator' })
}

function clearNonDetectedFields() {
  const fieldsToClear = [
    'paper_stock',
    'cover_stock',
    'insert_stock',
    'requested_paper_category',
    'requested_gsm',
    'lamination',
    'cover_lamination',
    'binding_type',
    'color_mode',
    'print_sides',
    'quantity',
    'cutting',
    'folding',
    'corner_rounding',
    'shape',
    'cut_type',
    'paper_selection_mode',
    'requested_paper_note',
    'custom_width_mm',
    'custom_height_mm',
  ]

  for (const field of fieldsToClear) {
    store.setField(field, null)
  }

  isCustomPaperMode.value = false
  paperRequestNote.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function matchKnownSize(widthMm: number, heightMm: number): string | null {
  const knownSizes = [
    { label: 'A4', width: 210, height: 297 },
    { label: 'A5', width: 148, height: 210 },
    { label: 'Business Card', width: 85, height: 55 },
  ]

  let bestLabel: string | null = null
  let bestDiff = Number.POSITIVE_INFINITY

  for (const size of knownSizes) {
    const directDiff = Math.abs(widthMm - size.width) + Math.abs(heightMm - size.height)
    const rotatedDiff = Math.abs(widthMm - size.height) + Math.abs(heightMm - size.width)
    const diff = Math.min(directDiff, rotatedDiff)
    if (diff < bestDiff) {
      bestDiff = diff
      bestLabel = size.label
    }
  }

  return bestDiff <= 12 ? bestLabel : null
}

async function submitPreview() {
  await store.fetchPreview()
}

async function attachGuestDraft() {
  const draft = await draftRecoveryStore.attachGuestDraftToAccount()
  if (draft?.id) {
    await navigateTo({ path: '/', query: { resumeDraft: String(draft.id) } })
  }
}

function resumeGuestDraft() {
  draftRecoveryStore.resumeGuestDraft(store)
}

function formatSavedTime(value: string) {
  const savedAt = new Date(value)
  return savedAt.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>

<style scoped>
.console-status-pill {
  border: 1px solid color-mix(in srgb, var(--p-border) 84%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.04);
  padding: 0.45rem 0.8rem;
  color: var(--p-calculator-text);
}

.console-panel-header,
.console-display-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--p-border) 48%, transparent);
  padding: 1rem 1.25rem;
}

.console-panel-kicker,
.console-cell-label {
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--p-calculator-muted) 86%, var(--p-calculator-text));
}

.console-inline-readout {
  display: flex;
  min-height: 3rem;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--p-border) 88%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  padding: 0 1rem;
  color: var(--p-calculator-text);
}

.console-quantity-input :deep(input) {
  text-align: center;
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.console-slider-wrap {
  border: 1px solid color-mix(in srgb, var(--p-border) 76%, transparent);
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--p-surface) 97%, white);
  box-shadow: inset 0 1px 1px rgb(15 23 42 / 0.03);
  padding: 1.15rem 1rem;
}

.console-upload-zone {
  display: flex;
  min-height: 12rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 1px dashed color-mix(in srgb, var(--p-primary) 42%, var(--p-border));
  border-radius: 1.2rem;
  background: color-mix(in srgb, var(--p-surface) 99%, white);
  box-shadow: 0 4px 12px rgb(15 23 42 / 0.05);
  padding: 1.25rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.console-upload-zone:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--p-primary) 58%, var(--p-border));
  box-shadow: 0 8px 18px rgb(15 23 42 / 0.08);
}

.console-upload-icon {
  display: flex;
  height: 3.25rem;
  width: 3.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--p-primary) 12%, white);
  box-shadow: 0 4px 10px rgb(225 53 21 / 0.12);
}

.console-display-badge {
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--p-primary) 12%, white);
  color: var(--p-primary);
  box-shadow: 0 4px 10px rgb(225 53 21 / 0.1);
}

.console-display-cell {
  border: 1px solid color-mix(in srgb, var(--p-border) 62%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--p-surface) 99%, white);
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.05);
  padding: 1rem;
}

.console-cell-value {
  margin-top: 0.45rem;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--p-calculator-text);
}

.console-cell-note {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--p-calculator-muted) 78%, var(--p-calculator-text));
}

.console-finish-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--p-border) 60%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  padding: 0.75rem 0.9rem;
}

.console-row-detail {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--p-calculator-muted) 72%, var(--p-calculator-text));
}

.console-price-box {
  border: 1px solid color-mix(in srgb, var(--p-primary) 24%, var(--p-border));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--p-primary) 10%, var(--p-surface));
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.04);
  padding: 0.9rem 1rem;
  color: var(--p-calculator-text);
}

.calculator-chip {
  display: inline-flex;
  min-height: 2.85rem;
  align-items: center;
  gap: 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.7rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}

.calculator-chip-idle {
  border-color: color-mix(in srgb, var(--p-border) 84%, transparent);
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.04);
  color: color-mix(in srgb, var(--p-calculator-muted) 80%, var(--p-calculator-text));
}

.calculator-chip-idle:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--p-primary) 34%, var(--p-border));
  color: var(--p-calculator-text);
}

.calculator-chip-active {
  border-color: color-mix(in srgb, var(--p-primary) 70%, white);
  background: color-mix(in srgb, var(--p-primary) 18%, var(--p-surface));
  box-shadow: 0 4px 10px rgb(225 53 21 / 0.12);
  color: var(--p-calculator-text);
}

.calculator-slider {
  width: 100%;
  height: 0.45rem;
  appearance: none;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
}

.calculator-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1.35rem;
  width: 1.35rem;
  border: 3px solid color-mix(in srgb, var(--p-surface) 90%, white);
  border-radius: 999px;
  background: var(--p-primary);
  box-shadow: 0 3px 8px rgb(15 23 42 / 0.18);
  cursor: grab;
}

.calculator-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
}

.calculator-slider::-moz-range-thumb {
  height: 1.35rem;
  width: 1.35rem;
  border: 3px solid color-mix(in srgb, var(--p-surface) 90%, white);
  border-radius: 999px;
  background: var(--p-primary);
  box-shadow: 0 3px 8px rgb(15 23 42 / 0.18);
  cursor: grab;
}

.paper-tier-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 4.5rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  padding: 0.65rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.paper-tier-btn-idle {
  border-color: color-mix(in srgb, var(--p-border) 84%, transparent);
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.04);
  color: color-mix(in srgb, var(--p-calculator-muted) 80%, var(--p-calculator-text));
}

.paper-tier-btn-idle:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--p-primary) 34%, var(--p-border));
  color: var(--p-calculator-text);
}

.paper-tier-btn-active {
  border-color: color-mix(in srgb, var(--p-primary) 70%, white);
  background: color-mix(in srgb, var(--p-primary) 18%, var(--p-surface));
  box-shadow: 0 4px 10px rgb(225 53 21 / 0.12);
  color: var(--p-calculator-text);
}

.paper-tier-star {
  font-size: 0.6rem;
  line-height: 1;
  color: var(--p-primary);
}

.paper-tier-label {
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.paper-tier-gsm {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--p-calculator-muted) 72%, var(--p-calculator-text));
}

.size-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 5rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  padding: 0.65rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.size-option-btn-idle {
  border-color: color-mix(in srgb, var(--p-border) 84%, transparent);
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.04);
  color: color-mix(in srgb, var(--p-calculator-muted) 80%, var(--p-calculator-text));
}

.size-option-btn-idle:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--p-primary) 34%, var(--p-border));
  color: var(--p-calculator-text);
}

.size-option-btn-active {
  border-color: color-mix(in srgb, var(--p-primary) 70%, white);
  background: color-mix(in srgb, var(--p-primary) 18%, var(--p-surface));
  box-shadow: 0 4px 10px rgb(225 53 21 / 0.12);
  color: var(--p-calculator-text);
}

.size-option-star {
  font-size: 0.6rem;
  line-height: 1;
  color: var(--p-primary);
}

.size-option-label {
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.size-option-dims {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--p-calculator-muted) 72%, var(--p-calculator-text));
}
</style>
