import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "./api";

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  userId: string;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (product_id: number) => Promise<void>;
  updateQuantity: (product_id: number, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: "guest-user", // 실무에선 실제 로그인 유저 ID 사용
      addItem: async (newItem) => {
        const { userId, items } = get();
        try {
          const existingItem = items.find(item => item.product_id === newItem.product_id);
          const updatedItem = existingItem 
            ? { ...newItem, quantity: existingItem.quantity + newItem.quantity }
            : newItem;
            
          await api.post(`/api/order/api/cart/${userId}/add`, updatedItem);
          
          let newItems = [...items];
          if (existingItem) {
            newItems = newItems.map(item => 
              item.product_id === newItem.product_id ? updatedItem : item
            );
          } else {
            newItems.push(newItem);
          }
          set({ items: newItems });
        } catch (error) {
          console.error("Cart add error:", error);
        }
      },
      removeItem: async (product_id) => {
        const { userId, items } = get();
        try {
          await api.delete(`/api/order/api/cart/${userId}/remove/${product_id}`);
          set({ items: items.filter(item => item.product_id !== product_id) });
        } catch (error) {
          console.error("Cart remove error:", error);
        }
      },
      updateQuantity: async (product_id, quantity) => {
        const { userId, items } = get();
        if (quantity < 1) return;
        
        try {
          // 백엔드 엔드포인트는 /add를 재사용하거나 별도 /update가 있다고 가정
          // 여기서는 아이템을 직접 넘기는 방식으로 처리 (백엔드 사양에 따라 조정 가능)
          const item = items.find(i => i.product_id === product_id);
          if (!item) return;

          const updatedItem = { ...item, quantity };
          await api.post(`/api/order/api/cart/${userId}/add`, updatedItem);
          
          set({
            items: items.map(i => i.product_id === product_id ? updatedItem : i)
          });
        } catch (error) {
          console.error("Cart update error:", error);
        }
      },
      fetchCart: async () => {
        const { userId } = get();
        try {
          const { data } = await api.get(`/api/order/api/cart/${userId}`);
          if (data && data.items) {
            set({ items: data.items });
          }
        } catch (error) {
          console.error("Cart fetch error:", error);
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // 로컬 스토리지에 저장
    }
  )
);
