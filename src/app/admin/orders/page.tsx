"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersData } from "./actions";
import AdminOrderCard, { OrderData } from "@/components/Admin-Order-Card";

const categories = ["All", "Pending", "Confirmed", "Preparing", "Shipped", "Completed", "Cancelled"];

export default function AdminOrdersDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: orders = [], isLoading, isError, error } = useQuery<OrderData[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchOrdersData,
  });

  const getCount = (status: string) =>
    orders.filter((o) => o.status.toLowerCase() === status.toLowerCase()).length;

  const filteredOrders =
    selectedCategory === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === selectedCategory.toLowerCase());

  if (isLoading) {
    return <div className="w-[90%] max-w-7xl mx-auto my-12 text-center text-muted-foreground">Loading orders...</div>;
  }

  if (isError) {
    return <div className="w-[90%] max-w-7xl mx-auto my-12 text-center text-destructive">Error: {(error as Error).message}</div>;
  }

  return (
    <div className="w-[90%] max-w-7xl mx-auto my-8 space-y-6">
      
      {/* COUNTERS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-foreground text-background p-5 rounded-md flex-1">
          <h2>Pending Orders</h2>
          <p className="text-5xl font-bold mt-2">{getCount("pending")}</p>
        </div>

        <div className="p-5 rounded-md bg-card border border-border shadow-sm flex-1">
          <h2>Confirmed Orders</h2>
          <p className="text-5xl font-bold mt-2">{getCount("confirmed")}</p>
        </div>

        <div className="p-5 rounded-md bg-card border border-border shadow-sm flex-1">
          <h2>Preparing Orders</h2>
          <p className="text-5xl font-bold mt-2">{getCount("preparing")}</p>
        </div>

        <div className="p-5 rounded-md bg-card border border-border shadow-sm flex-1">
          <h2>Shipped Orders</h2>
          <p className="text-5xl font-bold mt-2">{getCount("shipped")}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === c
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {c} {c !== "All" && `(${getCount(c)})`}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No orders found for category &quot;{selectedCategory}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <AdminOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

    </div>
  );
}