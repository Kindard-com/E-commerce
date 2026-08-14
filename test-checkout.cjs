require('dotenv').config()

const Medusa = require("@medusajs/js-sdk");

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_URL || "http://127.0.0.1:9000"
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const salesChannelId = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID

if (!publishableKey) {
  console.error("Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY before running this script.")
  process.exit(1)
}

const medusa = new Medusa.default({
  baseUrl,
  publishableKey,
});

async function test() {
  try {
    const { regions } = await medusa.store.region.list();
    const region = regions[0];

    console.log("Creating cart...");
    const { cart } = await medusa.store.cart.create({ 
      region_id: region.id,
      ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
      email: "test@example.com",
      currency_code: "eur"
    });
    console.log("Cart created:", cart.id);

    console.log("Initializing payment sessions...");
    const { cart: cartWithSessions } = await medusa.store.cart.createPaymentSessions(cart.id);
    console.log("Payment sessions created successfully.");
    console.log(cartWithSessions.payment_collection.payment_sessions.map(s => s.provider_id));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
