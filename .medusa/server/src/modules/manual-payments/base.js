"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflinePaymentProvider = void 0;
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("@medusajs/framework/utils");
/**
 * Offline payment methods (cash on delivery, wallet or bank transfer).
 * The order is placed as "authorized" and staff capture the payment in the
 * admin once the money has actually been received.
 */
class OfflinePaymentProvider extends utils_1.AbstractPaymentProvider {
    constructor(container, options = {}) {
        super(container, options);
    }
    async initiatePayment(input) {
        return {
            id: crypto_1.default.randomUUID(),
            data: { method: this.constructor.identifier },
        };
    }
    async authorizePayment(input) {
        return { data: input.data ?? {}, status: utils_1.PaymentSessionStatus.AUTHORIZED };
    }
    async getPaymentStatus(input) {
        return { status: utils_1.PaymentSessionStatus.AUTHORIZED };
    }
    async retrievePayment(input) {
        return input.data ?? {};
    }
    async updatePayment(input) {
        return { data: input.data ?? {} };
    }
    async deletePayment(input) {
        return { data: input.data ?? {} };
    }
    async capturePayment(input) {
        return {
            data: { ...(input.data ?? {}), captured_at: new Date().toISOString() },
        };
    }
    async refundPayment(input) {
        return { data: input.data ?? {} };
    }
    async cancelPayment(input) {
        return { data: input.data ?? {} };
    }
    async getWebhookActionAndData(payload) {
        return { action: utils_1.PaymentActions.NOT_SUPPORTED };
    }
}
exports.OfflinePaymentProvider = OfflinePaymentProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21hbnVhbC1wYXltZW50cy9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUEyQjtBQUMzQixxREFJa0M7QUF3QmxDOzs7O0dBSUc7QUFDSCxNQUFzQixzQkFBdUIsU0FBUSwrQkFBdUI7SUFDMUUsWUFBWSxTQUFrQyxFQUFFLFVBQW1DLEVBQUU7UUFDbkYsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FDbkIsS0FBMkI7UUFFM0IsT0FBTztZQUNMLEVBQUUsRUFBRSxnQkFBTSxDQUFDLFVBQVUsRUFBRTtZQUN2QixJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUcsSUFBSSxDQUFDLFdBQW1CLENBQUMsVUFBVSxFQUFFO1NBQ3ZELENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUNwQixLQUE0QjtRQUU1QixPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSw0QkFBb0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUM1RSxDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUNwQixLQUE0QjtRQUU1QixPQUFPLEVBQUUsTUFBTSxFQUFFLDRCQUFvQixDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ3BELENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUNuQixLQUEyQjtRQUUzQixPQUFPLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQXlCO1FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUF5QjtRQUMzQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUE7SUFDbkMsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQ2xCLEtBQTBCO1FBRTFCLE9BQU87WUFDTCxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRTtTQUN2RSxDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBeUI7UUFDM0MsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFBO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQXlCO1FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLHVCQUF1QixDQUMzQixPQUEwQztRQUUxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLHNCQUFjLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDakQsQ0FBQztDQUNGO0FBN0RELHdEQTZEQyJ9