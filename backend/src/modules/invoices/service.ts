import { MedusaService } from "@medusajs/framework/utils"
import { Invoice } from "./models/invoice"

class InvoicesModuleService extends MedusaService({
  Invoice,
}) {}

export default InvoicesModuleService
