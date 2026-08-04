"use client";

import AdminProductCard, { Product } from "@/components/Admin-Product-Card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ManageCategoriesDialog from "@/components/Manage-Categories";
import toast from "react-hot-toast";

import { SaveProduct, GetProducts, GetCategories, Category } from "./actions";
import { useState, useMemo } from "react";

export default function AdminProducts() {
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: GetCategories,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [stocks, setStocks] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const saveProduct = useMutation({
    mutationFn: (formData: FormData) => SaveProduct(formData),
    onSuccess: () => {
      toast.success("Product successfully added!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refreshes counts in category dialog

      setName("");
      setDescription("");
      setPrice("");
      setStocks("");
      setImage(null);
      setCategory(null);
      setStatus(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save product.");
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!category || !status) {
      toast.error("Please select both category and status.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stocksAvailable", stocks);
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    saveProduct.mutate(formData);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));


      const matchesCategory =
        selectedFilter === "all" || product.category === selectedFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedFilter]);

  const groupedProducts = useMemo(() => {
    const map: Record<string, Product[]> = {};

    categories.forEach((cat) => {
      map[cat.name] = [];
    });

    filteredProducts.forEach((product) => {
      if (!map[product.category]) {
        map[product.category] = [];
      }
      map[product.category].push(product);
    });

    return map;
  }, [filteredProducts, categories]);

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-10 md:mt-16 mb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Admin Products Listing
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search products..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <ManageCategoriesDialog />

          {/* ADD PRODUCT DIALOG */}
          <Dialog>
            <DialogTrigger render={
              <button className="bg-foreground text-background py-2 px-5 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity">
                Add Product
              </button>
            } />
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add a Product</DialogTitle>
              </DialogHeader>

              <FieldGroup className="gap-4">
                <Field>
                  <Label>Product Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm"
                  />
                </Field>

                <Field>
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <Field>
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>

                <FieldGroup className="flex flex-col sm:flex-row gap-3">
                  <Field className="w-full sm:w-1/2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Field>
                  
                  <Field className="w-full sm:w-1/2">
                    <Label>Category</Label>
                    <Select
                      value={category ?? undefined}
                      onValueChange={(val) => setCategory(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup className="flex flex-col sm:flex-row gap-3">
                  <Field className="w-full sm:w-1/2">
                    <Label>Stocks Available</Label>
                    <Input
                      type="number"
                      value={stocks}
                      onChange={(e) => setStocks(e.target.value)}
                    />
                  </Field>

                  <Field className="w-full sm:w-1/2">
                    <Label>Status</Label>
                    <Select
                      value={status ?? undefined}
                      onValueChange={(val) => setStatus(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Out of Stock">
                            Out of Stock
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </FieldGroup>

              <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
                <DialogClose render={
                  <button
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 border rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                } />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveProduct.isPending}
                  className="w-full sm:w-auto bg-foreground text-background px-5 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {saveProduct.isPending ? "Adding..." : "Add Product"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      {Object.keys(groupedProducts).length === 0 ||
      filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No products found matching your search or filter.
        </div>
      ) : (
        Object.entries(groupedProducts).map(([catName, categoryProducts]) => {

          if (categoryProducts.length === 0) return null;

          return (
            <section key={catName} className="mt-8">
              <h2 className="text-xl font-semibold mb-4">{catName}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <AdminProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}