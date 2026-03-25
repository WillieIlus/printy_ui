<template>
  <VeeField v-slot="{ handleChange, errors }" :name="name" :label="label">
    <div>
      <label class="mb-1.5 block text-[0.95rem] font-semibold leading-6 text-[var(--p-text-dim)]">
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <UInput
        type="file"
        :accept="accept"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
        :ui="{
          base: errors.length
            ? 'w-full rounded-xl border border-red-300 bg-red-50/80 px-4 py-3 text-[0.95rem] font-medium leading-6 text-[var(--p-text)] transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-950/30'
            : 'w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[0.95rem] font-medium leading-6 text-[var(--p-text)] transition-all hover:border-[var(--p-text-muted)] focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70',
        }"
        @change="(e: Event) => handleChange((e.target as HTMLInputElement)?.files?.[0])"
      />
      <div class="mt-1 h-5">
        <p v-if="errors.length" class="flex items-center gap-1 text-[0.8125rem] leading-5 text-red-500">
          <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 flex-shrink-0" />
          {{ errors[0] }}
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  label: string
  accept?: string
  disabled?: boolean
  required?: boolean
}>()
</script>

<style scoped>
:deep(input[type="file"]) {
  background-color: transparent;
}
</style>
