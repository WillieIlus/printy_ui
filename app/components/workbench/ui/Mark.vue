<script setup lang="ts">
import { computed } from 'vue'
import { BRAND_ASPECT, BRAND_ASSETS, versionedBrandUrl } from '~/shared/brand'

/**
 * The official Printy symbol, painted in a single colour.
 *
 * The glyph comes from the official `printy-mark.svg` (masked, so the supplied
 * geometry is used untouched) and defaults to the brand orange. Existing call
 * sites keep passing `size`/`color`, so the square footprint and vertical
 * alignment of the previous inline glyph are preserved.
 */
const props = withDefaults(defineProps<{
  size?: number | string
  color?: string
  /** Decorative by default: the surrounding link/text already names Printy. */
  label?: string
}>(), {
  size: 26,
  label: '',
})

const box = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

const markStyle = computed<Record<string, string>>(() => ({
  width: box.value,
  height: box.value,
  backgroundColor: props.color || 'var(--color-logo, #e54725)',
  maskImage: `url(${versionedBrandUrl(BRAND_ASSETS.mark)})`,
  WebkitMaskImage: `url(${versionedBrandUrl(BRAND_ASSETS.mark)})`,
}))

const aspectStyle = computed<Record<string, string>>(() => ({
  aspectRatio: `${BRAND_ASPECT.mark}`,
}))
</script>

<template>
  <span
    class="printy-mark inline-flex shrink-0 items-center justify-center"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span class="printy-mark__glyph" :style="[aspectStyle, markStyle]" />
  </span>
</template>

<style scoped>
.printy-mark__glyph {
  display: block;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
</style>
