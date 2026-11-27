/**
 * Printy live end-to-end suite — one uninterrupted run from an empty database.
 *
 * This is the real-browser proof for the full marketplace journey:
 *
 *   A. Two printers sign up, verify email, price their rate cards and go live.
 *   B. Two managers sign up, verify email, are verified by the operator in
 *      Django admin, and see both real production shops.
 *   C. A signed-out buyer prices a real job, clicks Get Manager, picks a real
 *      verified manager, signs up, verifies email, signs in and lands on the
 *      ONE request created for that exact job.
 *   D. The buyer uploads artwork. The manager prepares a quote, sends it,
 *      changes the price after sending, and sends the revision.
 *   E. The buyer acknowledges the revision, accepts, pays through the stub STK
 *      push and the REAL Daraja callback handler. A managed job enters escrow.
 *   F. The manager dispatches to printer 1. Printer 1 rejects. The manager
 *      reassigns to printer 2. Printer 2 runs every production stage. The
 *      buyer sees the stages, job code and times, then confirms delivery. The
 *      operator flags a late SLA hold, clears it and releases payouts.
 *   G. Negative paths: manager declines and the buyer rematches to another
 *      manager; buyer declines an offer and the manager revises it; a
 *      manager-created phone-only client gets the fee waiver, claims the
 *      account, pays and tracks the job signed out.
 *   H. Screen checks: breadcrumbs, workspace navigation, non-buyer homepage
 *      redirects, managers/printers cannot request quotes, and privacy holds.
 *
 * Run headless (default) for CI-style runs, or headed so the journey can be
 * watched:
 *
 *   node e2e/live-suite.mjs
 *   LIVE_HEADED=1 node e2e/live-suite.mjs
 *
 * Requires the API on 127.0.0.1:8000 (MPESA_FORCE_STUB=1, file email backend)
 * and Nuxt on localhost:3000.
 */
import { chromium } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const base = 'http://localhost:3000'
const apiOrigin = 'http://127.0.0.1:8000'
const apiDir = 'C:/Users/Admin/Projects/printy/printy_api'
const emailDir = 'C:/Users/Admin/AppData/Local/Temp/opencode/printy_e2e/emails'
const shotDir = 'test-results/live-suite'
const logFile = path.join(shotDir, 'run.log')
const password = 'PrintyTest123!'
const stamp = Date.now()

const users = {
  printer1: `press-a-${stamp}@printy.test`,
  printer2: `press-b-${stamp}@printy.test`,
  manager1: `manager-a-${stamp}@printy.test`,
  manager2: `manager-b-${stamp}@printy.test`,
  buyer: `buyer-${stamp}@printy.test`,
  phoneClient: {
    name: 'Asha Mwangi',
    phone: '0712 999 888',
    normalized: '254712999888',
  },
}
const shops = { first: 'Mwangaza Press', second: 'Kifaru Printworks' }
const managers = { first: 'Sanaa Print Desk', second: 'Tembo Studio Desk' }

fs.mkdirSync(shotDir, { recursive: true })
fs.writeFileSync(logFile, '')
fs.mkdirSync(emailDir, { recursive: true })

const breaks = []
let stepNo = 0

function log(message) {
  const line = String(message)
  console.log(line)
  fs.appendFileSync(logFile, `${line}\n`)
}

function dialogScreenshot(page, name) {
  if (!page) return Promise.resolve()
  return page.screenshot({ path: path.join(shotDir, name), fullPage: true }).catch(() => {})
}

async function step(actor, label, fn) {
  stepNo += 1
  const n = String(stepNo).padStart(3, '0')
  const page = actor?.page ?? null
  log(`\nSTEP ${n} · ${label}`)
  try {
    const result = await fn()
    await dialogScreenshot(page, `${n}.png`)
    log(`  ok · ${page?.url?.() ?? ''}`)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error)
    breaks.push({ step: n, label, message })
    await dialogScreenshot(page, `${n}-FAIL.png`)
    log(`  FAIL · ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

function watch(page, label) {
  // Polling workspaces (M-Pesa, printer setup, workspace badges) never reach a
  // stable network-idle state. Navigate on DOMContentLoaded, then give the
  // hydrated page a bounded chance to settle before the step drives it.
  const goto = page.goto.bind(page)
  page.goto = async (url, options = {}) => {
    const response = await goto(url, { ...options, waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {})
    return response
  }
  const reload = page.reload.bind(page)
  page.reload = async (options = {}) => {
    const response = await reload({ ...options, waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {})
    return response
  }
  page.on('console', (message) => {
    if (message.type() === 'error') {
      log(`  [${label} console] ${message.text().slice(0, 300)}`)
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 500) {
      log(`  [${label} api ${response.status()}] ${response.url()}`)
    }
  })
}

function latestMailFor(address) {
  const files = fs.readdirSync(emailDir).filter((file) => file.endsWith('.log')).sort().reverse()
  for (const file of files) {
    const raw = fs.readFileSync(path.join(emailDir, file), 'utf8')
    if (raw.includes(address)) return raw
  }
  return ''
}

function confirmUrl(address) {
  const match = latestMailFor(address).match(/http:\/\/localhost:3000\/auth\/confirm-email\?[^\s]+/)
  return match ? match[0].replace(/=+$/, '') : ''
}

async function waitForConfirmUrl(address, timeout = 30000) {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    const url = confirmUrl(address)
    if (url) return url
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  throw new Error(`No confirmation email for ${address}`)
}

function moneyValue(text) {
  const numeric = Number(String(text).replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

async function waitForDifferent(locator, previous, timeout = 30000) {
  const started = Date.now()
  const target = previous.trim()
  let last = ''
  while (Date.now() - started < timeout) {
    last = (await locator.innerText().catch(() => '')).trim()
    if (last && last !== target) return last
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  throw new Error(`Text never changed from ${JSON.stringify(target)}; last ${JSON.stringify(last)}`)
}

async function waitForPattern(locator, pattern, timeout = 30000) {
  const started = Date.now()
  let last = ''
  while (Date.now() - started < timeout) {
    last = (await locator.innerText().catch(() => '')).trim()
    if (pattern.test(last)) return last
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  throw new Error(`Timed out waiting for ${pattern}; last ${JSON.stringify(last)}`)
}

async function signUp(page, mode, { name, org, email, phone, city, cta }) {
  await page.goto(`${base}/sign-up?mode=${mode}`, { waitUntil: 'domcontentloaded' })
  await page.getByPlaceholder('Ava Lindqvist').fill(name)
  await page.getByPlaceholder(org.placeholder).fill(org.value)
  await page.getByPlaceholder('you@company.co.ke').fill(email)
  await page.getByPlaceholder(/\+254/).fill(phone)
  await page.getByPlaceholder('Nairobi').fill(city)
  await page.getByPlaceholder('8+ characters').fill(password)
  await page.getByRole('button', { name: new RegExp(cta, 'i') }).click()
  await page.getByText(/check your email|verify your email|email/i).first().waitFor({ timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1600)
}

async function confirmEmail(page, email) {
  const link = await waitForConfirmUrl(email)
  await page.goto(link, { waitUntil: 'domcontentloaded' })
  await page.getByText(/Email verified/i).first().waitFor({ timeout: 20000 })
}

async function signIn(page, email) {
  await page.goto(`${base}/sign-in`, { waitUntil: 'domcontentloaded' })
  await page.getByPlaceholder('you@company.co.ke').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL(/\/app\//, { timeout: 30000 })
  await page.waitForTimeout(800)
}

async function browserToken(page) {
  return page.evaluate(() => {
    const row = document.cookie.split('; ').find((entry) => entry.startsWith('printy_access_token='))
    return row ? decodeURIComponent(row.split('=').slice(1).join('=')) : ''
  })
}

async function apiGet(page, pathname) {
  return page.evaluate(async ({ apiOrigin, pathname }) => {
    const row = document.cookie.split('; ').find((entry) => entry.startsWith('printy_access_token='))
    const token = row ? decodeURIComponent(row.split('=').slice(1).join('=')) : ''
    const response = await fetch(`${apiOrigin}${pathname}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return { status: response.status, body: await response.json().catch(() => null) }
  }, { apiOrigin, pathname })
}

