export const productsData: Record<string, Array<{
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
}>> = {
  "best-sellers": [
    { id: "1", name: "Classic Tote Bag", price: 1299, originalPrice: 1599, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/1" },
    { id: "2", name: "Floral Summer Dress", price: 899, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=764&auto=format&fit=crop", href: "/product/2" },
    { id: "3", name: "Kids Play Set", price: 599, originalPrice: 799, image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop", href: "/product/3" },
    { id: "4", name: "Running Sneakers", price: 1999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop", href: "/product/4" },
  ],
  "new-arrivals": [
    { id: "5", name: "Handwoven Scarf", price: 499, image: "https://plus.unsplash.com/premium_photo-1674273913841-1468c9432368?q=80&w=687&auto=format&fit=crop", href: "/product/5" },
    { id: "6", name: "Gold Earrings Set", price: 799, originalPrice: 999, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1074&auto=format&fit=crop", href: "/product/6" },
    { id: "7", name: "Decorative Vase", price: 1199, image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1032&auto=format&fit=crop", href: "/product/7" },
    { id: "8", name: "Leather Wallet", price: 699, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/8" },
  ],
  "beauty-picks": [
    { id: "9", name: "Makeup Palette", price: 1499, originalPrice: 1899, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/9" },
    { id: "10", name: "Skincare Set", price: 2499, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/10" },
    { id: "11", name: "Lipstick Collection", price: 899, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/11" },
    { id: "12", name: "Perfume Gift Set", price: 1999, originalPrice: 2499, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1180&auto=format&fit=crop", href: "/product/12" },
  ],
  "bag-essentials": [
    { id: "13", name: "Crossbody Bag", price: 899, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/13" },
    { id: "14", name: "Backpack Pro", price: 1599, originalPrice: 1999, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/14" },
    { id: "15", name: "Clutch Purse", price: 699, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/15" },
    { id: "16", name: "Travel Duffle", price: 2299, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop", href: "/product/16" },
  ],
};