<template>
  <div class="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
    <div
      v-for="group in groups"
      :key="group.label"
      class="space-y-3 rounded-lg border border-white/10 bg-mirage-900/70 p-3"
    >
      <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">
        {{ group.label }}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in group.options"
          :key="option.id"
          type="button"
          class="rounded-md border px-3 py-2 text-sm font-medium transition-colors"
          :class="isSelected(option.id)
            ? 'border-flamingo-400 bg-flamingo-500/18 text-white'
            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'"
          @click="$emit('toggle', option)"
        >
          {{ option.name }}
        </button>
      </div>
      <div
        v-for="option in group.options.filter(item => showSideSelector(item.id))"
        :key="`finishing-side-${option.id}`"
      >
        <USelectMenu
          :model-value="getSide(option.id)"
          :items="laminationSides"
          value-key="value"
          label-key="label"
          :ui="selectUi"
          portal="body"
          class="w-full"
          @update:model-value="$emit('update-side', option.id, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type FinishingOption = Record<string, unknown> & { id: number; name: string }

defineProps<{
  groups: Array<{ label: string; options: FinishingOption[] }>
  laminationSides: Array<{ label: string; value: string }>
  selectUi: Record<string, unknown>
  isSelected: (id: number) => boolean
  showSideSelector: (id: number) => boolean
  getSide: (id: number) => string
}>()

defineEmits<{
  toggle: [option: FinishingOption]
  'update-side': [id: number, value: unknown]
}>()
</script>
