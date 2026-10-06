<template>
  <div class="flex h-full flex-col">
    <div class="px-3 pb-3.5">
      <span
        class="inline-flex rounded-full px-2.5 py-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.24em]"
        :style="{ background: 'var(--panel2)', color: 'var(--accent)' }"
      >
        {{ ROLE_META.admin.call }}
      </span>
      <div class="mt-2 font-disp text-[17px] font-bold leading-tight tracking-tight">Admin console</div>
      <p class="mt-1 text-[11.5px] leading-snug text-[var(--sub)]">
        The whole marketplace — pulse, people, printers, money and disputes.
      </p>
    </div>

    <nav aria-label="Admin sections" class="flex-1">
      <div v-for="group in groups" :key="group.key" class="mb-4 last:mb-0">
        <ML class="px-3 pb-1.5 !text-[9px] !tracking-[0.26em]">{{ group.label }}</ML>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.key">
            <NuxtLink
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              :title="item.blurb"
              class="group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors"
              :style="isActive(item.to)
                ? { background: 'var(--panel2)', color: 'var(--ink)' }
                : { color: 'var(--sub)' }"
              @click="emit('navigate')"
            >
              <span
                v-if="isActive(item.to)"
                class="absolute inset-y-1.5 left-0 w-[3px] rounded-full"
                style="background: var(--accent)"
              />
              <AdminIcon :name="item.icon" :size="14" class="shrink-0" :style="isActive(item.to) ? { color: 'var(--accent)' } : undefined" />
              <span class="min-w-0 flex-1 truncate font-disp text-[13.5px] font-semibold tracking-tight">{{ item.label }}</span>
              <span
                v-if="item.badge > 0"
                class="shrink-0 rounded-full px-1.5 py-[1px] font-mono2 text-[9px] font-bold"
                :style="item.key === 'disputes' ? { background: 'rgba(200,30,68,.14)', color: '#C81E44' } : { background: 'var(--panel)', color: 'var(--sub)' }"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="mt-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
      <NuxtLink
        to="/app/settings"
        class="flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        @click="emit('navigate')"
      >
        <Settings :size="13" /> Account settings
      </NuxtLink>
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        @click="emit('navigate')"
      >
        <ArrowLeft :size="13" /> Back to printy.ke
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Settings } from 'lucide-vue-next'
import { ROLE_META } from '~/shared/workflow/printy'
import type { AdminNavBadgeGroup } from '~/composables/useAdminNav'

defineProps<{ groups: AdminNavBadgeGroup[]; isActive: (to: string) => boolean }>()

const emit = defineEmits<{ navigate: [] }>()
</script>