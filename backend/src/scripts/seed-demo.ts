import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createProductsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  logger.info("Seeding Kindard demo commerce data...")

  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = (await salesChannelModuleService.listSalesChannels({
    name: "Kindard Kids",
  }))[0]

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
        supported_currencies: [
          { currency_code: "eur", is_default: true },
          { currency_code: "usd" },
        ],
        default_sales_channel_id: defaultSalesChannel.id,
      },
    },
  })

  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: ["nl", "de", "fr", "be"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regionResult[0]

  await createTaxRegionsWorkflow(container).run({
    input: region.countries!.map((country) => ({
      country_code: country.iso_2,
    })),
  })

  const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Kindard Warehouse",
          address: {
            city: "Amsterdam",
            country_code: "NL",
            address_1: "",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  })

  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Kindard Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })
  const publishableApiKey = publishableApiKeyResult[0]

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
  const shippingProfile = shippingProfiles.length
    ? shippingProfiles[0]
    : await fulfillmentModuleService.createShippingProfiles({
        name: "Default Shipping Profile",
        type: "default",
      })

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Mini Explorer Hoodie",
          handle: "mini-explorer-hoodie",
          description: "Premium kids hoodie for everyday play.",
          status: "published",
          shipping_profile_id: shippingProfile.id,
          options: [
            { title: "Size", values: ["2-3Y", "3-4Y", "4-5Y"] },
            { title: "Color", values: ["Cream"] },
          ],
          variants: [
            {
              title: "Cream / 3-4Y",
              sku: "KINDARD-HOODIE-CREAM-34",
              options: { Size: "3-4Y", Color: "Cream" },
              prices: [{ amount: 65, currency_code: "eur" }],
            },
            {
              title: "Cream / 4-5Y",
              sku: "KINDARD-HOODIE-CREAM-45",
              options: { Size: "4-5Y", Color: "Cream" },
              prices: [{ amount: 65, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Classic Logo Tee",
          handle: "classic-logo-tee",
          description: "Soft cotton tee with the Kindard logo.",
          status: "published",
          shipping_profile_id: shippingProfile.id,
          options: [
            { title: "Size", values: ["1-2Y", "2-3Y", "3-4Y"] },
            { title: "Color", values: ["Blue"] },
          ],
          variants: [
            {
              title: "Blue / 2-3Y",
              sku: "KINDARD-TEE-BLUE-23",
              options: { Size: "2-3Y", Color: "Blue" },
              prices: [{ amount: 35, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })

  logger.info(`Publishable API key: ${publishableApiKey.token}`)
  logger.info("Demo seed complete.")
}
