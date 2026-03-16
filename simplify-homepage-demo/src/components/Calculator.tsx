import { useState } from 'react';
import { MapPin, PackageSearch, Printer, CheckCircle2 } from 'lucide-react';

const PRODUCTS = ['Business Cards', 'Flyers', 'Brochures', 'Stickers', 'Banners', 'Receipt Books'];
const LOCATIONS = ['Nairobi CBD', 'Westlands', 'Kilimani', 'Industrial Area', 'Thika Road'];
const SIZES = ['A4', 'A5', 'A6', 'A7', 'Business cards', 'Letter', 'DL'];
const SIDES = ['1-sided (simplex)', '2-sided (duplex)'];
const GRAMMAGE = ['80 gsm', '100 gsm', '130 gsm', '150 gsm', '250 gsm', '300 gsm', '350 gsm'];
const FINISHING = [
  'None',
  'Gloss lamination (single)',
  'Gloss lamination (both sides)',
  'Matte lamination (single)',
  'Matte lamination (both sides)',
  'Spot UV',
  'Foil stamping',
];

const SIZE_MULT: Record<string, number> = { A4: 1, A5: 0.65, A6: 0.5, A7: 0.35, 'Business cards': 0.35, Letter: 1.05, DL: 0.55 };
const GSM_MULT: Record<number, number> = { 80: 0.8, 100: 1, 130: 1.1, 150: 1.2, 250: 1.35, 300: 1.5, 350: 1.7 };
const FINISH_COST: Record<string, { perSheet: number; flat: number }> = {
  'None': { perSheet: 0, flat: 0 },
  'Gloss lamination (single)': { perSheet: 12, flat: 0 },
  'Gloss lamination (both sides)': { perSheet: 25, flat: 0 },
  'Matte lamination (single)': { perSheet: 14, flat: 0 },
  'Matte lamination (both sides)': { perSheet: 28, flat: 0 },
  'Spot UV': { perSheet: 0, flat: 300 },
  'Foil stamping': { perSheet: 0, flat: 450 },
};

export default function Calculator() {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [quantity, setQuantity] = useState('500');
  const [size, setSize] = useState('A6');
  const [sides, setSides] = useState(SIDES[1]);
  const [grammage, setGrammage] = useState('300 gsm');
  const [finishing, setFinishing] = useState(FINISHING[1]);

  const getBasePrice = (prod: string) => {
    switch (prod) {
      case 'Business Cards': return 1.8;
      case 'Flyers': return 1.2;
      case 'Brochures': return 3.5;
      case 'Stickers': return 2.8;
      case 'Banners': return 8;
      case 'Receipt Books': return 6;
      default: return 2;
    }
  };

  const qty = parseInt(quantity, 10) || 1;
  const gsmNum = parseInt(grammage, 10) || 300;
  const sidesMult = sides.includes('2-sided') ? 1.75 : 1;
  const sizeMult = SIZE_MULT[size] ?? 1;
  const gsmMult = GSM_MULT[gsmNum] ?? 1.5;

  const copiesPerSheet = size === 'Business cards' ? 10 : size === 'A6' ? 4 : size === 'A7' ? 8 : size === 'DL' ? 3 : 2;
  const sheetsEst = Math.max(1, Math.ceil(qty / copiesPerSheet));
  const fr = FINISH_COST[finishing] ?? { perSheet: 0, flat: 0 };
  const finishTotal = Math.round(sheetsEst * fr.perSheet + fr.flat);

  const basePrint = getBasePrice(product) * qty * sizeMult * gsmMult * sidesMult;
  const printCost = Math.round(basePrint);
  const estimatedTotal = printCost + finishTotal;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md mx-auto">
      <div className="bg-indigo-600 p-5 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Printer className="w-5 h-5" />
          Get Instant Estimate
        </h3>
        <p className="text-indigo-100 text-sm mt-1">Select your requirements for a live price.</p>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Input: Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery or pickup near</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Input: Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">What do you want to print?</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PackageSearch className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            >
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="block w-full px-3 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="block w-full px-3 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Print sides</label>
            <select
              value={sides}
              onChange={(e) => setSides(e.target.value)}
              className="block w-full px-3 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            >
              {SIDES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Grammage (GSM)</label>
            <select
              value={grammage}
              onChange={(e) => setGrammage(e.target.value)}
              className="block w-full px-3 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
            >
              {GRAMMAGE.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Finishing</label>
          <select
            value={finishing}
            onChange={(e) => setFinishing(e.target.value)}
            className="block w-full px-3 py-2.5 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-gray-50"
          >
            {FINISHING.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

      </div>

      {/* Output Panel */}
      <div className="bg-gray-50 p-6 border-t border-gray-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Estimated Total</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-gray-900">KES</span>
              <span className="text-3xl font-bold text-indigo-600">{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              12 shops near {location}
            </p>
            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
               <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
               1-2 days turnaround
            </p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          See Prices & Shops
        </button>
      </div>
    </div>
  );
}
