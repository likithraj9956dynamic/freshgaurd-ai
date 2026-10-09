// ============================================================
// FreshGuard AI — Page: Product Registry & Barcode Intelligence
// Open Food Facts API Integration (https://world.openfoodfacts.org)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ScanBarcode,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck,
  Package,
  Layers,
  Flame,
  Apple,
  X,
  ArrowRight
} from 'lucide-react';
import {
  fetchOpenFoodFactsProduct,
  BarcodeValidationError,
  ProductNotFoundError,
  OpenFoodFactsNetworkError
} from '../services/openfoodfacts';
import type { ValidatedOpenFoodFactsProduct } from '../types/openfoodfacts';

// Sample verified barcodes from the Open Food Facts catalog for testing
const SAMPLE_PRODUCTS = [
  { barcode: '737628064502', name: 'Thai Peanut Noodle Kit', brand: 'Simply Asia', category: 'Noodles' },
  { barcode: '3017620422003', name: 'Nutella Spread', brand: 'Ferrero', category: 'Spreads' },
  { barcode: '5449000000996', name: 'Coca-Cola Original', brand: 'Coca-Cola', category: 'Beverages' },
  { barcode: '3228857000166', name: 'Pain de mie Extra Moelleux', brand: 'Jacquet', category: 'Bakery' },
  { barcode: '0041220576920', name: 'Organics Whole Milk', brand: 'H-E-B', category: 'Dairy' },
];

