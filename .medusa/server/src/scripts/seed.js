"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedHnrStore;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const catalog_json_1 = __importDefault(require("./data/catalog.json"));
const COUNTRY = "pk";
const CURRENCY = "pkr";
const FREE_DELIVERY_FROM = 15000;
const CATEGORIES = [
    { name: "Sherwanis", handle: "sherwanis", description: "Groom and baraat sherwanis, made to measure in Lahore." },
    { name: "Prince Coats", handle: "prince-coats", description: "Prince coats for walima, nikkah and formal evenings." },
    { name: "Kurta Sets", handle: "kurta-sets", description: "Kurtas paired with trousers or shalwar." },
    { name: "Kurtas", handle: "kurtas", description: "Festive and everyday kurtas." },
    { name: "Waistcoats", handle: "waistcoats", description: "Waistcoats to wear over a kurta or shalwar kameez." },
    { name: "Shalwar Kameez", handle: "shalwar-kameez", description: "Shalwar kameez in wash & wear and cotton." },
];
function describe(p) {
    const has = (t) => p.tags.includes(t);
    const fabric = p.fabric?.toLowerCase();
    const color = p.color?.toLowerCase();
    const finish = has("embroidered") ? "Embroidered" : "Tailored";
    const fit = has("custom fit") ? " Cut to a custom fit." : has("regular fit") ? " Regular fit." : "";
    const occasion = "Festive wear for mehndi, Eid and dinners.";
    switch (p.category) {
        case "Kurta Sets": {
            const length = has("short kurta") ? "short kurta" : "long kurta";
            return `${finish} ${length} in ${color} ${fabric}, paired with straight trousers.${fit} ${occasion} Two pieces: kurta and trousers.`;
        }
        case "Kurtas":
            return `${finish} long kurta in ${color} ${fabric}.${fit} ${occasion} One piece: kurta only.`;
        case "Shalwar Kameez":
            return `${finish} shalwar kameez in ${color} ${fabric}, with a loose-fit shalwar.${fit} Easy to care for and smart enough for Eid. Two pieces.`;
        case "Waistcoats":
            if (!fabric) {
                return `${p.title} finished with ${p.note?.toLowerCase() ?? "fine thread work"}. Wear it over a kurta for mehndi or Eid. Made to measure at our Gulberg studio.`;
            }
            return `${finish === "Embroidered" ? "Embroidered waistcoat" : "Waistcoat"} in ${color} ${fabric}.${fit} Wear it over a kurta or shalwar kameez. One piece.`;
        case "Sherwanis":
            return `${p.title}${p.note ? `, finished with ${p.note.toLowerCase()}` : ""}. Made to measure for the baraat at our Gulberg studio; book a fitting after ordering.`;
        case "Prince Coats":
            return `${p.title} for walima, nikkah and formal evenings. Made to measure at our Gulberg studio; book a fitting after ordering.`;
        default:
            return p.title;
    }
}
async function seedHnrStore({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const regionModuleService = container.resolve(utils_1.Modules.REGION);
    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
    if ((await regionModuleService.listRegions({ name: "Pakistan" })).length) {
        logger.info("Pakistan region already exists; the store has been seeded. Skipping.");
        return;
    }
    logger.info("Seeding store...");
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        const { result } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
            input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
        });
        defaultSalesChannel = result;
    }
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: {
                name: "H&R by Raza",
                supported_currencies: [{ currency_code: CURRENCY, is_default: true }],
                default_sales_channel_id: defaultSalesChannel[0].id,
            },
        },
    });
    logger.info("Seeding Pakistan region...");
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
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
    });
    const region = regionResult[0];
    await (0, core_flows_1.createTaxRegionsWorkflow)(container).run({
        input: [{ country_code: COUNTRY, provider_id: "tp_system" }],
    });
    logger.info("Seeding stock location...");
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
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
    });
    const stockLocation = stockLocationResult[0];
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: { default_location_id: stockLocation.id },
        },
    });
    await link.create({
        [utils_1.Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [utils_1.Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
    logger.info("Seeding delivery options...");
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        const { result } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
            input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
        });
        shippingProfile = result[0];
    }
    const deliverySet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Courier delivery",
        type: "shipping",
        service_zones: [
            { name: "Pakistan", geo_zones: [{ country_code: COUNTRY, type: "country" }] },
        ],
    });
    const pickupSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Studio pickup",
        type: "pickup",
        service_zones: [
            { name: "Gulberg Studio", geo_zones: [{ country_code: COUNTRY, type: "country" }] },
        ],
    });
    for (const set of [deliverySet, pickupSet]) {
        await link.create({
            [utils_1.Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
            [utils_1.Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
        });
    }
    const storeRules = [
        { attribute: "enabled_in_store", value: "true", operator: "eq" },
        { attribute: "is_return", value: "false", operator: "eq" },
    ];
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
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
    });
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
    });
    logger.info("Seeding publishable API key...");
    const { data: keys } = await query.graph({
        entity: "api_key",
        fields: ["id", "token"],
        filters: { type: "publishable" },
    });
    let publishableApiKey = keys?.[0];
    if (!publishableApiKey) {
        const { result: [created], } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
            input: {
                api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
            },
        });
        publishableApiKey = created;
    }
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
    });
    logger.info("Seeding categories and products...");
    const { result: categories } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: CATEGORIES.map((c) => ({ ...c, is_active: true })),
        },
    });
    const categoryId = (name) => categories.find((c) => c.name === name).id;
    const items = catalog_json_1.default;
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: items.map((p) => ({
                title: p.title,
                handle: p.handle,
                subtitle: p.fabric ? `${p.fabric[0].toUpperCase()}${p.fabric.slice(1)}` : "Made to measure",
                description: describe(p),
                category_ids: [categoryId(p.category)],
                status: utils_1.ProductStatus.PUBLISHED,
                shipping_profile_id: shippingProfile.id,
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
    });
    logger.info(`Seeded ${items.length} products.`);
    logger.info(`Publishable API key for the storefront: ${publishableApiKey.token}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFpRkEsK0JBeVFDO0FBelZELHFEQUlrQztBQUNsQyw0REFhb0M7QUFDcEMsdUVBQXlDO0FBaUJ6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDcEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3RCLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFBO0FBRWhDLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSx3REFBd0QsRUFBRTtJQUNqSCxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsc0RBQXNELEVBQUU7SUFDckgsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLHlDQUF5QyxFQUFFO0lBQ3BHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSw4QkFBOEIsRUFBRTtJQUNqRixFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsb0RBQW9ELEVBQUU7SUFDL0csRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSwyQ0FBMkMsRUFBRTtDQUMvRyxDQUFBO0FBRUQsU0FBUyxRQUFRLENBQUMsQ0FBYztJQUM5QixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxX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