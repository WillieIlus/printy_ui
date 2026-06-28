<script setup lang="ts">
/**
 * /legal/terms — Terms of Service for the Printy platform.
 *
 * Drafting notes:
 *  • Aligned to Kenyan law (Sale of Goods Act, Consumer Protection
 *    Act 2012, Contracts Act, Tax Procedures Act, DPA 2019).
 *  • Distinguishes Printy's role (platform + escrow-like payment
 *    intermediation) from the print shops who actually produce work.
 *  • Replace bracketed [[…]] values before publishing and have a
 *    Kenyan advocate sign off.
 */

import { useSeoMeta, useHead } from '#imports'

const EFFECTIVE = '24 June 2026'
const ENTITY    = '[[Printy Technologies Ltd]]'
const REG_NO    = '[[CPR/2025/XXXXXX]]'
const KRA_PIN   = '[[P051XXXXXXXX]]'
const ADDRESS   = '[[Office address, Nairobi, Kenya]]'
const SUPPORT   = 'support@printy.ke'

useSeoMeta({
  title: 'Terms of Service',
  description: 'The rules that govern your use of Printy, the print operating system for Kenya.',
  ogTitle: 'Terms of Service · Printy',
  ogUrl: 'https://printy.ke/legal/terms',
  robots: 'index,follow',
})
useHead({ link: [{ rel: 'canonical', href: 'https://printy.ke/legal/terms' }] })
</script>

