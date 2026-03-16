<template>
  <div class="col-span-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
    <div class="min-w-0 flex-1 space-y-1">
      <h1 class="text-2xl font-semibold text-[var(--p-text)]">
        {{ shopName }}
      </h1>
      <p class="text-sm text-[var(--p-text-muted)]">
        Manage incoming requests, pricing, and print jobs. No more manual calculations or back-and-forth.
      </p>
      <div v-if="publicUrl" class="pt-2 flex flex-wrap items-center gap-2">
        <NuxtLink
          :to="publicUrl"
          target="_blank"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
        >
          <UIcon name="i-lucide-external-link" class="w-4 h-4" />
          View public shop page
        </NuxtLink>
        <span class="text-[var(--p-text-muted)]">·</span>
        <span class="text-sm text-[var(--p-text-muted)]">{{ publicUrlDisplay }}</span>
      </div>
      <div v-if="$slots.default" class="pt-1">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0 flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'

const props = defineProps<{
  shopName: string
  shopSlug?: string
}>()

const publicUrl = computed(() =>
  props.shopSlug ? `/shops/${props.shopSlug}` : null
)

const publicUrlDisplay = computed(() =>
  props.shopSlug ? `${siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/shops/${props.shopSlug}` : ''
)
</script>
