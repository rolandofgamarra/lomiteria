import { Router } from "express";
import { DashboardController } from "./controllers/dashboard.controller.js";
import { requireAuth } from "../../auth/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../core/middlewares/rbac.middleware.js";

const dashboardRouter = Router();
const controller = new DashboardController();

/**
 * @route GET /dashboard/overview
 * @desc Get business KPIs.
 * @access Private (CASHIER, ADMIN)
 */
dashboardRouter.get(
  "/overview",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  controller.getOverview
);

/**
 * @route GET /dashboard/analytics
 * @desc Get weekly revenue and top products.
 * @access Private (CASHIER, ADMIN)
 */
dashboardRouter.get(
  "/analytics",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  controller.getAnalytics
);

export { dashboardRouter };
