<script setup lang="ts">
import { computed } from 'vue'
import {
  BRAND_ASPECT,
  brandAsset,
  versionedBrandUrl,
  type BrandVariant,
} from '~/shared/brand'

/**
 * Official Printy logo.
 *
 * Renders the supplied brand artwork exactly as delivered - no redrawing,
 * recolouring or distortion. The source files live in `public/branding/svg`.
 *
 * - `variant="logo"`     horizontal symbol + wordmark (headers, footers, auth)
 * - `variant="mark"`     standalone symbol (app icons, compact rails, mobile)
 * - `variant="wordmark"` standalone wordmark
 *
 * - `tone="brand"`   official orange + charcoal artwork, for light surfaces
 * - `tone="mono"`    official single-colour artwork, for one-colour printing
 * - `tone="on-dark"` the same official letterforms painted in the current text
 *                    colour, for dark surfaces (the supplied set has no white
 *                    export, so the shape is masked rather than recoloured)
 */
const props = withDefaults(defineProps<{
  variant?: BrandVariant
  tone?: 'brand' | 'mono' | 'on-dark'
  /** Mobile shows the mark, from `sm` up the full lockup/wordmark. */
  responsive?: boolean
  /** Rendered height; the width follows the official aspect ratio. */
  height?: number | string
  /** Explicit width override (rarely needed - the aspect ratio is preserved). */
  width?: number | string
  /** Accessible name. Pass `decorative` when a nearby label already names it. */
  alt?: string
  decorative?: boolean
}>(), {
  variant: 'logo',
  tone: 'brand',
  responsive: false,
  height: 32,
  alt: 'Printy',
})

const resolvedVariant = computed<BrandVariant>(() => props.variant)

function assetFor(variant: BrandVariant): string {
  if (props.tone === 'on-dark') {
    // Masked copy of the official geometry: keep the authoritative source.
    return brandAsset(variant, 'brand')
  }
  return brandAsset(variant, props.tone === 'mono' ? 'mono' : 'brand')
}

const src = computed(() => versionedBrandUrl(assetFor(resolvedVariant.value)))
const responsiveSrc = computed(() => versionedBrandUrl(assetFor('mark')))
const aspect = computed(() => BRAND_ASPECT[resolvedVariant.value])

const sizeStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.height !== undefined && props.width === undefined) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    style.width = 'auto'
  }
  if (props.width !== undefined) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height !== undefined) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return style
})

const maskStyle = computed<Record<string, string>>(() => ({
  ...sizeStyle.value,
  aspectRatio: `${aspect.value}`,
  backgroundColor: 'currentColor',
  maskImage: `url(${src.value})`,
  WebkitMaskImage: `url(${src.value})`,
}))

const responsiveMaskStyle = computed<Record<string, string>>(() => ({
  height: sizeStyle.value.height ?? '32px',
  aspectRatio: `${BRAND_ASPECT.mark}`,
  backgroundColor: 'currentColor',
  maskImage: `url(${responsiveSrc.value})`,
  WebkitMaskImage: `url(${responsiveSrc.value})`,
}))

defineOptions({ inheritAttrs: false })
</script>

<template>
  <span v-if="tone === 'on-dark'" class="inline-flex shrink-0 items-center" role="img" :aria-label="decorative ? undefined : alt" :aria-hidden="decorative ? 'true' : undefined">
    <template v-if="responsive">
      <span class="block mask-logo sm:hidden" :style="responsiveMaskStyle" />
      <span class="hidden mask-logo sm:block" :style="maskStyle" />
    </template>
    <span v-else class="mask-logo" :style="maskStyle" />
  </span>
  <span v-else class="inline-flex shrink-0 items-center">
    <template v-if="responsive">
      <img
        :src="versionedBrandUrl(assetFor('mark'))"
        :alt="decorative ? '' : alt"
        :aria-hidden="decorative ? 'true' : undefined"
        class="block h-8 w-auto max-w-full select-none sm:hidden"
        :style="{ height: sizeStyle.height ?? '32px' }"
        loading="eager"
        decoding="async"
      >
      <img
        :src="src"
        :alt="decorative ? '' : alt"
        :aria-hidden="decorative ? 'true' : undefined"
        class="hidden w-auto max-w-full select-none sm:block"
        :style="sizeStyle"
        loading="eager"
        decoding="async"
      >
    </template>
    <img
      v-else
      :src="src"
      :alt="decorative ? '' : alt"
      :aria-hidden="decorative ? 'true' : undefined"
      class="w-auto max-w-full select-none"
      :style="sizeStyle"
      loading="eager"
      decoding="async"
    >
  </span>
</template>

<style scoped>
.mask-logo {
  display: block;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
</style>
