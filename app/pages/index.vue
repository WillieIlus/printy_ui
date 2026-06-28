<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-5xl space-y-8">
      <div>
        <p class="text-sm font-medium text-[#e13515]">Printy</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-900">Choose a workspace</h1>
        <p class="mt-2 text-sm text-slate-500">Open one of the migrated Nuxt dashboard surfaces.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <NuxtLink to="/dashboard/client" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <p class="font-semibold text-slate-900">Client Dashboard</p>
          <p class="mt-1 text-sm text-slate-500">Quotes, jobs, payments, and messages.</p>
        </NuxtLink>
        <NuxtLink to="/auth/login" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <p class="font-semibold text-slate-900">Auth</p>
          <p class="mt-1 text-sm text-slate-500">Sign in and password flows.</p>
        </NuxtLink>
        <NuxtLink to="/dashboard/client/quotes" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <p class="font-semibold text-slate-900">Quotes</p>
          <p class="mt-1 text-sm text-slate-500">Client quote list.</p>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
