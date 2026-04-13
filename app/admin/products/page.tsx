"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Package,
  Search,
  Image as ImageIcon,
  IndianRupee,
  RefreshCcw,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createProductAdmin,
  deleteProductAdmin,
  getAllProductsAdmin,
  updateProductAdmin,
} from "@/app/actions/productActions";
import { Product } from "@/components/shopPage/productCard";

type ProductFormState = {
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: string;
  originalPrice: string;
  stockCount: string;
  inStock: string;
  rating: string;
  reviews: string;
  shortDescription: string;
  description: string;
  tags: string;
  features: string;
  sizes: string;
  careInstructions: string;
  specifications: string;
  material: string;
  color: string;
  weight: string;
  dimensions: string;
  warranty: string;
  returnPolicy: string;
  isFeatured: string;
  isTrending: string;
  isMustTry: string;
};

const DEFAULT_FORM: ProductFormState = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  brand: "softzy",
  price: "",
  originalPrice: "",
  stockCount: "0",
  inStock: "true",
  rating: "0",
  reviews: "0",
  shortDescription: "",
  description: "",
  tags: "",
  features: "",
  sizes: "",
  careInstructions: "",
  specifications: "",
  material: "",
  color: "",
  weight: "",
  dimensions: "",
  warranty: "",
  returnPolicy: "10-day return policy",
  isFeatured: "false",
  isTrending: "false",
  isMustTry: "false",
};

const PRODUCT_CATEGORY_OPTIONS = [
  { label: "Explore", value: "explore", skuPrefix: "EXP" },
  { label: "Handbags", value: "bags", skuPrefix: "BAG" },
  { label: "Toys", value: "toys", skuPrefix: "TOY" },
  { label: "Clothing", value: "clothing", skuPrefix: "CLO" },
  { label: "Shoes", value: "shoes", skuPrefix: "SHO" },
  { label: "Beauty", value: "beauty", skuPrefix: "BEA" },
  { label: "Handloom", value: "handloom", skuPrefix: "HLM" },
  { label: "Collections", value: "collections", skuPrefix: "COL" },
] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const productToForm = (product: Product): ProductFormState => ({
  name: product.name || "",
  slug: product.slug || "",
  sku: product.sku || "",
  category: product.category || "",
  brand: product.brand || "softzy",
  price: String(product.price ?? ""),
  originalPrice: String(product.originalPrice ?? ""),
  stockCount: String(product.stockCount ?? 0),
  inStock: String(product.inStock !== false),
  rating: String(product.rating ?? 0),
  reviews: String(product.reviews ?? 0),
  shortDescription: product.shortDescription || "",
  description: product.description || "",
  tags: (product.tags || []).join(", "),
  features: (product.features || []).join("\n"),
  sizes: (product.sizes || []).join(", "),
  careInstructions: (product.careInstructions || []).join("\n"),
  specifications: (product.specifications || [])
    .map((spec) => `${spec.label}: ${spec.value}`)
    .join("\n"),
  material: product.material || "",
  color: product.color || "",
  weight: product.weight || "",
  dimensions: product.dimensions || "",
  warranty: product.warranty || "",
  returnPolicy: product.returnPolicy || "10-day return policy",
  isFeatured: String(Boolean(product.isFeatured)),
  isTrending: String(Boolean(product.isTrending)),
  isMustTry: String(Boolean(product.isMustTry)),
});

function appendProductFormData(formData: FormData, form: ProductFormState) {
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });
}

const hasStock = (stockCount?: number) => Number(stockCount ?? 0) > 0;

