import { prisma } from "../../../database/index.js";

/**
 * TableRepository: Handles database access for tables.
 */
export class TableRepository {
  /**
   * Get all tables from the database.
   */
  async findAll() {
    return prisma.table.findMany({
      orderBy: { number: "asc" },
    });
  }

  /**
   * Find a specific table by ID.
   */
  async findById(id: number) {
    return prisma.table.findUnique({ where: { id } });
  }

  /**
   * Update a table status.
   */
  async updateStatus(id: number, status: string) {
    return prisma.table.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
