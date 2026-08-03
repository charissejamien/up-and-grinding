"use client";

import React, { createContext, useContext, useState } from "react";
import {
  CookieCartItem,
  getCartFromCookies,
  saveCartToCookies,
  clearCartCookie,
} from "@/lib/cart-cookie";

interface CookieCartContextType {
  cart: CookieCartItem[];
  addToCart: (item: Omit<CookieCartItem, "cartItemId">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const CookieCartContext = createContext<CookieCartContextType | undefined>(undefined);

export function CookieCartProvider({ children }: { children: React.ReactNode }) {

  const [cart, setCart] = useState<CookieCartItem[]>(() => {
    if (typeof window !== "undefined") {
      return getCartFromCookies();
    }
    return [];
  });

  const updateCartState = (newCart: CookieCartItem[]) => {
    setCart(newCart);
    saveCartToCookies(newCart);
  };

  const addToCart = (newItem: Omit<CookieCartItem, "cartItemId">) => {
    const optionsKey = newItem.selected_options
      ? `${newItem.selected_options.weight || ""}-${newItem.selected_options.profile || ""}-${newItem.selected_options.grinding || ""}`
      : "";
    const cartItemId = `${newItem.id}-${optionsKey}`;

    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

    let updatedCart: CookieCartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      const combinedQty = updatedCart[existingIndex].quantity + newItem.quantity;
      updatedCart[existingIndex].quantity = Math.min(
        combinedQty,
        newItem.stocks_available
      );
    } else {
      updatedCart = [...cart, { ...newItem, cartItemId }];
    }

    updateCartState(updatedCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    updateCartState(updatedCart);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity: Math.min(newQuantity, item.stocks_available),
        };
      }
      return item;
    });

    updateCartState(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    clearCartCookie();
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CookieCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
      }}
    >
      {children}
    </CookieCartContext.Provider>
  );
}

export function useCookieCart() {
  const context = useContext(CookieCartContext);
  if (!context) {
    throw new Error("useCookieCart must be used within a CookieCartProvider");
  }
  return context;
}