/**
 * The request page shows the human status ("SENT", "QUOTED") in the header
 * badge, so scraping that element gets a status, not the QR- reference. Read
 * the real reference from the detail API instead.
 */
async function readRequestReference(page, requestId) {
  const detail = await apiGet(page, `/api/dashboard/client/quotes/${requestId}/`)
  if (detail.status !== 200) throw new Error(`Request detail failed: ${detail.status}`)
  const row = detail.body?.quote ?? detail.body ?? {}
  const reference = String(row.request_reference || row.code || '').trim()
  if (!/^QR-/.test(reference)) {
    throw new Error(`No real request reference for request ${requestId} (got "${reference}")`)
  }
  return reference
}

async function acceptAndPay(page, { expectedAmount = null, phone }) {
  const offers = page.locator('#offers')
  await offers.waitFor({ timeout: 20000 })
  // The panel mounts before its quote list finishes loading; wait for the real
  // offer before deciding whether anything needs expanding.
  await offers.locator('article').first().waitFor({ timeout: 30000 })

  // Expand every collapsed offer so the newest revision and its Accept button
  // are in the DOM. Only the header toggle is a direct child of the article.
  const toggles = offers.locator('article > button')
  const count = await toggles.count()
  for (let index = 0; index < count; index += 1) {
    const expanded = await toggles.nth(index).getAttribute('aria-expanded')
    if (expanded !== 'true') await toggles.nth(index).click().catch(() => {})
  }
  await page.waitForTimeout(900)

  // A price revision needs the buyer's explicit acknowledgement first.
  const acknowledge = offers.getByRole('button', { name: /I acknowledge this price/i }).first()
  if (await acknowledge.count()) {
    await acknowledge.click()
    await acknowledge.waitFor({ state: 'detached', timeout: 20000 }).catch(() => {})
  }

  const accept = offers.getByRole('button', { name: /^Accept$/ }).last()
  await accept.waitFor({ timeout: 20000 })
  if (await accept.isDisabled()) {
    throw new Error('Accept is still disabled after acknowledgement')
  }
  await accept.click()
  await page.getByText('Lipa na M-Pesa').waitFor({ timeout: 20000 })

  const amountText = await page.getByText('Amount to pay').locator('..').innerText()
  const amount = moneyValue(amountText)
  if (expectedAmount !== null && amount !== expectedAmount) {
    throw new Error(`Checkout amount ${amountText} does not match ${expectedAmount}`)
  }
  await page.getByPlaceholder('0712 345 678').fill(phone)
  const [response] = await Promise.all([
    page.waitForResponse(
      (candidate) => candidate.url().includes('/payments/stk-push/') && candidate.request().method() === 'POST',
      { timeout: 30000 },
    ),
    page.getByRole('button', { name: /Send M-Pesa request/i }).click(),
  ])
  if (response.status() !== 201) {
    throw new Error(`STK push failed: ${response.status()} ${await response.text().catch(() => '')}`)
  }
  const checkout = await response.json()
  if (!String(checkout.checkout_request_id || '').startsWith('TEST-CR-')) {
    throw new Error(`Expected a stub checkout id, got ${checkout.checkout_request_id}`)
  }
  await page.getByText('Check your phone').waitFor({ timeout: 20000 })

  const receipt = `Q${Date.now().toString().slice(-9)}`
  const callback = {
    Body: {
      stkCallback: {
        MerchantRequestID: checkout.merchant_request_id,
        CheckoutRequestID: checkout.checkout_request_id,
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: amount },
            { Name: 'MpesaReceiptNumber', Value: receipt },
            { Name: 'TransactionDate', Value: 20261116120000 },
            { Name: 'PhoneNumber', Value: Number(phone.replace(/\D/g, '')) },
          ],
        },
      },
    },
  }
  const callbackResponse = await fetch(`${apiOrigin}/api/payments/mpesa/callback/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(callback),
  })
  if (!callbackResponse.ok) {
    throw new Error(`Callback failed: ${callbackResponse.status()}`)
  }
  await page.getByText('Payment confirmed').first().waitFor({ timeout: 60000 })
  await page.mouse.click(8, 8)
  return { amount, checkout, receipt }
}

async function openBuyerRequestJob(page, requestId) {
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('[data-test="buyer-request-detail"]').waitFor({ timeout: 20000 })
  const detail = await apiGet(page, `/api/client/requests/${requestId}/`)
  if (detail.status !== 200) throw new Error(`Request detail failed: ${detail.status}`)
  const job = detail.body?.managed_job
  if (!job?.id) throw new Error('No managed job created after payment')
  if (job.payment_status !== 'confirmed') {
    throw new Error(`Job payment not confirmed: ${job.payment_status}`)
  }
  return job
}

async function revealAndChooseManager(page, managerName) {
  const calc = page.locator('[data-design-calculator-minimal]')
  await calc.waitFor({ timeout: 20000 })
  const getManager = calc.locator('[data-test="get-manager"]')
  await getManager.waitFor({ timeout: 20000 })
  await getManager.click()
  const panel = page.locator('[data-calculator-managers]')
  await panel.waitFor({ timeout: 20000 })
  await panel.getByText(managerName).first().waitFor({ timeout: 20000 })
  const card = panel.locator('article').filter({ hasText: managerName }).first()
  if (await card.count()) {
    await card.locator('[data-test="choose-manager"]').first().click()
    return
  }
  await panel.locator('[data-test="choose-manager"]').first().click()
}

async function createRequestFromBuyerDashboard(page, managerName, { rematch = false } = {}) {
  if (rematch) {
    await page.getByText('Same specs as').first().waitFor({ timeout: 20000 })
    await page.locator('[data-test="rematch-note"]').waitFor({ timeout: 20000 })
  } else {
    await page.goto(`${base}/app/buyer`, { waitUntil: 'domcontentloaded' })
    const newQuote = page.getByRole('button', { name: /^New quote$/ }).first()
    await newQuote.waitFor({ timeout: 20000 })
    await newQuote.click()
  }
  const calc = page.locator('[data-design-calculator-minimal]')
  await calc.waitFor({ timeout: 20000 })
  if (!(await page.locator('[data-test="rematch-note"]').count())) {
    const moreOptions = calc.getByRole('button', { name: /^More options$/ }).first()
    if (await moreOptions.count()) await moreOptions.click()
    await calc.getByRole('button', { name: 'Executive', exact: true }).click()
    await page.waitForTimeout(1200)
  }
  await revealAndChooseManager(page, managerName)
  await page.waitForURL(/\/app\/buyer\/(?:orders|requests)\/\d+/, { timeout: 30000 })
  await page.locator('[data-test="buyer-request-detail"]').waitFor({ timeout: 20000 })
  await page.waitForTimeout(900)
  const requestId = Number(page.url().match(/(?:orders|requests)\/(\d+)/)?.[1] ?? 0)
  if (!requestId) throw new Error(`No request id in ${page.url()}`)
  const reference = await readRequestReference(page, requestId)
  return { requestId, reference }
}

async function selectShop(select, name) {
  const option = select.locator('option').filter({ hasText: name }).first()
  await option.waitFor({ state: 'attached', timeout: 20000 })
  const value = await option.getAttribute('value')
  if (!value) throw new Error(`No selectable value for ${name}`)
  await select.selectOption(value)
}

async function openManagerQuote(page, reference) {
  await page.goto(`${base}/app/manager/quotes`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Quote workload').first().waitFor({ timeout: 20000 })
  const row = page.locator('aside button').filter({ hasText: reference }).first()
  await row.waitFor({ timeout: 20000 })
  await row.click()
  await page.getByText('Production options').first().waitFor({ timeout: 20000 })
  return row
}

async function quoteWithShop(page, shopName, { markup = null } = {}) {
  await page.getByRole('button', { name: /Find printer shops/i }).click()
  await page.getByText(shopName).first().waitFor({ timeout: 30000 })
  const option = page.locator('[id^="shop-option-"]').filter({ hasText: shopName }).first()
  await option.waitFor({ timeout: 20000 })
  await option.click()
  if (markup !== null) {
    const input = page.locator('[data-test="margin-markup-input"]')
    await input.waitFor({ timeout: 20000 })
    await input.fill(String(markup))
  }
  await page.locator('[data-test="margin-calculate"]').click()
  await waitForPattern(page.locator('[data-test="margin-value-client_total"]'), /KES\s[\d,]+\.\d{2}/)
  return (await page.locator('[data-test="margin-value-client_total"]').innerText()).trim()
}

async function prepareAndSend(page) {
  await page.getByRole('button', { name: /Prepare quote/i }).click()
  await page.getByText(/Quote prepared/i).first().waitFor({ timeout: 30000 })
  await page.getByRole('button', { name: /Send to client/i }).click()
  await page.locator('text=/Quote sent to the existing client|Sent — the client record|Already sent/').first().waitFor({ timeout: 30000 })
}

async function waitForLabelChange(card, previous, timeout = 30000) {
  const button = card.locator('.job-action')
  const started = Date.now()
  let last = previous
  while (Date.now() - started < timeout) {
    last = (await button.innerText().catch(() => '')).trim()
    // The card shows the optimistic action label with an ellipsis while the
    // advance request is in flight. That is not the next stage. Wait for the
    // settled label so a fast double-read cannot abort the stage loop.
    const loading = last.endsWith('…') || last.endsWith('...')
    if (last && !loading && last !== previous) return last
    await new Promise((resolve) => setTimeout(resolve, 350))
  }
  throw new Error(`Printer action never changed from ${JSON.stringify(previous)}; last ${JSON.stringify(last)}`)
}

async function runAllPrinterStages(page, reference) {
  await page.goto(`${base}/app/printer`, { waitUntil: 'domcontentloaded' })
  const card = page.locator(`[data-test="printer-job-card"][data-quote-reference="${reference}"]`).first()
  await card.waitFor({ timeout: 30000 })
  const seen = []
  for (let index = 0; index < 16; index += 1) {
    const button = card.locator('.job-action')
    const label = (await button.innerText().catch(() => '')).trim()
    if (!label || label === 'All steps complete' || !(await button.isEnabled().catch(() => false))) {
      break
    }
    seen.push(label)
    await button.click()
    await waitForLabelChange(card, label)
    await page.waitForTimeout(700)
  }
  const finalLabel = (await card.locator('.job-action').innerText().catch(() => '')).trim()
  if (finalLabel !== 'All steps complete') {
    throw new Error(`Printer stages did not complete; seen ${seen.join(' → ')}; final ${JSON.stringify(finalLabel)}`)
  }
  return seen
}

async function adminLogin(page) {
  await page.goto(`${apiOrigin}/admin/login/?next=/admin/`, { waitUntil: 'domcontentloaded' })
  await page.locator('#id_username').fill('ops@printy.test')
  await page.locator('#id_password').fill('PrintyOps123!')
  await page.getByRole('button', { name: /Log in/i }).click()
  await page.waitForURL(/\/admin\//, { timeout: 30000 })
}

async function verifyManager(page, email, publicName, speciality) {
  await page.goto(`${apiOrigin}/admin/accounts/userprofile/?q=${encodeURIComponent(email)}`, { waitUntil: 'domcontentloaded' })
  const rows = page.locator('#result_list tbody tr')
  if ((await rows.count()) === 0) throw new Error(`No profile found for ${email}`)
  await rows.first().locator('a').first().click()
  await page.waitForLoadState('networkidle')
  await page.locator('#id_public_display_name').fill(publicName)
  await page.locator('#id_manager_speciality').fill(speciality)
  await page.locator('#id_manager_verified').check()
  await page.locator('#id_manager_public_opt_in').check()
  await page.locator('#id_accepts_new_jobs').check()
  await page.getByRole('button', { name: /Save/i }).first().click()
  await page.waitForLoadState('networkidle')
}

async function runAdminAction(page, reference, action) {
  await page.goto(`${apiOrigin}/admin/jobs/managedjob/?q=${encodeURIComponent(reference)}`, { waitUntil: 'domcontentloaded' })
  const row = page.locator('#result_list tbody tr').filter({ hasText: reference }).first()
  await row.waitFor({ timeout: 20000 })
  await row.locator('input.action-select').check()
  await page.locator('select[name="action"]').selectOption(action)
  await page.locator('button[name="index"]').click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(600)
  return (await page.locator('.messagelist').innerText().catch(() => '')).trim()
}

async function onboardPrinter(page, { person, shopName, email, phone, city, area, single, double }) {
  await page.goto(`${base}/sign-up?mode=printer`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Create printer account' }).waitFor()
  await signUp(page, 'printer', {
    name: person,
    org: { placeholder: 'North Press Co.', value: shopName },
    email,
    phone,
    city,
    cta: 'Create printer account',
  })
  await confirmEmail(page, email)
  await signIn(page, email)
  await page.goto(`${base}/app/printer/rates`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Shop profile', { exact: true }).first().waitFor({ timeout: 20000 })
  await page.locator('input[data-field="shop_name"]').fill(shopName)
  await page.locator('input[data-field="whatsapp_number"]').fill(phone)
  await page.locator('input[data-field="location_area"]').fill(area)
  await page.locator('input[data-field="standard_turnaround_hours"]').fill('48')
  await page.locator('input[data-field="master_single_print"]').fill(String(single))
  await page.locator('input[data-field="master_double_print"]').fill(String(double))
  await page.waitForTimeout(600)
  for (const key of [
    '350gsm_matte_art_card',
    'matte_lamination_single',
    'cutting',
    'round_corner_piece',
    'stitching_booklet',
    'perfect_binding',
  ]) {
    const row = page.locator(`[data-row-id="${key}"]`)
    await row.scrollIntoViewIfNeeded()
    const toggles = row.locator('button[aria-pressed]')
    if ((await toggles.count()) === 0) throw new Error(`No active toggle for ${key}`)
    const last = toggles.last()
    if ((await last.getAttribute('aria-pressed')) !== 'true') {
      await last.click()
      await page.waitForTimeout(200)
    }
  }
  await page.getByRole('button', { name: /Save draft/i }).click()
  await page.getByText(/Rate card saved as a draft/i).waitFor({ timeout: 20000 })
  const confirm = page.getByRole('button', { name: /^Confirm and go live$/i }).first()
  await confirm.waitFor({ timeout: 10000 })
  if (await confirm.isDisabled()) {
    const body = await page.locator('body').innerText()
    throw new Error(`Confirm is disabled for ${shopName}:\n${body.slice(0, 1400)}`)
  }
  await confirm.click()
  await page.getByText(/You are live to managers/i).first().waitFor({ timeout: 20000 })
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function waitForServers() {
  const started = Date.now()
  while (Date.now() - started < 60000) {
    try {
      const api = await fetch(`${apiOrigin}/api/catalog/calculator-config/`)
      const ui = await fetch(`${base}/`)
      if (api.status < 500 && ui.status < 500) return
    } catch {
      /* retry */
    }
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }
  throw new Error('API/UI servers did not answer within 60s')
}

/* ────────────────────────────── 0. clean start ───────────────────────────── */

log('PRINTY LIVE SUITE')
log(`started ${new Date().toISOString()}`)
log(`users: ${JSON.stringify({ ...users, phoneClient: users.phoneClient.name })}`)

await step(null, 'Reset the database to a clean, real-data-only state', async () => {
  const python = path.join(apiDir, 'env', 'Scripts', 'python.exe')
  const result = spawnSync(python, ['manage.py', 'reset_e2e', '--yes'], {
    cwd: apiDir,
    encoding: 'utf8',
    timeout: 180000,
  })
  const output = `${result.stdout || ''}\n${result.stderr || ''}`
  if (!output.includes('E2E database ready')) {
    throw new Error(`reset_e2e failed:\n${output.slice(0, 2000)}`)
  }
  const parsed = output.match(/E2E database ready:.*$/m)?.[0] ?? 'E2E database ready'
  log(`  ${parsed}`)
})

await step(null, 'Clear the file email outbox', async () => {
  for (const file of fs.readdirSync(emailDir)) {
    fs.rmSync(path.join(emailDir, file), { force: true })
  }
})

await step(null, 'Wait for the real API and UI servers', async () => {
  await waitForServers()
})

/* ─────────────────────────── browser + role contexts ─────────────────────── */

const headed = process.env.LIVE_HEADED === '1'
const browser = await chromium.launch({ headless: !headed, slowMo: headed ? 85 : 0 })
const viewport = { width: 1440, height: 1000 }

const adminContext = await browser.newContext({ viewport })
const adminPage = await adminContext.newPage()
watch(adminPage, 'operator')
const operator = { page: adminPage }

const printer1Context = await browser.newContext({ viewport })
const printer1Page = await printer1Context.newPage()
watch(printer1Page, 'printer-1')
const printer1 = { page: printer1Page }

const printer2Context = await browser.newContext({ viewport })
const printer2Page = await printer2Context.newPage()
watch(printer2Page, 'printer-2')
const printer2 = { page: printer2Page }

const manager1Context = await browser.newContext({ viewport })
const manager1Page = await manager1Context.newPage()
watch(manager1Page, 'manager-1')
const manager1 = { page: manager1Page }

const manager2Context = await browser.newContext({ viewport })
const manager2Page = await manager2Context.newPage()
watch(manager2Page, 'manager-2')
const manager2 = { page: manager2Page }

const buyerContext = await browser.newContext({ viewport })
const buyerPage = await buyerContext.newPage()
watch(buyerPage, 'buyer')
const buyer = { page: buyerPage }

await step(operator, 'Operator signs in to Django admin', async () => {
  await adminLogin(adminPage)
  assert(adminPage.url().includes('/admin/'), 'Operator did not reach Django admin')
})

/* ─────────────── A. real printer supply through the real UI ──────────────── */

await step(printer1, `Printer 1 signs up as ${shops.first}`, async () => {
  await onboardPrinter(printer1Page, {
    person: 'Mwangaza Owner',
    shopName: shops.first,
    email: users.printer1,
    phone: '0712 345 678',
    city: 'Nairobi',
    area: 'Nairobi CBD',
    single: 15,
    double: 25,
  })
  log(`  shop live: ${shops.first}`)
})

await step(printer2, `Printer 2 signs up as ${shops.second}`, async () => {
  await onboardPrinter(printer2Page, {
    person: 'Kifaru Owner',
    shopName: shops.second,
    email: users.printer2,
    phone: '0713 456 789',
    city: 'Nairobi',
    area: 'Industrial Area',
    single: 17,
    double: 29,
  })
  log(`  shop live: ${shops.second}`)
})

/* ─────────────── B. real manager supply verified by the operator ─────────── */

await step(manager1, `Manager 1 signs up as ${managers.first}`, async () => {
  await manager1Page.goto(`${base}/sign-up?mode=manager`, { waitUntil: 'domcontentloaded' })
  await manager1Page.getByRole('heading', { name: 'Create manager account' }).waitFor()
  await signUp(manager1Page, 'manager', {
    name: 'Amina Manager',
    org: { placeholder: 'Fastlane Print Desk', value: managers.first },
    email: users.manager1,
    phone: '0722 333 444',
    city: 'Nairobi',
    cta: 'Create manager account',
  })
  await confirmEmail(manager1Page, users.manager1)
})

await step(operator, `Operator verifies ${managers.first} in Django admin`, async () => {
  await verifyManager(adminPage, users.manager1, managers.first, 'Business cards and booklets in Nairobi')
})

await step(manager1, 'Manager 1 signs in and sees both real production shops', async () => {
  await signIn(manager1Page, users.manager1)
  await manager1Page.waitForTimeout(1000)
  const body = await manager1Page.locator('body').innerText()
  if (body.includes('Get a quote')) throw new Error('Manager can see the buyer quote CTA')
  await manager1Page.goto(`${base}/app/manager/clients`, { waitUntil: 'domcontentloaded' })
  await manager1Page.getByRole('button', { name: /Production shops/i }).click()
  await manager1Page.getByText(shops.first).first().waitFor({ timeout: 20000 })
  await manager1Page.getByText(shops.second).first().waitFor({ timeout: 20000 })
  log(`  visible: ${shops.first} + ${shops.second}`)
})

await step(manager2, `Manager 2 signs up as ${managers.second}`, async () => {
  await manager2Page.goto(`${base}/sign-up?mode=manager`, { waitUntil: 'domcontentloaded' })
  await manager2Page.getByRole('heading', { name: 'Create manager account' }).waitFor()
  await signUp(manager2Page, 'manager', {
    name: 'Tembo Manager',
    org: { placeholder: 'Fastlane Print Desk', value: managers.second },
    email: users.manager2,
    phone: '0723 444 555',
    city: 'Nairobi',
    cta: 'Create manager account',
  })
  await confirmEmail(manager2Page, users.manager2)
})

await step(operator, `Operator verifies ${managers.second} in Django admin`, async () => {
  await verifyManager(adminPage, users.manager2, managers.second, 'Flyers, posters and event print in Nairobi')
})

await step(manager2, 'Manager 2 signs in with a real role-scoped dashboard', async () => {
  await signIn(manager2Page, users.manager2)
  await manager2Page.waitForTimeout(900)
  const body = await manager2Page.locator('body').innerText()
  if (body.includes('Get a quote')) throw new Error('Manager 2 can see the buyer quote CTA')
  await manager2Page.goto(`${base}/app/manager/clients`, { waitUntil: 'domcontentloaded' })
  await manager2Page.getByRole('button', { name: /Production shops/i }).click()
  await manager2Page.getByText(shops.first).first().waitFor({ timeout: 20000 })
  await manager2Page.getByText(shops.second).first().waitFor({ timeout: 20000 })
})

/* ───────────── C. signed-out buyer -> real manager -> one request ────────── */

let mainRequest = null

await step(buyer, 'Signed-out buyer opens the homepage calculator', async () => {
  await buyerPage.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  const calc = buyerPage.locator('[data-design-calculator-minimal]')
  await calc.waitFor({ timeout: 20000 })
  assert(await calc.locator('[data-test="get-manager"]').count(), 'Get Manager CTA missing')
  const moreOptions = calc.getByRole('button', { name: /^More options$/ }).first()
  if (await moreOptions.count()) await moreOptions.click()
  await calc.getByRole('button', { name: 'Executive', exact: true }).click()
  await buyerPage.waitForTimeout(1300)
})

await step(buyer, `Buyer sees real verified managers and chooses ${managers.first}`, async () => {
  const panel = buyerPage.locator('[data-calculator-managers]')
  await buyerPage.locator('[data-design-calculator-minimal] [data-test="get-manager"]').click()
  await panel.waitFor({ timeout: 20000 })
  await panel.getByText(managers.first).first().waitFor({ timeout: 20000 })
  const text = await panel.innerText()
  assert(/verified/i.test(text), 'Manager is not marked verified')
  const card = panel.locator('article').filter({ hasText: managers.first }).first()
  await card.locator('[data-test="choose-manager"]').first().click()
  await buyerPage.waitForURL(/\/sign-up\?mode=buyer/, { timeout: 20000 })
})

await step(buyer, 'Buyer signs up and the guest draft survives the account step', async () => {
  const pending = await buyerPage.evaluate(() => localStorage.getItem('printy_pending_intake'))
  assert(pending, 'Pending intake was not saved before sign-up')
  const parsed = JSON.parse(pending)
  assert(parsed.draftId, 'Pending intake has no draft id')
  await signUp(buyerPage, 'buyer', {
    name: 'Wanjiku Buyer',
    org: { placeholder: 'Studio North', value: 'Wanjiku Studio' },
    email: users.buyer,
    phone: '0733 555 666',
    city: 'Nairobi',
    cta: 'Create buyer account',
  })
})

await step(buyer, 'Buyer verifies the real email', async () => {
  await confirmEmail(buyerPage, users.buyer)
})

await step(buyer, 'Buyer signs in and opens the ONE request created for that job', async () => {
  await signIn(buyerPage, users.buyer)
  await buyerPage.waitForURL(/\/app\/buyer\/(?:orders|requests)\/\d+/, { timeout: 30000 })
  await buyerPage.locator('[data-test="buyer-request-detail"]').waitFor({ timeout: 20000 })
  mainRequest = {
    requestId: Number(buyerPage.url().match(/(?:orders|requests)\/(\d+)/)?.[1] ?? 0),
    reference: '',
  }
  assert(mainRequest.requestId > 0, 'No request id on the opened page')
  mainRequest.reference = await readRequestReference(buyerPage, mainRequest.requestId)
  const body = await buyerPage.locator('body').innerText()
  for (const needle of [managers.first, 'Business Cards', '90×55 mm']) {
    assert(body.includes(needle), `Request detail missing "${needle}"`)
  }
  assert(/you chose your manager/i.test(body), 'Request detail missing the manager-selection line')
  const listing = await apiGet(buyerPage, '/api/dashboard/client/quotes/')
  const rows = Array.isArray(listing.body) ? listing.body : listing.body?.results ?? []
  assert(listing.status === 200, `Quote list failed: ${listing.status}`)
  assert(rows.length === 1, `Expected exactly 1 request, found ${rows.length}`)
  log(`  request: ${mainRequest.requestId} ${mainRequest.reference}`)
})

await step(buyer, 'Buyer uploads real artwork to this request', async () => {
  const section = buyerPage.locator('#artwork')
  await section.waitFor({ timeout: 15000 })
  await section.locator('[data-test="artwork-input"]').setInputFiles({
    name: 'business-card.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 90 55]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n'),
  })
  await section.locator('[data-test="artwork-upload"]').click()
  await section.getByText('Artwork received').first().waitFor({ timeout: 20000 })
  await section.getByText('business-card.pdf').first().waitFor({ timeout: 15000 })
})

/* ─────────────── D. manager prepares, sends, then revises the quote ──────── */

let quoteTotals = { first: 0, revised: 0 }

await step(manager1, 'Manager 1 opens the exact request and sees the artwork', async () => {
  await openManagerQuote(manager1Page, mainRequest.reference)
  const body = await manager1Page.locator('body').innerText()
  assert(body.includes('Wanjiku Buyer'), 'Client name missing from the manager quote view')
  const artwork = manager1Page.locator('[data-test="manager-request-artwork"]')
  await artwork.waitFor({ timeout: 20000 })
  const artworkText = await artwork.innerText()
  assert(artworkText.includes('business-card.pdf'), 'Uploaded artwork filename missing')
  assert(/file received/i.test(artworkText), 'Artwork state is not uploaded')
  const prefill = manager1Page.locator('[data-test="manager-prefill"]')
  await prefill.waitFor({ timeout: 20000 })
  const prefillText = await prefill.innerText()
  for (const needle of ['100', '90×55', '350gsm', 'Double', 'Full colour']) {
    assert(prefillText.includes(needle), `Prefill missing "${needle}"`)
  }
  await manager1Page.reload({ waitUntil: 'domcontentloaded' })
  await manager1Page.getByText('Production options').first().waitFor({ timeout: 20000 })
})

await step(manager1, 'Manager 1 approves the uploaded artwork before payment', async () => {
  const artwork = manager1Page.locator('[data-test="manager-request-artwork"]')
  await artwork.getByRole('button', { name: /Approve artwork/i }).click()
  await artwork.getByText('Artwork approved for payment').first().waitFor({ timeout: 20000 })
  log('  artwork approved for the current file')
})

await step(manager1, `Manager 1 prices against ${shops.first}`, async () => {
  const total = await quoteWithShop(manager1Page, shops.first)
  quoteTotals.first = moneyValue(total)
  assert(quoteTotals.first > 0, `No real client total: ${total}`)
  log(`  first client total: ${total}`)
})

await step(manager1, 'Manager 1 prepares and sends the quote', async () => {
  await prepareAndSend(manager1Page)
})

await step(manager1, 'Manager 1 changes the price after sending and sends the revision', async () => {
  const content = manager1Page.locator('[data-test="margin-value-client_total"]')
  const before = (await content.innerText()).trim()
  const markup = manager1Page.locator('[data-test="margin-markup-input"]')
  const current = Number(await markup.inputValue())
  const next = Number.isFinite(current) && current > 0 ? current + 25 : 100
  await markup.fill(String(next))
  await manager1Page.locator('[data-test="margin-calculate"]').click()
  const after = await waitForDifferent(content, before)
  assert(moneyValue(after) > moneyValue(before), `Price did not increase: ${before} → ${after}`)
  quoteTotals.revised = moneyValue(after)
  log(`  revised client total: ${after}`)
  await prepareAndSend(manager1Page)
})

await step(buyer, 'Buyer sees the revised offer and the price-update notice', async () => {
  await buyerPage.goto(`${base}/app/buyer/requests/${mainRequest.requestId}`, { waitUntil: 'domcontentloaded' })
  await buyerPage.locator('#offers').waitFor({ timeout: 20000 })
  const offers = buyerPage.locator('#offers')
  const toggles = offers.locator('article > button')
  const count = await toggles.count()
  for (let index = 0; index < count; index += 1) {
    if ((await toggles.nth(index).getAttribute('aria-expanded')) !== 'true') {
      await toggles.nth(index).click().catch(() => {})
    }
  }
  await buyerPage.waitForTimeout(800)
  const text = await offers.innerText()
  assert(/KSh\s?[\d,]+(?:\.\d{2})?|KES\s[\d,]+\.\d{2}/.test(text), 'No real price in the offers panel')
  assert(text.includes('Your manager changed the price'), 'Price-update notice missing')
})

/* ───────────────────────────── E. payment + escrow ───────────────────────── */

let mainJob = null
let mainCheckout = null

await step(buyer, 'Buyer acknowledges, accepts and pays through the stub callback', async () => {
  mainCheckout = await acceptAndPay(buyerPage, { expectedAmount: quoteTotals.revised, phone: '254733555666' })
  log(`  payment ${mainCheckout.checkout.payment_id} · ${mainCheckout.checkout.checkout_request_id}`)
})

await step(buyer, 'The paid request opens a real job in escrow', async () => {
  mainJob = await openBuyerRequestJob(buyerPage, mainRequest.requestId)
  log(`  job ${mainJob.id} · ${mainJob.managed_reference || mainJob.reference || mainJob.job_reference || '-'} · payment ${mainJob.payment_status}`)
})

await step(buyer, 'Buyer opens the job timeline with its job code and stage log', async () => {
  await buyerPage.goto(`${base}/app/buyer/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  await buyerPage.getByText(/full stage log/i).first().waitFor({ timeout: 30000 })
  const body = await buyerPage.locator('body').innerText()
  assert(/full stage log/i.test(body), 'Stage log missing on buyer job page')
  assert(/QR-|MJ-|PTY-|TRK-/i.test(body), 'Job code missing on buyer job page')
})

