import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { useCartStore } from "../store/useCartStore";

/**
 * MenuScreen: Fast category-based browsing of ZarfPizzas products.
 * Includes category filtering and one-tap access to the product configurator.
 */
export default function MenuScreen({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const selectedTableId = useCartStore((state) => state.selectedTableId);

  const { data: catalog, isLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: catalogService.getCatalog,
    onSuccess: (data) => {
        if (data.length > 0 && activeCategory === null) {
            setActiveCategory(data[0].id);
        }
    }
  });

  const renderCategoryTab = (category: any) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setActiveCategory(category.id)}
      className={`px-6 py-3 mr-3 rounded-2xl border ${
        activeCategory === category.id 
            ? "bg-primary border-primary" 
            : "bg-white/5 border-white/10"
      }`}
    >
      <Text className={`font-bold ${activeCategory === category.id ? "text-white" : "text-gray-400"}`}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = (product: any) => (
    <TouchableOpacity
      key={product.id}
      onPress={() => {
          // Simple addition for local items like Papas/Bebidas
          // For Pizzas we'll need a modal later
          addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              extras: []
          });
      }}
      className="bg-white/5 p-4 rounded-3xl border border-white/10 mb-3 flex-row justify-between items-center"
    >
      <View className="flex-1">
        <Text className="text-white font-bold text-lg">{product.name}</Text>
        <Text className="text-primary font-bold mt-1">Gs {product.price.toLocaleString("es-PY")}</Text>
      </View>
      <View className="bg-primary/20 p-2 px-4 rounded-full">
        <Text className="text-primary font-bold">+</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
      return (
          <View className="flex-1 bg-secondary justify-center items-center">
              <ActivityIndicator color="#EF4444" size="large" />
          </View>
      );
  }

  const currentCategoryData = catalog?.find((c: any) => c.id === activeCategory);

  return (
    <View className="flex-1 bg-secondary pt-12">
      {/* Header */}
      <View className="px-6 flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <Text className="text-primary font-bold">← VOLVER</Text>
        </TouchableOpacity>
        <View className="items-end">
            <Text className="text-gray-400 text-xs">MESA</Text>
            <Text className="text-white font-bold text-xl">{selectedTableId}</Text>
        </View>
      </View>

      {/* Category Selection */}
      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {catalog?.map(renderCategoryTab)}
        </ScrollView>
      </View>

      {/* Product List */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">
            {currentCategoryData?.name}
        </Text>
        
        {currentCategoryData?.products.map(renderProduct)}
        <View className="h-20" />
      </ScrollView>

      {/* Cart Summary Bar (Floating) */}
      <View className="absolute bottom-8 left-6 right-6">
          <TouchableOpacity className="bg-primary p-5 rounded-3xl flex-row justify-between items-center shadow-2xl shadow-primary/40">
              <Text className="text-white font-bold text-lg">VER PEDIDO</Text>
              <View className="bg-white/20 px-4 py-1 rounded-full">
                  <Text className="text-white font-bold">Gs {useCartStore.getState().getTotal().toLocaleString("es-PY")}</Text>
              </View>
          </TouchableOpacity>
      </View>
    </View>
  );
}
