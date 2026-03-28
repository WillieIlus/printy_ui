import type { CalcInputs, CalcResult } from "../data/pricing";

interface QuotePreviewProps {
  inputs: CalcInputs;
  result: CalcResult;
  compact?: boolean;
}

export default function QuotePreview({ inputs, result, compact }: QuotePreviewProps) {
  const {
    unitPrice, printSubtotal, finishingTotal,
    estimatedTotal, productLabel, sizeLabel, paperGsmLabel,
    finishLabel, sidesLabel, colorLabel,
  } = result;

  const colorDesc = colorLabel === "Full color" ? "Full colour" : "Black & white";

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 h-full">
      {/* Header */}
      <div>
        <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Quote Template</p>
        <p className="text-gray-800 text-sm font-medium">Name: {inputs.shop}</p>
        <p className="text-gray-800 text-sm font-medium">Email:</p>
        <p className="text-gray-800 text-sm font-medium">Phone:</p>
      </div>

      <p className="text-gray-500 text-sm italic">Sign in to save your details</p>

      {/* Job summary */}
      <div className="flex-1">
        {inputs.product && inputs.quantity > 0 ? (
          <div className="space-y-0.5">
            <p className="text-gray-800 text-sm font-medium">{inputs.quantity} pcs {productLabel}</p>
            <p className="text-gray-500 text-sm">{colorDesc} - {sidesLabel}</p>
            {sizeLabel && paperGsmLabel && (
              <p className="text-gray-500 text-sm">
                {sizeLabel} - {paperGsmLabel} - {finishLabel}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Fill in the form to see your quote.</p>
        )}
      </div>

      {/* Totals */}
      <div className={`border-t border-gray-200 pt-3 ${compact ? "mt-2" : "mt-4"}`}>
        <div className="flex justify-between text-sm text-gray-500 mb-0.5">
          <span>Print subtotal</span>
          <span>KES {printSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Finishing</span>
          <span>KES {finishingTotal.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 text-sm">Finishing total</p>
        <p className="text-gray-900 font-bold text-lg">KES {finishingTotal.toLocaleString()}</p>

        <p className="text-gray-600 text-sm mt-2">Estimated Total</p>
        <p className="text-orange-500 font-extrabold text-3xl leading-tight">
          KES {estimatedTotal.toLocaleString()}
        </p>

        <p className="text-gray-700 text-sm mt-1">KES {unitPrice} per unit</p>
        <p className="text-gray-500 text-xs mt-0.5">Live backend preview from {inputs.shop}</p>
      </div>
    </div>
  );
}
