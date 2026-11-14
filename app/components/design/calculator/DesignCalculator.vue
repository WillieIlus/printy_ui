<script setup lang="ts">
/**
 * The single calculator entry point.
 *
 * Every viewer — signed-out visitor, buyer, manager or printer — mounts the
 * same universal presentation. Role differences are capabilities passed into
 * that presentation (production options and imposition for managers/admins),
 * never a second calculator design.
 */
import { computed } from 'vue'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  locked?: boolean
  embedded?: boolean
  authed?: boolean
  stacked?: boolean
  compact?: boolean
  showManagerCards?: boolean
  ctaLabel?: string
  priceOnly?: boolean
  split?: boolean
}>(), {
  locked: false,
  embedded: false,
  authed: false,
  stacked: false,
  compact: false,
  showManagerCards: false,
  ctaLabel: '',
  priceOnly: false,
  split: false,
})

const emit = defineEmits<{
  'quote-created': [ref: string, total: number | null]
  unlock: []
}>()

const auth = useAuthStore()

/** Production detail is a capability, not a visual mode. */
const showProductionDetails = computed(() =>
  auth.isAuthenticated
  && (
    auth.dashboardRole === 'partner'
    || auth.dashboardRole === 'production'
    || auth.dashboardRole === 'super_admin'
  ),
)
</script>

<template>
  <DesignCalculatorMinimal
    :authed="props.authed || auth.isAuthenticated"
    :locked="props.locked"
    :price-only="props.priceOnly"
    :cta-label="props.ctaLabel"
    :split="props.split"
    :compact="props.compact"
    :embedded="props.embedded"
    :stacked="props.stacked"
    :show-production-details="showProductionDetails"
    @quote-created="(ref: string, total: number | null) => emit('quote-created', ref, total)"
    @unlock="emit('unlock')"
  />
</template>
