import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import type { Product, ProductExtra } from "../types/api";

type ProductConfiguratorModalProps = {
  visible: boolean;
  product: Product | null;
  categoryName?: string;
  categoryProducts: Product[];
  extras: ProductExtra[];
  onClose: () => void;
  onAdd: (payload: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    isHalfAndHalf?: boolean;
    extras: { id: number; name: string; price: number }[];
    notes?: string;
  }) => void;
};

/**
 * ProductConfiguratorModal: handles pizza half-and-half and extras.
 */
export default function ProductConfiguratorModal({
  visible,
  product,
  categoryName,
  categoryProducts,
  extras,
  onClose,
  onAdd,
}: ProductConfiguratorModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [halfAndHalf, setHalfAndHalf] = useState(false);
  const [secondaryProductId, setSecondaryProductId] = useState<number | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [notes, setNotes] = useState("");

  const isPizza = Boolean(categoryName?.toLowerCase().includes("pizza"));

  useEffect(() => {
    if (!visible || !product) return;

    setQuantity(1);
    setHalfAndHalf(false);
    setSelectedExtras([]);
    setNotes("");
    const fallback = categoryProducts.find((item) => item.id !== product.id)?.id ?? null;
    setSecondaryProductId(fallback);
  }, [visible, product, categoryProducts]);

  const secondaryProduct = useMemo(() => {
    return categoryProducts.find((item) => item.id === secondaryProductId) ?? null;
  }, [categoryProducts, secondaryProductId]);

  const selectedExtrasData = useMemo(() => {
    return extras.filter((extra) => selectedExtras.includes(extra.id));
  }, [extras, selectedExtras]);

  const calculatedTotal = useMemo(() => {
    if (!product) return 0;
    const extrasTotal = selectedExtrasData.reduce((sum, extra) => sum + extra.price, 0);
    const mitadTotal = halfAndHalf ? 5000 : 0;
    return (product.price + extrasTotal + mitadTotal) * quantity;
  }, [product, selectedExtrasData, halfAndHalf, quantity]);

  const toggleExtra = (extraId: number) => {
    setSelectedExtras((current) =>
      current.includes(extraId) ? current.filter((id) => id !== extraId) : [...current, extraId]
    );
  };

  const handleAdd = () => {
    if (!product) return;

    const noteParts = [notes.trim()];
    if (halfAndHalf && secondaryProduct) {
      noteParts.push(`Mitad y mitad con ${secondaryProduct.name}`);
    }
    if (selectedExtrasData.length > 0) {
      noteParts.push(
        `Extras: ${selectedExtrasData.map((extra) => extra.name).join(", ")}`
      );
    }

    onAdd({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      isHalfAndHalf: halfAndHalf,
      extras: selectedExtrasData,
      ...(noteParts.filter(Boolean).length > 0 ? { notes: noteParts.filter(Boolean).join(" | ") } : {}),
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-[#24130f]/35">
        <View className="max-h-[92%] rounded-t-[34px] border-t border-primary/15 bg-surface">
          <View className="px-6 pt-5 pb-4 border-b border-primary/15 flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="text-accent text-[11px] uppercase tracking-[3px]">Configurador</Text>
              <Text className="text-text text-2xl font-bold mt-1" numberOfLines={1}>
                {product?.name ?? "Producto"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="rounded-2xl border border-primary/15 bg-secondary px-4 py-3"
            >
              <Text className="text-primary text-xs font-bold">Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 160 }}>
            <View className="mt-5 rounded-[28px] border border-primary/15 bg-secondary p-4">
              <Text className="text-text font-bold">Cantidad</Text>
              <View className="mt-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-surface"
                >
                  <Text className="text-text text-xl font-bold">−</Text>
                </TouchableOpacity>
                <Text className="text-text text-2xl font-bold">{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity((current) => current + 1)}
                  className="h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-surface"
                >
                  <Text className="text-text text-xl font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isPizza ? (
              <View className="mt-4 rounded-[28px] border border-primary/15 bg-secondary p-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-3">
                    <Text className="text-text font-bold text-base">Mitad y mitad</Text>
                    <Text className="text-accent text-xs mt-1">
                      Suma Gs 5.000 y deja una segunda referencia de sabor en la nota del pedido.
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setHalfAndHalf((current) => !current)}
                    className={`rounded-full px-4 py-3 ${halfAndHalf ? "bg-primary" : "bg-surface"}`}
                  >
                    <Text className="text-white font-bold text-xs">
                      {halfAndHalf ? "ACTIVO" : "OFF"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {halfAndHalf ? (
                  <View className="mt-4">
                    <Text className="text-accent text-[11px] uppercase tracking-[3px] mb-3">
                      Segunda mitad
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {categoryProducts
                        .filter((item) => item.id !== product?.id)
                        .map((item) => {
                          const active = secondaryProductId === item.id;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => setSecondaryProductId(item.id)}
                              className={`mr-3 w-44 rounded-3xl border px-4 py-4 ${
                                active ? "bg-primary border-primary" : "bg-surface border-primary/15"
                              }`}
                            >
                              <Text className={`font-bold ${active ? "text-white" : "text-text"}`} numberOfLines={2}>
                                {item.name}
                              </Text>
                              <Text className={`mt-2 text-xs ${active ? "text-white/80" : "text-accent"}`}>
                                Gs {item.price.toLocaleString("es-PY")}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            ) : null}

            <View className="mt-4 rounded-[28px] border border-primary/15 bg-secondary p-4">
              <Text className="text-text font-bold">Extras</Text>
              <Text className="text-accent text-xs mt-1">
                Tocá los agregados que quieras sumar al producto.
              </Text>

              <View className="mt-4 gap-3">
                {extras.map((extra) => {
                  const active = selectedExtras.includes(extra.id);
                  return (
                    <TouchableOpacity
                      key={extra.id}
                      onPress={() => toggleExtra(extra.id)}
                      className={`flex-row justify-between items-center rounded-2xl border px-4 py-4 ${
                        active ? "border-primary bg-primary/10" : "border-primary/15 bg-surface"
                      }`}
                    >
                      <View className="flex-1 pr-4">
                        <Text className="text-text font-bold">{extra.name}</Text>
                        <Text className="text-accent text-xs mt-1">
                          Gs {extra.price.toLocaleString("es-PY")}
                        </Text>
                      </View>
                      <View className={`h-6 w-6 rounded-full border ${active ? "border-primary bg-primary" : "border-primary/25 bg-secondary"}`} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="mt-4 rounded-[28px] border border-primary/15 bg-secondary p-4">
              <Text className="text-text font-bold mb-3">Notas del pedido</Text>
              <TextInput
                className="min-h-[96px] rounded-2xl border border-primary/15 bg-surface p-4 text-text"
                placeholder="Ej: cortar en 8, sin aceitunas..."
                placeholderTextColor="#9A7A70"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 border-t border-primary/15 bg-secondary px-6 py-4">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-accent text-xs uppercase tracking-[3px]">Total estimado</Text>
                <Text className="text-text text-2xl font-bold mt-1">
                  Gs {calculatedTotal.toLocaleString("es-PY")}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-accent text-xs uppercase tracking-[3px]">Resumen</Text>
                <Text className="text-text font-bold mt-1">
                  {selectedExtrasData.length} extras
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAdd}
              className="rounded-2xl bg-primary px-5 py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">Agregar al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
