# Printy: Terms, Privacy and Help (v2.0, hardened)

> **Internal source. Not for publishing as-is.** Everything between ⟦ ⟧ is an open decision or a fact only the owner can supply. Part A (decisions) and Part E (claims register) are internal and must NOT appear on a live page. Parts B, C and D are the source for `/terms`, `/privacy` and `/help`.
> v2 applies the audit in `results.txt`: contradicted and unsupported promises are removed or weakened to what the code actually does. `law.txt` wins wherever it differs from v1. This is still not a substitute for review by a Kenyan advocate.

---

# PART A: Internal. Decisions and legal items needed before launch

**A1. What v2 changed after the code audit**
1. Removed the 10%-of-total lateness hold and the "released on resolution" promise. The code only records a 10% penalty against a rush premium and does not touch payouts automatically (`printy_api/jobs/timing_services.py:303-358`). Live Help now says lateness is recorded and reviewed.
2. Removed the 72-hour deemed-delivery-confirmation promise. No timer exists. Payout release is manual after ready/completed (`printy_api/jobs/payout_services.py:18,173-184`).
3. Removed "ready-by is binding after payment". `law.txt:107-116` says ready-by is always an estimate and becomes the due date at acceptance.
4. Removed "escrow until delivery is confirmed" as an absolute rule. Funds are held, but release is allowed after the job is ready or completed and payment is confirmed.
5. Removed "OTP then M-Pesa" as a universal sequence. OTP is used on the signed-out client link; signed-in payments go straight to the M-Pesa prompt.
6. Removed the Frankfurt/DigitalOcean hosting claim. No region evidence exists in either repository.
7. Removed "admin access is logged" and "backups". Neither is implemented.
8. Removed "KRA PIN", "ID documents" and stored "M-Pesa verification details" from live copy. No such fields exist.
9. Removed "full refund before production" and "managers are pending/verified/rejected". Refunds are manual; verification is a single manual boolean.
10. Kept the fair-price cap, role masking, public tracker allowlist, first-touch origin rule, manager-side fee waiver, price lock at acceptance and manual payout release, all of which the code proves.

**A2. Items that need a Kenyan advocate (do not skip)**
- **Holding customer money in escrow.** Holding funds for third parties can attract payment-services regulation (Central Bank of Kenya, National Payment System Act) unless done through a licensed partner or a properly structured trust/escrow account. Get advice on how funds are actually held before launch, then fix Terms §5.3 to describe the real structure.
- **ODPC registration.** Printy should register as a data controller/processor with the Office of the Data Protection Commissioner, name a contact (or DPO), and keep a Data Protection Impact Assessment on file. Fill ⟦ODPC registration no.⟧ once done.
- Liability cap, governing law and dispute wording (Terms §15, §19).
- Retention periods for tax and accounting records (Privacy §7).
- Cross-border transfer basis for hosting outside Kenya (Privacy §6).

**A3. Product decisions this copy assumes (confirm or change)**

| # | Decision | Draft assumes |
|---|---|---|
| 1 | Legal entity name, reg. number, address | ⟦…⟧ |
| 2 | Support email / phone / WhatsApp | ⟦support@printy.ke⟧ ⟦privacy@printy.ke⟧ |
| 3 | Quote validity period | ⟦7 days⟧ (code default: 48 hours) |
| 4 | Buyer must report a problem within | ⟦48 hours of delivery⟧ |
| 5 | Delivery deemed confirmed if buyer is silent for | ⟦72 hours⟧ (NOT implemented; do not adopt without a backend timer) |
| 6 | Refund before production starts | ⟦full refund⟧ (manual review today) |
| 7 | Refund after production starts | Case by case via dispute; no refund for artwork errors or change of mind |
| 8 | Lateness penalty | ⟦10% of the late party's total held until resolved⟧ (NOT implemented; only a rush-premium penalty event exists) |
| 9 | Lateness caused by the buyer (late approval, slow reply) | Moves the ready-by date; not counted against manager or printer |
| 10 | Who delivers | ⟦printer/manager/courier; define⟧ |
| 11 | Proofs offered before print? | ⟦yes/no⟧ |
| 12 | Anti-circumvention (no taking Printy-sourced jobs off-platform) | Included; manager-added clients exempt per existing rule |
| 13 | Verification documents collected from managers/printers | ⟦business name, KRA PIN, M-Pesa details, ID document?⟧ (no such fields found in code) |
| 14 | Analytics/cookies tool | ⟦none / name it⟧ |
| 15 | Retention periods | ⟦placeholder values⟧, no retention job exists |
| 16 | Hosting region | ⟦confirm; no region found in code⟧ |
| 17 | Platform Admin access to personal data | Role-limited; ⟦logging is a backend follow-up⟧ |
| 18 | ODPC registration / DPO | ⟦number / name⟧ |
| 19 | Tax, VAT and eTIMS | ⟦each party handles its own; Printy does not issue VAT invoices⟧ |
| 20 | Liability cap / dispute forum | ⟦advocate to confirm⟧ |

