"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { UpdateProduct, DeleteProduct } from "@/app/admin/products/actions"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  category: string
  stocks_available: number
  status: string
  image_url?: string
}

interface AdminProductCardProps {
  product: Product
}

export default function AdminProductCard({ product }: AdminProductCardProps) {
    const queryClient = useQueryClient()
    const [openEdit, setOpenEdit] = useState(false)

    const [name, setName] = useState(product.name)
    const [description, setDescription] = useState(product.description ?? "")
    const [price, setPrice] = useState(product.price.toString())
    const [category, setCategory] = useState<string>(product.category)
    const [stocks, setStocks] = useState(product.stocks_available.toString())
    const [status, setStatus] = useState<string>(product.status)
    const [image, setImage] = useState<File | null>(null)

    // Delete Mutation
    const deleteMutation = useMutation({
      mutationFn: () => DeleteProduct(product.id),
      onSuccess: () => {
        toast.success("Product deleted successfully!")
        queryClient.invalidateQueries({ queryKey: ["products"] })
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete product.")
      },
    })

    // Update Mutation
    const updateMutation = useMutation({
      mutationFn: (formData: FormData) => UpdateProduct(formData),
      onSuccess: () => {
        toast.success("Product updated successfully!")
        queryClient.invalidateQueries({ queryKey: ["products"] })
        setOpenEdit(false)
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to update product.")
      },
    })

    const handleUpdate = (e: React.FormEvent) => {
      e.preventDefault()

      const formData = new FormData()
      formData.append("id", product.id.toString())
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("stocksAvailable", stocks)
      formData.append("status", status)

      if (image) {
        formData.append("image", image)
      }

      updateMutation.mutate(formData)
    }

    return (
        <div className=" border border-border rounded-xl p-4 px-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
            
            <div className="flex flex-col gap-3">
              {product.image_url ? (
                <div className="w-full aspect-square overflow-hidden rounded-lg  flex items-center justify-center">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}

              <div className="flex flex-col gap-1 text-left mt-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                        {product.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground whitespace-nowrap">
                      {product.status}
                    </span>
                  </div>

                  <p className="text-lg font-bold text-foreground">
                      ₱{product.price}
                  </p>

                  <p className="text-xs text-muted-foreground">
                      {product.stocks_available} in stock
                  </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 ">
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogTrigger render={
                        <button className="bg-foreground text-white py-2 px-5 rounded-md text-sm whitespace-nowrap">
                            Edit
                        </button>
                    } />
                    
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <FieldGroup className="gap-3">
                                <Field>
                                    <Label>Product Image (Leave blank to keep existing)</Label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                      className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="name">Name</Label>
                                    <Input 
                                      id="name" 
                                      value={name} 
                                      onChange={(e) => setName(e.target.value)} 
                                    />
                                </Field>

                                <Field>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea 
                                      id="description" 
                                      value={description} 
                                      onChange={(e) => setDescription(e.target.value)} 
                                    />
                                </Field>

                                <FieldGroup className="flex flex-row gap-3">
                                    <Field className="w-1/2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input 
                                          id="price" 
                                          type="number" 
                                          value={price} 
                                          onChange={(e) => setPrice(e.target.value)} 
                                        />
                                    </Field>

                                    <Field className="w-1/2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={category} onValueChange={(val) => setCategory(val ?? "")}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Category</SelectLabel>
                                                    <SelectItem key="espressoMachine" value="Espresso Machine">Espresso Machine</SelectItem>
                                                    <SelectItem key="artisanalBean" value="Artisanal Bean">Artisanal Bean</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>

                                <FieldGroup className="flex flex-row gap-3">
                                    <Field className="w-1/2">
                                        <Label htmlFor="stocks">Stocks Available</Label>
                                        <Input 
                                          id="stocks" 
                                          type="number" 
                                          value={stocks} 
                                          onChange={(e) => setStocks(e.target.value)} 
                                        />
                                    </Field>

                                    <Field className="w-1/2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={status} onValueChange={(val) => setStatus(val ?? "")}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem key="active" value="Active">Active</SelectItem>
                                                    <SelectItem key="inactive" value="Inactive">Inactive</SelectItem>
                                                    <SelectItem key="outstock" value="Out of Stock">Out of Stock</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>
                            </FieldGroup>

                            <DialogFooter className="mt-4">
                                <DialogClose render={<button type="button" className="px-4 py-2 text-sm">Cancel</button>} />
                                <button 
                                  type="submit" 
                                  disabled={updateMutation.isPending}
                                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save changes"}
                                </button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger render={
                        <button className="bg-[#95271D] text-white py-2 px-5 rounded-md text-sm whitespace-nowrap">
                            Delete
                        </button>
                    } />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Product Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete {product.name}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate()}
                              className="bg-[#95271D] text-white py-2 px-5 rounded-md text-sm whitespace-nowrap"
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Continue"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}