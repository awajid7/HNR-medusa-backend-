import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import catalog from "./data/catalog.json"

type CatalogItem = {
  handle: string
  title: string
  category: string
  fabric: string | null
  color: string | null
  sku_prefix: string | null
  price: number
  sizes: string[]
  tags: string[]
  images: string[]
  note?: string | null
  status?: string
}

const COUNTRY = "pk"
const CURRENCY = "pkr"
const FREE_DELIVERY_FROM = 15000

const CATEGORIES = [
  { name: "Sherwanis", handle: "sherwanis", description: "Groom and baraat sherwanis, made to measure in Lahore." },
  { name: "Prince Coats", handle: "prince-coats", description: "Prince coats for walima, nikkah and formal evenings." },
  { name: "Kurta Sets", handle: "kurta-sets", description: "Kurtas paired with trousers or shalwar." },
  { name: "Kurtas", handle: "kurtas", description: "Festive and everyday kurtas." },
  { name: "Waistcoats", handle: "waistcoats", description: "Waistcoats to wear over a kurta or shalwar kameez." },
  { name: "Shalwar Kameez", handle: "shalwar-kameez", description: "Shalwar kameez in wash & wear and cotton." },
]

function describe(p: CatalogItem): string {
  const has = (t: string) => p.tags.includes(t)
  const fabric = p.fabric?.toLowerCase()
  const color = p.color?.toLowerCase()
  const finish = has("embroidered") ? "Embroidered" : "Tailored"
  const fit = has("custom fit") ? " Cut to a custom fit." : has("regular fit") ? " Regular fit." : ""
  const occasion = "Festive wear for mehndi, Eid and dinners."

  switch (p.category) {
    case "Kurta Sets": {
      const length = has("short kurta") ? "short kurta" : "long kurta"
      return `${finish} ${length} in ${color} ${fabric}, paired with straight trousers.${fit} ${occasion} Two pieces: kurta and trousers.`
    }
    case "Kurtas":
      return `${finish} long kurta in ${color} ${fabric}.${fit} ${occasion} One piece: kurta only.`
    case "Shalwar Kameez":
      return `${finish} shalwar kameez in ${color} ${fabric}, with a loose-fit shalwar.${fit} Easy to care for and smart enough for Eid. Two pieces.`
    case "Waistcoats":
      if (!fabric) {
        return `${p.title} finished with ${p.note?.toLowerCase() ?? "fine thread work"}. Wear it over a kurta for mehndi or Eid. Made to measure at our Gulberg studio.`
      }
      return `${finish === "Embroidered" ? "Embroidered waistcoat" : "Waistcoat"} in ${color} ${fabric}.${fit} Wear it over a kurta or shalwar kameez. One piece.`
    case "Sherwanis":
      return `${p.title}${p.note ? `, finished with ${p.note.toLowerCase()}` : ""}. Made to measure for the baraat at our Gulberg studio; book a fitting after ordering.`
    case "Prince Coats":
      return `${p.title} for walima, nikkah and formal evenings. Made to measure at our Gulberg studio; book a fitting after ordering.`
    default:
      return p.title
  }
}

