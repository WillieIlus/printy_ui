<template>
  <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
    <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500">
      Client details
    </p>
    <div class="mt-3 grid gap-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <UInput
          :model-value="name"
          :ui="inputUi"
          placeholder="Client or company name"
          @update:model-value="$emit('update:name', String($event ?? ''))"
        />
        <UInput
          :model-value="phone"
          :ui="inputUi"
          placeholder="+254..."
          @update:model-value="$emit('update:phone', String($event ?? ''))"
        />
      </div>
      <UInput
        :model-value="email"
        type="email"
        :ui="inputUi"
        placeholder="name@example.com"
        @update:model-value="$emit('update:email', String($event ?? ''))"
      />
      <p class="text-xs leading-5 text-slate-500">
        Signed-in clients can continue with this pricing context without leaving the calculator.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  phone: string
  email: string
  inputUi: Record<string, unknown>
}>()

defineEmits<{
  'update:name': [value: string]
  'update:phone': [value: string]
  'update:email': [value: string]
}>()
</script>
