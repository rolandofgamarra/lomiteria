import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useCartStore } from "../store/useCartStore";
import { useOrderStore } from "../store/useOrderStore";
import { orderService } from "../api/orderService";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";

type CartScreenProps = {
  onBack: () => void;
  onOrderPlaced: () => void;
};

/**
 * CartScreen: Review and submit the current table order.
 */
export default function CartScreen({ onBack, onOrderPlaced }: CartScreenProps) {
  const [submitting, setSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const selectedTableId = useCartStore((state) => state.selectedTableId);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const updateItemNotes = useCartStore((state) => state.updateItemNotes);
  const clearItems = useCartStore((state) => state.clearItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const setActiveOrder = useOrderStore((state) => state.setActiveOrder);

  const total = getTotal();
  const itemCount = getItemCount();

  const handleSubmit = async () => {
    if (!selectedTableId) {
      Alert.alert("Mesa no seleccionada", "Volvé al mapa de mesas y elegí una mesa primero.");
      return;
    }

    if (!items.length) {
      Alert.alert("Carrito vacío", "Agregá productos antes de enviar el pedido.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await orderService.createOrder({
        tableId: selectedTableId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          isHalfAndHalf: item.isHalfAndHalf,
          extras: item.extras.map((extra) => extra.id),
          ...(item.notes?.trim() ? { notes: item.notes.trim() } : {}),
        })),
      });
      setActiveOrder({
        orderId: response.id,
        tableId: response.tableId,
        totalAmount: response.totalAmount,
        status: response.status,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Pedido enviado", "El pedido fue creado correctamente.");
      clearCart();
      onOrderPlaced();
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || "No se pudo enviar el pedido";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <ScreenHeader
        subtitle="Resumen del pedido"
        title="Carrito"
        actionLabel="Volver"
        onActionPress={onBack}
      />

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Mesa" value={`${selectedTableId ?? "-"}`} tone="warning" />
        <StatCard label="Líneas" value={`${items.length}`} />
      </View>

      <View className="px-6 mb-4 flex-row gap-3">
        <StatCard label="Artículos" value={`${itemCount}`} tone="default" />
        <StatCard label="Total del pedido" value={`Gs ${total.toLocaleString("es-PY")}`} tone="success" />
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 170 }}>
        {items.map((item, index) => {
          const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
          const mitadTotal = item.isHalfAndHalf ? 5000 : 0;
          const lineTotal = (item.price + extrasTotal + mitadTotal) * item.quantity;

          return (
            <View
              key={`${item.productId}-${index}`}
              className="bg-surface border border-primary/15 rounded-[28px] p-4 mb-3"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Text className="text-text text-lg font-bold">{item.name}</Text>
                  <Text className="text-accent text-xs mt-1">
                    Cantidad: {item.quantity} | Base: Gs {item.price.toLocaleString("es-PY")}
                  </Text>
                  {item.isHalfAndHalf ? (
                    <Text className="text-primary text-xs mt-1">Mitad y mitad: +Gs 5.000</Text>
                  ) : null}
                  {item.extras.length > 0 ? (
                    <Text className="text-accent text-xs mt-1">
                      Agregados:{" "}
                      {item.extras.map((extra) => `${extra.name} (+Gs ${extra.price.toLocaleString("es-PY")})`).join(", ")}
                    </Text>
                  ) : null}
                  {item.notes ? <Text className="text-accent text-xs mt-1">Notas: {item.notes}</Text> : null}
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(index)}
                  className="bg-primary/10 border border-primary/20 rounded-2xl px-3 py-2"
                >
                  <Text className="text-primary font-bold text-xs">BORRAR</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center rounded-2xl border border-primary/15 bg-secondary">
                  <TouchableOpacity
                    onPress={() => updateItemQuantity(index, -1)}
                    className="px-4 py-3"
                  >
                    <Text className="text-text font-bold text-lg">−</Text>
                  </TouchableOpacity>
                  <Text className="text-text font-bold text-base px-2">{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateItemQuantity(index, 1)}
                    className="px-4 py-3"
                  >
                    <Text className="text-text font-bold text-lg">+</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-primary font-bold">
                  Gs {lineTotal.toLocaleString("es-PY")}
                </Text>
              </View>

              <View className="mt-4">
                <Text className="text-accent text-[11px] uppercase tracking-[3px] mb-2">Notas del ítem</Text>
                <TextInput
                  className="bg-secondary text-text p-4 rounded-2xl border border-primary/15 min-h-[90px]"
                  placeholder="Ej: sin cebolla, cortar en 8, etc."
                  placeholderTextColor="#9A7A70"
                  value={item.notes ?? ""}
                  onChangeText={(text) => updateItemNotes(index, text)}
                  multiline
                />
              </View>
            </View>
          );
        })}

        {items.length === 0 ? (
          <View className="bg-surface border border-primary/15 rounded-3xl p-6 items-center mt-2">
            <Text className="text-text font-bold text-lg">No hay productos todavía</Text>
            <Text className="text-accent text-center mt-2">
              Volvé al menú y agregá algo al pedido.
            </Text>
          </View>
        ) : null}

        <View className="h-6" />

        <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
          <Text className="text-text font-bold mb-2">Acciones rápidas</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={clearItems}
              className="flex-1 rounded-2xl border border-primary/15 bg-secondary px-4 py-4 items-center"
            >
              <Text className="text-text font-bold text-sm">Vaciar carrito</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onBack}
              className="flex-1 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4 items-center"
            >
              <Text className="text-primary font-bold text-sm">Seguir agregando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-6 right-6">
        <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-accent font-medium">Total del pedido</Text>
            <Text className="text-text font-bold text-2xl">Gs {total.toLocaleString("es-PY")}</Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || items.length === 0}
            className={`p-4 rounded-2xl items-center ${
              submitting || items.length === 0 ? "bg-primary/60" : "bg-primary"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">ENVIAR PEDIDO</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
