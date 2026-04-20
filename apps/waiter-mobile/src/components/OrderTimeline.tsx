import React from "react";
import { View, Text } from "react-native";

type OrderTimelineProps = {
  status: string;
};

const steps = ["PENDING", "PREPARING", "DELIVERED", "PAID"];

const labels: Record<string, string> = {
  PENDING: "Pedido recibido",
  PREPARING: "En cocina",
  DELIVERED: "Entregado",
  PAID: "Pagado",
};

/**
 * OrderTimeline: compact visual tracker for the waiter order lifecycle.
 */
export default function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = Math.max(0, steps.indexOf(status));

  return (
    <View className="rounded-[28px] border border-primary/15 bg-surface p-4">
      <Text className="text-accent text-[11px] uppercase tracking-[3px] mb-4">Estado del pedido</Text>
      <View className="gap-3">
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          const isCurrent = step === status;

          return (
            <View key={step} className="flex-row items-center">
              <View
                className={`h-4 w-4 rounded-full border ${
                  active ? "bg-primary border-primary" : "bg-secondary border-primary/20"
                }`}
              />
              <View className={`ml-3 flex-1 rounded-2xl border px-4 py-3 ${active ? "border-primary/20 bg-primary/10" : "border-primary/10 bg-secondary"}`}>
                <Text className={`font-bold ${active ? "text-primary" : "text-accent"}`}>
                  {labels[step]}
                </Text>
                <Text className="text-xs text-accent mt-1">
                  {isCurrent ? "Estado actual" : active ? "Paso completado" : "Pendiente"}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