export default async function seedHnrStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)
  const regionModuleService = container.resolve(Modules.REGION)

  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

  if ((await regionModuleService.listRegions({ name: "Pakistan" })).length) {
    logger.info("Pakistan region already exists; the store has been seeded. Skipping.")
    return
  }

  logger.info("Seeding store...")
  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    defaultSalesChannel = result
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "H&R by Raza",
        supported_currencies: [{ currency_code: CURRENCY, is_default: true }],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  })

  logger.info("Seeding Pakistan region...")
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Pakistan",
          currency_code: CURRENCY,
          countries: [COUNTRY],
          automatic_taxes: true,
          // Listed prices already include any tax, as on LAAM and in store.
          is_tax_inclusive: true,
          payment_providers: ["pp_cod_hnr", "pp_wallet-transfer_hnr"],
        },
      ],
    },
  })
  const region = regionResult[0]

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: COUNTRY, provider_id: "tp_system" }],
  })

  logger.info("Seeding stock location...")
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Gulberg Studio",
          address: {
            address_1: "Shop 4, Ground Floor, The Monal Plaza",
            address_2: "Gulberg III, Liberty Roundabout",
            city: "Lahore",
            postal_code: "54000",
            country_code: "PK",
            phone: "+92 322 3558656",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  logger.info("Seeding delivery options...")
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const deliverySet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Courier delivery",
    type: "shipping",
    service_zones: [
      { name: "Pakistan", geo_zones: [{ country_code: COUNTRY, type: "country" }] },
    ],
  })
  const pickupSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Studio pickup",
    type: "pickup",
    service_zones: [
      { name: "Gulberg Studio", geo_zones: [{ country_code: COUNTRY, type: "country" }] },
    ],
  })
  for (const set of [deliverySet, pickupSet]) {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
    })
  }

  const storeRules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ]

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        // Booked manually with PostEx, Leopards or TCS from the admin order.
        name: "Standard delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: deliverySet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard delivery",
          description: "Courier delivery across Pakistan in 3 to 5 working days. Free on orders over PKR 15,000.",
          code: "standard",
        },
        prices: [
          { currency_code: CURRENCY, amount: 300 },
          { region_id: region.id, amount: 300 },
          {
            region_id: region.id,
            amount: 0,
            rules: [{ attribute: "item_total", operator: "gte", value: FREE_DELIVERY_FROM }],
          },
        ],
        rules: storeRules,
      },
      {
        name: "Express delivery (Lahore)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: deliverySet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express delivery",
          description: "Next working day within Lahore.",
          code: "express-lahore",
        },
        prices: [
          { currency_code: CURRENCY, amount: 500 },
          { region_id: region.id, amount: 500 },
        ],
        rules: storeRules,
      },
      {
        name: "Pick up from Gulberg Studio",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: pickupSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Studio pickup",
          description: "Collect from The Monal Plaza, Gulberg III, Lahore. We will message you when it is ready.",
          code: "pickup",
        },
        prices: [
          { currency_code: CURRENCY, amount: 0 },
          { region_id: region.id, amount: 0 },
        ],
        rules: storeRules,
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
  })

  logger.info("Seeding publishable API key...")
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: { type: "publishable" },
  })
  let publishableApiKey: { id: string; token: string } | undefined = keys?.[0]
  if (!publishableApiKey) {
    const {
      result: [created],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
      },
    })
    publishableApiKey = created
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  })

  logger.info("Seeding categories and products...")
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: CATEGORIES.map((c) => ({ ...c, is_active: true })),
    },
  })
  const categoryId = (name: string) => categories.find((c) => c.name === name)!.id

  const items = catalog as CatalogItem[]
  await createProductsWorkflow(container).run({
    input: {
      products: items.map((p) => ({
        title: p.title,
        handle: p.handle,
        subtitle: p.fabric ? `${p.fabric[0].toUpperCase()}${p.fabric.slice(1)}` : "Made to measure",
        description: describe(p),
        category_ids: [categoryId(p.category)],
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile!.id,
        thumbnail: `${backendUrl}/static/catalog/${p.images[0]}`,
        images: p.images.map((file) => ({ url: `${backendUrl}/static/catalog/${file}` })),
        material: p.fabric ?? undefined,
        metadata: {
          color: p.color,
          made_to_measure: !p.fabric,
          ...(p.sku_prefix ? { laam_code: p.sku_prefix } : {}),
        },
        options: [{ title: "Size", values: p.sizes }],
        variants: p.sizes.map((size) => ({
          title: size,
          sku: `${(p.sku_prefix ?? p.handle).toUpperCase().replace(/[^A-Z0-9]+/g, "-")}-${size.toUpperCase().replace(/[^A-Z0-9]+/g, "")}`,
          options: { Size: size },
          // Pieces are cut to order, so stock is not tracked by default.
          manage_inventory: false,
          prices: [{ currency_code: CURRENCY, amount: p.price }],
        })),
        sales_channels: [{ id: defaultSalesChannel[0].id }],
      })),
    },
  })

  logger.info(`Seeded ${items.length} products.`)
  logger.info(`Publishable API key for the storefront: ${publishableApiKey.token}`)
}
