import { model } from "@medusajs/framework/utils"

/** One edited storefront text or setting, keyed like "home.hero.title" */
const SiteContentEntry = model.define("site_content_entry", {
  id: model.id({ prefix: "sce" }).primaryKey(),
  key: model.text().unique(),
  value: model.text(),
})

export default SiteContentEntry
