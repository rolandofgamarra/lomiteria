import express from "express";
import type { Request, Response, NextFunction } from "express";
import { CatalogService } from "../services/catalog.service.js";

/**
 * CatalogController: Handles HTTP requests for categories and products.
 */
export class CatalogController {
  private catalogService: CatalogService;

  constructor() {
    this.catalogService = new CatalogService();
  }

  /**
   * Get all categories and their products.
   */
  getCatalog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catalog = await this.catalogService.getFullMenu();
      return res.status(200).json(catalog);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get products by category ID.
   */
  getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const products = await this.catalogService.getProductsByCategory(Number(categoryId));
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
}
