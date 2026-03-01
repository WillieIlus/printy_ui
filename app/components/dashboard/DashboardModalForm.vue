<template>
  <UModal
    :open="modelValue"
    :title="title"
    :description="description || 'Form dialog'"
    scrollable
    portal="#modal-portal"
    @update:open="$emit('update:modelValue', $event)"
  >
    <template #content="{ close }">
      <div class="flex max-h-[85vh] min-h-0 flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <h2 id="dashboard-modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
          <p v-if="description" id="dashboard-modal-description" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 [&_input]:w-full [&_select]:w-full [&_textarea]:w-full">
          <slot :close="close" />
        </div>
        <template v-if="$slots.footer">
          <div class="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4">
            <slot name="footer" :close="close" />
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  description?: string
}>()

defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
