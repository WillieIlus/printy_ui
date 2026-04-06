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
    toaster: {
      defaultVariants: {
        position: 'top-right',
      },
      slots: {
        viewport: 'pointer-events-none fixed z-[110] flex flex-col gap-3 focus:outline-none left-4 right-4 top-[max(1rem,env(safe-area-inset-top))] w-auto max-w-[calc(100vw-2rem)] sm:left-auto sm:right-4 sm:w-96 sm:max-w-[min(24rem,calc(100vw-2rem))]',
      },
    },
    toast: {
      slots: {
        root: 'pointer-events-auto relative flex w-full max-w-full min-w-0 items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-2xl',
        wrapper: 'min-w-0 flex-1',
        title: 'min-w-0 text-sm font-semibold break-words [overflow-wrap:anywhere]',
        description: 'min-w-0 whitespace-normal text-sm leading-6 break-words [overflow-wrap:anywhere]',
        icon: 'shrink-0 size-5 mt-0.5',
        actions: 'shrink-0',
        close: 'shrink-0',
      },
      variants: {
        color: {
          success: {
            root: 'bg-green-600 border-green-700 shadow-green-900/20',
            title: 'text-white',
            description: 'text-green-100',
            icon: 'text-white',
            close: 'text-white/80 hover:text-white hover:bg-green-700/50',
          },
          error: {
            root: 'bg-red-600 border-red-700 shadow-red-900/20',
            title: 'text-white',
            description: 'text-red-100',
            icon: 'text-white',
            close: 'text-white/80 hover:text-white hover:bg-red-700/50',
          },
          warning: {
            root: 'bg-amber-600 border-amber-700 shadow-amber-900/20',
            title: 'text-white',
            description: 'text-amber-100',
            icon: 'text-white',
            close: 'text-white/80 hover:text-white hover:bg-amber-700/50',
          },
          info: {
            root: 'bg-blue-600 border-blue-700 shadow-blue-900/20',
            title: 'text-white',
            description: 'text-blue-100',
            icon: 'text-white',
            close: 'text-white/80 hover:text-white hover:bg-blue-700/50',
          },
          neutral: {
            root: 'bg-[var(--p-surface-raised)] border-[var(--p-border)]',
            title: 'text-[var(--p-text)]',
            description: 'text-[var(--p-text-muted)]',
            icon: 'text-[var(--p-text-muted)]',
            close: 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]',
          },
        },
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
