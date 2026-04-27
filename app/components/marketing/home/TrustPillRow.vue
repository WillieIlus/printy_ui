<!-- Purpose: Lightweight trust and proof row for the homepage. -->
<template>
  <section class="mx-auto max-w-5xl px-4 py-4 md:px-6 md:py-5">
    <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--p-text-muted)] md:text-sm"
      >
        <Icon :name="item.icon" class="size-4 text-[var(--p-primary-soft)]" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { label: 'Real shops', icon: 'lucide:store' },
  { label: 'Clear pricing', icon: 'lucide:banknote' },
  { label: 'WhatsApp-ready', icon: 'lucide:message-circle' },
]
</script>
