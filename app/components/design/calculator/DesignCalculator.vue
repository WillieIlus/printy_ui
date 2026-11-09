<script setup lang="ts">
/**
 * The single calculator entry point (SIDE TASK 6B, S6-07).
 *
 * Pages mount this and nothing else. It reads the auth store, resolves the
 * presentation with `designCalculatorMode()` and renders either the one-card
 * minimal layout (signed out, or a user acting as a client) or the multi-card
 * detailed layout (manager, printer, admin). Both layouts bind to the SAME
 * calculator store and the same preview endpoint, so prices never diverge and
 * no pricing runs in the browser.
 *
 * The `mode` prop exists so tests can render a layout directly; no page may
 * pass it. Role switching is reactive: the mode follows `printy_active_role`.
 */
import { computed } from 'vue'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'
import DesignCalculatorDetailed from '~/components/design/calculator/DesignCalculatorDetailed.vue'
import { designCalculatorMode, type DesignCalculatorMode } from '~/utils/design/calculator-mode'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  /** Tests only — pages never choose the mode. */
  mode?: DesignCalculatorMode
  locked?: boolean
  embedded?: boolean
  authed?: boolean
  stacked?: boolean
  compact?: boolean
  showManagerCards?: boolean
  ctaLabel?: string
  priceOnly?: boolean
}>(), {
  mode: undefined,
  locked: false,
  embedded: false,
  authed: false,
  stacked: false,
  compact: false,
  showManagerCards: false,
  ctaLabel: '',
  priceOnly: false,
})

const emit = defineEmits<{
  'quote-created': [ref: string, total: number | null]
  unlock: []
}>()

const auth = useAuthStore()

const resolvedMode = computed<DesignCalculatorMode>(() =>
  props.mode
  ?? designCalculatorMode({
    isAuthenticated: auth.isAuthenticated,
    activeRole: auth.activeRole,
    accessibleRoles: auth.accessibleRoles,
  }),
)
</script>

<template>
  <DesignCalculatorMinimal
    v-if="resolvedMode === 'minimal'"
    :authed="authed || auth.isAuthenticated"
    :locked="locked"
    :price-only="priceOnly"
    :cta-label="ctaLabel"
    @quote-created="(ref: string, total: number | null) => emit('quote-created', ref, total)"
    @unlock="emit('unlock')"
  />
  <DesignCalculatorDetailed
    v-else
    :locked="locked"
    :embedded="embedded"
    :authed="authed"
    :stacked="stacked"
    :compact="compact"
    :show-manager-cards="showManagerCards"
    :cta-label="ctaLabel"
    :price-only="priceOnly"
    @quote-created="(ref: string, total: number | null) => emit('quote-created', ref, total)"
    @unlock="emit('unlock')"
  />
</template>