const getNextSkuForCategory = (category: string, products: Product[]) => {
  if (!category) return "";

  const prefix =
    PRODUCT_CATEGORY_OPTIONS.find((option) => option.value === category)?.skuPrefix || "GEN";

  const maxSequence = products.reduce((max, product) => {
    const sku = (product.sku || "").toUpperCase();
    const match = sku.match(new RegExp(`^SZY-${prefix}-(\\d+)$`));
    if (!match) return max;

    const current = Number(match[1]);
    return Number.isFinite(current) ? Math.max(max, current) : max;
  }, 0);

  return `SZY-${prefix}-${String(maxSequence + 1).padStart(3, "0")}`;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(DEFAULT_FORM);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [keepImages, setKeepImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.category?.trim()) set.add(product.category.trim());
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        (product.sku || "").toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" ||
        (product.category || "uncategorized") === categoryFilter;

      const available = hasStock(product.stockCount);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" ? available : !available);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const openEditDialog = (product: Product) => {
    setMode("edit");
    setSelectedProduct(product);
    setForm(productToForm(product));
    setIsSlugManuallyEdited(true);
    setIsSkuManuallyEdited(true);
    setKeepImages(product.images || []);
    setNewImageFiles([]);
    setFormOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewImageFiles(files);
  };

  const removeExistingImage = (index: number) => {
    setKeepImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (category: string) => {
    setForm((prev) => ({
      ...prev,
      category,
      sku:
        mode === "create" && !isSkuManuallyEdited
          ? getNextSkuForCategory(category, products)
          : prev.sku,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      appendProductFormData(formData, form);
      newImageFiles.forEach((file) => formData.append("images", file));

      let response: { success: boolean; error?: string };

      if (mode === "create") {
        response = await createProductAdmin(formData);
      } else {
        if (!selectedProduct) {
          toast.error("No product selected for update.");
          setIsSubmitting(false);
          return;
        }

        formData.append("id", selectedProduct.id);
        formData.append("keepImages", JSON.stringify(keepImages));
        response = await updateProductAdmin(formData);
      }

      if (response.success) {
        toast.success(mode === "create" ? "Product created." : "Product updated.");
        setFormOpen(false);
        setSelectedProduct(null);
        setNewImageFiles([]);
        await fetchProducts();
      } else {
        toast.error(response.error || "Operation failed.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      const response = await deleteProductAdmin(selectedProduct.id);
      if (response.success) {
        toast.success("Product deleted.");
        setDeleteOpen(false);
        setSelectedProduct(null);
        await fetchProducts();
      } else {
        toast.error(response.error || "Delete failed.");
      }
    } catch {
      toast.error("Delete failed. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">
            Product Listing Panel
          </h2>
          <p className="text-muted-foreground inter text-sm">
            Create, update, and manage your catalog with secure admin actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchProducts}
            disabled={loading}
            className="rounded-xl shadow-sm hover:shadow-md transition-all px-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button asChild className="rounded-xl px-4">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-border/60 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/20 border-b border-border/40 pb-4">
          <CardTitle className="text-lg">Catalog ({filteredProducts.length})</CardTitle>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search name, SKU, slug, category..."
                className="pl-9 bg-background w-full"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-45 bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-muted/20">
                  <TableHead className="w-16 pl-6">S.No</TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (Rs.)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        Fetching products...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 mb-4 opacity-20" />
                        <p>No products found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => {
                    const isAvailable = hasStock(product.stockCount);

                    return (
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                              <span>{product.sku ? `SKU: ${product.sku}` : "No SKU"}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {product.category || "uncategorized"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="inline-flex items-center font-semibold text-primary">
                            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                            {Number(product.price || 0).toLocaleString("en-IN")}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`font-medium ${(product.stockCount ?? 0) <= 5 ? "text-amber-600" : "text-foreground"}`}
                          >
                            {product.stockCount ?? 0} in stock
                          </span>
                        </TableCell>

                        <TableCell>
                          {isAvailable ? (
                            <Badge variant="secondary">Available</Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="w-full sm:max-w-5xl lg:max-w-6xl max-h-[94vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "List a new product in the catalog."
                : "Update product details, pricing, stock, and media."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5 [&_input]:bg-white [&_textarea]:bg-white [&_button[role=combobox]]:bg-white"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                      slug: isSlugManuallyEdited ? prev.slug : slugify(event.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(event) => {
                    const rawSlug = event.target.value.toLowerCase();
                    setIsSlugManuallyEdited(rawSlug.trim().length > 0);
                    setForm((prev) => ({ ...prev, slug: rawSlug }));
                  }}
                  onBlur={() =>
                    setForm((prev) => ({ ...prev, slug: slugify(prev.slug) }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  value={form.sku}
                  onChange={(event) => {
                    const nextSku = event.target.value.toUpperCase();
                    setIsSkuManuallyEdited(nextSku.trim().length > 0);
                    setForm((prev) => ({ ...prev, sku: nextSku }));
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  value={form.brand}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, brand: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={form.color}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, color: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Price *</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Original Price *</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.originalPrice}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, originalPrice: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Stock Count *</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockCount}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, stockCount: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>In Stock</Label>
                <Select
                  value={form.inStock}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, inStock: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, rating: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Reviews</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.reviews}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, reviews: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description *</Label>
              <Input
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, shortDescription: event.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tags (comma/new line separated)</Label>
                <textarea
                  value={form.tags}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tags: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Sizes (comma/new line separated)</Label>
                <textarea
                  value={form.sizes}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, sizes: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Features (comma/new line separated)</Label>
                <textarea
                  value={form.features}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, features: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Care Instructions (comma/new line separated)</Label>
                <textarea
                  value={form.careInstructions}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, careInstructions: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Specifications (one per line, format: Label: Value)</Label>
                <textarea
                  value={form.specifications}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, specifications: event.target.value }))
                  }
                  className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Material</Label>
                <Input
                  value={form.material}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, material: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input
                  value={form.weight}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, weight: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Dimensions</Label>
                <Input
                  value={form.dimensions}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, dimensions: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Warranty</Label>
                <Input
                  value={form.warranty}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, warranty: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label>Return Policy</Label>
                <Input
                  value={form.returnPolicy}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, returnPolicy: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Featured</Label>
                <Select
                  value={form.isFeatured}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, isFeatured: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">False</SelectItem>
                    <SelectItem value="true">True</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Trending</Label>
                <Select
                  value={form.isTrending}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, isTrending: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">False</SelectItem>
                    <SelectItem value="true">True</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Must Try</Label>
                <Select
                  value={form.isMustTry}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, isMustTry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Must Try" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">False</SelectItem>
                    <SelectItem value="true">True</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Images {mode === "create" ? "*" : "(optional)"}</Label>
              <Input type="file" multiple accept="image/*" onChange={handleFilesChange} />
              {newImageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {newImageFiles.length} file(s) selected for upload.
                </p>
              )}
            </div>

            {mode === "edit" && keepImages.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Images</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {keepImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative rounded-md overflow-hidden border bg-muted">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        width={120}
                        height={120}
                        className="h-20 w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Remove an image if you want to replace it with newly uploaded files.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : mode === "create" ? (
                  "Create Product"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product?
              {selectedProduct ? ` ${selectedProduct.name}` : ""} This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
