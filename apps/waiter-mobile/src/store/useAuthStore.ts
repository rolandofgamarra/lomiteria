import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  token: string | null;
  user: any | null;
  setSession: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * useAuthStore: Manages the waiter session state.
 * Uses expo-secure-store for persistent encrypted token storage on the physical device.
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setSession: async (token, user) => {
    await SecureStore.setItemAsync("user_token", token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("user_token");
    await SecureStore.deleteItemAsync("user_data");
    set({ token: null, user: null });
  },

  initialize: async () => {
    const token = await SecureStore.getItemAsync("user_token");
    const userData = await SecureStore.getItemAsync("user_data");

    if (token && userData) {
      set({ token, user: JSON.parse(userData) });
    }
  },
}));
