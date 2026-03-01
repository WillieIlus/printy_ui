<!-- FormInput.vue — Styled form input following PrintShop flamingo design -->
<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        class="mb-1.5 block text-sm font-medium text-gray-700"
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
          class="w-full rounded-xl border bg-gray-50 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          :class="[
            icon ? 'pl-10' : 'pl-4',
            showPasswordToggle ? 'pr-12' : 'pr-4',
            errors.length
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200',
          ]"
        />

        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-600"
          @click="passwordVisible = !passwordVisible"
        >
          <svg v-if="passwordVisible" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <!-- Error Message -->
      <div class="mt-1 h-5">
        <p v-if="errors.length" class="flex items-center gap-1 text-xs text-red-500">
          <svg class="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
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
