"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardData, updateOrderStatus } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboardData,
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  if (isLoading) {
    return <div className="w-full text-center py-20 text-muted-foreground">Loading dashboard...</div>;
  }

  if (isError) {
    return <div className="w-full text-center py-20 text-destructive">Error: {(error as Error).message}</div>;
  }

  const { metrics, pendingOrders, completedOrders } = data!;

  return (
    <div className="w-[85%] max-w-7xl mx-auto my-12 flex flex-col gap-10">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-foreground text-background p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium opacity-80">Total Products</h2>
          <p className="text-4xl font-bold mt-2">{metrics.totalProducts}</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Total Orders</h2>
          <p className="text-4xl font-bold text-foreground mt-2">{metrics.totalOrders}</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Total Sales</h2>
          <p className="text-4xl font-bold text-foreground mt-2">
            ₱{metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Total Customers</h2>
          <p className="text-4xl font-bold text-foreground mt-2">{metrics.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-foreground">Pending Orders ({pendingOrders.length})</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No pending orders
                  </TableCell>
                </TableRow>
              ) : (
                pendingOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.order_number}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell className="uppercase">{order.payment_method}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₱{Number(order.total_amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() =>
                          statusMutation.mutate({ orderId: order.id, newStatus: "delivered" })
                        }
                        disabled={statusMutation.isPending}
                        className="text-xs bg-foreground text-background px-2.5 py-1 rounded hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        Complete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-foreground">Completed Orders ({completedOrders.length})</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No completed orders
                  </TableCell>
                </TableRow>
              ) : (
                completedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.order_number}</TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell className="uppercase">{order.payment_method}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₱{Number(order.total_amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>

    </div>
  );
}