"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchOrdersData() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      shipping_address,
      created_at,
      order_items (
        id,
        product_name,
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return orders || [];
}

export async function updateOrderStatus({
  orderId,
  newStatus,
}: {
  orderId: string;
  newStatus: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus.toLowerCase() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}