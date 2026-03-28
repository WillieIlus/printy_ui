import { useMemo, useState, type ReactNode } from "react";

type Variant = "max" | "mini";

type SelectOption = {
  id: string;
  label: string;
};

type PriceOption = SelectOption & {
  multiplier: number;
  aliases?: string[];
};

type Shop = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  turnaround: string;
  priceFactor: number;
};

type Product = {
  id: string;
  name: string;
  previewName: string;
  baseUnit: number;
  setupFee: number;
  defaultFinish: string;
  sizes: PriceOption[];
};

type QuoteLineItem = {
  id: string;
  description: string;
  quantityLabel: string;
  unitPrice: number;
  total: number;
  muted?: boolean;
};

type QuoteDocumentData = {
  calculatorLabel: string;
  reference: string;
  issueDate: string;
  validUntil: string;
  shop: Shop;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specificationLines: string[];
  lineItems: QuoteLineItem[];
  productionSubtotal: number;
  finishingSubtotal: number;
  shopAdjustment: number;
  subtotalExVat: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  perUnitExVat: number;
  perUnitIncVat: number;
  notes: string[];
};

const SHOPS: Shop[] = [
  {
    id: "supa-duka",
    name: "Supa Duka",
    email: "quotes@supaduka.co.ke",
    phone: "+254 700 245 245",
    location: "CBD, Nairobi",
    turnaround: "24 hour turnaround",
    priceFactor: 1,
  },
  {
    id: "pixel-press",
    name: "Pixel Press",
    email: "hello@pixelpress.co.ke",
    phone: "+254 712 222 410",
    location: "Westlands, Nairobi",
    turnaround: "48 hour turnaround",
    priceFactor: 1.06,
  },
  {
    id: "urban-ink",
    name: "Urban Ink",
    email: "team@urbanink.co.ke",
    phone: "+254 733 903 314",
    location: "Kilimani, Nairobi",
    turnaround: "72 hour turnaround",
    priceFactor: 1.11,
  },
  {
    id: "swift-print-house",
    name: "Swift Print House",
    email: "sales@swiftprint.ke",
    phone: "+254 701 884 512",
    location: "Mombasa Road, Nairobi",
    turnaround: "Same day collection",
    priceFactor: 0.97,
  },
];

const PRODUCTS: Product[] = [
  {
    id: "business-cards",
    name: "Business Cards",
    previewName: "Business Card",
    baseUnit: 2.55,
    setupFee: 85,
    defaultFinish: "Matte",
    sizes: [
      { id: "85x55", label: "85 by 55 mm", multiplier: 1 },
      { id: "90x50", label: "90 by 50 mm", multiplier: 0.96 },
      { id: "square-card", label: "65 by 65 mm", multiplier: 1.12 },
    ],
  },
  {
    id: "flyers",
    name: "Flyers",
    previewName: "Flyer",
    baseUnit: 7.2,
    setupFee: 120,
    defaultFinish: "Gloss",
    sizes: [
      { id: "a6", label: "A6", multiplier: 1 },
      { id: "a5", label: "A5", multiplier: 1.28 },
      { id: "a4", label: "A4", multiplier: 1.62 },
    ],
  },
  {
    id: "posters",
    name: "Posters",
    previewName: "Poster",
    baseUnit: 22,
    setupFee: 180,
    defaultFinish: "Silk",
    sizes: [
      { id: "a3", label: "A3", multiplier: 1 },
      { id: "a2", label: "A2", multiplier: 1.48 },
      { id: "a1", label: "A1", multiplier: 1.95 },
    ],
  },
  {
    id: "brochures",
    name: "Brochures",
    previewName: "Brochure",
    baseUnit: 12.5,
    setupFee: 160,
    defaultFinish: "Gloss",
    sizes: [
      { id: "tri-fold-a4", label: "A4 tri-fold", multiplier: 1 },
      { id: "bi-fold-a4", label: "A4 bi-fold", multiplier: 1.12 },
      { id: "a5-booklet", label: "A5 booklet", multiplier: 1.2 },
    ],
  },
  {
    id: "stickers",
    name: "Stickers",
    previewName: "Sticker",
    baseUnit: 5.8,
    setupFee: 110,
    defaultFinish: "Gloss",
    sizes: [
      { id: "small-sheet", label: "Small sheet", multiplier: 1 },
      { id: "medium-sheet", label: "Medium sheet", multiplier: 1.22 },
      { id: "die-cut", label: "Die-cut custom", multiplier: 1.34 },
    ],
  },
];

const PRINT_SIDES: PriceOption[] = [
  { id: "single", label: "Single side", multiplier: 1 },
  { id: "double", label: "Both sides", multiplier: 1.12 },
];

const PAPER_WEIGHTS: PriceOption[] = [
  { id: "170", label: "170 gsm", multiplier: 0.93 },
  { id: "250", label: "250 gsm", multiplier: 1 },
  { id: "300", label: "300 gsm", multiplier: 1.08 },
  { id: "350", label: "350 gsm", multiplier: 1.14 },
];

