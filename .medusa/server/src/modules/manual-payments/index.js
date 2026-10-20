"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const base_1 = require("./base");
/** Cash on delivery, collected by the courier (provider id: pp_cod_hnr). */
class CashOnDeliveryProvider extends base_1.OfflinePaymentProvider {
}
CashOnDeliveryProvider.identifier = "cod";
/**
 * JazzCash, Easypaisa or bank transfer, sent by the customer after checkout
 * and confirmed by staff (provider id: pp_wallet-transfer_hnr).
 */
class WalletTransferProvider extends base_1.OfflinePaymentProvider {
}
WalletTransferProvider.identifier = "wallet-transfer";
exports.default = (0, utils_1.ModuleProvider)(utils_1.Modules.PAYMENT, {
    services: [CashOnDeliveryProvider, WalletTransferProvider],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tYW51YWwtcGF5bWVudHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBbUU7QUFDbkUsaUNBQStDO0FBRS9DLDRFQUE0RTtBQUM1RSxNQUFNLHNCQUF1QixTQUFRLDZCQUFzQjs7QUFDbEQsaUNBQVUsR0FBRyxLQUFLLENBQUE7QUFHM0I7OztHQUdHO0FBQ0gsTUFBTSxzQkFBdUIsU0FBUSw2QkFBc0I7O0FBQ2xELGlDQUFVLEdBQUcsaUJBQWlCLENBQUE7QUFHdkMsa0JBQWUsSUFBQSxzQkFBYyxFQUFDLGVBQU8sQ0FBQyxPQUFPLEVBQUU7SUFDN0MsUUFBUSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsc0JBQXNCLENBQUM7Q0FDM0QsQ0FBQyxDQUFBIn0=