# FreshGuard AI — Frontend Architecture State

## Current Phase: Phase 3 — Urgency-Ranked Stores List & Right Sidebar Widgets
**Status**: Completed ✅

---

## 1. System Overview & Tech Stack
- **Framework**: React 18 + TypeScript + Vite (Port: `3000`)
- **Styling**: Tailwind CSS + PostCSS + Lucide Icons + Recharts
- **Design Tokens**:
  - Forest Green Hero Gradient: `#043d2f` -> `#064e3b` -> `#047857`
  - Mint Green Highlights: `#10b981` / `#34d399` / `#d1fae5`
  - Badges & Metric Tokens:
    - High Urgency: `bg-red-50 text-red-700 border-red-200`
    - Medium Urgency: `bg-amber-50 text-amber-800 border-amber-200`
    - Watch Urgency: `bg-emerald-50 text-emerald-800 border-emerald-200`

---

## 2. Component Architecture & Directory Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx               # Root layout shell
│   │   │   ├── Sidebar.tsx                # Navigation & user profile card
│   │   │   └── TopBar.tsx                 # Breadcrumb, synthetic data badge, controls
│   │   └── dashboard/
│   │       ├── MorningBriefingBanner.tsx  # Forest-green hero banner with audio player
│   │       ├── MetricCardsGrid.tsx        # 4-column operational KPI summary strip
│   │       ├── UrgencyStoreList.tsx       # Urgency-ranked stores table & action link
│   │       ├── NetworkSalesWidget.tsx     # Recharts 7-day sales area curve widget
│   │       └── SignalsVerifyWidget.tsx    # Store telemetry signals verification list
│   ├── styles/
│   │   └── index.css                      # Tailwind base & custom scrollbar
│   ├── App.tsx                            # Main application layout & state coordinator
│   └── main.tsx                           # DOM entry
```

---

## 3. UI Component Details

### A. Morning Briefing Hero Banner (`MorningBriefingBanner.tsx`)
- **Background**: Deep forest green gradient with SVG wave graphics and radial mesh glow.
- **Header & Tag**: `"MORNING BRIEFING — SYNTHETIC SUMMARY"`.
- **Headline**: `"Four stores merit a closer look before the first delivery window closes."`
- **Subtext**: `"Store 17 has the strongest supported stock-risk signal. Two additional signals need local verification."`
- **Interactive Audio Strip**: Play / Pause toggle, animated waveform visualizer, time indicator (`0:55`), and mute control.
- **Right Action Badges**:
  - `"04 priority stores"` (pill with pulse indicator)
  - `"02 awaiting review (human decision)"` (emerald pill with link to approvals)

### B. Metric Summary Cards Grid (`MetricCardsGrid.tsx` - 4 Columns)
- **Card 1 (Stores needing attention)**: Value `"04 of 28"`, Subtext `"2 urgent · ranked by estimated impact"`, warning badge.
- **Card 2 (At-risk sales, today)**: Value `"₹42.6k"`, Subtext `"+8.1% vs yesterday · estimated exposure"`, red trend indicator.
- **Card 3 (Open human reviews)**: Value `"02"`, Subtext `"1 due before 11:00 · nothing auto-executes"`, clipboard badge.
- **Card 4 (Task completion)**: Value `"0%"`, Subtext `"0 of 3 done · today's manager checks"`, checklist badge.

### C. Urgency-Ranked Stores List (`UrgencyStoreList.tsx` - 7 Cols Layout)
- **Header**: `"Urgency-ranked stores"` with `"All stores →"` action button.
- **Subtitle**: `"Rank reflects exposure, time sensitivity, and evidence strength."`
- **Rows**:
  - **Row 1**: `Store 17 · Indiranagar (Bengaluru East)` | Badge: `High` | `"Fast movers at risk - PO 4821 - 2 days late"`
  - **Row 2**: `Store 04 · Koramangala (Bengaluru South)` | Badge: `High` | `"Sales decline - -12.8% vs 4-week baseline"`
  - **Row 3**: `Store 23 · Whitefield (Bengaluru East)` | Badge: `Medium` | `"Elevated wastage - Leafy greens - 6.4% of receipts"`
  - **Row 4**: `Store 11 · Jayanagar (Bengaluru South)` | Badge: `Watch` | `"Cold-chain check due - Last logged 17h ago"`
- **Footer**: `"Next automated signal evaluation at 09:00 IST"` & `"Evaluation rules →"`

### D. Network Sales Trend Chart (`NetworkSalesWidget.tsx` - 5 Cols Top)
- **Header**: `"Network sales trend"` | Value: `"₹8.42L"` (`7-day gross`) | Badge: `"↘ 3.4%"`.
- **Chart**: Recharts `<AreaChart>` with emerald gradient area curve from `15 OCT` to `21 OCT`.
- **Subtext**: `"↘ -3.4% vs prior 7 days · synthetic POS total"`.

### E. Signals to Verify Widget (`SignalsVerifyWidget.tsx` - 5 Cols Bottom)
- **Header**: `"Signals to verify"` with `"02 unconfirmed"` badge.
- **Item 1**: `Store 23 · wastage above local norm` (`Leafy greens at 6.4% of receipts - 7-day sample`) | Badge: `Medium`.
- **Item 2**: `Store 11 · check overdue` (`Cold-chain log has no entry in 17h`) | Badge: `Watch`.
- **Footer**: `"Requires store floor check"` & `"Assign task →"`.

---

## 4. Phase Completion Log
- [x] **Phase 1 — Layout Shell & Theme Setup**: AppShell, TopBar, Sidebar, typography, and theme tokens.
- [x] **Phase 2 — Executive Morning Briefing & Metric Strip**: Built `MorningBriefingBanner.tsx` and `MetricCardsGrid.tsx`.
- [x] **Phase 3 — Lower Section: Urgency Store List & Right Sidebar Widgets**: Built `UrgencyStoreList.tsx`, `NetworkSalesWidget.tsx`, and `SignalsVerifyWidget.tsx`.
- [ ] **Phase 4 — Real-Time Approvals & Live Actions Drawer**: Pending approvals drawer, What-If simulation preview.
- [ ] **Phase 5 — Full Backend Integration & Polish**: Connect `/api/v1` backend endpoints.
