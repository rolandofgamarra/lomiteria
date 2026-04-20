import { prisma } from "../../database/index.js";

/**
 * UserRepository: Decouples the Auth service from the database ORM (Prisma).
 */
export class UserRepository {
  /**
   * Find a user by their unique username.
   */
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }
}
