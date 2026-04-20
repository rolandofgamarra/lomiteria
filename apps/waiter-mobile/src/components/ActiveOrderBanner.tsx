import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import type { ActiveOrderState, SocketConnectionState } from "../store/useOrderStore";

type ActiveOrderBannerProps = {
  order: ActiveOrderState;
  socketState: SocketConnectionState;
  onViewPress?: () => void;
};

const statusLabel: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  DELIVERED: "Entregado",
  PAID: "Cobrado",
  CANCELLED: "Cancelado",
};

const statusTone: Record<string, string> = {
  PENDING: "bg-secondary border-primary/15 text-accent",
  PREPARING: "bg-primary/10 border-primary/20 text-primary",
  DELIVERED: "bg-secondary border-primary/15 text-text",
  PAID: "bg-primary border-primary text-white",
  CANCELLED: "bg-secondary border-primary/15 text-accent",
};

const socketTone: Record<SocketConnectionState, string> = {
  connecting: "bg-secondary border-primary/15 text-accent",
  connected: "bg-primary/10 border-primary/20 text-primary",
  disconnected: "bg-secondary border-primary/15 text-accent",
  error: "bg-primary/10 border-primary/20 text-primary",
};

const socketLabel: Record<SocketConnectionState, string> = {
  connecting: "Conectando",
  connected: "En vivo",
  disconnected: "Desconectado",
  error: "Error de red",
};

/**
 * ActiveOrderBanner: persistent waiter-side card for the current order.
 */
export default function ActiveOrderBanner({ order, socketState, onViewPress }: ActiveOrderBannerProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.02,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [order.status, order.updatedAt, scale]);

  return (
    <View className="px-6 mb-4">
      <Animated.View style={{ transform: [{ scale }] }}>
        <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
        <View className="flex-row justify-between items-start gap-3">
          <View className="flex-1 pr-2">
            <Text className="text-accent text-[11px] uppercase tracking-[3px]">Pedido en curso</Text>
            <Text className="text-text text-xl font-bold mt-1">Pedido #{order.orderId}</Text>
            <Text className="text-accent text-sm mt-1">
              Mesa {order.tableId} · Total Gs {order.totalAmount.toLocaleString("es-PY")}
            </Text>
          </View>

          <View className={`rounded-full border px-3 py-2 ${socketTone[socketState]}`}>
            <Text className="text-[11px] font-bold">{socketLabel[socketState]}</Text>
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          <View className={`rounded-full border px-3 py-2 ${statusTone[order.status] ?? statusTone.PENDING}`}>
            <Text className={`text-[11px] font-bold ${order.status === "PAID" ? "text-white" : ""}`}>
              {statusLabel[order.status] ?? order.status}
            </Text>
          </View>
          <View className="rounded-full border border-primary/15 bg-secondary px-3 py-2">
            <Text className="text-[11px] font-bold text-text">
              Actualizado {new Date(order.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
          {onViewPress ? (
            <TouchableOpacity
              onPress={onViewPress}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2"
            >
              <Text className="text-[11px] font-bold text-primary">Ver detalle</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        </View>
      </Animated.View>
    </View>
  );
}
