import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import { env } from "../../config/env.js";

/**
 * AuthService: Contains business logic for authentication.
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Authenticates a user and generates a JWT.
   */
  async login(username: string, passwordAttempt: string) {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return null; // User not found
    }

    const isPasswordValid = await bcrypt.compare(
      passwordAttempt,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return null; // Invalid password
    }

    // Generate JWT (24h as per approved plan)
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return token and sanitized user data
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