---

# PART B: TERMS OF SERVICE (page copy)

**Printy Terms of Service**
Version 2.0 · Effective ⟦date⟧ · Last updated 12 November 2026

## In plain words
- Printy connects you with **verified print managers** who run your job, and **print shops** that produce it.
- Your payment is **held by Printy** and released only after the job is ready or completed and your payment is confirmed, or after a review.
- The **price is fixed when you accept a quote**. A ready-by time becomes the job due date, but it stays an **estimate, not a guarantee**.
- Every stage is **timed and tracked**. Lateness is recorded and can affect how a payout is reviewed.

These plain-words boxes are a summary to help you. The numbered terms below are what apply.

## 1. Who we are and what Printy is
1.1 Printy ("Printy", "we", "us") is operated by ⟦legal entity name⟧, ⟦registration number⟧, ⟦registered address⟧, Kenya, and runs the marketplace at printy.ke.
1.2 Printy is a **managed print marketplace** with three kinds of users: **Buyers** (people and businesses who need printing), **Print Managers** (who quote, manage and deliver your job), and **Printers** (the print shops that produce it).
1.3 Printy is not a printer. The **Print Manager serving your job is your supplier** and is responsible to you for the job being delivered as quoted. Printy provides the platform, verification, custody of payment, tracking and dispute process around that job.
1.4 A **job** is the work created when you accept a quote. It carries the accepted price and due date and moves through the stages shown in tracking.
1.5 By creating an account, requesting a quote, paying, or using a tracking link, you agree to these Terms and our Privacy Notice.

## 2. Accounts, roles and verification
2.1 You must be 18 or older, or a business with legal capacity to contract, and give accurate information. Keep your login and one-time codes (OTP) private. You are responsible for activity on your account.
2.2 Each account has one role: Buyer, Print Manager or Printer. Each role has its own **desk**. Manager and Printer accounts are for providing services and cannot be used to request quotes as a Buyer.
2.3 Print Managers and Printers are **manually verified** by Printy before they can appear to Buyers or receive jobs. Verification can include email and phone checks, the details and profile photo you provide, and manual review. Printy may approve, suspend or re-verify an account at any time.
2.4 A Printer confirms its rate card, standard turnaround and finishing options before the shop is treated as ready for matching.

## 3. Estimates and quotes
3.1 Prices you see before you sign up or before a quote is sent are **estimates** calculated by our server from current shop rate cards and manager pricing. They are not offers.
3.2 A quote becomes an offer only when a Print Manager **sends** it to you. The quote states when it expires.
3.3 A manager may change a quote before you accept it, for example after reviewing your artwork or specification. If they do, you will see a **price updated** (or date updated) state and must review and acknowledge the new figures before payment can start. You will never be asked to pay an outdated price.
3.4 Speed options (Standard, Faster, Fastest) and "Ready by" times shown before acceptance are **estimates, not guarantees**. Faster and Fastest carry a configured surcharge, and a tier may be switched off by the shop. A ready-by time becomes the job **due date** when you accept the quote, but it remains an estimate. It feeds the stage timing and lateness rules, not a guarantee of delivery at that minute.

