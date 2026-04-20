import React from "react";
import { View } from "react-native";

type AppBackgroundProps = {
  children: React.ReactNode;
};

/**
 * AppBackground: shared atmospheric background for the waiter app.
 * Keeps the screens visually consistent without relying on an extra dependency.
 */
export default function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View className="flex-1 bg-secondary">
      <View className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/15" />
      <View className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-accent/10" />
      <View className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-primary/8" />
      <View className="absolute inset-0 opacity-70" style={{ backgroundColor: "rgba(255, 249, 241, 0.45)" }} />
      <View className="flex-1">{children}</View>
    </View>
  );
}
