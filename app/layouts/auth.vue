<template>
  <div class="min-h-screen flex flex-col-reverse lg:flex-row bg-[#f2f4f7]">
    <div class="lg:w-[38%] xl:w-[34%] relative bg-[#101828] flex flex-col justify-between overflow-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
      <div
        class="absolute inset-0 opacity-[0.035]"
        style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 36px 36px;"
      />
      <div class="absolute -bottom-40 -left-24 w-[440px] h-[440px] rounded-full bg-[#e13515] opacity-[0.10] blur-3xl pointer-events-none" />
      <div class="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#e13515] opacity-[0.07] blur-3xl pointer-events-none" />

      <div class="relative z-10 hidden lg:block">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e13515]">
            <span class="text-base font-bold text-white">P</span>
          </div>
          <span class="text-xl font-bold text-white">Printy</span>
        </NuxtLink>
      </div>

      <div class="relative z-10 lg:my-auto lg:py-8">
        <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-5 lg:mb-7">
          <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]" />
          <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
            Kenya's Print Operating System
          </span>
        </div>

        <h1 class="text-2xl lg:text-[2.35rem] xl:text-[2.55rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4">
          Manage print jobs<br>
          from quote<br>
          <span class="text-[#e13515]">to delivery.</span>
        </h1>

        <p class="text-[#98a2b3] text-[14px] leading-relaxed mb-6 max-w-sm lg:mb-8">
          Sign in to track jobs, manage quotes, and keep every print order organized - all in one place.
        </p>

        <ul class="space-y-3">
          <li v-for="feature in features" :key="feature.title" class="flex items-center gap-4">
            <div class="w-9 h-9 rounded-xl bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0">
              <svg
                v-if="feature.icon === 'calculator'"
                class="w-4 h-4 text-[#e13515]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <svg
                v-else-if="feature.icon === 'card'"
                class="w-4 h-4 text-[#e13515]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <svg
                v-else-if="feature.icon === 'artwork'"
                class="w-4 h-4 text-[#e13515]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <svg
                v-else
                class="w-4 h-4 text-[#e13515]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p class="text-[14px] font-semibold text-white">{{ feature.title }}</p>
              <p class="text-[12px] text-[#667085] mt-0.5">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="relative z-10 mt-7 lg:mt-0">
        <div class="border-t border-[#1d2939] pt-7">
          <div class="flex items-start gap-4">
            <div class="shrink-0">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full bg-[#e13515] border-2 border-[#101828] flex items-center justify-center">
                  <span class="text-[10px] font-bold text-white">MK</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-[#344054] border-2 border-[#101828] flex items-center justify-center">
                  <span class="text-[10px] font-bold text-white">JN</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-[#1d2939] border-2 border-[#101828] flex items-center justify-center">
                  <span class="text-[10px] font-bold text-[#98a2b3]">+4</span>
                </div>
              </div>
            </div>
            <div>
              <p class="text-[13px] text-[#98a2b3] leading-snug">
                Trusted by clients, partner teams, and production shops across Nairobi.
              </p>
              <div class="flex items-center gap-1 mt-1.5">
                <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span class="text-[11px] text-[#475467] ml-1">Verified platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col items-center justify-start bg-[#f2f4f7] px-4 py-7 sm:px-5 sm:py-8 lg:justify-center lg:py-10">
      <div class="w-full max-w-[440px]">
        <div class="flex items-center gap-2 mb-5 lg:hidden">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e13515]">
              <span class="text-sm font-bold text-white">P</span>
            </div>
            <span class="text-lg font-bold text-[#101828]">Printy</span>
          </NuxtLink>
        </div>

        <section class="bg-white border border-[#e4e7ec] shadow-xl shadow-[#1018280d] p-6 rounded-2xl">
          <slot />
        </section>

        <div class="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href="#" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Privacy</a>
          <span class="text-[#d0d5dd]">.</span>
          <a href="#" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Terms</a>
          <span class="text-[#d0d5dd]">.</span>
          <a href="#" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Help</a>
          <span class="text-[#d0d5dd]">.</span>
          <span class="text-[12px] text-[#98a2b3]">(c) 2026 Printy</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'calculator', title: 'Instant estimates', description: 'Imposition-based pricing with market-calibrated ranges' },
  { icon: 'card', title: 'Payment-confirmed jobs', description: 'Production only starts after secure payment is cleared' },
  { icon: 'artwork', title: 'Artwork and proof tracking', description: 'Submit, review, and approve files directly in-platform' },
  { icon: 'tracking', title: 'Tracked fulfilment', description: 'From quote approval to delivery, every status stays in one place' },
]
</script>
