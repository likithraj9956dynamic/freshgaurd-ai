// ============================================================
// FreshGuard AI — Store Overview Components
// ============================================================

import type { Store } from '../types';

export function StoreHeader({ store }: { store: Store }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{store.name}</h1>
      <p className="text-sm text-muted-foreground">{store.address}</p>
    </div>
  );
}
