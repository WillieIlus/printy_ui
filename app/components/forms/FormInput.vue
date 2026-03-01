<!-- FormInput.vue — Styled form input following PrintShop flamingo design -->
<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>

      <div class="relative">
        <!-- Leading Icon -->
        <div
          v-if="icon"
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
        >
          <UIcon
            :name="icon"
            class="h-5 w-5 text-gray-400 transition-colors"
            :class="{ 'text-flamingo-500': errors.length }"
          />
        </div>

        <input
          v-bind="field"
          :id="name"
          :type="computedType"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full rounded-xl border bg-gray-50 dark:bg-gray-800/50 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-all focus:border-flamingo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          :class="[
            icon ? 'pl-10' : 'pl-4',
            showPasswordToggle ? 'pr-12' : 'pr-4',
            errors.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 dark:border-gray-700',
          ]"
        />

        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          aria-label="Toggle password visibility"
          class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          @click="passwordVisible = !passwordVisible"
        >
          <UIcon
            :name="passwordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            class="h-5 w-5"
          />
        </button>
      </div>

      <p v-if="helper && !errors.length" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors.length" class="flex items-center gap-1 text-xs text-red-500">
          <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 shrink-0" />
          {{ errors[0] }}
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  label: string
  type?: string
  placeholder?: string
  icon?: string
  disabled?: boolean
  required?: boolean
  hideLabel?: boolean
  helper?: string
}>(), {
  type: 'text',
  placeholder: '',
  icon: '',
  disabled: false,
  required: false,
  hideLabel: false,
})

const passwordVisible = ref(false)

const showPasswordToggle = computed(() => props.type === 'password')

const computedType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})
</script>