## 4. Artwork
4.1 Payment opens only after your artwork is uploaded, unless the Print Manager has marked that they already hold your artwork. On the upload path, the artwork is satisfied by the upload. On the manager-holds path, the **manager** must accept the artwork; a printer's confirmation is not required before you pay.
4.2 A printer must acknowledge that it holds the artwork on the manager-holds path before production can start. You are responsible for your artwork: spelling, content, resolution, colours and fit for purpose. We print what is supplied. Colours can vary between screens, shops and stocks. ⟦If proofs are offered, describe them here.⟧
4.3 You confirm you own or are licensed to use everything you upload and that it is lawful. You grant Printy, your manager and the producing shop a limited licence to use it only to produce and deliver your job.
4.4 We may refuse or cancel jobs containing unlawful, infringing or prohibited content (section 12).

## 5. Payment, price lock and custody
5.1 Payment opens only on a **sent** quote and after the artwork step. You pay through **M-Pesa**. Where you pay through a client link, you may first verify your phone with a **one-time code**. When you pay while signed in, the M-Pesa prompt is sent directly. All prices are in Kenya shillings (KES).
5.2 **Price lock.** The price is fixed when you accept the quote and the accepted snapshot is frozen. Neither the manager nor the shop can raise the price afterwards. If you want to change the job after accepting, it needs a new quote or an agreed change that all parties accept. The ready-by time becomes the job due date at acceptance, but it remains an estimate.
5.3 **Custody.** Your payment is held by Printy ⟦describe the actual holding arrangement once confirmed by an advocate⟧. It is not released to the manager or printer automatically.
5.4 **Release.** Printy releases payouts **manually** after the job is ready or completed and your payment is confirmed, or after a dispute review under section 8. Payouts are made to the manager and printer payout records Printy holds. A payout can be placed on hold while a problem is reviewed.
5.5 **Fair-price cap.** Printy limits what a manager can add on top of the production cost. The cap scales with job size (3.0x production cost at the smallest tier, 2.5x in the middle tier and 2.0x at the largest). The total shown for a quote will not exceed that cap.
5.6 **Fees.** Printy's manager-side fee is built into the price you see. There are no hidden charges at checkout. You see your total and per-piece price. You do not see a shop's costs or a manager's margin (see our Privacy Notice). The printer-side fee is separate and is not waived by the manager-side rule.
5.7 **Tax.** Each party handles its own tax according to its own registration. The Print Manager is your supplier and is responsible for any invoice or receipt owed to you. ⟦Add how Printy documents its own fee, VAT and eTIMS treatment.⟧
5.8 **Payment problems.** If M-Pesa shows you paid but your job does not update, do not pay again. Contact support with your M-Pesa confirmation code and job code and we will reconcile it.
5.9 **Refunds.** Contact support before production starts if you want to cancel. Production starts when the job is marked as started in production, which is recorded with a timestamp. Printy reviews the job record and, where the payment can be reversed, records a refund to the original payer. After production starts, refunds are decided through the dispute process (section 8). Errors in artwork you supplied, and change of mind after production begins, are not grounds for a refund.

## 6. Deadlines, lateness and tracking
6.1 A **due date** is set when your quote is accepted. Each stage (quote acceptance, artwork approval, production, quality check, delivery) has its own time allowance and a visible owner. We record actual timestamps from day one.
6.2 The tracker shows whether a job is **on track**, **late** or has an **overdue** stage. Each stage shows who has the next action.
6.3 **Consequence of lateness.** If a manager or printer is late, Printy records the delay, the stage and who caused it. That record is available when a payout is reviewed and can affect whether funds are held, released or adjusted. Where a rush premium was paid, a 10% penalty is calculated on that premium and recorded as a separate line; the printer payout is not touched automatically. Delays caused by the Buyer, such as late approvals or replies, move the due date and are not counted against the manager or printer.
6.4 Printy may publish a manager's on-time percentage only once they have enough completed jobs for it to be meaningful.
6.5 **Tracking.** You can track a job with its job code. Signed in, you see your job directly. Signed out, you enter your job code and the phone number on the job. Buyers who have paid can follow stages and times without signing in. Public tracking shows stages, timestamps and who has the next action only, never amounts, shop identity or a manager's margin.

