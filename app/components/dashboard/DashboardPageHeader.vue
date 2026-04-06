<template>
  <div class="col-span-12 overflow-hidden rounded-[30px] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-sm backdrop-blur-xl sm:p-7">
    <div class="absolute" />
    <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div class="min-w-0 flex-1 space-y-1">
        <p class="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300/90">
          Printy Workspace
        </p>
        <h1 class="break-words text-3xl font-semibold tracking-[0.01em] text-[var(--p-text)] sm:text-4xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="max-w-3xl break-words text-[0.95rem] leading-7 text-[var(--p-text-muted)]">
          {{ subtitle }}
        </p>
        <div v-if="publicUrl" class="flex min-w-0 flex-wrap items-center gap-2 pt-2">
          <NuxtLink
            :to="publicUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-flamingo-600 transition-colors hover:text-flamingo-700 hover:underline dark:text-flamingo-400 dark:hover:text-flamingo-300"
          >
            <UIcon name="i-lucide-external-link" class="h-4 w-4" />
            View Public Shop
          </NuxtLink>
          <span class="hidden text-[var(--p-text-muted)] sm:inline">&middot;</span>
          <span class="hidden min-w-0 max-w-full truncate text-sm text-[var(--p-text-muted)] sm:inline">
            {{ publicUrlDisplay }}
          </span>
          <span class="text-sm text-[var(--p-text-muted)] sm:hidden">Public shop link</span>
        </div>
        <div v-if="$slots.default" class="pt-1">
          <slot />
        </div>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'

const props = defineProps<{
  title: string
  subtitle?: string
  shopSlug?: string
}>()

const resolvedShopSlug = computed(() => {
  const propSlug = props.shopSlug?.trim()
  if (propSlug) return propSlug

  if (!route.path.startsWith('/dashboard/shops/')) {
    return null
  }

  const routeSlug = route.params.slug
  return typeof routeSlug === 'string' && routeSlug.trim() ? routeSlug.trim() : null
})

const publicUrl = computed(() => (resolvedShopSlug.value ? `/shops/${resolvedShopSlug.value}` : null))

const publicUrlDisplay = computed(() =>
  resolvedShopSlug.value
    ? `${siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/shops/${resolvedShopSlug.value}`
    : '',
)
</script>
