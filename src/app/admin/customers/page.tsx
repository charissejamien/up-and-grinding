"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCustomersData, Customer } from "./actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function CustomersPage() {
    
    const { data: customers = [], isLoading, isError, error } = useQuery<Customer[]>({ queryKey: ["admin-customers"], queryFn: fetchCustomersData,});

    const totalCustomers = customers.length;

    if (isLoading) {
    return (
        <div className="w-full text-center py-20 text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading customers...
        </div>
    );
    }

    if (isError) {
        return (
            <div className="w-full text-center py-20 text-destructive">
                Error loading customers: {(error as Error)?.message}
            </div>
        );
    }

    return (
    <div className="my-10 w-[92%] lg:w-[85%] max-w-7xl mx-auto space-y-6">
        
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
                Overview of customer accounts, order history, and total spending.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                        Total Customers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{totalCustomers}</p>
                </CardContent>
            </Card>
        </div>

        {/* Customers Table */}
        <Card>
            <CardContent className="p-0">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead className="text-center">Number of Orders</TableHead>
                    <TableHead className="text-right">Total Purchase Amount</TableHead>
                    <TableHead className="text-center">Account Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No customers found.
                        </TableCell>
                    </TableRow>
                    ) : (
                    customers.map((customer) => (
                        <TableRow key={customer.id}>
                        <TableCell className="font-semibold text-foreground">
                            {customer.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {customer.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {customer.phone}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                            {customer.total_orders}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            ₱{customer.total_spent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                            <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                                customer.status === "Active"
                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                                : "text-gray-500 bg-gray-500/10 border-gray-500/20"
                            }`}
                            >
                            {customer.status}
                            </span>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>
  );
}