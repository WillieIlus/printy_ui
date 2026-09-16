# Printy Phase 6 Collection and Preview Contract

Status: COMPLETED
Date: 2026-07-29

## Contract

- Collection row previews use `RoleDashboardFrame` through `v-model:preview-drawer-open` and the `#previewDrawer` slot.
- The preview drawer replaces the context rail while open; collection pages do not show a rail and drawer at the same time.
- Row previews are read-oriented and expose a full-detail link for complex workflow actions.
- Client collection rows preview quotes, jobs, payments, upload targets, and history records before linking to full detail routes.
- Manager quote/job/payment/shop collection rows preview in the shell drawer; the quote-prep flow remains a modal because it owns multi-step draft/edit state.
- Production assignment cards preview in the shell drawer before linking to the assignment workflow.
- The shared drawer behaves as a dialog with Escape close, scroll lock, focus entry, Tab containment, and focus return.

## Deferred

- Browser screenshot pass for every collection page at selected and unselected states.
- Role-specific job prioritization and empty-state context from RR-005 and RR-006 remain in phases 7 through 9.
- Quote-prep migration remains deferred to complex workflow phases.