import { useState, useEffect } from "react";
import type { CalcInputs, FinishingOptions} from "../data/pricing";
import {
  PRINT_SHOPS, PRODUCTS, SIZES, PAPER_TYPES, PAPER_FINISH,
  PRINT_SIDES, COLOR_MODES, calculate,
} from "../data/pricing";
import QuotePreview from "./QuotePreview";
import PDFQuoteModal from "./PDFQuoteModal";

const defaultFinishing: FinishingOptions = {
  laminationBoth: false,
  laminationSingle: false,
  cutting: false,
  roundCornering: false,
};

const defaultInputs: CalcInputs = {
  shop: "Supa Duka",
  product: "business_card",
  quantity: 100,
  size: "85x55",
  printSides: "single",
  paperGsm: "300",
  paperFinish: "matte",
  colorMode: "full",
  finishing: defaultFinishing,
};

function DarkSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#252b38] border border-[#353b48] text-gray-300 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-orange-500 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
    </div>
  );
}

function ToggleBtn({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all duration-150
        ${active
          ? "bg-orange-500 border-orange-500 text-white"
          : "bg-transparent border-[#3a3f4a] text-gray-400 hover:border-orange-400 hover:text-orange-400"
        }`}
    >
      {children}
    </button>
  );
}

export default function MaxCalc() {
  const [inputs, setInputs] = useState<CalcInputs>(defaultInputs);
  const [showPDF, setShowPDF] = useState(false);

  const set = (key: keyof CalcInputs, value: unknown) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const setFinishing = (key: keyof FinishingOptions, value: boolean) =>
    setInputs((prev) => ({ ...prev, finishing: { ...prev.finishing, [key]: value } }));

  useEffect(() => {
    const sizes = SIZES[inputs.product] ?? [];
    const papers = PAPER_TYPES[inputs.product] ?? [];
    setInputs((prev) => ({
      ...prev,
      size: sizes[0]?.value ?? "",
      paperGsm: papers[0]?.value ?? "",
    }));
  }, [inputs.product]);

  const result = calculate(inputs);
  const sizes = SIZES[inputs.product] ?? [];
  const papers = PAPER_TYPES[inputs.product] ?? [];

  return (
    <div className="flex gap-6 w-full items-start">

      {/* ── LEFT: Admin Calculator ── */}
      <div className="flex-1 bg-[#1c2130] rounded-3xl p-7 flex flex-col gap-5">
        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest">Admin Page Calculator</p>

        {/* Print shops */}
        <div>
          <label className="text-gray-200 text-sm mb-2 block">Print shops</label>
          <DarkSelect
            value={inputs.shop}
            onChange={(v) => set("shop", v)}
            options={PRINT_SHOPS.map((s) => ({ label: s, value: s }))}
          />
        </div>

        {/* Product & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Product</label>
            <DarkSelect
              value={inputs.product}
              onChange={(v) => set("product", v)}
              options={PRODUCTS}
            />
          </div>
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Quantity</label>
            <input
              type="number"
              min={1}
              value={inputs.quantity}
              onChange={(e) => set("quantity", Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#252b38] border border-[#353b48] text-gray-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 text-center"
            />
          </div>
        </div>

        {/* Size & Print sides */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Size</label>
            <DarkSelect
              value={inputs.size}
              onChange={(v) => set("size", v)}
              options={sizes}
            />
          </div>
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Print sides</label>
            <DarkSelect
              value={inputs.printSides}
              onChange={(v) => set("printSides", v)}
              options={PRINT_SIDES}
            />
          </div>
        </div>

        {/* Paper gsm & Color mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Paper gsm</label>
            <DarkSelect
              value={inputs.paperGsm}
              onChange={(v) => set("paperGsm", v)}
              options={papers}
            />
          </div>
          <div>
            <label className="text-gray-200 text-sm mb-2 block">Color mode</label>
            <DarkSelect
              value={inputs.colorMode}
              onChange={(v) => set("colorMode", v)}
              options={COLOR_MODES}
            />
          </div>
        </div>

        {/* Paper finish (labelled "Paper gsm" as per the design) */}
        <div>
          <label className="text-gray-200 text-sm mb-2 block">Paper gsm</label>
          <DarkSelect
            value={inputs.paperFinish}
            onChange={(v) => set("paperFinish", v)}
            options={PAPER_FINISH}
          />
        </div>

        {/* Finishing services */}
        <div>
          <p className="text-gray-200 text-sm mb-3 text-center">Finishing services</p>
          <div className="bg-[#252b38] border border-[#353b48] rounded-2xl p-4 flex flex-col gap-3">
            {/* Lamination label + toggle row */}
            <p className="text-gray-400 text-xs text-center">Lamination</p>
            <div className="flex gap-3 justify-center">
              <ToggleBtn
                active={inputs.finishing.laminationBoth}
                onClick={() => {
                  const next = !inputs.finishing.laminationBoth;
                  setFinishing("laminationBoth", next);
                  if (next) setFinishing("laminationSingle", false);
                }}
              >
                Both sides
              </ToggleBtn>
              <ToggleBtn
                active={inputs.finishing.laminationSingle}
                onClick={() => {
                  const next = !inputs.finishing.laminationSingle;
                  setFinishing("laminationSingle", next);
                  if (next) setFinishing("laminationBoth", false);
                }}
              >
                Single side
              </ToggleBtn>
            </div>

            {/* Cutting */}
            <div>
              <ToggleBtn
                active={inputs.finishing.cutting}
                onClick={() => setFinishing("cutting", !inputs.finishing.cutting)}
              >
                Cutting
              </ToggleBtn>
            </div>

            {/* Round Cornering */}
            <div>
              <ToggleBtn
                active={inputs.finishing.roundCornering}
                onClick={() => setFinishing("roundCornering", !inputs.finishing.roundCornering)}
              >
                Round Cornering
              </ToggleBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Quote Preview ── */}
      <div className="flex-1 bg-[#1c2130] rounded-3xl p-7 flex flex-col gap-5">
        <h2 className="text-orange-500 font-extrabold text-4xl text-center tracking-tight">Quote Preview</h2>

        {/* White card */}
        <div className="flex-1">
          <QuotePreview inputs={inputs} result={result} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowPDF(true)}
            className="flex-1 bg-[#252b38] border border-gray-600 text-white font-semibold py-3.5 rounded-full text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
          >
            Preview &amp; Download PDF
          </button>
          <button className="flex-1 bg-orange-500 text-white font-semibold py-3.5 rounded-full text-sm hover:bg-orange-600 transition-colors">
            Find another print shop
          </button>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDF && (
        <PDFQuoteModal
          inputs={inputs}
          result={result}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}
