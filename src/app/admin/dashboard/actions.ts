"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchDashboardData() {

    const supabase = await createClient();

    const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

    const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_method, total_amount, shipping_address")
    .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const allOrders = orders || [];
    const totalSales = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const uniqueCustomers = new Set(
    allOrders.map((o) => o.shipping_address?.email).filter(Boolean)
    ).size;

    return {
    metrics: {
        totalProducts: productCount || 0,
        totalOrders: allOrders.length,
        totalSales,
        totalCustomers: uniqueCustomers,
    },
    pendingOrders: allOrders.filter((o) => o.status === "pending" || o.status === "processing"),
    completedOrders: allOrders.filter((o) => o.status === "delivered" || o.status === "shipped"),
    };
}

export async function updateOrderStatus({ orderId, newStatus }: { orderId: string; newStatus: string }) {

    const supabase = await createClient();
    
    const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select()
    .single();

    if (error) throw new Error(error.message);
    return data;
}