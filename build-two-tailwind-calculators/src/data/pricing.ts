export const PRINT_SHOPS = ["Supa Duka", "Print King", "Quick Print", "City Press"];

export const PRODUCTS = [
  { label: "Business Card", value: "business_card" },
  { label: "Flyer A5", value: "flyer_a5" },
  { label: "Flyer A4", value: "flyer_a4" },
  { label: "Poster A3", value: "poster_a3" },
  { label: "Brochure", value: "brochure" },
  { label: "Banner", value: "banner" },
];

export const SIZES: Record<string, { label: string; value: string }[]> = {
  business_card: [
    { label: "85 by 55 cm", value: "85x55" },
    { label: "90 by 50 cm", value: "90x50" },
  ],
  flyer_a5: [
    { label: "148 by 210 mm", value: "148x210" },
    { label: "150 by 210 mm", value: "150x210" },
  ],
  flyer_a4: [
    { label: "210 by 297 mm", value: "210x297" },
  ],
  poster_a3: [
    { label: "297 by 420 mm", value: "297x420" },
  ],
  brochure: [
    { label: "210 by 297 mm", value: "210x297" },
    { label: "148 by 210 mm", value: "148x210" },
  ],
  banner: [
    { label: "600 by 900 mm", value: "600x900" },
    { label: "900 by 1200 mm", value: "900x1200" },
  ],
};

export const PAPER_TYPES: Record<string, { label: string; value: string }[]> = {
  business_card: [
    { label: "250 gsm", value: "250" },
    { label: "300 gsm", value: "300" },
    { label: "350 gsm", value: "350" },
  ],
  flyer_a5: [
    { label: "115 gsm", value: "115" },
    { label: "130 gsm", value: "130" },
    { label: "170 gsm", value: "170" },
  ],
  flyer_a4: [
    { label: "115 gsm", value: "115" },
    { label: "130 gsm", value: "130" },
    { label: "170 gsm", value: "170" },
  ],
  poster_a3: [
    { label: "170 gsm", value: "170" },
    { label: "200 gsm", value: "200" },
  ],
  brochure: [
    { label: "130 gsm", value: "130" },
    { label: "170 gsm", value: "170" },
  ],
  banner: [
    { label: "440 gsm", value: "440" },
    { label: "510 gsm", value: "510" },
  ],
};

// paper finish options for each gsm
export const PAPER_FINISH: { label: string; value: string }[] = [
  { label: "Matte", value: "matte" },
  { label: "Gloss", value: "gloss" },
  { label: "Silk", value: "silk" },
];

export const PRINT_SIDES: { label: string; value: string }[] = [
  { label: "Single side", value: "single" },
  { label: "Both sides", value: "both" },
];

export const COLOR_MODES: { label: string; value: string }[] = [
  { label: "Full color", value: "full" },
  { label: "Black & white", value: "bw" },
];

// Base price per unit (KES) for each product
const BASE_PRICE: Record<string, number> = {
  business_card: 2,
  flyer_a5: 5,
  flyer_a4: 8,
  poster_a3: 20,
  brochure: 15,
  banner: 300,
};

// Multipliers
const SIDES_MULT: Record<string, number> = { single: 1, both: 1.6 };
const COLOR_MULT: Record<string, number> = { full: 1, bw: 0.65 };
const GSM_SURCHARGE: Record<string, number> = {
  "115": 0, "130": 0.1, "170": 0.2, "200": 0.3,
  "250": 0, "300": 0.15, "350": 0.25,
  "440": 0, "510": 0.2,
};

// Finishing prices (KES flat)
export const LAMINATION_BOTH = 175;
export const LAMINATION_SINGLE = 100;
export const CUTTING_PRICE = 50;
export const ROUND_CORNERING_PRICE = 80;

export interface FinishingOptions {
  laminationBoth: boolean;
  laminationSingle: boolean;
  cutting: boolean;
  roundCornering: boolean;
}

export interface CalcInputs {
  shop: string;
  product: string;
  quantity: number;
  size: string;
  printSides: string;
  paperGsm: string;
  paperFinish: string;
  colorMode: string;
  finishing: FinishingOptions;
}

export interface FinishingLineItem {
  label: string;
  amount: number;
}

export interface CalcResult {
  unitPrice: number;
  printSubtotal: number;
  finishingTotal: number;
  subtotal: number;
  vat: number;
  estimatedTotal: number;
  productLabel: string;
  sizeLabel: string;
  paperGsmLabel: string;
  finishLabel: string;
  sidesLabel: string;
  colorLabel: string;
  finishingItems: FinishingLineItem[];
}

export const VAT_RATE = 0.16; // 16% VAT

export function generateQuoteNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `QT-${y}${m}${d}-${rand}`;
}

export function calculate(inputs: CalcInputs): CalcResult {
  const base = BASE_PRICE[inputs.product] ?? 2;
  const sidesMult = SIDES_MULT[inputs.printSides] ?? 1;
  const colorMult = COLOR_MULT[inputs.colorMode] ?? 1;
  const gsmSurcharge = GSM_SURCHARGE[inputs.paperGsm] ?? 0;

  const unitPrice = parseFloat((base * sidesMult * colorMult * (1 + gsmSurcharge)).toFixed(2));

  const finishingItems: FinishingLineItem[] = [];
  let finishingTotal = 0;
  if (inputs.finishing.laminationBoth) {
    finishingItems.push({ label: "Lamination — Both sides", amount: LAMINATION_BOTH });
    finishingTotal += LAMINATION_BOTH;
  }
  if (inputs.finishing.laminationSingle) {
    finishingItems.push({ label: "Lamination — Single side", amount: LAMINATION_SINGLE });
    finishingTotal += LAMINATION_SINGLE;
  }
  if (inputs.finishing.cutting) {
    finishingItems.push({ label: "Cutting", amount: CUTTING_PRICE });
    finishingTotal += CUTTING_PRICE;
  }
  if (inputs.finishing.roundCornering) {
    finishingItems.push({ label: "Round Cornering", amount: ROUND_CORNERING_PRICE });
    finishingTotal += ROUND_CORNERING_PRICE;
  }

  const printSubtotal = parseFloat((unitPrice * (inputs.quantity || 0)).toFixed(2));
  const subtotal = parseFloat((printSubtotal + finishingTotal).toFixed(2));
  const vat = parseFloat((subtotal * VAT_RATE).toFixed(2));
  const estimatedTotal = Math.round(subtotal + vat);

  const productLabel = PRODUCTS.find((p) => p.value === inputs.product)?.label ?? inputs.product;
  const sizes = SIZES[inputs.product] ?? [];
  const sizeLabel = sizes.find((s) => s.value === inputs.size)?.label ?? inputs.size;
  const papers = PAPER_TYPES[inputs.product] ?? [];
  const paperGsmLabel = papers.find((p) => p.value === inputs.paperGsm)?.label ?? `${inputs.paperGsm} gsm`;
  const finishLabel = PAPER_FINISH.find((f) => f.value === inputs.paperFinish)?.label ?? inputs.paperFinish;
  const sidesLabel = PRINT_SIDES.find((s) => s.value === inputs.printSides)?.label ?? inputs.printSides;
  const colorLabel = COLOR_MODES.find((c) => c.value === inputs.colorMode)?.label ?? inputs.colorMode;

  return {
    unitPrice, printSubtotal, finishingTotal, subtotal, vat, estimatedTotal,
    productLabel, sizeLabel, paperGsmLabel, finishLabel, sidesLabel, colorLabel,
    finishingItems,
  };
}
