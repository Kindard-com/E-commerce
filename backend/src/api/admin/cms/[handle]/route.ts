import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CMS_MODULE } from "../../../../modules/cms"
import CmsService from "../../../../modules/cms/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params
  const cmsModuleService: CmsService = req.scope.resolve(CMS_MODULE)

  const [content] = await cmsModuleService.listCmsContents({ handle })

  if (!content) {
    return res.status(404).json({ message: "Content not found" })
  }

  res.json({ content })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params
  const cmsModuleService: CmsService = req.scope.resolve(CMS_MODULE)

  const [content] = await cmsModuleService.listCmsContents({ handle })

  if (!content) {
    return res.status(404).json({ message: "Content not found" })
  }

  const updated = await cmsModuleService.updateCmsContents({
    id: content.id,
    ...(req.body as any)
  })

  res.json({ content: updated })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params
  const cmsModuleService: CmsService = req.scope.resolve(CMS_MODULE)

  const [content] = await cmsModuleService.listCmsContents({ handle })

  if (content) {
    await cmsModuleService.deleteCmsContents(content.id)
  }

  res.json({ success: true })
}
