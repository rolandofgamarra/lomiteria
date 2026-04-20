import { prisma } from "../../../database/index.js";

/**
 * OrderRepository: Handles atomic creation of orders and their associated items.
 */
export class OrderRepository {
  /**
   * Create a new order with its items in a single transaction.
   */
  async createOrder(data: {
    tableId: number;
    waiterId: number;
    totalAmount: number;
    items: {
      productId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      notes?: string;
      extras?: number[]; // IDs of ProductExtra
    }[];
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Order header
      const order = await tx.order.create({
        data: {
          tableId: data.tableId,
          waiterId: data.waiterId,
          totalAmount: data.totalAmount,
          status: "PENDING",
        },
      });

      // 2. Create Order Items and their extra links
      for (const item of data.items) {
        const orderItemData = {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          ...(item.notes !== undefined ? { notes: item.notes } : {}),
        };

        const orderItem = await tx.orderItem.create({
          data: orderItemData,
        });

        // 3. Link Extras if provided
        if (item.extras && item.extras.length > 0) {
          await tx.orderItemExtra.createMany({
            data: item.extras.map((extraId) => ({
              orderItemId: orderItem.id,
              productExtraId: extraId,
            })),
          });
        }
      }

      // 4. Mark Table as OCCUPIED
      await tx.table.update({
        where: { id: data.tableId },
        data: { status: "OCCUPIED" },
      });

      return order;
    });
  }

  /**
   * Find an order by ID with its items and extras.
   */
  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            extras: {
              include: {
                productExtra: true,
              },
            },
          },
        },
        table: true,
        waiter: {
          select: { id: true, username: true, role: true },
        },
      },
    });
  }

  /**
   * Update order status.
   */
  async updateStatus(id: number, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  /**
   * Get all active orders (not PAID or CANCELLED).
   */
  async findActive() {
    return prisma.order.findMany({
      where: {
        status: {
          in: ["PENDING", "PREPARING", "DELIVERED"],
        },
      },
      include: {
        table: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get recent orders for a specific table.
   */
  async findByTableId(tableId: number, limit = 8) {
    return prisma.order.findMany({
      where: { tableId },
      include: {
        table: true,
        items: {
          include: {
            product: true,
            extras: {
              include: {
                productExtra: true,
              },
            },
          },
        },
        waiter: {
          select: { id: true, username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
