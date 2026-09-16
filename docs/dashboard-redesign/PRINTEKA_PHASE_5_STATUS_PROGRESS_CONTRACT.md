# Printy Phase 5 Status, Progress, and Next Action Contract

Date: 2026-07-29

Phase status: `COMPLETED`

Scope: frontend status semantics only. No backend state machines, serializers, pricing/payment rules, auth, permissions, database fields, or migrations were changed.

## Canonical Workflow States

Every visible workflow status should project into one of six user-facing states:

| State | Meaning |
| -- | -- |
| `completed` | Finished or no longer requiring action. |
| `current` | Work is actively in progress. |
| `next` | Ready for the next action. |
| `waiting` | Waiting on a person, role, callback, proof, or payment. |
| `blocked` | Cannot move forward until a specific issue is resolved. |
| `cancelled` | Workflow stopped or declined. |

The shared mapping lives in `app/constants/design.ts`:

- `printyWorkflowState()`
- `printyWorkflowSemantic()`
- `printyTimelineSemantic()`

## Responsibility Labels

Workflow semantics include responsibility:

- `client`
- `manager`
- `production`
- `admin`
- `printy`
- `system`
- `none`

The semantic object includes:

- `state`
- `label`
- `badgeVariant`
- `toneClass`
- `dotClass`
- `circleClass`
- `labelClass`
- `responsibility`
- `responsibilityLabel`
- `nextAction`

This gives every status enough meaning to avoid color-only communication.

## Component Contract

### `StatusBadge`

`StatusBadge` still accepts existing props:

- `status`
- `value`
- `domain`
- `label`
- `variant`
- `size`
- `dot`

New semantic props:

- `showResponsibility`
- `workflowState`
- `responsibility`
- `nextAction`

The badge exposes `data-workflow-state` for testing and future visual checks. When `showResponsibility` is true, it adds screen-reader responsibility and next-action text.

### `DashboardTimeline`

`DashboardTimeline` still accepts existing class-driven timeline items for compatibility.

Timeline items may now include:

- `status`
- `state`
- `responsibility`
- `nextAction`

The component maps items through `printyTimelineSemantic()` and renders:

- completed/current/waiting/blocked/cancelled visual states
- responsibility labels
- screen-reader next-action text
- list/listitem roles

### `WorkflowNextAction`

`WorkflowNextAction` is the reusable next-action panel for future role pages. It combines:

- semantic state projection
- responsibility label
- next-action text
- `StatusBadge`
- optional action slot

## Backend Projection Decision

No backend projection is required for Phase 5.

Frontend mapping can safely handle the initial shared status language using existing status strings and domain context. A backend projection should be added later only if a role page proves it needs responsibility/deadline data that cannot be inferred safely from existing payloads.

## Tests

Phase 5 adds semantic coverage in:

- `tests/components/workflowSemantics.test.ts`

Covered behavior:

- payment, urgency, quote, and production statuses map to stable workflow states
- responsibility and next-action text are produced
- timeline overrides preserve semantic output
- dashboard status components consume the shared semantic layer

## Deferred

- Broad page-by-page replacement of local status labels/classes.
- Backend status projection endpoint or serializer fields.
- Full browser screenshot pass for every role status surface.
- Phase 6 collection drawer migration.

## Phase 5 Stop Point

Stop after this semantic contract and shared component implementation. Do not begin Phase 6 until explicitly requested.