## 7. Delivery and confirmation
7.1 ⟦Describe delivery or collection: who delivers, when the clock stops, and what proof is recorded.⟧
7.2 Check your order promptly. Confirm delivery in Printy, or report a problem from the job.
7.3 If you do not confirm delivery, Printy does not treat the job as confirmed by a timer. Printy can review the job record and release funds once the job is ready or completed and payment is confirmed, unless a payout is on hold.

## 8. Problems and disputes
8.1 Raise a problem from your job, quickly, with photos where relevant. Your manager is your first contact.
8.2 If it is not resolved, Printy's admin team will review the job timeline, timestamps, artwork, messages and delivery record, and may hold or release payouts, or record a refund. Fault is decided on the records: a print that does not match supplied artwork is the printer's responsibility; a print that matches flawed artwork is the Buyer's.
8.3 Printy's decision on funds is final within the platform, and does not take away any rights you have under Kenyan law.

## 9. Clients added by managers
9.1 Managers may add their own clients, including clients who use only phone or WhatsApp and have no email. The manager supplies the client's name and phone; email is optional.
9.2 Printy charges **no manager-side platform fee** when the job's manager is the client's originating manager. If that client later engages a different manager through Printy, Printy's normal fee applies to those jobs. Printy can identify manager-added clients. The printer-side fee is unchanged.
9.3 A client whose phone number already exists in Printy is reused and is not re-originated by a later manager. The existing record keeps its origin.
9.4 A manager who adds a client confirms they have that person's permission to share their details with Printy for the purpose of the job.

## 10. Duties of Print Managers and Printers
10.1 Managers must quote accurately, stay within the fair-price cap, honour quoted dates, and communicate honestly with Buyers.
10.2 Printers must keep rate cards accurate, set a standard turnaround, honour quoted ready-by dates, and only start production when artwork is available or the manager has confirmed they hold it and the printer has acknowledged it.
10.3 **Confidentiality.** Printers must not try to identify, contact or solicit Buyers outside Printy. Managers must not try to identify shops' costs beyond what Printy shows them. Both must keep job information confidential.
10.4 **No circumvention.** Do not use Printy to find a job and then take that job's payment or fulfilment off the platform to avoid custody or fees. This does not apply to clients a manager added directly (section 9).
10.5 Managers and printers are independent businesses, not Printy's employees or agents.

## 11. Honest use of timing and prices
Do not manipulate timestamps, statuses or on-time figures, and do not use fake jobs or accounts. Evidence of this may result in suspension and a payout hold pending review.

## 12. Acceptable use
You must not use Printy to print or request anything unlawful or infringing, including counterfeit money, forged identity or official documents, others' trademarks without permission, or hateful, abusive or sexually exploitative content. You must not scrape, probe, overload or reverse-engineer the platform, our calculators or imposition engine.

## 13. Intellectual property
Printy owns the platform, brand, calculators, pricing and imposition tools. You keep ownership of your content and artwork. You may not copy or resell our tools or data.

## 14. Availability and third parties
We work to keep Printy available but cannot promise uninterrupted service. Payments run through M-Pesa (Safaricom). We are not responsible for outages or delays outside our control, including mobile network, M-Pesa or power failures.

## 15. Liability
15.1 Printy is a platform. To the extent Kenyan law allows, we are not liable for indirect or consequential losses, and our total liability to you for a job is limited to the amount you paid for that job. ⟦advocate to review⟧
15.2 Nothing here limits liability that cannot be limited under Kenyan law, including for fraud or for death or personal injury caused by negligence, or any consumer rights you have by law.

