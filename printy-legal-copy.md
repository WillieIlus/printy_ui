# Printy: Terms, Privacy and Help (v1.0 draft)

> **Not for publishing as-is.** Everything between ⟦ ⟧ is an open decision or a fact only you can supply. Part A (decisions) and Part E (claims register) are internal and must NOT appear on the live pages. Parts B, C and D are the page copy for `/terms`, `/privacy` and `/help`.
> This is drafted to match the Printy rules as recorded in our project notes and to align with Kenya's Data Protection Act, 2019. It is not a substitute for review by a Kenyan advocate, and a few items in Part A really do need one.

---

# PART A: Internal. Decisions and legal items needed before launch

**A1. Things the old copy got wrong or left out**
1. The old Privacy text said "your name and phone number are shared only with the manager and shop serving your job." Printy law says shops never see client identity and the buyer never relates to the printer directly. This draft says the **manager only** gets your name and phone. Codex must confirm what a shop can actually see in the API (artwork files, delivery details, job notes).
2. Old copy said "dashboard"; the product now calls them **desks**.
3. Old copy had no refund, dispute, delivery-confirmation, lateness-penalty, artwork, VAT, retention, data-rights, cross-border, breach, or children's sections. All added.
4. The old Terms promised "No manager can charge you more than that cap." Keep only if the cap is enforced in code and tested (Codex to verify).

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
| 3 | Quote validity period | ⟦7 days⟧ |
| 4 | Buyer must report a problem within | ⟦48 hours of delivery⟧ |
| 5 | Delivery deemed confirmed if buyer is silent for | ⟦72 hours⟧ (needs your decision; it triggers payout) |
| 6 | Refund before production starts | Full refund |
| 7 | Refund after production starts | Case by case via dispute; no refund for artwork errors or change of mind |
| 8 | Lateness penalty | 10% of the late party's total held until resolved, released on resolution unless Printy decides otherwise after review |
| 9 | Lateness caused by the buyer (late approval, slow reply) | Moves the ready-by date; not counted against manager or printer |
| 10 | Who delivers | ⟦printer/manager/courier; define⟧ |
| 11 | Proofs offered before print? | ⟦yes/no⟧ |
| 12 | Anti-circumvention (no taking Printy-sourced jobs off-platform) | Included; manager-added clients exempt per existing rule |
| 13 | Verification documents collected from managers/printers | Business name, KRA PIN, M-Pesa details, ⟦ID document?⟧ |
| 14 | Analytics/cookies tool | ⟦none / name it⟧ |
| 15 | Retention periods | Placeholder values in Privacy §7 |
| 16 | Hosting region | Frankfurt (DigitalOcean FRA1); confirm production matches |
| 17 | Platform Admin access to personal data | Role-limited and logged |

---

# PART B: TERMS OF SERVICE (page copy)

**Printy Terms of Service**
Version 1.0 · Effective ⟦date⟧ · Last updated 12 November 2026

## In plain words
- Printy connects you with **verified print managers** who run your job, and **print shops** that produce it.
- Your payment is **held in escrow** and only released after delivery is confirmed.
- Once you pay, your **price and ready-by date are locked**.
- Every stage is **timed and tracked**. Late jobs are visible, and lateness has a cost for whoever caused it.

These plain-words boxes are a summary to help you. The numbered terms below are what apply.

## 1. Who we are and what Printy is
1.1 Printy ("Printy", "we", "us") is operated by ⟦legal entity name⟧, ⟦registration number⟧, ⟦registered address⟧, Kenya, and runs the marketplace at printy.ke.
1.2 Printy is a **managed print marketplace** with three kinds of users: **Buyers** (people and businesses who need printing), **Print Managers** (who quote, manage and deliver your job), and **Printers** (the print shops that produce it).
1.3 Printy is not a printer. The **Print Manager serving your job is your supplier** and is responsible to you for the job being delivered as quoted. Printy provides the platform, verification, escrow, tracking and dispute process around that job.
1.4 By creating an account, requesting a quote, paying, or using a tracking link, you agree to these Terms and our Privacy Notice.

## 2. Accounts, roles and verification
2.1 You must be 18 or older, or a business with legal capacity to contract, and give accurate information. Keep your login and one-time codes (OTP) private. You are responsible for activity on your account.
2.2 Each account has one role: Buyer, Print Manager or Printer. Each role has its own **desk**. Manager and Printer accounts are for providing services and cannot be used to request quotes as a Buyer.
2.3 Print Managers and Printers are **manually verified** by Printy before they can appear to Buyers or receive jobs. Verification can include email and phone checks, business details, KRA PIN, M-Pesa details and manual review. Each account is pending, verified or rejected, and Printy may approve, reject, suspend or re-verify at any time.
2.4 A shop only becomes visible once its owner has confirmed its setup (rate card, turnaround and finishing options).

