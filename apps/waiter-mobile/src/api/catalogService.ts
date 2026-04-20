import apiClient from "./apiClient";
import type { CatalogCategory, ProductExtra } from "../types/api";

/**
 * catalogService: Handles fetching the menu categories and products.
 */
export const catalogService = {
  /**
   * Fetch all menu categories with their products.
   */
  getCatalog: async (): Promise<CatalogCategory[]> => {
    const response = await apiClient.get("/catalog");
    return response.data;
  },

  /**
   * Fetch all product extras used in the configurator.
   */
  getExtras: async (): Promise<ProductExtra[]> => {
    const response = await apiClient.get("/catalog/extras");
    return response.data;
  },
};
