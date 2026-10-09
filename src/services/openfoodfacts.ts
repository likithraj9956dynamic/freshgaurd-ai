// ============================================================
// FreshGuard AI — Service: Open Food Facts API Client
// Read-only public API integration: https://world.openfoodfacts.org/api/v2
// Open Database License (ODbL) / Database Contents License (DbCL)
// ============================================================

import type {
  OpenFoodFactsApiResponse,
  ValidatedNutriments,
  ValidatedOpenFoodFactsProduct,
} from '../types/openfoodfacts';

export class BarcodeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BarcodeValidationError';
  }
}

export class ProductNotFoundError extends Error {
  readonly barcode: string;
  constructor(barcode: string, message?: string) {
    super(message || `Product not found in Open Food Facts registry for barcode ${barcode}`);
    this.name = 'ProductNotFoundError';
    this.barcode = barcode;
  }
}

export class OpenFoodFactsNetworkError extends Error {
  readonly statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'OpenFoodFactsNetworkError';
    this.statusCode = statusCode;
  }
}

/**
 * Normalizes and validates a barcode input string.
 * Strips whitespace, hyphens, and validates 8-14 numeric digit length.
 */
export function sanitizeAndValidateBarcode(rawBarcode: string): string {
  if (!rawBarcode || typeof rawBarcode !== 'string') {
    throw new BarcodeValidationError('Please enter a barcode number.');
  }

  const cleaned = rawBarcode.replace(/[\s\-]/g, '');

  if (!cleaned) {
    throw new BarcodeValidationError('Barcode cannot be empty.');
  }

  if (!/^\d+$/.test(cleaned)) {
    throw new BarcodeValidationError(
      'Invalid barcode format: Barcode must contain only numeric digits.'
    );
  }

  if (cleaned.length < 8 || cleaned.length > 14) {
    throw new BarcodeValidationError(
      `Invalid barcode length (${cleaned.length} digits). Standard GTIN/EAN/UPC barcodes are between 8 and 14 digits.`
    );
  }

  return cleaned;
}

/**
 * Safely parses a nutriment numeric value from the API payload.
 * Returns null if the value is null, undefined, NaN, or missing.
 * Prevents inventing or fabricating data.
 */
function parseNutrimentValue(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : null;
}

/**
 * Parses and splits categories into a clean list of strings.
 */
function parseCategories(categoriesRaw?: string, tagsRaw?: string[]): string[] {
  if (categoriesRaw && typeof categoriesRaw === 'string' && categoriesRaw.trim()) {
    return categoriesRaw
      .split(/[,;]/)
      .map((c) => c.trim().replace(/^en:/i, ''))
      .filter((c) => c.length > 0);
  }

  if (Array.isArray(tagsRaw) && tagsRaw.length > 0) {
    return tagsRaw
      .map((t) => t.replace(/^[a-z]{2}:/i, '').replace(/[-_]/g, ' ').trim())
      .filter((t) => t.length > 0);
  }

  return [];
}

/**
 * Fetches and validates product information from Open Food Facts API v2.
 * Endpoint: https://world.openfoodfacts.org/api/v2/product/{barcode}.json
 */
export async function fetchOpenFoodFactsProduct(
  barcodeInput: string,
  signal?: AbortSignal
): Promise<ValidatedOpenFoodFactsProduct> {
  const barcode = sanitizeAndValidateBarcode(barcodeInput);
  const endpoint = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    throw new OpenFoodFactsNetworkError(
      `Unable to reach Open Food Facts server (${message}). Please verify your internet connection.`,
      0
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ProductNotFoundError(barcode);
    }
    throw new OpenFoodFactsNetworkError(
      `Open Food Facts server responded with status HTTP ${response.status} ${response.statusText}`,
      response.status
    );
  }

  let data: OpenFoodFactsApiResponse;
  try {
    data = (await response.json()) as OpenFoodFactsApiResponse;
  } catch {
    throw new OpenFoodFactsNetworkError('Failed to parse API response from Open Food Facts as valid JSON.');
  }

  // Validate API response structure
  if (!data || typeof data !== 'object') {
    throw new OpenFoodFactsNetworkError('Received invalid or empty payload from Open Food Facts API.');
  }

  if (data.status === 0 || !data.product) {
    const reason = data.status_verbose || 'Product not found';
    throw new ProductNotFoundError(
      barcode,
      `Product not found in Open Food Facts catalog for barcode ${barcode} (${reason}).`
    );
  }

  const p = data.product;
  const rawNutriments = p.nutriments || {};

  const nutriments: ValidatedNutriments = {
    energyKcal: parseNutrimentValue(rawNutriments['energy-kcal_100g'] ?? rawNutriments['energy-kcal']),
    energyKj: parseNutrimentValue(rawNutriments['energy-kj_100g'] ?? rawNutriments['energy-kj'] ?? rawNutriments.energy_100g),
    fat: parseNutrimentValue(rawNutriments.fat_100g ?? rawNutriments.fat),
    saturatedFat: parseNutrimentValue(rawNutriments['saturated-fat_100g'] ?? rawNutriments['saturated-fat']),
    carbohydrates: parseNutrimentValue(rawNutriments.carbohydrates_100g ?? rawNutriments.carbohydrates),
    sugars: parseNutrimentValue(rawNutriments.sugars_100g ?? rawNutriments.sugars),
    fiber: parseNutrimentValue(rawNutriments.fiber_100g ?? rawNutriments.fiber),
    proteins: parseNutrimentValue(rawNutriments.proteins_100g ?? rawNutriments.proteins),
    salt: parseNutrimentValue(rawNutriments.salt_100g ?? rawNutriments.salt),
    sodium: parseNutrimentValue(rawNutriments.sodium_100g ?? rawNutriments.sodium),
  };

  const productName = p.product_name?.trim() || p.product_name_en?.trim() || p.generic_name?.trim() || null;
  const brands = p.brands?.trim() || p.brand_owner?.trim() || null;
  const imageUrl = p.image_front_url || p.image_url || p.image_front_small_url || null;
  const ingredientsText = p.ingredients_text?.trim() || p.ingredients_text_en?.trim() || null;
  const categories = parseCategories(p.categories, p.categories_tags);
  const quantity = p.quantity?.trim() || null;
  const servingSize = p.serving_size?.trim() || null;
  const allergens = p.allergens?.trim() || null;
  const labels = p.labels?.trim() || null;

  const nutriscoreGrade = p.nutriscore_grade ? String(p.nutriscore_grade).toUpperCase() : null;
  const novaGroup = typeof p.nova_group === 'number' ? p.nova_group : null;
  const ecoscoreGrade = p.ecoscore_grade ? String(p.ecoscore_grade).toUpperCase() : null;

  return {
    barcode,
    productName,
    brands,
    imageUrl,
    ingredientsText,
    categories,
    quantity,
    servingSize,
    nutriscoreGrade,
    novaGroup,
    ecoscoreGrade,
    allergens,
    labels,
    nutriments,
    openFoodFactsUrl: `https://world.openfoodfacts.org/product/${barcode}`,
  };
}
