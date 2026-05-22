import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    auth: ComponentProps<typeof import("C:/Users/CodexSandboxOffline/.codex/.sandbox/cwd/e2b9dd7b4da5f8ee/app/layouts/auth.vue").default>
    dashboard: ComponentProps<typeof import("C:/Users/CodexSandboxOffline/.codex/.sandbox/cwd/e2b9dd7b4da5f8ee/app/layouts/dashboard.vue").default>
    default: ComponentProps<typeof import("C:/Users/CodexSandboxOffline/.codex/.sandbox/cwd/e2b9dd7b4da5f8ee/app/layouts/default.vue").default>
    track: ComponentProps<typeof import("C:/Users/CodexSandboxOffline/.codex/.sandbox/cwd/e2b9dd7b4da5f8ee/app/layouts/track.vue").default>
  }
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false> | {
      [K in LayoutKey]: {
        name?: MaybeRef<K | false> | ComputedRef<K | false>
        props?: NuxtLayouts[K]
      }
    }[LayoutKey]
  }
}