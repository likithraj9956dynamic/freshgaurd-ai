// ============================================================
// FreshGuard AI — Store Manager: Inventory & Expiry Surveillance
// ============================================================

import React, { useState } from 'react';
import { STORE_17_INVENTORY } from '../../mocks/inventory';
import type { InventoryItem } from '../../types';
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export function StoreInventoryPage() {
  const [inventory] = useState<InventoryItem[]>(STORE_17_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'out-of-stock' | 'low' | 'expiry'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRequestRestock = (itemName: string) => {
    setFeedback(`Expedited restock directive logged for "${itemName}". Notified procurement.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory &amp; Shelf-Life Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            FB-17 (Marathahalli) · Surveillance of on-hand quantities, days of supply, and perishable expiry
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Monitored SKUs</span>
          <span className="text-xl font-bold text-slate-900">{inventory.length}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Out of Stock</span>
          <span className="text-xl font-bold text-red-700">{oosCount} SKUs</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Low Stock</span>
          <span className="text-xl font-bold text-amber-700">{lowCount} SKUs</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Expiry Risk (&lt;3D)</span>
          <span className="text-xl font-bold text-slate-800">{expiryCount} SKUs</span>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-md border border-slate-300 bg-white focus:border-[#164e3d] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#164e3d] text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({inventory.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('out-of-stock')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'out-of-stock'
                ? 'bg-[#164e3d] text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Out of Stock ({oosCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('low')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'low'
                ? 'bg-[#164e3d] text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('expiry')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'expiry'
                ? 'bg-[#164e3d] text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Near Expiry ({expiryCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Product &amp; SKU</th>
                <th>Category</th>
                <th className="text-center">On Hand</th>
                <th className="text-center">On Order</th>
                <th className="text-center">Days Supply</th>
                <th className="text-center">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isCritical = item.status === 'out-of-stock';
                const isLow = item.status === 'low';

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="font-medium text-slate-900">{item.product.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.product.sku} · Location: {item.locationId}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="text-center font-mono font-medium text-slate-800">
                      {item.onHand} {item.unit}
                    </td>
                    <td className="text-center font-mono text-slate-600">
                      +{item.onOrder} {item.unit}
                    </td>
                    <td className="text-center font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                          item.daysOfSupply <= 2
                            ? 'bg-red-100 text-red-800'
                            : item.daysOfSupply <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.daysOfSupply} Days
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isCritical
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isLow
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      {isCritical || isLow ? (
                        <button
                          type="button"
                          onClick={() => handleRequestRestock(item.product.name)}
                          className="btn-secondary text-xs px-2.5 py-1"
                        >
                          Request Restock
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Normal</span>
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
