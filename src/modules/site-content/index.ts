import { Module } from "@medusajs/framework/utils"
import SiteContentModuleService from "./service"

export const SITE_CONTENT_MODULE = "site_content"

/** Editable storefront text and fonts (admin: Site content) */
export default Module(SITE_CONTENT_MODULE, {
  service: SiteContentModuleService,
})
