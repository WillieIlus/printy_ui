<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="DS"
      kicker="Money & risk"
      title="Disputes"
      description="Money frozen against a job, and the reprint decision that releases it. Open first, settled underneath."
    >
      <template #actions>
        <span
          :class="[
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase',
            openDisputes.length ? 'border-red/40 bg-red-soft text-red' : 'border-line bg-card text-ink-2',
          ]"
        >
          <component :is="getIcon('AlertTriangle')" class="h-3.5 w-3.5" :stroke-width="2" />
          {{ openDisputes.length }} open · {{ money(frozenTotal) }} frozen
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Open disputes"
      :count="openDisputes.length"
      hint="funds stay in custody until a decision is recorded"
    >
      <div v-if="openDisputes.length" class="space-y-2.5">
        <div
          v-for="job in openDisputes"
          :key="job.id"
          class="overflow-hidden rounded-xl border border-red/45 bg-card"
        >
          <div class="h-1.5 bg-red/70" />
          <div class="bg-red-soft/40 p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                class="font-mono text-[11px] font-semibold tracking-[0.12em] text-red underline underline-offset-4"
                @click="openJob(job)"
              >
                {{ job.code }}
              </button>
              <DesignAdminStatusPill :status="job.status" />
            </div>
            <button
              type="button"
              class="mt-2 block max-w-full text-left text-[16px] font-bold tracking-tight text-ink hover:underline"
              @click="openJob(job)"
            >
              {{ job.title }}
            </button>
            <p class="mt-2 max-w-[64ch] text-[12.5px] leading-snug text-ink-2">{{ job.dispute?.reason }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="rounded-full border border-red/40 bg-red-soft px-2.5 py-1 font-mono text-[9.5px] tracking-[0.08em] text-red uppercase">
                {{ money(job.dispute?.amount ?? job.value) }} frozen
              </span>
              <span class="font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase">
                opened by {{ job.dispute?.openedBy }}
              </span>
              <span class="font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase">
                {{ mgr(job.managerId)?.name }}
              </span>
              <div class="ml-auto flex gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-red bg-red px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-red/90"
                  @click="resolve(job)"
                >
                  Resolve
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl border border-line-strong bg-transparent px-3 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-ink hover:bg-paper-2"
                  @click="openJob(job)"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DesignEmptyNote v-else title="Zero open disputes — the marketplace is clean." />
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="Resolved"
      :count="resolvedDisputes.length"
      hint="reprint approved and funds kept in custody"
    >
      <div v-if="resolvedDisputes.length" class="space-y-2">
        <div
          v-for="job in resolvedDisputes"
          :key="job.id"
          class="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card p-3.5"
        >
          <DesignAdminStatusPill status="on-track" />
          <button
            type="button"
            class="font-mono text-[10px] tracking-[0.1em] text-brand underline-offset-4 hover:underline"
            @click="openJob(job)"
          >
            {{ job.code }}
          </button>
          <span class="truncate text-[12px] text-ink-2">
            Dispute resolved — reprint approved, {{ money(job.value) }} stayed in custody
          </span>
        </div>
      </div>

      <DesignEmptyNote v-else title="No disputes have been resolved yet." />
    </DesignAdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { mgr, money, type Job } from '~/shared/workflow/printy'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignAdminStatusPill from '~/components/design/admin/AdminStatusPill.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

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
