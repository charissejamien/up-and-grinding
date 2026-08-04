"server action";
"use server";

import { createClient } from "@/utils/supabase/server";
import { CookieCartItem } from "@/lib/cart-cookie";

export interface CheckoutFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  notes?: string;
}

export interface CreateOrderParams {
  formData: CheckoutFormData;
  cart: CookieCartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

function generateOrderNumber(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `UPG-${randomDigits}`;
}

export async function createGuestOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
  
    const supabase = await createClient();
    
    const { formData, cart, subtotal, shippingFee, totalAmount } = params;

  if (!cart || cart.length === 0) {
    return { success: false, error: "Cannot place order with an empty cart." };
  }

  const orderNumber = generateOrderNumber();

  try {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: null, // Guest order
        status: "pending",
        payment_status: "unpaid",
        payment_method: formData.paymentMethod,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        discount_amount: 0.0,
        total_amount: totalAmount,
        shipping_address: {
          recipient_name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          street_address: formData.address,
        },
        billing_address: {
          recipient_name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          street_address: formData.address,
        },
        notes: formData.notes || null,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItemsToInsert = cart.map((item) => ({
      order_id: orderData.id,
      product_id: typeof item.id === "number" ? item.id : parseInt(String(item.id), 10),
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      selected_options: item.selected_options || {},
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    return {
      success: true,
      orderNumber,
    };
  } catch (err: any) {
    console.error("Server Action Error [createGuestOrder]:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred while processing your order.",
    };
  }
}