// ============================================================
// FreshGuard AI — Store Network (Enterprise Topology View)
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  MapPin,
  Package,
  TrendingDown,
  Recycle,
  Scale,
  Network
} from 'lucide-react';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { SeverityBadge } from '../components/badges';
import type { NetworkStore, TransferOpportunity } from '../types';

const statusTone: Record<string, string> = {
  healthy: '#059669', // Emerald
  warning: '#d97706', // Amber
  'at-risk': '#d97706',
  critical: '#dc2626', // Red
};

export function NetworkPage() {
  const { data, isLoading } = useDemos();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  if (isLoading) return <PageLoading />;
  if (!data) return <EmptyState title="Network unavailable" description="Store network data could not be loaded." />;

  const network: NetworkStore[] = data.network;
  const transfers: TransferOpportunity[] = data.transfers;
  const selected = network.find((n) => n.storeId === selectedId) ?? null;

  // Deterministic golden-angle spiral layout (schematic, not geographic)
  const positions = new Map<string, { x: number; y: number }>();
  network.forEach((n, i) => {
    const angle = i * 2.39996 + 0.4;
    const radius = Math.sqrt((i + 0.5) / network.length) * 42;
    positions.set(n.storeId, {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.72,
    });
  });

  const avgHealth = Math.round(network.reduce((s, n) => s + n.health, 0) / network.length);
  const criticalCount = network.filter((n) => n.status === 'critical').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Network className="w-3.5 h-3.5 text-emerald-700" />
            <span>Store Network Infrastructure Topology</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Store Network Constellation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            A schematic operational view of {network.length} FreshBasket regional stores. Node indicators reflect real-time operating health scores; connecting arcs denote active inter-store transfer routes. Select any node to inspect telemetry.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Constellation Canvas */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm p-0">
          <div className="relative aspect-[4/3] w-full bg-slate-900 sm:aspect-[16/10]">
            {/* Subtle schematic grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Transfer connections */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {transfers.map((t) => {
                const a = positions.get(t.sourceStoreId);
                const b = positions.get(t.destinationStoreId);
                if (!a || !b) return null;
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2 - 6;
                return (
                  <path
                    key={t.id}
                    d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="0.3"
                    strokeDasharray="1.5 1.5"
                    opacity="0.6"
                  />
                );
              })}
            </svg>

            {/* Store nodes */}
            {network.map((n) => {
              const pos = positions.get(n.storeId)!;
              const active = selectedId === n.storeId;
              const colour = statusTone[n.status] ?? '#059669';
              const size = n.status === 'critical' ? 2.4 : n.status === 'at-risk' || n.status === 'warning' ? 2.0 : 1.6;
              return (
                <button
                  key={n.storeId}
                  onClick={() => setSelectedId(active ? null : n.storeId)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  aria-label={n.name}
                >
                  <span
                    className="block rounded-full transition-all duration-200 group-hover:scale-125"
                    style={{
                      width: `${size}rem`,
                      height: `${size}rem`,
                      background: colour,
                      boxShadow: active
                        ? `0 0 0 3px #ffffff, 0 0 16px 2px ${colour}`
                        : `0 0 0 1px rgba(255,255,255,0.4)`,
                      opacity: selectedId && !active ? 0.4 : 1,
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium tracking-wide transition-opacity bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow ${
                      active ? 'opacity-100 ring-1 ring-emerald-500' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {n.name.replace('FreshBasket ', '')}
                  </span>
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded bg-slate-800/90 border border-slate-700/60 px-3 py-2 text-xs text-slate-300 backdrop-blur-sm">
              {(['healthy', 'at-risk', 'critical'] as const).map((s) => (
                <span key={s} className="flex items-center gap-2 text-[11px]">
                  <span className="h-2 w-2 rounded-full" style={{ background: statusTone[s] }} />
                  <span className="capitalize">{s === 'at-risk' ? 'At risk' : s}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 px-4 py-2.5 bg-slate-50 text-[11px] text-slate-500">
            Schematic network — node positions are topological. Dashed arcs denote active inter-store inventory transfer opportunities.
          </div>
        </section>

        {/* Detail panel */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          {selected ? (
            <StoreDetail
              store={selected}
              transfers={transfers.filter((t) => t.sourceStoreId === selected.storeId || t.destinationStoreId === selected.storeId)}
              onViewStore={() => navigate(`/manager/stores/${selected.storeId}`)}
              onInvestigate={() => navigate(`/manager/investigations/${selected.storeId}`)}
              isCritical={selected.status === 'critical'}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Network Health Overview</span>
                <p className="text-3xl font-bold text-slate-900 mt-1">{avgHealth}%</p>
                <p className="text-xs text-slate-500">Average operational health index across network</p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Monitored Stores</span>
                  <span className="font-semibold text-slate-900">{network.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Critical Status Outliers</span>
                  <span className="font-semibold text-rose-700">{criticalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Inter-Store Transfer Routes</span>
                  <span className="font-semibold text-emerald-700">{transfers.length}</span>
                </div>
              </div>

              <p className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Click any node in the constellation diagram to review store telemetry, inventory exceptions, and open incident tickets.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StoreDetail({
  store,
  transfers,
  onViewStore,
  onInvestigate,
  isCritical,
}: {
  store: NetworkStore;
  transfers: TransferOpportunity[];
  onViewStore: () => void;
  onInvestigate: () => void;
  isCritical: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono text-slate-500">STORE ID #{store.storeId}</span>
            <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
          </div>
          <SeverityBadge severity={store.status === 'critical' ? 'critical' : store.status === 'healthy' ? 'info' : 'warning'} />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {store.location.city}, {store.location.state}
        </p>

        <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
          <DetailRow icon={<Scale className="h-3.5 w-3.5 text-emerald-700" />} label="Operating health" value={`${store.health}%`} />
          <DetailRow icon={<Package className="h-3.5 w-3.5 text-amber-600" />} label="Inventory shortage" value={`${store.inventoryShortage} SKUs`} />
          <DetailRow icon={<Recycle className="h-3.5 w-3.5 text-blue-600" />} label="Potential surplus" value={`${store.potentialSurplus} units`} />
          <DetailRow icon={<TrendingDown className="h-3.5 w-3.5 text-slate-500" />} label="Transfer score" value={`${store.transferScore}/100`} />
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <button type="button" onClick={onViewStore} className="btn-primary w-full text-xs justify-center flex items-center gap-1.5 py-2">
            <span>Open Store Dossier</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          {isCritical && (
            <button type="button" onClick={onInvestigate} className="btn-secondary w-full text-xs justify-center py-2">
              Investigate Branch #{store.storeId}
            </button>
          )}
        </div>

        {transfers.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Active Transfer Routes</span>
            <ul className="space-y-1.5">
              {transfers.map((t) => (
                <li key={t.id} className="rounded border border-slate-200 bg-slate-50 p-2 text-xs">
                  <p className="font-medium text-slate-900">{t.product}</p>
                  <p className="text-[11px] text-slate-500">
                    {t.sourceStoreName} → {t.destinationStoreName} ({t.availableQuantity} units)
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-1.5 text-slate-500">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-96 bg-slate-100 rounded animate-pulse" />
      <div className="h-96 w-full bg-slate-200 rounded-lg animate-pulse mt-6" />
    </div>
  );
}
