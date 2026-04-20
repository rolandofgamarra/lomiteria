import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 rounded-[32px] border border-primary/15 bg-surface px-6 py-8">
          <Text className="text-primary text-[40px] font-black italic tracking-tight">Zar´fPizzas</Text>
          <Text className="text-text text-xl font-semibold mt-2">Panel de mozos</Text>
          <Text className="text-accent mt-3 leading-5">
            Toma pedidos, revisa mesas y envía comandas sin perder contexto entre el salón y la cocina.
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => {
                setUsername("waiter1");
                setPassword("zarf123");
              }}
              className="rounded-full border border-primary/15 bg-secondary px-4 py-3"
            >
              <Text className="text-text text-xs font-bold">Cargar mozo demo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUsername("admin");
                setPassword("zarf123");
              }}
              className="rounded-full border border-primary/15 bg-secondary px-4 py-3"
            >
              <Text className="text-text text-xs font-bold">Cargar admin demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-[32px] border border-primary/15 bg-surface p-5">
          <View className="mb-5">
            <Text className="text-text mb-2 ml-1 font-medium">Usuario</Text>
            <TextInput
              className="bg-secondary text-text p-4 rounded-2xl border border-primary/15"
              placeholder="Ingrese su usuario..."
              placeholderTextColor="#9A7A70"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="text-text mb-2 ml-1 font-medium">Contraseña</Text>
            <TextInput
              className="bg-secondary text-text p-4 rounded-2xl border border-primary/15"
              placeholder="********"
              placeholderTextColor="#9A7A70"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-6 rounded-2xl p-4 items-center justify-center ${loading ? "bg-primary/60" : "bg-primary"}`}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">INGRESAR</Text>}
          </TouchableOpacity>
        </View>

        <View className="mt-8 flex-row justify-between">
          <Text className="text-accent text-xs">v1.0.0</Text>
          <Text className="text-accent text-xs">Ñemby, Paraguay</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
