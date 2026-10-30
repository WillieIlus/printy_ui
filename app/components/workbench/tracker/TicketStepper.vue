<template>
  <div class="ticket-stepper">
    <!-- Full stepper: named stages, current highlighted, done checked. -->
    <ol class="ticket-stepper__steps" :aria-label="`Stage ${currentNumber} of ${total}`">
      <li
        v-for="stage in stages"
        :key="stage.key"
        class="ticket-stepper__step"
        :class="`is-${stage.status}`"
        :aria-current="stage.status === 'current' ? 'step' : undefined"
        :aria-label="`${stage.label}: ${stage.status}`"
      >
        <span class="ticket-stepper__bar" aria-hidden="true" />
        <span class="ticket-stepper__dot" aria-hidden="true">
          <Check v-if="stage.status === 'done'" :size="10" />
        </span>
        <span class="ticket-stepper__label">{{ stage.label }}</span>
      </li>
    </ol>

    <!-- Phones: current stage plus position, instead of seven labels. -->
    <div class="ticket-stepper__compact">
      <div class="ticket-stepper__compact-top">
        <span class="ticket-stepper__compact-stage">{{ currentNote }}</span>
        <span class="ticket-stepper__compact-count">{{ currentNumber }} of {{ total }}</span>
      </div>
      <div class="ticket-stepper__compact-bar" aria-hidden="true">
        <span :style="{ width: progressWidth }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

interface Stage {
  key: string
  label: string
  status: string
}

const props = withDefaults(
  defineProps<{
    stages: Stage[]
    currentNote?: string
    currentNumber?: number
    totalStages?: number
  }>(),
  { currentNote: '', currentNumber: 1, totalStages: 7 },
)

const total = computed(() => props.totalStages || props.stages.length || 7)
const progressWidth = computed(() => {
  const position = Math.min(Math.max(props.currentNumber || 1, 1), total.value)
  return `${Math.round((position / total.value) * 100)}%`
})
</script>

<style scoped>
.ticket-stepper__steps {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.ticket-stepper__step {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.ticket-stepper__bar {
  height: 4px;
  border-radius: 999px;
  background: var(--line);
}

.ticket-stepper__step.is-done .ticket-stepper__bar {
  background: #2fbf71;
}

.ticket-stepper__step.is-current .ticket-stepper__bar {
  background: var(--accent);
}

.ticket-stepper__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-top: -3px;
  border-radius: 999px;
  border: 2px solid var(--line);
  background: var(--panel);
  color: #fff;
}

.ticket-stepper__step.is-done .ticket-stepper__dot {
  border-color: #2fbf71;
  background: #2fbf71;
}

.ticket-stepper__step.is-current .ticket-stepper__dot {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent);
}

.ticket-stepper__label {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  line-height: 1.25;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sub);
}

.ticket-stepper__step.is-done .ticket-stepper__label,
.ticket-stepper__step.is-current .ticket-stepper__label {
  color: var(--ink);
  font-weight: 700;
}

.ticket-stepper__compact {
  display: none;
  margin-top: 16px;
}

.ticket-stepper__compact-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.ticket-stepper__compact-stage {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
}

.ticket-stepper__compact-count {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--sub);
}

.ticket-stepper__compact-bar {
  height: 6px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}

.ticket-stepper__compact-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
}

@media (max-width: 640px) {
  .ticket-stepper__steps {
    display: none;
  }

  .ticket-stepper__compact {
    display: block;
  }
}
</style>
