<template>
  <label class="block">
    <ML>{{ label }}</ML>
    <div
      class="mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors focus-within:border-[var(--accent)]"
      :style="{ borderColor: error ? '#FB4D6D' : 'var(--line)', background: 'var(--panel)' }"
    >
      <component :is="icon" :size="15" style="color: var(--sub)" class="shrink-0" />
      <input
        :type="isPw && localShow ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :autofocus="autofocus"
        class="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60"
        @input="emitValue(($event.target as HTMLInputElement).value)"
      />
      <button v-if="isPw" type="button" class="shrink-0" style="color: var(--sub)" @click="localShow = !localShow">
        <EyeOff v-if="localShow" :size="14" />
        <Eye v-else :size="14" />
      </button>
    </div>
    <div v-if="error" class="mt-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[#FB4D6D]">{{ error }}</div>
  </label>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  icon: Component
  label: string
  type?: string
  placeholder?: string
  autofocus?: boolean
  error?: string
}>(), {
  type: 'text',
  placeholder: '',
  autofocus: false,
  error: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isPw = props.type === 'password'
const localShow = ref(false)

function emitValue(value: string) {
  emit('update:modelValue', value)
}
</script>