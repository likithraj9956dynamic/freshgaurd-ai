// ============================================================
// FreshGuard AI — Components: FilterBar
// ============================================================

import React from 'react';

export type FilterKey = 'urgency' | 'revenue' | 'stockout' | 'wastage' | 'compliance';
export type SortKey = 'urgency' | 'revenue' | 'stockout' | 'wastage' | 'compliance' | 'name';

interface FilterOption {
  key: FilterKey;
  label: string;
  values: Array<{ value: string; label: string }>;
  active?: string;
  onChange: (key: FilterKey, value: string) => void;
}

interface FilterBarProps {
  filters: Record<FilterKey, string>;
  onFilterChange: (key: FilterKey, value: string) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  onFilterChange,
  sortKey,
  onSortChange,
  onClear,
}: FilterBarProps) {
  const filterOptions: FilterOption[] = [
    {
      key: 'urgency',
      label: 'Urgency',
      values: [
        { value: 'high', label: 'Urgent' },
        { value: 'medium', label: 'Normal' },
        { value: 'low', label: 'Low' },
      ],
      active: filters.urgency,
      onChange: (key, value) => onFilterChange(key, value),
    },
    {
      key: 'revenue',
      label: 'Revenue decline',
      values: [
        { value: '>15', label: '>15%' },
        { value: '>10', label: '>10%' },
        { value: '>5', label: '>5%' },
        { value: '<5', label: '<5%' },
      ],
      active: filters.revenue,
      onChange: (key, value) => onFilterChange(key, value),
    },
    {
      key: 'stockout',
      label: 'Stockout risk',
      values: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
      active: filters.stockout,
      onChange: (key, value) => onFilterChange(key, value),
    },
    {
      key: 'wastage',
      label: 'Wastage',
      values: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
      active: filters.wastage,
      onChange: (key, value) => onFilterChange(key, value),
    },
    {
      key: 'compliance',
      label: 'Compliance',
      values: [
        { value: 'issues', label: 'Issues found' },
        { value: 'none', label: 'No issues' },
      ],
      active: filters.compliance,
      onChange: (key, value) => onFilterChange(key, value),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              if (opt.active === opt.values[0]?.value) {
                onFilterChange(opt.key, '');
              } else {
                onFilterChange(opt.key, opt.values[0]?.value || '');
              }
            }}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium border transition-colors
              ${opt.active === opt.values[0]?.value
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-muted-foreground border-border-subtle hover:border-accent'
              }
            `}
          >
            {opt.label}
            {opt.active && (
              <span className="ml-1.5 text-xs opacity-80">{opt.active}</span>
            )}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {12} stores
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-muted-foreground">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="px-2 py-1 rounded-md border border-border-subtle text-xs bg-white"
          >
            <option value="urgency">Urgency</option>
            <option value="revenue">Revenue decline</option>
            <option value="stockout">Stockout risk</option>
            <option value="wastage">Wastage</option>
            <option value="compliance">Compliance</option>
            <option value="name">Store name</option>
          </select>
        </div>
      </div>

      {onClear && (
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
