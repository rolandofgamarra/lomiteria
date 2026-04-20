import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../api/orderService";
import { useOrderStore } from "../store/useOrderStore";
import OrderTimeline from "../components/OrderTimeline";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";
import type { OrderHistoryRecord } from "../types/api";

type OrderStatusScreenProps = {
  onBack: () => void;
  onNewTable: () => void;
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparación",
  DELIVERED: "Entregado",
  PAID: "Pagado",
  CANCELLED: "Cancelado",
};

/**
 * OrderStatusScreen: live status view plus recent order history for the table.
 */
export default function OrderStatusScreen({ onBack, onNewTable }: OrderStatusScreenProps) {
  const activeOrder = useOrderStore((state) => state.activeOrder);
  const socketState = useOrderStore((state) => state.socketState);
  const lastStatusEvent = useOrderStore((state) => state.lastStatusEvent);
  const pulse = useRef(new Animated.Value(0)).current;

  const tableId = activeOrder?.tableId ?? null;

  const {
    data: history,
    refetch,
    isRefetching,
    isLoading,
  } = useQuery<OrderHistoryRecord[]>({
    queryKey: ["orders", "table", tableId],
    queryFn: async () => {
      if (!tableId) return [];
      return orderService.getOrdersByTable(tableId);
    },
    enabled: Boolean(tableId),
    refetchInterval: 7000,
  });

  useEffect(() => {
    if (!lastStatusEvent || lastStatusEvent.orderId !== activeOrder?.orderId) {
      return;
    }

    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeOrder?.orderId, lastStatusEvent, pulse]);

  const latestOrders = useMemo(() => history ?? [], [history]);

  return (
    <View className="flex-1">
      <ScreenHeader
        subtitle="Control del pedido"
        title="Estado en vivo"
        actionLabel="Mesas"
        onActionPress={onNewTable}
      />

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Mesa" value={tableId ? `${tableId}` : "-"} tone="warning" />
        <StatCard label="Socket" value={socketState === "connected" ? "En vivo" : "Sync"} tone="default" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} tintColor="#D62828" />
        }
      >
        {activeOrder ? (
          <View className="mb-4">
            <Animated.View
              style={{
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              }}
            >
              <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
                <Text className="text-accent text-[11px] uppercase tracking-[3px]">Pedido actual</Text>
                <Text className="text-text text-2xl font-bold mt-1">#{activeOrder.orderId}</Text>
                <Text className="text-accent mt-1">
                  Total Gs {activeOrder.totalAmount.toLocaleString("es-PY")}
                </Text>

                {lastStatusEvent && lastStatusEvent.orderId === activeOrder.orderId ? (
                  <View className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                    <Text className="text-primary font-bold">
                      Actualización en vivo: {statusLabels[lastStatusEvent.status] ?? lastStatusEvent.status}
                    </Text>
                    <Text className="text-accent text-xs mt-1">
                      {new Date(lastStatusEvent.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Animated.View>
          </View>
        ) : (
          <View className="mb-4 rounded-[28px] border border-primary/15 bg-surface p-4">
            <Text className="text-text text-lg font-bold">No hay un pedido activo</Text>
            <Text className="text-accent mt-2">
              Creá un pedido desde el menú y el estado aparecerá acá con el historial de la mesa.
            </Text>
          </View>
        )}

        {activeOrder ? (
          <View className="mb-4">
            <OrderTimeline status={activeOrder.status} />
          </View>
        ) : null}

        <View className="mb-4">
          <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-accent text-[11px] uppercase tracking-[3px]">Historial de mesa</Text>
                <Text className="text-text text-lg font-bold mt-1">Últimos pedidos</Text>
              </View>
              <TouchableOpacity
                onPress={() => void refetch()}
                className="rounded-full border border-primary/15 bg-secondary px-3 py-2"
              >
                <Text className="text-primary text-[11px] font-bold">Actualizar</Text>
              </TouchableOpacity>
            </View>

            {isLoading || isRefetching ? (
              <Text className="text-accent text-sm">Cargando historial...</Text>
            ) : latestOrders.length === 0 ? (
              <Text className="text-accent text-sm">No hay pedidos previos para esta mesa.</Text>
            ) : (
              <View className="gap-3">
                {latestOrders.map((order) => {
                  const isCurrent = order.id === activeOrder?.orderId;
                  return (
                    <View
                      key={order.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        isCurrent ? "border-primary/25 bg-primary/10" : "border-primary/10 bg-secondary"
                      }`}
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-3">
                          <Text className="text-text font-bold">Pedido #{order.id}</Text>
                          <Text className="text-accent text-xs mt-1">
                            {new Date(order.createdAt).toLocaleString([], {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-primary font-bold text-sm">
                            Gs {order.totalAmount.toLocaleString("es-PY")}
                          </Text>
                          <Text className="text-accent text-xs mt-1">
                            {statusLabels[order.status] ?? order.status}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-accent text-xs mt-3">
                        {order.items.length} {order.items.length === 1 ? "línea" : "líneas"} ·{" "}
                        {order.waiter?.username ?? "Mozo"} ·{" "}
                        {order.table?.number ? `Mesa ${order.table.number}` : `Mesa ${order.tableId}`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          onPress={onBack}
          className="rounded-[28px] border border-primary/20 bg-primary px-5 py-4 items-center"
        >
          <Text className="text-white font-bold text-lg">Volver al pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
