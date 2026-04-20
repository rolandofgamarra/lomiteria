import { create } from "zustand";

export type SocketConnectionState = "connecting" | "connected" | "disconnected" | "error";

export interface ActiveOrderState {
  orderId: number;
  tableId: number;
  totalAmount: number;
  status: string;
  updatedAt: string;
}

export interface StatusEventState {
  orderId: number;
  status: string;
  updatedAt: string;
}

interface OrderTrackerState {
  activeOrder: ActiveOrderState | null;
  socketState: SocketConnectionState;
  lastStatusEvent: StatusEventState | null;

  setActiveOrder: (order: ActiveOrderState) => void;
  updateOrderStatus: (payload: { orderId: number; status: string }) => void;
  clearActiveOrder: () => void;
  setSocketState: (state: SocketConnectionState) => void;
}

/**
 * useOrderStore: Tracks the waiter-side order currently being followed.
 * It keeps the latest order status and the Socket.IO connection state.
 */
export const useOrderStore = create<OrderTrackerState>((set, get) => ({
  activeOrder: null,
  socketState: "disconnected",
  lastStatusEvent: null,

  setActiveOrder: (order) => set({ activeOrder: order }),

  updateOrderStatus: ({ orderId, status }) =>
    set((state) => {
      if (!state.activeOrder || state.activeOrder.orderId !== orderId) {
        return state;
      }

      return {
        activeOrder: {
          ...state.activeOrder,
          status,
          updatedAt: new Date().toISOString(),
        },
        lastStatusEvent: {
          orderId,
          status,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  clearActiveOrder: () => set({ activeOrder: null, lastStatusEvent: null }),

  setSocketState: (state) => {
    if (get().socketState === state) {
      return;
    }

    set({ socketState: state });
  },
}));
