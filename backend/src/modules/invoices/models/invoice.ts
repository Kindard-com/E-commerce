import { model } from "@medusajs/framework/utils"

export const Invoice = model.define("invoice", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  amount: model.number(),
  status: model.enum(["pending", "paid", "void"]).default("pending"),
  date: model.dateTime(),
  pdf_url: model.text().nullable(),
})
