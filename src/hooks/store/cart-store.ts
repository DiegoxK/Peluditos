import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/server/db/schema";

export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartActions {
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        const cartItems = get().items;
        const existingItem = cartItems.find((item) => item._id === product._id);

        if (existingItem) {
          const updatedItems = cartItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
          };
          set({ items: [...cartItems, newItem] });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item._id === productId ? { ...item, quantity } : item,
            ),
          }));
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "shopping-cart-storage",
    },
  ),
);
