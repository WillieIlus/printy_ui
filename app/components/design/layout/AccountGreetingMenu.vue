<script setup lang="ts">
/**
 * Public-site greeting menu for signed-in visitors.
 *
 * It replaces the header's Sign In action with `Hi {FirstName}` and a small
 * dropdown offering the role-aware Dashboard route and the existing auth
 * logout action. Authentication state stays in the auth store; this component
 * is purely presentational and closes itself on outside click, Escape and item
 * selection.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'

const props = withDefaults(defineProps<{
  name: string
  dashboardHref: string
  signOut?: () => void | Promise<void>
}>(), {
  signOut: undefined,
})

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const open = ref(false)

const firstName = computed(() => props.name.trim().split(/\s+/)[0] || 'there')
const chevron = getIcon('ChevronDown')
const arrow = getIcon('ArrowUpRight')

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onDocumentPointer(event: Event) {
  const target = event.target
  if (!root.value || !(target instanceof Node) || root.value.contains(target)) {
    return
  }
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) {
    return
  }
  close()
  trigger.value?.focus()
}

async function onSignOut() {
  close()
  await props.signOut?.()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointer)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointer)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="relative" data-account-greeting>
    <button
      ref="trigger"
      type="button"
      class="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-2 text-[13px] font-semibold tracking-tight text-ink transition-colors hover:border-line hover:bg-paper-2"
      aria-haspopup="menu"
      :aria-expanded="open"
      data-account-greeting-trigger
      @click="toggle"
    >
      <span class="max-w-[10rem] truncate">Hi {{ firstName }}</span>
      <component
        :is="chevron"
        class="h-3.5 w-3.5 shrink-0 text-ink-3 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>

    <div
      v-if="open"
      role="menu"
      aria-label="Account"
      class="absolute top-[calc(100%+8px)] right-0 z-50 w-52 overflow-hidden rounded-xl border border-line bg-card shadow-lift"
      data-account-greeting-menu
    >
      <NuxtLink
        :to="props.dashboardHref"
        role="menuitem"
        class="flex items-center justify-between px-4 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
        @click="close"
      >
        Dashboard
        <component :is="arrow" class="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
      </NuxtLink>
      <div class="ticket-divider" />
      <button
        type="button"
        role="menuitem"
        class="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
        @click="onSignOut"
      >
        Sign out
        <component :is="arrow" class="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
