"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Loader2,
  Package,
  Search,
  Image as ImageIcon,
  IndianRupee,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAllProducts } from "@/app/actions/productActions";
import { Product } from "@/components/shopPage/productCard";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">
            Products Inventory
          </h2>
          <p className="text-muted-foreground inter text-sm">
            View all store products, stock levels, and pricing.
          </p>
        </div>
        <Button
          
          onClick={fetchProducts}
          disabled={loading}
          className="rounded-xl shadow-sm hover:shadow-md transition-all px-6"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4 mr-2" />
          )}
          {loading ? "Syncing..." : "Refresh Inventory"}
        </Button>
      </div>

      <Card className="shadow-sm border-border/60 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/20 border-b border-border/40 pb-4">
          <CardTitle className="text-lg">
            Catalog ({filteredProducts.length})
          </CardTitle>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, SKU or category..."
              className="pl-9 bg-background w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-muted/20">
                  <TableHead className="w-[64px] pl-6">S.No</TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        Fetching inventory...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 mb-4 opacity-20" />
                        <p>No products found in the database.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <TableRow key={product.id} className="hover:bg-muted/40">
                      <TableCell className="pl-6 text-muted-foreground font-medium">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>

                      <TableCell>
                        {product.images && product.images.length > 0 ? (
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted border">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border">
                            <ImageIcon className="h-5 w-5 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col max-w-xs">
                          <span className="font-semibold truncate" title={product.name}>
                            {product.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {product.sku ? `SKU: ${product.sku}` : "No SKU"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.category || "Uncategorized"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex items-center font-semibold text-primary">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                          {product.price.toLocaleString("en-IN")}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-medium ${
                            (product.stockCount ?? 0) <= 5 ? "text-amber-600" : "text-foreground"
                          }`}
                        >
                          {product.stockCount ?? 0} in stock
                        </span>
                      </TableCell>

                      <TableCell className="pr-6">
                        {product.inStock && (product.stockCount ?? 0) > 0 ? (
                          <Badge variant="secondary">Available</Badge>
                        ) : (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}