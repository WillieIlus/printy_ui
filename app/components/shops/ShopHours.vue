<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Business hours</h3>
        <UButton
          v-if="editable && hours?.length"
          variant="soft"
          size="xs"
          :loading="saving"
          @click="editing ? saveHours() : (editing = true)"
        >
          {{ editing ? 'Save' : 'Edit' }}
        </UButton>
      </div>
    </template>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Configure opening hours per day. 1=Monday .. 7=Sunday (ISO). Opening time HH:MM (e.g. 08:00). Closing time HH:MM (e.g. 18:00).
    </p>
    <div v-if="hours?.length" class="mt-4 space-y-2">
      <div
        v-for="(h, i) in localHours"
        :key="h.id ?? h.weekday"
        class="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border dark:border-gray-700 px-3 py-2"
      >
        <span class="font-medium text-gray-900 dark:text-white shrink-0 w-28">{{ h.weekday_display ?? dayLabel(h.weekday) }}</span>
        <template v-if="editing && editable">
          <UFormField label="" :help="'Opening time (HH:MM format, e.g. 08:00)'">
            <UInput
              v-model="localHours[i].from_hour"
              type="time"
              size="sm"
              :disabled="localHours[i].is_closed"
              class="max-w-32"
            />
          </UFormField>
          <UFormField label="" :help="'Closing time (HH:MM format, e.g. 18:00)'">
            <UInput
              v-model="localHours[i].to_hour"
              type="time"
              size="sm"
              :disabled="localHours[i].is_closed"
              class="max-w-32"
            />
          </UFormField>
          <label class="flex items-center gap-2 shrink-0">
            <UCheckbox v-model="localHours[i].is_closed" />
            <span class="text-sm">Closed</span>
          </label>
        </template>
        <span v-else class="text-sm text-gray-600 dark:text-gray-400">
          {{ h.is_closed ? 'Closed' : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}` }}
        </span>
      </div>
    </div>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { OpeningHours } from '~/shared/types'

/** Backend: 1=Mon, 2=Tue, ..., 7=Sun. Single source of truth from model help text. */
const WEEKDAYS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
}

const props = defineProps<{
  hours?: OpeningHours[]
  editable?: boolean
  shopSlug?: string
}>()

const emit = defineEmits<{ saved: [] }>()

const editing = ref(false)
const saving = ref(false)
const localHours = ref<Array<OpeningHours & { weekday_display?: string }>>([])

watch(
  () => props.hours,
  (h) => {
    if (h?.length) {
      localHours.value = h.map((x) => ({
        ...x,
        from_hour: x.from_hour || '08:00',
        to_hour: x.to_hour || '18:00',
      }))
    }
  },
  { immediate: true }
)

function dayLabel(weekday: number) {
  return WEEKDAYS[weekday] ?? `Day ${weekday}`
}

function formatTime(time: string | null) {
  if (!time) return '--'
  return time.length > 5 ? time.slice(0, 5) : time
}

async function saveHours() {
  if (!props.shopSlug) return
  saving.value = true
  try {
    const shopStore = useShopStore()
    const payload = localHours.value.map((h) => ({
      id: h.id,
      weekday: h.weekday,
      from_hour: h.is_closed ? '' : (h.from_hour || '08:00'),
      to_hour: h.is_closed ? '' : (h.to_hour || '18:00'),
      is_closed: h.is_closed,
    }))
    const ok = await shopStore.updateShopHoursBulk(props.shopSlug, payload)
    if (ok?.success !== false) {
      editing.value = false
      emit('saved')
    }
  } finally {
    saving.value = false
  }
}
</script>
