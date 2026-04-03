export default defineAppConfig({
  ui: {
    colors: {
      primary: 'flamingo',
      neutral: 'slate',
    },
    input: {
      variants: {
        outline: 'rounded-lg border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error: 'rounded-lg border-red-500 bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      },
    },
    textarea: {
      variants: {
        outline: 'rounded-lg border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm hover:border-[var(--p-text-muted)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error: 'rounded-lg border-red-500 bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      },
    },
    card: {
      slots: {
        root: 'bg-[var(--p-surface)] border border-[var(--p-border)] rounded-xl shadow-md',
        header: 'border-b border-[var(--p-border-dim)]',
        footer: 'border-t border-[var(--p-border-dim)]',
      },
    },
    modal: {
      slots: {
        overlay: 'bg-black/50 backdrop-blur-sm',
        content: 'bg-[var(--p-surface-raised)] border border-[var(--p-border)] rounded-xl shadow-lg',
      },
    },
    selectMenu: {
      slots: {
        base: 'softui-control relative w-full min-h-10 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] text-[var(--p-text)] shadow-sm transition-colors hover:border-[var(--p-text-muted)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70',
        trigger: 'flex min-h-10 w-full items-center gap-2 bg-transparent px-4 py-2 pe-10 text-sm font-medium leading-5 text-[var(--p-text)]',
        value: 'min-w-0 flex-1 truncate pe-1 text-[var(--p-text)]',
        placeholder: 'min-w-0 flex-1 truncate pe-1 text-sm text-[var(--p-text-muted)]',
        trailing: 'pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3',
        trailingIcon: 'h-4 w-4 shrink-0 text-[var(--p-text-muted)]',
        content: 'z-[100000] bg-[var(--p-surface-raised)] border border-[var(--p-border)] rounded-xl shadow-lg',
        viewport: 'max-h-72 overflow-y-auto p-1',
        item: 'text-[var(--p-text)] data-highlighted:not-data-disabled:before:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]',
      },
    },
  },
})
