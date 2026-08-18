import { Product } from './products';
import { normalizeStorefrontImage } from './storefront-image';

const CATEGORY_ALIASES: Record<string, string> = {
  shirts: 'tees',
  shirt: 'tees',
  't-shirts': 'tees',
  't-shirt': 'tees',
  tees: 'tees',
  sweatshirts: 'hoodies',
  sweatshirt: 'hoodies',
  hoodies: 'hoodies',
  hoodie: 'hoodies',
  pants: 'shorts',
  shorts: 'shorts',
  knits: 'knits',
  knit: 'knits',
  sweaters: 'knits',
  jackets: 'jackets',
  jacket: 'jackets',
  merch: 'accessories',
  accessories: 'accessories',
  accessory: 'accessories',
  hats: 'accessories',
}

export function normalizeCategory(handle?: string | null): string {
  if (!handle) return 'uncategorized'
  return CATEGORY_ALIASES[handle.toLowerCase()] || handle.toLowerCase()
}

export function mapMedusaProduct(storeProduct: any): Product {
  let minPrice = 0;
  let originalPrice = null;
  let discount = null;

  if (storeProduct.variants && storeProduct.variants.length > 0) {
    const prices = storeProduct.variants.map((v: any) => {
      if (v.calculated_price?.calculated_amount != null) return v.calculated_price.calculated_amount;
      if (v.prices && v.prices.length > 0) {
         const eurPrice = v.prices.find((p: any) => p.currency_code === 'eur');
         return eurPrice ? eurPrice.amount : v.prices[0].amount;
      }
      return 0;
    });
    minPrice = Math.min(...prices);

    const origPrices = storeProduct.variants.map((v: any) => {
      if (v.calculated_price?.original_amount != null) return v.calculated_price.original_amount;
      if (v.prices && v.prices.length > 0) {
         const eurPrice = v.prices.find((p: any) => p.currency_code === 'eur');
         return eurPrice ? eurPrice.amount : v.prices[0].amount;
      }
      return 0;
    });
    const maxOrig = Math.max(...origPrices);
    if (maxOrig > minPrice) {
      originalPrice = maxOrig;
      discount = Math.round(((maxOrig - minPrice) / maxOrig) * 100);
    }
  }

  const colors = new Set<string>();
  const sizes = new Set<string>();
  const avail = new Set<string>();

  const colorOption = storeProduct.options?.find((o: any) => o.title.toLowerCase() === 'color');
  const sizeOption = storeProduct.options?.find((o: any) => o.title.toLowerCase() === 'size');

  if (colorOption && colorOption.values) {
    colorOption.values.forEach((v: any) => colors.add(v.value));
  }
  if (sizeOption && sizeOption.values) {
    sizeOption.values.forEach((v: any) => sizes.add(v.value));
  }

  storeProduct.variants?.forEach((v: any) => {
    const inStock =
      v.manage_inventory === false ||
      v.allow_backorder ||
      v.inventory_quantity == null ||
      v.inventory_quantity > 0
    if (!inStock) return
    const szOpt = v.options?.find((o: any) => o.option_id === sizeOption?.id || o.title?.toLowerCase() === 'size');
    if (szOpt) avail.add(szOpt.value);
  });

  const finalColors = colors.size > 0 ? Array.from(colors) : ['#000000'];
  const finalSizes = sizes.size > 0 ? Array.from(sizes) : ['One Size'];
  const finalAvail = avail.size > 0 ? Array.from(avail) : finalSizes;

  const createdAt = storeProduct.created_at ? new Date(storeProduct.created_at).getTime() : Date.now()
  const ninetyDays = 90 * 24 * 60 * 60 * 1000

  return {
    id: storeProduct.id,
    medusa_id: storeProduct.id,
    variants: storeProduct.variants,
    brand: storeProduct.collection?.title || 'KINDARD KIDS',
    name: storeProduct.title,
    price: minPrice,
    orig: originalPrice,
    discount: discount,
    image: normalizeStorefrontImage(storeProduct.thumbnail || storeProduct.images?.[0]?.url),
    dark: false,
    colors: finalColors,
    sizes: finalSizes,
    avail: finalAvail,
    rating: 5.0,
    isNew: Date.now() - createdAt < ninetyDays,
    category: normalizeCategory(storeProduct.categories?.[0]?.handle || storeProduct.categories?.[0]?.name),
  };
}
