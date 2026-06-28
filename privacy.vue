<script setup lang="ts">
/**
 * /legal/privacy
 * Plain-language Privacy Policy aligned to Kenya's Data Protection Act
 * 2019 (DPA) and the Office of the Data Protection Commissioner (ODPC).
 *
 * IMPORTANT: This is a starting point. Get it reviewed by a Kenyan
 * advocate before relying on it. Replace bracketed values [[…]]
 * before publishing.
 */

import { useSeoMeta, useHead } from '#imports'

const EFFECTIVE = '24 June 2026'
const ENTITY    = '[[Printy Technologies Ltd]]'              // legal entity
const KRA_PIN   = '[[P051XXXXXXXX]]'                         // KRA PIN
const ODPC_REG  = '[[Registration No. ODPC/XXX/XXX]]'        // ODPC registration number
const ADDRESS   = '[[Office address, Nairobi, Kenya]]'
const DPO_EMAIL = 'privacy@printy.ke'
const SUPPORT   = 'support@printy.ke'

useSeoMeta({
  title: 'Privacy Policy',
  description:
    'How Printy collects, uses, and protects your personal data under '
    + "Kenya's Data Protection Act 2019.",
  ogTitle: 'Privacy Policy · Printy',
  ogUrl: 'https://printy.ke/legal/privacy',
  robots: 'index,follow',
})
useHead({ link: [{ rel: 'canonical', href: 'https://printy.ke/legal/privacy' }] })
</script>

