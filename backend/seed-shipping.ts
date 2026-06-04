import { MedusaContainer } from "@medusajs/framework/types";

export default async function myScript({ container }: { container: MedusaContainer }) {
  const regionModule = container.resolve("region");
  const fulfillmentModule = container.resolve("fulfillment");
  
  const regions = await regionModule.listRegions();
  const region = regions[0];
  if(!region) {
    console.log("No region found");
    return;
  }
  
  const profiles = await fulfillmentModule.listShippingProfiles();
  const profile = profiles[0];
  if(!profile) {
     console.log("No shipping profile found");
     return;
  }
  
  const fSets = await fulfillmentModule.listFulfillmentSets(
    {},
    { relations: ["service_zones"] }
  );
  if(!fSets.length) {
     console.log("No fulfillment sets found. Please configure fulfillment provider in Admin.");
     return;
  }
  
  const fSet = fSets[0];
  const sZone = fSet.service_zones[0];
  
  console.log("Creating shipping option...");
  await fulfillmentModule.createShippingOptions([{
    name: "Standard Delivery",
    price_type: "flat",
    provider_id: "manual_manual",
    type: {
      label: "Standard",
      description: "Standard Delivery",
      code: "standard"
    },
    service_zone_id: sZone.id,
    shipping_profile_id: profile.id,
    rules: [
      {
         attribute: "region_id",
         operator: "in",
         value: [region.id]
      }
    ],
    prices: [
      {
        currency_code: region.currency_code,
        amount: 5.00
      }
    ]
  }]);
  
  console.log("Successfully created shipping option for region:", region.name);
}
