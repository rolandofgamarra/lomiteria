import apiClient from "./apiClient";
import type { CreateOrderRequest, CreateOrderResponse, OrderHistoryRecord } from "../types/api";

/**
 * orderService: Handles order creation for the waiter flow.
 */
export const orderService = {
  createOrder: async (payload: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post("/orders", payload);
    return response.data;
  },

  getOrdersByTable: async (tableId: number): Promise<OrderHistoryRecord[]> => {
    const response = await apiClient.get(`/orders/table/${tableId}`);
    return response.data;
  },
};
