<template>
  <div class="space-y-5">
      <div v-if="pending" class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden">
        <div class="h-1.5 bg-gradient-to-r from-[#e13515] to-[#f97316]"></div>
        <div class="px-6 py-8 sm:px-8 sm:py-9">
          <div class="animate-pulse space-y-4">
            <div class="h-4 w-32 rounded bg-[#e4e7ec]"></div>
            <div class="h-8 w-2/3 rounded bg-[#e4e7ec]"></div>
            <div class="h-4 w-1/2 rounded bg-[#e4e7ec]"></div>
            <div class="h-24 rounded-2xl bg-[#f9fafb] border border-[#e4e7ec]"></div>
          </div>
        </div>
      </div>

      <div v-else-if="errorMessage" class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden">
        <div class="h-1.5 bg-gradient-to-r from-[#e13515] to-[#f97316]"></div>
        <div class="px-6 py-7 sm:px-8">
          <div class="flex items-start gap-3 bg-[#fff4ed] border border-[#fed7b5] rounded-xl px-4 py-4 mb-5">
            <svg class="w-5 h-5 text-[#c4471a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-[13px] font-bold text-[#c4471a]">Tracking failed</p>
              <p class="text-[12px] text-[#92400e] mt-1 leading-relaxed">{{ errorMessage }}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/track-job" class="inline-flex items-center justify-center gap-2 bg-[#e13515] hover:bg-[#b82c10] text-white font-bold text-[13.5px] px-5 py-2.5 rounded-xl shadow-sm transition-colors">
              Try another token
            </NuxtLink>
            <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-semibold text-[13.5px] px-5 py-2.5 rounded-xl transition-colors">
              Sign in instead
            </NuxtLink>
          </div>
        </div>
      </div>

      <template v-else-if="job && isManagedJob">
        <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden">
          <div class="h-1.5 bg-gradient-to-r from-[#e13515] to-[#f97316]"></div>
          <div class="px-6 py-6 sm:px-8 sm:py-7 space-y-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-[12px] font-bold uppercase tracking-widest text-[#98a2b3] mb-2">Managed Job Tracking</p>
                <h1 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight leading-snug">{{ managedStatusLabel }}</h1>
                <p class="text-[13.5px] text-[#667085] leading-relaxed mt-2 max-w-xl">
                  This public view only shows safe client-facing progress for a partner-managed job.
                </p>
              </div>
              <div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-5 py-4">
                <p class="text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3] mb-1">Estimated ready</p>
                <p class="text-[15px] font-extrabold text-[#101828]">{{ managedEstimatedReadyLabel }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-5 py-5">
                <p class="text-[12px] font-semibold uppercase tracking-widest text-[#98a2b3] mb-3">Partner contact</p>
                <p class="text-[15px] font-bold text-[#101828]">{{ managedPartnerName }}</p>
                <p class="text-[13px] text-[#667085] mt-1">{{ managedPartnerContact }}</p>
              </div>

              <div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-5 py-5">
                <p class="text-[12px] font-semibold uppercase tracking-widest text-[#98a2b3] mb-3">Proof preview</p>
                <div v-if="managedProofPreviewUrl" class="space-y-3">
                  <img :src="managedProofPreviewUrl" alt="Approved proof preview" class="w-full max-h-64 object-contain rounded-xl border border-[#e4e7ec] bg-white" />
                  <p class="text-[12px] text-[#667085]">Approved proof available for this public tracking link.</p>
                </div>
                <p v-else class="text-[13px] text-[#667085]">No approved proof preview is available yet.</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="job">
        <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden">
          <div class="h-1.5 bg-gradient-to-r from-[#e13515] to-[#f97316]"></div>
          <div class="px-6 py-6 sm:px-8 sm:py-7">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div class="flex items-center gap-3 flex-wrap mb-2">
                  <span class="text-[12px] font-bold uppercase tracking-widest text-[#98a2b3]">{{ jobReference }}</span>
                  <span class="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1 rounded-full border" :class="statusBadgeClass">
                    <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="statusDotClass"></span>
                    {{ heroStatusLabel }}
                  </span>
                </div>

                <h1 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight leading-snug mb-2">
                  {{ jobTitle }}
                </h1>

                <p class="text-[13.5px] text-[#667085] leading-relaxed max-w-md">
                  Your job is being tracked through a
                  <span class="font-semibold text-[#344054]">secure Printy public link.</span>
                </p>
              </div>

              <div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-5 py-4 shrink-0 text-left sm:text-right">
                <p class="text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3] mb-1">Expected ready</p>
                <p class="text-[15px] font-extrabold text-[#101828]">{{ expectedReadyLabel }}</p>
                <div class="flex items-center gap-1.5 mt-2 sm:justify-end">
                  <svg class="w-3.5 h-3.5 text-[#12b76a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-[12px] text-[#12b76a] font-semibold">{{ scheduleState }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-8 sm:py-7">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-4 h-4 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 class="text-[14px] font-bold text-[#344054] uppercase tracking-wider">Job progress</h2>
          </div>

          <div class="hidden sm:block">
            <div class="relative">
              <div class="absolute top-[22px] left-[30px] right-[30px] h-0.5 bg-[#e4e7ec] z-0"></div>
              <div class="absolute top-[22px] left-[30px] h-0.5 bg-[#e13515] z-0" :style="{ width: progressFillWidth }"></div>

              <div class="relative grid grid-cols-7 gap-0 z-10">
                <div v-for="step in timelineSteps" :key="step.key" class="flex flex-col items-center gap-2">
                  <div v-if="step.state === 'complete'" class="w-11 h-11 rounded-full bg-[#e13515] border-4 border-white shadow-md flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div v-else-if="step.state === 'active'" class="w-11 h-11 rounded-full bg-[#e13515] border-4 border-white shadow ring-4 ring-[#fde8e2] flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div v-else class="w-11 h-11 rounded-full bg-white border-2 border-[#e4e7ec] flex items-center justify-center">
                    <svg class="w-4 h-4 text-[#d0d5dd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="7" />
                    </svg>
                  </div>
                  <p class="text-[10.5px] text-center leading-tight" :class="step.state === 'active' ? 'font-bold text-[#e13515]' : step.state === 'complete' ? 'font-semibold text-[#344054]' : 'text-[#98a2b3]'">
                    <template v-for="(line, index) in step.labelLines" :key="`${step.key}-${index}`">
                      <span>{{ line }}</span>
                      <br v-if="index < step.labelLines.length - 1">
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="sm:hidden space-y-0">
            <div v-for="(step, index) in timelineSteps" :key="step.key" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div v-if="step.state === 'complete'" class="w-8 h-8 rounded-full bg-[#e13515] border-4 border-white shadow flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div v-else-if="step.state === 'active'" class="w-8 h-8 rounded-full bg-[#e13515] ring-4 ring-[#fde8e2] border-4 border-white shadow flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-white border-2 border-[#e4e7ec] flex items-center justify-center shrink-0"></div>
                <div v-if="index < timelineSteps.length - 1" class="w-0.5 flex-1 my-1" :class="step.state === 'complete' ? 'bg-[#e13515]' : 'bg-[#e4e7ec]'"></div>
              </div>
              <div class="pb-5 pt-1">
                <p class="text-[13px]" :class="step.state === 'active' ? 'font-bold text-[#e13515]' : step.state === 'complete' ? 'font-semibold text-[#344054]' : 'text-[#98a2b3]'">{{ step.label }}</p>
                <p v-if="step.state === 'active'" class="text-[11.5px] text-[#667085] mt-0.5">Active now</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-7">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-7 h-7 rounded-lg bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 class="text-[13.5px] font-bold text-[#344054] uppercase tracking-wider">Job details</h2>
            </div>

            <div class="space-y-0 divide-y divide-[#f2f4f7]">
              <div v-for="detail in detailRows" :key="detail.label" class="flex items-center justify-between py-3 gap-4">
                <span class="text-[13px] text-[#667085]">{{ detail.label }}</span>
                <span class="text-[13px] font-semibold text-[#101828] text-right">{{ detail.value }}</span>
              </div>
            </div>

            <div class="mt-4 flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
              <svg class="w-4 h-4 text-[#98a2b3] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p class="text-[12px] text-[#667085] leading-relaxed">
                This public page only shows token-safe job fields from Printy. Sign in if you need full order history or account-only actions.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-7">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-7 h-7 rounded-lg bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-[13.5px] font-bold text-[#344054] uppercase tracking-wider">Artwork & proofs</h2>
            </div>

            <div class="flex items-center gap-3 rounded-xl px-4 py-3.5 mb-4" :class="artworkBannerClass">
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="artworkIconWrapClass">
                <svg class="w-4 h-4" :class="artworkIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-[13px] font-bold" :class="artworkTitleClass">{{ artworkBannerTitle }}</p>
                <p class="text-[11.5px] text-[#667085] mt-0.5">{{ artworkBannerText }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-4 py-3.5 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-[13px] font-semibold text-[#101828] truncate max-w-[180px]">{{ artworkFileName }}</p>
                  <p class="text-[11px] text-[#98a2b3] mt-0.5">{{ artworkFileMeta }}</p>
                </div>
              </div>
              <NuxtLink to="/auth/login" class="text-[12px] font-semibold text-[#e13515] border border-[#fda497] bg-[#fff8f7] hover:bg-[#fef3f2] rounded-lg px-3 py-1.5 transition-colors shrink-0">
                View file
              </NuxtLink>
            </div>

            <div class="mb-4">
              <p class="text-[12px] font-semibold uppercase tracking-widest text-[#98a2b3] mb-3">Digital proof</p>
              <div class="flex items-center gap-3 rounded-xl px-4 py-3.5 mb-3" :class="proofBannerClass">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="proofIconWrapClass">
                  <svg class="w-4 h-4" :class="proofIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-[13px] font-bold" :class="proofTitleClass">{{ proofStatusTitle }}</p>
                  <p class="text-[11.5px] text-[#667085] mt-0.5">{{ proofStatusText }}</p>
                </div>
                <NuxtLink to="/auth/login" class="text-[12px] font-semibold text-[#344054] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] rounded-lg px-3 py-1.5 transition-colors shrink-0">
                  View proof
                </NuxtLink>
              </div>
            </div>

            <NuxtLink to="/auth/login" class="w-full flex items-center justify-center gap-2 border border-dashed border-[#d0d5dd] rounded-xl py-3 text-[13px] font-semibold text-[#667085] hover:border-[#e13515] hover:text-[#e13515] hover:bg-[#fff8f7] transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload revised file
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-7">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-7 h-7 rounded-lg bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h2 class="text-[13.5px] font-bold text-[#344054] uppercase tracking-wider">Payment</h2>
            </div>

            <div class="flex items-center gap-3 rounded-xl px-4 py-3.5 mb-5" :class="paymentBannerClass">
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="paymentIconWrapClass">
                <svg class="w-4 h-4" :class="paymentIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-[13px] font-bold" :class="paymentTitleClass">{{ paymentTitle }}</p>
                <p class="text-[11.5px] text-[#667085] mt-0.5">{{ paymentSubtitle }}</p>
              </div>
            </div>

            <div class="space-y-0 divide-y divide-[#f2f4f7] mb-5">
              <div v-for="row in paymentRows" :key="row.label" class="flex items-center justify-between py-3 gap-4">
                <span class="text-[13px] text-[#667085]">{{ row.label }}</span>
                <span class="text-[13px] font-semibold text-[#101828] text-right" :class="row.emphasis ? 'text-[15px] font-extrabold' : ''">{{ row.value }}</span>
              </div>
            </div>

            <div class="flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
              <svg class="w-4 h-4 text-[#98a2b3] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p class="text-[12px] text-[#667085] leading-relaxed">
                Public tracking does not expose billing records. Sign in to view invoices, receipt downloads, or confirmed transaction history.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-7">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-7 h-7 rounded-lg bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 class="text-[13.5px] font-bold text-[#344054] uppercase tracking-wider">Delivery &amp; pickup</h2>
            </div>

            <div class="flex items-center gap-3 mb-5">
              <span class="inline-flex items-center gap-1.5 bg-[#eff8ff] border border-[#b2ddff] text-[#1570ef] text-[11.5px] font-bold px-3 py-1.5 rounded-full">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H4m9 0h2m0 0h2a1 1 0 001-1v-4l-3-4h-3m0 9V6" />
                </svg>
                {{ deliveryModeLabel }}
              </span>
            </div>

            <div class="space-y-0 divide-y divide-[#f2f4f7] mb-5">
              <div v-for="row in deliveryRows" :key="row.label" class="flex items-center justify-between py-3 gap-4">
                <span class="text-[13px] text-[#667085]">{{ row.label }}</span>
                <span v-if="!row.isBadge && !row.isCode" class="text-[13px] font-semibold text-[#101828] text-right">{{ row.value }}</span>
                <span v-else-if="row.isBadge" class="inline-flex items-center gap-1.5 text-[12px] font-bold rounded-full px-2.5 py-0.5 border bg-[#fffaeb] border-[#fedf89] text-[#b54708]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#f79009]"></span>
                  {{ row.value }}
                </span>
                <div v-else class="flex items-center gap-2">
                  <span class="text-[16px] font-extrabold text-[#101828] tracking-[0.15em] font-mono">{{ row.value }}</span>
                  <button type="button" class="text-[11px] font-semibold text-[#e13515] border border-[#fda497] rounded px-2 py-0.5 hover:bg-[#fff8f7] transition-colors" @click="copyToken">
                    {{ copied ? 'Copied' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-start gap-2.5 bg-[#fffaeb] border border-[#fedf89] rounded-lg px-4 py-3">
              <svg class="w-4 h-4 text-[#b54708] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-[12px] text-[#92400e] leading-relaxed">
                This page does not expose private fulfillment contacts. Use your tracking token or sign in to continue safely through Printy.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm px-6 py-6 sm:px-8 sm:py-7">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#fef3f2] border border-[#fde8e2] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 class="text-[15px] font-bold text-[#101828] mb-1">Need help with this job?</h2>
                <p class="text-[13px] text-[#667085] leading-relaxed max-w-md">
                  For your protection, public tracking stays limited. Sign in or contact Printy support for deeper order help, artwork questions, or delivery clarification.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 shrink-0 sm:items-center">
              <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 bg-[#e13515] hover:bg-[#b82c10] text-white font-bold text-[13.5px] px-5 py-2.5 rounded-xl shadow-sm transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message Printy Support
              </NuxtLink>

              <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] font-semibold text-[13.5px] px-5 py-2.5 rounded-xl transition-colors">
                <svg class="w-4 h-4 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Message your partner
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#f9fafb] border border-[#e4e7ec] rounded-xl px-5 py-4">
          <div class="flex items-center gap-3">
            <svg class="w-4 h-4 text-[#98a2b3] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <p class="text-[12.5px] text-[#667085] leading-relaxed">
              This tracking link shows <span class="font-semibold text-[#344054]">limited job information only.</span>
              Sign in for full account history, invoice downloads, and past orders.
            </p>
          </div>

          <NuxtLink to="/auth/login" class="text-[12.5px] font-bold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors shrink-0">
            Sign in ->
          </NuxtLink>
        </div>
      </template>

  </div>
</template>

<script setup lang="ts">
import { printyStatusDot, printyStatusVariant } from '~/constants/design'
import { getApiErrorMessage } from '~/shared/api'
import { fetchTrackedJob } from '~/services/jobs'

definePageMeta({ layout: 'track' })

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const copied = ref(false)

const { data: job, pending, error } = await useAsyncData<Record<string, any> | null>(
  () => `public-job-${token.value}`,
  () => fetchTrackedJob(token.value),
)

const isManagedJob = computed(() => job.value?.track_type === 'managed_job')
const managedStatusLabel = computed(() => String(job.value?.job_status || 'In progress'))
const managedEstimatedReadyLabel = computed(() => formatDeadline(job.value?.estimated_ready))
const managedPartnerName = computed(() => String(job.value?.partner_name || 'Printy support'))
const managedPartnerContact = computed(() => String(job.value?.partner_contact || ''))
const managedProofPreviewUrl = computed(() => String(job.value?.proof_preview_url || ''))

const errorMessage = computed(() => {
  if (!error.value) {
    return ''
  }
  return getApiErrorMessage(error.value, 'Printy could not load this tracking token.')
})

const safeSpecs = computed<Record<string, any>>(() => {
  const value = job.value?.specs
  return value && typeof value === 'object' ? value : {}
})

const normalizedStatus = computed(() => String(job.value?.status || '').toLowerCase())
const stageIndex = computed(() => {
  const status = normalizedStatus.value
  const specs = safeSpecs.value
  if (status.includes('closed') || status.includes('complete') || specs.completed || specs.completed_at) return 7
  if (status.includes('ready') || specs.ready_for_pickup || specs.pickup_ready || specs.ready_at) return 6
  if (status.includes('finish') || specs.finishing || specs.finish || specs.lamination) return 5
  if (status.includes('claim') || status.includes('production') || specs.in_production || specs.printing_started) return 4
  if (specs.artwork_received || specs.artwork || specs.file_name || specs.file_url || specs.uploaded_artwork) return 3
  if (specs.payment_confirmed || specs.amount_paid || specs.payment_method || specs.payment_status) return 2
  return 1
})

const timelineBase = [
  { key: 'quote_approved', label: 'Quote approved' },
  { key: 'payment_confirmed', label: 'Payment confirmed' },
  { key: 'artwork_received', label: 'Artwork received' },
  { key: 'in_production', label: 'In production' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'ready_for_pickup', label: 'Ready for pickup' },
  { key: 'completed', label: 'Completed' },
]

const timelineSteps = computed(() => timelineBase.map((step, index) => ({
  ...step,
  labelLines: step.label.split(' '),
  state: index + 1 < stageIndex.value ? 'complete' : index + 1 === stageIndex.value ? 'active' : 'pending',
})))

const progressFillWidth = computed(() => {
  const percent = Math.max(0, Math.min(100, ((stageIndex.value - 1) / (timelineBase.length - 1)) * 100))
  return `calc(${percent}% - 30px)`
})

const jobReference = computed(() => {
  const id = job.value?.id ? `#${job.value.id}` : token.value
  return `Job ${id}`
})

const jobTitle = computed(() => String(job.value?.title || 'Tracked print job'))
const heroStatusLabel = computed(() => stageIndex.value >= 7 ? 'Completed' : timelineBase[stageIndex.value - 1]?.label || (job.value?.status_label || 'In progress'))
const expectedReadyLabel = computed(() => formatDeadline(job.value?.deadline))
const scheduleState = computed(() => job.value?.deadline ? 'On schedule' : 'Awaiting schedule')

const statusBadgeClass = computed(() => {
  return printyStatusVariant(heroStatusLabel.value)
})

const statusDotClass = computed(() => {
  return printyStatusDot(heroStatusLabel.value)
})

const detailRows = computed(() => [
  { label: 'Product', value: specValue(['product', 'product_name', 'item', 'service'], jobTitle.value) },
  { label: 'Quantity', value: quantityLabel.value },
  { label: 'Paper stock', value: specValue(['paper_stock', 'paper', 'stock', 'material'], 'Not shared publicly') },
  { label: 'Print', value: specValue(['print', 'print_type', 'sides', 'colour_mode'], 'Not shared publicly') },
  { label: 'Finish', value: finishLabel.value },
  { label: 'Size', value: specValue(['size', 'dimensions'], 'Custom') },
])

const quantityLabel = computed(() => {
  const quantity = safeSpecs.value.quantity || safeSpecs.value.qty
  if (!quantity) return 'Not shared publicly'
  return `${quantity} ${Number(quantity) === 1 ? 'unit' : 'units'}`
})

const finishLabel = computed(() => {
  const value = specValue(['finish', 'finishing', 'lamination'], '')
  if (value) return value
  if (Array.isArray(job.value?.finishing_capabilities) && job.value?.finishing_capabilities.length) {
    return job.value.finishing_capabilities.map((item: string) => startCase(item)).join(', ')
  }
  return 'No finishing shared'
})

const artworkBannerTitle = computed(() => stageIndex.value >= 3 ? 'Artwork received' : 'Artwork pending')
const artworkBannerText = computed(() => stageIndex.value >= 3
  ? `Tracking token ${token.value} is linked to artwork-related job specifications.`
  : 'No artwork milestone has been exposed on this public token yet.')
const artworkBannerClass = computed(() => stageIndex.value >= 3 ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const artworkIconWrapClass = computed(() => stageIndex.value >= 3 ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const artworkIconClass = computed(() => stageIndex.value >= 3 ? 'text-[#027a48]' : 'text-[#c4471a]')
const artworkTitleClass = computed(() => stageIndex.value >= 3 ? 'text-[#027a48]' : 'text-[#c4471a]')
const artworkFileName = computed(() => String(safeSpecs.value.file_name || safeSpecs.value.artwork_name || safeSpecs.value.upload_name || `${slugify(jobTitle.value)}.pdf`))
const artworkFileMeta = computed(() => {
  const type = safeSpecs.value.file_type || 'PDF'
  const size = safeSpecs.value.file_size || 'Secure file'
  return `${type} · ${size} · ${stageIndex.value >= 3 ? 'Print-ready' : 'Awaiting review'}`
})

const proofStatusTitle = computed(() => stageIndex.value >= 4 ? 'Proof approved' : 'Proof pending')
const proofStatusText = computed(() => stageIndex.value >= 4
  ? 'This job has moved beyond proofing into active production.'
  : 'Sign in to view proof discussions or approval history.')
const proofBannerClass = computed(() => stageIndex.value >= 4 ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const proofIconWrapClass = computed(() => stageIndex.value >= 4 ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const proofIconClass = computed(() => stageIndex.value >= 4 ? 'text-[#027a48]' : 'text-[#c4471a]')
const proofTitleClass = computed(() => stageIndex.value >= 4 ? 'text-[#027a48]' : 'text-[#c4471a]')

const paymentTitle = computed(() => paymentConfirmed.value ? 'Payment confirmed' : 'Payment pending')
const paymentSubtitle = computed(() => paymentConfirmed.value ? 'Received and verified by Printy' : 'No public payment confirmation is available on this token')
const paymentConfirmed = computed(() => Boolean(safeSpecs.value.payment_confirmed || safeSpecs.value.amount_paid || safeSpecs.value.payment_method || stageIndex.value >= 2))
const paymentBannerClass = computed(() => paymentConfirmed.value ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const paymentIconWrapClass = computed(() => paymentConfirmed.value ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const paymentIconClass = computed(() => paymentConfirmed.value ? 'text-[#027a48]' : 'text-[#c4471a]')
const paymentTitleClass = computed(() => paymentConfirmed.value ? 'text-[#027a48]' : 'text-[#c4471a]')

const paymentRows = computed(() => [
  { label: 'Amount paid', value: specValue(['amount_paid', 'total', 'amount'], 'Sign in to view'), emphasis: true },
  { label: 'Payment method', value: specValue(['payment_method', 'payment_channel'], 'Not shared publicly') },
  { label: 'Reference', value: specValue(['receipt', 'receipt_number', 'transaction_reference'], maskToken(token.value)) },
  { label: 'Paid on', value: specValue(['paid_on', 'payment_date'], 'Not shared publicly') },
])

const deliveryModeLabel = computed(() => specValue(['delivery_mode', 'pickup_mode', 'fulfillment_mode'], 'Secure fulfillment'))
const deliveryRows = computed(() => [
  { label: 'Delivery mode', value: deliveryModeLabel.value, isBadge: false, isCode: false },
  { label: 'Pickup status', value: deliveryStatus.value, isBadge: true, isCode: false },
  { label: 'Tracking token', value: token.value, isBadge: false, isCode: true },
  { label: 'Ready from', value: expectedReadyLabel.value, isBadge: false, isCode: false },
  { label: 'Collection point', value: job.value?.location || 'Shared after sign-in', isBadge: false, isCode: false },
])
const deliveryStatus = computed(() => {
  if (stageIndex.value >= 7) return 'Collected'
  if (stageIndex.value >= 6) return 'Ready for pickup'
  if (stageIndex.value >= 4) return 'In progress'
  return 'Waiting for update'
})

async function copyToken() {
  if (!import.meta.client || !navigator?.clipboard) {
    return
  }
  await navigator.clipboard.writeText(token.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

function specValue(keys: string[], fallback: string) {
  for (const key of keys) {
    const value = safeSpecs.value[key]
    if (value !== undefined && value !== null && value !== '') {
      return Array.isArray(value) ? value.join(', ') : String(value)
    }
  }
  return fallback
}

function formatDeadline(value?: string) {
  if (!value) return 'To be confirmed'
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function startCase(value: string) {
  return String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function slugify(value: string) {
  return String(value || 'job-file')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'job-file'
}

function maskToken(value: string) {
  if (!value) return 'Not available'
  if (value.length <= 8) return value
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}
</script>
