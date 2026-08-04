"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchOrderById(orderId: string) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_method,
      subtotal,
      shipping_fee,
      discount_amount,
      total_amount,
      notes,
      shipping_address,
      created_at,
      order_items (
        id,
        product_name,
        unit_price,
        quantity,
        total_price,
        products (
          image_url
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) throw new Error(error.message);

  return order;
}