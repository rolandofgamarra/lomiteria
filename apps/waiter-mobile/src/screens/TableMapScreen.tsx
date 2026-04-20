import React from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { tableService } from "../api/tableService";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";
import type { TableRecord } from "../types/api";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";
import ActiveOrderBanner from "../components/ActiveOrderBanner";

/**
 * TableMapScreen: Visual grid of the dining area.
 * Waiters use this to select a table and start an order.
 */
export default function TableMapScreen({
  onSelectTable,
  onViewStatus,
}: {
  onSelectTable: (id: number) => void;
  onViewStatus: () => void;
}) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const activeOrder = useOrderStore((state) => state.activeOrder);
  const socketState = useOrderStore((state) => state.socketState);

  const {
    data: tables,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<TableRecord[]>({
    queryKey: ["tables"],
    queryFn: tableService.getTables,
    refetchInterval: 5000, // Refresh status every 5s for the demo
  });

  const totalTables = tables?.length ?? 0;
  const occupiedTables = tables?.filter((table) => table.status === "OCCUPIED").length ?? 0;
  const availableTables = totalTables - occupiedTables;

  const renderTable = (table: TableRecord) => {
    const isOccupied = table.status === "OCCUPIED";

    return (
      <TouchableOpacity
        key={table.id}
        activeOpacity={0.7}
        onPress={() => onSelectTable(table.id)}
        className={`w-1/2 p-2 aspect-square rounded-3xl border-2 ${
          isOccupied 
            ? "bg-primary/10 border-primary/40" 
            : "bg-surface border-primary/25"
        }`}
      >
        <View className="flex-1 rounded-[22px] bg-surface px-4 py-4 justify-between border border-primary/10">
          <View className="flex-row justify-between items-start">
            <View className="rounded-full bg-secondary px-3 py-1 border border-primary/20">
              <Text className="text-text text-[11px] font-bold">Mesa {table.number}</Text>
            </View>
            <Text className={`text-xs font-bold ${isOccupied ? "text-primary" : "text-accent"}`}>
              {isOccupied ? "OCUPADA" : "LIBRE"}
            </Text>
          </View>

          <View>
            <Text className={`text-5xl font-black ${isOccupied ? "text-primary" : "text-accent"}`}>
              {table.number}
            </Text>
            <Text className="text-accent text-xs mt-2">
              Capacidad {table.capacity ?? 4} personas
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <ScreenHeader
        subtitle="Panel de mesas"
        title="Salón activo"
        actionLabel="Cerrar sesión"
        onActionPress={() => {
          void logout();
        }}
      />

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Disponibles" value={`${availableTables}`} tone="success" />
        <StatCard label="Ocupadas" value={`${occupiedTables}`} tone="danger" />
      </View>

      {activeOrder ? (
        <ActiveOrderBanner order={activeOrder} socketState={socketState} onViewPress={onViewStatus} />
      ) : null}

      <View className="px-6 mb-4">
        <View className="rounded-3xl border border-primary/15 bg-surface px-4 py-4">
          <Text className="text-accent text-[11px] uppercase tracking-[3px]">Mozo conectado</Text>
          <Text className="text-text text-lg font-bold mt-1">{user?.username}</Text>
          <Text className="text-accent text-sm mt-1">
            Tocá una mesa para comenzar un pedido. La disponibilidad se actualiza automáticamente.
          </Text>
        </View>
      </View>

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Total mesas" value={`${totalTables}`} />
        <StatCard label="Actualización" value="5s" tone="warning" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={
          <RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} tintColor="#D62828" />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator color="#D62828" size="large" />
            <Text className="text-accent mt-4">Cargando mesas...</Text>
          </View>
        ) : null}

        <View className="flex-row flex-wrap px-2">
          {tables?.map(renderTable)}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-primary/15 bg-secondary px-6 py-4">
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-accent rounded-full mr-2" />
            <Text className="text-text text-xs">Libre</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-primary rounded-full mr-2" />
            <Text className="text-text text-xs">Ocupada</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-accent rounded-full mr-2" />
            <Text className="text-text text-xs">Capacidad</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
