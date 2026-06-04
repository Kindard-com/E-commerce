import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id;

  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = req.scope.resolve("query");

  const { data: invoices } = await query.graph({
    entity: "invoice",
    fields: [
      "id",
      "order_id",
      "customer_id",
      "amount",
      "status",
      "date",
      "pdf_url"
    ],
    filters: {
      customer_id: customerId,
    },
  });

  return res.json({ invoices });
}
