// ============================================================
// FreshGuard AI — Types: Open Food Facts API Integration
// ============================================================

export interface OpenFoodFactsApiResponse {
  code?: string;
  status?: number;
  status_verbose?: string;
  product?: {
    product_name?: string;
    product_name_en?: string;
    generic_name?: string;
    brands?: string;
    brand_owner?: string;
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
    image_ingredients_url?: string;
    image_nutrition_url?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
    categories?: string;
    categories_tags?: string[];
    quantity?: string;
    serving_size?: string;
    nutriscore_grade?: string;
    nova_group?: number;
    ecoscore_grade?: string;
    countries?: string;
    allergens?: string;
    labels?: string;
    nutriments?: Record<string, number | string | undefined>;
  };
}

export interface ValidatedNutriments {
  energyKcal: number | null;
  energyKj: number | null;
  fat: number | null;
  saturatedFat: number | null;
  carbohydrates: number | null;
  sugars: number | null;
  fiber: number | null;
  proteins: number | null;
  salt: number | null;
  sodium: number | null;
}

export interface ValidatedOpenFoodFactsProduct {
  barcode: string;
  productName: string | null;
  brands: string | null;
  imageUrl: string | null;
  ingredientsText: string | null;
  categories: string[];
  quantity: string | null;
  servingSize: string | null;
  nutriscoreGrade: string | null;
  novaGroup: number | null;
  ecoscoreGrade: string | null;
  allergens: string | null;
  labels: string | null;
  nutriments: ValidatedNutriments;
  openFoodFactsUrl: string;
}

export type ProductLookupStatus = 'idle' | 'loading' | 'success' | 'error';
