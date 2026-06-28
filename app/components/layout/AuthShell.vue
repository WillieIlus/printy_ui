<template>
  <BasePage variant="auth">
    <div class="min-h-screen flex flex-col-reverse lg:flex-row">
      <div class="relative bg-[#101828] flex flex-col justify-between overflow-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12" :class="sideWidthClass">
        <div class="absolute inset-0 opacity-[0.035]" style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 36px 36px;" />
        <div class="absolute -bottom-40 -left-24 w-[440px] h-[440px] rounded-full bg-[#e13515] opacity-[0.10] blur-3xl pointer-events-none"></div>
        <div class="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#e13515] opacity-[0.07] blur-3xl pointer-events-none"></div>

        <div class="relative z-10 hidden lg:block">
          <slot name="logo">
            <PrintyLogo variant="light" size="lg" to="/" />
          </slot>
        </div>

        <div class="relative z-10 lg:my-auto lg:py-8">
          <slot name="side" />
        </div>

        <div class="relative z-10 mt-7 lg:mt-0">
          <slot name="sideFooter" />
        </div>
      </div>

      <div class="flex-1 flex flex-col items-center justify-start bg-[#f2f4f7] px-4 py-7 sm:px-5 sm:py-8 lg:justify-center lg:py-10">
        <slot />
      </div>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import BasePage from '~/components/base/BasePage.vue'
import PrintyLogo from '~/components/printy/PrintyLogo.vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  mode?: 'login' | 'signup' | 'reset'
  showLogo?: boolean
  sidePanel?: boolean
}>(), {
  mode: 'login',
  showLogo: true,
  sidePanel: true,
})

const sideWidthClass = computed(() => props.mode === 'signup' ? 'lg:w-[36%] xl:w-[34%]' : 'lg:w-[38%] xl:w-[34%]')
</script>
