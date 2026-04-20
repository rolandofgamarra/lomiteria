import type { Request, Response, NextFunction } from "express";

/**
 * authorizeRoles: Middleware to restrict access to specific user roles.
 * @param roles Array of allowed roles (ADMIN, CASHIER, WAITER)
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!userRole || !roles.includes(userRole)) {
      console.warn(`⛔ Unauthorized access attempt by ${userRole} to ${req.originalUrl}`);
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have the required permissions to access this resource"
      });
    }

    next();
  };
};
