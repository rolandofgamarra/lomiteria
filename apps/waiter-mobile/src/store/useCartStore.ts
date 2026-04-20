import { create } from "zustand";

export interface CartItem {
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
  updateItemQuantity: (index: number, delta: number) => void;
  updateItemNotes: (index: number, notes: string) => void;
  clearItems: () => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
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

  addItem: (item) =>
    set((state) => {
      const existingIndex = state.items.findIndex((current) => {
        if (current.productId !== item.productId) return false;
        if (Boolean(current.isHalfAndHalf) !== Boolean(item.isHalfAndHalf)) return false;
        if ((current.notes ?? "").trim() !== (item.notes ?? "").trim()) return false;
        if (current.extras.length !== item.extras.length) return false;

        return current.extras.every((extra, index) => extra.id === item.extras[index]?.id);
      });

      if (existingIndex >= 0) {
        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + item.quantity,
        };
        return { items: nextItems };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: (index) => set((state) => ({
    items: state.items.filter((_, i) => i !== index)
  })),

  updateItemQuantity: (index, delta) =>
    set((state) => {
      const nextItems = [...state.items];
      const currentItem = nextItems[index];

      if (!currentItem) {
        return state;
      }

      const nextQuantity = currentItem.quantity + delta;

      if (nextQuantity <= 0) {
        nextItems.splice(index, 1);
      } else {
        nextItems[index] = { ...currentItem, quantity: nextQuantity };
      }

      return { items: nextItems };
    }),

  updateItemNotes: (index, notes) =>
    set((state) => ({
      items: state.items.map((item, i) => (i === index ? { ...item, notes } : item)),
    })),

  clearItems: () => set({ items: [] }),

  clearCart: () => set({ items: [], selectedTableId: null }),

  getTotal: () => {
    const items = get().items;
    return items.reduce((acc, item) => {
      const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
      const mitadTotal = item.isHalfAndHalf ? 5000 : 0;
      return acc + (item.price + extrasTotal + mitadTotal) * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
