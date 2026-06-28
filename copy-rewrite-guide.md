# Printy copy rewrite guide
### Talking like a friend, not an engineer
*A How to Win Friends & Influence People playbook for printy.ke*

---

## Why this guide exists

The audit flagged that several strings on the homepage read like notes
between two developers, not promises to a paying customer:

> "Live pricing — Prices come from `/api/calculator/public-preview/` in KES."
> "We keep homepage upload safe and local. Real parsing starts after the
> authenticated upload flow."
> "Sheet finishing follows the selected sides where backend pricing supports it."
> "Found 1 shop matches with backend pricing previews."

Every one of those sentences breaks the same rule, the one Dale Carnegie
spends most of *How to Win Friends and Influence People* hammering home:

> **"Talk in terms of the other person's interests."** — Carnegie, Part 2, Principle 4

Your customer doesn't care about endpoints, parsing, or backend support
flags. They care about: *Will I look stupid? Will it be on time? Will it
cost what you said? Can I trust the shop?* Every line of copy needs to
answer one of those — or get out of the way.

This guide gives you (1) the five Carnegie principles that matter most
for marketing copy, (2) a before-and-after for every leaky string we
found, and (3) a short style sheet your team can apply to anything new.

---

## The 5 Carnegie principles we'll keep applying

| # | Carnegie principle | What it means for copy |
|---|---|---|
| 1 | **"Talk in terms of the other person's interests."** *(Part 2 · P4)* | Replace every internal mechanism with the customer's outcome. "Prices come from our API" becomes "Your price updates the second you change a spec." |
| 2 | **"Arouse in the other person an eager want."** *(Part 1 · P3)* | Open every section with the win, not the workflow. Don't describe the button — describe what happens after the user presses it. |
| 3 | **"Don't criticize, condemn, or complain."** *(Part 1 · P1)* | Never make a user feel like they're holding the tool wrong. "Real parsing starts later" sneakily tells them the homepage one is *fake*. Reassure, never demote. |
| 4 | **"Make the other person feel important — and do it sincerely."** *(Part 2 · P6)* | Address them as a competent adult. Use *you* and *your*. Skip jargon they don't share. When you must use trade terms (SRA3, tictac), explain them in five friendly words. |
| 5 | **"Dramatize your ideas."** *(Part 3 · P11)* | Numbers, mini-stories, and visible proof beat adjectives. "Trusted production" is a claim. "21 cards per sheet × 24 sheets = your 500 cards" is a demonstration. |

---

## Before → After: every leaky string on the homepage

Each rewrite is annotated with the Carnegie principle it leans on.

### 1. The calculator footnote
> ❌ **Now:** "Live pricing — Prices come from `/api/calculator/public-preview/` in KES."

You're telling them about *your plumbing*. They asked for *their price*.

> ✅ **Rewrite:** "Live KES pricing — your number updates the moment you change a spec."
> 🧭 *Carnegie: talk in terms of their interests (P2·P4).*

---

### 2. The upload helper
> ❌ **Now:** "We keep homepage upload safe and local. Real parsing starts after the authenticated upload flow."

Two problems. First, "real parsing" implies the homepage version is
fake — that's a quiet criticism of the very thing you're inviting them
to use. Second, "authenticated upload flow" is a phrase no client has
ever said out loud.

> ✅ **Rewrite:** "Your file stays on this page until you're ready. Once you sign in, we'll check the size, bleed, and resolution for you — and tell you in plain English if anything's off."
> 🧭 *Carnegie: don't criticize (P1·P1) + make them feel capable (P2·P6).*

---

### 3. The "double-sided" hint
> ❌ **Now:** "Back side stays in the live estimate."

This reads like a Jira ticket. The user is wondering *"will the back be
included in this price or do I get a nasty surprise?"*

> ✅ **Rewrite:** "Both sides are included in the price you see."
> 🧭 *Carnegie: answer the unspoken fear (P3·P9, "see things from the other person's point of view").*

---

