import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import InvoicesModuleService from "../../../modules/invoices/service"
import { INVOICES_MODULE } from "../../../modules/invoices"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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
  });

  return res.json({ invoices });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const invoicesModuleService: InvoicesModuleService = req.scope.resolve(INVOICES_MODULE);

  const body = req.body as { order_id: string; customer_id: string; amount: number };

  const invoice = await invoicesModuleService.createInvoices({
    order_id: body.order_id,
    customer_id: body.customer_id,
    amount: body.amount,
  });

  return res.json({ invoice });
}
