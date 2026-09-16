# Printy Phase 4 Component Contract

Date: 2026-07-29

Phase status: `COMPLETED`

Scope: canonical shared primitives and compatibility wrappers. No backend, database, migration, pricing, payment, quote-prep, production workflow, auth, or permission logic was changed.

## Canonical Primitives

The canonical dashboard primitives are:

- `BaseButton`
- `BaseInput`
- `BaseCard`
- `BaseBadge`
- `BaseAlert`
- `BaseTable`
- `BaseModal`

`UiButton` and `UiCard` are compatibility wrappers. They should pass through to the matching `Base*` primitive and should not define a separate visual language.

## Button Contract

`BaseButton` keeps the existing variant API, including legacy role variants:

- `primary`
- `client`
- `partner`
- `shop`
- `secondary`
- `dark`
- `light`
- `ghost`
- `outline`
- `danger`
- `success`

Compatibility decision:

- `client`, `partner`, and `shop` now resolve to the canonical primary action style.
- This preserves existing page code while retiring role-colored action buttons.

Sizing:

- `sm`: minimum 36px high.
- `md`: minimum 40px high.
- `lg` and `xl`: minimum 44px high.

All variants include `focus-visible` ring support.

## Card, Alert, Loading, and Empty-State Contract

Operational dashboard cards now use restrained radius and shadow:

- Default dashboard radius: `rounded-lg`.
- Legacy large radius prop names remain accepted but resolve to `rounded-lg` or `rounded-xl`.
- Dashboard cards use border plus `shadow-sm`; heavy dashboard card shadows are not canonical.
- Alerts and loading skeletons use `rounded-lg`.
- `PRINTY_RADIUS`, `PRINTY_TABLE`, and `PRINTY_EMPTY_STATE` are aligned with this contract.

## Input Contract

`BaseInput` keeps existing props and form behavior, but:

- Removes raw `v-html` icon rendering.
- Uses slot/text icon fallbacks instead.
- Adds `aria-invalid` when an error is present.
- Uses canonical orange focus rings.
- Keeps 40px/44px control height targets.

## Badge Contract

`BaseBadge` keeps existing variant names but uses Phase 2 semantic colors:

- Orange/active: disciplined Printy orange surface and border.
- Success: green.
- Warning: amber.
- Error/rejected: red.
- Info/completed: muted blue.
- Neutral/default/gray: slate.

Dots are decorative and marked `aria-hidden`.

## Table Contract

`BaseTable` keeps existing row action callbacks and slots.

Clickable rows now add:

- `tabindex="0"`
- `role="button"`
- Enter activation.
- Space activation.
- `rowActionAriaLabel` support.
- Canonical brand focus ring.

The action column still uses the same `rowAction` callback and `rowActionLabel`.

## Modal and Drawer Contract

`BaseModal` keeps `placement="center"` and `placement="right"`.

Right drawer widths now follow the Phase 2 shell contract:

- `sm`: 420px.
- `md`: 560px.
- `lg`: 720px.
- `xl`: 720px.
- `full`: viewport minus 2rem.

Modal accessibility improvements:

- Escape close remains supported.
- Body scroll lock remains supported.
- Focus moves to the modal panel on open.
- Focus returns to the previously active element on close.

Full focus trap remains deferred to Phase 12 unless a workflow needs it earlier.

## Icon Contract

No new icon dependency was added in Phase 4.

The current contract is:

- Keep `DashboardIcon` as the dependency-free registry for now.
- Avoid raw `v-html` for new component icon props.
- Existing registry `v-html` remains a known Phase 4/12 debt until an approved icon package or typed SVG component registry replaces it.

## Tests

Phase 4 adds component contract coverage in:

- `tests/components/baseComponentContracts.test.ts`

The tests enforce:

- Role button variants are compatibility aliases.
- Card radius/shadow contract.
- Keyboard-operable table row actions.
- Modal drawer widths and focus return.
- Input raw HTML removal.
- Ui wrapper pass-through behavior.

## Deferred

- Broad page-level replacement of local utility classes.
- Migrating existing collection modals into the Phase 3 preview drawer slot.
- Full focus trap and browser keyboard pass.
- Installing or migrating to lucide.
- Status/progress semantic redesign, which belongs to Phase 5.

## Phase 4 Stop Point

Stop after this component contract and primitive implementation. Do not begin Phase 5 until explicitly requested.
