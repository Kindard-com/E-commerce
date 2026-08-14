const Medusa = require("@medusajs/js-sdk").default || require("@medusajs/js-sdk");

const client = new Medusa({
  baseUrl: "http://localhost:9000",
  apiKey: process.env.MEDUSA_ADMIN_API_KEY || ""
});

async function fix() {
  try {
    const { regions } = await client.admin.region.list();
    console.log("Regions found:", regions.map(r => r.name));
    
    if (regions.length > 0) {
      const region = regions[0];
      const existingCountries = region.countries ? region.countries.map(c => c.iso_2) : [];
      console.log("Current countries in " + region.name + ":", existingCountries);
      
      const toAdd = ['nl', 'be', 'de', 'fr', 'gb', 'us', 'ch', 'ae', 'es', 'it'];
      const combined = Array.from(new Set([...existingCountries, ...toAdd]));
      
      await client.admin.region.update(region.id, {
        countries: combined
      });
      
      console.log("Successfully updated region with new countries:", combined);
    }
  } catch(e) {
    console.error(e.message, e.response?.data);
  }
}

fix();
