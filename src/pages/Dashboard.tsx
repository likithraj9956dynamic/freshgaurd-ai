// ============================================================
// FreshGuard AI — Royal Command Centre (Home)
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  ClipboardList,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { SeverityBadge, StatusBadge } from '../components/badges';
import { IMAGERY } from '../lib/imagery';
import type { Store, DetectedIssue, Investigation, DecisionOption, Action } from '../types';

const STORE_17_ID = '1012';

export function DashboardPage() {
  const { data, isLoading } = useDemos();
  const navigate = useNavigate();

  if (isLoading) return <CommandLoading />;
  if (!data) return <EmptyState title="Unable to load" description="The operational briefing could not be loaded." />;

  const stores: Store[] = data.stores;
  const issues: DetectedIssue[] = data.issues;
  const investigations: Investigation[] = data.investigations;
  const decisions: DecisionOption[] = data.decisions;
  const actions: Action[] = data.actions;

  // --- Derived network briefing (data-driven) ---
  const totalRevenue = stores.reduce((sum, s) => sum + s.revenueActual, 0);
  const totalTarget = stores.reduce((sum, s) => sum + s.revenueTarget, 0);
  const attainment = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0;
  const criticalCount = stores.filter((s) => s.status === 'critical').length;
  const watchCount = stores.filter((s) => s.status === 'at-risk' || s.status === 'warning').length;
  const healthyCount = stores.length - criticalCount - watchCount;

  const featuredStore = stores.find((s) => s.id === STORE_17_ID) ?? stores[0];
  const featuredIssue =
    issues.find((i) => i.id === 'issue-001') ??
    [...issues].sort((a, b) => b.urgencyScore - a.urgencyScore)[0];

  const priorityInvestigations = [...investigations]
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .slice(0, 3);

  const pendingDecisions = decisions.slice(0, 3);
  const recentActivity = [...actions]
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
    .slice(0, 4);

  const briefing = featuredStore && featuredIssue
    ? `Your network of ${stores.length} stores is holding steady at ${attainment}% of target, but ${featuredStore.name} requires attention — revenue is down ${Math.abs(featuredIssue.salesChangePercent)}% this period.`
    : `Your network of ${stores.length} stores is operating at ${attainment}% of target.`;

  return (
    <div className="min-h-screen">
      {/* ============ HERO — Royal Command Centre ============ */}
      <section className="relative">
        <Photo
          src={IMAGERY.groceryInterior}
          alt="FreshBasket grocery interior"
          ratio="aspect-[21/9] sm:aspect-[21/8] lg:aspect-[21/7]"
          fallbackLabel="FreshGuard AI"
          eager
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/85 via-midnight-950/70 to-midnight-950/40" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-20 sm:px-10">
          <Reveal>
            <p className="eyebrow mb-5">FreshGuard AI · Retail Operations Intelligence</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display max-w-3xl text-5xl text-ivory sm:text-6xl lg:text-7xl">
              Intelligence for<br />Every Store.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-champagne sm:text-lg">
              See what is changing. Understand why. Decide what happens next.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-ivory/80">
              {briefing}
            </p>
          </Reveal>

          {/* Primary priority + action */}
          {featuredIssue && featuredStore && (
            <Reveal delay={440} className="mt-10">
              <div className="inline-flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={`/investigations/${featuredIssue.id}`}
                  className="group inline-flex items-center gap-4 rounded-sm border border-gold-500/40 bg-midnight-900/70 px-5 py-4 backdrop-blur-sm transition-all hover:border-gold-400 hover:bg-midnight-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson-500/15">
                    <Flame className="h-5 w-5 text-gold-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                      Priority · {featuredStore.name}
                    </p>
                    <p className="mt-0.5 font-serif text-lg text-ivory">
                      {featuredIssue.title}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gold-400 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to={`/investigations/${featuredIssue.id}`}
                  className="btn-gold btn"
                >
                  Investigate now
                </Link>
              </div>
            </Reveal>
          )}
        </div>

        {/* Thin gold rule at hero base */}
        <div className="gold-rule absolute bottom-0 left-0 right-0" />
      </section>

      {/* ============ Progressive sections ============ */}
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-16 sm:px-10">
        {/* Network health — a few facts, not a card grid */}
        <Reveal>
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">Network Health</p>
                <h2 className="section-title text-3xl sm:text-4xl">
                  {healthyCount} of {stores.length} stores healthy
                </h2>
              </div>
              <Link to="/network" className="btn-ghost btn">
                View network <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Combined revenue of <span className="font-semibold text-navy">${totalRevenue.toLocaleString()}</span> against a target of ${totalTarget.toLocaleString()} — {attainment}% attainment. {criticalCount} store{criticalCount === 1 ? '' : 's'} in critical condition, {watchCount} on watch.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
              <NetworkStat label="Stores" value={String(stores.length)} />
              <NetworkStat label="Healthy" value={String(healthyCount)} tone="sage" />
              <NetworkStat label="On watch" value={String(watchCount)} tone="gold" />
              <NetworkStat label="Critical" value={String(criticalCount)} tone="crimson" />
            </div>
          </section>
        </Reveal>

        {/* Priority investigations */}
        <Reveal>
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">Priority Investigations</p>
                <h2 className="section-title text-3xl sm:text-4xl">Open cases</h2>
              </div>
              <Link to={`/investigations/${priorityInvestigations[0]?.id ?? 'issue-001'}`} className="btn-ghost btn">
                All investigations <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {priorityInvestigations.map((inv) => (
                <InvestigationCard key={inv.id} investigation={inv} onOpen={() => navigate(`/investigations/${inv.id}`)} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* Pending decisions */}
        <Reveal>
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">Pending Decisions</p>
                <h2 className="section-title text-3xl sm:text-4xl">Awaiting your judgement</h2>
              </div>
              <Link to={`/decisions/${pendingDecisions[0]?.id ?? 'dec-1'}`} className="btn-ghost btn">
                Decision chamber <ClipboardList className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pendingDecisions.map((d) => (
                <DecisionCard key={d.id} decision={d} onOpen={() => navigate(`/decisions/${d.id}`)} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* Recent activity */}
        <Reveal>
          <section>
            <div className="mb-6">
              <p className="eyebrow mb-2">Recent Activity</p>
              <h2 className="section-title text-3xl sm:text-4xl">Latest actions</h2>
            </div>
            <div className="card overflow-hidden">
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Store</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((a) => (
                    <tr key={a.id} className="cursor-pointer" onClick={() => navigate('/actions')}>
                      <td className="font-medium">{a.title}</td>
                      <td className="text-muted-foreground">{a.storeName}</td>
                      <td className="capitalize text-muted-foreground">{a.type}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        {/* Footer note */}
        <Reveal>
          <div className="flex items-center gap-4 py-6">
            <div className="gold-rule flex-1" />
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-gold-600" />
              FreshGuard AI · Demonstration data · {new Date().getFullYear()}
            </p>
            <div className="gold-rule flex-1" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function NetworkStat({ label, value, tone }: { label: string; value: string; tone?: 'sage' | 'gold' | 'crimson' }) {
  const toneClass =
    tone === 'sage' ? 'text-sage-600' :
    tone === 'gold' ? 'text-gold-600' :
    tone === 'crimson' ? 'text-crimson-600' : 'text-navy';
  return (
    <div className="bg-surface px-5 py-6">
      <p className={`stat-value text-4xl ${toneClass}`}>{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  );
}

function InvestigationCard({ investigation, onOpen }: { investigation: Investigation; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="card group flex flex-col p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="mb-4 flex items-center justify-between">
        <SeverityBadge severity={investigation.severity} />
        <span className="text-xs text-muted-foreground">{investigation.confidence}% confidence</span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy">{investigation.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {investigation.evidenceSummary}
      </p>
      <p className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-accent">
        Open case <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </p>
    </button>
  );
}

function DecisionCard({ decision, onOpen }: { decision: DecisionOption; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="card group flex flex-col p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="badge bg-gold-50 text-gold-700">{decision.type}</span>
        <span className={`text-xs font-medium ${decision.riskLevel === 'low' ? 'text-sage-600' : decision.riskLevel === 'medium' ? 'text-gold-600' : 'text-crimson-600'}`}>
          {decision.riskLevel} risk
        </span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy">{decision.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{decision.description}</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <p className="text-sm">
          <span className="text-muted-foreground">Est. benefit </span>
          <span className="font-semibold text-sage-600">${decision.estimatedBenefit.toLocaleString()}</span>
        </p>
        <p className="flex items-center gap-1 text-sm font-medium text-accent">
          Review <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </button>
  );
}

function CommandLoading() {
  return (
    <div className="min-h-screen">
      <div className="shimmer aspect-[21/9] w-full" />
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-16 sm:px-10">
        <div className="shimmer h-4 w-40 rounded" />
        <div className="shimmer h-10 w-2/3 rounded" />
        <div className="shimmer h-4 w-1/2 rounded" />
        <div className="grid gap-4 pt-8 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="shimmer h-32 rounded-sm" />)}
        </div>
      </div>
      <div className="sr-only">
        <LoadingState message="Preparing your command centre…" />
      </div>
    </div>
  );
}

function severityRank(sev: 'info' | 'warning' | 'critical') {
  return sev === 'critical' ? 3 : sev === 'warning' ? 2 : 1;
}
