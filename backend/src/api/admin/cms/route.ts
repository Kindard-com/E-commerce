import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../modules/cms"
import CmsService from "../../../modules/cms/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsModuleService: CmsService = req.scope.resolve(CMS_MODULE)
  const contents = await cmsModuleService.listCmsContents()

  res.json({ contents })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsModuleService: CmsService = req.scope.resolve(CMS_MODULE)
  
  const content = await cmsModuleService.createCmsContents(req.body as any)

  res.json({ content })
}