<template>
  <main class="bg-white text-[#101828]">
    <article class="max-w-3xl mx-auto px-6 py-16 prose prose-slate prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-[#e13515]">
      <p class="text-sm uppercase tracking-wider text-[#e13515] font-semibold">Legal</p>
      <h1>Terms of Service</h1>
      <p><strong>Effective date:</strong> {{ EFFECTIVE }}</p>

      <p>
        These Terms form a binding agreement between you and
        <strong>{{ ENTITY }}</strong> (company registration {{ REG_NO }}, KRA
        PIN {{ KRA_PIN }}, of {{ ADDRESS }}; &ldquo;Printy&rdquo;,
        &ldquo;we&rdquo;) for your use of <a href="https://printy.ke">printy.ke</a>
        and any related applications (the &ldquo;Service&rdquo;). By creating
        an account or placing a job you confirm that you have read,
        understood, and agreed to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Printy is a print operating system. We let clients request quotes,
        approve artwork, pay, and track production. Production itself is
        carried out by independent print shops (&ldquo;Print Shops&rdquo;)
        and may be coordinated through a Print Manager (&ldquo;Partner&rdquo;)
        you have chosen. <strong>Printy is not the manufacturer of the
        printed goods.</strong> Printy provides the platform, the pricing
        logic, payment intermediation, and quality oversight.
      </p>

      <h2>2. Eligibility &amp; accounts</h2>
      <ul>
        <li>You must be at least 18 years old and able to enter into a contract under Kenyan law.</li>
        <li>You are responsible for the security of your password and for everything done under your account.</li>
        <li>Provide accurate information; keep it up to date.</li>
        <li>One person or organisation per account; do not share login credentials.</li>
      </ul>

      <h2>3. Quotes, orders &amp; pricing</h2>
      <ul>
        <li>All prices are in <strong>Kenya Shillings (KES)</strong> and include VAT where applicable.</li>
        <li>A homepage estimate is indicative. A binding quote is only created when you accept it inside the dashboard and pay.</li>
        <li>If artwork specifications change (size, colour, finishing, quantity), a new quote is generated.</li>
        <li>We may decline or cancel a job if the artwork breaks the law, infringes intellectual property, contains hate speech, or cannot be produced safely.</li>
      </ul>

      <h2>4. Payment, escrow &amp; receipts</h2>
      <ul>
        <li>Payment is made through Printy (M-Pesa or card) and held against the job until production milestones are met.</li>
        <li>Funds are released to the Print Shop and the Partner according to the schedule disclosed at quote time. You never see the shop's internal rates and the shop never sees the Partner's markup.</li>
        <li>We issue VAT-compliant electronic receipts (eTIMS) for every paid job.</li>
        <li>Chargebacks or reversals initiated without first contacting <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a> may result in suspension.</li>
      </ul>

      <h2>5. Artwork &amp; intellectual property</h2>
      <ul>
        <li>You confirm you own (or are licensed to use) every file you upload.</li>
        <li>You grant Printy and the assigned Print Shop a limited, royalty-free licence to reproduce your artwork solely to fulfil the job.</li>
        <li>Printy may keep a non-public archival copy for the retention period set out in the <a href="/legal/privacy">Privacy Policy</a>.</li>
        <li>Printy retains all rights in the platform itself, the pricing engine, brand, and code.</li>
      </ul>

      <h2>6. Production, proofs &amp; turnaround</h2>
      <ul>
        <li>Stated turnaround times begin once payment is confirmed <em>and</em> you have approved the digital proof.</li>
        <li>Colour reproduction on physical media will vary slightly from screen previews. Where exact colour matters, request a hard-copy proof at quote time.</li>
        <li>Delivery dates are estimates. Printy is not liable for delays caused by courier services, weather, public-holiday closures, or other events outside our reasonable control.</li>
      </ul>

      <h2>7. Acceptance, defects &amp; complaints</h2>
      <ul>
        <li>Inspect your delivery within <strong>48 hours</strong> of receipt. Report defects via the dashboard or email <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a> with photos.</li>
        <li>For verified defects we will, at our option, reprint the affected portion or refund it in line with the <a href="/legal/refund-policy">Refund &amp; Reprint Policy</a>.</li>
        <li>Minor variance in trim (±2 mm), colour, or paper batch is normal and is not a defect.</li>
      </ul>

      <h2>8. Acceptable use</h2>
      <p>You agree not to use Printy to print or transmit anything that:</p>
      <ul>
        <li>infringes the intellectual property or privacy of another person;</li>
        <li>is defamatory, obscene, or sexually exploitative of minors;</li>
        <li>incites violence or contravenes the Computer Misuse and Cybercrimes Act 2018;</li>
        <li>is counterfeit currency, fake identity documents, or election material that breaches IEBC rules.</li>
      </ul>

      <h2>9. Partners and Print Shops</h2>
      <p>
        Partners and Print Shops accept additional terms in a separate
        agreement covering payouts, quality standards, and intake SLAs.
        Those terms govern their relationship with Printy but do not
        replace these Terms for clients.
      </p>

      <h2>10. Liability</h2>
      <ul>
        <li>Printy's total liability for any claim relating to a job is capped at the amount you actually paid for that job.</li>
        <li>We are not liable for indirect or consequential loss (lost profits, lost goodwill, lost opportunity).</li>
        <li>Nothing in these Terms limits liability for fraud, gross negligence, or anything that cannot lawfully be limited under Kenyan law.</li>
      </ul>

      <h2>11. Suspension &amp; termination</h2>
      <p>
        We may suspend or close an account that breaks these Terms, abuses
        the Service, or is used for fraud. You may close your account at
        any time from the dashboard; doing so does not cancel jobs already
        in production.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms. Material changes will be emailed to
        registered users at least 14 days before they take effect.
        Continued use after the effective date means you accept the new
        Terms.
      </p>

      <h2>13. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of Kenya. Before going to
        court, both parties agree to attempt resolution by email with
        <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a> for at least 30
        days. If unresolved, the courts of Nairobi have exclusive
        jurisdiction, save that consumers retain any non-waivable rights
        under the Consumer Protection Act 2012.
      </p>

      <h2>14. Contact</h2>
      <p>
        {{ ENTITY }}, {{ ADDRESS }}.<br>
        Email: <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a>
      </p>
    </article>
  </main>
</template>
