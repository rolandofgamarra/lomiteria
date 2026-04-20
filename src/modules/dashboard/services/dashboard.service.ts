import { prisma } from "../../../database/index.js";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";

/**
 * DashboardService: Aggregates business data for analytical views.
 */
export class DashboardService {
  /**
   * Get main KPIs for the dashboard landing page.
   */
  async getOverview() {
    const totalSales = await prisma.sale.aggregate({
      _sum: { totalAmount: true },
    });

    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ["PENDING", "PREPARING", "DELIVERED"] },
      },
    });

    const occupiedTables = await prisma.table.count({
      where: { status: "OCCUPIED" },
    });

    const totalProducts = await prisma.product.count();

    return {
      revenue: totalSales._sum.totalAmount || 0,
      activeOrders,
      occupiedTables,
      totalProducts,
    };
  }

  /**
   * Get weekly revenue flow for the last 4 weeks.
   */
  async getWeeklyRevenue() {
    const weeks = [];
    
    // Grouping by week as per User requirement
    for (let i = 0; i < 4; i++) {
        const date = subWeeks(new Date(), i);
        const start = startOfWeek(date);
        const end = endOfWeek(date);

        const sum = await prisma.sale.aggregate({
            where: {
                completedAt: { gte: start, lte: end }
            },
            _sum: { totalAmount: true }
        });

        weeks.push({
            label: `Week ${format(start, "dd/MM")} - ${format(end, "dd/MM")}`,
            amount: sum._sum.totalAmount || 0
        });
    }

    return weeks.reverse();
  }

  /**
   * Get most popular products based on quantity sold.
   */
  async getTopProducts() {
    const topItems = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    // Hydrate with product names
    const hydrated = await Promise.all(
      topItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          name: product?.name || "Unknown",
          quantity: item._sum.quantity,
        };
      })
    );

    return hydrated;
  }
}
