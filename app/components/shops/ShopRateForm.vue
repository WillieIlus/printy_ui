<template>
  <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4">
    <h4 class="mb-2 text-sm font-semibold text-[var(--p-text)]">{{ t('shop.rateThisShop') }}</h4>
    <p class="mb-3 text-xs text-[var(--p-text-muted)]">{{ t('shop.rateThisShopDescription') }}</p>
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex gap-1">
        <button
          v-for="s in 5"
          :key="s"
          type="button"
          class="p-1 rounded transition-colors hover:bg-amber-200/60 dark:hover:bg-amber-700/40"
          :class="s <= stars ? 'text-amber-500 dark:text-amber-400' : 'text-[var(--p-border-dim)] dark:text-[var(--p-text-muted)]/45'"
          @click="stars = s"
        >
          <UIcon name="i-lucide-star" class="h-5 w-5" :class="s <= stars && 'fill-current'" />
        </button>
      </div>
      <UTextarea
        v-model="comment"
        :placeholder="t('shop.optionalComment')"
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
        {{ t('shop.submitRating') }}
      </UButton>
    </div>
    <p v-if="submitted" class="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{{ t('shop.ratingThanks') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { rateShop } from '~/services/ratings'

const props = defineProps<{ shopId: number }>()
const { t } = useI18n()

const stars = ref(0)
const comment = ref('')
const submitting = ref(false)
const submitted = ref(false)
const toast = useToast()
const api = useApi()

async function onSubmit() {
  if (stars.value < 1) return
  submitting.value = true
  try {
    await rateShop(props.shopId, { stars: stars.value, comment: comment.value || undefined }, api)
    submitted.value = true
    toast.add({ title: t('shop.ratingSubmitted'), color: 'success' })
  } catch {
    toast.add({ title: t('shop.ratingSubmitFailed'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>
