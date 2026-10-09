// ============================================================
// FreshGuard AI — Components: DataTable (v1)
// ============================================================

import React from 'react';

// Generic DataTable component that works with typed data
export function DataTable<T>({
  columns,
  data,
  onRowClick,
  loading = false,
}: {
  columns: Array<{
    key: string;
    header: string;
    width?: string;
    render?: (item: T, index: number) => React.ReactNode;
  }>;
  data: T[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
}) {
  if (loading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No data found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/30">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={typeof item === 'object' && item !== null ? (item as { id?: string }).id || `row-${index}` : index}
              className="border-t border-border-subtle hover:bg-muted/10 transition-colors"
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm"
                  style={{ width: col.width }}
                >
                  {col.render
                    ? col.render(item, index)
                    : String(
                        item === null || item === undefined
                          ? ''
                          : (item as Record<string, unknown>)[col.key] ?? '',
                      )
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
