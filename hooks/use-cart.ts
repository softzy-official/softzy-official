import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { syncCartToDatabase } from '@/app/actions/cartActions';

export interface Product {
    id: string; 
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
  removeItem: (productId: string) => void; 
  updateQuantity: (productId: string, quantity: number) => void; 
  clearCart: () => void;
  getCartTotal: () => number;
}

// Helper function to format items for MongoDB easily
const triggerDBSync = (items: CartItem[]) => {
  const dbFormattedItems = items.map(i => ({
    productId: i.id,
    name: i.name,
    slug: i.slug,
    price: i.price,
    image: i.images?.[0] || "",
    quantity: i.quantity
  }));
  // Fire and forget without blocking UI
  syncCartToDatabase(dbFormattedItems).catch(err => console.error("Sync failed:", err));
};

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

        let newItems: CartItem[];

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stockCount) {
            toast.error(`Cannot add more. Only ${product.stockCount} left in stock.`);
            return;
          }
          
          newItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          );
          set({ items: newItems });
          toast.success(`Updated ${product.name} quantity in cart.`);
        } else {
          if (quantity > product.stockCount) {
            toast.error(`Cannot add. Only ${product.stockCount} left in stock.`);
            return;
          }
          
          newItems = [...items, { ...product, quantity }];
          set({ items: newItems });
          toast.success(`${product.name} added to cart.`);
        }

        // Sync with Mongo
        triggerDBSync(newItems);
      },

      removeItem: (productId: string) => {
        const newItems = get().items.filter((item) => item.id !== productId);
        set({ items: newItems });
        toast.info("Item removed from cart");
        
        // Sync with Mongo
        triggerDBSync(newItems);
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        const itemToUpdate = items.find((item) => item.id === productId);

        if (!itemToUpdate || !itemToUpdate.stockCount) return;

        if (quantity > itemToUpdate.stockCount) {
          toast.error(`Maximum available stock is ${itemToUpdate.stockCount}.`);
          return;
        }

        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        const newItems = items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        set({ items: newItems });
        
        // Sync with Mongo
        triggerDBSync(newItems);
      },

      clearCart: () => {
        set({ items: [] });
        triggerDBSync([]);
      },

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