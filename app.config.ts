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
        content: 'z-[100000] bg-[var(--p-surface-raised)] border border-[var(--p-border)] rounded-xl shadow-lg',
      },
    },
  },
})
