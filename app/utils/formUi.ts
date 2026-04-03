export const formLabelClass = 'mb-1 block text-sm font-semibold leading-5 text-[var(--p-text-dim)]'

export const formHelperClass = 'mt-1 text-[0.8125rem] leading-5 text-[var(--p-text-muted)]'

export const formErrorClass = 'flex items-start gap-1 text-[0.8125rem] leading-5 text-red-500'

export const nativeInputBaseClass = 'softui-control w-full border px-4 py-2 text-sm font-medium leading-5 text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-colors hover:border-[color:var(--p-accent)]/28 focus:border-[color:var(--p-accent)] focus:outline-none focus:ring-2 focus:ring-flamingo-500/12 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70'

export const nativeInputErrorClass = 'border-red-500 bg-red-50/90 text-[var(--p-text)] placeholder-red-300 dark:bg-red-950/35 dark:placeholder-red-700 focus:border-red-600 focus:ring-red-500/25'

export const nativeTextareaClass = `${nativeInputBaseClass} min-h-[7rem]`

export const dashboardFormFieldUi = {
  root: 'space-y-1.5',
  labelWrapper: 'flex items-center justify-between gap-2',
  label: 'text-sm font-semibold leading-5 text-[var(--p-text-dim)]',
  description: 'text-[0.8125rem] leading-5 text-[var(--p-text-muted)]',
  hint: 'text-[0.8125rem] leading-5 text-[var(--p-text-muted)]',
  help: 'mt-1 text-[0.8125rem] leading-5 text-[var(--p-text-muted)]',
  error: 'mt-1 text-[0.8125rem] leading-5 text-red-500',
}

export const dashboardInputUi = {
  base: nativeInputBaseClass,
  leadingIcon: 'text-[var(--p-text-muted)]',
  trailingIcon: 'text-[var(--p-text-muted)]',
}

export const dashboardTextareaUi = {
  base: nativeTextareaClass,
  leadingIcon: 'text-[var(--p-text-muted)]',
  trailingIcon: 'text-[var(--p-text-muted)]',
}

export const dashboardSelectUi = {
  base: 'softui-control relative w-full min-h-10 ps-4 pe-11 transition-colors hover:border-[color:var(--p-accent)]/28 focus-within:border-[color:var(--p-accent)] focus-within:ring-2 focus-within:ring-flamingo-500/12 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:opacity-70',
  trigger: 'flex min-w-0 w-full flex-1 items-center gap-2 py-2 pe-9 text-sm font-medium leading-5 text-[var(--p-text)]',
  value: 'min-w-0 flex-1 truncate pe-1 text-[var(--p-text)]',
  placeholder: 'min-w-0 flex-1 truncate pe-1 text-sm text-[var(--p-text-muted)]',
  trailing: 'pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4',
  trailingIcon: 'h-4 w-4 shrink-0 text-[var(--p-text-muted)]',
  leadingIcon: 'shrink-0 text-[var(--p-text-muted)]',
  content: 'z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-lg backdrop-blur-xl',
  viewport: 'max-h-72 overflow-y-auto p-1',
  item: 'text-[var(--p-text)] data-highlighted:not-data-disabled:before:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]',
  itemLabel: 'truncate',
  itemDescription: 'text-[0.8125rem] leading-5 text-[var(--p-text-muted)]',
  empty: 'px-3 py-2 text-sm text-[var(--p-text-muted)]',
}

export const compactSelectUi = {
  ...dashboardSelectUi,
  base: 'softui-control relative w-full min-h-10 ps-3 pe-10 text-sm text-[var(--p-text)] transition-colors hover:border-[color:var(--p-accent)]/28 focus-within:border-[color:var(--p-accent)] focus-within:ring-2 focus-within:ring-flamingo-500/12',
  trigger: 'flex min-w-0 w-full flex-1 items-center gap-2 py-2 pe-8 text-sm font-medium leading-5 text-[var(--p-text)]',
  value: 'min-w-0 flex-1 truncate pe-1 text-[var(--p-text)]',
  placeholder: 'min-w-0 flex-1 truncate pe-1 text-sm text-[var(--p-text-muted)]',
  trailing: 'pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3',
  trailingIcon: 'h-4 w-4 shrink-0 text-[var(--p-text-muted)]',
}

export const dashboardSurfaceClass = 'softui-panel floating-form-panel rounded-lg'

export const dashboardMutedPanelClass = 'softui-segment rounded-md'

export const dashboardCheckboxLabelClass = 'text-sm font-medium text-[var(--p-text-dim)]'

export const dashboardTableInputClass = 'ml-auto block w-full max-w-[140px] rounded-md border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-sm leading-5 text-right text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-all hover:border-[var(--p-text-muted)] focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/12 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70'
