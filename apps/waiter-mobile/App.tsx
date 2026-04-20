import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/store/useAuthStore';
import { useCartStore } from './src/store/useCartStore';
import LoginScreen from './src/screens/LoginScreen';
import TableMapScreen from './src/screens/TableMapScreen';
import MenuScreen from './src/screens/MenuScreen';

// Create a client for TanStack Query
const queryClient = new QueryClient();

/**
 * ZarfPizzas Waiter App Entry Point
 */
export default function App() {
  const { token, initialize } = useAuthStore();
  const { selectedTableId, selectTable } = useCartStore();

  useEffect(() => {
    initialize();
  }, []);

  const renderContent = () => {
    if (!token) return <LoginScreen />;
    
    if (selectedTableId) {
      return <MenuScreen onBack={() => selectTable(null)} />;
    }

    return <TableMapScreen onSelectTable={(id) => selectTable(id)} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1">
        <StatusBar style="light" />
        {renderContent()}
      </View>
    </QueryClientProvider>
  );
}
