"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/app/admin/dashboard/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
}

export interface OrderData {
  id: string;
  order_number: string;
  status: string;
  payment_method?: string;
  total_amount: number;
  created_at: string;
  shipping_address: {
    recipient_name?: string;
    email?: string;
  };
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  confirmed: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  preparing: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  shipped: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  completed: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-red-600 bg-red-500/10 border-red-500/20",
};

export default function AdminOrderCard({ order }: { order: OrderData }) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const customerName = order.shipping_address?.recipient_name || "Guest Customer";
  const statusKey = order.status.toLowerCase();
  const paymentMethod = order.payment_method ? order.payment_method.toUpperCase() : "N/A";

  const handleStatusChange = (newStatus: string) => {
    statusMutation.mutate({ orderId: order.id, newStatus });
  };

  return (
    <Card className="w-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base font-bold">Order #{order.order_number}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {order.order_items.length} Products | {formattedDate}
            </CardDescription>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${
              statusColors[statusKey] || "text-gray-600 bg-gray-100"
            }`}
          >
            {order.status}
          </span>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex gap-8">
            <div className="text-muted-foreground flex flex-col gap-1 text-xs">
              <p>Customer:</p>
              <p>Total Amount:</p>
              <p>Payment Method:</p>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <p className="font-medium text-foreground">{customerName}</p>
              <p className="font-semibold text-foreground">
                ₱{Number(order.total_amount).toLocaleString()}
              </p>
              <p className="font-medium text-foreground uppercase">{paymentMethod}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Items Summary
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs border-b border-border/50 pb-1.5 last:border-0">
                  <span className="font-medium text-foreground">{item.product_name}</span>
                  <span className="text-muted-foreground">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>


      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-end border-t border-border">
        {statusMutation.isPending ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Updating...
          </div>
        ) : (
          <>

            {statusKey === "pending" && (
              <>
                <button
                  onClick={() => handleStatusChange("confirmed")}
                  className="bg-foreground text-background hover:opacity-90 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all"
                >
                  Confirm Order
                </button>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <button className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all">
                      Cancel Order
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will change the status of Order #{order.order_number} to{" "}
                        <span className="font-semibold text-destructive">Cancelled</span>. This action cannot be easily undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Go Back</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("cancelled")}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, Cancel Order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {statusKey === "confirmed" && (
              <button
                onClick={() => handleStatusChange("preparing")}
                className="bg-foreground text-background hover:opacity-90 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all"
              >
                Mark as Preparing
              </button>
            )}

            {statusKey === "preparing" && (
              <button
                onClick={() => handleStatusChange("shipped")}
                className="bg-foreground text-background hover:opacity-90 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all"
              >
                Mark as Shipped
              </button>
            )}

            {statusKey === "shipped" && (
              <button
                onClick={() => handleStatusChange("completed")}
                className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all"
              >
                Mark as Complete
              </button>
            )}

            <Link
                href={`/admin/orders/${order.id}`}
                className="bg-muted text-foreground hover:bg-muted/80 rounded-md py-1.5 px-3 text-xs font-semibold cursor-pointer transition-all inline-block"
                >
                View Details
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
}