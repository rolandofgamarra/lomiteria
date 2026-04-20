import { Router } from "express";
import { TableController } from "./controllers/table.controller.js";
import { requireAuth } from "../../auth/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../core/middlewares/rbac.middleware.js";

const tableRouter = Router();
const tableController = new TableController();

tableRouter.get(
  "/",
  requireAuth,
  authorizeRoles("WAITER", "CASHIER", "ADMIN"),
  tableController.getTables
);
tableRouter.patch(
  "/:id/status",
  requireAuth,
  authorizeRoles("CASHIER", "ADMIN"),
  tableController.updateStatus
);

export { tableRouter };
