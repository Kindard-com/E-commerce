const Medusa = require("@medusajs/js-sdk").default || require("@medusajs/js-sdk");

const client = new Medusa({
  baseUrl: "http://127.0.0.1:9000",
  apiKey: "sk_1c9eccccec38de3046749b29f09292146f1587ded88e1b8a359782f0f58398b2"
});

async function check() {
  try {
    const { regions } = await client.admin.region.list();
    const region = regions[0];
    
    console.log("Region ID:", region.id);
    
    const { shipping_options } = await client.admin.shippingOption.list();
    console.log("Global Shipping Options:", shipping_options.length);
    
    const { shipping_profiles } = await client.admin.shippingProfile.list();
    console.log("Shipping Profiles:", shipping_profiles.map(p => ({id: p.id, name: p.name})));

    const { stock_locations } = await client.admin.stockLocation.list();
    console.log("Stock Locations:", stock_locations.map(sl => sl.id));
    
  } catch(e) {
    console.error("Error:", e.message);
  }
}

check();
