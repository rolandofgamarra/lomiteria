import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

/**
 * DashboardController: Exposes business analytics through HTTP.
 */
export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Get high-level business KPIs.
   */
  getOverview = async (req: Request, res: Response) => {
    try {
      const overview = await this.dashboardService.getOverview();
      res.json(overview);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * Get detailed analytics for charts (Weekly revenue + Top products).
   */
  getAnalytics = async (req: Request, res: Response) => {
    try {
      const [weeklyRevenue, monthlyRevenue, topProducts] = await Promise.all([
        this.dashboardService.getWeeklyRevenue(),
        this.dashboardService.getMonthlyRevenue(),
        this.dashboardService.getTopProducts(),
      ]);

      res.json({
        weeklyRevenue,
        monthlyRevenue,
        topProducts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
