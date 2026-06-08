const Medusa = require('@medusajs/js-sdk').default || require('@medusajs/js-sdk');

function mapMedusaProduct(storeProduct) {
  let minPrice = 0;
  let originalPrice = null;
  let discount = null;

  if (storeProduct.variants && storeProduct.variants.length > 0) {
    const prices = storeProduct.variants.map((v) => {
      if (v.calculated_price?.calculated_amount) return v.calculated_price.calculated_amount;
      if (v.prices && v.prices.length > 0) {
         const eurPrice = v.prices.find((p) => p.currency_code === 'eur');
         return eurPrice ? eurPrice.amount : v.prices[0].amount;
      }
      return 0;
    });
    minPrice = Math.min(...prices);

    const origPrices = storeProduct.variants.map((v) => {
      if (v.calculated_price?.original_amount) return v.calculated_price.original_amount;
      if (v.prices && v.prices.length > 0) {
         const eurPrice = v.prices.find((p) => p.currency_code === 'eur');
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

  const colors = new Set();
  const sizes = new Set();
  const avail = new Set();

  const colorOption = storeProduct.options?.find((o) => o.title.toLowerCase() === 'color');
  const sizeOption = storeProduct.options?.find((o) => o.title.toLowerCase() === 'size');

  if (colorOption && colorOption.values) {
    colorOption.values.forEach((v) => colors.add(v.value));
  }
  if (sizeOption && sizeOption.values) {
    sizeOption.values.forEach((v) => sizes.add(v.value));
  }

  storeProduct.variants?.forEach((v) => {
    if (v.manage_inventory === false || v.inventory_quantity > 0 || v.allow_backorder) {
      const szOpt = v.options?.find((o) => o.option_id === sizeOption?.id || o.title?.toLowerCase() === 'size');
      if (szOpt) avail.add(szOpt.value);
    }
  });

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
    dark: false, 
    colors: finalColors,
    sizes: finalSizes,
    avail: finalAvail,
    rating: 5.0, 
    isNew: true, 
    category: storeProduct.categories?.[0]?.handle || 'uncategorized',
  };
}

async function test() {
  try {
    const medusaServerClient = new Medusa({
      baseUrl: "http://127.0.0.1:9000",
      apiKey: "sk_1c9eccccec38de3046749b29f09292146f1587ded88e1b8a359782f0f58398b2",
      maxRetries: 3,
    });

    console.log("Attempting to fetch prod_01KSGQVVVQ718BHPPHFXVMY6KS using admin.product.retrieve...");
    const res = await medusaServerClient.admin.product.retrieve("prod_01KSGQVVVQ718BHPPHFXVMY6KS");
    console.log("Retrieved product successfully.");
    
    console.log("Testing mapper...");
    const mapped = mapMedusaProduct(res.product);
    console.log("Mapped successfully!", mapped.name);
  } catch (err) {
    console.error("Error during test:", err.message);
    if (err.response) {
      console.error("Data:", err.response.data);
    }
    console.error(err.stack);
  }
}

test();
