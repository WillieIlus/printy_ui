/* ─────────────────────────────────────────────────────────────
   PRINTY · PUBLIC QUOTE ENGINE
   Faithful client-side port of printy_api pricing:
     services/pricing/imposition.py   → copies-per-sheet + good sheets
     pricing.WastePolicy              → fixed 2 + 10% variable, min 3
     pricing.PrintingRate             → per sheet-size / colour / sides
     pricing.FinishingRate            → billing basis + side mode
     pricing.PlatformFeePolicy        → fee tiers + markup caps
     pricing.ServiceCode              → DESIGN / DELIVERY / RUSH / SETUP
   Currency: KES (matches PlatformFeePolicy.currency default)
   ───────────────────────────────────────────────────────────── */

export type ColorMode = "COLOR" | "BW"
export type Sides = "SIMPLEX" | "DUPLEX"
export type Category = "sheet" | "booklet" | "large_format"
export type Basis = "per_sheet" | "per_piece" | "flat_per_job" | "per_linear_m"

export const CURRENCY = "KSh"
export const ksh = (n: number) =>
  CURRENCY + " " + Math.round(n).toLocaleString("en-KE")
export const ksh2 = (n: number) =>
  CURRENCY + " " + n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ── PlatformFeePolicy defaults (pricing/models.py) ── */
export const FEE_POLICY = {
  policy_version: "printy-fees-v1",
  currency: "KES",
  under_production_threshold: 1000,
  under_production_fee_rate: 0.3,
  standard_production_fee_rate: 0.2,
  high_production_threshold: 10000,
  high_production_fee_rate: 0.3,
  small_job_limit: 2000,
  medium_job_limit: 10000,
  small_job_max_multiple: 4,
  medium_job_max_multiple: 3,
  bulk_job_max_multiple: 2,
}

/* ── WastePolicy defaults ── */
export const WASTE_POLICY = {
  fixed_waste_sheets: 2,
  variable_waste_rate: 0.1,
  minimum_billable_sheets: 3,
}

export const VAT_RATE = 0.16 // Kenya standard rate

/* ── inventory.SheetSize ── */
export interface Sheet { id: string; label: string; w: number; h: number }
export const SHEETS: Sheet[] = [
  { id: "A4", label: "A4", w: 210, h: 297 },
  { id: "A3", label: "A3", w: 297, h: 420 },
  { id: "SRA3", label: "SRA3", w: 320, h: 450 },
  { id: "13x19", label: "13×19″", w: 330, h: 483 },
  { id: "SRA2", label: "SRA2", w: 450, h: 640 },
]
export const sheetArea = (s: Sheet) => (s.w / 1000) * (s.h / 1000)

/* ── inventory.Paper ── */
export interface Paper {
  id: string; name: string; gsm: number; pricePerSqm: number; tag: string
  fits: Category[]; min?: number; max?: number
}
export const PAPERS: Paper[] = [
  { id: "bond80", name: "Bond", gsm: 80, pricePerSqm: 26, tag: "Everyday inner pages", fits: ["sheet", "booklet"] },
  { id: "matt100", name: "Matt coated", gsm: 100, pricePerSqm: 34, tag: "Crisp, low glare", fits: ["sheet", "booklet"] },
  { id: "gloss130", name: "Gloss art", gsm: 130, pricePerSqm: 45, tag: "Punchy colour — flyers", fits: ["sheet", "booklet"] },
  { id: "silk170", name: "Silk", gsm: 170, pricePerSqm: 58, tag: "Premium feel, folds well", fits: ["sheet", "booklet"] },
  { id: "board250", name: "Art board", gsm: 250, pricePerSqm: 85, tag: "Light card — folders", fits: ["sheet", "booklet"] },
  { id: "board300", name: "Art board", gsm: 300, pricePerSqm: 102, tag: "Standard card stock", fits: ["sheet"] },
  { id: "board350", name: "Art board", gsm: 350, pricePerSqm: 120, tag: "Rigid — business cards", fits: ["sheet"] },
  { id: "kraft400", name: "Uncoated kraft", gsm: 400, pricePerSqm: 135, tag: "Natural, tactile", fits: ["sheet"] },
]

