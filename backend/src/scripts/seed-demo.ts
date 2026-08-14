import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

const COUNTRIES = ["nl", "be", "de", "fr", "gb", "es", "it", "dk", "se"]
const SIZES = ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y"]

function imageUrl(file: string) {
  const origin = (process.env.STORE_CORS || "http://localhost:3000").split(",")[0]
  return `${origin}/api/images?file=${file}`
}

function variantsFor(skuPrefix: string, color: string, amount: number, extraUsd = 5) {
  return SIZES.map((size) => ({
    title: `${color} / ${size}`,
    sku: `${skuPrefix}-${size.replace("-", "")}`,
    options: { Size: size, Color: color },
    prices: [
      { amount, currency_code: "eur" },
      { amount: amount + extraUsd, currency_code: "usd" },
    ],
  }))
}

export default async function seedDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)
  const regionModuleService = container.resolve(Modules.REGION)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const apiKeyModuleService = container.resolve(Modules.API_KEY)

  logger.info("Seeding Kindard commerce catalog...")

  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = (await salesChannelModuleService.listSalesChannels({
    name: "Kindard Kids",
  }))[0]

  if (!defaultSalesChannel) {
    const existing = await salesChannelModuleService.listSalesChannels()
    defaultSalesChannel = existing[0]
  }

  if (!defaultSalesChannel) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Kindard Kids" }],
      },
    })
    defaultSalesChannel = salesChannelResult[0]
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Kindard Kids",
        supported_currencies: [
          { currency_code: "eur", is_default: true },
          { currency_code: "usd" },
        ],
        default_sales_channel_id: defaultSalesChannel.id,
      },
    },
  })

  const paymentProviders = ["pp_system_default"]
  if (process.env.MOLLIE_API_KEY) {
    paymentProviders.push("pp_mollie-hosted-checkout_mollie")
  }

  let region = (await regionModuleService.listRegions())[0]
  if (!region) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries: COUNTRIES,
            payment_providers: paymentProviders,
          },
        ],
      },
    })
    region = regionResult[0]
  }

  try {
    await createTaxRegionsWorkflow(container).run({
      input: COUNTRIES.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    })
  } catch {
    logger.info("Tax regions already exist, continuing.")
  }

  let stockLocation = (await stockLocationModuleService.listStockLocations())[0]
  if (!stockLocation) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Kindard Warehouse",
            address: {
              city: "Amsterdam",
              country_code: "NL",
              address_1: "Kindard Fulfillment",
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  })

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
  } catch {
    // already linked
  }

  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
  const shippingProfile = shippingProfiles.length
    ? shippingProfiles[0]
    : await fulfillmentModuleService.createShippingProfiles({
        name: "Default Shipping Profile",
        type: "default",
      })

  const { data: existingSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id"],
  })

  let fulfillmentSet = existingSets[0]
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Kindard Europe delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: COUNTRIES.map((country_code) => ({ country_code, type: "country" as const })),
        },
      ],
    })
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
  }

  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  if (!existingOptions.length && fulfillmentSet?.service_zones?.[0]?.id) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Standard", description: "Ship in 2-3 days.", code: "standard" },
          prices: [
            { currency_code: "eur", amount: 4.95 },
            { currency_code: "usd", amount: 6 },
            { region_id: region.id, amount: 4.95 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Express", description: "Ship in 24 hours.", code: "express" },
          prices: [
            { currency_code: "eur", amount: 9.95 },
            { currency_code: "usd", amount: 12 },
            { region_id: region.id, amount: 9.95 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
  }

  let publishableApiKey = (await apiKeyModuleService.listApiKeys({ type: "publishable" }))[0]
  if (!publishableApiKey) {
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Kindard Storefront", type: "publishable", created_by: "" }],
      },
    })
    publishableApiKey = publishableApiKeyResult[0]
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  const wantedCategories = ["Tees", "Hoodies", "Shorts", "Knits", "Jackets", "Accessories"]
  const existingCategories = await productModuleService.listProductCategories()
  const missing = wantedCategories.filter(
    (name) => !existingCategories.some((category) => category.name === name),
  )
  if (missing.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: missing.map((name) => ({ name, is_active: true })) },
    })
    existingCategories.push(...result)
  }
  const categoryId = (name: string) =>
    existingCategories.find((category) => category.name === name || category.handle === name.toLowerCase())?.id

  const catalog = [
    {
      title: "Classic Logo Tee",
      handle: "classic-logo-tee",
      description: "Soft cotton tee with the Kindard logo. Built for everyday play.",
      category: "Tees",
      image: "product_kid_tee_blue_1779803656124.png",
      color: "Blue",
      amount: 35,
    },
    {
      title: "Mini Explorer Hoodie",
      handle: "mini-explorer-hoodie",
      description: "Premium kids hoodie for everyday play.",
      category: "Hoodies",
      image: "product_kid_hoodie_cream_1779803671261.png",
      color: "Cream",
      amount: 65,
    },
    {
      title: "Playtime Sweat Shorts",
      handle: "playtime-sweat-shorts",
      description: "Easy-move sweat shorts with a durable wash.",
      category: "Shorts",
      image: "product_kid_shorts_navy_1779803696624.png",
      color: "Navy",
      amount: 30,
    },
    {
      title: "Chunky Cable Knit",
      handle: "chunky-cable-knit",
      description: "Heavyweight cable knit that survives the playground.",
      category: "Knits",
      image: "product_kid_knit_sweater_1779803717074.png",
      color: "Sand",
      amount: 85,
    },
    {
      title: "Urban Ribbed Beanie",
      handle: "urban-ribbed-beanie",
      description: "One-size ribbed beanie for cool-weather drop days.",
      category: "Accessories",
      image: "product_kid_beanie_orange_1779803732374.png",
      color: "Orange",
      amount: 24,
      oneSize: true,
    },
    {
      title: "Vintage Wash Denim Jacket",
      handle: "vintage-wash-denim-jacket",
      description: "Vintage-wash denim jacket with room to layer.",
      category: "Jackets",
      image: "product_kid_jacket_denim_1779803748559.png",
      color: "Denim",
      amount: 95,
    },
  ]

  const productsToCreate = []
  for (const item of catalog) {
    const existing = await productModuleService.listProducts({ handle: item.handle })
    if (existing.length) continue
    productsToCreate.push({
      title: item.title,
      handle: item.handle,
      description: item.description,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryId(item.category) ? [categoryId(item.category)!] : [],
      thumbnail: imageUrl(item.image),
      images: [{ url: imageUrl(item.image) }],
      options: item.oneSize
        ? [
            { title: "Size", values: ["One Size"] },
            { title: "Color", values: [item.color] },
          ]
        : [
            { title: "Size", values: SIZES },
            { title: "Color", values: [item.color] },
          ],
      variants: item.oneSize
        ? [
            {
              title: `${item.color} / One Size`,
              sku: `KINDARD-BEANIE-${item.color.toUpperCase()}`,
              options: { Size: "One Size", Color: item.color },
              prices: [
                { amount: item.amount, currency_code: "eur" },
                { amount: item.amount + 5, currency_code: "usd" },
              ],
            },
          ]
        : variantsFor(`KINDARD-${item.handle.toUpperCase().slice(0, 8)}-${item.color.toUpperCase()}`, item.color, item.amount),
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  if (productsToCreate.length) {
    await createProductsWorkflow(container).run({
      input: { products: productsToCreate },
    })
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id"],
  })
  const leveled = new Set(existingLevels.map((level) => level.inventory_item_id))
  const missingLevels = inventoryItems
    .filter((item) => !leveled.has(item.id))
    .map((item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 250,
      inventory_item_id: item.id,
    }))
  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: missingLevels },
    })
  }

  logger.info(`Publishable API key: ${publishableApiKey.token}`)
  logger.info(`Sales channel: ${defaultSalesChannel.id}`)
  logger.info("Set these in the storefront .env:")
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`)
  logger.info(`NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID=${defaultSalesChannel.id}`)
  logger.info("Kindard commerce seed complete.")
}
