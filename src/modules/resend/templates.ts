// Email templates in the H&R brand style (midnight, zari gold, ivory;
// Playfair Display headings with serif fallbacks for mail clients).

export type OrderEmailItem = {
  title: string
  variant_title?: string | null
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string | null
}

export type OrderEmailData = {
  order: {
    display_id: number | string
    email: string
    currency_code: string
    items: OrderEmailItem[]
    subtotal: number
    shipping_total: number
    total: number
    shipping_method?: string | null
    payment_provider_id?: string | null
    shipping_address?: {
      first_name?: string | null
      last_name?: string | null
      address_1?: string | null
      address_2?: string | null
      city?: string | null
      province?: string | null
      phone?: string | null
    } | null
  }
  store_url: string
  admin_url?: string
  whatsapp: string
}

const C = {
  midnight: "#14161F",
  zari: "#C5893E",
  kundan: "#E8BC55",
  ivory: "#FBF7EE",
  surface: "#F3ECDD",
  line: "#DDD0B9",
  ink: "#1C1A17",
  muted: "#6B6155",
  copper: "#8F542A",
}

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif"

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export const money = (amount: number, currency: string) =>
  `${currency.toUpperCase()} ${Math.round(Number(amount) || 0).toLocaleString("en-US")}`

const PAYMENT_LABELS: Record<string, string> = {
  pp_cod_hnr: "Cash on delivery",
  "pp_wallet-transfer_hnr": "JazzCash / Easypaisa / bank transfer",
}

const PAYMENT_NOTES: Record<string, string> = {
  pp_cod_hnr: "Please keep the amount ready to pay the courier in cash when your order arrives.",
  "pp_wallet-transfer_hnr":
    "We will WhatsApp you our JazzCash, Easypaisa and bank details shortly. We start stitching once the payment is confirmed.",
}

function layout(title: string, body: string, storeUrl: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.surface};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.surface};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.ivory};border:1px solid ${C.line};">
<tr><td align="center" style="background:${C.midnight};padding:28px 24px;">
<a href="${esc(storeUrl)}"><img src="${esc(storeUrl)}/brand/hnr-logo-gold.png" width="144" alt="H&amp;R by Raza" style="display:block;border:0;"></a>
</td></tr>
<tr><td style="height:3px;background:${C.zari};line-height:3px;font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:32px 28px;font-family:${SANS};color:${C.ink};font-size:15px;line-height:1.6;">
${body}
</td></tr>
<tr><td align="center" style="background:${C.midnight};padding:20px 24px;font-family:${SANS};font-size:12px;line-height:1.7;color:#CFC6B6;">
H&amp;R by Raza · Shop 4, Ground Floor, The Monal Plaza, Gulberg III, Lahore<br>
WhatsApp +92 322 3558656 · <a href="${esc(storeUrl)}" style="color:${C.kundan};text-decoration:none;">hnrbyraza.com</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function itemsTable(order: OrderEmailData["order"]) {
  const cur = order.currency_code
  const rows = order.items
    .map(
      (i) => `<tr>
<td style="padding:12px 0;border-bottom:1px solid ${C.line};vertical-align:top;">
${i.thumbnail ? `<img src="${esc(i.thumbnail)}" width="56" alt="" style="display:block;border:0;float:left;margin-right:12px;">` : ""}
<div style="font-family:${SERIF};font-size:16px;">${esc(i.title)}</div>
<div style="color:${C.muted};font-size:13px;">${i.variant_title ? `Size ${esc(i.variant_title)} · ` : ""}Qty ${esc(i.quantity)}</div>
</td>
<td align="right" style="padding:12px 0;border-bottom:1px solid ${C.line};vertical-align:top;white-space:nowrap;">${money(i.total, cur)}</td>
</tr>`
    )
    .join("")

  const shipping =
    Number(order.shipping_total) === 0 ? "Free" : money(order.shipping_total, cur)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
${rows}
<tr><td style="padding:10px 0 0;color:${C.muted};">Subtotal</td><td align="right" style="padding:10px 0 0;">${money(order.subtotal, cur)}</td></tr>
<tr><td style="padding:4px 0;color:${C.muted};">Delivery${order.shipping_method ? ` (${esc(order.shipping_method)})` : ""}</td><td align="right" style="padding:4px 0;">${shipping}</td></tr>
<tr><td style="padding:8px 0 0;border-top:1px solid ${C.line};font-family:${SERIF};font-size:18px;">Total</td><td align="right" style="padding:8px 0 0;border-top:1px solid ${C.line};font-family:${SERIF};font-size:18px;color:${C.copper};">${money(order.total, cur)}</td></tr>
</table>`
}

function addressBlock(order: OrderEmailData["order"]) {
  const a = order.shipping_address
  if (!a) {
    return ""
  }
  const lines = [
    [a.first_name, a.last_name].filter(Boolean).join(" "),
    a.address_1,
    a.address_2,
    [a.city, a.province].filter(Boolean).join(", "),
    a.phone,
  ].filter(Boolean)
  return lines.map(esc).join("<br>")
}

const label = (text: string) =>
  `<div style="font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.zari};margin:24px 0 8px;">${text}</div>`

function orderPlacedCustomer(data: OrderEmailData) {
  const { order } = data
  const name = order.shipping_address?.first_name
  const pid = order.payment_provider_id ?? ""
  const body = `
<h1 style="font-family:${SERIF};font-weight:400;font-size:26px;margin:0 0 8px;color:${C.ink};">Thank you for your order${name ? `, ${esc(name)}` : ""}</h1>
<p style="margin:0 0 4px;">We have received order <strong>#${esc(order.display_id)}</strong> and our team in Gulberg will start preparing it.</p>
${PAYMENT_NOTES[pid] ? `<p style="margin:12px 0 0;padding:12px 14px;background:${C.surface};border-left:3px solid ${C.zari};">${esc(PAYMENT_NOTES[pid])}</p>` : ""}
${label("Your order")}
${itemsTable(order)}
${label("Delivering to")}
<p style="margin:0;">${addressBlock(order)}</p>
${label("Payment")}
<p style="margin:0;">${esc(PAYMENT_LABELS[pid] ?? "Payment on file")}</p>
<p style="margin:28px 0 0;">Questions about sizing or delivery? Message us on <a href="https://wa.me/${esc(data.whatsapp.replace("+", ""))}" style="color:${C.zari};">WhatsApp</a> or reply to this email.</p>
`
  return {
    subject: `Order #${order.display_id} confirmed · H&R by Raza`,
    html: layout(`Order #${order.display_id}`, body, data.store_url),
  }
}

