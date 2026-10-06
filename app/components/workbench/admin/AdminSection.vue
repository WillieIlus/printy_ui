<template>
  <section>
    <header
      class="flex flex-wrap items-start gap-x-3 gap-y-2 pt-4"
      :class="rule ? 'border-t' : ''"
      :style="rule ? { borderColor: 'var(--line)' } : undefined"
    >
      <span
        v-if="icon"
        class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
        :style="{ background: tone.bg, color: tone.color }"
      >
        <AdminIcon :name="icon" :size="14" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="font-disp text-[16px] font-bold leading-tight tracking-tight">{{ title }}</h2>
          <span
            v-if="count !== undefined"
            class="rounded-full px-2 py-[2px] font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]"
            :style="countStyle"
          >
            {{ countLabel }}
          </span>
        </div>
        <p v-if="subtitle" class="mt-1 max-w-[72ch] text-[12px] leading-relaxed text-[var(--sub)]">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="$slots.meta || $slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="meta" />
        <slot name="actions" />
      </div>
    </header>

    <div class="mt-3.5">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdminNavIcon } from '~/shared/admin-nav'

type Tone = 'accent' | 'good' | 'warn' | 'bad' | 'neutral'

const TONES: Record<Tone, { color: string; bg: string }> = {
  accent: { color: 'var(--accent)', bg: 'color-mix(in srgb, var(--accent) 12%, transparent)' },
  good: { color: '#0E7A45', bg: 'rgba(14,122,69,.12)' },
  warn: { color: '#B45309', bg: 'rgba(245,166,35,.14)' },
  bad: { color: '#C81E44', bg: 'rgba(251,77,109,.14)' },
  neutral: { color: 'var(--sub)', bg: 'var(--panel2)' },
}

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: AdminNavIcon
  tone?: Tone
  count?: number | string
  rule?: boolean
}>(), { tone: 'accent', rule: true })

const tone = computed(() => TONES[props.tone])

const countLabel = computed(() =>
  typeof props.count === 'number' ? `${props.count} ${props.count === 1 ? 'item' : 'items'}` : props.count,
)

const countStyle = computed(() =>
  typeof props.count === 'number' && props.count > 0
    ? { background: tone.value.bg, color: tone.value.color }
    : { background: 'var(--panel2)', color: 'var(--sub)' },
)
</script>