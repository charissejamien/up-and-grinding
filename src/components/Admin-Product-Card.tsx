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
import { Textarea } from "./ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminProductCard() {
    return(
        <div className="bg-white rounded-xl py-10 px-20 pt-50 shadow-md text-center flex flex-col gap-4">
            <h3 className="text-lg">Barista Express</h3>
            <h4 className="text-2xl font-semibold">P7,500.00</h4>
            <p>Machines</p>
            <p>4 stocks available</p>

            <div className="flex align-center gap-5">
                <Dialog>
            <form>
                <DialogTrigger render={<button className="bg-foreground text-white py-2 px-5 rounded-md text-sm">Add Product</button>} />
                <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <FieldGroup>
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
                <AlertDialog>
                <AlertDialogTrigger render={<button className="bg-[#95271D] text-white py-2 px-5 rounded-md text-sm">Delete Product</button>} />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Product Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
        </div>
    );
}