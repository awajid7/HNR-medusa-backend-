import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { renderEmail } from "./templates"

type Options = {
  api_key: string
  from: string
  reply_to?: string
}

/** Sends emails through Resend's HTTP API (free plan: 3,000 emails a month). */
export class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"

  protected options_: Options
  protected logger_: Logger

  constructor({ logger }: { logger: Logger }, options: Options) {
    super()
    this.options_ = options
    this.logger_ = logger
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key || !options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The Resend provider needs api_key and from"
      )
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { subject, html } = renderEmail(
      notification.template,
      (notification.data ?? {}) as Record<string, any>
    )

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options_.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: notification.from || this.options_.from,
        to: [notification.to],
        reply_to: this.options_.reply_to,
        subject,
        html,
      }),
    })

    const body = (await res.json().catch(() => ({}))) as {
      id?: string
      message?: string
    }
    if (!res.ok) {
      this.logger_.error(
        `Resend refused the "${notification.template}" email: ${res.status} ${body.message ?? ""}`
      )
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Resend error ${res.status}: ${body.message ?? "unknown"}`
      )
    }

    return { id: body.id }
  }
}