/* ── large-format materials (engine.calculate_large_format_pricing) ── */
export interface Material { id: string; name: string; pricePerSqm: number; tag: string }
export const MATERIALS: Material[] = [
  { id: "frontlit", name: "Frontlit banner 440gsm", pricePerSqm: 650, tag: "Outdoor workhorse" },
  { id: "mesh", name: "Mesh banner", pricePerSqm: 900, tag: "Wind-permeable" },
  { id: "vinyl", name: "Self-adhesive vinyl", pricePerSqm: 1200, tag: "Stick to any smooth wall" },
  { id: "canvas", name: "Poly canvas", pricePerSqm: 1800, tag: "Gallery / indoor" },
]

/* ── pricing.PrintingRate (per machine) ── */
export interface Machine {
  id: string; name: string; kind: "digital" | "offset"
  plateFee: number; makeready: number
  /** per SRA3 sheet, scaled by area */
  color: { simplex: number; duplex: number }
  bw: { simplex: number; duplex: number }
  runColor: number; runBw: number // offset per-side impression cost
}
export const MACHINES: Machine[] = [
  {
    id: "m-digital", name: "Konica AccurioPress C4080", kind: "digital",
    plateFee: 0, makeready: 0,
    color: { simplex: 22, duplex: 35 }, bw: { simplex: 6, duplex: 9 },
    runColor: 0, runBw: 0,
  },
  {
    id: "m-offset", name: "Heidelberg SM 52 offset", kind: "offset",
    plateFee: 900, makeready: 1500,
    color: { simplex: 0, duplex: 0 }, bw: { simplex: 0, duplex: 0 },
    runColor: 2.2, runBw: 1.4,
  },
]

/* ── pricing.FinishingRate ── */
export interface Finishing {
  id: string; name: string; category: string; price: number; setup_fee: number
  basis: Basis; sideAware?: boolean; fits: Category[]; note: string
}
export const FINISHINGS: Finishing[] = [
  { id: "lam-matt", name: "Matt lamination", category: "Lamination", price: 9, setup_fee: 150, basis: "per_sheet", sideAware: true, fits: ["sheet", "booklet"], note: "Soft, fingerprint-resistant" },
  { id: "lam-gloss", name: "Gloss lamination", category: "Lamination", price: 8, setup_fee: 150, basis: "per_sheet", sideAware: true, fits: ["sheet", "booklet"], note: "High shine, scuff-proof" },
  { id: "spot-uv", name: "Spot UV", category: "Coating", price: 25, setup_fee: 800, basis: "per_sheet", fits: ["sheet"], note: "Raised gloss on chosen areas" },
  { id: "foil", name: "Foil stamping", category: "Embellishment", price: 6, setup_fee: 1200, basis: "per_piece", fits: ["sheet"], note: "Gold / silver hot foil" },
  { id: "diecut", name: "Die cutting", category: "Cutting", price: 8, setup_fee: 1500, basis: "per_sheet", fits: ["sheet"], note: "Custom shape, needs a dieline" },
  { id: "roundcorner", name: "Round corners", category: "Cutting", price: 0.8, setup_fee: 200, basis: "per_piece", fits: ["sheet"], note: "3mm or 6mm radius" },
  { id: "crease", name: "Creasing & folding", category: "Folding", price: 1.2, setup_fee: 300, basis: "per_piece", fits: ["sheet"], note: "Clean folds on heavy stock" },
  { id: "perf", name: "Perforation", category: "Cutting", price: 4, setup_fee: 250, basis: "per_sheet", fits: ["sheet"], note: "Tear-off coupons & stubs" },
  { id: "drill", name: "Drilling / eyelets", category: "Finishing", price: 1.5, setup_fee: 150, basis: "per_piece", fits: ["sheet"], note: "Hang tags & swing tickets" },
  { id: "number", name: "Sequential numbering", category: "Finishing", price: 0.5, setup_fee: 200, basis: "per_piece", fits: ["sheet"], note: "Receipts, tickets, invoices" },
  { id: "saddle", name: "Saddle stitching", category: "Binding", price: 8, setup_fee: 400, basis: "per_piece", fits: ["booklet"], note: "Two wire staples on the spine" },
  { id: "pur", name: "PUR perfect binding", category: "Binding", price: 35, setup_fee: 900, basis: "per_piece", fits: ["booklet"], note: "Square spine, 60pp and up" },
  { id: "wiro", name: "Wiro / spiral binding", category: "Binding", price: 45, setup_fee: 500, basis: "per_piece", fits: ["booklet"], note: "Lies completely flat" },
  { id: "shrink", name: "Shrink wrapping", category: "Packing", price: 2, setup_fee: 100, basis: "per_piece", fits: ["sheet", "booklet"], note: "Banded in 50s or 100s" },
  { id: "hem-eyelet", name: "Hemming + eyelets", category: "Finishing", price: 80, setup_fee: 0, basis: "per_linear_m", fits: ["large_format"], note: "Welded hem, eyelet every 50cm" },
  { id: "pole", name: "Pole pockets", category: "Finishing", price: 120, setup_fee: 0, basis: "per_linear_m", fits: ["large_format"], note: "Top & bottom sleeves" },
]

