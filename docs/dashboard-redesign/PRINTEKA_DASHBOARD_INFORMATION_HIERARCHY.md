# Printy Dashboard Information Hierarchy

Scope: target information architecture and disclosure rules. This file defines what each role should see, what belongs in the center, rail, drawer, modal, or full page, and what must remain hidden. It does not authorize implementation.

## Document Responsibility

- Authoritative decisions and open questions: `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- Current-state audit and rationale: `PRINTY_DASHBOARD_LEAN_AUDIT.md`
- Master phase plan: `PRINTY_DASHBOARD_CHANGE_PHASES.md`
- Append-only execution history: `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

## Global Mental Model

Every authenticated dashboard uses:

- Left: where am I?
- Center: what am I working on?
- Right: what matters next?

The right rail is contextual and quiet. It must not become a second dashboard.

## Rail, Drawer, Modal, and Page Contract

Overview:

- Show contextual right rail.
- Center is action-first.

Collection with no selected record:

- Show collection table/list in center.
- Show queue totals, filter context, urgent item, or next action in the rail.

Collection with selected record:

- Preview drawer replaces the normal rail.
- Never show both rail and drawer.

Complex workflow:

- Hide persistent rail where it compresses work.
- Use internal sticky action panel only when useful.

Mobile:

- Rail becomes collapsible panel or bottom sheet.
- Preview drawer becomes full-screen drawer or bottom sheet.
- Never force three columns.

## Canonical Navigation Model

Client left navigation:

- Overview
- Quotes
- Jobs
- Payments
- Messages
- Notifications
- Settings

Manager left navigation:

- Overview
- Requests
- Quotes
- Jobs
- Clients
- Payments
- Messages
- Rate Card
- Notifications
- Disputes

Production or print-shop left navigation:

- Overview
- Assignments
- Jobs
- Messages
- Payouts
- Paper Stock
- Pricing
- Finishing
- Setup
- Notifications
- Disputes

Admin left navigation:

- Overview
- Operational Exceptions
- Payments
- Dispatch
- Assignments
- Disputes
- Notifications
- Setup Gaps
- Access Review

Broad admin directories for users, clients, managers, print shops, quotes, jobs, and payments are secondary and should appear only when implemented with permission tests and operational need.

Do not include Track Job as a primary client nav item.

## Collection Rule

Collections are for real objects:

- Quote requests.
- Quotations.
- Jobs.
- Payments.
- Messages.
- Clients.
- Managers.
- Print shops.
- Production assignments.
- Notifications.
- Disputes.

Statuses are filters or tabs inside object collections:

- Needs action.
- Waiting.
- Active.
- Blocked.
- Completed.
- Cancelled.

Do not create routes such as pending jobs, completed jobs, or blocked jobs unless the workflow is materially different.

## Tracking Hierarchy

Authenticated clients:

- Current active job tracking appears in the right rail.
- All jobs appear in `/dashboard/client/jobs`.
- Selecting a job opens preview drawer with summary tracking.
- Complex tracking, artwork, files, payment, messages, and history live in `/dashboard/client/jobs/:id`.
- `/dashboard/track-job` may remain only as utility lookup or compatibility.

Public/shared users:

- Preserve `/track-job/:token` if signed-out/shared tracking is required.
- Show only tracking reference, broad status, current stage, next expected step, estimated completion where available, and safe support route.
- Hide client identity, private contact info, manager notes, print-shop identity, internal pricing, payout details, documents, and private messages.

## Progress Hierarchy

Shared states:

- `completed`: visible but muted.
- `current`: current stage.
- `next`: upcoming stage.
- `waiting`: waiting on named party.
- `blocked`: intervention needed.
- `cancelled`: neutral terminal state.

Every `current`, `waiting`, and `blocked` state shows:

- Responsible party.
- Required action.
- Expected time/deadline where known.
- What happens next.

The next action required from the current user receives the strongest non-error emphasis. Technical backend codes are mapped to user-friendly labels.

## Client Hierarchy

Primary information:

- Needs your action.
- Accepted quote awaiting payment.
- Artwork upload needed.
- Proof approval needed.
- Active job status.
- Manager response pending or available.
- Unread messages.

Primary action:

- Start a quote request when there is no urgent current work.
- Pay accepted quote when payment is pending.
- Upload artwork or approve proof when required.

Secondary information:

- Recent quotes.
- Recent payments.
- Completed jobs.
- Calculator estimate preview.

Contextual information:

- Current job status.
- Next payment/proof/action deadline.
- Latest manager/shop message.
- Expected next step.

Hidden until requested:

- Full quote history.
- Full payment history.
- Documents/files.
- Detailed message history.
- Completed timeline detail.

Right-rail content:

- Most relevant active job.
- Next required action.
- Payment/proof/artwork alert.
- Latest unread message.

Drawer content:

- Quote/job/payment summary.
- Broad status and next step.
- Key dates and amounts visible to the client.
- Link to full details.

Full-page content:

- Job tracking, artwork, files, payment, messages, proof history, reorder.
- Quote acceptance and payment history.

Mobile behavior:

- Left nav collapses.
- Rail becomes current-job panel or bottom sheet.
- Row preview becomes full-screen drawer.

Empty state:

- Clear primary quote-start action and short explanation.

Loading state:

- Skeletons matching list/card shapes; no layout jumps.

Error state:

- Explain what failed and provide retry or safe support path.

## Manager Hierarchy

Primary information:

- New quote requests.
- Quotes requiring preparation.
- Quotes waiting for clients.
- Accepted jobs requiring shop assignment or dispatch.
- Production exceptions.
- Messages requiring response.