function orderPlacedOwner(data: OrderEmailData) {
  const { order } = data
  const pid = order.payment_provider_id ?? ""
  const customer = [order.shipping_address?.first_name, order.shipping_address?.last_name]
    .filter(Boolean)
    .join(" ")
  const body = `
<h1 style="font-family:${SERIF};font-weight:400;font-size:24px;margin:0 0 8px;">New order #${esc(order.display_id)}</h1>
<p style="margin:0;">${esc(customer || order.email)} placed an order for <strong>${money(order.total, order.currency_code)}</strong>, paying by <strong>${esc(PAYMENT_LABELS[pid] ?? pid)}</strong>.</p>
${pid === "pp_wallet-transfer_hnr" ? `<p style="margin:12px 0 0;padding:12px 14px;background:${C.surface};border-left:3px solid ${C.zari};">Send the customer the JazzCash / Easypaisa / bank details on WhatsApp.</p>` : ""}
${label("Items")}
${itemsTable(order)}
${label("Customer")}
<p style="margin:0;">${addressBlock(order)}<br>${esc(order.email)}</p>
${data.admin_url ? `<p style="margin:28px 0 0;"><a href="${esc(data.admin_url)}" style="display:inline-block;background:${C.midnight};color:${C.kundan};padding:12px 20px;text-decoration:none;font-size:14px;">Open in admin</a></p>` : ""}
`
  return {
    subject: `New order #${order.display_id} · ${money(order.total, order.currency_code)}`,
    html: layout(`New order #${order.display_id}`, body, data.store_url),
  }
}

const TEMPLATES: Record<string, (data: any) => { subject: string; html: string }> = {
  "order-placed-customer": orderPlacedCustomer,
  "order-placed-owner": orderPlacedOwner,
}

export function renderEmail(template: string, data: Record<string, any>) {
  const render = TEMPLATES[template]
  if (!render) {
    throw new Error(`Unknown email template "${template}"`)
  }
  return render(data)
}
