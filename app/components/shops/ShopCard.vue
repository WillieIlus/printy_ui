<!-- ShopCard.vue — Shop card with flamingo design -->
<template>
  <div class="group overflow-hidden rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface)] shadow-sm transition-all hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-lg">
    <!-- Header with gradient -->
    <div class="relative bg-gradient-to-r from-flamingo-500 to-flamingo-700 px-6 py-5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/20 backdrop-blur-sm">
            <UAvatar v-if="shop.logo" :src="shop.logo" :alt="shop.name" size="xl" class="h-full w-full rounded-xl" />
            <UIcon v-else name="i-lucide-building-2" class="h-6 w-6 text-white" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="truncate text-lg font-bold text-white">{{ shop.name }}</h3>
              <UBadge v-if="shop.is_verified" color="success" variant="soft" size="xs" class="shrink-0">
                <UIcon name="i-lucide-check" class="h-3 w-3" />
              </UBadge>
            </div>
            <p class="text-sm text-white/80">{{ shop.city }}, {{ shop.state }}</p>
          </div>
        </div>
        <span
          v-if="shop.is_active !== false"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-400/20 px-2.5 py-1 text-xs font-semibold text-green-100"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-green-300" />
          Active
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="px-6 py-5">
      <div v-if="shop.description" class="mb-4 line-clamp-2 text-sm text-[var(--p-text-muted)]">
        <EditorRichTextDisplay :html="shop.description" />
      </div>
      <div v-else class="mb-4" />

      <!-- Contact info -->
      <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
        <div v-if="shop.phone_number" class="flex items-center gap-1">
          <UIcon name="i-lucide-phone" class="h-4 w-4 shrink-0" />
          {{ shop.phone_number }}
        </div>
        <div v-if="shop.business_email" class="flex items-center gap-1 truncate">
          <UIcon name="i-lucide-mail" class="h-4 w-4 shrink-0" />
          {{ shop.business_email }}
        </div>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="mt-4 flex gap-2 border-t border-[var(--p-border-dim)] pt-4">
        <UButton variant="outline" size="sm" class="rounded-xl" @click="$emit('view')">
          View
        </UButton>
        <UButton variant="outline" size="sm" class="rounded-xl" @click="$emit('edit')">
          Edit
        </UButton>
      </div>
    </div>

    <!-- Footer Actions (public view) -->
    <div v-if="!showActions" class="flex border-t border-[var(--p-border-dim)]">
      <NuxtLink
        :to="`/shops/${shop.slug}`"
        class="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-flamingo-600 transition-colors hover:bg-flamingo-50"
      >
        View Details
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </NuxtLink>
      <div class="w-px bg-[var(--p-border-dim)]" />
      <NuxtLink
        :to="`/shops/${shop.slug}/request-quote`"
        class="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"
      >
        <UIcon name="i-lucide-plus" class="h-4 w-4" />
        Request Quote
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shop } from '~/shared/types'
defineProps<{ shop: Shop; showActions?: boolean }>()
defineEmits<{ view: []; edit: [] }>()
</script>
