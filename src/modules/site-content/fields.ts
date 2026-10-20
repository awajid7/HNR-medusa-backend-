/**
 * The storefront text and fonts that can be edited in the admin under
 * "Site content". Keep this file free of imports: the admin page uses it too.
 *
 * The storefront keeps the same defaults so it still renders if the backend is
 * unreachable (src/lib/data/site-content.ts in the storefront repo).
 */

export type SiteContentField = {
  key: string
  label: string
  default: string
  help?: string
  /** "text" is one line, "textarea" keeps line breaks, "font" is a select */
  type?: "text" | "textarea" | "font"
  options?: { value: string; label: string }[]
}

export type SiteContentSection = {
  id: string
  title: string
  description?: string
  fields: SiteContentField[]
}

/** Brand-approved fonts (brand guidelines v1.0) the storefront has loaded */
export const FONT_OPTIONS = [
  { value: "playfair", label: "Playfair Display (elegant serif)" },
  { value: "cinzel", label: "Cinzel (classic capitals)" },
  { value: "inter", label: "Inter (clean sans serif)" },
]

export const SITE_CONTENT_SECTIONS: SiteContentSection[] = [
  {
    id: "fonts",
    title: "Fonts",
    description: "Choose from the H&R by Raza brand fonts.",
    fields: [
      {
        key: "fonts.heading",
        label: "Headings",
        type: "font",
        options: FONT_OPTIONS,
        default: "playfair",
      },
      {
        key: "fonts.body",
        label: "Body text",
        type: "font",
        options: FONT_OPTIONS.filter((f) => f.value !== "cinzel"),
        default: "inter",
      },
      {
        key: "fonts.labels",
        label: "Small capital labels and menu",
        type: "font",
        options: FONT_OPTIONS,
        default: "cinzel",
      },
    ],
  },
  {
    id: "announcement",
    title: "Announcement bar",
    description: "A thin bar above the menu on every page. Leave empty to hide it.",
    fields: [
      {
        key: "announcement.text",
        label: "Announcement",
        default: "",
        help: "For example: Eid orders close on 25 March",
      },
    ],
  },
  {
    id: "home_hero",
    title: "Home page: top banner",
    fields: [
      { key: "home.hero.eyebrow", label: "Small label", default: "Men's eastern wear · Lahore" },
      { key: "home.hero.title", label: "Heading", default: "Elegance in" },
      {
        key: "home.hero.title_highlight",
        label: "Heading, gold italic part",
        default: "every stitch.",
        help: "Shown in gold italics after the heading. Leave empty to skip.",
      },
      {
        key: "home.hero.text",
        label: "Text",
        type: "textarea",
        default:
          "Sherwanis, prince coats, kurtas and waistcoats, cut and finished at our Gulberg studio. Cash on delivery across Pakistan.",
      },
      { key: "home.hero.primary_button", label: "Shop button", default: "Shop the collection" },
      { key: "home.hero.secondary_button", label: "WhatsApp button", default: "Book a fitting" },
      {
        key: "home.hero.whatsapp_message",
        label: "WhatsApp button's pre-filled message",
        default: "Assalam-o-Alaikum, I would like to book a fitting.",
      },
    ],
  },
  {
    id: "home_fitting",
    title: "Home page: fitting section",
    fields: [
      { key: "home.fitting.eyebrow", label: "Small label", default: "Made to measure" },
      { key: "home.fitting.title", label: "Heading", default: "A fitting at our Gulberg studio" },
      {
        key: "home.fitting.text",
        label: "Text",
        type: "textarea",
        default:
          "Sherwanis and prince coats are cut to your measurements. Visit us at Shop 4, The Monal Plaza, Gulberg III, Lahore, Monday to Saturday 12 to 10 PM and Sunday 3 to 10 PM, or share your measurements on WhatsApp.",
      },
      { key: "home.fitting.button", label: "Button", default: "Message us on WhatsApp" },
    ],
  },
  {
    id: "contact",
    title: "Contact details and footer",
    fields: [
      {
        key: "contact.whatsapp",
        label: "WhatsApp number",
        default: "+92 322 3558656",
        help: "Used by every WhatsApp button and link.",
      },
      { key: "contact.email", label: "Email", default: "sales@heshamandraza.com" },
      { key: "contact.instagram", label: "Instagram link", default: "https://www.instagram.com/hnrbyraza/" },
      { key: "contact.facebook", label: "Facebook link", default: "https://www.facebook.com/hnrbyraza/" },
      { key: "footer.tagline", label: "Tagline under the logo", default: "Elegance in every stitch." },
      { key: "footer.studio_title", label: "Studio heading", default: "Gulberg Studio" },
      {
        key: "footer.address",
        label: "Address",
        type: "textarea",
        default: "Shop 4, Ground Floor, The Monal Plaza\nGulberg III, Liberty Roundabout\nLahore 54000",
      },
      {
        key: "footer.hours",
        label: "Opening hours",
        type: "textarea",
        default: "Mon to Sat 12 to 10 PM\nSun 3 to 10 PM",
      },
      {
        key: "footer.copyright",
        label: "Copyright line",
        default: "H&R by Raza. Est. 2010 as Hesham & Raza.",
        help: "The © and current year are added automatically.",
      },
      { key: "footer.note", label: "Bottom right note", default: "Cash on delivery across Pakistan" },
    ],
  },
  {
    id: "seo",
    title: "Google and browser tab",
    description: "How the home page appears in Google results and the browser tab.",
    fields: [
      { key: "seo.title", label: "Page title", default: "H&R by Raza | Men's eastern wear, Lahore" },
      {
        key: "seo.description",
        label: "Description",
        type: "textarea",
        default:
          "Sherwanis, prince coats, kurtas and waistcoats from our Gulberg studio in Lahore. Cash on delivery across Pakistan.",
      },
    ],
  },
]

export const SITE_CONTENT_FIELDS = SITE_CONTENT_SECTIONS.flatMap((s) => s.fields)

export const SITE_CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((f) => [f.key, f.default])
)
