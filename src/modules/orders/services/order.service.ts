import { OrderRepository } from "../repositories/order.repository.js";
import { prisma } from "../../../database/index.js";
import { socketManager } from "../../../core/socket/socket.manager.js";

/**
 * OrderService: Business logic for order transactions.
 * Handles pricing calculations, half-and-half surcharges, and extras.
 */
export class OrderService {
  private orderRepository: OrderRepository;
  private readonly MITAD_SURCHARGE = 5000;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  /**
   * Process and create a new order with business rules.
   */
  async createOrder(data: {
    tableId: number;
    waiterId: number;
    items: {
      productId: number;
      quantity: number;
      isHalfAndHalf?: boolean;
      extras?: number[];
      notes?: string;
    }[];
  }) {
    let orderTotal = 0;
    const itemsToCreate = [];

    for (const item of data.items) {
      // 1. Fetch Product
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);

      let unitPrice = product.price;
      
      // 2. Fetch Extras (Fixed for duplicates/multi-agregados)
      let extrasTotal = 0;
      if (item.extras && item.extras.length > 0) {
        const productExtras = await prisma.productExtra.findMany({
          where: { id: { in: item.extras } },
        });
        
        // Sum each instance of the ID using the fetched price map
        extrasTotal = item.extras.reduce((acc, extraId) => {
          const extraData = productExtras.find(e => e.id === extraId);
          return acc + (extraData?.price || 0);
        }, 0);
      }

      // 3. Apply Mitad y Mitad Surcharge
      if (item.isHalfAndHalf) {
        unitPrice += this.MITAD_SURCHARGE;
      }

      const itemSubtotal = (unitPrice + extrasTotal) * item.quantity;
      orderTotal += itemSubtotal;

      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice + extrasTotal,
        subtotal: itemSubtotal,
        notes: item.notes,
        extras: item.extras,
      });
    }

    const order = await this.orderRepository.createOrder({
      tableId: data.tableId,
      waiterId: data.waiterId,
      totalAmount: orderTotal,
      items: itemsToCreate,
    });

    // --- REAL-TIME BROADCAST ---
    // Fetch full order with includes before broadcasting to cashier
    const fullOrder = await this.orderRepository.findById(order.id);
    socketManager.emitNewOrder(fullOrder);

    return order;
  }

  async getActiveOrders() {
    return this.orderRepository.findActive();
  }

  async getOrderById(id: number) {
    return this.orderRepository.findById(id);
  }

  async transitionStatus(id: number, status: string) {
    const updatedOrder = await this.orderRepository.updateStatus(id, status);
    
    // --- REAL-TIME BROADCAST ---
    socketManager.emitStatusUpdate({
      orderId: id,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }
}
