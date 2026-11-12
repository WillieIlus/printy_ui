/**
 * Single source of truth for the legal pages.
 *
 * The text here is the hardened v2 copy. It deliberately contains no owner
 * decision placeholders: unresolved facts are left out rather than shown to
 * users. See printy-legal-copy.v2.md and results.txt for the audit and the
 * open decisions behind every omission.
 */

export const LEGAL_VERSION = '2.0'
export const LEGAL_UPDATED = '12 November 2026'
export const LEGAL_CONTACT_EMAIL = 'support@printy.ke'

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }

export interface LegalSection {
  id: string
  number: string
  title: string
  blocks: LegalBlock[]
}

export interface HelpItem {
  question: string
  answer: string
}

export interface HelpGroup {
  id: string
  title: string
  items: HelpItem[]
}

export const TERMS_PLAIN_WORDS = [
  'Printy connects you with verified print managers who run your job, and print shops that produce it.',
  'Your payment is held by Printy and released only after the job is ready or completed and your payment is confirmed, or after a review.',
  'The price is fixed when you accept a quote. A ready-by time becomes the job due date, but it stays an estimate, not a guarantee.',
  'Every stage is timed and tracked. Lateness is recorded and can affect how a payout is reviewed.',
] as const

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    number: '1',
    title: 'Who we are and what Printy is',
    blocks: [
      {
        kind: 'p',
        text:
          'Printy ("Printy", "we", "us") operates the managed print marketplace at printy.ke. Printy is operated from Kenya.',
      },
      {
        kind: 'p',
        text:
          'Printy is a managed print marketplace with three kinds of users: Buyers (people and businesses who need printing), Print Managers (who quote, manage and deliver your job), and Printers (the print shops that produce it).',
      },
      {
        kind: 'p',
        text:
          'Printy is not a printer. The Print Manager serving your job is your supplier and is responsible to you for the job being delivered as quoted. Printy provides the platform, verification, custody of payment, tracking and the dispute process around that job.',
      },
      {
        kind: 'p',
        text:
          'A job is the work created when you accept a quote. It carries the accepted price and due date and moves through the stages you see in tracking.',
      },
      {
        kind: 'p',
        text:
          'By creating an account, requesting a quote, paying, or using a tracking link, you agree to these Terms and our Privacy Notice.',
      },
    ],
  },
  {
    id: 'accounts',
    number: '2',
    title: 'Accounts, roles and verification',
    blocks: [
      {
        kind: 'p',
        text:
          'You must be 18 or older, or a business with legal capacity to contract, and give accurate information. Keep your login and one-time codes (OTP) private. You are responsible for activity on your account.',
      },
      {
        kind: 'p',
        text:
          'Each account has one role: Buyer, Print Manager or Printer. Each role has its own desk. Manager and Printer accounts are for providing services and cannot be used to request quotes as a Buyer.',
      },
      {
        kind: 'p',
        text:
          'Print Managers and Printers are manually verified by Printy before they can appear to Buyers or receive jobs. Verification can include email and phone checks, the details and profile photo you provide, and manual review. Printy may approve, suspend or re-verify an account at any time.',
      },
      {
        kind: 'p',
        text:
          'A Printer confirms its rate card, standard turnaround and finishing options before the shop is treated as ready for matching.',
      },
    ],
  },
  {
    id: 'estimates',
    number: '3',
    title: 'Estimates and quotes',
    blocks: [
      {
        kind: 'p',
        text:
          'Prices you see before you sign up or before a quote is sent are estimates calculated by our server from current shop rate cards and manager pricing. They are not offers.',
      },
      {
        kind: 'p',
        text:
          'A quote becomes an offer only when a Print Manager sends it to you. The quote states when it expires.',
      },
      {
        kind: 'p',
        text:
          'A manager may change a quote before you accept it, for example after reviewing your artwork or specification. If they do, you will see a price updated (or date updated) state and must review and acknowledge the new figures before payment can start. You will never be asked to pay an outdated price.',
      },
      {
        kind: 'p',
        text:
          'Speed options (Standard, Faster, Fastest) and "Ready by" times shown before acceptance are estimates, not guarantees. Faster and Fastest carry a configured surcharge, and a tier may be switched off by the shop. A ready-by time becomes the job due date when you accept the quote, but it remains an estimate. It feeds the stage timing and lateness rules, not a guarantee of delivery at that minute.',
      },
    ],
  },
  {
    id: 'artwork',
    number: '4',
    title: 'Artwork',
    blocks: [
      {
        kind: 'p',
        text:
          'Payment opens only after your artwork is uploaded, unless the Print Manager has marked that they already hold your artwork. On the upload path, the artwork is satisfied by the upload. On the manager-holds path, the manager must accept the artwork; a printer confirmation is not required before you pay.',
      },
      {
        kind: 'p',
        text:
          'A printer must acknowledge that it holds the artwork on the manager-holds path before production can start. You are responsible for your artwork: spelling, content, resolution, colours and fit for purpose. We print what is supplied. Colours can vary between screens, shops and stocks.',
      },
      {
        kind: 'p',
        text:
          'You confirm you own or are licensed to use everything you upload and that it is lawful. You grant Printy, your manager and the producing shop a limited licence to use it only to produce and deliver your job.',
      },
      {
        kind: 'p',
        text:
          'We may refuse or cancel jobs containing unlawful, infringing or prohibited content (section 12).',
      },
    ],
  },
  {
    id: 'payment',
    number: '5',
    title: 'Payment, price lock and custody',
    blocks: [
      {
        kind: 'p',
        text:
          'Payment opens only on a sent quote and after the artwork step. You pay through M-Pesa. Where you pay through a client link, you may first verify your phone with a one-time code. When you pay while signed in, the M-Pesa prompt is sent directly. All prices are in Kenya shillings (KES).',
      },
      {
        kind: 'p',
        text:
          'Price lock. The price is fixed when you accept the quote and the accepted snapshot is frozen. Neither the manager nor the shop can raise the price afterwards. If you want to change the job after accepting, it needs a new quote or an agreed change that all parties accept. The ready-by time becomes the job due date at acceptance, but it remains an estimate.',
      },
      {
        kind: 'p',
        text:
          'Custody. Your payment is held by Printy. It is not released to the manager or printer automatically.',
      },
      {
        kind: 'p',
        text:
          'Release. Printy releases payouts manually after the job is ready or completed and your payment is confirmed, or after a dispute review under section 8. Payouts are made to the manager and printer payout records Printy holds. A payout can be placed on hold while a problem is reviewed.',
      },
      {
        kind: 'p',
        text:
          'Fair-price cap. Printy limits what a manager can add on top of the production cost. The cap scales with job size (3.0x production cost at the smallest tier, 2.5x in the middle tier and 2.0x at the largest). The total shown for a quote will not exceed that cap.',
      },
      {
        kind: 'p',
        text:
          'Fees. Printy\'s manager-side fee is built into the price you see. There are no hidden charges at checkout. You see your total and per-piece price. You do not see a shop\'s costs or a manager\'s margin (see our Privacy Notice). The printer-side fee is separate and is not waived by the manager-side rule.',
      },
      {
        kind: 'p',
        text:
          'Tax. Each party handles its own tax according to its own registration. The Print Manager is your supplier and is responsible for any invoice or receipt owed to you.',
      },
      {
        kind: 'p',
        text:
          'Payment problems. If M-Pesa shows you paid but your job does not update, do not pay again. Contact support with your M-Pesa confirmation code and job code and we will reconcile it.',
      },
      {
        kind: 'p',
        text:
          'Refunds. Contact support before production starts if you want to cancel. Production starts when the job is marked as started in production, which is recorded with a timestamp. Printy reviews the job record and, where the payment can be reversed, records a refund to the original payer. After production starts, refunds are decided through the dispute process (section 8). Errors in artwork you supplied, and change of mind after production begins, are not grounds for a refund.',
      },
    ],
  },
  {
    id: 'deadlines',
    number: '6',
    title: 'Deadlines, lateness and tracking',
    blocks: [
      {
        kind: 'p',
        text:
          'A due date is set when your quote is accepted. Each stage (quote acceptance, artwork approval, production, quality check, delivery) has its own time allowance and a visible owner. We record actual timestamps from day one.',
      },
      {
        kind: 'p',
        text:
          'The tracker shows whether a job is on track, late or has an overdue stage. Each stage shows who has the next action.',
      },
      {
        kind: 'p',
        text:
          'Consequence of lateness. If a manager or printer is late, Printy records the delay, the stage and who caused it. That record is available when a payout is reviewed and can affect whether funds are held, released or adjusted. Where a rush premium was paid, a 10% penalty is calculated on that premium and recorded as a separate line; the printer payout is not touched automatically. Delays caused by the Buyer, such as late approvals or replies, move the due date and are not counted against the manager or printer.',
      },
      {
        kind: 'p',
        text:
          'Printy may publish a manager\'s on-time percentage only once they have enough completed jobs for it to be meaningful.',
      },
      {
        kind: 'p',
        text:
          'Tracking. You can track a job with its job code. Signed in, you see your job directly. Signed out, you enter your job code and the phone number on the job. Buyers who have paid can follow stages and times without signing in. Public tracking shows stages, timestamps and who has the next action only, never amounts, shop identity or a manager\'s margin.',
      },
    ],
  },
  {
    id: 'delivery',
    number: '7',
    title: 'Delivery and confirmation',
    blocks: [
      {
        kind: 'p',
        text:
          'Check your order promptly. Confirm delivery in Printy, or report a problem from the job.',
      },
      {
        kind: 'p',
        text:
          'If you do not confirm delivery, Printy does not treat the job as confirmed by a timer. Printy can review the job record and release funds once the job is ready or completed and payment is confirmed, unless a payout is on hold.',
      },
    ],
  },
  {
    id: 'disputes',
    number: '8',
    title: 'Problems and disputes',
    blocks: [
      {
        kind: 'p',
        text:
          'Raise a problem from your job, quickly, with photos where relevant. Your manager is your first contact.',
      },
      {
        kind: 'p',
        text:
          'If it is not resolved, Printy\'s admin team will review the job timeline, timestamps, artwork, messages and delivery record, and may hold or release payouts, or record a refund. Fault is decided on the records: a print that does not match supplied artwork is the printer\'s responsibility; a print that matches flawed artwork is the Buyer\'s.',
      },
      {
        kind: 'p',
        text:
          'Printy\'s decision on funds is final within the platform, and does not take away any rights you have under Kenyan law.',
      },
    ],
  },
  {
    id: 'added-clients',
    number: '9',
    title: 'Clients added by managers',
    blocks: [
      {
        kind: 'p',
        text:
          'Managers may add their own clients, including clients who use only phone or WhatsApp and have no email. The manager supplies the client\'s name and phone; email is optional.',
      },
      {
        kind: 'p',
        text:
          'Printy charges no manager-side platform fee when the job\'s manager is the client\'s originating manager. If that client later engages a different manager through Printy, Printy\'s normal fee applies to those jobs. Printy can identify manager-added clients. The printer-side fee is unchanged.',
      },
      {
        kind: 'p',
        text:
          'A client whose phone number already exists in Printy is reused and is not re-originated by a later manager. The existing record keeps its origin.',
      },
      {
        kind: 'p',
        text:
          'A manager who adds a client confirms they have that person\'s permission to share their details with Printy for the purpose of the job.',
      },
    ],
  },
  {
    id: 'duties',
    number: '10',
    title: 'Duties of Print Managers and Printers',
    blocks: [
      {
        kind: 'p',
        text:
          'Managers must quote accurately, stay within the fair-price cap, honour quoted dates, and communicate honestly with Buyers.',
      },
      {
        kind: 'p',
        text:
          'Printers must keep rate cards accurate, set a standard turnaround, honour quoted ready-by dates, and only start production when artwork is available or the manager has confirmed they hold it and the printer has acknowledged it.',
      },
      {
        kind: 'p',
        text:
          'Confidentiality. Printers must not try to identify, contact or solicit Buyers outside Printy. Managers must not try to identify shops\' costs beyond what Printy shows them. Both must keep job information confidential.',
      },
      {
        kind: 'p',
        text:
          'No circumvention. Do not use Printy to find a job and then take that job\'s payment or fulfilment off the platform to avoid custody or fees. This does not apply to clients a manager added directly (section 9).',
      },
      {
        kind: 'p',
        text:
          'Managers and printers are independent businesses, not Printy\'s employees or agents.',
      },
    ],
  },
  {
    id: 'honest-use',
    number: '11',
    title: 'Honest use of timing and prices',
    blocks: [
      {
        kind: 'p',
        text:
          'Do not manipulate timestamps, statuses or on-time figures, and do not use fake jobs or accounts. Evidence of this may result in suspension and a payout hold pending review.',
      },
    ],
  },
  {
    id: 'acceptable-use',
    number: '12',
    title: 'Acceptable use',
    blocks: [
      {
        kind: 'p',
        text:
          'You must not use Printy to print or request anything unlawful or infringing, including counterfeit money, forged identity or official documents, others\' trademarks without permission, or hateful, abusive or sexually exploitative content. You must not scrape, probe, overload or reverse-engineer the platform, our calculators or imposition engine.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    number: '13',
    title: 'Intellectual property',
    blocks: [
      {
        kind: 'p',
        text:
          'Printy owns the platform, brand, calculators, pricing and imposition tools. You keep ownership of your content and artwork. You may not copy or resell our tools or data.',
      },
    ],
  },
  {
    id: 'availability',
    number: '14',
    title: 'Availability and third parties',
    blocks: [
      {
        kind: 'p',
        text:
          'We work to keep Printy available but cannot promise uninterrupted service. Payments run through M-Pesa (Safaricom). We are not responsible for outages or delays outside our control, including mobile network, M-Pesa or power failures.',
      },
    ],
  },
  {
    id: 'liability',
    number: '15',
    title: 'Liability',
    blocks: [
      {
        kind: 'p',
        text:
          'Printy is a platform. To the extent Kenyan law allows, we are not liable for indirect or consequential losses, and our total liability to you for a job is limited to the amount you paid for that job.',
      },
      {
        kind: 'p',
        text:
          'Nothing here limits liability that cannot be limited under Kenyan law, including for fraud or for death or personal injury caused by negligence, or any consumer rights you have by law.',
      },
    ],
  },
  {
    id: 'suspension',
    number: '16',
    title: 'Suspension and ending',
    blocks: [
      {
        kind: 'p',
        text:
          'We may suspend or close an account, and place related payouts on hold pending review, for breach of these Terms, fraud, repeated lateness, failed verification, or legal reasons. You can close your account any time; paid jobs in progress will be completed or resolved first.',
      },
    ],
  },
  {
    id: 'changes',
    number: '17',
    title: 'Changes to these Terms',
    blocks: [
      {
        kind: 'p',
        text:
          'We version these Terms and show the version and last-updated date on this page. We will not apply a material change retrospectively to a job you have already paid for.',
      },
    ],
  },
  {
    id: 'contact',
    number: '18',
    title: 'Contact and notices',
    blocks: [
      {
        kind: 'p',
        text:
          'Support: support@printy.ke. Notices to you go to the email or phone on your account.',
      },
    ],
  },
  {
    id: 'governing-law',
    number: '19',
    title: 'Governing law',
    blocks: [
      {
        kind: 'p',
        text:
          'These Terms are governed by the laws of Kenya. Try to resolve any dispute with us first through support. Unresolved disputes go to the courts of Kenya.',
      },
    ],
  },
  {
    id: 'general',
    number: '20',
    title: 'General',
    blocks: [
      {
        kind: 'p',
        text:
          'If any part is unenforceable, the rest still applies. These Terms and the Privacy Notice are our whole agreement with you. Printy may transfer these Terms in a business transfer; you may not without our consent.',
      },
    ],
  },
]

export const PRIVACY_PLAIN_WORDS = [
  'We collect only what we need to run your job, take payment, verify managers and keep the platform safe.',
  'Money and identity are masked by role. Buyers never see a shop\'s costs. Shops never see who you are or what you paid. Our server applies this masking before anything reaches a screen.',
  'We do not sell your personal data.',
  'You have rights over your data under Kenya\'s Data Protection Act, and you can use them any time through support.',
] as const

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'controller',
    number: '1',
    title: 'Who is responsible for your data',
    blocks: [
      {
        kind: 'p',
        text:
          'Printy decides why and how your personal data is processed and is the data controller. Contact for privacy: support@printy.ke.',
      },
    ],
  },
  {
    id: 'what-we-collect',
    number: '2',
    title: 'What we collect',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'Account data: name, email, phone number, role, preferred language, and password (stored as a hash, never in plain text).',
          'Profile data: the bio, photo, address, city, state, postal code and country you choose to add. Managers may add a profile photo.',
          'Verification data (managers and printers): the business and profile details you provide and the manual verification record. We do not currently collect a KRA PIN, ID document or stored M-Pesa credential in these profiles.',
          'Job data: specifications, artwork files, delivery details, job notes and production instructions, messages, job code, stage timestamps and times taken.',
          'Payment data: M-Pesa phone number, transaction reference, amount, status, result codes and the callback data we receive, and the consent record for saving a payment phone. We never see your M-Pesa PIN.',
          'Saved choices: your calculator specification, guest session, pending draft, pending manager, printer queue and "verified managers" choice are saved in your browser.',
          'Details added by managers: name and phone (and email, if any) of clients a manager adds on their behalf.',
          'Technical data: IP address, browser user-agent, request logs, and the cookies and local storage in section 10. At the date of this Notice, we do not run a third-party analytics script.',
          'Communications: OTP messages, job updates and support conversations.',
        ],
      },
    ],
  },
  {
    id: 'why',
    number: '3',
    title: 'Why we use it',
    blocks: [
      {
        kind: 'table',
        head: ['Purpose', 'Basis'],
        rows: [
          ['Create and secure your account; run quotes, jobs, tracking', 'Performing our contract with you'],
          ['Take payment, hold funds in custody, release payouts', 'Performing our contract; legal obligations'],
          ['Verify managers and printers', 'Legitimate interest in a trusted marketplace; legal obligations'],
          ['Measure timeliness and record deadlines', 'Contract; legitimate interest'],
          ['Prevent fraud, abuse and security incidents', 'Legitimate interest'],
          ['Resolve disputes', 'Contract; legitimate interest'],
          ['Tax, accounting and legal compliance', 'Legal obligation'],
          ['Service messages (OTP, quotes, job updates)', 'Contract'],
          ['Marketing messages', 'Your consent only, withdraw any time'],
        ],
      },
    ],
  },
  {
    id: 'who-sees',
    number: '4',
    title: 'Who can see what',
    blocks: [
      { kind: 'p', text: 'For managed jobs, our server masks fields by role before they reach a screen. Summary:' },
      {
        kind: 'table',
        head: ['', 'Buyer', 'Print Manager', 'Printer (shop)', 'Public tracker'],
        rows: [
          ['Buyer name and phone', 'Own', 'Yes, for their jobs', 'No', 'No'],
          ['Total paid and per-piece price', 'Yes', 'Yes', 'No', 'No'],
          ['Shop identity and production costs (managed jobs)', 'No', 'Yes', 'Own', 'No'],
          ['Manager margin and fees', 'No', 'Own', 'No', 'No'],
          ['Job specs and artwork', 'Own', 'Yes', 'Yes, to produce', 'No'],
          ['Stages and times', 'Yes', 'Yes', 'Yes', 'Yes'],
        ],
      },
      {
        kind: 'p',
        text:
          'Artwork files can contain personal details you put in them; please be mindful of this. Authorised Printy admin staff can access data when needed for support, payouts, security and disputes, limited by role.',
      },
    ],
  },
  {
    id: 'sharing',
    number: '5',
    title: 'Who we share data with',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'Service providers acting for us: infrastructure that hosts the service, M-Pesa (Safaricom Daraja) for payments, and our email provider.',
          'Authorities and professional advisers where the law requires or to protect rights.',
          'A buyer of the business if Printy is sold, under the same protections.',
        ],
      },
      { kind: 'p', text: 'We do not sell personal data.' },
    ],
  },
  {
    id: 'transfers',
    number: '6',
    title: 'Transfers outside Kenya',
    blocks: [
      {
        kind: 'p',
        text:
          'Our service providers may process data outside Kenya. When data leaves Kenya we rely on the safeguards the Data Protection Act requires (such as adequate protection, contractual safeguards or your consent where needed).',
      },
    ],
  },
  {
    id: 'retention',
    number: '7',
    title: 'How long we keep data',
    blocks: [
      {
        kind: 'p',
        text:
          'We keep personal data only for as long as we need it for the purposes above, then delete or anonymise it unless the law requires us to keep it. Job, payment and payout records may be kept for tax, audit and dispute purposes; account, verification and log data are kept while needed for those purposes. We do not currently run an automated retention or deletion job; deletion is handled by authorised staff on request.',
      },
    ],
  },
  {
    id: 'security',
    number: '8',
    title: 'Security and breaches',
    blocks: [
      {
        kind: 'p',
        text:
          'We use encryption in transit, role-based access, server-side masking of money and identity fields, and OTP verification where a client link is used. No system is perfectly secure. If a breach is likely to harm you, we will notify the Data Commissioner within 72 hours of becoming aware, and tell affected people without undue delay.',
      },
    ],
  },
  {
    id: 'rights',
    number: '9',
    title: 'Your rights',
    blocks: [
      {
        kind: 'p',
        text:
          'Under the Data Protection Act, 2019 you may: be informed how your data is used; access it; correct it; delete it; object to processing or to direct marketing; withdraw consent; ask for a portable copy; and not be subject to a decision based solely on automated processing that significantly affects you. Our price estimates and recommended-manager suggestions are generated automatically, but a person (your manager) finalises your quote, and you choose whether to accept it.',
      },
      {
        kind: 'p',
        text:
          'To use a right, email support@printy.ke. We may need to verify your identity, and we respond within the time set by the Data Protection (General) Regulations, 2021. Some records (such as tax and payment records) must be kept by law. If you are unhappy, you can complain to the Office of the Data Protection Commissioner (odpc.go.ke).',
      },
    ],
  },
  {
    id: 'cookies',
    number: '10',
    title: 'Cookies and local storage',
    blocks: [
      {
        kind: 'p',
        text:
          'We use essential storage for sign-in, your active role, your language, and your saved manager choices. The sign-in cookies are printy_access_token, printy_refresh_token, printy_remember_me and printy_active_role; the language cookie is printy-language. The browser storage keys are printy_calculator, printy_guest_session, printy_pending_draft, printy_pending_manager, printy.printer.queue.v1 and printy:verified-managers-choice. You can clear browser storage at any time, but parts of Printy may stop working.',
      },
    ],
  },
  {
    id: 'messages',
    number: '11',
    title: 'Messages',
    blocks: [
      {
        kind: 'p',
        text:
          'We send service messages (OTP, quotes, status, "price updated") by email. We may also contact you by phone about a job. We send marketing only if you opt in, and every marketing message has an easy opt-out.',
      },
    ],
  },
  {
    id: 'manager-clients',
    number: '12',
    title: 'Clients added by managers',
    blocks: [
      {
        kind: 'p',
        text:
          'When a manager adds you as a client, Printy holds your details to run your job and may message you about it. The manager is responsible for having your permission to share them. You can use your rights above with Printy or the manager.',
      },
    ],
  },
  {
    id: 'children',
    number: '13',
    title: 'Children',
    blocks: [
      {
        kind: 'p',
        text:
          'Printy is for people 18 and over. We do not knowingly collect data from children. If you believe we have, contact us and we will delete it.',
      },
    ],
  },
  {
    id: 'changes',
    number: '14',
    title: 'Changes',
    blocks: [
      {
        kind: 'p',
        text:
          'We version this Notice and will tell you of material changes. Contact: support@printy.ke.',
      },
    ],
  },
]