## 3. Estimates and quotes
3.1 Prices you see before you sign up or before a quote is sent are **estimates** calculated by our server from current shop rate cards and manager pricing. They are not offers.
3.2 A quote becomes an offer only when a Print Manager **sends** it to you. Quotes are valid for ⟦7 days⟧ unless stated.
3.3 A manager may change a quote before you accept it, for example after reviewing your artwork or specification. If they do, you will see a **price updated** (or date updated) state and must review the new figures. You will never be asked to pay an outdated price.
3.4 Speed options (Standard, Faster, Fastest) and "Ready by" times shown before payment are **estimates, not guarantees**. The ready-by date becomes binding when you accept and pay (section 5.2).

## 4. Artwork
4.1 Payment opens only after your artwork is uploaded, unless the Print Manager has ticked that they already hold your artwork. Payment opens when the **manager** has accepted the artwork. A printer's confirmation is not required before you pay.
4.2 You are responsible for your artwork: spelling, content, resolution, colours and fit for purpose. We print what is supplied. Colours can vary between screens, shops and stocks. ⟦If proofs are offered, describe them here.⟧
4.3 You confirm you own or are licensed to use everything you upload and that it is lawful. You grant Printy, your manager and the producing shop a limited licence to use it only to produce and deliver your job.
4.4 We may refuse or cancel jobs containing unlawful, infringing or prohibited content (section 12).

## 5. Payment, price lock and escrow
5.1 Payment opens only on a **sent** quote and after the artwork step. You will complete an **OTP** step, then **M-Pesa** payment, then see a **confirmation**. All prices are in Kenya shillings (KES).
5.2 **Price lock.** Once your payment is confirmed, the price and the ready-by date are locked. Neither the manager nor the shop can raise the price afterwards. If you want to change the job after paying, it needs a new quote or an agreed change that all parties accept.
5.3 **Escrow.** Your payment is held by Printy ⟦describe the actual holding arrangement once confirmed by an advocate⟧ and is **not released to the manager or printer until delivery is confirmed**, subject to sections 6 to 8.
5.4 **Release.** After delivery is confirmed (by you, or deemed confirmed under section 7.3), Printy releases the payout to the Print Manager and the Printer. Payouts are made to the M-Pesa or other payout details they have verified with us.
5.5 **Fair-price cap.** Printy limits what a manager can add on top of the production cost. The cap scales with job size and the total you are shown is the most you will pay for that job.
5.6 **Fees.** Printy's fee is built into the price you see. There are no hidden charges at checkout. You see your total and per-piece price. You do not see a shop's costs or a manager's margin (see our Privacy Notice).
5.7 **Tax.** Each party handles its own tax according to its own registration. The Print Manager is your supplier and is responsible for any invoice or receipt owed to you, including VAT and eTIMS where they are registered. Printy does not issue VAT invoices or submit eTIMS records on a manager's behalf. ⟦Add how Printy documents its own fee.⟧
5.8 **Payment problems.** If M-Pesa shows you paid but your job does not update, do not pay again. Contact support with your M-Pesa confirmation code and job code and we will reconcile it.
5.9 **Refunds.** If you cancel before production starts, you are refunded in full. After production starts, refunds are decided through the dispute process (section 8). Errors in artwork you supplied, and change of mind after production begins, are not grounds for a refund.

## 6. Deadlines, lateness and tracking
6.1 A **due date** is set when your quote is accepted and paid. Each stage (artwork, production, finishing, quality check, delivery) has its own time allowance and a visible owner. We record actual timestamps from day one.
6.2 A job shows **At risk** or **Late** on the relevant desks as soon as our server detects it.
6.3 **Consequence of lateness.** If a manager or printer is late, **10% of that party's total for the job is withheld** until the delay is resolved, then released once it is resolved, unless Printy decides after review that it should not be. Delays caused by the Buyer, such as late approvals or replies, move the ready-by date and are not counted against the manager or printer.
6.4 Printy may publish a manager's on-time percentage only once they have enough completed jobs for it to be meaningful.
6.5 **Tracking.** You can track a job with its job code. Signed in, you see your job directly. Signed out, you enter your job code and the phone number on the job. Buyers who have paid can follow stages and times without signing in. Public tracking shows stages and times only, never amounts or internal parties.