/* ── catalog.Product presets ── */
export interface SizePreset { id: string; label: string; w: number; h: number; note?: string }
export interface Product {
  id: string; name: string; blurb: string; category: Category; icon: string
  sizes: SizePreset[]; sheets: string[]; defaultPaper: string; defaultSides: Sides
  qtyLadder: number[]; defaultQty: number; baseDays: number
  defaultFinishing: string[]; pages?: number
}
export const PRODUCTS: Product[] = [
  {
    id: "business-cards", name: "Business cards", blurb: "Thick stock, sharp edges", category: "sheet", icon: "card",
    sizes: [{ id: "std", label: "Standard", w: 90, h: 54 }, { id: "square", label: "Square", w: 55, h: 55 }, { id: "slim", label: "Slim", w: 85, h: 40 }],
    sheets: ["SRA3", "13x19"], defaultPaper: "board350", defaultSides: "DUPLEX",
    qtyLadder: [100, 250, 500, 1000, 2500, 5000, 10000], defaultQty: 1000, baseDays: 3,
    defaultFinishing: ["lam-matt"],
  },
  {
    id: "flyers", name: "Flyers & leaflets", blurb: "Fast, loud, cheap per piece", category: "sheet", icon: "flyer",
    sizes: [{ id: "a6", label: "A6", w: 105, h: 148 }, { id: "a5", label: "A5", w: 148, h: 210 }, { id: "dl", label: "DL", w: 99, h: 210 }, { id: "a4", label: "A4", w: 210, h: 297 }],
    sheets: ["SRA3", "SRA2"], defaultPaper: "gloss130", defaultSides: "DUPLEX",
    qtyLadder: [250, 500, 1000, 2500, 5000, 10000, 20000], defaultQty: 2500, baseDays: 2,
    defaultFinishing: [],
  },
  {
    id: "brochures", name: "Folded brochures", blurb: "Tri-fold, bi-fold, Z-fold", category: "sheet", icon: "fold",
    sizes: [{ id: "a4dl", label: "A4 → DL", w: 210, h: 297, note: "tri-fold" }, { id: "a3a4", label: "A3 → A4", w: 297, h: 420, note: "bi-fold" }],
    sheets: ["SRA3", "SRA2"], defaultPaper: "silk170", defaultSides: "DUPLEX",
    qtyLadder: [100, 250, 500, 1000, 2500, 5000], defaultQty: 1000, baseDays: 3,
    defaultFinishing: ["crease", "lam-matt"],
  },
  {
    id: "booklets", name: "Booklets & catalogues", blurb: "Stitched or perfect bound", category: "booklet", icon: "book",
    sizes: [{ id: "a5", label: "A5", w: 148, h: 210 }, { id: "a4", label: "A4", w: 210, h: 297 }],
    sheets: ["SRA3", "SRA2"], defaultPaper: "matt100", defaultSides: "DUPLEX",
    qtyLadder: [50, 100, 250, 500, 1000, 2500], defaultQty: 250, baseDays: 5,
    defaultFinishing: ["saddle"], pages: 32,
  },
  {
    id: "stickers", name: "Stickers & labels", blurb: "Kiss-cut or die-cut", category: "sheet", icon: "sticker",
    sizes: [{ id: "s50", label: "50×50", w: 50, h: 50 }, { id: "s75", label: "75×75", w: 75, h: 75 }, { id: "s100", label: "100×100", w: 100, h: 100 }],
    sheets: ["SRA3"], defaultPaper: "board250", defaultSides: "SIMPLEX",
    qtyLadder: [100, 250, 500, 1000, 2500, 5000], defaultQty: 500, baseDays: 3,
    defaultFinishing: ["diecut"],
  },
  {
    id: "letterheads", name: "Letterheads & forms", blurb: "Company stationery", category: "sheet", icon: "doc",
    sizes: [{ id: "a4", label: "A4", w: 210, h: 297 }, { id: "a5", label: "A5", w: 148, h: 210 }],
    sheets: ["SRA3", "A3"], defaultPaper: "bond80", defaultSides: "SIMPLEX",
    qtyLadder: [100, 500, 1000, 2500, 5000, 10000], defaultQty: 1000, baseDays: 2,
    defaultFinishing: [],
  },
  {
    id: "banners", name: "Banners & signage", blurb: "Large format, per square metre", category: "large_format", icon: "banner",
    sizes: [{ id: "b1", label: "1 × 2 m", w: 1000, h: 2000 }, { id: "b2", label: "2 × 1 m", w: 2000, h: 1000 }, { id: "b3", label: "3 × 1 m", w: 3000, h: 1000 }, { id: "b4", label: "0.8 × 2 m", w: 800, h: 2000, note: "roll-up" }],
    sheets: [], defaultPaper: "frontlit", defaultSides: "SIMPLEX",
    qtyLadder: [1, 2, 5, 10, 25, 50], defaultQty: 2, baseDays: 1,
    defaultFinishing: ["hem-eyelet"],
  },
]

