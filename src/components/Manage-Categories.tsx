"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetCategories,
  SaveCategory,
  UpdateCategory,
  DeleteCategory,
  Category,
} from "@/app/admin/products/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageCategoriesDialog() {

  const queryClient = useQueryClient();
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: GetCategories,
  });

  const addMutation = useMutation({
    mutationFn: SaveCategory,
    onSuccess: () => {
      toast.success("Category added!");
      setNewCatName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      UpdateCategory(id, name),
    onSuccess: () => {
      toast.success("Category updated!");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addMutation.mutate(newCatName.trim());
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    updateMutation.mutate({ id, name: editingName.trim() });
  };

  const handleDelete = (cat: Category) => {
    const productCount = cat.product_count ?? 0;
    
    if (productCount > 0) {
      toast.error(
        `Cannot delete "${cat.name}": ${productCount} product(s) are currently assigned to it.`
      );
      return;
    }

    deleteMutation.mutate(cat.id);
  };

  return (
    <Dialog>
      <DialogTrigger render={
        <button className="border border-input bg-background hover:bg-muted py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
          Manage Categories
        </button>
      } />
      <DialogContent className="sm:max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle>Category Management</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAdd} className="flex gap-2 mt-2">
          <Input
            placeholder="New Category Name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="text-sm"
          />
          <button
            type="submit"
            disabled={addMutation.isPending || !newCatName.trim()}
            className="bg-foreground text-background px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1 hover:opacity-90 disabled:opacity-50"
          >
            {addMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add
              </>
            )}
          </button>
        </form>

        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No categories created yet.
            </div>
          ) : (
            categories.map((cat) => {
              const count = cat.product_count ?? 0;

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-md border border-border/60 text-xs bg-muted/30"
                >
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.id)}
                        className="text-emerald-600 hover:text-emerald-700 p-1"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-muted-foreground hover:text-foreground p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-semibold text-foreground">
                          {cat.name}
                        </span>

                        <span className="text-[10px] text-muted-foreground ml-2">
                          ({count} {count === 1 ? "product" : "products"})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deleteMutation.isPending || count > 0}
                          title={
                            count > 0
                              ? `Cannot delete: ${count} product(s) assigned`
                              : "Delete category"
                          }
                          className="p-1 hover:bg-destructive/10 rounded text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}