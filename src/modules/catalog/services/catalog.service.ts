import { CatalogRepository } from "../repositories/catalog.repository.js";

/**
 * CatalogService: Business logic for menu/catalog management.
 */
export class CatalogService {
  private catalogRepository: CatalogRepository;

  constructor() {
    this.catalogRepository = new CatalogRepository();
  }

  /**
   * Get the full menu structure (Categories with Products).
   */
  async getFullMenu() {
    return this.catalogRepository.findAllCategories();
  }

  /**
   * Get products within a specific category.
   */
  async getProductsByCategory(categoryId: number) {
    return this.catalogRepository.findProductsByCategory(categoryId);
  }

  /**
   * Get the list of extras used in configurators.
   */
  async getExtras() {
    return this.catalogRepository.findAllExtras();
  }
}
