"use server";

import { createClient } from "@/utils/supabase/server";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  status: "Active" | "Inactive";
}

export async function fetchCustomersData(): Promise<Customer[]> {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, shipping_address, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const customerMap = new Map<string, Customer>();

  (orders || []).forEach((order) => {
    const address = order.shipping_address || {};
    const email = (address.email || "guest@checkout.local").toLowerCase().trim();
    const name = address.recipient_name || "Guest Customer";
    const phone = address.phone || "N/A";
    const amount = Number(order.total_amount) || 0;

    if (!customerMap.has(email)) {
      customerMap.set(email, {
        id: email,
        name,
        email,
        phone,
        total_orders: 1,
        total_spent: amount,
        last_order_date: order.created_at,
        status: "Active",
      });
    } else {
      const existing = customerMap.get(email)!;
      existing.total_orders += 1;
      existing.total_spent += amount;
      
      if (existing.phone === "N/A" && phone !== "N/A") existing.phone = phone;
      if (existing.name === "Guest Customer" && name !== "Guest Customer") existing.name = name;
    }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return Array.from(customerMap.values()).map((customer) => ({
    ...customer,
    status: new Date(customer.last_order_date) >= thirtyDaysAgo ? "Active" : "Inactive",
  }));
}