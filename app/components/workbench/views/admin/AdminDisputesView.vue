<template>
  <div>
    <AdminPageHead
      eyebrow="Money & risk"
      title="Disputes"
      lede="Money frozen against a job, and the reprint decision that releases it. Open first, settled underneath."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em]"
          :style="openDisputes.length ? { borderColor: 'rgba(251,77,109,.5)', color: '#C81E44' } : { borderColor: 'var(--line)', color: 'var(--sub)' }"
        >
          <Flag :size="12" />
          {{ openDisputes.length }} open · {{ money(frozenTotal) }} frozen
        </span>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="flag"
      tone="bad"
      title="Open disputes"
      :count="openDisputes.length"
      subtitle="Funds are frozen until a decision is recorded. Resolving keeps the money in custody and approves the reprint."
    >
      <div v-if="openDisputes.length" class="space-y-2.5">
        <div
          v-for="j in openDisputes"
          :key="j.id"
          class="overflow-hidden rounded-2xl border"
          :style="{ borderColor: 'rgba(251,77,109,.45)' }"
        >
          <div class="hazard h-2" />
          <div class="p-4" :style="{ background: 'rgba(251,77,109,.06)' }">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                class="font-mono2 text-[11px] font-semibold tracking-[0.14em] text-[#C81E44] underline underline-offset-4"
                @click="openJob(j)"
              >
                {{ j.code }}
              </button>
              <StatusPill :status="j.status" size="sm" />
            </div>
            <button type="button" class="mt-2 block max-w-full text-left font-disp text-[16px] font-bold tracking-tight hover:underline" @click="openJob(j)">
              {{ j.title }}
            </button>
            <p class="mt-2 max-w-[64ch] text-[12.5px] leading-snug text-[var(--sub)]">{{ j.dispute?.reason }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-[rgba(251,77,109,.14)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[#C81E44]">
                {{ money(j.dispute?.amount ?? j.value) }} frozen
              </span>
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
                opened by {{ j.dispute?.openedBy }}
              </span>
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
                {{ mgr(j.managerId)?.name }}
              </span>
              <div class="ml-auto flex gap-2">
                <ActionBtn variant="danger" class="!px-3 !py-2" @click="resolve(j)">Resolve</ActionBtn>
                <ActionBtn variant="ghost" class="!px-3 !py-2" @click="openJob(j)">Inspect</ActionBtn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <CheckCircle2 :size="20" class="mx-auto" style="color: #0E7A45" />
        <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">Zero open disputes — the marketplace is clean.</p>
      </div>
    </AdminSection>

    <AdminSection
      icon="badge-check"
      tone="good"
      title="Resolved"
      :count="resolvedDisputes.length"
      subtitle="Reprint approved and funds kept in custody. Kept so the decision trail stays readable."
    >
      <div v-if="resolvedDisputes.length" class="space-y-2">
        <div
          v-for="j in resolvedDisputes"
          :key="j.id"
          class="flex flex-wrap items-center gap-3 rounded-2xl border p-3.5"
          :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
        >
          <StatusPill status="on-track" size="sm" />
          <button type="button" class="font-mono2 text-[10px] tracking-[0.12em] text-[var(--accent)] underline-offset-4 hover:underline" @click="openJob(j)">
            {{ j.code }}
          </button>
          <span class="truncate text-[12px] text-[var(--sub)]">Dispute resolved — reprint approved, {{ money(j.value) }} stayed in custody</span>
        </div>
      </div>

      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <p class="text-[12.5px] text-[var(--sub)]">No disputes have been resolved yet.</p>
      </div>
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Flag } from 'lucide-vue-next'
import { mgr, money, type Job } from '~/shared/workflow/printy'

const { admins, workflow, openDisputes, resolvedDisputes } = useAdminNav()

const frozenTotal = computed(() => openDisputes.value.reduce((total, job) => total + (job.dispute?.amount ?? job.value), 0))

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}

function resolve(job: Job) {
  admins.clearFocus()
  workflow.act('resolve-dispute', job)
}
</script>