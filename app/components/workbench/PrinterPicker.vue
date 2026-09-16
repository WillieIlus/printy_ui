<template>
  <div class="mt-3 space-y-2">
    <button
      v-for="p in opts"
      :key="p.id"
      type="button"
      class="press-key flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:border-[var(--accent)]"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      @click="pick(p)"
    >
      <Avatar :initials="p.initials" :hue="p.hue" :size="36" />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 font-disp text-[13.5px] font-semibold text-[var(--ink)]">
          {{ p.name }}
          <span
            v-if="p.id === 'p-north'"
            class="rounded-full bg-[var(--accent)] px-1.5 py-[1px] font-mono2 text-[8.5px] uppercase tracking-[0.14em]"
            :style="{ color: 'var(--accentInk)' }"
          >
            Capacity today
          </span>
        </div>
        <div class="mt-0.5 flex items-center gap-2 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
          <span class="inline-flex items-center gap-0.5"><Star :size="9" /> {{ p.rating }}</span>
          <span>{{ p.onTime }}% on-time</span>
          <span>{{ p.city }}</span>
        </div>
      </div>
      <ArrowRight :size="15" class="text-[var(--sub)]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Star } from 'lucide-vue-next'
import type { Job, Printer } from '~/shared/workflow/printy'
import { PRINTERS } from '~/shared/workflow/printy'
import { useWorkflowStore } from '~/stores/workflow'

const props = defineProps<{ job: Job }>()
const emit = defineEmits<{ (e: 'done'): void }>()

const w = useWorkflowStore()

const opts = computed(() => PRINTERS.filter((p) => p.verified))

const pick = (p: Printer) => {
  w.act('assign', props.job, p.id)
  emit('done')
}
</script>