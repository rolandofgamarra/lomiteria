import express from "express";
import type { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service.js";

/**
 * OrderController: Handles HTTP requests for the order lifecycle.
 */
export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * Create a new order.
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Basic validation (ideally use Zod in a real production app)
      const { tableId, items } = req.body;
      const waiterId = (req as any).user?.id;

      if (!waiterId) {
        return res.status(401).json({ error: "Unauthorized user" });
      }

      if (!tableId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Missing tableId or items array" });
      }

      const order = await this.orderService.createOrder({
        tableId: Number(tableId),
        waiterId,
        items,
      });

      return res.status(201).json(order);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Get all active orders for the cashier dashboard.
   */
  getActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getActiveOrders();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a single order's details.
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(Number(id));
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update the status of an order.
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: "Status is required" });

      const order = await this.orderService.transitionStatus(Number(id), status);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
}
