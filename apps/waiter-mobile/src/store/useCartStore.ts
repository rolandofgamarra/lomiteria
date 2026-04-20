import { create } from "zustand";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  isHalfAndHalf?: boolean;
  extras: { id: number; name: string; price: number }[];
  notes?: string;
}

interface CartState {
  selectedTableId: number | null;
  items: CartItem[];
  
  selectTable: (tableId: number | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

/**
 * useCartStore: Manages the ephemeral order state for a specific table.
 * All logic for 'Mitad y Mitad' (5k) and 'Agregados' is applied here 
 * to provide real-time total updates for the waiter.
 */
export const useCartStore = create<CartState>((set, get) => ({
  selectedTableId: null,
  items: [],

  selectTable: (tableId) => set({ selectedTableId: tableId }),

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  removeItem: (index) => set((state) => ({
    items: state.items.filter((_, i) => i !== index)
  })),

  clearCart: () => set({ items: [], selectedTableId: null }),

  getTotal: () => {
    const items = get().items;
    return items.reduce((acc, item) => {
      const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
      const mitadTotal = item.isHalfAndHalf ? 5000 : 0;
      return acc + (item.price + extrasTotal + mitadTotal) * item.quantity;
    }, 0);
  },
}));