/* ── services.ServiceCode ── */
export interface ServiceOpt { id: string; label: string; detail: string; price: number; kind: "fixed" | "pct" }
export const DESIGN_OPTS: ServiceOpt[] = [
  { id: "none", label: "Print-ready file", detail: "I'll upload my own PDF", price: 0, kind: "fixed" },
  { id: "tidy", label: "File fix-up", detail: "Bleed, crops & colour profile", price: 1500, kind: "fixed" },
  { id: "full", label: "Full design", detail: "Studio designs it from brief", price: 4500, kind: "fixed" },
]
export const DELIVERY_OPTS: ServiceOpt[] = [
  { id: "pickup", label: "Shop pickup", detail: "Collect from the press", price: 0, kind: "fixed" },
  { id: "cbd", label: "Nairobi CBD", detail: "Same-day boda", price: 300, kind: "fixed" },
  { id: "metro", label: "Nairobi metro", detail: "Westlands → Ruiru", price: 550, kind: "fixed" },
  { id: "upcountry", label: "Upcountry courier", detail: "Countrywide, 1–2 days", price: 1200, kind: "fixed" },
]
export const RUSH_OPTS: ServiceOpt[] = [
  { id: "standard", label: "Standard", detail: "Normal queue", price: 0, kind: "pct" },
  { id: "48", label: "Priority 48h", detail: "Jumps the queue", price: 0.15, kind: "pct" },
  { id: "24", label: "Rush 24h", detail: "Night shift, top priority", price: 0.3, kind: "pct" },
]