export function ProductLookupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBarcode = searchParams.get('barcode') || '';

  const [inputBarcode, setInputBarcode] = useState<string>(initialBarcode);
  const [product, setProduct] = useState<ValidatedOpenFoodFactsProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'validation' | 'not-found' | 'network' | null>(null);
  const [searchedBarcode, setSearchedBarcode] = useState<string>('');

  const executeLookup = useCallback(async (codeToLookup: string) => {
    const trimmed = codeToLookup.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a barcode number to look up.');
      setErrorType('validation');
      setProduct(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorType(null);
    setProduct(null);
    setSearchedBarcode(trimmed);

    try {
      const result = await fetchOpenFoodFactsProduct(trimmed);
      setProduct(result);
      setSearchParams({ barcode: result.barcode });
    } catch (err: unknown) {
      if (err instanceof BarcodeValidationError) {
        setErrorMessage(err.message);
        setErrorType('validation');
      } else if (err instanceof ProductNotFoundError) {
        setErrorMessage(err.message);
        setErrorType('not-found');
      } else if (err instanceof OpenFoodFactsNetworkError) {
        setErrorMessage(err.message);
        setErrorType('network');
      } else {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setErrorMessage(`Lookup failed: ${msg}`);
        setErrorType('network');
      }
    } finally {
      setIsLoading(false);
    }
  }, [setSearchParams]);

  // Execute lookup on mount if barcode is in URL
  useEffect(() => {
    if (initialBarcode) {
      executeLookup(initialBarcode);
    }
  }, [initialBarcode, executeLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(inputBarcode);
  };

  const handleSelectSample = (barcode: string) => {
    setInputBarcode(barcode);
    executeLookup(barcode);
  };

  const handleClear = () => {
    setInputBarcode('');
    setProduct(null);
    setErrorMessage(null);
    setErrorType(null);
    setSearchedBarcode('');
    setSearchParams({});
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      
      {/* ============================================================
          HEADER: PRODUCT REGISTRY & BARCODE INTELLIGENCE
          ============================================================ */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <ScanBarcode className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              OPEN FOOD FACTS API v2 · LIVE TELEMETRY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7]">
            Product Intelligence & Barcode Registry
          </h1>

          <p className="text-sm sm:text-base text-[#8E9B90] font-light leading-relaxed">
            Direct read-only integration with the Open Food Facts global food database.
            Query barcodes (EAN, UPC, GTIN) to inspect registered formulations, ingredient lists,
            verified nutritional matrices, and regulatory categorisation without modifying core inventory state.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#C5A059]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              API STATUS: ONLINE
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#8E9B90]">
              ENDPOINT: world.openfoodfacts.org/api/v2
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#8E9B90]">
              LICENSE: ODbL / DbCL
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SEARCH CONTROLS & SAMPLE BARCODES
          ============================================================ */}
      <div className="royal-card p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="barcode-input" className="block">
            <span className="text-xs font-mono tracking-wider text-[#C5A059] uppercase block mb-1.5">
              Enter or Scan Product Barcode
            </span>
            <span className="text-xs text-[#8E9B90] block">
              Supports 8 to 14-digit numeric barcodes (EAN-8, UPC-12, EAN-13, GTIN-14)
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <ScanBarcode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/70" />
              <input
                id="barcode-input"
                type="text"
                placeholder="e.g. 737628064502 or 3017620422003"
                value={inputBarcode}
                onChange={(e) => setInputBarcode(e.target.value)}
                disabled={isLoading}
                className="w-full rounded text-sm font-mono pl-10 pr-10 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/50"
              />
              {inputBarcode && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E9B90] hover:text-[#FDFBF7]"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputBarcode.trim()}
              className="btn-royal-gold px-7 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Querying Registry...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Barcode</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Selector */}
        <div className="pt-4 border-t border-white/5 space-y-2.5">
          <span className="text-[11px] font-mono tracking-wider text-[#8E9B90] uppercase block">
            Quick Test Barcodes (Live Open Food Facts Data):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRODUCTS.map((s) => (
              <button
                key={s.barcode}
                type="button"
                onClick={() => handleSelectSample(s.barcode)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors flex items-center gap-2 ${
                  inputBarcode === s.barcode
                    ? 'border-[#C5A059] bg-[#0B3B2C] text-[#FDFBF7]'
                    : 'border-white/10 bg-[#071C16] text-[#8E9B90] hover:text-[#FDFBF7] hover:border-[#C5A059]/40'
                }`}
              >
                <span className="font-mono text-[#E0C588]">{s.barcode}</span>
                <span className="text-white/40">·</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          STATE DISPLAYS: LOADING, ERRORS, EMPTY
          ============================================================ */}

      {/* Loading State */}
      {isLoading && (
        <div className="royal-card p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-xl font-editorial text-[#FDFBF7]">Querying Open Food Facts API</h3>
            <p className="text-xs font-mono text-[#C5A059] mt-1">
              GET https://world.openfoodfacts.org/api/v2/product/{searchedBarcode}.json
            </p>
            <p className="text-xs text-[#8E9B90] mt-2">
              Validating schema and extracting product formulation, nutriments, and registry tags...
            </p>
          </div>
        </div>
      )}

      {/* Error / Not Found / Validation State */}
      {!isLoading && errorMessage && (
        <div
          className={`royal-card p-6 sm:p-8 space-y-4 border ${
            errorType === 'validation'
              ? 'border-amber-500/40 bg-amber-950/20'
              : errorType === 'not-found'
              ? 'border-[#9E2A2B]/40 bg-[#9E2A2B]/10'
              : 'border-[#9E2A2B]/60 bg-[#9E2A2B]/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded border border-white/10 bg-[#071C16] flex-shrink-0">
              <AlertTriangle
                className={`w-6 h-6 ${
                  errorType === 'validation' ? 'text-amber-400' : 'text-[#F87171]'
                }`}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#E0C588]">
                  {errorType === 'validation' && 'INPUT VALIDATION REJECTED'}
                  {errorType === 'not-found' && 'CATALOG RECORD NOT FOUND'}
                  {errorType === 'network' && 'NETWORK COMMUNICATION ERROR'}
                </span>
                {searchedBarcode && (
                  <span className="text-xs font-mono text-[#8E9B90]">
                    Barcode: {searchedBarcode}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-editorial text-[#FDFBF7]">
                {errorType === 'validation' && 'Invalid Barcode Format'}
                {errorType === 'not-found' && 'No Product Registered For This Barcode'}
                {errorType === 'network' && 'Failed to Reach Open Food Facts Service'}
              </h3>

              <p className="text-xs text-[#8E9B90] leading-relaxed">
                {errorMessage}
              </p>

              {errorType === 'not-found' && (
                <p className="text-xs text-[#8E9B90] pt-2">
                  Tip: Standard barcodes are typically found directly on the packaging of food items.
                  Try clicking one of the sample barcodes above to test verified records.
                </p>
              )}

              {errorType === 'network' && (
                <div className="pt-3">
                  <button
                    onClick={() => executeLookup(searchedBarcode)}
                    className="btn-royal-outline text-xs flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry API Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Idle / Blank State */}
      {!isLoading && !errorMessage && !product && (
        <div className="royal-card p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded border border-[#C5A059]/30 bg-[#0B3B2C]/40 flex items-center justify-center">
            <Package className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-editorial text-[#FDFBF7]">
              Ready for Barcode Verification
            </h3>
            <p className="text-xs text-[#8E9B90] leading-relaxed">
              Scan or enter a product barcode above to pull validated real-time product intelligence
              from Open Food Facts, including ingredient transparency, brand, categories, and nutrition facts.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          SUCCESS STATE: VALIDATED PRODUCT DOSSIER
          ============================================================ */}
      {!isLoading && product && (
        <div className="space-y-8">
          
          {/* Main Product Card */}
          <div className="royal-card p-6 sm:p-8 space-y-8">
            
            {/* Top Bar / Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#C5A059]/15">
              <div className="flex items-center gap-3">
                <span className="badge-royal-resolved flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED IN OPEN FOOD FACTS
                </span>
                <span className="text-xs font-mono text-[#C5A059]">
                  BARCODE: {product.barcode}
                </span>
              </div>

              <a
                href={product.openFoodFactsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-[#E0C588] transition-colors font-mono"
              >
                <span>View on Open Food Facts</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Product Overview Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Product Imagery */}
              <div className="md:col-span-4 lg:col-span-3 space-y-3">
                <div className="rounded border border-[#C5A059]/25 bg-[#041410] overflow-hidden aspect-square flex items-center justify-center p-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.productName || 'Product Image'}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <Package className="w-10 h-10 text-[#8E9B90]/40 mx-auto" />
                      <span className="text-[11px] font-mono text-[#8E9B90] block">
                        No product image available in registry
                      </span>
                    </div>
                  )}
                </div>

                {/* Score Badges */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded border border-white/5 bg-[#071C16]">
                    <span className="text-[10px] font-mono text-[#8E9B90] block">NUTRI-SCORE</span>
                    <span className="text-base font-editorial font-bold text-[#E0C588]">
                      {product.nutriscoreGrade ? `GRADE ${product.nutriscoreGrade}` : 'Not graded'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-white/5 bg-[#071C16]">
                    <span className="text-[10px] font-mono text-[#8E9B90] block">NOVA GROUP</span>
                    <span className="text-base font-editorial font-bold text-[#E0C588]">
                      {product.novaGroup !== null ? `GROUP ${product.novaGroup}` : 'Not classified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                
                {/* Titles */}
                <div>
                  <span className="text-xs font-mono tracking-widest text-[#C5A059] uppercase block mb-1">
                    {product.brands || 'Brand not specified in registry'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-editorial text-[#FDFBF7]">
                    {product.productName || 'Product name not specified in registry'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#8E9B90]">
                    {product.quantity && (
                      <span>Quantity: <strong className="text-[#FDFBF7] font-mono">{product.quantity}</strong></span>
                    )}
                    {product.servingSize && (
                      <span>Serving Size: <strong className="text-[#FDFBF7] font-mono">{product.servingSize}</strong></span>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono tracking-wider text-[#C5A059] uppercase block">
                    Product Categories:
                  </span>
                  {product.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {product.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded text-xs border border-white/10 bg-[#071C16] text-[#E0C588]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8E9B90] italic">
                      No categories specified in Open Food Facts record.
                    </p>
                  )}
                </div>

                {/* Ingredients Text */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono tracking-wider text-[#C5A059] uppercase block">
                    Ingredients Statement:
                  </span>
                  {product.ingredientsText ? (
                    <p className="text-xs text-[#FDFBF7]/90 leading-relaxed bg-[#071C16] p-4 rounded border border-white/5">
                      {product.ingredientsText}
                    </p>
                  ) : (
                    <p className="text-xs text-[#8E9B90] italic">
                      Ingredients not provided in Open Food Facts registry for this item.
                    </p>
                  )}
                  {product.allergens && (
                    <div className="text-xs text-[#F87171] mt-2">
                      <strong className="font-mono uppercase text-[10px] text-[#F87171]/80">Declared Allergens:</strong> {product.allergens}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* ============================================================
                NUTRITIONAL TABLE (PER 100g / 100ml)
                ============================================================ */}
            <div className="pt-6 border-t border-[#C5A059]/15 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-[#C5A059] uppercase block">
                    NUTRITIONAL PROFILE
                  </span>
                  <h3 className="text-xl font-editorial text-[#FDFBF7]">
                    Nutrition Facts per 100g / 100ml
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#8E9B90]">
                  Official Registry Telemetry
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#C5A059]/20 text-[#8E9B90] font-mono uppercase text-[10px]">
                      <th className="py-2.5 px-4">Nutritional Metric</th>
                      <th className="py-2.5 px-4 text-right">Value per 100g / 100ml</th>
                      <th className="py-2.5 px-4 text-right">Status in Registry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Energy (Calories)</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.energyKcal !== null ? `${product.nutriments.energyKcal} kcal` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.energyKcal !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Energy (Kilojoules)</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.energyKj !== null ? `${product.nutriments.energyKj} kJ` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.energyKj !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Total Fat</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.fat !== null ? `${product.nutriments.fat} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.fat !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#8E9B90] pl-8">↳ Saturated Fat</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.saturatedFat !== null ? `${product.nutriments.saturatedFat} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.saturatedFat !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Total Carbohydrates</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.carbohydrates !== null ? `${product.nutriments.carbohydrates} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.carbohydrates !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#8E9B90] pl-8">↳ Sugars</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.sugars !== null ? `${product.nutriments.sugars} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.sugars !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Dietary Fiber</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.fiber !== null ? `${product.nutriments.fiber} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.fiber !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Proteins</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.proteins !== null ? `${product.nutriments.proteins} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.proteins !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#FDFBF7] font-medium">Salt</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.salt !== null ? `${product.nutriments.salt} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.salt !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-[#8E9B90] pl-8">↳ Sodium</td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#E0C588]">
                        {product.nutriments.sodium !== null ? `${product.nutriments.sodium} g` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-[#8E9B90]">
                        {product.nutriments.sodium !== null ? 'Reported' : 'Not reported'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[#8E9B90] italic pt-2">
                Note: Empty cells indicate metrics that were omitted or not reported by manufacturer contributions to Open Food Facts. Values are verified and not interpolated.
              </p>
            </div>

            {/* Compliance Footer */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8E9B90]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>
                  Licensing: Open Food Facts database is licensed under the{' '}
                  <a
                    href="https://opendatacommons.org/licenses/odbl/1-0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#E0C588]"
                  >
                    Open Database License (ODbL)
                  </a>.
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#C5A059]">
                FRESHGUARD TELEMETRY CONNECTOR
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
