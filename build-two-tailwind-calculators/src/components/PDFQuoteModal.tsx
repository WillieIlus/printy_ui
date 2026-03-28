import { useRef, useState } from "react";
import type { CalcInputs, CalcResult} from "../data/pricing";
import { VAT_RATE, generateQuoteNumber } from "../data/pricing";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFQuoteModalProps {
  inputs: CalcInputs;
  result: CalcResult;
  onClose: () => void;
}

export default function PDFQuoteModal({ inputs, result, onClose }: PDFQuoteModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [quoteNumber] = useState(generateQuoteNumber);
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(today.getDate() + 30);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const {
    unitPrice, printSubtotal, finishingTotal, subtotal, vat,
    estimatedTotal, productLabel, sizeLabel, paperGsmLabel,
    finishLabel, sidesLabel, colorLabel, finishingItems,
  } = result;

  const colorDesc = colorLabel === "Full color" ? "Full Colour" : "Black & White";

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`${quoteNumber}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">

        {/* ── Modal toolbar ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1c2130] rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-orange-500 font-extrabold text-lg tracking-tight">MaxCalc</span>
            <span className="text-gray-400 text-sm">/ Quote Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable preview area ── */}
        <div className="overflow-y-auto flex-1 bg-gray-100 p-6">

          {/* A4 Quote Document */}
          <div
            ref={printRef}
            className="bg-white mx-auto shadow-xl"
            style={{ width: "794px", minHeight: "1123px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >

            {/* ══ HEADER BAND ══ */}
            <div style={{ background: "#1c2130", padding: "36px 48px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* Brand */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{
                      width: "36px", height: "36px", background: "#f97316",
                      borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "white", fontWeight: 900, fontSize: "18px" }}>M</span>
                    </div>
                    <span style={{ color: "white", fontWeight: 900, fontSize: "22px", letterSpacing: "-0.5px" }}>MaxCalc</span>
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>Print Quotation System</p>
                </div>
                {/* Quote meta */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#f97316", fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>QUOTE</p>
                  <p style={{ color: "#d1d5db", fontSize: "13px", margin: "4px 0 2px" }}>{quoteNumber}</p>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>Issued: {fmt(today)}</p>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>Valid until: {fmt(validUntil)}</p>
                </div>
              </div>
            </div>

            {/* ══ ORANGE ACCENT STRIPE ══ */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #f97316, #fb923c, #fdba74)" }} />

            {/* ══ BODY ══ */}
            <div style={{ padding: "36px 48px" }}>

              {/* FROM / TO */}
              <div style={{ display: "flex", gap: "40px", marginBottom: "36px" }}>
                {/* From */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px" }}>From</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{inputs.shop}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 1px" }}>Print Shop Partner</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>via MaxCalc Platform</p>
                </div>
                {/* To */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px" }}>Quote For</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>Customer</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic", margin: "0 0 1px" }}>Email: —</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic", margin: 0 }}>Phone: —</p>
                  <p style={{ fontSize: "10px", color: "#d1d5db", marginTop: "4px", fontStyle: "italic" }}>Sign in to populate your details</p>
                </div>
                {/* Summary badge */}
                <div style={{
                  background: "#fff7ed", border: "1px solid #fed7aa",
                  borderRadius: "12px", padding: "16px 20px", minWidth: "160px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Total Due</p>
                  <p style={{ fontSize: "26px", fontWeight: 900, color: "#f97316", margin: 0, lineHeight: 1 }}>
                    KES {estimatedTotal.toLocaleString()}
                  </p>
                  <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "6px" }}>Incl. 16% VAT</p>
                </div>
              </div>

              {/* ── LINE ITEMS TABLE ── */}
              <div style={{ marginBottom: "28px" }}>
                {/* Table header */}
                <div style={{
                  display: "flex", background: "#1c2130",
                  borderRadius: "8px 8px 0 0", padding: "10px 16px",
                }}>
                  <span style={{ flex: 4, fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px" }}>Description</span>
                  <span style={{ flex: 1, fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Qty</span>
                  <span style={{ flex: 1, fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right" }}>Unit Price</span>
                  <span style={{ flex: 1, fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right" }}>Total</span>
                </div>

                {/* Print row */}
                <div style={{
                  display: "flex", borderBottom: "1px solid #f3f4f6",
                  padding: "14px 16px", background: "#fafafa", alignItems: "flex-start",
                }}>
                  <div style={{ flex: 4 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 3px" }}>{productLabel}</p>
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 1px" }}>
                      {colorDesc} · {sidesLabel}
                    </p>
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                      Size: {sizeLabel} · {paperGsmLabel} · {finishLabel} finish
                    </p>
                  </div>
                  <span style={{ flex: 1, fontSize: "13px", color: "#374151", textAlign: "center" }}>{inputs.quantity.toLocaleString()}</span>
                  <span style={{ flex: 1, fontSize: "13px", color: "#374151", textAlign: "right" }}>KES {unitPrice.toFixed(2)}</span>
                  <span style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "#111827", textAlign: "right" }}>KES {printSubtotal.toLocaleString()}</span>
                </div>

                {/* Finishing rows */}
                {finishingItems.length > 0 && (
                  <>
                    <div style={{ padding: "8px 16px 4px", background: "#f9fafb" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Finishing Services</p>
                    </div>
                    {finishingItems.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex", borderBottom: "1px solid #f3f4f6",
                          padding: "10px 16px", background: i % 2 === 0 ? "#fafafa" : "white", alignItems: "center",
                        }}
                      >
                        <div style={{ flex: 4 }}>
                          <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>{item.label}</p>
                        </div>
                        <span style={{ flex: 1, fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>1</span>
                        <span style={{ flex: 1, fontSize: "12px", color: "#374151", textAlign: "right" }}>KES {item.amount.toLocaleString()}</span>
                        <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#111827", textAlign: "right" }}>KES {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </>
                )}

                {/* Empty finishing placeholder */}
                {finishingItems.length === 0 && (
                  <div style={{
                    display: "flex", borderBottom: "1px solid #f3f4f6",
                    padding: "10px 16px", background: "white", alignItems: "center",
                  }}>
                    <div style={{ flex: 4 }}>
                      <p style={{ fontSize: "12px", color: "#d1d5db", fontStyle: "italic", margin: 0 }}>No finishing services selected</p>
                    </div>
                    <span style={{ flex: 1 }} />
                    <span style={{ flex: 1 }} />
                    <span style={{ flex: 1, fontSize: "12px", color: "#d1d5db", textAlign: "right" }}>KES 0</span>
                  </div>
                )}
              </div>

              {/* ── TOTALS BLOCK ── */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "36px" }}>
                <div style={{ width: "300px" }}>
                  {/* Subtotals */}
                  <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "16px 20px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Print Subtotal</span>
                      <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>KES {printSubtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Finishing Subtotal</span>
                      <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>KES {finishingTotal.toLocaleString()}</span>
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      paddingTop: "8px", borderTop: "1px solid #e5e7eb",
                    }}>
                      <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Subtotal</span>
                      <span style={{ fontSize: "13px", color: "#374151", fontWeight: 700 }}>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>VAT ({(VAT_RATE * 100).toFixed(0)}%)</span>
                      <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>KES {vat.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Grand total */}
                  <div style={{
                    background: "#1c2130", borderRadius: "10px", padding: "16px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: "13px", color: "#d1d5db", fontWeight: 600 }}>TOTAL DUE</span>
                    <span style={{ fontSize: "22px", color: "#f97316", fontWeight: 900 }}>KES {estimatedTotal.toLocaleString()}</span>
                  </div>

                  {/* Per-unit note */}
                  <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "8px" }}>
                    KES {unitPrice.toFixed(2)} per unit · {inputs.quantity.toLocaleString()} units
                  </p>
                </div>
              </div>

              {/* ── NOTES ── */}
              <div style={{
                background: "#fff7ed", border: "1px solid #fed7aa",
                borderRadius: "10px", padding: "16px 20px", marginBottom: "28px",
              }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Notes & Terms</p>
                <p style={{ fontSize: "11px", color: "#92400e", margin: "0 0 3px" }}>
                  · This quote is valid for 30 days from the date of issue.
                </p>
                <p style={{ fontSize: "11px", color: "#92400e", margin: "0 0 3px" }}>
                  · Prices are in Kenyan Shillings (KES) and include 16% VAT.
                </p>
                <p style={{ fontSize: "11px", color: "#92400e", margin: "0 0 3px" }}>
                  · A 50% deposit is required to confirm the order. Balance due on delivery.
                </p>
                <p style={{ fontSize: "11px", color: "#92400e", margin: 0 }}>
                  · Turnaround time: 2–5 business days after artwork approval and payment confirmation.
                </p>
              </div>

              {/* ── BANK DETAILS ── */}
              <div style={{ display: "flex", gap: "24px", marginBottom: "28px" }}>
                <div style={{
                  flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: "10px", padding: "16px 20px",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Payment Details</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Bank</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>Equity Bank Kenya</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Account Name</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{inputs.shop}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Account No.</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>0123456789</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>M-Pesa Till</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>123456</span>
                  </div>
                </div>
                <div style={{
                  flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: "10px", padding: "16px 20px",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Specification Summary</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Product</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{productLabel}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Size</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{sizeLabel}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Paper</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{paperGsmLabel} · {finishLabel}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Print</span>
                    <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600 }}>{colorDesc} · {sidesLabel}</span>
                  </div>
                </div>
              </div>

              {/* ── SIGNATURE ── */}
              <div style={{ display: "flex", gap: "48px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "6px", height: "32px" }} />
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Authorised Signature — {inputs.shop}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "6px", height: "32px" }} />
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Customer Acceptance Signature</p>
                </div>
              </div>
            </div>

            {/* ══ FOOTER BAND ══ */}
            <div style={{ background: "#1c2130", padding: "18px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                Generated by <span style={{ color: "#f97316", fontWeight: 700 }}>MaxCalc</span> · maxcalc.io
              </p>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                {quoteNumber} · {fmt(today)}
              </p>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