<template>
  <main class="bg-white text-[#101828]">
    <article class="max-w-3xl mx-auto px-6 py-16 prose prose-slate prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-[#e13515]">
      <p class="text-sm uppercase tracking-wider text-[#e13515] font-semibold">Legal</p>
      <h1>Privacy Policy</h1>
      <p><strong>Effective date:</strong> {{ EFFECTIVE }}</p>

      <p>
        This Privacy Policy explains how <strong>{{ ENTITY }}</strong>
        (&ldquo;Printy&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects,
        uses, shares, and protects personal data when you use
        <a href="https://printy.ke">printy.ke</a> and the Printy print
        operating system (the &ldquo;Service&rdquo;). It is written to comply
        with Kenya's <em>Data Protection Act, 2019</em> and the regulations
        issued by the Office of the Data Protection Commissioner (ODPC).
      </p>

      <h2>1. Who we are</h2>
      <ul>
        <li><strong>Data controller:</strong> {{ ENTITY }}</li>
        <li><strong>KRA PIN:</strong> {{ KRA_PIN }}</li>
        <li><strong>ODPC registration:</strong> {{ ODPC_REG }}</li>
        <li><strong>Address:</strong> {{ ADDRESS }}</li>
        <li><strong>Data Protection Officer:</strong> <a :href="`mailto:${DPO_EMAIL}`">{{ DPO_EMAIL }}</a></li>
      </ul>

      <h2>2. What data we collect</h2>
      <p>We collect only what we need to deliver a print job end-to-end:</p>
      <ul>
        <li><strong>Account data:</strong> name, email, phone, role (client / partner / print shop), password hash.</li>
        <li><strong>Job data:</strong> product specs, quantities, artwork files you upload, special instructions, delivery address.</li>
        <li><strong>Payment data:</strong> M-Pesa phone number, transaction reference, amount, status. We <em>do not</em> store card PANs or M-Pesa PINs.</li>
        <li><strong>Usage data:</strong> pages viewed, device type, browser, IP address, approximate location, referrer.</li>
        <li><strong>Communications:</strong> support tickets, chat transcripts, email replies, proof-approval notes.</li>
      </ul>

      <h2>3. Why we use your data (legal basis)</h2>
      <table>
        <thead><tr><th>Purpose</th><th>Lawful basis (DPA s.30)</th></tr></thead>
        <tbody>
          <tr><td>Create and manage your account</td><td>Performance of a contract</td></tr>
          <tr><td>Generate quotes, route jobs, run production</td><td>Performance of a contract</td></tr>
          <tr><td>Process M-Pesa / card payments and issue receipts</td><td>Contract &amp; legal obligation (tax)</td></tr>
          <tr><td>Send transactional emails / SMS (proof, status, delivery)</td><td>Performance of a contract</td></tr>
          <tr><td>Marketing emails about new features</td><td>Your consent — opt out anytime</td></tr>
          <tr><td>Fraud prevention &amp; service security</td><td>Legitimate interests</td></tr>
          <tr><td>Comply with KRA, AML, and court orders</td><td>Legal obligation</td></tr>
        </tbody>
      </table>

      <h2>4. Who we share data with</h2>
      <ul>
        <li><strong>Print shops</strong> assigned to your job — only the production specs, artwork, and delivery details they need to fulfil it. They never see your payment amount or other clients' data.</li>
        <li><strong>Print Managers / Partners</strong> you have chosen — they see your job and the client-facing quote, not the shop's internal rates.</li>
        <li><strong>Payment processors</strong> (Safaricom Daraja / M-Pesa, and any card processor we engage).</li>
        <li><strong>Infrastructure providers</strong> we rely on under written data-processing agreements (hosting on DigitalOcean, CDN via Cloudflare, email delivery, analytics).</li>
        <li><strong>Authorities</strong> when required by Kenyan law (KRA, court order, ODPC).</li>
      </ul>
      <p>We do <strong>not</strong> sell your personal data.</p>

      <h2>5. International transfers</h2>
      <p>
        Some of our processors host data outside Kenya (e.g. DigitalOcean
        in Frankfurt, Cloudflare globally). Where this happens we rely on
        the safeguards in DPA s.48–50, including standard contractual
        clauses and your explicit consent where applicable.
      </p>

      <h2>6. How long we keep it</h2>
      <ul>
        <li>Active account &amp; job records — for as long as your account exists.</li>
        <li>Closed jobs &amp; uploaded artwork — <strong>24 months</strong>, then deleted or anonymised.</li>
        <li>Tax-relevant records — <strong>7 years</strong>, as required by the Tax Procedures Act.</li>
        <li>Support tickets — <strong>24 months</strong>.</li>
      </ul>

      <h2>7. Your rights under the DPA</h2>
      <p>You may, at any time, request to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased (subject to legal retention);</li>
        <li>object to or restrict processing;</li>
        <li>port your data to another service;</li>
        <li>withdraw consent for marketing.</li>
      </ul>
      <p>
        Email <a :href="`mailto:${DPO_EMAIL}`">{{ DPO_EMAIL }}</a> with your
        request. We respond within <strong>7 working days</strong> and never
        charge a fee for reasonable requests. You may also lodge a complaint
        directly with the
        <a href="https://www.odpc.go.ke" target="_blank" rel="noopener">Office of the Data Protection Commissioner</a>.
      </p>

      <h2>8. Security</h2>
      <p>
        Printy uses TLS 1.2+ for all traffic, encrypts artwork at rest,
        enforces role-based access for staff, and logs administrative
        actions. No system is perfectly secure: if you believe your account
        has been compromised, email <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a>
        immediately.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use a small number of strictly necessary cookies (session,
        CSRF, Cloudflare bot management) and, with your consent, a
        privacy-friendly analytics cookie to count visits. You can manage
        consent from the cookie banner or your browser settings.
      </p>

      <h2>10. Children</h2>
      <p>
        The Service is for users aged <strong>18 and over</strong>. We do
        not knowingly collect data from children. If you believe a child
        has provided us data, email
        <a :href="`mailto:${DPO_EMAIL}`">{{ DPO_EMAIL }}</a> and we will
        delete it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We will post any material change here and email registered users at
        least 14 days before it takes effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions? Write to
        <a :href="`mailto:${DPO_EMAIL}`">{{ DPO_EMAIL }}</a> or
        <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a>.
      </p>
    </article>
  </main>
</template>