## 7. Delivery and confirmation
7.1 ⟦Describe delivery or collection: who delivers, when the clock stops, and what proof is recorded.⟧
7.2 Check your order promptly. Confirm delivery in Printy, or report a problem within ⟦48 hours⟧ of delivery.
7.3 If you do not respond within ⟦72 hours⟧ of delivery being marked, delivery is treated as confirmed and payouts are released, unless a dispute is open.

## 8. Problems and disputes
8.1 Raise a problem from your job, quickly, with photos where relevant. Your manager is your first contact.
8.2 If it is not resolved, Printy's admin team will review the job timeline, timestamps, artwork, messages and delivery record, and may hold, release, split or refund escrowed funds. Fault is decided on the records: a print that does not match supplied artwork is the printer's responsibility; a print that matches flawed artwork is the Buyer's.
8.3 Printy's decision on escrowed funds is final within the platform, and does not take away any rights you have under Kenyan law.

## 9. Clients added by managers
9.1 Managers may add their own clients, including clients who use only phone or WhatsApp and have no email.
9.2 Printy charges **no platform fee** on clients a manager adds directly. If that client later engages a different manager through Printy, Printy's fee applies to those jobs. Printy can identify manager-added clients.
9.3 A manager who adds a client confirms they have that person's permission to share their details with Printy for the purpose of the job.

## 10. Duties of Print Managers and Printers
10.1 Managers must quote accurately, stay within the fair-price cap, honour quoted dates, and communicate honestly with Buyers.
10.2 Printers must keep rate cards accurate, give at least a standard turnaround estimate, honour quoted ready-by dates, and only start production when artwork is available or the manager has confirmed they hold it.
10.3 **Confidentiality.** Printers must not try to identify, contact or solicit Buyers outside Printy. Managers must not try to identify shops' costs beyond what Printy shows them. Both must keep job information confidential.
10.4 **No circumvention.** Do not use Printy to find a job and then take that job's payment or fulfilment off the platform to avoid escrow or fees. This does not apply to clients a manager added directly (section 9).
10.5 Managers and printers are independent businesses, not Printy's employees or agents.

## 11. Honest use of timing and prices
Do not manipulate timestamps, statuses, ratings or on-time figures, and do not use fake jobs or accounts. Evidence of this may result in suspension and withholding of funds.

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
We may suspend or close an account, and hold related funds pending review, for breach of these Terms, fraud, repeated lateness, failed verification, or legal reasons. You can close your account any time; paid jobs in progress will be completed or resolved first.

## 17. Changes to these Terms
We version these Terms. We will give ⟦14 days⟧ notice of material changes. A job you have already paid for stays under the Terms in force when you paid.

## 18. Contact and notices
Support: ⟦support@printy.ke⟧ · ⟦phone/WhatsApp⟧. Notices to you go to the email or phone on your account.

## 19. Governing law
These Terms are governed by the laws of Kenya. Try to resolve any dispute with us first through support. Unresolved disputes go to ⟦mediation/courts of Kenya, Nairobi; advocate to confirm⟧.

## 20. General
If any part is unenforceable, the rest still applies. These Terms and the Privacy Notice are our whole agreement with you. ⟦Entity⟧ may transfer these Terms in a business transfer; you may not without our consent.

---

# PART C: PRIVACY NOTICE (page copy)

**Printy Privacy Notice**
Version 1.0 · Effective ⟦date⟧ · Last updated 12 November 2026

## In plain words
- We collect only what we need to run your job, take payment, verify managers and keep the platform safe.
- **Money and identity are masked by role.** Buyers never see a shop's costs. Shops never see who you are or what you paid. Our server does this masking before anything reaches a screen.
- We do not sell your personal data.
- You have rights over your data under Kenya's Data Protection Act, and you can use them any time.

## 1. Who is responsible for your data
⟦Legal entity⟧ ("Printy") decides why and how your personal data is processed and is the **data controller**. ODPC registration: ⟦number⟧. Contact for privacy: ⟦privacy@printy.ke⟧ ⟦Data Protection contact/DPO name⟧.

## 2. What we collect
- **Account data:** name, email, phone number, role, password (stored securely, never in plain text).
- **Verification data (managers and printers):** business name, KRA PIN, M-Pesa details, ⟦ID documents⟧, profile photo for manager profiles.
- **Job data:** specifications, artwork files, delivery details, messages, job code, stage timestamps and times taken.
- **Payment data:** M-Pesa phone number, transaction reference, amount and status. We never see your M-Pesa PIN.
- **Saved choices:** managers you select before signing in are saved in your browser and attached to your account when you sign up or in.
- **Details added by managers:** name and phone (and email, if any) of clients a manager adds on their behalf.
- **Technical data:** IP address, device and browser, logs, and the cookies/local storage in section 10.
- **Communications:** OTP messages, job updates, support conversations.