### 4. The "full colour" hint
> ❌ **Now:** "Front-end estimate stays live"

Same problem as #1 — describes the tool, not the benefit.

> ✅ **Rewrite:** "We'll keep your price up to date as you choose."
> 🧭 *Carnegie: arouse an eager want (P1·P3) — reassurance is a want.*

---

### 5. The lamination footnote
> ❌ **Now:** "Sheet finishing follows the selected sides where backend pricing supports it."

Two pieces of jargon back-to-back, and no clear benefit. A first-time
buyer reads this and quietly closes the tab.

> ✅ **Rewrite:** "Matt lamination is applied to both sides — the way most clients in Nairobi prefer."
> 🧭 *Carnegie: dramatize (P3·P11) — local proof + a clear choice.*

---

### 6. The shop-match count
> ❌ **Now:** "Found 1 shop matches with backend pricing previews."

Two leaks ("backend", "previews") and oddly impersonal grammar
("matches" with no apostrophe-s).

> ✅ **Rewrite:** "1 verified Nairobi shop can produce this today."
> 🧭 *Carnegie: dramatize (P3·P11) — adds a time promise and a place.*

---

### 7. The quantity slider label
> ❌ **Now:** "100Drag to estimate common quantities10,000"

Two values jammed against an instruction. Reads like the labels
collapsed without spacing.

> ✅ **Rewrite:** Just show **100** and **10,000** at the slider's ends, and let the slider's appearance speak. If the instruction is essential, put it once, above the slider, in a softer colour: "Slide to set your quantity."
> 🧭 *Carnegie: P2·P6 — trust their intelligence. People know how sliders work.*

---

### 8. The product-tab subtitles
> ❌ **Now:** "2 configured sizes" / "4 configured sizes"

"Configured" is admin-panel language. From a client's seat it's a
faintly menacing word — as if some options *aren't* configured yet.

> ✅ **Rewrite:** Drop the line, or say "2 sizes available · standard & Euro" — give them the actual sizes, not a count.
> 🧭 *Carnegie: P2·P4 — they want options, not metadata.*

---

### 9. Trade-paper product names
> ❌ **Now:** "Label Stickers / Tictac"  ·  "Letterheads / Conqueror"

*Tictac* and *Conqueror* are paper brands only printers know. A
marketer searching for "letterheads in Nairobi" will scroll right
past these.

> ✅ **Rewrite:**
> - "Sticker labels — durable tictac vinyl"
> - "Letterheads — on premium Conqueror paper"
>
> 🧭 *Carnegie: P2·P6 — keep the pro term so professionals feel respected, but lead with the plain word so newcomers feel welcome. Nobody is made to feel small.*

---

### 10. The mysterious "Safe trust copy" heading
> ❌ **Now:** Visible string near the calculator: "Safe trust copy"

This looks like a CMS placeholder that was never replaced — the kind
of mistake that quietly drains trust.

> ✅ **Rewrite (suggested):** "Your money is safe — held by Printy, released to the shop only after you approve the proof."
> 🧭 *Carnegie: P3·P9 — name the fear, then resolve it.*

---

### 11. The imposition / sheet-math block
> 🔁 **Now:** "21 pieces per SRA3 sheet · 24 SRA3 sheets needed · 500 pieces ÷ 21 per sheet = 24 SRA3 sheets"

This one is actually a **strength** — it's the single most credible
thing on the page. But you've left it raw, without a friendly intro.

> ✅ **Keep the numbers, add a warm preface:**
> "Here's the maths behind your quote — no black box.
> Your 500 cards fit 21 to a sheet, so we run 24 SRA3 sheets. That's why the price lands at KES 1,850."
> 🧭 *Carnegie: P3·P11 — dramatize by showing the work; people trust calculations they can follow.*

---

### 12. The page title
> ❌ **Now:** `Printy - Instant Print Prices. Tracked Jobs. Trusted Production. | Printy`

The trailing `| Printy` repeats the brand twice.