## 16. Suspension and ending
We may suspend or close an account, and place related payouts on hold pending review, for breach of these Terms, fraud, repeated lateness, failed verification, or legal reasons. You can close your account any time; paid jobs in progress will be completed or resolved first.

## 17. Changes to these Terms
We version these Terms and show the version and last-updated date on this page. We will give ⟦14 days⟧ notice of material changes. We will not apply a material change retrospectively to a job you have already paid for.

## 18. Contact and notices
Support: ⟦support@printy.ke⟧ · ⟦phone/WhatsApp⟧. Notices to you go to the email or phone on your account.

## 19. Governing law
These Terms are governed by the laws of Kenya. Try to resolve any dispute with us first through support. Unresolved disputes go to ⟦mediation/courts of Kenya, Nairobi; advocate to confirm⟧.

## 20. General
If any part is unenforceable, the rest still applies. These Terms and the Privacy Notice are our whole agreement with you. ⟦Entity⟧ may transfer these Terms in a business transfer; you may not without our consent.

---

# PART C: PRIVACY NOTICE (page copy)

**Printy Privacy Notice**
Version 2.0 · Effective ⟦date⟧ · Last updated 12 November 2026

## In plain words
- We collect only what we need to run your job, take payment, verify managers and keep the platform safe.
- **Money and identity are masked by role.** Buyers never see a shop's costs. Shops never see who you are or what you paid. Our server applies this masking before anything reaches a screen.
- We do not sell your personal data.
- You have rights over your data under Kenya's Data Protection Act, and you can use them any time through support.

## 1. Who is responsible for your data
⟦Legal entity⟧ ("Printy") decides why and how your personal data is processed and is the **data controller**. ODPC registration: ⟦number⟧. Contact for privacy: ⟦privacy@printy.ke⟧ ⟦Data Protection contact/DPO name⟧.

## 2. What we collect
- **Account data:** name, email, phone number, role, preferred language, and password (stored as a hash, never in plain text).
- **Profile data:** the bio, photo, address, city, state, postal code and country you choose to add. Managers may add a profile photo.
- **Verification data (managers and printers):** the business and profile details you provide and the manual verification record. We do not currently collect a KRA PIN, ID document or stored M-Pesa credential in these profiles. ⟦Confirm whether any of these should be collected and add the fields before claiming them.⟧
- **Job data:** specifications, artwork files, delivery details, job notes and production instructions, messages, job code, stage timestamps and times taken.
- **Payment data:** M-Pesa phone number, transaction reference, amount, status, result codes and the callback data we receive, and the consent record for saving a payment phone. We never see your M-Pesa PIN.
- **Saved choices:** your calculator specification, guest session, pending draft, pending manager, printer queue and "verified managers" choice are saved in your browser.
- **Details added by managers:** name and phone (and email, if any) of clients a manager adds on their behalf.
- **Technical data:** IP address, browser user-agent, request logs, and the cookies and local storage in section 10. At the date of this Notice, we do not run a third-party analytics script.
- **Communications:** OTP messages, job updates and support conversations.

## 3. Why we use it
| Purpose | Basis |
|---|---|
| Create and secure your account; run quotes, jobs, tracking | Performing our contract with you |
| Take payment, hold funds in custody, release payouts | Performing our contract; legal obligations |
| Verify managers and printers | Legitimate interest in a trusted marketplace; legal obligations |
| Measure timeliness and record deadlines | Contract; legitimate interest |
| Prevent fraud, abuse and security incidents | Legitimate interest |
| Resolve disputes | Contract; legitimate interest |
| Tax, accounting and legal compliance | Legal obligation |
| Service messages (OTP, quotes, job updates) | Contract |
| Marketing messages | **Your consent only**, withdraw any time |

## 4. Who can see what
For managed jobs, our server masks fields by role before they reach a screen. Summary:

