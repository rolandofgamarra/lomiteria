import { Router } from "express";
import { CatalogController } from "./controllers/catalog.controller.js";
import { requireAuth } from "../../auth/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../core/middlewares/rbac.middleware.js";

const catalogRouter = Router();
const catalogController = new CatalogController();

// GET /catalog -> Fetch everything (Hierarchy)
catalogRouter.get(
  "/",
  requireAuth,
  authorizeRoles("WAITER", "CASHIER", "ADMIN"),
  catalogController.getCatalog
);

// GET /catalog/categories/:categoryId/products -> Fetch filtered products
catalogRouter.get(
  "/categories/:categoryId/products",
  requireAuth,
  authorizeRoles("WAITER", "CASHIER", "ADMIN"),
  catalogController.getProductsByCategory
);

export { catalogRouter };
