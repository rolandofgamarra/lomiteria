import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import apiClient from "../api/apiClient";

/**
 * LoginScreen: Staff entry point.
 * Optimized for rapid entry with ZarfPizzas branding.
 */
export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor ingrese usuario y contraseña");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      const { token, user } = response.data;
      
      await setSession(token, user);
    } catch (error: any) {
      const message = error.response?.data?.error || "Error al conectar con el servidor";
      Alert.alert("Login Fallido", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-secondary justify-center px-8">
      <View className="items-center mb-12">
        <Text className="text-primary text-5xl font-bold italic">Zarf'Pizzas</Text>
        <Text className="text-gray-400 text-lg mt-2">Sistema de Mozos</Text>
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-white mb-2 ml-1 font-medium">Usuario</Text>
          <TextInput
            className="bg-white/10 text-white p-4 rounded-2xl border border-white/20"
            placeholder="Ingrese su usuario..."
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-white mb-2 ml-1 font-medium">Contraseña</Text>
          <TextInput
            className="bg-white/10 text-white p-4 rounded-2xl border border-white/20"
            placeholder="********"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`bg-primary p-5 rounded-2xl mt-4 items-center flex-row justify-center ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">INGRESAR</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <Text className="text-gray-500 text-center mt-12 text-xs">
        v1.0.0 - Ñemby, Paraguay
      </Text>
    </View>
  );
}