/* ─────────── F. dispatch -> reject -> reassign -> production -> payout ───── */

await step(buyer, 'Buyer jobs list opens the canonical detail, survives refresh, and keeps legacy links', async () => {
  await buyerPage.goto(`${base}/app/buyer/jobs`, { waitUntil: 'domcontentloaded' })
  const row = buyerPage.locator('[data-test="buyer-job-row"]').first()
  await row.waitFor({ timeout: 20000 })
  assert((await row.getAttribute('href'))?.startsWith('/app/buyer/jobs/'), 'Job row does not link to the canonical detail')
  await row.click()
  await buyerPage.waitForURL(/\/app\/buyer\/jobs\/\d+/, { timeout: 20000 })
  await buyerPage.reload({ waitUntil: 'domcontentloaded' })
  await buyerPage.locator('[data-test="buyer-artwork-step"]').waitFor({ timeout: 20000 })
  assert((await buyerPage.locator('body').innerText()).includes(mainRequest.reference), 'Refreshed job detail lost the job code')

  await buyerPage.goto(`${base}/app/buyer/orders/${mainJob.id}?type=job`, { waitUntil: 'domcontentloaded' })
  await buyerPage.locator('[data-test="buyer-artwork-step"]').waitFor({ timeout: 20000 })
  log('  list -> detail, refresh and legacy job URL all work')
})

