// ============================================================
// FreshGuard AI — Store Overview: Purchase Order Item
// ============================================================

import type { PurchaseOrder } from '../types';

export function PurchaseOrderItem({ po }: { po: PurchaseOrder }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div><h4 className="text-sm font-semibold">Order #{po.orderNumber}</h4><p className="text-xs text-muted-foreground">{po.supplier} · Total: ${po.totalValue.toFixed(2)}</p></div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${po.status==='delayed'?'bg-red-100 text-red-800':po.status==='confirmed'?'bg-blue-100 text-blue-800':'bg-green-100 text-green-800'}`}>{po.status}</span>
      </div>
      <p className="text-xs text-muted-foreground">Expected: {new Date(po.expectedDelivery).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</p>
      <div className="mt-2 space-y-1 text-xs">
        {po.items.map((item) => <div key={item.productId} className="flex justify-between"><span>{item.productName} ({item.quantity} {item.unit})</span><span className="text-muted-foreground">{item.allocated}/{item.quantity} allocated</span></div>)}
      </div>
    </div>
  );
}
