"use client"

import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/app/admin/products/actions";
import ProductCard, { Product } from "@/components/Product-Card";

export default function Products() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const activeProducts = products?.filter((p: Product) => p.status === "Active") ?? [];

  const espressoMachines = activeProducts.filter(
    (p: Product) => p.category === "Espresso Machine"
  );
  const artisanalBeans = activeProducts.filter(
    (p: Product) => p.category === "Artisanal Bean"
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-16 text-center text-muted-foreground">
        Loading catalog...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-16 text-center text-destructive">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-10 md:mt-16 mb-20">
      
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Explore artisanal coffee beans and premium espresso hardware.
        </p>
      </div>

      <section id="machines" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-6">Espresso Machines</h2>
        
        {espressoMachines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No espresso machines available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {espressoMachines.map((product: Product) => (
                <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={(p) => console.log("Added to cart:", p)}
                />
            ))}
        </div>
        )}
      </section>

      <section id="beans" className="mt-15 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-6">Artisanal Beans</h2>
        
        {artisanalBeans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No coffee beans available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artisanalBeans.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={(p) => console.log("Added to cart:", p)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );  
}