<template>
  <VeeField v-slot="{ handleChange, errors }" :name="name" :label="label">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700">
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
            ? 'w-full rounded-xl border border-red-300 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50'
            : 'w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        }"
        @change="(e: Event) => handleChange((e.target as HTMLInputElement)?.files?.[0])"
      />
      <div class="mt-1 h-5">
        <p v-if="errors.length" class="flex items-center gap-1 text-xs text-red-500">
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