<!-- Purpose: Dashboard top bar with page title, search, notification bell, and user avatar slot. -->
<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-[var(--p-border)] bg-[var(--p-surface)] px-4 md:px-6">
    <div class="flex items-center gap-3">
      <slot name="start">
        <h1 class="text-base font-semibold text-[var(--p-text)]">{{ title }}</h1>
      </slot>
    </div>

    <div class="flex items-center gap-2">
      <slot name="end">
        <SearchInput v-model="query" placeholder="Search…" class="hidden w-48 md:flex" />
        <BaseIconButton label="Notifications">
          <Icon name="lucide:bell" class="size-5" />
        </BaseIconButton>
        <div class="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
          <slot name="avatar">
            <Icon name="lucide:user" class="size-4" />
          </slot>
        </div>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseIconButton from '~/components/atoms/BaseIconButton.vue'
import SearchInput from '~/components/molecules/SearchInput.vue'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Dashboard',
})

const query = ref('')
</script>