Primary action:

- Prepare quote.
- Send quote to client.
- Assign/dispatch paid job.
- Reply to client/shop.

Secondary information:

- Revenue snapshot.
- Client history.
- Payment summaries.
- Rate-card access.

Contextual information:

- Queue totals.
- Selected request/job preview.
- Dispatch readiness.
- Missing artwork or payment blockers.

Hidden until requested:

- Financial split detail.
- Internal pricing audit.
- Full message history.
- Completed quote/job history.

Right-rail content:

- Queue context when no row is selected.
- Payment/revenue summary.
- Current blocker or dispatch warning.

Drawer content:

- Request/job/client preview.
- Safe operational summary.
- Next action link.

Full-page content:

- Quote preparation and financial audit.
- Shop selection, manager markup, send-to-client, offline client/payment handling.
- Dispatch workflow.

Mobile behavior:

- Queue remains primary.
- Drawer becomes full screen or bottom sheet.
- Quote prep uses full page, not cramped modal.

Empty state:

- Explain no current Manager action and show secondary navigation only if useful.

Loading state:

- Preserve queue layout skeletons.

Error state:

- Keep failed action visible with retry and no draft loss.

## Production or Print-Shop Hierarchy

Primary information:

- New assignments.
- Accepted assignments.
- In production.
- Proof required.
- Blocked work.
- Ready for dispatch or collection.

Primary action:

- Accept assignment.
- Update production status.
- Upload proof.
- Mark ready/completed where permitted.

Secondary information:

- Setup readiness.
- Paper stock.
- Pricing.
- Finishing.
- Payout snapshot.

Contextual information:

- Next due assignment.
- Blocking issue.
- Support/message shortcut.
- Setup gap that affects receiving work.

Hidden until requested:

- Completed queue history.
- Detailed payout audit.
- Configuration forms.
- Long file/proof history.

Right-rail content:

- Next due assignment.
- Setup gap.
- Payout snapshot.
- Support shortcut.

Drawer content:

- Assignment/job summary.
- Due date.
- Current status.
- Next action.
- Link to full assignment/job detail.

Full-page content:

- Production assignment workflow.
- Proof upload and review.
- File access.
- Status update history.
- Pricing, paper, finishing, setup.

Mobile behavior:

- Queue cards replace dense tables if needed.
- Action buttons remain reachable.
- Proof/file actions use full-width modal or page.

Empty state:

- Explain when paid assignments will appear and surface setup issues if they block work.

Loading state:

- Queue skeleton grouped by stage.

Error state:

- Explain whether work could not load, action failed, or permissions blocked access.

## Admin Hierarchy

Primary information:

- Failed or stale M-Pesa attempts.
- Paid jobs awaiting dispatch.
- Unassigned work.
- Blocked production assignments.
- Disputes.
- Notification failures.
- Shop setup gaps.
- Permission or access anomalies.

Primary action:

- Open exception.
- Assign/dispatch where authorized.
- Retry/review payment event.
- Resolve dispute or escalate.
- Review notification failure.

Secondary information:

- Broad metrics.
- User, client, manager, print-shop directories.
- Historical reports.

Contextual information:

- System health.
- Recent admin actions.
- Exception severity.
- Affected object and owner role.

Hidden until requested:

- Broad directories.
- Sensitive user/contact data.
- Raw payment provider payloads.
- Internal audit logs.

Right-rail content:

- System health.
- Highest-priority exception.
- Notification/outbox summary.
- Recent admin actions.

Drawer content:

- Exception preview.
- Affected object summary.
- Safe next action.
- Link to full admin detail.

Full-page content:

- Dispute detail.
- Payment/STK failure detail.
- Permission/access review.
- Assignment/job intervention page.

Mobile behavior:

- Exception list first.
- Details open full screen.
- Avoid dense KPI grids.

Empty state:

- Confirm no operational exceptions; do not fill the screen with vanity cards.

Loading state:

- Exception-list skeleton.

Error state:

- Explicitly distinguish data load failure from no exceptions.

## Public Calculator Hierarchy

Primary information:

- Inputs required for a reliable estimate.
- Estimated price range or preview.
- Clear next step to request a quote.

Primary action:

- Calculate or request quote.

Secondary information:

- Explanation of assumptions.
- Optional size/material details.

Hidden until requested:

- Internal pricing formula.
- Manager/shop cost split.

Mobile behavior:

- Inputs grouped compactly; primary action remains visible.

## Public Tracking Hierarchy

Primary information:

- Tracking reference.
- Broad status.
- Current stage.
- Next expected step.
- Estimated completion where available.
- Safe support route.

Prohibited information:

- Client identity.
- Private contact information.
- Manager notes.
- Print-shop identity.
- Internal pricing.
- Payout details.
- Documents.
- Private messages.

Mobile behavior:

- Single column with progress and next step first.

## Authentication, Signup, and Onboarding Hierarchy

Primary information:

- Task-specific form.
- Clear primary action.
- Error or verification status.

Secondary information:

- Help links.
- Terms/privacy links.

Hidden until requested:

- Dashboard content before authentication.
- Role-specific private data before authorization.

Mobile behavior:

- Form fields and actions remain above keyboard where possible.

## Information Required From Visual-Harmony Audit

The hierarchy must be reconciled with final decisions for orange, neutral palette, semantic colors, border system, radius scale, shadow scale, spacing scale, typography scale, button hierarchy, input styling, table density, modal/drawer dimensions, nav states, progress states, responsive behavior, accessibility, interaction states, design tokens, and canonical components.