## 3. Why we use it
| Purpose | Basis |
|---|---|
| Create and secure your account; run quotes, jobs, tracking | Performing our contract with you |
| Take payment, hold escrow, release payouts | Performing our contract; legal obligations |
| Verify managers and printers | Legitimate interest in a trusted marketplace; legal obligations |
| Measure timeliness and enforce deadlines | Contract; legitimate interest |
| Prevent fraud, abuse and security incidents | Legitimate interest |
| Resolve disputes | Contract; legitimate interest |
| Tax, accounting and legal compliance | Legal obligation |
| Service messages (OTP, quotes, job updates) | Contract |
| Marketing messages | **Your consent only**, withdraw any time |

## 4. Who can see what
Our server masks fields by role. Summary:

| | Buyer | Print Manager | Printer (shop) | Public tracker |
|---|---|---|---|---|
| Buyer name and phone | Own | Yes, for their jobs | **No** | **No** |
| Total paid and per-piece price | Yes | Yes | **No** | **No** |
| Shop identity and production costs | **No** | Yes | Own | **No** |
| Manager margin and fees | **No** | Own | **No** | **No** |
| Job specs and artwork | Own | Yes | Yes, to produce | **No** |
| Stages and times | Yes | Yes | Yes | Yes |

Artwork files can contain personal details you put in them; please be mindful of this. Authorised Printy admin staff can access data as needed for support, payouts, security and disputes, limited by role and logged. ⟦confirm⟧

## 5. Who we share data with
- **Service providers** acting for us: hosting (DigitalOcean), M-Pesa (Safaricom Daraja) for payments, ⟦email provider⟧, ⟦SMS/WhatsApp provider⟧, ⟦analytics, if any⟧.
- **Authorities and professional advisers** where the law requires or to protect rights.
- **A buyer of the business** if Printy is sold, under the same protections.
We do not sell personal data.

## 6. Transfers outside Kenya
Our servers are located outside Kenya ⟦currently the European Union (Frankfurt)⟧. When data leaves Kenya we rely on the safeguards the Data Protection Act requires (such as adequate protection, contractual safeguards or your consent where needed). ⟦advocate to confirm⟧

## 7. How long we keep data
| Data | Kept for |
|---|---|
| Job, payment and payout records | ⟦at least 5 years, for tax and audit⟧ |
| Account data | While your account is active, then ⟦24 months⟧ |
| Verification records | ⟦duration of relationship + 5 years⟧ |
| OTP codes | Minutes |
| Server and security logs | ⟦90 days⟧ |
| Marketing consent records | Until withdrawn, then proof of withdrawal ⟦12 months⟧ |
After this we delete or anonymise data, unless the law requires otherwise.

## 8. Security and breaches
We use encryption in transit, role-based access, server-side masking of money and identity fields, OTP verification, access logging and backups. No system is perfectly secure. If a breach is likely to harm you, we will notify the Data Commissioner within 72 hours of becoming aware, and tell affected people without undue delay.

## 9. Your rights
Under the Data Protection Act, 2019 you may: be informed how your data is used; **access** it; **correct** it; **delete** it; **object** to processing or to direct marketing; **withdraw consent**; ask for a portable copy; and not be subject to a decision based solely on automated processing that significantly affects you. Our price estimates and recommended-manager suggestions are generated automatically, but a person (your manager) finalises your quote, and you choose whether to accept it.
To use a right, email ⟦privacy@printy.ke⟧. We may need to verify your identity, and we respond within the time set by the Data Protection (General) Regulations, 2021. Some records (such as tax and payment records) must be kept by law. If you are unhappy, you can complain to the **Office of the Data Protection Commissioner** (odpc.go.ke).

## 10. Cookies and local storage
We use **essential** storage for sign-in, your active role, and your saved manager choices. ⟦If you use analytics, list it here and give a consent choice.⟧ You can clear browser storage at any time, but parts of Printy may stop working.

## 11. Messages
We send service messages (OTP, quotes, status, "price updated", "At risk/Late") by email, SMS or WhatsApp, as needed to run your job. We send marketing only if you opt in, and every marketing message has an easy opt-out.

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
**What is Printy?** A marketplace where verified print managers run your job and print shops produce it, with your payment held safely until delivery.
**Why is the price an estimate?** Before a manager sends a quote, prices are calculated by our server from current shop rates. The sent quote is the real offer.
**What are Standard, Faster and Fastest?** Speed options with a "Ready by" time. They are estimates until you pay, then the date is locked.

