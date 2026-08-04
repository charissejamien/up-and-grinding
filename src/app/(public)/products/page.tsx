"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetProducts, GetCategories, Category } from "@/app/admin/products/actions";
import ProductCard, { Product } from "@/components/Product-Card";
import { Input } from "@/components/ui/input";

export default function Products() {

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: GetCategories,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceSort, setPriceSort] = useState<"default" | "low-to-high" | "high-to-low">("default");

  const processedProducts = useMemo(() => {

    let result = products.filter((p) => p.status === "Active");

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }


    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (priceSort === "low-to-high") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === "high-to-low") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, searchTerm, selectedCategory, priceSort]);

  const groupedProducts = useMemo(() => {
    const map: Record<string, Product[]> = {};

    categories.forEach((cat) => {
      map[cat.name] = [];
    });

    processedProducts.forEach((product) => {
      if (!map[product.category]) {
        map[product.category] = [];
      }
      map[product.category].push(product);
    });

    return map;
  }, [processedProducts, categories]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-16 text-center text-muted-foreground">
        Loading catalog...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-16 text-center text-destructive">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-10 md:mt-16 mb-20">

      <div className="border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Explore artisanal coffee beans and premium espresso hardware.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

          <div className="w-full sm:w-56">
            <Input
              placeholder="Search coffee, machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="default">Sort by Price</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          No products found matching your active filters or search term.
        </div>
      ) : selectedCategory !== "all" || priceSort !== "default" || searchTerm ? (

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {processedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p) => console.log("Added to cart:", p)}
            />
          ))}
        </div>
      ) : (

        Object.entries(groupedProducts).map(([catName, categoryProducts]) => {
          if (categoryProducts.length === 0) return null;

          return (
            <section key={catName} className="mt-10">
              <h2 className="text-xl font-semibold mb-6">{catName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => console.log("Added to cart:", p)}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}