await step(manager1, `Manager 1 dispatches to ${shops.first}`, async () => {
  await manager1Page.goto(`${base}/app/manager/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  const card = manager1Page.locator('[data-test="job-card-primary"]')
  await card.waitFor({ timeout: 30000 })
  await selectShop(card.locator('[data-test="job-card-shop-select"]'), shops.first)
  const dispatched = manager1Page.waitForResponse(
    (candidate) => candidate.url().includes('/actions/next/') && candidate.request().method() === 'POST',
    { timeout: 30000 },
  )
  await card.locator('[data-test="job-card-primary-action"]').click()
  assert((await dispatched).status() === 200, 'Dispatch action failed')
  await manager1Page.locator('[data-test="job-card-waiting"]').waitFor({ timeout: 30000 })
  const text = await manager1Page.locator('body').innerText()
  assert(text.toLowerCase().includes(shops.first.toLowerCase()), `Dispatched card is not on ${shops.first}`)
})

await step(printer1, `Printer 1 sees the job but no client identity or totals`, async () => {
  await printer1Page.goto(`${base}/app/printer`, { waitUntil: 'domcontentloaded' })
  const card = printer1Page
    .locator(`[data-test="printer-job-card"][data-quote-reference="${mainRequest.reference}"]`)
    .first()
  await card.waitFor({ timeout: 30000 })
  const text = await card.innerText()
  assert(!text.includes('Wanjiku'), 'Printer can see the client name')
  assert(!text.includes('0733'), 'Printer can see the client phone')
  assert(!/KSh|KES/.test(text), 'Printer can see client money')
})

await step(printer1, 'Printer 1 rejects the job with a real reason', async () => {
  const card = printer1Page
    .locator(`[data-test="printer-job-card"][data-quote-reference="${mainRequest.reference}"]`)
    .first()
  await card.locator('[data-test="printer-reject-open"]').click()
  await card.locator('[data-test="printer-reject-reason"]').fill('Press capacity is fully booked for this turnaround window.')
  await card.locator('[data-test="printer-reject-confirm"]').click()
  await printer1Page.waitForTimeout(1800)
})

await step(manager1, `Manager 1 reassigns the rejected job to ${shops.second}`, async () => {
  await manager1Page.goto(`${base}/app/manager/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  const card = manager1Page.locator('[data-test="job-card-primary"]')
  await card.waitFor({ timeout: 30000 })
  await selectShop(card.locator('[data-test="job-card-shop-select"]'), shops.second)
  const reassigned = manager1Page.waitForResponse(
    (candidate) => candidate.url().includes('/actions/next/') && candidate.request().method() === 'POST',
    { timeout: 30000 },
  )
  await card.locator('[data-test="job-card-primary-action"]').click()
  assert((await reassigned).status() === 200, 'Reassign action failed')
  await manager1Page.locator('[data-test="job-card-waiting"]').waitFor({ timeout: 30000 })
  const text = await manager1Page.locator('body').innerText()
  assert(text.toLowerCase().includes(shops.second.toLowerCase()), `Reassigned card is not on ${shops.second}`)
})

let printerStages = []

await step(printer2, 'Printer 2 accepts and runs every real production stage', async () => {
  printerStages = await runAllPrinterStages(printer2Page, mainRequest.reference)
  log(`  stages: ${printerStages.join(' → ')}`)
})

await step(buyer, 'Buyer sees the live stages, times and job code after production', async () => {
  await buyerPage.goto(`${base}/app/buyer/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  await buyerPage.getByText(mainRequest.reference).first().waitFor({ timeout: 30000 })
  const body = await buyerPage.locator('body').innerText()
  assert(body.includes(mainRequest.reference), 'Buyer job page is missing the job code')
  assert(/min|hr|h\b/i.test(body), 'Buyer job page has no stage times')
  assert(!body.includes(shops.first) && !body.includes(shops.second), 'Buyer can see the production shop identity')
  assert(!/Printy fee|production cost|shop payout/i.test(body), 'Buyer can see production costs')
})

await step(manager1, 'Manager 1 marks the job delivered', async () => {
  await manager1Page.goto(`${base}/app/manager/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  const action = manager1Page.locator('[data-test="job-card-primary-action"]')
  await action.waitFor({ timeout: 30000 })
  const delivered = manager1Page.waitForResponse(
    (candidate) => candidate.url().includes('/actions/next/') && candidate.request().method() === 'POST',
    { timeout: 30000 },
  )
  await action.click()
  assert((await delivered).status() === 200, 'Deliver action failed')
  await manager1Page.locator('[data-test="job-card-waiting"]').waitFor({ timeout: 30000 })
})

await step(buyer, 'Buyer confirms delivery', async () => {
  await buyerPage.goto(`${base}/app/buyer/jobs/${mainJob.id}`, { waitUntil: 'domcontentloaded' })
  const confirm = buyerPage.locator('[data-test="confirm-delivery"]')
  await confirm.waitFor({ timeout: 30000 })
  await confirm.click()
  await buyerPage.getByText('Delivery confirmed').first().waitFor({ timeout: 30000 })
})

let lateMessage = ''

await step(operator, 'Operator flags a late SLA and holds 10% of the printer payout', async () => {
  lateMessage = await runAdminAction(adminPage, mainJob.managed_reference, 'flag_late_sla_hold')
  assert(/held|hold/i.test(lateMessage), `Late-hold admin action did not confirm: ${lateMessage}`)
  log(`  ${lateMessage.replace(/\s+/g, ' ').slice(0, 220)}`)
})

await step(manager1, 'Manager sees the real 10% payout hold', async () => {
  await manager1Page.goto(`${base}/app/manager/jobs`, { waitUntil: 'domcontentloaded' })
  const card = manager1Page.locator(`#manager-job-${mainJob.id}`)
  await card.waitFor({ timeout: 30000 })
  await card.locator('[data-test="manager-payout-hold"]').waitFor({ timeout: 20000 })
})

await step(operator, 'Operator clears the hold after review', async () => {
  const message = await runAdminAction(adminPage, mainJob.managed_reference, 'clear_payout_hold')
  assert(/cleared|No held/i.test(message), `Clear-hold admin action did not confirm: ${message}`)
})

await step(manager1, 'Manager sees the hold gone', async () => {
  await manager1Page.goto(`${base}/app/manager/jobs`, { waitUntil: 'domcontentloaded' })
  const card = manager1Page.locator(`#manager-job-${mainJob.id}`)
  await card.waitFor({ timeout: 30000 })
  assert((await card.locator('[data-test="manager-payout-hold"]').count()) === 0, 'Payout hold badge is still visible')
})

await step(operator, 'Operator releases manager and printer payouts', async () => {
  const message = await runAdminAction(adminPage, mainJob.managed_reference, 'release_payouts')
  assert(/paid out|released/i.test(message), `Payout release did not confirm: ${message}`)
  log(`  ${message.replace(/\s+/g, ' ').slice(0, 260)}`)
})

/* ─────────── G1. manager declines -> buyer rematches to manager 2 ────────── */

let declinedRequest = null
let rematchRequest = null

await step(buyer, 'Buyer creates a second real request and chooses Manager 1', async () => {
  declinedRequest = await createRequestFromBuyerDashboard(buyerPage, managers.first)
  assert(declinedRequest.requestId !== mainRequest.requestId, 'Second request reused the first request id')
  log(`  request: ${declinedRequest.requestId} ${declinedRequest.reference}`)
})

await step(manager1, 'Manager 1 declines the request with a client-visible reason', async () => {
  await openManagerQuote(manager1Page, declinedRequest.reference)
  const panel = manager1Page.locator('[data-test="manager-decline"]')
  await panel.waitFor({ timeout: 20000 })
  await manager1Page.locator('[data-test="manager-decline-open"]').click()
  await manager1Page.locator('[data-test="manager-decline-reason"]').fill('We cannot take this deadline; choose another verified manager.')
  await manager1Page.locator('[data-test="manager-decline-confirm"]').click()
  await manager1Page.getByText(/Request declined/i).first().waitFor({ timeout: 20000 })
})

await step(buyer, 'Buyer sees the decline and a real rematch CTA', async () => {
  await buyerPage.goto(`${base}/app/buyer/requests/${declinedRequest.requestId}`, { waitUntil: 'domcontentloaded' })
  const declined = buyerPage.locator('[data-test="buyer-request-declined"]')
  await declined.waitFor({ timeout: 20000 })
  const rematch = buyerPage.locator('[data-test="buyer-request-rematch"]')
  await rematch.waitFor({ timeout: 20000 })
  await rematch.click()
  await buyerPage.waitForURL(/\/app\/buyer\?tab=quote&rematch=\d+/, { timeout: 20000 })
})

await step(buyer, `Buyer rematches the same spec to ${managers.second}`, async () => {
  rematchRequest = await createRequestFromBuyerDashboard(buyerPage, managers.second, { rematch: true })
  assert(rematchRequest.requestId !== declinedRequest.requestId, 'Rematch reused the declined request id')
  const detail = await apiGet(buyerPage, `/api/client/requests/${rematchRequest.requestId}/`)
  assert(detail.status === 200, `Rematch request read failed: ${detail.status}`)
  const managerName = detail.body?.assigned_manager?.display_name
    ?? detail.body?.assigned_manager?.name
    ?? ''
  assert(String(managerName).includes(managers.second), `Rematch manager is not ${managers.second}: ${managerName}`)
  log(`  rematched request: ${rematchRequest.requestId} ${rematchRequest.reference}`)
})

/* ─────────── G2. buyer declines an offer -> manager revises it ───────────── */

await step(manager2, `Manager 2 quotes the rematched request against ${shops.second}`, async () => {
  await openManagerQuote(manager2Page, rematchRequest.reference)
  await quoteWithShop(manager2Page, shops.second)
  await prepareAndSend(manager2Page)
})

await step(buyer, 'Buyer declines the offer with a reason', async () => {
  await buyerPage.goto(`${base}/app/buyer/requests/${rematchRequest.requestId}`, { waitUntil: 'domcontentloaded' })
  const offers = buyerPage.locator('#offers')
  await offers.waitFor({ timeout: 20000 })
  const toggle = offers.locator('article > button').first()
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click()
  await offers.getByRole('button', { name: /^Decline$/ }).first().click()
  await offers.getByPlaceholder(/Budget too high/i).fill('The budget is slightly too high for this run.')
  await offers.getByRole('button', { name: /Decline quote/i }).click()
  await offers.getByText(/Declined/i).first().waitFor({ timeout: 20000 })
})

await step(manager2, 'Manager 2 sees the declined offer and sends a revision', async () => {
  await openManagerQuote(manager2Page, rematchRequest.reference)
  const content = manager2Page.locator('[data-test="margin-value-client_total"]')
  const before = (await content.innerText()).trim()
  await quoteWithShop(manager2Page, shops.second, { markup: 85 })
  const after = await waitForDifferent(content, before)
  assert(after, 'No revised total after the buyer decline')
  await prepareAndSend(manager2Page)
})

await step(buyer, 'Buyer sees the revised offer with a valid next step', async () => {
  await buyerPage.goto(`${base}/app/buyer/requests/${rematchRequest.requestId}`, { waitUntil: 'domcontentloaded' })
  const offers = buyerPage.locator('#offers')
  await offers.waitFor({ timeout: 20000 })
  const toggles = offers.locator('article > button')
  const count = await toggles.count()
  for (let index = 0; index < count; index += 1) {
    if ((await toggles.nth(index).getAttribute('aria-expanded')) !== 'true') {
      await toggles.nth(index).click().catch(() => {})
    }
  }
  await buyerPage.waitForTimeout(900)
  // A revision that changes the total is a new offer: the buyer must see and
  // acknowledge the new price before the Accept action unlocks.
  const acknowledge = offers.getByRole('button', { name: /I acknowledge this price/i }).first()
  await acknowledge.waitFor({ timeout: 20000 })
  await acknowledge.click()
  await buyerPage.getByText(/Price update acknowledged/i).first().waitFor({ timeout: 20000 })
  const accept = offers.getByRole('button', { name: /^Accept$/ }).last()
  await accept.waitFor({ timeout: 20000 })
  assert(!(await accept.isDisabled()), 'Revised offer cannot be accepted')
})

/* ─────────── G3. manager-created phone client + fee waiver + tracking ────── */

let phoneRequestId = 0
let phoneReference = ''
let phoneClaimUrl = ''
let phoneJob = null
let phoneJobCode = ''
const claimContext = await browser.newContext({ viewport })
const claimPage = await claimContext.newPage()
watch(claimPage, 'claim-client')

await step(manager1, 'Manager 1 adds a phone-only client with real job specs', async () => {
  await manager1Page.goto(`${base}/app/manager/quotes`, { waitUntil: 'domcontentloaded' })
  await manager1Page.getByText('Quote workload').first().waitFor({ timeout: 20000 })
  await manager1Page.locator('[data-test="toggle-add-client"]').click()
  await manager1Page.locator('[data-test="client-name"]').fill(users.phoneClient.name)
  await manager1Page.locator('[data-test="client-phone"]').fill(users.phoneClient.phone)
  await manager1Page.locator('[data-test="client-quantity"]').fill('250')
  await manager1Page.locator('[data-test="client-notes"]').fill('Matt lamination, round corners')
  await manager1Page.locator('[data-test="contact-checkbox"]').check()
  const [response] = await Promise.all([
    manager1Page.waitForResponse(
      (candidate) => candidate.url().includes('/client-portal/manager/quote-requests/')
        && candidate.request().method() === 'POST',
      { timeout: 30000 },
    ),
    manager1Page.locator('[data-test="add-client-submit"]').click(),
  ])
  if (response.status() !== 201) {
    throw new Error(`Manager client create failed: ${response.status()}`)
  }
  const created = await response.json()
  phoneRequestId = Number(created.quote_request_id)
  phoneReference = String(created.request_reference || created.code || '')
  assert(phoneRequestId > 0, `No quote request id in ${JSON.stringify(created)}`)
  await manager1Page.locator('[data-test="add-client-note"]').waitFor({ timeout: 20000 })
  log(`  phone request: ${phoneRequestId} ${phoneReference}`)
})

await step(manager1, 'Manager 1 sees the Printy fee waived on the phone client', async () => {
  const waived = manager1Page.locator('[data-test="quote-fee-waived"], [data-test="quote-row-fee-waived"]').first()
  await waived.waitFor({ timeout: 20000 })
  const text = await waived.innerText()
  assert(/waiv|origin|own client/i.test(text), `Fee waiver badge text unclear: ${text}`)
})

await step(manager1, 'Manager 1 prepares and sends the phone client quote', async () => {
  const artwork = manager1Page.locator('[data-test="manager-request-artwork"]')
  await artwork.getByRole('button', { name: /I already hold the artwork/i }).click()
  await artwork.getByText(/Artwork approved for payment/i).first().waitFor({ timeout: 20000 })
  await quoteWithShop(manager1Page, shops.first)
  await prepareAndSend(manager1Page)
  const claim = manager1Page.locator('[data-test="offline-claim-link"] input')
  await claim.waitFor({ timeout: 20000 })
  phoneClaimUrl = await claim.inputValue()
  assert(phoneClaimUrl.includes('/app/client-invite?token='), `Claim link is not real: ${phoneClaimUrl}`)
  log(`  claim link ready`)
})

await step(manager1, 'Manager 1 sees a zero Printy fee on the phone client settlement', async () => {
  // The fee waiver is frozen at quote time; read the authoritative split the
  // manager sees, not a client-side recomputation.
  const detail = await apiGet(manager1Page, `/api/dashboard/partner/quotes/${phoneRequestId}/`)
  if (detail.status !== 200) throw new Error(`Phone quote read failed: ${detail.status}`)
  const payload = detail.body?.quote ?? detail.body
  const split = payload?.split ?? payload?.financial_split ?? null
  if (split) {
    assert(Number(split.printy_fee ?? 0) === 0, `Printy fee is not zero: ${JSON.stringify(split)}`)
  }
})

await step({ page: claimPage }, 'Phone client claims the real invite link', async () => {
  await claimPage.goto(phoneClaimUrl, { waitUntil: 'domcontentloaded' })
  await claimPage.getByText('Claim your Printy account').first().waitFor({ timeout: 20000 })
  await claimPage.getByPlaceholder('Full name').fill(users.phoneClient.name)
  await claimPage.getByPlaceholder('At least 8 characters').fill(password)
  await claimPage.getByPlaceholder('Repeat your password').fill(password)
  await claimPage.getByRole('button', { name: /Claim account/i }).click()
  await claimPage.getByText('Account ready').first().waitFor({ timeout: 30000 })
  await claimPage.getByRole('link', { name: /Open my dashboard/i }).click()
  await claimPage.waitForURL(/\/app\/buyer/, { timeout: 30000 })
})

await step({ page: claimPage }, 'Phone client opens the real request and pays', async () => {
  await claimPage.goto(`${base}/app/buyer/requests/${phoneRequestId}`, { waitUntil: 'domcontentloaded' })
  await claimPage.locator('[data-test="buyer-request-detail"]').waitFor({ timeout: 20000 })
  await acceptAndPay(claimPage, { phone: users.phoneClient.normalized })
  phoneJob = await openBuyerRequestJob(claimPage, phoneRequestId)
  phoneJobCode = phoneReference || String(phoneJob.managed_reference || '')
  assert(phoneJobCode, 'Phone client job has no code for signed-out tracking')
  log(`  phone job: ${phoneJob.id} ${phoneJobCode} fee_waived=${phoneJob.fee_waived}`)
  assert(phoneJob.fee_waived === true, 'Phone client job fee was not waived')
})

await step(null, 'Signed-out tracking works with the job code and phone only', async () => {
  const trackContext = await browser.newContext({ viewport })
  const trackPage = await trackContext.newPage()
  watch(trackPage, 'track')
  await trackPage.goto(`${base}/track?code=${encodeURIComponent(phoneJobCode)}`, { waitUntil: 'domcontentloaded' })
  const contact = trackPage.getByPlaceholder(/Phone on the job/i)
  await contact.waitFor({ timeout: 30000 })
  await contact.fill(users.phoneClient.phone)
  await trackPage.getByRole('button', { name: /Find job/i }).click()
  await trackPage.waitForTimeout(2200)
  const body = await trackPage.locator('body').innerText()
  assert(!body.includes("We couldn't find that job"), 'Signed-out tracking did not find the job')
  assert(body.includes(phoneJobCode), 'Signed-out tracking is missing the job code')
  assert(
    /stage/i.test(body) && /owner/i.test(body) && /next step/i.test(body),
    'Public tracking is not the compact stage/owner/next-step summary',
  )
  assert(!body.includes('Job event log'), 'Public tracking still renders the old event log')
  assert(!body.includes('Who has the ball'), 'Public tracking still renders the old command center')
  assert(!body.includes(shops.first) && !body.includes(shops.second), 'Public tracking leaks shop identity')
  assert(!/Printy fee|production cost|shop payout/i.test(body), 'Public tracking leaks production costs')
  await trackContext.close()
})

/* ─────────────────────── H. cross-screen screen checks ──────────────────── */

await step(buyer, 'Buyer workspace renders breadcrumbs and side navigation', async () => {
  await buyerPage.goto(`${base}/app/buyer`, { waitUntil: 'domcontentloaded' })
  await buyerPage.locator('[data-test="app-breadcrumbs"]').waitFor({ timeout: 20000 })
  await buyerPage.locator('nav[aria-label="Workspace"]').waitFor({ state: 'attached', timeout: 20000 })
})

await step(manager1, 'Manager workspace renders breadcrumbs and side navigation', async () => {
  await manager1Page.goto(`${base}/app/manager`, { waitUntil: 'domcontentloaded' })
  await manager1Page.locator('[data-test="app-breadcrumbs"]').waitFor({ timeout: 20000 })
  await manager1Page.locator('nav[aria-label="Workspace"]').waitFor({ state: 'attached', timeout: 20000 })
})

await step(printer2, 'Printer workspace renders breadcrumbs and side navigation', async () => {
  await printer2Page.goto(`${base}/app/printer`, { waitUntil: 'domcontentloaded' })
  await printer2Page.locator('[data-test="app-breadcrumbs"]').waitFor({ timeout: 20000 })
  await printer2Page.locator('nav[aria-label="Workspace"]').waitFor({ state: 'attached', timeout: 20000 })
})

await step(manager1, 'A manager cannot see or use the buyer homepage', async () => {
  await manager1Page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await manager1Page.waitForTimeout(1200)
  assert(!manager1Page.url().match(/localhost:3000\/$/), 'Manager stayed on the marketing homepage')
  const body = await manager1Page.locator('body').innerText()
  assert(!body.includes('Get Manager'), 'Manager can see the buyer calculator CTA')
})

await step(printer1, 'A printer cannot see or use the buyer homepage', async () => {
  await printer1Page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await printer1Page.waitForTimeout(1200)
  assert(!printer1Page.url().match(/localhost:3000\/$/), 'Printer stayed on the marketing homepage')
  const body = await printer1Page.locator('body').innerText()
  assert(!body.includes('Get Manager'), 'Printer can see the buyer calculator CTA')
})

await step(manager1, 'A manager cannot request a quote', async () => {
  await manager1Page.goto(`${base}/app/buyer?tab=quote`, { waitUntil: 'domcontentloaded' })
  await manager1Page.waitForTimeout(1200)
  // The buyer workspace is closed to managers, so the route must bounce back
  // to the manager dashboard. Their dashboard may embed the price-only
  // calculator for pricing, but it must never offer the buyer request step.
  assert(!manager1Page.url().includes('/app/buyer'), 'Manager stayed in the buyer workspace')
  assert(
    (await manager1Page.locator('[data-test="get-manager"]').count()) === 0,
    'Manager can start a buyer quote request',
  )
})

await step(printer1, 'A printer cannot request a quote', async () => {
  await printer1Page.goto(`${base}/app/buyer?tab=quote`, { waitUntil: 'domcontentloaded' })
  await printer1Page.waitForTimeout(1200)
  assert(!printer1Page.url().includes('/app/buyer'), 'Printer stayed in the buyer workspace')
  assert(
    (await printer1Page.locator('[data-test="get-manager"]').count()) === 0,
    'Printer can start a buyer quote request',
  )
})

/* ───────────────────────────── final log + close ────────────────────────── */

log('\nPRINTY LIVE SUITE PASSED')
log(`steps: ${stepNo}`)
log(`finished ${new Date().toISOString()}`)
log(`log: ${logFile}`)

await browser.close()
