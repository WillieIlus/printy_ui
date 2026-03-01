<template>
  <div class="rounded-xl border border-amber-200/80 dark:border-amber-800/50 bg-amber-50/50 dark:bg-stone-800/50 p-4">
    <h4 class="text-sm font-semibold text-stone-800 dark:text-stone-100 mb-2">Rate this shop</h4>
    <p class="text-xs text-stone-500 dark:text-stone-400 mb-3">You received a quote from this shop. Share your experience.</p>
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex gap-1">
        <button
          v-for="s in 5"
          :key="s"
          type="button"
          class="p-1 rounded transition-colors hover:bg-amber-200/60 dark:hover:bg-amber-700/40"
          :class="s <= stars ? 'text-amber-500 dark:text-amber-400' : 'text-stone-300 dark:text-stone-600'"
          @click="stars = s"
        >
          <UIcon name="i-lucide-star" class="h-5 w-5" :class="s <= stars && 'fill-current'" />
        </button>
      </div>
      <UTextarea
        v-model="comment"
        placeholder="Optional comment..."
        :rows="2"
        class="min-w-[200px] max-w-full"
      />
      <UButton
        color="primary"
        size="sm"
        :loading="submitting"
        :disabled="stars < 1"
        @click="onSubmit"
      >
        Submit
      </UButton>
    </div>
    <p v-if="submitted" class="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Thanks for your feedback!</p>
  </div>
</template>

<script setup lang="ts">
import { rateShop } from '~/services/ratings'

const props = defineProps<{ shopId: number }>()

const stars = ref(0)
const comment = ref('')
const submitting = ref(false)
const submitted = ref(false)
const toast = useToast()

async function onSubmit() {
  if (stars.value < 1) return
  submitting.value = true
  try {
    await rateShop(props.shopId, { stars: stars.value, comment: comment.value || undefined })
    submitted.value = true
    toast.add({ title: 'Rating submitted', color: 'success' })
  } catch {
    toast.add({ title: 'Could not submit rating', color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>
