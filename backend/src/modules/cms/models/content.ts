import { model } from "@medusajs/framework/utils"

export const CmsContent = model.define("cms_content", {
  id: model.id().primaryKey(),
  type: model.text().default("global"), // e.g., 'page', 'global'
  handle: model.text().unique(), // e.g., 'homepage', 'footer', 'faq'
  data: model.json().default({}), // Arbitrary content data
  is_published: model.boolean().default(true),
})
