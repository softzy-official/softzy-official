import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

// Aligning the Product definition perfectly with your actual productCard interface.
export interface Product {
    id: string; // Changed from number to string to fix TS errors
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    rating: number;
    reviews?: number;
    tags?: string[];
    category?: string;
    shortDescription?: string;
    description?: string;
    features?: string[];
    specifications?: { label: string; value: string }[];
    careInstructions?: string[];
    material?: string;
    color?: string;
    sizes?: string[];
    inStock?: boolean;
    stockCount?: number;
    sku?: string;
    brand?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
    returnPolicy?: string;
    buyLink?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    isMustTry?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void; // string here too
  updateQuantity: (productId: string, quantity: number) => void; // string here too
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (!product.inStock || !product.stockCount || product.stockCount === 0) {
          toast.error(`${product.name} is currently out of stock.`);
          return;
        }

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stockCount) {
            toast.error(`Cannot add more. Only ${product.stockCount} left in stock.`);
            return;
          }
          
          set({
            items: items.map((item) =>
              item.id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          });
          toast.success(`Updated ${product.name} quantity in cart.`);
        } else {
          if (quantity > product.stockCount) {
            toast.error(`Cannot add. Only ${product.stockCount} left in stock.`);
            return;
          }
          
          set({ items: [...items, { ...product, quantity }] });
          toast.success(`${product.name} added to cart.`);
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        toast.info("Item removed from cart");
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        const itemToUpdate = items.find((item) => item.id === productId);

        if (!itemToUpdate) return;
        if (!itemToUpdate.stockCount) return;

        if (quantity > itemToUpdate.stockCount) {
          toast.error(`Maximum available stock is ${itemToUpdate.stockCount}.`);
          return;
        }

        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set({
          items: items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'softzy-cart', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