| | Buyer | Print Manager | Printer (shop) | Public tracker |
|---|---|---|---|---|
| Buyer name and phone | Own | Yes, for their jobs | **No** | **No** |
| Total paid and per-piece price | Yes | Yes | **No** | **No** |
| Shop identity and production costs (managed jobs) | **No** | Yes | Own | **No** |
| Manager margin and fees | **No** | Own | **No** | **No** |
| Job specs and artwork | Own | Yes | Yes, to produce | **No** |
| Stages and times | Yes | Yes | Yes | Yes |

Artwork files can contain personal details you put in them; please be mindful of this. Authorised Printy admin staff can access data when needed for support, payouts, security and disputes, limited by role. ⟦confirm; admin access logging is not implemented yet⟧

## 5. Who we share data with
- **Service providers** acting for us: infrastructure that hosts the service, M-Pesa (Safaricom Daraja) for payments, and ⟦email provider⟧. ⟦SMS/WhatsApp provider⟧ ⟦analytics, if any⟧.
- **Authorities and professional advisers** where the law requires or to protect rights.
- **A buyer of the business** if Printy is sold, under the same protections.
We do not sell personal data.

## 6. Transfers outside Kenya
Our service providers may process data outside Kenya. When data leaves Kenya we rely on the safeguards the Data Protection Act requires (such as adequate protection, contractual safeguards or your consent where needed). ⟦Hosting region unverified; advocate to confirm the transfer basis.⟧

## 7. How long we keep data
| Data | Kept for |
|---|---|
| Job, payment and payout records | ⟦at least 5 years, for tax and audit⟧ |
| Account data | While your account is active, then ⟦24 months⟧ |
| Verification records | ⟦duration of relationship + 5 years⟧ |
| OTP codes | Minutes |
| Server and security logs | ⟦90 days⟧ |
| Marketing consent records | Until withdrawn, then proof of withdrawal ⟦12 months⟧ |

We keep personal data only for as long as we need it for the purposes above, then delete or anonymise it unless the law requires us to keep it. We do not currently run an automated retention or deletion job; deletion is handled by authorised staff on request. ⟦Owner to confirm retention periods.⟧

## 8. Security and breaches
We use encryption in transit, role-based access, server-side masking of money and identity fields, and OTP verification where a client link is used. We do not currently claim access logging or backups. No system is perfectly secure. If a breach is likely to harm you, we will notify the Data Commissioner within 72 hours of becoming aware, and tell affected people without undue delay. ⟦Breach process to be documented.⟧

## 9. Your rights
Under the Data Protection Act, 2019 you may: be informed how your data is used; **access** it; **correct** it; **delete** it; **object** to processing or to direct marketing; **withdraw consent**; ask for a portable copy; and not be subject to a decision based solely on automated processing that significantly affects you. Our price estimates and recommended-manager suggestions are generated automatically, but a person (your manager) finalises your quote, and you choose whether to accept it.
To use a right, email ⟦privacy@printy.ke⟧ or contact support. We may need to verify your identity, and we respond within the time set by the Data Protection (General) Regulations, 2021. Some records (such as tax and payment records) must be kept by law. If you are unhappy, you can complain to the **Office of the Data Protection Commissioner** (odpc.go.ke).

## 10. Cookies and local storage
We use **essential** storage for sign-in, your active role, your language, and your saved manager choices. The sign-in cookies are `printy_access_token`, `printy_refresh_token`, `printy_remember_me` and `printy_active_role`; the language cookie is `printy-language`. The browser storage keys are `printy_calculator`, `printy_guest_session`, `printy_pending_draft`, `printy_pending_manager`, `printy.printer.queue.v1` and `printy:verified-managers-choice`. ⟦If you use analytics, list it here and give a consent choice.⟧ You can clear browser storage at any time, but parts of Printy may stop working.

## 11. Messages
We send service messages (OTP, quotes, status, "price updated") by email. We may also contact you by phone about a job. We send marketing only if you opt in, and every marketing message has an easy opt-out. ⟦SMS/WhatsApp provider to confirm if those channels are added.⟧

