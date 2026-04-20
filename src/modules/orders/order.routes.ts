import { Router } from "express";
import { OrderController } from "./controllers/order.controller.js";
import { requireAuth } from "../../auth/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../core/middlewares/rbac.middleware.js";

const orderRouter = Router();
const orderController = new OrderController();

// GET /orders/active -> Dashboard queue
orderRouter.get(
  "/active",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  orderController.getActive
);

// GET /orders/:id -> Detail view
orderRouter.get(
  "/:id",
  requireAuth,
  authorizeRoles("WAITER", "CASHIER", "ADMIN"),
  orderController.getById
);

// POST /orders -> Create new order
orderRouter.post(
  "/",
  requireAuth,
  authorizeRoles("WAITER", "ADMIN"),
  orderController.create
);

// PATCH /orders/:id/status -> Move through pipeline
orderRouter.patch(
  "/:id/status",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  orderController.updateStatus
);

export { orderRouter };
