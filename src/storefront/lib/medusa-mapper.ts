import { Product } from './products';

// We use `any` here to avoid strict Medusa types mismatch during rapid dev,
// but ideally this is typed with StoreProduct from @medusajs/types.
export function mapMedusaProduct(storeProduct: any): Product {
  // Find prices from variants
  let minPrice = 0;
  let originalPrice = null;
  let discount = null;

  if (storeProduct.variants && storeProduct.variants.length > 0) {
    // Support both Store API (calculated_price) and Admin API (prices array)
    const prices = storeProduct.variants.map((v: any) => {
      if (v.calculated_price?.calculated_amount) return v.calculated_price.calculated_amount;
      if (v.prices && v.prices.length > 0) {
         // Try to find EUR first, otherwise fallback to first price
         const eurPrice = v.prices.find((p: any) => p.currency_code === 'eur');
         return eurPrice ? eurPrice.amount : v.prices[0].amount;
      }
      return 0;
    });
    minPrice = Math.min(...prices);

    const origPrices = storeProduct.variants.map((v: any) => {
      if (v.calculated_price?.original_amount) return v.calculated_price.original_amount;
      // Admin API doesn't distinguish orig amount easily without price lists, so just use base
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

  // Find unique colors and sizes from options
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

  // Check variant availability
  storeProduct.variants?.forEach((v: any) => {
    // In a real app we'd check v.inventory_quantity
    // For now we assume all variants returned are available unless managed otherwise
    if (v.manage_inventory === false || v.inventory_quantity > 0 || v.allow_backorder) {
      const szOpt = v.options?.find((o: any) => o.option_id === sizeOption?.id || o.title?.toLowerCase() === 'size');
      if (szOpt) avail.add(szOpt.value);
    }
  });

  // Default colors/sizes if none exist, so the UI doesn't break
  const finalColors = colors.size > 0 ? Array.from(colors) : ['#000000'];
  const finalSizes = sizes.size > 0 ? Array.from(sizes) : ['One Size'];
  const finalAvail = avail.size > 0 ? Array.from(avail) : finalSizes;

  return {
    id: storeProduct.id,
    medusa_id: storeProduct.id,
    variants: storeProduct.variants,
    brand: storeProduct.collection?.title || 'KINDARD KIDS',
    name: storeProduct.title,
    price: minPrice,
    orig: originalPrice,
    discount: discount,
    image: storeProduct.thumbnail || undefined,
    dark: false, // Could be determined via a custom attribute if needed
    colors: finalColors,
    sizes: finalSizes,
    avail: finalAvail,
    rating: 5.0, // Hardcoded for now
    isNew: true, // Could derive from created_at
    category: storeProduct.categories?.[0]?.handle || 'uncategorized',
  };
}
