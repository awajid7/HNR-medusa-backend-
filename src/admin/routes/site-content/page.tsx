import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PencilSquare } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_SECTIONS,
  SiteContentField,
} from "../../../modules/site-content/fields"

const STORE_URL = "https://hnrbyraza.com"

const SiteContentPage = () => {
  const [saved, setSaved] = useState<Record<string, string> | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/admin/site-content", { credentials: "include" })
      .then((r) => r.json())
      .then(({ content }) => {
        setSaved(content)
        setValues(content)
      })
      .catch(() => toast.error("Could not load the site content"))
  }, [])

  const changed = useMemo(
    () =>
      saved
        ? Object.keys(values).filter((key) => values[key] !== saved[key])
        : [],
    [saved, values]
  )

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/admin/site-content", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: Object.fromEntries(changed.map((k) => [k, values[k]])),
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.message)
      }
      setSaved(body.content)
      setValues(body.content)
      toast.success("Saved. The store shows the change within a minute.")
    } catch (e) {
      toast.error((e as Error).message || "Could not save")
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }))

  if (!saved) {
    return (
      <Container className="p-6">
        <Text>Loading…</Text>
      </Container>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <Heading level="h1">Site content</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Text and fonts on the store. Products, prices and photos are edited
            under Products.{" "}
            <a href={STORE_URL} target="_blank" rel="noreferrer" className="text-ui-fg-interactive">
              Open the store
            </a>
          </Text>
        </div>
        <Button onClick={save} isLoading={saving} disabled={!changed.length}>
          {changed.length ? `Save ${changed.length} change${changed.length > 1 ? "s" : ""}` : "Saved"}
        </Button>
      </Container>

      {SITE_CONTENT_SECTIONS.map((section) => (
        <Container key={section.id} className="divide-y p-0">
          <div className="px-6 py-4">
            <Heading level="h2">{section.title}</Heading>
            {section.description && (
              <Text size="small" className="text-ui-fg-subtle">
                {section.description}
              </Text>
            )}
          </div>
          <div className="flex flex-col gap-y-4 px-6 py-4">
            {section.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ""}
                onChange={(v) => set(field.key, v)}
              />
            ))}
          </div>
        </Container>
      ))}
    </div>
  )
}

const FieldInput = ({
  field,
  value,
  onChange,
}: {
  field: SiteContentField
  value: string
  onChange: (value: string) => void
}) => {
  const id = `field-${field.key}`
  const isDefault = value === SITE_CONTENT_DEFAULTS[field.key]

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} size="small" weight="plus">
          {field.label}
        </Label>
        {!isDefault && (
          <button
            type="button"
            className="txt-compact-small text-ui-fg-interactive"
            onClick={() => onChange(SITE_CONTENT_DEFAULTS[field.key])}
          >
            Reset to original
          </button>
        )}
      </div>
      {field.type === "font" ? (
        <Select value={value} onValueChange={onChange}>
          <Select.Trigger id={id}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {field.options?.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      ) : field.type === "textarea" ? (
        <Textarea id={id} value={value} rows={field.rows ?? 3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.help && (
        <Text size="xsmall" className="text-ui-fg-muted">
          {field.help}
        </Text>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Site content",
  icon: PencilSquare,
})

export default SiteContentPage
