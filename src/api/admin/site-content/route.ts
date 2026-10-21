import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { SITE_CONTENT_MODULE } from "../../../modules/site-content"
import { SITE_CONTENT_FIELDS } from "../../../modules/site-content/fields"
import SiteContentModuleService from "../../../modules/site-content/service"

const MAX_LENGTH = 2000

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: SiteContentModuleService = req.scope.resolve(SITE_CONTENT_MODULE)
  res.json({ content: await service.getContent() })
}

export async function POST(
  req: MedusaRequest<{ content?: Record<string, unknown> }>,
  res: MedusaResponse
) {
  const input = req.body?.content
  if (!input || typeof input !== "object") {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Expected { content: { ... } }")
  }

  const values: Record<string, string> = {}
  for (const field of SITE_CONTENT_FIELDS) {
    if (!(field.key in input)) {
      continue
    }
    const value = input[field.key]
    if (typeof value !== "string" || value.length > MAX_LENGTH) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `${field.label} must be text of at most ${MAX_LENGTH} characters`
      )
    }
    if (field.type === "font" && !field.options?.some((o) => o.value === value)) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Unknown font for ${field.label}`)
    }
    values[field.key] = value.trim()
  }

  const service: SiteContentModuleService = req.scope.resolve(SITE_CONTENT_MODULE)
  res.json({ content: await service.saveContent(values) })
}