/* ── verified printing managers (buyer-facing; printers stay hidden) ── */
export interface Broker {
  id: string; name: string; area: string; rating: number; onTime: number
  /** the fulfilment margin the printing manager adds on top of true production cost */
  marginPct: number; dayOffset: number; verified: boolean; initials: string; hue: number; strength: string
  sourcing: string
}
export const BROKERS: Broker[] = [
  { id: "b-metro", name: "Metro Print Desk", area: "Westlands", rating: 4.9, onTime: 98, marginPct: 0.18, dayOffset: 0, verified: true, initials: "MP", hue: 150, strength: "Volume colour & fast replies", sourcing: "Vetted digital + offset presses across Nairobi" },
  { id: "b-upeo", name: "Upeo Sourcing", area: "Kilimani", rating: 4.7, onTime: 94, marginPct: 0.10, dayOffset: 1, verified: true, initials: "US", hue: 200, strength: "Cheapest fulfilment, short runs", sourcing: "Small-batch specialists in Industrial Area" },
  { id: "b-kibo", name: "Kibo Print Hub", area: "Mombasa Road", rating: 4.8, onTime: 97, marginPct: 0.28, dayOffset: -1, verified: true, initials: "KP", hue: 32, strength: "Fastest turnaround + binding", sourcing: "In-house bindery next to the presses" },
]

/* ═══════════════ THE ENGINE ═══════════════ */

export interface CalcInput {
  productId: string
  sizeId: string
  customW?: number
  customH?: number
  quantity: number
  pages: number
  paperId: string
  colorMode: ColorMode
  sides: Sides
  finishingIds: string[]
  designId: string
  deliveryId: string
  rushId: string
  brokerId: string
}

export interface Line { label: string; detail: string; amount: number }

export interface Imposition {
  cols: number; rows: number; orientation: "normal" | "rotated"
  copiesPerSheet: number; goodSheets: number; wasteSheets: number; billableSheets: number
  sheet: Sheet; pieceW: number; pieceH: number; bleed: number
  sheetsPerCopy?: number; pagesPerSheet?: number
}

export interface QuoteResult {
  product: Product
  imposition: Imposition | null
  areaSqm: number | null
  machine: Machine | null
  machineReason: string
  lines: Line[]
  paperCost: number
  printingCost: number
  finishingCost: number
  setupCost: number
  productionCost: number
  brokerMargin: number
  productionWithMargin: number
  rushCost: number
  platformFee: number
  feeRate: number
  feeReason: string
  servicesCost: number
  subtotal: number
  vat: number
  total: number
  unitPrice: number
  maxClientPrice: number
  markupMultiple: number
  capped: boolean
  turnaroundDays: number
  readyBy: string
  tiers: { qty: number; unit: number; save: number }[]
}

/* imposition.compute_copies_per_sheet — with cols/rows for the diagram */
export function computeLayout(fw: number, fh: number, sw: number, sh: number, bleed = 3) {
  const pw = fw + bleed * 2
  const ph = fh + bleed * 2
  const nCols = Math.floor(sw / pw); const nRows = Math.floor(sh / ph)
  const rCols = Math.floor(sw / ph); const rRows = Math.floor(sh / pw)
  const normal = nCols * nRows; const rotated = rCols * rRows
  if (rotated > normal && rotated > 0)
    return { cols: rCols, rows: rRows, copiesPerSheet: rotated, orientation: "rotated" as const, pieceW: ph, pieceH: pw }
  return { cols: Math.max(nCols, 1), rows: Math.max(nRows, 1), copiesPerSheet: Math.max(normal, 1), orientation: "normal" as const, pieceW: pw, pieceH: ph }
}

