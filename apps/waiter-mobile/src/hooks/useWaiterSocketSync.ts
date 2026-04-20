import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";

type OrderStatusEvent = {
  orderId: number;
  status: string;
};

/**
 * useWaiterSocketSync: Connects the waiter session to the realtime backend.
 * It listens for order status updates and keeps the active order badge fresh.
 */
export function useWaiterSocketSync() {
  const token = useAuthStore((state) => state.token);
  const setSocketState = useOrderStore((state) => state.setSocketState);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  useEffect(() => {
    let socket: Socket | null = null;

    if (!token) {
      setSocketState("disconnected");
      return;
    }

    setSocketState("connecting");

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      setSocketState("connected");
    });

    socket.on("disconnect", () => {
      setSocketState("disconnected");
    });

    socket.on("connect_error", () => {
      setSocketState("error");
    });

    socket.on("orders:update", (payload: OrderStatusEvent) => {
      updateOrderStatus(payload);
    });

    return () => {
      socket?.disconnect();
      setSocketState("disconnected");
    };
  }, [token, setSocketState, updateOrderStatus]);
}
