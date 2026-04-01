const formLabelClass = "mb-1 block text-sm font-semibold leading-5 text-[var(--p-text-dim)]";
const formHelperClass = "mt-1 text-[0.8125rem] leading-5 text-[var(--p-text-muted)]";
const formErrorClass = "flex items-start gap-1 text-[0.8125rem] leading-5 text-red-500";
const nativeInputBaseClass = "softui-control w-full border px-4 py-2 text-sm font-medium leading-5 text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-colors hover:border-[color:var(--p-accent)]/28 focus:border-[color:var(--p-accent)] focus:outline-none focus:ring-2 focus:ring-flamingo-500/12 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:text-[var(--p-text-muted)] disabled:opacity-70";
const nativeInputErrorClass = "border-red-500 bg-red-50/90 text-[var(--p-text)] placeholder-red-300 dark:bg-red-950/35 dark:placeholder-red-700 focus:border-red-600 focus:ring-red-500/25";
const nativeTextareaClass = `${nativeInputBaseClass} min-h-[7rem]`;
const dashboardFormFieldUi = {
  root: "space-y-1.5",
  labelWrapper: "flex items-center justify-between gap-2",
  label: "text-sm font-semibold leading-5 text-[var(--p-text-dim)]",
  description: "text-[0.8125rem] leading-5 text-[var(--p-text-muted)]",
  hint: "text-[0.8125rem] leading-5 text-[var(--p-text-muted)]",
  help: "mt-1 text-[0.8125rem] leading-5 text-[var(--p-text-muted)]",
  error: "mt-1 text-[0.8125rem] leading-5 text-red-500"
};
const dashboardInputUi = {
  base: nativeInputBaseClass,
  leadingIcon: "text-[var(--p-text-muted)]",
  trailingIcon: "text-[var(--p-text-muted)]"
};
const dashboardSelectUi = {
  base: "softui-control relative w-full min-h-10 ps-4 pe-11 transition-colors hover:border-[color:var(--p-accent)]/28 focus-within:border-[color:var(--p-accent)] focus-within:ring-2 focus-within:ring-flamingo-500/12 disabled:cursor-not-allowed disabled:bg-[var(--p-surface-sunken)] disabled:opacity-70",
  trigger: "flex min-w-0 w-full flex-1 items-center gap-2 py-2 pe-9 text-sm font-medium leading-5 text-[var(--p-text)]",
  value: "min-w-0 flex-1 truncate pe-1 text-[var(--p-text)]",
  placeholder: "min-w-0 flex-1 truncate pe-1 text-sm text-[var(--p-text-muted)]",
  trailingIcon: "pointer-events-none absolute end-4 top-1/2 ml-0 shrink-0 -translate-y-1/2 text-[var(--p-text-muted)]",
  leadingIcon: "shrink-0 text-[var(--p-text-muted)]",
  content: "z-[100000] overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-lg backdrop-blur-xl",
  viewport: "max-h-72 overflow-y-auto p-1",
  item: "text-[var(--p-text)] data-highlighted:not-data-disabled:before:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]",
  itemLabel: "truncate",
  itemDescription: "text-[0.8125rem] leading-5 text-[var(--p-text-muted)]",
  empty: "px-3 py-2 text-sm text-[var(--p-text-muted)]"
};
({
  ...dashboardSelectUi
});
const dashboardMutedPanelClass = "softui-segment rounded-md";

export { nativeInputErrorClass as a, formHelperClass as b, formErrorClass as c, dashboardSelectUi as d, dashboardFormFieldUi as e, formLabelClass as f, dashboardInputUi as g, dashboardMutedPanelClass as h, nativeTextareaClass as i, nativeInputBaseClass as n };
//# sourceMappingURL=formUi-DTjrawz_.mjs.map
