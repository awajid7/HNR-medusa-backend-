import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SITE_CONTENT_MODULE } from "../../../modules/site-content"
import SiteContentModuleService from "../../../modules/site-content/service"

/** The storefront's editable text and fonts, defaults included */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: SiteContentModuleService = req.scope.resolve(SITE_CONTENT_MODULE)
  res.json({ content: await service.getContent() })
}
