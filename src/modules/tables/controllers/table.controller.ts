import express from "express";
import type { Request, Response, NextFunction } from "express";
import { TableService } from "../services/table.service.js";

/**
 * TableController: Handles HTTP requests for tables.
 */
export class TableController {
  private tableService: TableService;

  constructor() {
    this.tableService = new TableService();
  }

  getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tables = await this.tableService.getAllTables();
      return res.status(200).json(tables);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Missing status field" });
      }

      const table = await this.tableService.setTableStatus(Number(id), status);
      if (!table) {
        return res.status(404).json({ error: "Table not found" });
      }

      return res.status(200).json(table);
    } catch (error) {
      next(error);
    }
  };
}
