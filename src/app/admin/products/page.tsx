import AdminProductCard from "@/components/Admin-Product-Card";
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";

export default function AdminProducts() {
  return (
    <div className="w-[70%] mx-auto mt-20">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Admin Products Listing</h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-72">
            <Input placeholder="Search products..." />
          </div>

          <select className="h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="all">All Categories</option>
            <option value="espresso">Espresso Machines</option>
            <option value="beans">Artisanal Beans</option>
          </select>

        <Dialog>
            <form>
                <DialogTrigger render={<button className="bg-foreground text-white py-2 px-5 rounded-md text-sm">Add Product</button>} />
                <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add a Product</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name-1">Product Image</Label>
                        <input type="file" name="" id="" className="h-55 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1"/>
                    </Field>
                    <Field>
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="" name="" defaultValue="" />
                    </Field>
                     <Field>
                        <Label htmlFor="name-1">Description</Label>
                        <Textarea id="" name="" defaultValue="" />
                    </Field>
                    <FieldGroup className="flex flex-row">
                        <Field>
                            <Label htmlFor="username-1">Price</Label>
                            <Input id="" name="" defaultValue="" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Category</Label>
                            <Select>
                                <SelectTrigger className="w-full max-w-60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem key={"espressoMachine"} value={"Espresso Machine"}>Espresso Machine</SelectItem>
                                    <SelectItem key={"artisanalBean"} value={"Artisanal Bean"}>Artisanal Bean</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row">
                        <Field>
                            <Label htmlFor="username-1">Stocks Available</Label>
                            <Input id="" name="" defaultValue="" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Status</Label>
                             <Select>
                                <SelectTrigger className="w-full max-w-60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem key={"active"} value={"Active"}>Active</SelectItem>
                                    <SelectItem key={"inactive"} value={"Inactive"}>Inactive</SelectItem>
                                    <SelectItem key={"outstock"} value={"Out of Stock"}>Out of Stock</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose render={<button>Cancel</button>} />
                    <button type="submit">Save changes</button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Espresso Machines</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <AdminProductCard />
          <AdminProductCard />
          <AdminProductCard />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Artisanal Beans</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AdminProductCard />
          <AdminProductCard />
        </div>
      </section>

    </div>
  );  
}