// ============================================================
// FreshGuard AI — Store Manager: Dock Receiving & Deliveries
// ============================================================

import { useState } from 'react';
import { STORE_17_PURCHASE_ORDER } from '../../mocks/purchase-orders';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PackageCheck,
  ShieldCheck,
  Phone,
  FileText
} from 'lucide-react';

export function StoreDeliveriesPage() {
  const [po, setPo] = useState(STORE_17_PURCHASE_ORDER);
  const [dockSigned, setDockSigned] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSignDock = () => {
    setDockSigned(true);
    setPo({ ...po, status: 'acknowledged' as any });
    setFeedback('Receiving dock receipt signed. Cold-chain intake verified and recorded.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
            <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>STORE 017 · CARRIER DOCK RECEIVING &amp; INBOUND LOGISTICS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Inbound Deliveries &amp; PO Status
          </h1>

          <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            Surveillance of incoming carrier shipments, dock appointment windows, and cold-chain intake verification for Branch #017.
          </p>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Inbound Purchase Order Card */}
      <div className="royal-card p-6 sm:p-8 border-[#C5A059]/30 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xl font-editorial text-[#FDFBF7] font-semibold">
                Purchase Order {po.orderNumber}
              </span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                dockSigned ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40' :
                po.status === 'delayed' ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/40' :
                'bg-[#C5A059]/20 text-[#E0C588]'
              }`}>
                {dockSigned ? 'DOCK RECEIVED ✓' : `STATUS: ${po.status.toUpperCase()}`}
              </span>
            </div>
            <p className="text-xs text-[#8E9B90]">
              Carrier: <strong className="text-[#FDFBF7]">{po.supplier}</strong> · Dedicated Regional Fleet
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!dockSigned ? (
              <button
                type="button"
                onClick={handleSignDock}
                className="btn-royal-gold text-xs px-4 py-2.5 flex items-center gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Sign Dock Intake Receipt</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold px-3 py-1.5 rounded border border-[#16A34A]/30 bg-[#16A34A]/10">
                <CheckCircle2 className="w-4 h-4" />
                <span>Intake Verified &amp; Signed</span>
              </span>
            )}
          </div>
        </div>

        {/* PO Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">ORDER DATE</span>
            <span className="font-mono text-[#FDFBF7] mt-1 block">{po.orderDate}</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">REVISED ETA</span>
            <span className="font-mono text-[#E0C588] mt-1 block">Today @ 15:00 PST</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">TOTAL UNITS</span>
            <span className="font-mono text-[#FDFBF7] mt-1 block">{po.totalItems} Items</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">INVOICE VALUE</span>
            <span className="font-mono text-[#16A34A] mt-1 block">${po.totalValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Delay Reason Notice */}
        {po.status === 'delayed' && !dockSigned && (
          <div className="p-4 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/10 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#F87171] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#F87171] font-bold block">
                CARRIER DELAY NOTICE · I-5 CORRIDOR
              </span>
              <p className="text-[#8E9B90] leading-relaxed">
                Cascade Fresh Distributors dispatch notes that vehicle FLEET-TRUCK-07 was delayed in traffic.
                Cold-chain sensor telemetry confirmed at 3.4°C. Unloading scheduled upon dock arrival.
              </p>
            </div>
          </div>
        )}

        {/* PO Line Items Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider">
            Manifest Line Items ({po.items.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#071C16] text-[#8E9B90] font-mono uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-center">Ordered</th>
                  <th className="p-3 text-center">Allocated</th>
                  <th className="p-3 text-center">Remaining</th>
                  <th className="p-3 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#8E9B90]">
                {po.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-medium text-[#FDFBF7]">{item.productName}</td>
                    <td className="p-3 text-center font-mono">{item.quantity} {item.unit}</td>
                    <td className="p-3 text-center font-mono text-[#16A34A]">{item.allocated} {item.unit}</td>
                    <td className="p-3 text-center font-mono text-[#E0C588]">{item.remaining} {item.unit}</td>
                    <td className="p-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
