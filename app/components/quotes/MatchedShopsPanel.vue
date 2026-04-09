<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
        Matching shops
      </p>
      <p v-if="!loading && shops.length" class="text-xs text-[var(--p-text-muted)]">
        {{ shops.length }} found — select one to continue
      </p>
    </div>

    <div v-if="loading" class="flex items-center gap-2 py-4 text-sm text-[var(--p-text-muted)]">
      <UIcon name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
      Finding matching shops…
    </div>

    <div v-else-if="shops.length" class="space-y-2">
      <button
        v-for="shop in shops"
        :key="shop.slug"
        type="button"
        class="w-full rounded-2xl border p-4 text-left transition-colors"
        :class="selectedSlug === shop.slug
          ? 'border-flamingo-400 bg-flamingo-500/10'
          : 'border-[var(--p-border)] bg-[var(--p-surface-sunken)] hover:border-flamingo-300/60'"
        @click="$emit('select', shop)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-[var(--p-text)]">{{ shop.name }}</p>
            <p v-if="shop.can_calculate && shop.total" class="mt-0.5 text-base font-bold text-flamingo-400">
              {{ shop.currency || 'KES' }} {{ shop.total }}
            </p>
            <p v-else class="mt-0.5 text-sm text-[var(--p-text-muted)]">Request for quote</p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span
              v-if="shop.can_calculate"
              class="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400"
            >
              Priced
            </span>
            <span
              v-else
              class="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400"
            >
              On request
            </span>
            <UIcon
              v-if="selectedSlug === shop.slug"
              name="i-lucide-check-circle"
              class="h-4 w-4 text-flamingo-400"
            />
          </div>
        </div>

        <!-- Auto-selected materials/papers shown below -->
        <div v-if="shop.selection" class="mt-2 space-y-0.5 text-xs text-[var(--p-text-muted)]">
          <p v-if="shop.selection.cover_paper_label">
            Cover: {{ shop.selection.cover_paper_label }}
          </p>
          <p v-if="shop.selection.insert_paper_label">
            Insert: {{ shop.selection.insert_paper_label }}
          </p>
          <p v-if="shop.selection.material_label">
            Material: {{ shop.selection.material_label }}
          </p>
          <p v-if="shop.selection.binding_rate_label">
            Binding: {{ shop.selection.binding_rate_label }}
          </p>
        </div>

        <p v-if="shop.human_ready_text" class="mt-1.5 text-xs text-[var(--p-text-muted)]">
          {{ shop.human_ready_text }}
        </p>
      </button>
    </div>

    <div
      v-else-if="searched"
      class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5 text-sm text-[var(--p-text-muted)]"
    >
      No shops matched this spec yet. Try adjusting the job details or check back later as more shops set up their pricing.
    </div>
  </div>
</template>

<script setup lang="ts">
export interface MatchedShop {
  id: number
  name: string
  slug: string
  can_calculate: boolean
  total: string | null
  currency: string
  similarity_score: number
  human_ready_text?: string
  preview?: Record<string, unknown> | null
  selection?: {
    cover_paper_id?: number
    cover_paper_label?: string
    insert_paper_id?: number
    insert_paper_label?: string
    material_id?: number
    material_label?: string
    binding_rate_id?: number
    binding_rate_label?: string
    paper_id?: number
    paper_label?: string
  } | null
}

defineProps<{
  shops: MatchedShop[]
  loading?: boolean
  searched?: boolean
  selectedSlug?: string | null
}>()

defineEmits<{
  select: [shop: MatchedShop]
}>()
</script>
