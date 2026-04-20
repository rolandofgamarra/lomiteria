import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import type { CatalogCategory, Product, ProductExtra } from "../types/api";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";
import ProductConfiguratorModal from "../components/ProductConfiguratorModal";
import ActiveOrderBanner from "../components/ActiveOrderBanner";

/**
 * MenuScreen: Fast category-based browsing of ZarfPizzas products.
 * Includes category filtering and one-tap access to the product configurator.
 */
export default function MenuScreen({
  onBack,
  onCheckout,
  onViewStatus,
}: {
  onBack: () => void;
  onCheckout: () => void;
  onViewStatus: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const selectedTableId = useCartStore((state) => state.selectedTableId);
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const activeOrder = useOrderStore((state) => state.activeOrder);
  const socketState = useOrderStore((state) => state.socketState);

  const { data: catalog, isLoading } = useQuery<CatalogCategory[]>({
    queryKey: ["catalog"],
    queryFn: catalogService.getCatalog,
  });

  const { data: extras } = useQuery<ProductExtra[]>({
    queryKey: ["catalog", "extras"],
    queryFn: catalogService.getExtras,
  });

  useEffect(() => {
    if (catalog?.length && activeCategory === null) {
      setActiveCategory(catalog[0].id);
    }
  }, [catalog, activeCategory]);

  if (isLoading) {
      return (
          <View className="flex-1 bg-secondary justify-center items-center">
              <ActivityIndicator color="#D62828" size="large" />
          </View>
      );
  }

  const currentCategoryData = catalog?.find((c) => c.id === activeCategory);
  const filteredProducts = currentCategoryData?.products.filter((product) => {
    if (!search.trim()) {
      return true;
    }

    return product.name.toLowerCase().includes(search.trim().toLowerCase());
  }) ?? [];

  return (
    <View className="flex-1">
      <ScreenHeader
        subtitle="Carta activa"
        title="Tomar pedido"
        actionLabel="Volver"
        onActionPress={onBack}
      />

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Mesa" value={`${selectedTableId ?? "-"}`} tone="warning" />
        <StatCard label="Ítems" value={`${items.length}`} tone="default" />
      </View>

      {activeOrder ? (
        <ActiveOrderBanner order={activeOrder} socketState={socketState} onViewPress={onViewStatus} />
      ) : null}

      <View className="px-6 mb-4">
        <View className="rounded-3xl border border-primary/15 bg-surface p-4">
          <Text className="text-accent text-[11px] uppercase tracking-[3px] mb-3">Buscar producto</Text>
          <TextInput
            className="rounded-2xl border border-primary/15 bg-secondary px-4 py-4 text-text"
            placeholder="Ej: hamburguesa, gaseosa, pizza..."
            placeholderTextColor="#9A7A70"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {catalog?.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`mr-3 rounded-2xl border px-5 py-3 ${isActive ? "bg-primary border-primary" : "bg-surface border-primary/15"}`}
              >
                <Text className={`font-bold ${isActive ? "text-white" : "text-text"}`}>{category.name}</Text>
                <Text className={`mt-1 text-[11px] ${isActive ? "text-white/80" : "text-accent"}`}>
                  {category.products.length} productos
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-row justify-between items-end mb-4">
          <View>
            <Text className="text-accent text-[11px] uppercase tracking-[3px]">Categoría actual</Text>
            <Text className="text-text text-2xl font-bold mt-1">{currentCategoryData?.name ?? "Sin categoría"}</Text>
          </View>
          <Text className="text-accent text-xs">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
          </Text>
        </View>

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isPizzaCategory = Boolean(currentCategoryData?.name.toLowerCase().includes("pizza"));

            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => {
                  if (isPizzaCategory) {
                    setConfigProduct(product);
                    return;
                  }

                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    extras: [],
                  });
                }}
                className="mb-3 overflow-hidden rounded-[28px] border border-primary/15 bg-surface"
              >
                <View className="px-4 py-4 flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-text font-bold text-lg">{product.name}</Text>
                    <Text className="text-accent text-xs mt-1">
                      {isPizzaCategory ? "Abrir configurador" : "Producto listo para agregar al pedido"}
                    </Text>
                    <Text className="text-primary font-bold mt-3">
                      Gs {product.price.toLocaleString("es-PY")}
                    </Text>
                  </View>
                  <View className="items-end">
                    <View className={`rounded-full px-4 py-2 ${isPizzaCategory ? "bg-primary/15" : "bg-primary/15"}`}>
                      <Text className={`font-bold text-xs ${isPizzaCategory ? "text-primary" : "text-primary"}`}>
                        {isPizzaCategory ? "CONFIGURAR" : "AGREGAR"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="rounded-[28px] border border-primary/15 bg-surface px-5 py-8 items-center">
            <Text className="text-text text-lg font-bold">No hay coincidencias</Text>
            <Text className="text-accent text-center mt-2">
              Probá con otro nombre o cambiá de categoría para seguir agregando al pedido.
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          className={`rounded-[28px] px-5 py-4 flex-row justify-between items-center ${
            items.length > 0 ? "bg-primary" : "bg-primary/60"
          }`}
          onPress={onCheckout}
          disabled={items.length === 0}
        >
          <View>
            <Text className="text-white text-lg font-bold">Ver pedido</Text>
            <Text className="text-white/80 text-xs mt-1">
              {items.length} {items.length === 1 ? "línea" : "líneas"} en el carrito
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white text-sm font-bold">
              Pedido total: Gs {getTotal().toLocaleString("es-PY")}
            </Text>
            <Text className="text-white/80 text-xs mt-1">Ir al checkout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ProductConfiguratorModal
        visible={Boolean(configProduct)}
        product={configProduct}
        categoryName={currentCategoryData?.name}
        categoryProducts={currentCategoryData?.products ?? []}
        extras={extras ?? []}
        onClose={() => setConfigProduct(null)}
        onAdd={(payload) => {
          addItem(payload);
        }}
      />
    </View>
  );
}
