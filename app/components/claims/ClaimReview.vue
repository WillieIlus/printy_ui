<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Review claim</h3>
    </template>
    <div class="space-y-4">
      <UFormField label="Review notes">
        <UTextarea v-model="reviewNotes" placeholder="Notes (optional)..." :rows="3" />
      </UFormField>
      <div class="flex gap-2">
        <UButton color="success" @click="$emit('approve', reviewNotes || '')">Approve</UButton>
        <UButton color="error" @click="$emit('reject', reviewNotes || '')">Reject</UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const reviewNotes = ref('')
defineEmits<{ approve: [notes: string]; reject: [notes: string] }>()
</script>
