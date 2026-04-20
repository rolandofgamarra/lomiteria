import React from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { tableService } from "../api/tableService";
import { useAuthStore } from "../store/useAuthStore";
import type { TableRecord } from "../types/api";

/**
 * TableMapScreen: Visual grid of the dining area.
 * Waiters use this to select a table and start an order.
 */
export default function TableMapScreen({ onSelectTable }: { onSelectTable: (id: number) => void }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

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

  const renderTable = (table: TableRecord) => {
    const isOccupied = table.status === "OCCUPIED";

    return (
      <TouchableOpacity
        key={table.id}
        activeOpacity={0.7}
        onPress={() => onSelectTable(table.id)}
        className={`w-[45%] aspect-square m-[2.5%] rounded-3xl items-center justify-center border-2 ${
          isOccupied 
            ? "bg-red-500/10 border-red-500" 
            : "bg-green-500/10 border-green-500"
        }`}
      >
        <Text className={`text-4xl font-bold ${isOccupied ? "text-red-500" : "text-green-500"}`}>
          {table.number}
        </Text>
        <Text className={`text-xs mt-1 font-medium ${isOccupied ? "text-red-400" : "text-green-400"}`}>
          {isOccupied ? "OCUPADA" : "LIBRE"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-secondary pt-12">
      {/* Header */}
      <View className="px-6 flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-400 text-sm">Bienvenido,</Text>
          <Text className="text-white text-xl font-bold">{user?.username}</Text>
        </View>
        <TouchableOpacity 
          onPress={logout}
          className="bg-white/10 p-3 rounded-xl border border-white/10"
        >
          <Text className="text-gray-300 text-xs font-bold">SALIR</Text>
        </TouchableOpacity>
      </View>

      <Text className="px-6 text-white text-2xl font-bold mb-4">Mapa de Mesas</Text>

      <ScrollView
        className="flex-1 px-3"
        refreshControl={
          <RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} tintColor="#EF4444" />
        }
      >
        <View className="flex-row flex-wrap">
          {tables?.map(renderTable)}
        </View>
        
        <View className="h-20" />
      </ScrollView>

      {/* Footer Info */}
      <View className="bg-black/20 p-4 border-t border-white/5 flex-row justify-around">
        <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <Text className="text-gray-400 text-xs">Libre</Text>
        </View>
        <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            <Text className="text-gray-400 text-xs">Ocupada</Text>
        </View>
      </View>
    </View>
  );
}
