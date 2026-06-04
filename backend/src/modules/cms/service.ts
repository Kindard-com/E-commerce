import { MedusaService } from "@medusajs/framework/utils"
import { CmsContent } from "./models/content"

export default class CmsService extends MedusaService({
  CmsContent,
}) {}
