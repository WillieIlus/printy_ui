<script setup lang="ts">
/**
 * /legal/refund-policy
 * Mirrors the dispute clauses in /legal/terms but in language a
 * non-lawyer can act on. Aligned to Kenya's Consumer Protection Act 2012.
 */

import { useSeoMeta, useHead } from '#imports'

const EFFECTIVE = '24 June 2026'
const SUPPORT   = 'support@printy.ke'
const WA        = 'https://wa.me/254700000000'

useSeoMeta({
  title: 'Refund & Reprint Policy',
  description: 'When you can get a reprint or refund on a Printy job, and how to claim one.',
  ogTitle: 'Refund & Reprint Policy · Printy',
  ogUrl: 'https://printy.ke/legal/refund-policy',
  robots: 'index,follow',
})
useHead({ link: [{ rel: 'canonical', href: 'https://printy.ke/legal/refund-policy' }] })
</script>

<template>
  <main class="bg-white text-[#101828]">
    <article class="max-w-3xl mx-auto px-6 py-16 prose prose-slate prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-[#e13515]">
      <p class="text-sm uppercase tracking-wider text-[#e13515] font-semibold">Legal</p>
      <h1>Refund &amp; Reprint Policy</h1>
      <p><strong>Effective date:</strong> {{ EFFECTIVE }}</p>

      <p>
        Printy stands behind every job. This policy explains exactly when
        we'll reprint, refund, or do nothing — so there are no surprises.
        It supplements our <a href="/legal/terms">Terms of Service</a> and
        complies with Kenya's Consumer Protection Act, 2012.
      </p>

      <h2>1. What counts as a defect</h2>
      <p>We will reprint or refund a job when any of the following is true:</p>
      <ul>
        <li>The product was printed on the <strong>wrong stock or finish</strong> versus what you approved at quote.</li>
        <li><strong>Colour deviates badly</strong> from the digital proof (and not because of normal screen-to-paper variance).</li>
        <li>Trim or fold is <strong>off by more than 2 mm</strong> on a meaningful portion of the run.</li>
        <li>The product is <strong>physically damaged</strong> (smudges, scratches, water damage) before you received it.</li>
        <li>The <strong>quantity is short</strong> by more than the industry-standard tolerance (2%).</li>
      </ul>

      <h2>2. What does NOT count as a defect</h2>
      <ul>
        <li>Typos, missing bleed, low-resolution images, or wrong colour mode in artwork you supplied.</li>
        <li>Colour shift caused by your monitor not being calibrated. Request a hard-copy proof if exact colour matters.</li>
        <li>Damage that happens after you (or your representative) take delivery.</li>
        <li>Slight paper-batch differences in white point or texture.</li>
        <li>Delays caused by courier services, weather, or public-holiday closures.</li>
      </ul>

      <h2>3. How to claim — fast track</h2>
      <ol>
        <li>Inspect the delivery within <strong>48 hours</strong> of receipt.</li>
        <li>Open your job in the Printy dashboard and click <em>Report an issue</em>, <strong>or</strong> email <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a> / <a :href="WA">WhatsApp us</a>.</li>
        <li>Attach 2–3 clear photos showing the defect, plus the job reference (e.g. <code>JB-20491</code>).</li>
        <li>Keep the printed material until we close the case — we may need to inspect it.</li>
      </ol>
      <p>We acknowledge every claim within <strong>1 working day</strong> and resolve most within <strong>5 working days</strong>.</p>

      <h2>4. Outcomes</h2>
      <table>
        <thead><tr><th>Situation</th><th>Outcome</th></tr></thead>
        <tbody>
          <tr><td>Verified production defect (full run)</td><td>Free reprint, or 100% refund if you prefer</td></tr>
          <tr><td>Verified production defect (partial run)</td><td>Reprint of affected pieces, or pro-rata refund</td></tr>
          <tr><td>Short delivery &gt; 2%</td><td>Top-up print of the missing quantity, or pro-rata refund</td></tr>
          <tr><td>Damage in transit</td><td>Reprint &amp; redeliver at no extra cost</td></tr>
          <tr><td>Defect caused by client artwork</td><td>No refund — we'll quote a discounted reprint if you fix the file</td></tr>
          <tr><td>Cancellation before printing starts</td><td>Full refund minus payment-processor fee</td></tr>
          <tr><td>Cancellation after printing starts</td><td>Refund of unspent portion only</td></tr>
        </tbody>
      </table>

      <h2>5. How refunds are paid</h2>
      <ul>
        <li><strong>M-Pesa payments</strong> are reversed to the paying number within 3 working days.</li>
        <li><strong>Card payments</strong> are reversed to the same card; the bank may take 5–10 working days to display.</li>
        <li><strong>Account credits</strong> are available immediately and can be used on your next job.</li>
      </ul>

      <h2>6. Escalation</h2>
      <p>
        Not happy with how a claim was handled? Reply to the support
        thread with the words <em>&ldquo;Escalate to management&rdquo;</em>
        and our operations lead will review within 2 working days. You
        retain every right under Kenya's Consumer Protection Act 2012 and
        may take any unresolved dispute to the Competition Authority of
        Kenya or the courts of Nairobi.
      </p>

      <h2>7. Contact</h2>
      <p>
        Email <a :href="`mailto:${SUPPORT}`">{{ SUPPORT }}</a> ·
        <a :href="WA">WhatsApp us</a>
      </p>
    </article>
  </main>
</template>