## 12. Clients added by managers
When a manager adds you as a client, Printy holds your details to run your job and may message you about it. The manager is responsible for having your permission to share them. You can use your rights above with Printy or the manager.

## 13. Children
Printy is for people 18 and over. We do not knowingly collect data from children. If you believe we have, contact us and we will delete it.

## 14. Changes
We version this Notice and will tell you of material changes. Contact: ⟦privacy@printy.ke⟧ · ⟦address⟧.

---

# PART D: HELP (page copy)

**Printy Help**

## Getting started
**What is Printy?** A marketplace where verified print managers run your job and print shops produce it, with your payment held by Printy until the job is ready or completed and payment is confirmed.
**Why is the price an estimate?** Before a manager sends a quote, prices are calculated by our server from current shop rates. The sent quote is the real offer.
**What are Standard, Faster and Fastest?** Speed options with a "Ready by" time. They are estimates, not guarantees. A ready-by time becomes the job due date when you accept, but it can still move if you cause a delay.

## Quotes
**What does "price updated" mean?** Your manager changed something (for example after checking artwork). Review and acknowledge the new price or date before you can pay.
**Can I choose my manager?** Yes. Pick a recommended manager for your job. Sign in to save them as one of **Your managers**.
**I have no email.** Your manager can add you with your phone number or WhatsApp. You can track and follow your job without signing in.

## Artwork
**Why can't I pay?** The pay button opens when (1) your manager has sent the quote and (2) your artwork is uploaded, or the manager has accepted that they already hold it. On the manager-holds path, the printer must acknowledge the artwork before production.
**What file should I upload?** Print-ready files. We print what you send. Check spelling and colours first.

## Paying
**How does payment work?** You pay through M-Pesa. On a client link you may verify your phone with a one-time code first; signed in, the M-Pesa prompt is sent directly. Printy only treats a payment as confirmed when the M-Pesa confirmation arrives.
**I paid but nothing changed.** Do not pay again. Wait a few minutes, then contact support with your M-Pesa code and job code.
**Is my price safe after I pay?** Yes. The accepted quote's price snapshot is frozen. Your ready-by time becomes the due date, but it remains an estimate.
**Do I get a receipt or VAT invoice?** Your manager is your supplier and provides any invoice or receipt owed to you. ⟦add receipt info from Printy⟧

## Tracking
**How do I track a job?** Use your job code. Signed out, you also enter the phone number on the job. You will see stages, timestamps and who has the next action, never prices, shop identity or manager margin.

## Late jobs
**What does late mean?** The job is past a stage deadline or the overall due date. The tracker shows on track, late or an overdue stage. You and your manager see it on your desk. Message your manager from there.
**What happens when someone is late?** Printy records the delay, the stage and who caused it. That record is reviewed when a payout is decided. If you caused the delay (for example late approval), the due date moves instead. Where a rush premium was paid, its status is recorded as refunded, held for review or unchanged, and a separate 10% penalty line is recorded.

## Delivery, problems and refunds
**What do I do when it arrives?** Check it and confirm delivery in Printy, or report a problem from the job.
**Something is wrong.** Raise it on the job. Your manager responds first. If it is not resolved, our admin team reviews the records and decides what happens to the funds held by Printy.
**Can I cancel?** Contact support before production starts. Printy reviews the job and, where the payment can be reversed, records a refund to the original payer. After production starts, it goes through a dispute review.

## For managers
**How do I get verified?** Complete your profile; we review it manually, including your business details and profile photo. You appear to buyers once verified.
**Can I bring my own clients?** Yes. No manager-side Printy fee on clients you add directly. If they later use a different manager, the normal fee applies. The printer-side fee is unchanged.
**What do I see on a quote?** Your total, your margin and Printy's fee. Quotes are capped by the fair-price cap.
**Taxes and invoices?** Each party handles its own tax and invoicing. Ask us if you are unsure. ⟦Confirm VAT/eTIMS position.⟧

