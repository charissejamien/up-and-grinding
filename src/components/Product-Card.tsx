"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCookieCart } from "@/app/context/CookieCartContext";

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stocks_available: number;
  status: string;
  image_url?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCookieCart();
  const [isAdded, setIsAdded] = useState(false);
  const productUrl = `/products/${product.id}`;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      quantity: 1,
      stocks_available: product.stocks_available,
      selected_options:
        product.category === "Artisanal Bean"
          ? { weight: "500g", profile: "Medium Roast", grinding: "Whole Beans" }
          : null,
    });

    if (onAddToCart) {
      onAddToCart(product);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4 w-full">
      <Link href={productUrl} className="flex flex-col gap-3 group cursor-pointer">
        {product.image_url ? (
          <div className="w-full aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}

        <div className="flex flex-col gap-1 text-left mt-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:underline">
              {product.name}
            </h3>
          </div>

          <p className="text-lg font-bold text-foreground">
            ₱{product.price.toLocaleString()}
          </p>

          <p className="text-xs text-muted-foreground">
            {product.stocks_available > 0
              ? `${product.stocks_available} available`
              : "Out of stock"}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <Link
          href={productUrl}
          className="flex-1 text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stocks_available <= 0 || isAdded}
          className={`p-2 rounded-md transition-all cursor-pointer ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-foreground text-background hover:opacity-90 disabled:opacity-40"
          }`}
          aria-label="Add to Cart"
        >
          {isAdded ? <Check size={16} className="animate-in zoom-in" /> : <ShoppingCart size={16} />}
        </button>
      </div>
    </div>
  );
}