/* WastePolicy.billable sheets */
export function applyWaste(goodSheets: number) {
  const variable = Math.ceil(goodSheets * WASTE_POLICY.variable_waste_rate)
  const waste = WASTE_POLICY.fixed_waste_sheets + variable
  const billable = Math.max(WASTE_POLICY.minimum_billable_sheets, goodSheets + waste)
  return { wasteSheets: billable - goodSheets, billableSheets: billable }
}

/* PlatformFeePolicy tier resolution */
function resolveFee(production: number) {
  if (production < FEE_POLICY.under_production_threshold)
    return { rate: FEE_POLICY.under_production_fee_rate, reason: `Small job (under ${ksh(FEE_POLICY.under_production_threshold)})` }
  if (production >= FEE_POLICY.high_production_threshold)
    return { rate: FEE_POLICY.high_production_fee_rate, reason: `High-value job (over ${ksh(FEE_POLICY.high_production_threshold)})` }
  return { rate: FEE_POLICY.standard_production_fee_rate, reason: "Standard production band" }
}
function maxMultiple(production: number) {
  if (production < FEE_POLICY.small_job_limit) return FEE_POLICY.small_job_max_multiple
  if (production < FEE_POLICY.medium_job_limit) return FEE_POLICY.medium_job_max_multiple
  return FEE_POLICY.bulk_job_max_multiple
}

