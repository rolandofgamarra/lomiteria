import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./auth/routes/auth.routes.js";
import { tableRouter } from "./modules/tables/table.routes.js";
import { catalogRouter } from "./modules/catalog/catalog.routes.js";
import { orderRouter } from "./modules/orders/order.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";

const app = express();
const corsOrigins = env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
const allowAllCors = corsOrigins.includes("*");

// Standard Middlewares
app.use(
  cors({
    origin: allowAllCors ? true : corsOrigins,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/tables", tableRouter);
app.use("/catalog", catalogRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);
app.use("/dashboard", dashboardRouter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Lomitería API is running" });
});

// Basic Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export { app };
