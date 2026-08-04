"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShieldCheck, Truck, CreditCard, Loader2 } from "lucide-react";
import { useCookieCart } from "@/app/context/CookieCartContext";
import { CookieCartItem } from "@/lib/cart-cookie";
import { createGuestOrder } from "./actions";

interface CompletedOrder {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  notes: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  items: CookieCartItem[];
  date: string;
}

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CheckoutPage() {
  const { cart, getSubtotal, clearCart } = useCookieCart();
  const isMounted = useIsMounted();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
    notes: "",
  });

  if (!isMounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = cart.length > 0 ? 150 : 0;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await createGuestOrder({
      formData,
      cart,
      subtotal,
      shippingFee,
      totalAmount,
    });

    if (!result.success || !result.orderNumber) {
      setErrorMessage(result.error || "Failed to place order. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setCompletedOrder({
      orderNumber: result.orderNumber,
      ...formData,
      subtotal,
      shippingFee,
      totalAmount,
      items: [...cart],
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });

    clearCart();
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted && completedOrder) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Thank you for your order!
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          We&apos;ve logged your order in our system and sent a confirmation email to{" "}
          <span className="font-semibold text-foreground">{completedOrder.email}</span>.
        </p>

        <div className="mt-6 inline-block bg-muted px-6 py-3 rounded-lg border border-border">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
            Order Reference Number
          </span>
          <span className="text-2xl font-extrabold text-foreground tracking-wider">
            #{completedOrder.orderNumber}
          </span>
        </div>

        <div className="mt-8 text-left bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="font-bold text-base text-foreground">Order Details</h2>
            <span className="text-xs text-muted-foreground">{completedOrder.date}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Customer Name</p>
              <p className="font-medium text-foreground">{completedOrder.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Contact Phone</p>
              <p className="font-medium text-foreground">{completedOrder.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground uppercase font-medium">Delivery Address</p>
              <p className="font-medium text-foreground">{completedOrder.address}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Payment Option</p>
              <p className="font-medium text-foreground uppercase">{completedOrder.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Total Amount</p>
              <p className="font-bold text-foreground">₱{completedOrder.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Items Purchased
            </p>
            <div className="space-y-3">
              {completedOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    {item.selected_options && (
                      <p className="text-xs text-muted-foreground">
                        {[
                          item.selected_options.weight,
                          item.selected_options.profile,
                          item.selected_options.grinding,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-foreground text-background font-medium py-3 px-8 rounded-md hover:bg-foreground/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block bg-foreground text-background py-2.5 px-6 rounded-md text-sm font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Checkout</h1>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Truck className="w-5 h-5 text-foreground" />
              <h2 className="text-lg font-bold text-foreground">1. Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Delivery Address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <CreditCard className="w-5 h-5 text-foreground" />
              <h2 className="text-lg font-bold text-foreground">2. Payment Option</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: "cod", label: "Cash on Delivery (COD)"},
                { id: "e-wallet", label: "E-Wallet (GCash / Maya)"},
                { id: "bank-transfer", label: "Direct Bank Transfer"},
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.paymentMethod === method.id ? "border-foreground bg-muted/40" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{method.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-2 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">3. Special Instructions (Optional)</h2>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-8 space-y-4">
            <h2 className="text-lg font-bold text-foreground pb-3 border-b border-border">Order Summary</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 border-b border-border pb-4 divide-y divide-border/50">
              {cart.map((item) => (
                <div key={item.cartItemId} className="pt-2 first:pt-0 flex justify-between items-start text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee</span>
                <span>₱{shippingFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-xl">₱{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-foreground hover:bg-foreground/90 disabled:opacity-50 text-background font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}