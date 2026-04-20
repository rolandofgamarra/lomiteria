import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authRouter = Router();
const authController = new AuthController();

// Basic Login Route
authRouter.post("/login", authController.handleLogin);

export { authRouter };
