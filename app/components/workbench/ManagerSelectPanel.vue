<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AlertCircle, Loader2, Sparkles, Star, Users } from 'lucide-vue-next'
import type { IntakeSubmitResult } from '~/shared/types'
import { getApiErrorMessage } from '~/shared/api'
import { useIntakeStore } from '~/stores/intake'

const props = defineProps<{
  draftId: number
  query: Record<string, string | number | null | undefined>
}>()

const emit = defineEmits<{
  submitted: [result: IntakeSubmitResult]
}>()

const intake = useIntakeStore()
const selectedId = ref<number | null>(null)
const submitError = ref('')

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PM'
}

function badgeLabel(value: string | null) {
  if (!value) return ''
  if (value === 'fast_responder') return 'Fast responder'
  if (value === 'experienced') return 'Experienced'
  if (value === 'most_recommended') return 'Most recommended'
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function hours(value: number | null) {
  if (value === null || value === undefined) {
    return 'time to confirm'
  }
  return `${Number(value).toFixed(1)} hrs`
}

async function submit(managerId: number | null) {
  submitError.value = ''
  selectedId.value = managerId
  try {
    const result = await intake.submit({
      draft_id: props.draftId,
      selected_manager_id: managerId,
      manager_selection_mode: managerId === null ? 'printy_auto' : 'client_selected',
    })
    emit('submitted', result)
  } catch (e) {
    submitError.value = getApiErrorMessage(e, 'Printy could not submit this request.')
  }
}

onMounted(() => {
  intake.fetchRecommendedManagers(props.query).catch(() => {})
})
</script>

<template>
  <div class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
    <div class="flex items-center gap-2 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">
      <Users :size="12" style="color: var(--accent)" /> choose your print manager
    </div>
    <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">
      Pick who confirms and runs this job, or let Printy assign the best available manager.
    </p>

    <div v-if="submitError" class="mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-[12px]" style="background: rgba(251,77,109,.08); color: #B4243F">
      <AlertCircle :size="14" class="mt-0.5 shrink-0" />
      <p>{{ submitError }}</p>
    </div>

    <div v-if="intake.loading" class="mt-4 flex items-center gap-2 text-[12.5px] text-[var(--sub)]">
      <Loader2 :size="14" class="animate-spin" style="color: var(--accent)" /> Finding managers for your spec…
    </div>

    <template v-else>
      <div v-if="intake.hasManagers" class="mt-4 grid gap-3 sm:grid-cols-2">
        <article
          v-for="manager in intake.managers"
          :key="manager.id"
          class="flex flex-col rounded-2xl border p-4 transition-colors"
          :style="{
            borderColor: selectedId === manager.id ? 'var(--accent)' : 'var(--line)',
            background: selectedId === manager.id ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel2)',
          }"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-full font-mono2 text-[11px] font-semibold" style="background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent)">
                {{ initials(manager.display_name) }}
              </div>
              <div class="min-w-0">
                <div class="truncate font-disp text-[13.5px] font-bold">{{ manager.display_name }}</div>
                <div class="truncate font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
                  <Star :size="9" class="mr-0.5 mb-0.5 inline" style="color: var(--accent)" />
                  {{ manager.satisfaction_rating ?? '—' }} · {{ manager.completed_jobs }} jobs
                </div>
              </div>
            </div>
            <span v-if="manager.badge" class="rounded-full px-2 py-[2px] font-mono2 text-[8px] font-bold uppercase tracking-[0.1em]" style="background: color-mix(in srgb, var(--accent) 13%, transparent); color: var(--accent)">
              {{ badgeLabel(manager.badge) }}
            </span>
          </div>
          <p class="mt-3 flex-1 text-[11.5px] leading-relaxed text-[var(--sub)]">{{ manager.recommendation_reason }}</p>
          <div class="mt-3 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
            Responds in {{ hours(manager.avg_response_hours) }}
          </div>
          <button
            type="button"
            class="press-key mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
            style="background: var(--accent)"
            :disabled="intake.submitting"
            @click="submit(manager.id)"
          >
            <Loader2 v-if="intake.submitting && selectedId === manager.id" :size="12" class="animate-spin" />
            Select manager
          </button>
        </article>
      </div>

      <div v-else class="mt-4 rounded-xl p-4 text-[12px] leading-relaxed text-[var(--sub)]" style="background: var(--panel2)">
        <div class="flex items-center gap-1.5">
          <Sparkles :size="13" style="color: var(--accent)" />
          <span class="font-semibold text-[var(--ink)]">No managers matched this spec yet</span>
        </div>
        <p class="mt-1">{{ intake.message || 'Printy can still receive the request and assign the best available manager.' }}</p>
      </div>

      <button
        type="button"
        class="press-key mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]"
        style="border-color: var(--line)"
        :disabled="intake.submitting"
        @click="submit(null)"
      >
        <Loader2 v-if="intake.submitting && selectedId === null" :size="12" class="animate-spin" />
        Let Printy assign automatically
      </button>
    </template>
  </div>
</template>
