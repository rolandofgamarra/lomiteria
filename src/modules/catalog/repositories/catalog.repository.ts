import { prisma } from "../../../database/index.js";

/**
 * CatalogRepository: Handles database access for categories and products.
 */
export class CatalogRepository {
  /**
   * Get all categories with their products.
   */
  async findAllCategories() {
    return prisma.category.findMany({
      include: {
        products: {
          where: { isAvailable: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get products by a specific category.
   */
  async findProductsByCategory(categoryId: number) {
    return prisma.product.findMany({
      where: { categoryId, isAvailable: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Find a specific product by ID.
   */
  async findProductById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }
}
