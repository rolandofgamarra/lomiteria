import React from "react";
import { View, Text } from "react-native";

type StatCardProps = {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "warning";
};

const toneClassName: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-surface border-primary/12",
  success: "bg-surface border-primary/20",
  danger: "bg-surface border-primary/20",
  warning: "bg-secondary border-primary/20",
};

/**
 * StatCard: compact summary tile used across the waiter screens.
 */
export default function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <View className={`flex-1 rounded-3xl border px-4 py-4 ${toneClassName[tone]}`}>
      <Text className="text-accent text-[11px] uppercase tracking-[3px]">{label}</Text>
      <Text className="text-text text-2xl font-bold mt-2">{value}</Text>
    </View>
  );
}
