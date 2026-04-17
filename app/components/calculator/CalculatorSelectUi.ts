export const calculatorSelectUi = {
  base: 'softui-control relative h-10 w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-sm text-slate-100',
  trigger: 'flex h-10 min-w-0 w-full items-center gap-2 bg-transparent px-3.5 pe-10 text-sm text-slate-100',
  value: 'min-w-0 flex-1 truncate text-slate-100',
  placeholder: 'min-w-0 flex-1 truncate text-slate-400',
  trailing: 'pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3',
  trailingIcon: 'h-4 w-4 shrink-0 text-slate-400',
  content: 'z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-white text-slate-900 shadow-lg',
  viewport: 'max-h-72 overflow-y-auto p-1',
  item: 'rounded-md text-slate-900 data-highlighted:not-data-disabled:bg-slate-100 data-highlighted:not-data-disabled:text-slate-900',
  itemLabel: 'truncate',
  itemDescription: 'text-xs text-slate-500',
  empty: 'px-3 py-2 text-sm text-slate-500',
} as const
