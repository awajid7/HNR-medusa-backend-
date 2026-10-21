import { MedusaService } from "@medusajs/framework/utils"
import SiteContentEntry from "./models/site-content-entry"
import { SITE_CONTENT_DEFAULTS, SITE_CONTENT_FIELDS } from "./fields"

class SiteContentModuleService extends MedusaService({ SiteContentEntry }) {
  /** All storefront content: the defaults with any edits applied */
  async getContent(): Promise<Record<string, string>> {
    const entries = await this.listSiteContentEntries({}, { take: null })
    const content = { ...SITE_CONTENT_DEFAULTS }
    for (const entry of entries) {
      if (entry.key in content) {
        content[entry.key] = entry.value
      }
    }
    return content
  }

  /** Saves edits. A value equal to the default removes the edit. */
  async saveContent(values: Record<string, string>) {
    const fields = new Map(SITE_CONTENT_FIELDS.map((f) => [f.key, f]))
    const existing = await this.listSiteContentEntries(
      { key: Object.keys(values) },
      { take: null }
    )
    const byKey = new Map(existing.map((e) => [e.key, e]))

    const toCreate: { key: string; value: string }[] = []
    const toUpdate: { id: string; value: string }[] = []
    const toDelete: string[] = []

    for (const [key, value] of Object.entries(values)) {
      const field = fields.get(key)
      if (!field) {
        continue
      }
      const current = byKey.get(key)
      if (value === field.default) {
        if (current) toDelete.push(current.id)
      } else if (current) {
        if (current.value !== value) toUpdate.push({ id: current.id, value })
      } else {
        toCreate.push({ key, value })
      }
    }

    if (toDelete.length) await this.deleteSiteContentEntries(toDelete)
    if (toUpdate.length) await this.updateSiteContentEntries(toUpdate)
    if (toCreate.length) await this.createSiteContentEntries(toCreate)

    return this.getContent()
  }
}

export default SiteContentModuleService
