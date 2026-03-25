<!-- FormInput.vue — Styled form input following Printy flamingo design -->
<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        :class="formLabelClass"
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
            class="h-5 w-5 text-[var(--p-text-muted)] transition-colors"
            :class="{ 'text-flamingo-500': errors.length }"
          />
        </div>

        <input
          v-bind="field"
          :id="name"
          :type="computedType"
          :autocomplete="computedAutocomplete"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-invalid="errors.length ? 'true' : 'false'"
          :data-invalid="errors.length ? 'true' : 'false'"
          :class="[
            nativeInputBaseClass,
            icon ? 'pl-10' : 'pl-4',
            showPasswordToggle ? 'pr-12' : 'pr-4',
            errors.length
              ? nativeInputErrorClass
              : '',
          ]"
        >

        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          aria-label="Toggle password visibility"
          class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--p-text-muted)] transition-colors hover:text-[var(--p-text-dim)]"
          @click="passwordVisible = !passwordVisible"
        >
          <UIcon
            :name="passwordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            class="h-5 w-5"
          />
        </button>
      </div>

      <p v-if="helper && !errors.length" :class="formHelperClass">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors.length" :class="formErrorClass">
          <UIcon name="i-lucide-alert-circle" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{{ errors[0] }}</span>
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formErrorClass, formHelperClass, formLabelClass, nativeInputBaseClass, nativeInputErrorClass } from '~/utils/formUi'

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
  autocomplete?: string
}>(), {
  type: 'text',
  placeholder: '',
  icon: '',
  disabled: false,
  required: false,
  hideLabel: false,
  helper: undefined,
  autocomplete: '',
})

const passwordVisible = ref(false)

const showPasswordToggle = computed(() => props.type === 'password')

const computedType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const computedAutocomplete = computed(() => {
  if (props.autocomplete) return props.autocomplete
  if (props.type === 'email') return 'email'
  return undefined
})
</script>