export const HELP_GROUPS: HelpGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        question: 'What is Printy?',
        answer:
          'A marketplace where verified print managers run your job and print shops produce it, with your payment held by Printy until the job is ready or completed and payment is confirmed.',
      },
      {
        question: 'Why is the price an estimate?',
        answer:
          'Before a manager sends a quote, prices are calculated by our server from current shop rates. The sent quote is the real offer.',
      },
      {
        question: 'What are Standard, Faster and Fastest?',
        answer:
          'Speed options with a "Ready by" time. They are estimates, not guarantees. A ready-by time becomes the job due date when you accept, but it can still move if you cause a delay.',
      },
    ],
  },
  {
    id: 'quotes',
    title: 'Quotes',
    items: [
      {
        question: 'What does "price updated" mean?',
        answer:
          'Your manager changed something (for example after checking artwork). Review and acknowledge the new price or date before you can pay.',
      },
      {
        question: 'Can I choose my manager?',
        answer:
          'Yes. Pick a recommended manager for your job. Sign in to save them as one of Your managers.',
      },
      {
        question: 'I have no email.',
        answer:
          'Your manager can add you with your phone number or WhatsApp. You can track and follow your job without signing in.',
      },
    ],
  },
  {
    id: 'artwork',
    title: 'Artwork',
    items: [
      {
        question: 'Why can\'t I pay?',
        answer:
          'The pay button opens when (1) your manager has sent the quote and (2) your artwork is uploaded, or the manager has accepted that they already hold it. On the manager-holds path, the printer must acknowledge the artwork before production.',
      },
      {
        question: 'What file should I upload?',
        answer:
          'Print-ready files. We print what you send. Check spelling and colours first.',
      },
    ],
  },
  {
    id: 'paying',
    title: 'Paying',
    items: [
      {
        question: 'How does payment work?',
        answer:
          'You pay through M-Pesa. On a client link you may verify your phone with a one-time code first; signed in, the M-Pesa prompt is sent directly. Printy only treats a payment as confirmed when the M-Pesa confirmation arrives.',
      },
      {
        question: 'I paid but nothing changed.',
        answer:
          'Do not pay again. Wait a few minutes, then contact support with your M-Pesa code and job code.',
      },
      {
        question: 'Is my price safe after I pay?',
        answer:
          'Yes. The accepted quote\'s price snapshot is frozen. Your ready-by time becomes the due date, but it remains an estimate.',
      },
      {
        question: 'Do I get a receipt or VAT invoice?',
        answer:
          'Your manager is your supplier and provides any invoice or receipt owed to you.',
      },
    ],
  },
  {
    id: 'tracking',
    title: 'Tracking',
    items: [
      {
        question: 'How do I track a job?',
        answer:
          'Use your job code. Signed out, you also enter the phone number on the job. You will see stages, timestamps and who has the next action, never prices, shop identity or manager margin.',
      },
    ],
  },
  {
    id: 'late-jobs',
    title: 'Late jobs',
    items: [
      {
        question: 'What does late mean?',
        answer:
          'The job is past a stage deadline or the overall due date. The tracker shows on track, late or an overdue stage. You and your manager see it on your desk. Message your manager from there.',
      },
      {
        question: 'What happens when someone is late?',
        answer:
          'Printy records the delay, the stage and who caused it. That record is reviewed when a payout is decided. If you caused the delay (for example late approval), the due date moves instead. Where a rush premium was paid, its status is recorded as refunded, held for review or unchanged, and a separate 10% penalty line is recorded.',
      },
    ],
  },
  {
    id: 'delivery-problems-refunds',
    title: 'Delivery, problems and refunds',
    items: [
      {
        question: 'What do I do when it arrives?',
        answer:
          'Check it and confirm delivery in Printy, or report a problem from the job.',
      },
      {
        question: 'Something is wrong.',
        answer:
          'Raise it on the job. Your manager responds first. If it is not resolved, our admin team reviews the records and decides what happens to the funds held by Printy.',
      },
      {
        question: 'Can I cancel?',
        answer:
          'Contact support before production starts. Printy reviews the job and, where the payment can be reversed, records a refund to the original payer. After production starts, it goes through a dispute review.',
      },
    ],
  },
  {
    id: 'for-managers',
    title: 'For managers',
    items: [
      {
        question: 'How do I get verified?',
        answer:
          'Complete your profile; we review it manually, including your business details and profile photo. You appear to buyers once verified.',
      },
      {
        question: 'Can I bring my own clients?',
        answer:
          'Yes. No manager-side Printy fee on clients you add directly. If they later use a different manager, the normal fee applies. The printer-side fee is unchanged.',
      },
      {
        question: 'What do I see on a quote?',
        answer:
          'Your total, your margin and Printy\'s fee. Quotes are capped by the fair-price cap.',
      },
      {
        question: 'Taxes and invoices?',
        answer:
          'Each party handles its own tax and invoicing. Ask us if you are unsure.',
      },
    ],
  },
  {
    id: 'for-printers',
    title: 'For printers',
    items: [
      {
        question: 'How do I add prices?',
        answer:
          'Enter your printing price and the rate card calculates the rest; adjust any column. Confirm your rate card and turnaround to be treated as ready.',
      },
      {
        question: 'What must I set?',
        answer: 'At least a standard turnaround time.',
      },
      {
        question: 'What can I see?',
        answer:
          'Specs, artwork and job code. Not buyer identity, totals or manager margin.',
      },
    ],
  },
  {
    id: 'your-data',
    title: 'Your data',
    items: [
      {
        question: 'What do you collect and who sees it?',
        answer:
          'See the Privacy Notice. Short version: shops never see who you are, buyers never see shop costs, and the public tracker shows only stages and times.',
      },
      {
        question: 'How do I ask for my data to be corrected or deleted?',
        answer: 'Email support@printy.ke.',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    items: [
      {
        question: 'How do I reach Printy?',
        answer:
          'Email support@printy.ke. Please include your job code so we can find the job quickly.',
      },
    ],
  },
]
