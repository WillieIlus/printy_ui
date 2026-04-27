<!-- Purpose: Starter quote field for selecting a print job type. -->
<template>
  <BaseSelect v-model="selected" label="Job type" :options="options" />
</template>

<script setup lang="ts">
import BaseSelect from '~/components/ui/BaseSelect.vue'

const selected = ref('business-cards')

const options = [
  { label: 'Business cards', value: 'business-cards' },
  { label: 'Flyers', value: 'flyers' },
  { label: 'Posters', value: 'posters' },
  { label: 'Booklets', value: 'booklets' },
]
</script>
