import { PaymentRepository } from "../repositories/payment.repository.js";
import { prisma } from "../../../database/index.js";

/**
 * PaymentService: Coordinates the logic for finalizing payments.
 */
export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async processPayment(data: {
    orderId: number;
    method: "CASH" | "DEBIT_CARD" | "CREDIT_CARD" | "TRANSFER" | "QR";
  }) {
    // 1. Fetch Order to verify existence and amount
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { table: true },
    });

    if (!order) throw new Error("Order not found");
    if (order.status === "PAID") throw new Error("Order is already paid");
    if (order.status === "CANCELLED") throw new Error("Order is cancelled and cannot be paid");

    // 2. Finalize payment in the repository
    return this.paymentRepository.createPayment({
      orderId: order.id,
      method: data.method,
      amount: order.totalAmount,
      tableId: order.tableId,
    });
  }
}
