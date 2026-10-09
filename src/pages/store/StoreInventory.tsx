// ============================================================
// FreshGuard AI — Store Manager: Inventory & Expiry Surveillance
// ============================================================

import { useState } from 'react';
import { STORE_17_INVENTORY } from '../../mocks/inventory';
import type { InventoryItem } from '../../types';
import {
  Layers,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Package,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

export function StoreInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(STORE_17_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'out-of-stock' | 'low' | 'expiry'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRequestRestock = (itemName: string) => {
    setFeedback(`Expedited restock directive triggered for "${itemName}". Notified procurement.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'out-of-stock') return item.status === 'out-of-stock';
    if (filter === 'low') return item.status === 'low';
    if (filter === 'expiry') return item.daysOfSupply <= 3;
    return true;
  });

  const oosCount = inventory.filter((i) => i.status === 'out-of-stock').length;
  const lowCount = inventory.filter((i) => i.status === 'low').length;
  const expiryCount = inventory.filter((i) => i.daysOfSupply <= 3).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>STORE 017 · SHELF INVENTORY &amp; EXPIRY TELEMETRY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Inventory &amp; Shelf-Life Ledger
          </h1>

          <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            Surveillance of on-hand quantities, allocation, and perishable expiry windows. Products with under 3 days of supply represent immediate stockout risk.
          </p>
        </div>

        {/* Counter Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl">
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">MONITORED SKUS</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{inventory.length}</span>
          </div>
          <div className="p-3.5 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/15">
            <span className="text-[10px] font-mono text-[#F87171] block">OUT OF STOCK</span>
            <span className="text-xl font-editorial text-[#F87171]">{oosCount} SKUs</span>
          </div>
          <div className="p-3.5 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <span className="text-[10px] font-mono text-[#E0C588] block">LOW STOCK</span>
            <span className="text-xl font-editorial text-[#E0C588]">{lowCount} SKUs</span>
          </div>
          <div className="p-3.5 rounded border border-white/10 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">EXPIRY RISK (&lt;3D)</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{expiryCount} Items</span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#C5A059]/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded text-xs pl-9 pr-3 py-2 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'all' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            All ({inventory.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('out-of-stock')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'out-of-stock' ? 'bg-[#9E2A2B] text-white font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            Out of Stock ({oosCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('low')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'low' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('expiry')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'expiry' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            Near Expiry ({expiryCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="royal-card overflow-hidden border-[#C5A059]/20 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071C16] text-[#C5A059] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Product &amp; SKU</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-center">On Hand</th>
                <th className="p-4 text-center">On Order</th>
                <th className="p-4 text-center">Days of Supply</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Floor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#8E9B90]">
              {filteredItems.map((item) => {
                const isCritical = item.status === 'out-of-stock';
                const isLow = item.status === 'low';
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[#FDFBF7] text-xs">{item.product.name}</div>
                      <div className="font-mono text-[10px] text-[#C5A059]">{item.product.sku} · Loc: {item.locationId}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[#8E9B90] text-[11px]">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-[#FDFBF7]">
                      {item.onHand} {item.unit}
                    </td>
                    <td className="p-4 text-center font-mono text-[#E0C588]">
                      +{item.onOrder} {item.unit}
                    </td>
                    <td className="p-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        item.daysOfSupply <= 2 ? 'text-[#F87171] font-bold bg-[#9E2A2B]/20' :
                        item.daysOfSupply <= 5 ? 'text-[#E0C588] bg-[#C5A059]/10' :
                        'text-[#16A34A]'
                      }`}>
                        {item.daysOfSupply} Days
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono">
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                        isCritical ? 'bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/50' :
                        isLow ? 'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/40' :
                        'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isCritical || isLow ? (
                        <button
                          type="button"
                          onClick={() => handleRequestRestock(item.product.name)}
                          className="btn-royal-outline text-[11px] px-3 py-1 hover:border-[#C5A059]"
                        >
                          Request Restock
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#16A34A] font-mono">Adequate Par</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
