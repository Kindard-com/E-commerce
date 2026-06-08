const Medusa = require("@medusajs/js-sdk");

const medusa = new Medusa.default({
  baseUrl: "http://127.0.0.1:9001",
  publishableKey: "pk_example_from_env"
});

async function test() {
  try {
    const { regions } = await medusa.store.region.list();
    const region = regions[0];

    console.log("Creating cart...");
    const { cart } = await medusa.store.cart.create({ 
      region_id: region.id,
      sales_channel_id: "sc_01KSGQVMHPZ1V1VK4KWHPM3CM1",
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
