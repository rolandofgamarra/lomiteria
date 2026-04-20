import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/store/useAuthStore';
import { useCartStore } from './src/store/useCartStore';
import { useOrderStore } from './src/store/useOrderStore';
import { useWaiterSocketSync } from './src/hooks/useWaiterSocketSync';
import LoginScreen from './src/screens/LoginScreen';
import TableMapScreen from './src/screens/TableMapScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import OrderStatusScreen from './src/screens/OrderStatusScreen';
import AppBackground from './src/components/AppBackground';

// Create a client for TanStack Query
const queryClient = new QueryClient();

/**
 * ZarfPizzas Waiter App Entry Point
 */
export default function App() {
  const { token, initialize } = useAuthStore();
  const { selectedTableId, selectTable, clearCart } = useCartStore();
  const clearActiveOrder = useOrderStore((state) => state.clearActiveOrder);
  const [screen, setScreen] = useState<"tables" | "menu" | "cart" | "status">("tables");
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    void initialize().finally(() => setBootstrapped(true));
  }, []);

  useWaiterSocketSync();

  useEffect(() => {
    if (!token) {
      clearCart();
      clearActiveOrder();
      setScreen("tables");
    }
  }, [token, clearCart, clearActiveOrder]);

  const renderContent = () => {
    if (!token) return <LoginScreen />;

    if (screen === "cart") {
      return (
        <CartScreen
          onBack={() => setScreen("menu")}
          onOrderPlaced={() => {
            clearCart();
            setScreen("status");
          }}
        />
      );
    }

    if (screen === "status") {
      return (
        <OrderStatusScreen
          onBack={() => {
            setScreen("tables");
            selectTable(null);
            clearCart();
          }}
          onNewTable={() => {
            setScreen("tables");
            selectTable(null);
            clearCart();
          }}
        />
      );
    }

    if (screen === "menu" && selectedTableId) {
      return (
        <MenuScreen
          onBack={() => {
            selectTable(null);
            setScreen("tables");
          }}
          onCheckout={() => setScreen("cart")}
          onViewStatus={() => setScreen("status")}
        />
      );
    }

    return (
      <TableMapScreen
        onSelectTable={(id) => {
          selectTable(id);
          setScreen("menu");
        }}
        onViewStatus={() => setScreen("status")}
      />
    );
  };

  if (!bootstrapped) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppBackground>
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator color="#EF4444" size="large" />
            <Text className="text-white font-bold text-lg mt-4">Cargando sesión</Text>
            <Text className="text-gray-400 text-center mt-2">
              Preparando el panel de trabajo para el mozo.
            </Text>
          </View>
        </AppBackground>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppBackground>
        <StatusBar style="light" />
        {renderContent()}
      </AppBackground>
    </QueryClientProvider>
  );
}
