const Medusa = require("@medusajs/js-sdk").default;

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  apiKey: process.env.MEDUSA_ADMIN_API_KEY || "",
});

async function run() {
  try {
    // Let's try to query api-keys via sdk
    const { api_keys } = await medusa.admin.apiKey.list();
    let pk = api_keys.find(k => k.type === "publishable");
    
    if (!pk) {
      const res = await medusa.admin.apiKey.create({
        title: "Storefront PK",
        type: "publishable",
      });
      pk = res.api_key;
    }
    
    console.log("PK:", pk.token);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
