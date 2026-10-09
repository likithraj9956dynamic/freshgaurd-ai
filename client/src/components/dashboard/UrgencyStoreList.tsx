import React from 'react';
import {
  ChevronRight,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  PackageCheck,
} from 'lucide-react';

export interface StoreItem {
  id: string;
  code: string;
  name: string;
  region: string;
  urgencyLevel: 'High' | 'Medium' | 'Watch';
  primaryIssue: string;
  urgencyScore: number;
  timeSensitivity: string;
  iconType: 'stock' | 'sales' | 'waste' | 'coldchain';
}

interface UrgencyStoreListProps {
  onSelectStore?: (storeId: string) => void;
  onViewAllStores?: () => void;
}

export const UrgencyStoreList: React.FC<UrgencyStoreListProps> = ({
  onSelectStore,
  onViewAllStores,
}) => {
  const stores: StoreItem[] = [
    {
      id: 'STORE_17',
      code: 'Store 17',
      name: 'Indiranagar',
      region: 'Bengaluru East',
      urgencyLevel: 'High',
      primaryIssue: 'Fast movers at risk - PO 4821 - 2 days late',
      urgencyScore: 92.5,
      timeSensitivity: 'Action window: ~4h',
      iconType: 'stock',
    },
    {
      id: 'STORE_04',
      code: 'Store 04',
      name: 'Koramangala',
      region: 'Bengaluru South',
      urgencyLevel: 'High',
      primaryIssue: 'Sales decline - -12.8% vs 4-week baseline',
      urgencyScore: 84.0,
      timeSensitivity: 'Baseline deviation',
      iconType: 'sales',
    },
    {
      id: 'STORE_23',
      code: 'Store 23',
      name: 'Whitefield',
      region: 'Bengaluru East',
      urgencyLevel: 'Medium',
      primaryIssue: 'Elevated wastage - Leafy greens - 6.4% of receipts',
      urgencyScore: 68.2,
      timeSensitivity: '7-day rolling window',
      iconType: 'waste',
    },
    {
      id: 'STORE_11',
      code: 'Store 11',
      name: 'Jayanagar',
      region: 'Bengaluru South',
      urgencyLevel: 'Watch',
      primaryIssue: 'Cold-chain check due - Last logged 17h ago',
      urgencyScore: 42.0,
      timeSensitivity: 'Audit log pending',
      iconType: 'coldchain',
    },
  ];

  const getBadgeStyle = (level: 'High' | 'Medium' | 'Watch') => {
    switch (level) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'Watch':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRowIcon = (type: StoreItem['iconType']) => {
    switch (type) {
      case 'stock':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'sales':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'waste':
        return <PackageCheck className="w-4 h-4 text-amber-600" />;
      case 'coldchain':
        return <ThermometerSnowflake className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Urgency-ranked stores</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rank reflects exposure, time sensitivity, and evidence strength.
            </p>
          </div>

          <button
            onClick={onViewAllStores}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center space-x-1 group px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <span>All stores</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Store Rows List */}
        <div className="mt-5 divide-y divide-slate-100">
          {stores.map((store, index) => (
            <div
              key={store.id}
              onClick={() => onSelectStore && onSelectStore(store.id)}
              className="py-4 first:pt-2 last:pb-2 flex items-center justify-between group hover:bg-slate-50/70 -mx-3 px-3 rounded-xl transition-all cursor-pointer"
            >
              {/* Left Column: Number rank + Store Info + Reason */}
              <div className="flex items-start space-x-3.5 min-w-0 pr-4">
                <span className="text-xs font-extrabold text-slate-400 mt-0.5 w-4 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  {/* Store Name & Region */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {store.code} · {store.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      ({store.region})
                    </span>
                  </div>

                  {/* Primary Issue Reason */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-1">
                    <span className="shrink-0">{getRowIcon(store.iconType)}</span>
                    <span className="truncate font-medium">{store.primaryIssue}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Badge & Chevron */}
              <div className="flex items-center space-x-3 shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border tracking-wide uppercase shadow-2xs ${getBadgeStyle(
                    store.urgencyLevel
                  )}`}
                >
                  {store.urgencyLevel}
                </span>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Next automated signal evaluation at 09:00 IST</span>
        </span>
        <span className="font-semibold text-brand-700 hover:underline cursor-pointer">
          Evaluation rules &rarr;
        </span>
      </div>
    </div>
  );
};
