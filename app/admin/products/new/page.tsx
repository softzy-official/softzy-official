"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAdmin, getAllProductsAdmin } from "@/app/actions/productActions";
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

function appendProductFormData(formData: FormData, form: ProductFormState) {
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [form, setForm] = useState<ProductFormState>(DEFAULT_FORM);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productsLoaded) return;

    getAllProductsAdmin()
      .then((data) => setProducts(data))
      .catch(() => toast.error("Could not load products for SKU generation."))
      .finally(() => setProductsLoaded(true));
  }, [productsLoaded]);

  useEffect(() => {
    const urls = newImageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImageFiles]);

  const handleCategoryChange = (category: string) => {
    setForm((prev) => ({
      ...prev,
      category,
      sku: !isSkuManuallyEdited ? getNextSkuForCategory(category, products) : prev.sku,
    }));
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setNewImageFiles((prev) => {
      const existing = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const uniqueToAdd = files.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !existing.has(key);
      });

      return [...prev, ...uniqueToAdd];
    });

    event.target.value = "";
  };

  const removeSelectedImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      appendProductFormData(formData, {
        ...form,
        slug: slugify(form.slug),
      });
      newImageFiles.forEach((file) => formData.append("images", file));

      const response = await createProductAdmin(formData);

      if (response.success) {
        toast.success("Product created.");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(response.error || "Operation failed.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight nunito text-primary mb-1">
            Add Product
          </h2>
          <p className="text-muted-foreground inter text-sm">
            Full-page form for smooth product entry.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>New Product Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            ref={formRef}
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
                className="w-full min-h-24 rounded-md border border-input px-3 py-2 text-sm"
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
                  className="w-full min-h-20 rounded-md border border-input px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Sizes (comma/new line separated)</Label>
                <textarea
                  value={form.sizes}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, sizes: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Features (comma/new line separated)</Label>
                <textarea
                  value={form.features}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, features: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Care Instructions (comma/new line separated)</Label>
                <textarea
                  value={form.careInstructions}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, careInstructions: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-md border border-input px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Specifications (one per line, format: Label: Value)</Label>
                <textarea
                  value={form.specifications}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, specifications: event.target.value }))
                  }
                  className="w-full min-h-24 rounded-md border border-input px-3 py-2 text-sm"
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
              <Label>Upload Images *</Label>
              <Input type="file" multiple accept="image/*" onChange={handleFilesChange} required={newImageFiles.length === 0} />
              {newImageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {newImageFiles.length} file(s) selected. You can add more images in multiple rounds.
                </p>
              )}

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {previewUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative rounded-md overflow-hidden border bg-white">
                      <img
                        src={url}
                        alt={`Selected image ${index + 1}`}
                        className="h-28 w-full object-contain bg-white"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeSelectedImage(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