const WORK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
/** prototype "today" = Thu 14 Nov, matching the job board */
function readyDate(days: number) {
  const d = new Date(2025, 10, 14)
  let added = 0
  while (added < Math.max(1, days)) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) added++ // shops run Mon–Sat
  }
  return `${WORK_DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function getProduct(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0]!
}
export function finishingFor(cat: Category) {
  return FINISHINGS.filter((f) => f.fits.includes(cat))
}
export function papersFor(cat: Category) {
  return PAPERS.filter((p) => p.fits.includes(cat))
}

export function calculate(input: CalcInput, withTiers = true): QuoteResult {
  const product = getProduct(input.productId)
  const broker = BROKERS.find((b) => b.id === input.brokerId) ?? BROKERS[0]!
  const qty = Math.max(1, input.quantity)
  const lines: Line[] = []

  let paperCost = 0; let printingCost = 0; let finishingCost = 0; let setupCost = 0
  let imposition: Imposition | null = null
  let areaSqm: number | null = null
  let machine: Machine | null = null
  let machineReason = ""

  const size = product.sizes.find((s) => s.id === input.sizeId) ?? product.sizes[0]!
  const fw = input.customW || size.w
  const fh = input.customH || size.h

  if (product.category === "large_format") {
    /* ── engine.calculate_large_format_pricing ── */
    const material = MATERIALS.find((m) => m.id === input.paperId) ?? MATERIALS[0]!
    const each = (fw / 1000) * (fh / 1000)
    areaSqm = each * qty
    paperCost = areaSqm * material.pricePerSqm
    lines.push({ label: material.name, detail: `${each.toFixed(2)} m² × ${qty} = ${areaSqm.toFixed(2)} m² @ ${ksh(material.pricePerSqm)}/m²`, amount: paperCost })

    const perimeter = (((fw + fh) * 2) / 1000) * qty
    for (const fid of input.finishingIds) {
      const f = FINISHINGS.find((x) => x.id === fid)
      if (!f) continue
      const amt = f.basis === "per_linear_m" ? f.price * perimeter : f.basis === "per_piece" ? f.price * qty : f.price
      finishingCost += amt
      lines.push({ label: f.name, detail: f.basis === "per_linear_m" ? `${perimeter.toFixed(1)} linear m @ ${ksh(f.price)}/m` : `${qty} × ${ksh(f.price)}`, amount: amt })
    }
  } else {
    /* ── sheet & booklet: imposition + waste + press ── */
    const paper = PAPERS.find((p) => p.id === input.paperId) ?? PAPERS[0]!
    const candidates = SHEETS.filter((s) => product.sheets.includes(s.id))
    let best: { sheet: Sheet; layout: ReturnType<typeof computeLayout>; good: number; bill: number; waste: number; cost: number; mach: Machine; printing: number; paper: number; sheetsPerCopy?: number; pagesPerSheet?: number } | null = null

    for (const sheet of candidates) {
      const layout = computeLayout(fw, fh, sheet.w, sheet.h)
      let good: number; let sheetsPerCopy: number | undefined; let pagesPerSheet: number | undefined

      if (product.category === "booklet") {
        // booklet_imposer: pages printed both sides of each sheet
        pagesPerSheet = layout.copiesPerSheet * 2
        const pages = Math.ceil(Math.max(4, input.pages) / 4) * 4
        sheetsPerCopy = Math.ceil(pages / pagesPerSheet)
        good = sheetsPerCopy * qty
      } else {
        good = Math.ceil(qty / layout.copiesPerSheet)
      }

      const { wasteSheets, billableSheets } = applyWaste(good)
      const areaRatio = sheetArea(sheet) / sheetArea(SHEETS[2]!) // SRA3 basis
      const pCost = billableSheets * paper.pricePerSqm * sheetArea(sheet)

      // PrintingRate.resolve() — compare digital vs offset, pick cheapest
      let bestMach: Machine | null = null; let bestPrint = Infinity
      for (const m of MACHINES) {
        let cost: number
        if (m.kind === "digital") {
          const rates = input.colorMode === "COLOR" ? m.color : m.bw
          const per = (input.sides === "DUPLEX" ? rates.duplex : rates.simplex) * areaRatio
          cost = billableSheets * per
        } else {
          const plates = (input.colorMode === "COLOR" ? 4 : 1) * (input.sides === "DUPLEX" ? 2 : 1)
          const run = input.colorMode === "COLOR" ? m.runColor : m.runBw
          cost = plates * m.plateFee + m.makeready + billableSheets * run * (input.sides === "DUPLEX" ? 2 : 1) * areaRatio
        }
        if (cost < bestPrint) { bestPrint = cost; bestMach = m }
      }
      const total = pCost + bestPrint
      if (!best || total < best.cost)
        best = { sheet, layout, good, bill: billableSheets, waste: wasteSheets, cost: total, mach: bestMach!, printing: bestPrint, paper: pCost, sheetsPerCopy, pagesPerSheet }
    }

    const b = best!
    machine = b.mach
    machineReason = b.mach.kind === "offset"
      ? `Offset wins above ~500 sheets — plates pay for themselves on ${b.bill.toLocaleString()} sheets`
      : `Digital is cheaper at ${b.bill.toLocaleString()} sheets — no plates, no make-ready`

    imposition = {
      ...b.layout, goodSheets: b.good, wasteSheets: b.waste, billableSheets: b.bill,
      sheet: b.sheet, bleed: 3, sheetsPerCopy: b.sheetsPerCopy, pagesPerSheet: b.pagesPerSheet,
    }

    paperCost = b.paper
    printingCost = b.printing

    const paperSel = PAPERS.find((p) => p.id === input.paperId) ?? PAPERS[0]!
    lines.push({
      label: `${paperSel.name} ${paperSel.gsm}gsm`,
      detail: `${b.bill.toLocaleString()} × ${b.sheet.label} sheets @ ${ksh2(paperSel.pricePerSqm * sheetArea(b.sheet))}`,
      amount: paperCost,
    })
    lines.push({
      label: `Printing · ${input.colorMode === "COLOR" ? "full colour" : "black only"}`,
      detail: `${b.mach.name} · ${input.sides === "DUPLEX" ? "both sides" : "one side"}`,
      amount: printingCost,
    })

    /* FinishingRate billing bases */
    for (const fid of input.finishingIds) {
      const f = FINISHINGS.find((x) => x.id === fid)
      if (!f) continue
      const sideFactor = f.sideAware && input.sides === "DUPLEX" ? 2 : 1
      let amt = 0; let detail = ""
      if (f.basis === "per_sheet") {
        amt = f.price * b.bill * sideFactor
        detail = `${b.bill.toLocaleString()} sheets @ ${ksh(f.price)}${sideFactor > 1 ? " × 2 sides" : ""}`
      } else if (f.basis === "per_piece") {
        const units = product.category === "booklet" ? qty : qty
        amt = f.price * units
        detail = `${units.toLocaleString()} pcs @ ${ksh2(f.price)}`
      } else {
        amt = f.price
        detail = "flat per job"
      }
      finishingCost += amt
      setupCost += f.setup_fee
      lines.push({ label: f.name, detail, amount: amt })
      if (f.setup_fee) lines.push({ label: `↳ ${f.name} set-up`, detail: "one-off machine set-up", amount: f.setup_fee })
    }
  }

  /* SERVICES */
const design = DESIGN_OPTS.find((d) => d.id === input.designId) ?? DESIGN_OPTS[0]!
const delivery = DELIVERY_OPTS.find((d) => d.id === input.deliveryId) ?? DELIVERY_OPTS[0]!
const rush = RUSH_OPTS.find((r) => r.id === input.rushId) ?? RUSH_OPTS[0]!

  const baseProduction = paperCost + printingCost + finishingCost + setupCost
  const rushCost = baseProduction * rush.price
  const productionCost = baseProduction + rushCost

  /* printing manager margin — folded into the opaque "Printing & finishing" line */
  const brokerMargin = productionCost * broker.marginPct
  const productionWithMargin = productionCost + brokerMargin

  /* Printy's own markup applies to the manager's fulfilment price */
  const { rate: feeRate, reason: feeReason } = resolveFee(productionWithMargin)
  const platformFee = productionWithMargin * feeRate

  const servicesCost = design.price + delivery.price
  let subtotal = productionWithMargin + platformFee + servicesCost

  /* markup cap guard — PlatformFeePolicy.get_max_client_price (on manager price) */
  const mult = maxMultiple(productionWithMargin)
  const maxClientPrice = productionWithMargin + productionWithMargin * mult
  const capped = subtotal > maxClientPrice
  if (capped) subtotal = maxClientPrice

  const vat = subtotal * VAT_RATE
  const total = subtotal + vat
  const unitPrice = total / qty

  /* turnaround */
  let days = product.baseDays + broker.dayOffset
  if (input.finishingIds.length >= 2) days += 1
  if (machine?.kind === "offset") days += 1
  if (design.id === "full") days += 2
  if (rush.id === "48") days = Math.min(days, 2)
  if (rush.id === "24") days = 1
  days = Math.max(1, days)

  /* bulk tiers — the nudge that makes clients order more */
  const tiers: { qty: number; unit: number; save: number }[] = []
  if (withTiers) {
    const next = product.qtyLadder.filter((q) => q > qty).slice(0, 3)
    for (const q of next) {
      const r = calculate({ ...input, quantity: q }, false)
      tiers.push({ qty: q, unit: r.unitPrice, save: Math.max(0, (1 - r.unitPrice / unitPrice) * 100) })
    }
  }

  return {
    product, imposition, areaSqm, machine, machineReason, lines,
    paperCost, printingCost, finishingCost, setupCost, productionCost,
    brokerMargin, productionWithMargin,
    rushCost, platformFee, feeRate, feeReason, servicesCost,
    subtotal, vat, total, unitPrice,
    maxClientPrice, markupMultiple: mult, capped,
    turnaroundDays: days, readyBy: readyDate(days), tiers,
  }
}

export function defaultInput(productId = "business-cards"): CalcInput {
  const p = getProduct(productId)
  return {
    productId: p.id,
    sizeId: p.sizes[0]!.id,
    quantity: p.defaultQty,
    pages: p.pages ?? 32,
    paperId: p.category === "large_format" ? "frontlit" : p.defaultPaper,
    colorMode: "COLOR",
    sides: p.defaultSides,
    finishingIds: [...p.defaultFinishing],
    designId: "none",
    deliveryId: "cbd",
    rushId: "standard",
    brokerId: "b-metro",
  }
}