import { prisma } from "../../../database/index.js";

/**
 * PaymentRepository: Handles the atomic settlement of orders,
 * creating payment/sale records and releasing tables.
 */
export class PaymentRepository {
  /**
   * Finalize an order with a payment.
   * Atomic Transaction ensures data consistency across 4 tables.
   */
  async createPayment(data: {
    orderId: number;
    method: string;
    amount: number;
    tableId: number;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Payment record
      const payment = await tx.payment.create({
        data: {
          orderId: data.orderId,
          method: data.method,
          amount: data.amount,
        },
      });

      // 2. Create the Sale record (for general bookkeeping)
      await tx.sale.create({
        data: {
          orderId: data.orderId,
          totalAmount: data.amount,
          taxAmount: 0, // Simplified for MVP
        },
      });

      // 3. Update Order status to PAID
      await tx.order.update({
        where: { id: data.orderId },
        data: { status: "PAID" },
      });

      // 4. Release the Table (Mark as AVAILABLE)
      await tx.table.update({
        where: { id: data.tableId },
        data: { status: "AVAILABLE" },
      });

      return payment;
    });
  }

  /**
   * Find total sales for a date range (used for dashboard).
   */
  async getSalesTotal(start: Date, end: Date) {
    const result = await prisma.sale.aggregate({
      where: {
        completedAt: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
    return result._sum.totalAmount || 0;
  }
}
