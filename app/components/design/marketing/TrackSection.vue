<script setup lang="ts">
import DesignSectionHead from './SectionHead.vue'
import DesignTrackJobPrompt from '../tracker/TrackJobPrompt.vue'
import type { DesignJobView } from '../tracker/TrackJobPrompt.vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  copy?: string
  initialCode?: string
  fetchJob?: (code: string) => Promise<DesignJobView>
}>(), {
  eyebrow: 'Already ordered?',
  title: 'Track it.',
  copy: 'Enter the job code from your confirmation to see exactly where your job is - the stage it is at, who has it, and what happens next.',
  initialCode: '',
  fetchJob: undefined,
})
</script>

<template>
  <section class="border-y border-line bg-paper-2/60">
    <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center">
      <DesignSectionHead
        index="04"
        :eyebrow="props.eyebrow"
        :title="props.title"
        :copy="props.copy"
      >
      </DesignSectionHead>
      <DesignTrackJobPrompt :initial-code="props.initialCode" :fetch-job="props.fetchJob" />
    </div>
  </section>
</template>
