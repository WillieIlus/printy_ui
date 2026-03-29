export const calculatorSelectUi = {
  base: 'softui-control relative w-full min-h-10 overflow-hidden rounded-md border border-white/10 bg-white/5 text-sm text-slate-100',
  trigger: 'flex min-w-0 w-full items-center gap-2 bg-transparent px-4 py-2 pe-10 text-sm text-slate-100',
  value: 'min-w-0 flex-1 truncate text-slate-100',
  placeholder: 'min-w-0 flex-1 truncate text-slate-400',
  trailingIcon: 'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400',
  content: 'z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-white text-slate-900 shadow-lg',
  viewport: 'max-h-72 overflow-y-auto p-1',
  item: 'rounded-md text-slate-900 data-highlighted:not-data-disabled:bg-slate-100 data-highlighted:not-data-disabled:text-slate-900',
  itemLabel: 'truncate',
  itemDescription: 'text-xs text-slate-500',
  empty: 'px-3 py-2 text-sm text-slate-500',
} as const
