"use client"

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/app/admin/products/actions";
import ProductCard, { Product } from "@/components/Product-Card";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const featuredProducts = products?.filter((p: Product) => p.status === "Active").slice(0, 3) ?? [];

  return (
    <div className="w-full min-h-screen">
      
      <div className="relative w-full min-h-[600px] sm:min-h-[700px] flex items-center text-white overflow-hidden py-16 sm:py-20">
        
        <Image 
          src="/promotional-bg.png" 
          alt="Promotional background" 
          fill 
          priority
          className="object-cover object-center -z-10"
        />

        <div className="absolute inset-0 bg-black/70 -z-10" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              THE MORNING RITUAL, REFINED.
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-white/90">
              Up Early. Brewed Bold.
            </p>
            <p className="text-base sm:text-lg text-white/70 tracking-wide leading-relaxed mt-1">
              From precision hand grinders to rare single-origin beans, we supply
              the fuel for big ideas and early mornings.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
              <Link 
                href="/products" 
                className="bg-white text-black hover:bg-white/90 text-center font-semibold py-3 px-6 rounded-md transition-colors"
              >
                Start Grinding
              </Link>
              <Link 
                href="/products" 
                className="border border-white/40 hover:bg-white/10 text-center text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Find Your Roast
              </Link>
            </div>
          </div>
        </div>

      </div>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Product Categories</h2>
        <p className="text-muted-foreground text-sm mt-1">Select your path to the perfect brew.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          <div className="bg-foreground text-background p-6 sm:p-10 pt-32 sm:pt-48 rounded-xl flex flex-col justify-end shadow-lg transition-transform hover:-translate-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold">Grinders & Gear</h3>
            <p className="text-background/70 text-sm mt-1 max-w-sm">
              Manual grinders, kettles, and precision scales for exact extraction.
            </p>
            <Link 
              href="/products" 
              className="inline-block w-fit bg-background text-foreground hover:opacity-90 text-xs sm:text-sm font-semibold py-2 px-4 rounded-md mt-4 transition-opacity"
            >
              Browse Products
            </Link>
          </div>

          <div className="bg-foreground text-background p-6 sm:p-10 pt-32 sm:pt-48 rounded-xl flex flex-col justify-end shadow-lg transition-transform hover:-translate-y-1">
            <h3 className="text-xl sm:text-2xl font-semibold">Artisanal Coffee Beans</h3>
            <p className="text-background/70 text-sm mt-1 max-w-sm">
              Single-origin beans sourced and freshly roasted to order.
            </p>
            <Link 
              href="/products" 
              className="inline-block w-fit bg-background text-foreground hover:opacity-90 text-xs sm:text-sm font-semibold py-2 px-4 rounded-md mt-4 transition-opacity"
            >
              Browse Products
            </Link>
          </div>

        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Handpicked favorites for the modern barista.</p>
          </div>
          <Link 
            href="/products" 
            className="text-xs sm:text-sm font-medium hover:underline whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading featured picks...
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No featured products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {featuredProducts.map((product: Product, index: number) => (
              <div 
                key={product.id} 
                className={index > 0 ? "hidden sm:block" : "block"}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={(p) => console.log("Added to cart:", p)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}