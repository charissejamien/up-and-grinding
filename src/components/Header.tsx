"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCookieCart } from "@/app/context/CookieCartContext";

export default function Header() {
  const { cart } = useCookieCart();

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="py-5 px-10 flex items-center justify-between xl:pr-30 border-b border-border">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={200} height={200} />
      </Link>

      <div className="flex gap-10 font-semibold text-foreground/90">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
      </div>

      <Link href="/cart" className="relative p-2 text-foreground hover:opacity-80 transition-opacity">
        <ShoppingCart className="w-6 h-6" />

        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </Link>
    </div>
  );
}