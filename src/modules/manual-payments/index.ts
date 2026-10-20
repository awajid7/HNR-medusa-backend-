import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { OfflinePaymentProvider } from "./base"

/** Cash on delivery, collected by the courier (provider id: pp_cod_hnr). */
class CashOnDeliveryProvider extends OfflinePaymentProvider {
  static identifier = "cod"
}

/**
 * JazzCash, Easypaisa or bank transfer, sent by the customer after checkout
 * and confirmed by staff (provider id: pp_wallet-transfer_hnr).
 */
class WalletTransferProvider extends OfflinePaymentProvider {
  static identifier = "wallet-transfer"
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [CashOnDeliveryProvider, WalletTransferProvider],
})
