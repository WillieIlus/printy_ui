<template>
  <div class="relative">
    <button
      ref="trigger"
      type="button"
      title="Notifications"
      class="press-key relative rounded-full border p-2"
      :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
      aria-haspopup="true"
      :aria-expanded="open"
      @click.stop="toggle"
    >
      <Bell :size="13" />
      <span
        v-if="notifications.totalUnread > 0"
        class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono2 text-[8px] font-bold"
        style="background: var(--accent); color: var(--accentInk)"
      >
        {{ notifications.totalUnread > 99 ? '99+' : notifications.totalUnread }}
      </span>
    </button>

    <Teleport to="body">
      <div v-if="open" :style="themeVars">
        <div class="fixed inset-0 z-[70] bg-black/25 sm:bg-transparent" @click="open = false" />

        <!-- mobile: bottom sheet -->
        <div
          v-if="isMobile"
          class="fixed inset-x-0 bottom-0 z-[71] flex max-h-[78vh] flex-col overflow-hidden rounded-t-2xl border shadow-2xl"
          :style="panelStyle"
        >
          <div class="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full" style="background: var(--line)" />
          <NotificationPanelContent @close="open = false" />
        </div>

        <!-- desktop: anchored popover -->
        <div
          v-else
          class="fixed z-[71] flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          :style="panelStyle"
        >
          <NotificationPanelContent @close="open = false" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { startNotificationPolling, useNotificationsStore } from '~/stores/notifications'
import { useProtoTheme } from '~/composables/useProtoTheme'

const notifications = useNotificationsStore()
const auth = useAuthStore()
const { themeVars } = useProtoTheme()

const open = ref(false)
const trigger = ref<HTMLElement | null>(null)
const isMobile = ref(false)
const coords = ref({ top: 0, right: 0 })

let stopPolling: (() => void) | null = null
let media: MediaQueryList | null = null

const panelStyle = computed(() => {
  const base = {
    background: 'color-mix(in srgb, var(--bg) 96%, white)',
    borderColor: 'var(--line)',
    color: 'var(--ink)',
  }
  if (isMobile.value) {
    return { ...base, maxHeight: '78vh' }
  }
  return {
    ...base,
    top: `${coords.value.top}px`,
    right: `${coords.value.right}px`,
    width: '360px',
    maxHeight: 'min(70vh, 460px)',
  }
})

function measure() {
  if (!trigger.value || isMobile.value) {
    return
  }
  const rect = trigger.value.getBoundingClientRect()
  coords.value = {
    top: rect.bottom + 8,
    right: Math.max(8, window.innerWidth - rect.right),
  }
}

function syncMedia() {
  isMobile.value = media?.matches ?? false
  if (open.value) {
    measure()
  }
}

onMounted(() => {
  media = window.matchMedia('(max-width: 639px)')
  syncMedia()
  media.addEventListener('change', syncMedia)
  window.addEventListener('resize', measure)
})

onBeforeUnmount(() => {
  stopPolling?.()
  media?.removeEventListener('change', syncMedia)
  window.removeEventListener('resize', measure)
})

watch(
  () => auth.isAuthenticated,
  async (authed) => {
    if (import.meta.client) {
      if (authed) {
        await notifications.fetch()
        stopPolling = startNotificationPolling()
      } else {
        open.value = false
        stopPolling?.()
        stopPolling = null
      }
    }
  },
  { immediate: true },
)

function toggle() {
  open.value = !open.value
  if (open.value) {
    measure()
    notifications.fetch()
  }
}
</script>
