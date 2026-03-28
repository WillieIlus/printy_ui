import MaxCalc from "./components/MaxCalc";
import MiniCalc from "./components/MiniCalc";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] px-8 py-10">
      {/* ── Max Calc ── */}
      <section className="mb-14">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Max Calc</h1>
        <MaxCalc />
      </section>

      {/* ── Mini Calc ── */}
      <section>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Mini Calc</h1>
        <MiniCalc />
      </section>
    </div>
  );
}
