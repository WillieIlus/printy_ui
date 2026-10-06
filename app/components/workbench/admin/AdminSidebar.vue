<template>
  <div>
    <!-- desktop rail -->
    <aside
      class="hidden lg:sticky lg:block lg:top-[104px] lg:max-h-[calc(100vh-124px)] lg:w-full lg:overflow-y-auto lg:pr-1"
    >
      <AdminNavPanel :groups="groups" :is-active="isActive" />
    </aside>

    <!-- mobile drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-[70] lg:hidden">
          <div class="absolute inset-0 bg-black/55 backdrop-blur-[4px]" @click="emit('close')" />
          <aside
            class="absolute inset-y-0 left-0 w-[272px] max-w-[86vw] overflow-y-auto border-r p-3"
            :style="{ background: 'var(--bg)', borderColor: 'var(--line)' }"
          >
            <button
              type="button"
              class="press-key absolute right-3 top-3 rounded-full p-2"
              :style="{ color: 'var(--sub)' }"
              aria-label="Close admin navigation"
              @click="emit('close')"
            >
              <X :size="16" />
            </button>
            <AdminNavPanel :groups="groups" :is-active="isActive" @navigate="emit('close')" />
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { AdminNavBadgeGroup } from '~/composables/useAdminNav'

defineProps<{
  open: boolean
  groups: AdminNavBadgeGroup[]
  isActive: (to: string) => boolean
}>()

const emit = defineEmits<{ close: [] }>()
</script>