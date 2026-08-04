"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById } from "./actions";
import { updateOrderStatus } from "../actions";
import {
  Card,
  CardContent,
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
import { ArrowLeft, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  confirmed: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  preparing: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  shipped: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  completed: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-red-600 bg-red-500/10 border-red-500/20",
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ["admin-order-details", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order-details", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  if (isLoading) {
    return (
      <div className="w-full text-center py-20 text-muted-foreground flex justify-center items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading order details...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="w-full text-center py-20 text-destructive">
        Error loading order: {(error as Error)?.message || "Order not found."}
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusKey = order.status.toLowerCase();
  const address = order.shipping_address || {};

  const handleStatusChange = (newStatus: string) => {
    statusMutation.mutate({ orderId: order.id, newStatus });
  };

  return (
    <div className="my-12 w-[90%] lg:w-[70%] max-w-5xl mx-auto space-y-6">
      
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
        </div>

        <span
          className={`text-sm px-3 py-1 rounded-full border font-semibold capitalize ${
            statusColors[statusKey] || "text-gray-600 bg-gray-100"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 space-y-6">
          
            <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base font-bold">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {order.order_items.map((item: any) => {

                const imageUrl = item.products?.image_url || item.image_url;

                return (
                    <div
                    key={item.id}
                    className="flex items-center justify-between pb-3 border-b border-border/60 last:border-0 last:pb-0"
                    >
                    <div className="flex items-center gap-4">
                        {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-12 h-12 rounded-md object-cover border border-border"
                        />
                        ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center font-bold text-[10px] text-muted-foreground uppercase">
                            No Img
                        </div>
                        )}

                        <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            {item.product_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ₱{Number(item.unit_price).toLocaleString()}
                        </p>
                        </div>
                    </div>

                    <p className="font-semibold text-sm text-foreground">
                        ₱{Number(item.total_price || item.unit_price * item.quantity).toLocaleString()}
                    </p>
                    </div>
                );
                })}
            </CardContent>
            </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2 pb-4 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₱{Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>-₱{Number(order.discount_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>₱{Number(order.shipping_fee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border/50">
                  <span>Total Amount</span>
                  <span>₱{Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Payment Method</span>
                <span className="font-semibold text-foreground uppercase">
                  {order.payment_method || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base font-bold">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-foreground">
              <p className="font-semibold">{address.recipient_name || "Guest Customer"}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {address.street_address || "No address provided"}
              </p>
              <p className="text-xs text-muted-foreground">{address.email || "No email"}</p>
              <p className="text-xs text-muted-foreground">{address.phone || "No phone"}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base font-bold">Customer Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{order.notes || "No special instructions provided."}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base font-bold">Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {statusMutation.isPending ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating order status...
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {statusKey === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange("confirmed")}
                        className="w-full bg-foreground text-background hover:opacity-90 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all"
                      >
                        Confirm Order
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all">
                            Cancel Order
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will set Order #{order.order_number} to Cancelled.
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
                      className="w-full bg-foreground text-background hover:opacity-90 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all"
                    >
                      Mark as Preparing
                    </button>
                  )}

                  {statusKey === "preparing" && (
                    <button
                      onClick={() => handleStatusChange("shipped")}
                      className="w-full bg-foreground text-background hover:opacity-90 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all"
                    >
                      Mark as Shipped
                    </button>
                  )}

                  {statusKey === "shipped" && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all"
                    >
                      Mark as Complete
                    </button>
                  )}

                  {(statusKey === "completed" || statusKey === "cancelled") && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No further actions available for this order.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}