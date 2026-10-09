// ============================================================
// FreshGuard AI — Curated editorial imagery
// ============================================================

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const IMAGERY = {
  // Cinematic grocery interior (hero)
  groceryInterior: U('photo-1542838132-92c53300491e', 2000),
  // Fresh produce display
  produce: U('photo-1518843875459-f738682238a6'),
  // Fresh fruit arrangement
  fruit: U('photo-1540420773420-3366772f4999'),
  // Retail shelves / merchandising
  shelves: U('photo-1578916171728-46686eac8d58'),
  // Bakery / fresh bread
  bakery: U('photo-1509440159596-0249088772ff'),
  // Produce market stall
  market: U('photo-1571771894821-ce9b6c11b08e'),
  // Fresh fruit close-up
  fruitClose: U('photo-1610832958506-aa56368176cf'),
};
