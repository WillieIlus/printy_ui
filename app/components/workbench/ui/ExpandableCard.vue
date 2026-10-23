<template>
  <article
    :id="rootId"
    data-test="expandable-card"
    :data-open="open ? 'true' : 'false'"
    :data-muted="muted ? 'true' : 'false'"
    :data-attention="attention ? 'true' : 'false'"
    :data-size="size"
    class="expandable-card group scroll-mt-24 overflow-hidden border transition-[border-color,box-shadow,background-color,opacity] duration-200"
    :class="[
      size === 'compact' ? 'rounded-2xl' : 'rounded-3xl',
      muted ? 'opacity-60' : '',
      attention ? 'ring-2' : '',
      open
        ? 'shadow-[0_18px_50px_-30px_rgba(27,23,16,.55)]'
        : 'shadow-[0_2px_20px_-14px_rgba(27,23,16,.28)]',
    ]"
    :style="rootStyle"
  >
    <div
      class="expandable-trigger flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset"
      :class="size === 'compact' ? 'p-4' : 'p-5'"
      role="button"
      tabindex="0"
      :aria-expanded="open"
      :aria-controls="panelId"
      data-test="expandable-trigger"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <slot name="header" />
      <slot name="summary">
        <div class="min-w-0 flex-1">
          <div v-if="code" class="truncate font-mono2 text-[10px] tracking-[0.12em] text-[var(--accent)]">
            {{ code }}
          </div>
          <div v-if="title" class="truncate font-disp text-[15px] font-bold tracking-tight">
            {{ title }}
          </div>
        </div>
        <span
          v-if="status"
          class="shrink-0 rounded-full px-2.5 py-[3px] font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style="background: var(--panel2); color: var(--sub)"
        >
          {{ status }}
        </span>
        <span
          v-if="total"
          class="shrink-0 font-disp text-[15px] font-bold tracking-tight"
          style="color: var(--accent)"
        >
          {{ total }}
        </span>
        <span
          v-if="showPayout && printerPayout != null"
          class="shrink-0 rounded-full px-2.5 py-[3px] font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style="background: rgba(14,122,69,.12); color: var(--accent)"
        >
          {{ printerPayout }}
        </span>
      </slot>

      <span
        v-if="open"
        data-test="expandable-open-badge"
        class="shrink-0 rounded-full px-2 py-[2px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.12em]"
        style="background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--accent)"
      >
        open
      </span>
      <ChevronDown
        :size="16"
        class="expandable-chevron shrink-0 text-[var(--sub)]"
        :style="open ? { transform: 'rotate(180deg)' } : {}"
        aria-hidden="true"
      />
    </div>

    <div
      v-show="open"
      :id="panelId"
      ref="panel"
      data-test="expandable-body"
      class="expandable-body overflow-hidden border-t outline-none"
      :class="motionClass"
      :style="{ borderColor: 'var(--line)' }"
      tabindex="-1"
    >
      <slot name="body">
        <slot />
      </slot>
    </div>

    <div
      v-if="$slots.footer"
      data-test="expandable-footer"
      class="border-t px-5 py-3"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }"
    >
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

let cardCounter = 0

const props = withDefaults(
  defineProps<{
    open?: boolean
    title?: string
    code?: string
    status?: string
    total?: string
    attention?: boolean
    muted?: boolean
    size?: 'default' | 'compact'
    id?: string
    scrollOnOpen?: boolean
    showPayout?: boolean
    printerPayout?: string
  }>(),
  {
    open: false,
    title: '',
    code: '',
    status: '',
    total: '',
    attention: false,
    muted: false,
    size: 'default',
    id: '',
    scrollOnOpen: true,
    showPayout: false,
    printerPayout: '',
  }
)

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'toggle', value: boolean): void
}>()

const instanceId = `expandable-card-${(cardCounter += 1)}`
const rootId = computed(() => props.id || instanceId)
const panelId = computed(() => `${rootId.value}-panel`)
const panel = ref<HTMLElement | null>(null)

const rootStyle = computed(() => ({
  borderColor: props.open ? 'var(--accent)' : 'var(--line)',
  background: props.muted ? 'var(--panel2)' : 'var(--panel)',
}))

// Respect reduced-motion: only animate the panel when motion is welcome.
const motionClass = computed(() => 'expandable-motion')

async function toggle() {
  const next = !props.open
  emit('update:open', next)
  emit('toggle', next)
  if (!next || !props.scrollOnOpen) return
  await nextTick()
  const node = panel.value
  if (!node) return
  const element = (node.closest('article') as HTMLElement | null) ?? node
  if (typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
  node.focus?.({ preventScroll: true })
}
</script>

<style scoped>
.expandable-chevron {
  transition: transform 200ms ease;
}

.expandable-card[data-attention='true'] {
  border-color: var(--accent);
}

.expandable-body.expandable-motion {
  animation: expandable-reveal 200ms ease;
}

@keyframes expandable-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .expandable-chevron {
    transition: none !important;
  }

  .expandable-body.expandable-motion {
    animation: none !important;
  }

  .expandable-card {
    transition: none !important;
  }
}
</style>
