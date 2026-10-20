import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const STORE_URL = process.env.STORE_URL || "http://localhost:8000"
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const OWNER_EMAIL = process.env.ORDER_NOTIFY_EMAIL || "sales@hnrbyraza.com"
const WHATSAPP = "+923223558656"

/** Emails the order confirmation to the customer and a copy to the shop. */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notifications = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "subtotal",
      "shipping_total",
      "total",
      "items.*",
      "shipping_address.*",
      "shipping_methods.name",
      "payment_collections.payment_sessions.provider_id",
    ],
    filters: { id: data.id },
  })

  if (!order) {
    logger.warn(`order.placed: order ${data.id} not found, no emails sent`)
    return
  }

  const emailData = {
    order: {
      display_id: order.display_id,
      email: order.email,
      currency_code: order.currency_code,
      subtotal: Number(order.subtotal),
      shipping_total: Number(order.shipping_total),
      total: Number(order.total),
      shipping_method: order.shipping_methods?.[0]?.name ?? null,
      payment_provider_id:
        order.payment_collections?.[0]?.payment_sessions?.[0]?.provider_id ?? null,
      shipping_address: order.shipping_address,
      items: (order.items ?? []).map((i: any) => ({
        title: i.product_title || i.title,
        variant_title: i.variant_title,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        total: Number(i.total),
        thumbnail: i.thumbnail,
      })),
    },
    store_url: STORE_URL,
    admin_url: `${BACKEND_URL}/app/orders/${order.id}`,
    whatsapp: WHATSAPP,
  }

  const emails = [
    order.email && { to: order.email, template: "order-placed-customer" },
    { to: OWNER_EMAIL, template: "order-placed-owner" },
  ].filter(Boolean) as { to: string; template: string }[]

  // One failed email (e.g. a mistyped customer address) shouldn't stop the other
  for (const email of emails) {
    try {
      await notifications.createNotifications({
        ...email,
        channel: "email",
        data: emailData,
        idempotency_key: `${email.template}-${order.id}`,
      })
    } catch (e) {
      logger.error(
        `Could not send ${email.template} for order ${order.display_id}: ${(e as Error).message}`
      )
    }
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
