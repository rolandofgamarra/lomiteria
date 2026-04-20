import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

/**
 * SocketManager: Handles WebSocket connections, authentication, and event broadcasting.
 * Singleton pattern ensures one IO instance is shared globally.
 */
export class SocketManager {
  private static instance: SocketManager;
  private io: SocketServer | null = null;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * Initialize the Socket.io server.
   */
  public initialize(httpServer: HttpServer) {
    const socketCorsOrigins = env.SOCKET_CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
    const allowAllSocketCors = socketCorsOrigins.includes("*");

    this.io = new SocketServer(httpServer, {
      cors: {
        origin: allowAllSocketCors ? true : socketCorsOrigins,
        methods: ["GET", "POST"],
      },
    });

    // Authentication Middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as any;
        (socket as any).user = decoded;
        next();
      } catch (err) {
        next(new Error("Authentication error: Invalid token"));
      }
    });

    this.io.on("connection", (socket) => {
      const user = (socket as any).user;
      console.log(`🔌 User connected: ${user.username} (Role: ${user.role})`);

      // Join rooms based on role
      if (user.role === "CASHIER" || user.role === "ADMIN") {
        socket.join("cashiers");
      }
      if (user.role === "WAITER" || user.role === "ADMIN") {
        socket.join("waiters");
      }

      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${user.username}`);
      });
    });

    return this.io;
  }

  /**
   * Broadcast a new order event to all cashiers.
   */
  public emitNewOrder(order: any) {
    if (this.io) {
      this.io.to("cashiers").emit("orders:new", order);
    }
  }

  /**
   * Broadcast an order status update to all waiters.
   */
  public emitStatusUpdate(payload: { orderId: number; status: string }) {
    if (this.io) {
      this.io.to("waiters").emit("orders:update", payload);
    }
  }
}

export const socketManager = SocketManager.getInstance();
