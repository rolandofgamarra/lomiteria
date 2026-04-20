import type { Request, Response } from "express";
import { PaymentService } from "../services/payment.service.js";

/**
 * PaymentController: Manages HTTP entry points for financial transactions.
 */
export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Process a payment for an existing order.
   */
  process = async (req: Request, res: Response) => {
    try {
      const { orderId, method } = req.body;

      if (!orderId || !method) {
        return res.status(400).json({ error: "orderId and method are required" });
      }

      const payment = await this.paymentService.processPayment({ orderId, method });
      
      res.status(201).json({
        message: "Payment processed successfully",
        payment,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