## Quotes
**What does "price updated" mean?** Your manager changed something (for example after checking artwork). Review the new price or date before you accept.
**Can I choose my manager?** Yes. Pick a recommended manager for your job. Sign in to lock them as one of **Your managers**.
**I have no email.** Your manager can add you with your phone number or WhatsApp. You can track and follow your job without signing in.

## Artwork
**Why can't I pay?** The pay button opens when (1) your manager has sent the quote and (2) your artwork is uploaded and accepted by the manager, or the manager has confirmed they already have it.
**What file should I upload?** Print-ready files. We print what you send. Check spelling and colours first.

## Paying
**How does payment work?** OTP, then M-Pesa, then confirmation. Your money is held in escrow until delivery is confirmed.
**I paid but nothing changed.** Do not pay again. Wait a few minutes, then contact support with your M-Pesa code and job code.
**Is my price safe after I pay?** Yes. Price and ready-by date are locked at payment.
**Do I get a receipt or VAT invoice?** Your manager is your supplier and provides any invoice or receipt owed to you. ⟦add receipt info from Printy⟧

## Tracking
**How do I track a job?** Use your job code. Signed out, you also enter the phone number on the job. You will see stages and times, never prices or other parties.

## Late jobs
**What do At risk and Late mean?** The job is close to, or past, a stage deadline. You and your manager see it straight away on your desk. Message your manager from there.
**What happens when someone is late?** 10% of the late party's total is held until it is resolved. If you caused the delay (for example late approval), the ready-by date moves instead.

## Delivery, problems and refunds
**What do I do when it arrives?** Check it and confirm delivery in Printy, or report a problem within ⟦48 hours⟧.
**Something is wrong.** Raise it on the job. Your manager responds first. If it is not resolved, our admin team reviews the records and decides what happens to the escrowed funds.
**Can I cancel?** Before production starts you are refunded in full. After that, it goes through a dispute review.

## For managers
**How do I get verified?** Complete your profile; we verify manually (business details, KRA PIN, M-Pesa). You appear to buyers once verified.
**Can I bring my own clients?** Yes. No Printy fee on clients you add directly. If they later use another manager, the fee applies.
**What do I see on a quote?** Your total, your margin and Printy's fee. Quotes are capped by the fair-price cap.
**Taxes and invoices?** You invoice your clients and handle VAT/eTIMS yourself. Printy does not do it for you.

## For printers
**How do I add prices?** Enter your printing price and the rate card calculates the rest; adjust any column. Confirm your shop to become visible.
**What must I set?** At least a standard turnaround time.
**What can I see?** Specs, artwork and job code. Not buyer identity, totals or manager margin.

## Your data
**What do you collect and who sees it?** See the Privacy Notice. Short version: shops never see who you are, buyers never see shop costs.
**How do I ask for my data to be corrected or deleted?** Email ⟦privacy@printy.ke⟧.

## Contact
⟦support@printy.ke⟧ · ⟦phone/WhatsApp⟧ · ⟦hours⟧. Please include your job code.

---

# PART E: Internal claims register (for Codex verification)

| Claim in copy | Source of truth (project law) | Needs code proof |
|---|---|---|
| Estimates are server-produced | pricing engine, speed cards "estimate, not a guarantee" | Yes |
| Manager price change shows "price updated"; buyer never pays old price | law.txt, Oct 2026 | Yes (tests) |
| Price and ready-by locked at payment | law.txt | Yes |
| Escrow until delivery confirmed | core feature | Yes |
| Payment needs sent quote + artwork; OTP then M-Pesa | law.txt | Yes |
| Manager acceptance (not printer) gates payment | law.txt | Yes |
| Shops never see buyer identity or totals; buyers never see shop identity/costs; margin hidden | privacy principles, role serializers via X-Printy-Active-Role | Yes |
| Public tracker shows stages and times only | law.txt | Yes |
| Signed-out tracking = job code + phone; paid clients track without sign-in | law.txt | Yes |
| At risk / Late shown at once | SLA rules | Yes |
| 10% hold on late party | law.txt | Yes |
| Hold released on resolution unless owner decides otherwise | law.txt | Yes |
| On-time % public only with enough jobs | law.txt | Yes |
| Manager-added clients: no fee; fee if new manager; identifiable | law.txt | Yes |
| VAT/eTIMS handled by each party; Printy not supplier of record | VAT decision | No |
| Managers manually verified; pending/verified/rejected | trust tier | Yes |
| Shop visible only after owner confirms setup | rate-card decision | Yes |
| Fair-price cap enforced above every job size | tiered fee formula | Yes (must be provable) |