const COLOR_MODES: PriceOption[] = [
  { id: "mono", label: "Mono", multiplier: 0.88 },
  { id: "full", label: "Full color", multiplier: 1.1 },
];

const LAMINATION_OPTIONS: PriceOption[] = [
  { id: "none", label: "No lamination", multiplier: 0 },
  { id: "single", label: "Single side", multiplier: 0.85 },
  { id: "both", label: "Both sides", multiplier: 1.45 },
];

const PAPER_FINISHES: PriceOption[] = [
  { id: "matte", label: "Matte", multiplier: 1 },
  { id: "gloss", label: "Gloss", multiplier: 1.03 },
  { id: "silk", label: "Silk", multiplier: 1.05 },
  {
    id: "uncoated",
    label: "Uncoated",
    multiplier: 0.96,
    aliases: ["natural"],
  },
  {
    id: "textured",
    label: "Textured",
    multiplier: 1.1,
    aliases: ["linen"],
  },
];

const VAT_RATE = 0.16;

const moneyFormatter = new Intl.NumberFormat("en-KE", {
  maximumFractionDigits: 0,
});

const unitFormatter = new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatKes = (value: number) =>
  `${value < 0 ? "-" : ""}KES ${moneyFormatter.format(Math.round(Math.abs(value)))}`;

const formatUnit = (value: number) =>
  `${value < 0 ? "-" : ""}KES ${unitFormatter.format(Math.abs(value))}`;

const normalizeText = (value: string) => value.trim().toLowerCase();
const formatDate = (value: Date) => dateFormatter.format(value);
const addDays = (value: Date, days: number) => new Date(value.getTime() + days * 24 * 60 * 60 * 1000);
const formatProvidedValue = (value: string, fallback = "Not provided") => value.trim() || fallback;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getQuantityFactor = (quantity: number) => {
  if (quantity >= 2000) return 0.76;
  if (quantity >= 1000) return 0.82;
  if (quantity >= 500) return 0.89;
  if (quantity >= 250) return 0.95;
  return 1;
};

const getById = <T extends { id: string }>(items: T[], id: string) =>
  items.find((item) => item.id === id) ?? items[0];

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "PQ";

