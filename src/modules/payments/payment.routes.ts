import { Router } from "express";
import { PaymentController } from "./controllers/payment.controller.js";
import { requireAuth } from "../../auth/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../core/middlewares/rbac.middleware.js";

const paymentRouter = Router();
const controller = new PaymentController();

/**
 * @route POST /payments
 * @desc Process payment for an order.
 * @access Private (CASHIER, ADMIN)
 */
paymentRouter.post(
  "/",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  controller.process
);

export { paymentRouter };