## For printers
**How do I add prices?** Enter your printing price and the rate card calculates the rest; adjust any column. Confirm your rate card and turnaround to be treated as ready.
**What must I set?** At least a standard turnaround time.
**What can I see?** Specs, artwork and job code. Not buyer identity, totals or manager margin.

## Your data
**What do you collect and who sees it?** See the Privacy Notice. Short version: shops never see who you are, buyers never see shop costs, and the public tracker shows only stages and times.
**How do I ask for my data to be corrected or deleted?** Email ⟦privacy@printy.ke⟧ or contact support.

## Contact
⟦support@printy.ke⟧ · ⟦phone/WhatsApp⟧ · ⟦hours⟧. Please include your job code.

---

# PART E: Internal claims register (v2 status)

| Claim | Verdict | Where proved |
|---|---|---|
| Estimates are server-produced | SUPPORTED BY CODE | `client_calculator/views.py:128`; `printy_ui/app/shared/calculator-spec.ts:176-193` |
| Price change shows "price updated"; buyer cannot pay old price | SUPPORTED BY CODE | `quotes/acceptance.py:60-64`; `quotes/models.py:174` |
| Price locked; ready-by becomes due date (estimate) | SUPPORTED BY LAW.TXT + CODE | `law.txt:107-116`; `quotes/acceptance.py:120-125`; `platform_fee_policy.py:407-438` |
| Payment held; payouts released manually after ready/completed + confirmed payment | SUPPORTED BY CODE | `jobs/payout_services.py:18,173-184`; `jobs/admin.py:40-43` |
| Payment needs sent quote + artwork; manager acceptance gates it | SUPPORTED BY CODE | `jobs/artwork_workflow.py:111-143`; `api/payment_views.py:566-570` |
| OTP is used on client links, not every signed-in payment | SUPPORTED BY CODE | `clients/views.py:331,377`; `api/payment_views.py:338,430` |
| Shops never see buyer identity/totals; buyers never see shop identity/costs/margin | SUPPORTED BY CODE | `api/visibility.py:38-127`; `jobs/managed_job_actor_serializers.py:18-30` |
| Public tracker shows stages/times only | SUPPORTED BY CODE | `jobs/serializers.py:166-193,232-237` |
| Signed-out tracking = code + phone, rate-limited | SUPPORTED BY CODE | `jobs/views.py:268-275,326-344,394`; `config/settings.py:168-169` |
| On-time % only above threshold | SUPPORTED BY CODE | `jobs/timing.py:359-374`; `jobs/timing_config.py:136` |
| Manager-added clients: no manager-side fee; normal fee on switch; first touch wins | SUPPORTED BY LAW.TXT | `law.txt:22-25,42-50`; `quotes/partner_services.py:338-351` |
| Managers manually verified (one boolean, no pending/rejected states) | SUPPORTED BY CODE | `accounts/models.py:194-237`; `api/manager_views.py:61` |
| Shop setup confirmation | SUPPORTED BY CODE (with legacy caveat) | `setup/services.py:363`; `tests/test_law_9_rate_card.py:432-436` |
| Fair-price cap | SUPPORTED BY CODE | `pricing/services/platform_fee_policy.py:179-203`; `quotes/models.py:640-663` |
| At risk / Late for managed jobs | CONTRADICTED ("At risk") | `jobs/timing.py:179-202`; `TrackView.vue:361,408` |
| 10% of late party's total held until resolution | CONTRADICTED | `jobs/timing_services.py:303-358` |
| Deemed confirmation after 72 hours | CONTRADICTED (no timer) | `jobs/payout_services.py:18,173-184` |
| Full refund before production | UNSUPPORTED (manual only) | `payments/models.py:8-33`; no refund service |
| VAT/eTIMS handled by each party | OWNER DECISION | no tax/eTIMS code |
| Admin access logged; backups | CONTRADICTED | no audit-log or backup code |
| Terms acceptance with version/timestamp | CONTRADICTED (not captured) | no acceptance field; see BACKEND FOLLOW-UP 1 |
| Hosting in Frankfurt (DigitalOcean FRA1) | UNVERIFIED | no region evidence |