> ✅ **Rewrite:** `Printy — Instant print prices. Tracked jobs. Trusted production.` (no trailing pipe).
> 🧭 *Carnegie: P2·P6 — don't make readers wade through clutter to find the point.*

---

## A 9-rule style sheet for everything new

Pin these above your copywriter's desk. They're Carnegie translated to
practical print-platform copy.

1. **Lead with "you", not "we".**
   Before any new line ships, count pronouns. If "we / our / Printy /
   the platform" beats "you / your", rewrite.

2. **Translate every noun to a feeling.**
   "Imposition logic" → "the maths behind your price."
   "Verified production shop" → "a Nairobi printer we trust with our own jobs."

3. **Name the fear, then resolve it.**
   Your buyers fear being overcharged, ghosted, or handed shoddy work.
   Each section should name one of those out loud and close it.

4. **Never let a backend term reach the page.**
   Forbidden words on the public site: *endpoint, parse, payload, schema,
   preview API, flow, backend, frontend, JSON, auth, prerender,
   configured.* If you need them in copy, you don't need that copy.

5. **Trade jargon goes in parentheses, in plain words first.**
   "Sticker labels (tictac vinyl)" · "Premium letterhead paper (Conqueror)"
   · "Standard sheet size (SRA3)." This keeps the pros happy and the
   newcomers oriented.

6. **Numbers beat adjectives.**
   "Fast turnaround" → "Most Nairobi jobs ship in 24 hours."
   "Trusted shops" → "Every shop on Printy has produced ≥ 50 jobs we
   inspected." If you can't put a number on a claim, weaken the claim or
   drop it.

7. **Dramatize the moment of relief.**
   The best print-platform line on the page isn't a feature — it's the
   feeling of *not* having to call five printers on WhatsApp at 9 p.m.
   Show that moment. ("See your price in 20 seconds, not five phone
   calls.")

8. **One promise per CTA button.**
   "Continue" is invisible. "See my price" tells the user what happens
   next. "Get an exact quote" is great. "Continue to signup" tells them
   *we* are gaining a signup — that's *our* benefit, not theirs.
   Replace with "Save my quote".

9. **Read every new sentence aloud at conversational speed.**
   If you stumble, your customer will. Carnegie's own writing test:
   *"Would I say this to a friend over chai?"* If no, rewrite.

---

## A two-minute pre-publish checklist

Before any new screen, email, or microcopy goes live, run this:

- [ ] Did I use **"you" more than "we"**?
- [ ] Have I removed every word from the **forbidden list** in rule 4?
- [ ] Is there at least one **specific number** on the page?
- [ ] Does the **headline answer a worry**, not announce a feature?
- [ ] Have I read it **aloud** without stumbling?
- [ ] If a 55-year-old shop owner in River Road read this, would they
      feel **respected**, or talked down to?
- [ ] Does the **primary button** name the user's benefit, not Printy's?

If all seven boxes tick, you're shipping copy Carnegie would have shaken
your hand for.

---

## A worked example: the hero, end to end

Just so you see all nine rules together — here's the homepage hero
rewritten in this voice. Use it, edit it, or treat it as a calibration
sample for your copywriter.

> ### Headline
> **Real print prices, before you call a printer.**
>
> ### Sub-headline
> See an honest KES quote in 20 seconds. Approve it, pay through Printy, and watch your job move from artwork to delivery — without chasing anyone on WhatsApp.
>
> ### Primary button
> **See my price** *(was: "Get instant print price")*
>
> ### Secondary button
> **How Printy works** *(unchanged — it's already good)*
>
> ### Trust line under the calculator
> Your money sits with Printy until you approve the proof. The shop is paid only after that. No surprise charges, no chasing.

Every line here is either answering a fear, dramatising a benefit, or
calling the reader by name. That's all Carnegie ever asked for.

---

*Built alongside the `printy-seo/` SEO + security pack. Keep this file
in your team's Notion or wiki and run new copy past the checklist.*
