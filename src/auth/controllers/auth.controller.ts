import express from "express";
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { loginSchema } from "../validation/login.schema.js";

/**
 * AuthController: Handles HTTP requests for the Auth module.
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handle the login request.
   */
  handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate request body
      const validatedData = loginSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validatedData.error.format() 
        });
      }

      // 2. Attempt login
      const { username, password } = validatedData.data;
      const authResult = await this.authService.login(username, password);

      if (!authResult) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // 3. Send successful response
      return res.status(200).json(authResult);
    } catch (error) {
      next(error);
    }
  };
}
