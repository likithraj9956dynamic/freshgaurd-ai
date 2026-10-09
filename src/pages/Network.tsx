// ============================================================
// FreshGuard AI — Store Network (schematic constellation)
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
} from 'lucide-react';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { SeverityBadge } from '../components/badges';
import type { NetworkStore, TransferOpportunity } from '../types';

const statusTone: Record<string, string> = {
  healthy: '#547F63',
  warning: '#C9A227',
  'at-risk': '#C9A227',
  critical: '#933831',
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
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      {/* Header */}
      <header className="mb-8">
        <p className="eyebrow mb-2">Store Network</p>
        <h1 className="display text-4xl sm:text-5xl">The constellation of stores</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A schematic view of {network.length} FreshBasket stores. Node colour reflects operating
          health; connecting lines show verified transfer opportunities. Select a store to inspect it.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Constellation */}
        <section className="card relative overflow-hidden p-0">
          <div className="relative aspect-[4/3] w-full bg-midnight-950 sm:aspect-[16/10]">
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(246,241,229,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(246,241,229,0.35) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
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
                    stroke="rgba(201,162,39,0.45)"
                    strokeWidth="0.25"
                    strokeDasharray="1.2 1.2"
                  />
                );
              })}
            </svg>

            {/* Store nodes */}
            {network.map((n) => {
              const pos = positions.get(n.storeId)!;
              const active = selectedId === n.storeId;
              const colour = statusTone[n.status] ?? '#547F63';
              const size = n.status === 'critical' ? 2.6 : n.status === 'at-risk' || n.status === 'warning' ? 2.1 : 1.7;
              return (
                <button
                  key={n.storeId}
                  onClick={() => setSelectedId(active ? null : n.storeId)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  aria-label={n.name}
                >
                  <span
                    className="block rounded-full transition-all duration-300 group-hover:scale-125"
                    style={{
                      width: `${size}rem`,
                      height: `${size}rem`,
                      background: colour,
                      boxShadow: active
                        ? `0 0 0 3px rgba(201,162,39,0.9), 0 0 24px 4px ${colour}66`
                        : `0 0 0 1px rgba(246,241,229,0.25), 0 0 14px 0px ${colour}55`,
                      opacity: selectedId && !active ? 0.45 : 1,
                    }}
                  />
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[0.625rem] font-medium tracking-wide transition-opacity ${
                      active ? 'text-gold-300 opacity-100' : 'text-ivory/70 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {n.name.replace('FreshBasket ', '')}
                  </span>
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-sm bg-midnight-900/80 px-3 py-2 backdrop-blur-sm">
              {(['healthy', 'at-risk', 'critical'] as const).map((s) => (
                <span key={s} className="flex items-center gap-2 text-[0.625rem] text-ivory/70">
                  <span className="h-2 w-2 rounded-full" style={{ background: statusTone[s] }} />
                  <span className="capitalize">{s === 'at-risk' ? 'At risk' : s}</span>
                </span>
              ))}
            </div>
          </div>
          <p className="border-t border-border-subtle px-5 py-3 text-[0.6875rem] text-muted-foreground">
            Schematic network — positions are illustrative, not geographic. Dashed lines are transfer opportunities.
          </p>
        </section>

        {/* Detail panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {selected ? (
            <StoreDetail
              store={selected}
              transfers={transfers.filter((t) => t.sourceStoreId === selected.storeId || t.destinationStoreId === selected.storeId)}
              onViewStore={() => navigate(`/stores/${selected.storeId}`)}
              onInvestigate={() => navigate('/investigations/issue-001')}
              isCritical={selected.status === 'critical'}
            />
          ) : (
            <div className="card p-6">
              <p className="eyebrow mb-3">Network Summary</p>
              <p className="stat-value text-5xl text-navy">{avgHealth}<span className="text-2xl text-muted-foreground">%</span></p>
              <p className="mt-1 text-sm text-muted-foreground">Average store health</p>
              <hr className="gold-rule my-5" />
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stores</span>
                  <span className="font-semibold">{network.length}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Critical</span>
                  <span className="font-semibold text-crimson-600">{criticalCount}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transfer routes</span>
                  <span className="font-semibold">{transfers.length}</span>
                </li>
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Select any node to reveal its operating detail and available actions.
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
    <div className="card-raised overflow-hidden">
      <div className="border-l-2 border-gold-500 p-6">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="eyebrow mb-1">Store {store.storeId}</p>
            <h2 className="font-serif text-2xl font-semibold text-navy">{store.name}</h2>
          </div>
          <SeverityBadge severity={store.status === 'critical' ? 'critical' : store.status === 'healthy' ? 'info' : 'warning'} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {store.location.city}, {store.location.state}
        </p>

        <div className="mt-5 space-y-3">
          <DetailRow icon={<Scale className="h-4 w-4" />} label="Operating health" value={`${store.health}%`} />
          <DetailRow icon={<Package className="h-4 w-4" />} label="Inventory shortage" value={`${store.inventoryShortage} SKUs`} />
          <DetailRow icon={<Recycle className="h-4 w-4" />} label="Potential surplus" value={`${store.potentialSurplus} units`} />
          <DetailRow icon={<TrendingDown className="h-4 w-4" />} label="Transfer score" value={`${store.transferScore}/100`} />
        </div>

        <hr className="gold-rule my-5" />

        <div className="flex flex-col gap-2">
          <button onClick={onViewStore} className="btn-primary btn w-full">
            Open store overview <ArrowUpRight className="h-4 w-4" />
          </button>
          {isCritical && (
            <button onClick={onInvestigate} className="btn-gold btn w-full">
              Investigate Store 017
            </button>
          )}
        </div>

        {transfers.length > 0 && (
          <>
            <hr className="gold-rule my-5" />
            <p className="eyebrow mb-3">Transfer Routes</p>
            <ul className="space-y-2">
              {transfers.map((t) => (
                <li key={t.id} className="rounded-sm border border-border-subtle bg-gold-50/50 px-3 py-2 text-xs">
                  <p className="font-medium text-navy">{t.product}</p>
                  <p className="text-muted-foreground">
                    {t.sourceStoreName} → {t.destinationStoreName} · {t.availableQuantity} units
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-gold-600">{icon}</span>
        {label}
      </span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <div className="shimmer h-4 w-32 rounded" />
      <div className="shimmer mt-3 h-10 w-2/3 rounded" />
      <div className="shimmer mt-8 aspect-[16/10] w-full rounded-sm" />
    <div className="sr-only">
      <LoadingState message="Mapping the store network…" />
    </div>
  </div>
  );
}