function buildPrintableQuoteHtml(data: QuoteDocumentData) {
  const lineItemsMarkup = data.lineItems
    .map(
      (item) => `
        <tr>
          <td>
            <div class="item-title">${escapeHtml(item.description)}</div>
            ${item.muted ? `<div class="item-note">Applied automatically for ${escapeHtml(data.shop.name)} pricing.</div>` : ""}
          </td>
          <td class="numeric">${escapeHtml(item.quantityLabel)}</td>
          <td class="numeric">${escapeHtml(formatUnit(item.unitPrice))}</td>
          <td class="numeric total-cell">${escapeHtml(formatKes(item.total))}</td>
        </tr>
      `
    )
    .join("");

  const specificationMarkup = data.specificationLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");

  const notesMarkup = data.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("");

  const adjustmentSummaryMarkup =
    Math.abs(data.shopAdjustment) > 0.5
      ? `
        <div class="summary-row">
          <span>Shop adjustment</span>
          <strong>${escapeHtml(formatKes(data.shopAdjustment))}</strong>
        </div>
      `
      : "";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(data.reference)} Quote</title>
        <style>
          :root {
            --navy: #182238;
            --orange: #ff7a1a;
            --slate-950: #020617;
            --slate-900: #0f172a;
            --slate-700: #334155;
            --slate-600: #475569;
            --slate-500: #64748b;
            --slate-300: #cbd5e1;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --white: #ffffff;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: Inter, Arial, Helvetica, sans-serif;
            color: var(--slate-900);
            background: #eef2f7;
            padding: 28px;
          }
          .page {
            max-width: 900px;
            margin: 0 auto;
            background: var(--white);
            border-radius: 28px;
            padding: 36px;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          }
          .header {
            display: flex;
            gap: 24px;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid var(--slate-200);
            padding-bottom: 24px;
          }
          .brand {
            display: flex;
            gap: 14px;
            align-items: center;
          }
          .brand-badge {
            width: 52px;
            height: 52px;
            border-radius: 18px;
            background: var(--navy);
            color: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            letter-spacing: 0.08em;
          }
          .eyebrow {
            margin: 0 0 6px 0;
            color: var(--orange);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0;
            font-size: 34px;
            line-height: 1.05;
          }
          .brand-copy p,
          .meta-card p,
          .block p,
          li,
          td,
          th,
          .summary-row,
          .footer-note {
            font-size: 14px;
            line-height: 1.6;
          }
          .muted {
            color: var(--slate-500);
          }
          .meta-card {
            min-width: 250px;
            background: var(--slate-100);
            border-radius: 20px;
            padding: 18px 20px;
          }
          .meta-row,
          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 18px;
            align-items: flex-start;
          }
          .meta-row + .meta-row,
          .summary-row + .summary-row {
            margin-top: 10px;
          }
          .meta-row span:first-child {
            color: var(--slate-500);
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 11px;
            font-weight: 700;
          }
          .meta-row span:last-child {
            text-align: right;
            font-weight: 700;
            color: var(--slate-900);
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-top: 22px;
          }
          .block {
            background: var(--slate-100);
            border-radius: 20px;
            padding: 18px 20px;
          }
          .block-title {
            margin: 0 0 12px 0;
            color: var(--slate-500);
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 11px;
            font-weight: 800;
          }
          .block p {
            margin: 4px 0;
          }
          ul {
            margin: 0;
            padding-left: 18px;
          }
          .table-wrap {
            overflow: hidden;
            border: 1px solid var(--slate-200);
            border-radius: 20px;
            margin-top: 22px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead {
            background: var(--navy);
            color: var(--white);
          }
          th {
            text-align: left;
            padding: 14px 16px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.16em;
          }
          td {
            padding: 14px 16px;
            border-top: 1px solid var(--slate-200);
            vertical-align: top;
          }
          .numeric {
            text-align: right;
            white-space: nowrap;
          }
          .item-title {
            font-weight: 700;
            color: var(--slate-900);
          }
          .item-note {
            margin-top: 4px;
            color: var(--slate-500);
            font-size: 12px;
          }
          .total-cell {
            font-weight: 800;
          }
          .bottom-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 18px;
            margin-top: 22px;
          }
          .summary-card {
            border: 1px solid var(--slate-200);
            border-radius: 20px;
            padding: 18px 20px;
          }
          .summary-row span {
            color: var(--slate-600);
          }
          .summary-row strong {
            color: var(--slate-900);
            white-space: nowrap;
          }
          .divider {
            height: 1px;
            background: var(--slate-200);
            margin: 14px 0;
          }
          .total-grand span,
          .total-grand strong {
            font-weight: 800;
            color: var(--orange);
          }
          .total-grand strong {
            font-size: 28px;
          }
          .footer-note {
            margin-top: 18px;
            color: var(--slate-500);
            display: flex;
            justify-content: space-between;
            gap: 12px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 11px;
            font-weight: 700;
          }
          @page {
            size: A4;
            margin: 16mm;
          }
          @media print {
            body {
              background: var(--white);
              padding: 0;
            }
            .page {
              box-shadow: none;
              border-radius: 0;
              max-width: none;
              padding: 0;
            }
          }
          @media (max-width: 760px) {
            body {
              padding: 12px;
            }
            .page {
              padding: 22px;
              border-radius: 22px;
            }
            .header,
            .grid,
            .bottom-grid {
              display: block;
            }
            .meta-card,
            .block,
            .summary-card {
              margin-top: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="brand">
                <div class="brand-badge">${escapeHtml(getInitials(data.shop.name))}</div>
                <div class="brand-copy">
                  <p class="eyebrow">Quotation / PDF preview</p>
                  <h1>${escapeHtml(data.shop.name)}</h1>
                  <p class="muted">${escapeHtml(data.shop.location)}</p>
                  <p class="muted">${escapeHtml(data.shop.email)} · ${escapeHtml(data.shop.phone)}</p>
                </div>
              </div>
            </div>

            <div class="meta-card">
              <div class="meta-row"><span>Calculator</span><span>${escapeHtml(data.calculatorLabel)}</span></div>
              <div class="meta-row"><span>Quote no.</span><span>${escapeHtml(data.reference)}</span></div>
              <div class="meta-row"><span>Issue date</span><span>${escapeHtml(data.issueDate)}</span></div>
              <div class="meta-row"><span>Valid until</span><span>${escapeHtml(data.validUntil)}</span></div>
              <div class="meta-row"><span>Turnaround</span><span>${escapeHtml(data.shop.turnaround)}</span></div>
            </div>
          </div>

          <div class="grid">
            <div class="block">
              <p class="block-title">Prepared for</p>
              <p><strong>${escapeHtml(data.customerName)}</strong></p>
              <p>${escapeHtml(data.customerEmail)}</p>
              <p>${escapeHtml(data.customerPhone)}</p>
            </div>
            <div class="block">
              <p class="block-title">Job specification</p>
              <ul>${specificationMarkup}</ul>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="numeric">Qty</th>
                  <th class="numeric">Unit price</th>
                  <th class="numeric">Amount</th>
                </tr>
              </thead>
              <tbody>${lineItemsMarkup}</tbody>
            </table>
          </div>

          <div class="bottom-grid">
            <div class="block">
              <p class="block-title">Notes & terms</p>
              <ul>${notesMarkup}</ul>
            </div>

            <div class="summary-card">
              <div class="summary-row"><span>Production subtotal</span><strong>${escapeHtml(formatKes(data.productionSubtotal))}</strong></div>
              <div class="summary-row"><span>Finishing subtotal</span><strong>${escapeHtml(formatKes(data.finishingSubtotal))}</strong></div>
              ${adjustmentSummaryMarkup}
              <div class="divider"></div>
              <div class="summary-row"><span>Subtotal (ex VAT)</span><strong>${escapeHtml(formatKes(data.subtotalExVat))}</strong></div>
              <div class="summary-row"><span>VAT (${Math.round(data.vatRate * 100)}%)</span><strong>${escapeHtml(formatKes(data.vatAmount))}</strong></div>
              <div class="divider"></div>
              <div class="summary-row total-grand"><span>Total incl. VAT</span><strong>${escapeHtml(formatKes(data.grandTotal))}</strong></div>
              <div class="summary-row"><span>Per unit (ex VAT)</span><strong>${escapeHtml(formatUnit(data.perUnitExVat))}</strong></div>
              <div class="summary-row"><span>Per unit (incl. VAT)</span><strong>${escapeHtml(formatUnit(data.perUnitIncVat))}</strong></div>
            </div>
          </div>

          <div class="footer-note">
            <span>PDF-ready quote generated live</span>
            <span>${escapeHtml(data.reference)}</span>
          </div>
        </div>

        <script>
          window.addEventListener('load', function () {
            setTimeout(function () {
              window.print();
            }, 220);
          });
        </script>
      </body>
    </html>
  `;
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#f7f7f3] px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1550px] space-y-14">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              Tailwind-only print quote calculators with VAT-ready PDF preview
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl">
                Max and Mini print calculators
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Two matching calculator experiences with live pricing, realistic A4 quotation previews,
                subtotals, VAT, and a print-to-PDF download flow.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#max-calc"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#ff7a1a] hover:text-[#ff7a1a]"
            >
              Go to Max Calc
            </a>
            <a
              href="#mini-calc"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#ff7a1a] hover:text-[#ff7a1a]"
            >
              Go to Mini Calc
            </a>
          </div>
        </header>

        <QuoteCalculator variant="max" />
        <QuoteCalculator variant="mini" />
      </div>
    </main>
  );
}

function QuoteCalculator({ variant }: { variant: Variant }) {
  const isMax = variant === "max";
  const defaultProduct = PRODUCTS[0];
  const issuedAt = useMemo(() => new Date(), []);

  const [shopId, setShopId] = useState(SHOPS[0].id);
  const [productId, setProductId] = useState(defaultProduct.id);
  const [quantity, setQuantity] = useState(100);
  const [sizeId, setSizeId] = useState(defaultProduct.sizes[0].id);
  const [printSideId, setPrintSideId] = useState("double");
  const [paperWeightId, setPaperWeightId] = useState("250");
  const [colorModeId, setColorModeId] = useState("full");
  const [paperFinish, setPaperFinish] = useState(defaultProduct.defaultFinish);
  const [laminationId, setLaminationId] = useState("none");
  const [cutting, setCutting] = useState(true);
  const [roundCornering, setRoundCornering] = useState(false);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Every change updates the A4 quote preview instantly."
  );

  const shop = useMemo(() => getById(SHOPS, shopId), [shopId]);
  const product = useMemo(() => getById(PRODUCTS, productId), [productId]);
  const size = useMemo(() => getById(product.sizes, sizeId), [product.sizes, sizeId]);
  const printSide = useMemo(() => getById(PRINT_SIDES, printSideId), [printSideId]);
  const paperWeight = useMemo(() => getById(PAPER_WEIGHTS, paperWeightId), [paperWeightId]);
  const colorMode = useMemo(() => getById(COLOR_MODES, colorModeId), [colorModeId]);
  const lamination = useMemo(() => getById(LAMINATION_OPTIONS, laminationId), [laminationId]);

  const normalizedFinish = normalizeText(paperFinish);
  const matchedFinish =
    PAPER_FINISHES.find((finish) => {
      const searchTerms = [finish.label, ...(finish.aliases ?? [])];
      return searchTerms.some((term) => normalizeText(term) === normalizedFinish);
    }) ?? null;

  const appliedFinishLabel = paperFinish.trim() || product.defaultFinish;
  const finishMultiplier = matchedFinish?.multiplier ?? 1;
  const quantityFactor = getQuantityFactor(quantity);

  const productionSubtotal = useMemo(() => {
    const baseCost =
      product.baseUnit *
      quantity *
      size.multiplier *
      printSide.multiplier *
      paperWeight.multiplier *
      colorMode.multiplier *
      finishMultiplier *
      quantityFactor;

    return baseCost + product.setupFee;
  }, [
    colorMode.multiplier,
    finishMultiplier,
    paperWeight.multiplier,
    printSide.multiplier,
    product.baseUnit,
    product.setupFee,
    quantity,
    quantityFactor,
    size.multiplier,
  ]);

  const laminationCost = useMemo(() => {
    if (lamination.id === "none") return 0;

    const posterMultiplier = product.id === "posters" ? 1.25 : 1;
    return quantity * lamination.multiplier * posterMultiplier;
  }, [lamination.id, lamination.multiplier, product.id, quantity]);

  const cuttingCost = useMemo(() => {
    if (!cutting) return 0;
    if (product.id === "business-cards") return 175;
    if (product.id === "posters") return 120;
    if (product.id === "brochures") return 140;
    return 150;
  }, [cutting, product.id]);

  const roundCorneringCost = useMemo(() => {
    if (!roundCornering) return 0;
    return Math.max(65, quantity * 0.55);
  }, [quantity, roundCornering]);

  const finishingSubtotal = laminationCost + cuttingCost + roundCorneringCost;
  const rawSubtotal = productionSubtotal + finishingSubtotal;
  const shopAdjustment = rawSubtotal * (shop.priceFactor - 1);
  const subtotalExVat = rawSubtotal + shopAdjustment;
  const vatAmount = subtotalExVat * VAT_RATE;
  const grandTotal = subtotalExVat + vatAmount;
  const perUnitExVat = subtotalExVat / Math.max(quantity, 1);
  const perUnitIncVat = grandTotal / Math.max(quantity, 1);

  const selectedFinishings = [
    lamination.id !== "none" ? `Lamination (${lamination.label})` : null,
    cutting ? "Precision cutting" : null,
    roundCornering ? "Round cornering" : null,
  ].filter(Boolean) as string[];

  const quoteReference = `${isMax ? "MAX" : "MINI"}-${product.id
    .slice(0, 3)
    .toUpperCase()}-${quantity}-${shop.id.slice(0, 4).toUpperCase()}`;

  const productionRunCost = Math.max(productionSubtotal - product.setupFee, 0);
  const productionUnitRate = productionRunCost / Math.max(quantity, 1);
  const laminationUnitRate = laminationCost / Math.max(quantity, 1);
  const roundCorneringUnitRate = roundCorneringCost / Math.max(quantity, 1);

  const lineItems = useMemo<QuoteLineItem[]>(() => {
    const items: QuoteLineItem[] = [
      {
        id: "production-run",
        description: `${product.previewName} print production (${size.label}, ${colorMode.label}, ${printSide.label})`,
        quantityLabel: `${quantity} pcs`,
        unitPrice: productionUnitRate,
        total: productionRunCost,
      },
      {
        id: "setup",
        description: "Artwork prepress and machine setup",
        quantityLabel: "1 job",
        unitPrice: product.setupFee,
        total: product.setupFee,
      },
    ];

    if (laminationCost > 0) {
      items.push({
        id: "lamination",
        description: `${lamination.label} lamination`,
        quantityLabel: `${quantity} pcs`,
        unitPrice: laminationUnitRate,
        total: laminationCost,
      });
    }

    if (cutting) {
      items.push({
        id: "cutting",
        description: "Precision cutting / trimming",
        quantityLabel: "1 job",
        unitPrice: cuttingCost,
        total: cuttingCost,
      });
    }

    if (roundCornering) {
      items.push({
        id: "round-cornering",
        description: "Round cornering",
        quantityLabel: `${quantity} pcs`,
        unitPrice: roundCorneringUnitRate,
        total: roundCorneringCost,
      });
    }

    if (Math.abs(shopAdjustment) > 0.5) {
      items.push({
        id: "shop-adjustment",
        description: `${shop.name} pricing adjustment`,
        quantityLabel: "1 job",
        unitPrice: shopAdjustment,
        total: shopAdjustment,
        muted: true,
      });
    }

    return items;
  }, [
    colorMode.label,
    cutting,
    cuttingCost,
    lamination.label,
    laminationCost,
    laminationUnitRate,
    printSide.label,
    product.previewName,
    product.setupFee,
    productionRunCost,
    productionUnitRate,
    quantity,
    roundCornering,
    roundCorneringCost,
    roundCorneringUnitRate,
    shop.name,
    shopAdjustment,
    size.label,
  ]);

  const specificationLines = [
    `${quantity} pcs ${product.previewName}`,
    `${size.label} · ${paperWeight.label}`,
    `${colorMode.label} · ${printSide.label}`,
    `Paper finish: ${appliedFinishLabel}`,
    selectedFinishings.length > 0
      ? `Finishing: ${selectedFinishings.join(", ")}`
      : "Finishing: None selected",
  ];

  const quoteData = useMemo<QuoteDocumentData>(
    () => ({
      calculatorLabel: isMax ? "Admin page calculator" : "Homepage calculator",
      reference: quoteReference,
      issueDate: formatDate(issuedAt),
      validUntil: formatDate(addDays(issuedAt, 7)),
      shop,
      customerName: formatProvidedValue(customerName, "Walk-in Customer"),
      customerEmail: formatProvidedValue(customerEmail),
      customerPhone: formatProvidedValue(customerPhone),
      specificationLines,
      lineItems,
      productionSubtotal,
      finishingSubtotal,
      shopAdjustment,
      subtotalExVat,
      vatRate: VAT_RATE,
      vatAmount,
      grandTotal,
      perUnitExVat,
      perUnitIncVat,
      notes: [
        `Quote valid for 7 calendar days from ${formatDate(issuedAt)}.`,
        `${shop.turnaround}. Final turnaround starts after artwork approval.`,
        `VAT is calculated at ${Math.round(VAT_RATE * 100)}% in accordance with Kenyan tax requirements.`,
        "Delivery, installation, or design revisions are billed separately unless stated.",
      ],
    }),
    [
      customerEmail,
      customerName,
      customerPhone,
      finishingSubtotal,
      grandTotal,
      isMax,
      issuedAt,
      lineItems,
      perUnitExVat,
      perUnitIncVat,
      productionSubtotal,
      quoteReference,
      shop,
      shopAdjustment,
      specificationLines,
      subtotalExVat,
      vatAmount,
    ]
  );

  const handleProductChange = (nextProductId: string) => {
    const nextProduct = getById(PRODUCTS, nextProductId);
    setProductId(nextProductId);
    setSizeId(nextProduct.sizes[0].id);
    setPaperFinish(nextProduct.defaultFinish);
    setStatusMessage(`${nextProduct.name} selected. PDF quote updated instantly.`);
  };

  const handleFindAnotherShop = () => {
    const currentIndex = SHOPS.findIndex((entry) => entry.id === shopId);
    const nextShop = SHOPS[(currentIndex + 1) % SHOPS.length];
    setShopId(nextShop.id);
    setStatusMessage(`Now quoting with ${nextShop.name}.`);
  };

  const handlePrintQuote = () => {
    if (typeof window === "undefined") return;

    const printWindow = window.open("", "_blank", "width=980,height=760");

    if (!printWindow) {
      setStatusMessage("Your browser blocked the quote window. Allow pop-ups and try again.");
      return;
    }

    const printableHtml = buildPrintableQuoteHtml(quoteData);

    printWindow.document.open();
    printWindow.document.write(printableHtml);
    printWindow.document.close();
    setStatusMessage("Formatted quote opened. Choose Save as PDF in your browser print dialog.");
  };

  const sectionTitle = isMax ? "Max Calc" : "Mini Calc";
  const sectionAnchor = isMax ? "max-calc" : "mini-calc";
  const calculatorLabel = isMax ? "Admin page calculator" : "Homepage calculator";

  const actionButtons = isMax ? (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <ActionButton variant="secondary" onClick={handlePrintQuote}>
        Download PDF quote
      </ActionButton>
      <ActionButton variant="primary" onClick={handleFindAnotherShop}>
        Find another print shop
      </ActionButton>
    </div>
  ) : (
    <div className="mt-6 flex flex-col gap-4">
      <ActionButton variant="primary" onClick={handleFindAnotherShop}>
        Find another print shop
      </ActionButton>
      <ActionButton variant="secondary" onClick={handlePrintQuote}>
        Download PDF quote
      </ActionButton>
    </div>
  );

  return (
    <section id={sectionAnchor} className="space-y-5 scroll-mt-8">
      <h2 className="text-[clamp(3rem,5vw,4.2rem)] font-black leading-none tracking-tight text-black">
        {sectionTitle}
      </h2>

      <div
        className={`rounded-[2.6rem] bg-[#182238] p-5 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.65)] sm:p-7 lg:p-8 ${
          isMax ? "lg:grid lg:grid-cols-[1.08fr_0.98fr] lg:gap-6" : "lg:grid lg:grid-cols-[1.02fr_0.95fr] lg:gap-7"
        }`}
      >
        <div className="space-y-6 p-1 sm:p-2">
          <div className="space-y-6">
            <p className="text-lg font-black uppercase tracking-[0.14em] text-[#ff9b44] sm:text-xl">
              {calculatorLabel}
            </p>

            <SelectField
              label="Print shops"
              value={shopId}
              onChange={(value) => {
                setShopId(value);
                setStatusMessage(`Now quoting with ${getById(SHOPS, value).name}.`);
              }}
              options={SHOPS.map((entry) => ({ id: entry.id, label: entry.name }))}
            />

            <div className="rounded-[1.8rem] border border-white/12 bg-white/[0.05] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Client details</p>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-300">
                  Shown on PDF quote
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <TextField
                  label="Name"
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="Walk-in Customer"
                />
                <TextField
                  label="Email"
                  value={customerEmail}
                  onChange={setCustomerEmail}
                  placeholder="client@example.com"
                  inputType="email"
                />
                <TextField
                  label="Phone"
                  value={customerPhone}
                  onChange={setCustomerPhone}
                  placeholder="+254 700 000 000"
                  inputType="tel"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Product"
                value={productId}
                onChange={handleProductChange}
                options={PRODUCTS.map((entry) => ({ id: entry.id, label: entry.name }))}
              />

              <NumberField
                label="Quantity"
                value={quantity}
                onChange={(nextValue) => {
                  setQuantity(Math.max(1, nextValue));
                  setStatusMessage("Quantity updated.");
                }}
              />

              <SelectField
                label="Size"
                value={sizeId}
                onChange={(value) => {
                  setSizeId(value);
                  setStatusMessage("Size updated.");
                }}
                options={product.sizes.map((entry) => ({ id: entry.id, label: entry.label }))}
              />

              <SelectField
                label="Print sides"
                value={printSideId}
                onChange={(value) => {
                  setPrintSideId(value);
                  setStatusMessage("Print sides updated.");
                }}
                options={PRINT_SIDES}
              />

              <SelectField
                label="Paper gsm"
                value={paperWeightId}
                onChange={(value) => {
                  setPaperWeightId(value);
                  setStatusMessage("Paper weight updated.");
                }}
                options={PAPER_WEIGHTS}
              />

              <SelectField
                label="Color mode"
                value={colorModeId}
                onChange={(value) => {
                  setColorModeId(value);
                  setStatusMessage("Color mode updated.");
                }}
                options={COLOR_MODES}
              />
            </div>

            <TextField
              label="Paper finish"
              value={paperFinish}
              onChange={(value) => {
                setPaperFinish(value);
                setStatusMessage("Paper finish updated.");
              }}
              placeholder="Matte / Gloss / Silk / Uncoated"
              listId={`finish-options-${variant}`}
            />
            <datalist id={`finish-options-${variant}`}>
              {PAPER_FINISHES.map((finish) => (
                <option key={finish.id} value={finish.label} />
              ))}
            </datalist>

            <div className="rounded-[1.8rem] border border-white/12 bg-white/[0.05] p-5 sm:p-6">
              <div className="space-y-5">
                <div>
                  <p className="text-[1.15rem] font-medium text-white sm:text-[1.25rem]">
                    Finishing services
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Lamination
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {LAMINATION_OPTIONS.map((option) => (
                      <ChoiceButton
                        key={option.id}
                        active={laminationId === option.id}
                        onClick={() => {
                          setLaminationId(option.id);
                          setStatusMessage(`${option.label} selected.`);
                        }}
                      >
                        {option.label}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ChoiceButton
                    active={cutting}
                    onClick={() => {
                      setCutting((current) => !current);
                      setStatusMessage(!cutting ? "Precision cutting added." : "Precision cutting removed.");
                    }}
                  >
                    Cutting
                  </ChoiceButton>

                  <ChoiceButton
                    active={roundCornering}
                    onClick={() => {
                      setRoundCornering((current) => !current);
                      setStatusMessage(
                        !roundCornering ? "Round cornering added." : "Round cornering removed."
                      );
                    }}
                  >
                    Round Cornering
                  </ChoiceButton>
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.6rem] border border-dashed border-white/14 bg-white/[0.03] p-4 sm:grid-cols-2">
              <InfoStat label="Turnaround" value={shop.turnaround} />
              <InfoStat label="Pickup / location" value={shop.location} />
            </div>
          </div>
        </div>

        <div className={`mt-8 flex flex-col ${isMax ? "lg:mt-0" : "lg:mt-0 lg:items-end"}`}>
          {isMax ? (
            <h3 className="mb-5 text-center text-[clamp(2.5rem,4vw,3.9rem)] font-black leading-none tracking-tight text-[#ff7a1a]">
              Quote Preview
            </h3>
          ) : (
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#ff9b44]">
              PDF-ready quote preview
            </p>
          )}

          <div className={`w-full ${isMax ? "" : "lg:max-w-[34rem]"}`}>
            <QuotePreviewSheet data={quoteData} />
            {actionButtons}
            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">{statusMessage}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[1.15rem] font-medium text-white sm:text-[1.2rem]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-16 w-full appearance-none rounded-[1.35rem] border border-white/16 bg-white/[0.06] px-5 pr-12 text-lg font-medium text-white outline-none transition focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 sm:h-[4.4rem]"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id} className="text-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[1.15rem] font-medium text-white sm:text-[1.2rem]">{label}</label>
      <input
        type="number"
        min={1}
        step={50}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 1)}
        className="h-16 w-full rounded-[1.35rem] border border-white/16 bg-white/[0.06] px-5 text-lg font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 sm:h-[4.4rem]"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  listId,
  inputType = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  listId?: string;
  inputType?: "text" | "email" | "tel";
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[1.15rem] font-medium text-white sm:text-[1.2rem]">{label}</label>
      <input
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        list={listId}
        className="h-16 w-full rounded-[1.35rem] border border-white/16 bg-white/[0.06] px-5 text-lg font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 sm:h-[4.4rem]"
      />
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[4.25rem] rounded-[1.2rem] border px-4 py-3 text-base font-semibold transition sm:text-lg ${
        active
          ? "border-[#ff7a1a] bg-[#ff7a1a] text-white shadow-[0_14px_35px_-20px_rgba(255,122,26,0.85)]"
          : "border-white/14 bg-white/[0.05] text-slate-300 hover:border-[#ff7a1a]/50 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ActionButton({
  children,
  onClick,
  variant,
}: {
  children: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "bg-[#ff7a1a] text-white hover:bg-[#ff8f3f] shadow-[0_18px_40px_-24px_rgba(255,122,26,0.95)]"
      : "border border-white/16 bg-white/[0.05] text-white hover:border-white/30 hover:bg-white/[0.08]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[5rem] w-full rounded-full px-6 py-4 text-lg font-extrabold transition sm:text-[1.05rem] ${className}`}
    >
      {children}
    </button>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-[1.2rem] bg-white/[0.04] p-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="text-base font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function QuotePreviewSheet({ data }: { data: QuoteDocumentData }) {
  return (
    <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182238] text-base font-black tracking-[0.16em] text-white">
              {getInitials(data.shop.name)}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f18a34]">
                Quotation / PDF preview
              </p>
              <h4 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
                {data.shop.name}
              </h4>
            </div>
          </div>

          <div className="text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
            <p>{data.shop.location}</p>
            <p>{data.shop.email}</p>
            <p>{data.shop.phone}</p>
          </div>
        </div>

        <div className="grid min-w-[15rem] gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:min-w-[17rem]">
          <MetaRow label="Calculator" value={data.calculatorLabel} />
          <MetaRow label="Quote no." value={data.reference} />
          <MetaRow label="Issue date" value={data.issueDate} />
          <MetaRow label="Valid until" value={data.validUntil} />
          <MetaRow label="Turnaround" value={data.shop.turnaround} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <QuoteBlock title="Prepared for">
          <p className="font-semibold text-slate-900">{data.customerName}</p>
          <p>{data.customerEmail}</p>
          <p>{data.customerPhone}</p>
        </QuoteBlock>

        <QuoteBlock title="Job specification">
          <ul className="space-y-1 pl-4">
            {data.specificationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </QuoteBlock>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.35rem] border border-slate-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-900 text-left text-white">
            <tr>
              <th className="px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.18em] sm:px-5">
                Description
              </th>
              <th className="px-4 py-3 text-right text-[0.68rem] font-black uppercase tracking-[0.18em] sm:px-5">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-[0.68rem] font-black uppercase tracking-[0.18em] sm:px-5">
                Unit price
              </th>
              <th className="px-4 py-3 text-right text-[0.68rem] font-black uppercase tracking-[0.18em] sm:px-5">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.map((item) => (
              <tr key={item.id} className="border-t border-slate-200 align-top">
                <td className="px-4 py-4 text-sm leading-6 text-slate-700 sm:px-5 sm:text-[0.95rem]">
                  <p className={`font-semibold ${item.muted ? "text-slate-500" : "text-slate-900"}`}>
                    {item.description}
                  </p>
                  {item.muted ? (
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">
                      Auto adjustment for selected print shop
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-600 sm:px-5 sm:text-[0.95rem]">
                  {item.quantityLabel}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-slate-600 sm:px-5 sm:text-[0.95rem]">
                  {formatUnit(item.unitPrice)}
                </td>
                <td className="px-4 py-4 text-right text-sm font-bold text-slate-900 sm:px-5 sm:text-[0.95rem]">
                  {formatKes(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <QuoteBlock title="Notes & terms">
            <ul className="space-y-2 pl-4">
              {data.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </QuoteBlock>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Ready for download
            </p>
            <p className="mt-2">
              This preview is formatted to export cleanly as a client-ready PDF using your browser’s Save
              as PDF option.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <SummaryRow label="Production subtotal" value={formatKes(data.productionSubtotal)} />
          <SummaryRow label="Finishing subtotal" value={formatKes(data.finishingSubtotal)} />
          {Math.abs(data.shopAdjustment) > 0.5 ? (
            <SummaryRow label="Shop adjustment" value={formatKes(data.shopAdjustment)} />
          ) : null}
          <div className="my-4 h-px bg-slate-200" />
          <SummaryRow label="Subtotal (ex VAT)" value={formatKes(data.subtotalExVat)} strong />
          <SummaryRow label={`VAT (${Math.round(data.vatRate * 100)}%)`} value={formatKes(data.vatAmount)} />
          <div className="my-4 h-px bg-slate-200" />
          <SummaryRow label="Total incl. VAT" value={formatKes(data.grandTotal)} accent />
          <SummaryRow label="Per unit (ex VAT)" value={formatUnit(data.perUnitExVat)} />
          <SummaryRow label="Per unit (incl. VAT)" value={formatUnit(data.perUnitIncVat)} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-400">
        <span>PDF-ready quote generated live</span>
        <span>{data.reference}</span>
      </div>
    </div>
  );
}

function QuoteBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 sm:p-5 sm:text-[0.95rem]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
  strong = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className={`text-sm ${strong ? "font-semibold text-slate-700" : "text-slate-500"}`}>{label}</span>
      <span
        className={`text-right font-bold ${
          accent ? "text-3xl leading-none text-[#ff7a1a] sm:text-[2.2rem]" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
