import { z } from "zod";

/**
 * LoginSchema: Validates the request body for the login endpoint.
 */
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
