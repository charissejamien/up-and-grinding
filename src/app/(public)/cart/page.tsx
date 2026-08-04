"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCookieCart } from "@/app/context/CookieCartContext";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getSubtotal } = useCookieCart();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading cart...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = cart.length > 0 ? 150 : 0;
  const totalAmount = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2 mb-8 max-w-md text-sm">
          Explore our coffee beans and equipment to start building your order.
        </p>
        <Link
          href="/#products"
          className="bg-foreground text-background font-medium py-3 px-8 rounded-md hover:bg-foreground/90 transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">
        Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="divide-y divide-border border-y border-border">
            {cart.map((item) => (
              <div key={item.cartItemId} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-muted rounded-lg overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                        <h2 className="text-base font-semibold text-foreground">
                          <Link href={`/products/${item.id}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h2>
                      </div>
                      
                      <p className="font-bold text-base text-foreground sm:hidden">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {item.selected_options && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.selected_options.weight && (
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            {item.selected_options.weight}
                          </span>
                        )}
                        {item.selected_options.profile && (
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            {item.selected_options.profile}
                          </span>
                        )}
                        {item.selected_options.grinding && (
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            {item.selected_options.grinding}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-md bg-background h-9">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center text-xs sm:text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        disabled={item.quantity >= item.stocks_available}
                        className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-md disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-xs text-destructive hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <p className="font-bold text-base text-foreground">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ₱{item.price.toLocaleString()} each
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-8">
                <h2 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
                Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">₱{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-foreground">₱{shippingFee.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center text-base font-bold text-foreground">
                    <span>Total Amount</span>
                    <span className="text-xl">₱{totalAmount.toLocaleString()}</span>
                </div>
                </div>

                <Link
                href="/checkout"
                className="mt-6 w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}