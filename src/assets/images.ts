// ============================================================
// FreshGuard AI — Curated Editorial Photography Assets
// ============================================================

export const EDITORIAL_IMAGES = {
  // Store 17 featured hero / interior
  store17Hero: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1800&q=85',
  
  // Luxury fresh produce display
  freshProduce: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=85',
  
  // Organic leafy greens & artisanal market
  marketGreens: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1400&q=85',
  
  // Premium bakery & artisanal grains
  artisanalBakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
  
  // Logistics / refrigerated receiving bay / cold chain
  logisticsBay: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85',
  
  // Executive command / architectural store interior
  architecturalStore: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1600&q=85',

  // Organic harvest display
  harvestDisplay: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=85'
};

// Safe image helper that falls back gracefully if network fails
export function getEditorialImage(key: keyof typeof EDITORIAL_IMAGES, fallback = EDITORIAL_IMAGES.freshProduce): string {
  return EDITORIAL_IMAGES[key] || fallback;
}

