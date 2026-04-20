import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

/**
 * ScreenHeader: reusable top area with title, subtitle, and optional action.
 */
export default function ScreenHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: ScreenHeaderProps) {
  return (
    <View className="px-6 pt-12 pb-4 flex-row justify-between items-end">
      <View className="flex-1 pr-4">
        {subtitle ? <Text className="text-accent text-xs uppercase tracking-[3px] mb-2">{subtitle}</Text> : null}
        <Text className="text-text text-3xl font-bold">{title}</Text>
      </View>
      {actionLabel && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
          className="bg-secondary border border-primary/20 px-4 py-3 rounded-2xl"
        >
          <Text className="text-primary text-xs font-bold">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
