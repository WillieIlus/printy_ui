<script setup lang="ts">
import { computed, ref } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'

const props = withDefaults(defineProps<{
  kind: 'manager' | 'printer'
  name: string
  email?: string
  city?: string
  detail?: string
  status: 'pending' | 'verified' | 'rejected'
  busy?: boolean
  error?: string
  missingSteps?: string[]
}>(), {
  email: '',
  city: '',
  detail: '',
  busy: false,
  error: '',
  missingSteps: () => [],
})

const emit = defineEmits<{
  approve: []
  reject: [reason: string]
}>()

const rejecting = ref(false)
const reason = ref('')

const statusLabel = computed(() => ({
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
}[props.status]))

const statusClass = computed(() => ({
  pending: 'border-amber/40 bg-amber-soft text-amber',
  verified: 'border-green/40 bg-green-soft text-green',
  rejected: 'border-red/40 bg-red-soft text-red',
}[props.status]))

function submitReject() {
  const text = reason.value.trim()
  if (!text) return
  emit('reject', text)
  rejecting.value = false
  reason.value = ''
}
</script>

<template>
  <div
    data-test="admin-verification-row"
    :data-kind="props.kind"
    :class="[
      'rounded-xl border bg-card p-4',
      props.status === 'pending' ? 'border-amber/40' : 'border-line',
    ]"
  >
    <div class="flex flex-wrap items-start gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[11px] font-bold text-brand-deep">
        {{ props.name.slice(0, 2).toUpperCase() }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="truncate text-[14.5px] font-semibold tracking-tight text-ink">{{ props.name }}</span>
          <span :class="['rounded-full border px-2 py-0.5 font-mono text-[8.5px] font-semibold tracking-[0.1em] uppercase', statusClass]">
            {{ statusLabel }}
          </span>
        </div>
        <div v-if="props.email || props.city" class="mt-0.5 truncate font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">
          <span v-if="props.email">{{ props.email }}</span>
          <span v-if="props.email && props.city"> · </span>
          <span v-if="props.city">{{ props.city }}</span>
        </div>
        <div v-if="props.detail" class="mt-1 truncate text-[12px] text-ink-2">{{ props.detail }}</div>
        <ul v-if="props.missingSteps?.length" class="mt-2 space-y-1">
          <li
            v-for="step in props.missingSteps"
            :key="step"
            class="flex items-center gap-1.5 text-[11.5px] text-amber"
          >
            <component :is="getIcon('AlertTriangle')" class="h-3 w-3 shrink-0" :stroke-width="2" />
            {{ step }}
          </li>
        </ul>
        <p v-if="props.error" class="mt-2 text-[11.5px] text-red">{{ props.error }}</p>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <button
          v-if="props.status !== 'verified'"
          type="button"
          data-test="admin-verification-approve"
          class="inline-flex min-h-[36px] items-center rounded-xl border border-green/40 bg-green-soft px-3 text-[12px] font-semibold text-green transition-colors hover:bg-green/10 disabled:opacity-50"
          :disabled="props.busy"
          @click="emit('approve')"
        >
          Approve
        </button>
        <button
          v-if="props.status !== 'rejected'"
          type="button"
          data-test="admin-verification-reject"
          class="inline-flex min-h-[36px] items-center rounded-xl border border-line-strong bg-transparent px-3 text-[12px] font-semibold text-ink transition-colors hover:border-red hover:text-red disabled:opacity-50"
          :disabled="props.busy"
          @click="rejecting = true"
        >
          Reject
        </button>
      </div>
    </div>

    <form
      v-if="rejecting"
      data-test="admin-verification-reject-form"
      class="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3"
      @submit.prevent="submitReject"
    >
      <input
        v-model="reason"
        data-test="admin-verification-reason"
        type="text"
        placeholder="Reason for rejection"
        class="min-w-[220px] flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-red"
      >
      <button
        type="submit"
        data-test="admin-verification-confirm-reject"
        class="inline-flex min-h-[36px] items-center rounded-xl bg-red px-3 text-[12px] font-semibold text-white disabled:opacity-50"
        :disabled="!reason.trim() || props.busy"
      >
        Confirm reject
      </button>
      <button
        type="button"
        class="inline-flex min-h-[36px] items-center rounded-xl border border-line px-3 text-[12px] font-semibold text-ink-2"
        @click="rejecting = false"
      >
        Cancel
      </button>
    </form>
  </div>
</template>
