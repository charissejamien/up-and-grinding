"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { GetProductById } from "@/app/admin/products/actions"
import { getRelatedProducts } from "./actions"
import { useParams } from "next/navigation"
import ProductCard from "@/components/Product-Card"

export default function ProductView() {
    const params = useParams()
    const id = params?.id as string

    const { data: product, isLoading, error } = useQuery({
      queryKey: ["product", id],
      queryFn: () => GetProductById(id),
      enabled: !!id,
    })

    const { data: relatedProducts = [] } = useQuery({
      queryKey: ["related-products", id],
      queryFn: () => getRelatedProducts(id),
      enabled: !!id,
    })

    const weights = ["500g"]
    const profiles = ["Light Roast", "Medium Roast", "Dark Roast"]
    const grindings = ["Whole Beans", "French Press Grind", "Espresso Grind"]

    const [weight, setWeight] = useState("500g")
    const [profile, setProfile] = useState("Dark Roast")
    const [grinding, setGrinding] = useState("Whole Beans")

    const [quantity, setQuantity] = useState(1)

    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
    const increaseQuantity = () => setQuantity((prev) => (prev < (product?.stocks_available ?? 1) ? prev + 1 : prev))

    if (isLoading) {
      return (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-20 text-center text-muted-foreground">
          Loading product details...
        </div>
      )
    }

    if (error || !product) {
      return (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-20 text-center text-destructive">
          Product not found.
        </div>
      )
    }

    const isBean = product.category === "Artisanal Bean"

    return (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-6 md:mt-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            <div className="w-full lg:sticky lg:top-8">
              <div className="w-full aspect-square bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border shadow-sm">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">No image available</span>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between h-full">
                <div>

                  <span className="inline-block text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground mb-3">
                    {product.category}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {product.name}
                  </h1>
                  
                  <p className="text-2xl sm:text-3xl font-bold mt-3 text-foreground">
                    ₱{product.price?.toLocaleString()}
                  </p>

                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {product.stocks_available > 0 ? `${product.stocks_available} in stock` : "Out of Stock"}
                  </p>

                  {product.description && (
                    <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                        <p className="text-base text-foreground/80 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                  )}
                  
                  {isBean && (
                    <div className="flex flex-col gap-6 mt-6 pt-6 border-t border-border">
                        <div>
                            <h3 className="font-semibold mb-2 text-xs tracking-wider uppercase text-muted-foreground">WEIGHT</h3>
                            <div className="flex flex-wrap gap-2">
                              {weights.map((w) => (
                                  <button 
                                      key={w}
                                      type="button"
                                      onClick={() => setWeight(w)} 
                                      className={`border rounded-md px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-colors 
                                          ${weight === w 
                                              ? "bg-foreground text-background border-foreground" 
                                              : "bg-transparent text-foreground border-border hover:bg-muted"
                                      }`}
                                  >
                                      {w}
                                  </button>
                              ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-xs tracking-wider uppercase text-muted-foreground">ROAST PROFILE</h3>
                            <div className="flex flex-wrap gap-2">
                              {profiles.map((p) => (
                                  <button 
                                      key={p}
                                      type="button"
                                      onClick={() => setProfile(p)} 
                                      className={`border rounded-md px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-colors 
                                          ${profile === p 
                                              ? "bg-foreground text-background border-foreground" 
                                              : "bg-transparent text-foreground border-border hover:bg-muted"
                                      }`}
                                  >
                                      {p}
                                  </button>
                              ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-xs tracking-wider uppercase text-muted-foreground">GRINDING</h3>
                            <div className="flex flex-wrap gap-2">
                              {grindings.map((g) => (
                                  <button 
                                      key={g}
                                      type="button"
                                      onClick={() => setGrinding(g)} 
                                      className={`border rounded-md px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-colors 
                                          ${grinding === g 
                                              ? "bg-foreground text-background border-foreground" 
                                              : "bg-transparent text-foreground border-border hover:bg-muted"
                                      }`}
                                  >
                                      {g}
                                  </button>
                              ))}
                            </div>
                        </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    
                    <div className="flex items-center justify-between border border-border rounded-md w-full sm:w-36 h-12 px-3 bg-background">
                        <button 
                            type="button"
                            onClick={decreaseQuantity}
                            className="w-8 h-8 flex items-center justify-center text-xl font-medium hover:bg-muted rounded cursor-pointer transition-colors"
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="font-semibold text-base sm:text-lg">{quantity}</span>
                        <button 
                            type="button"
                            onClick={increaseQuantity}
                            className="w-8 h-8 flex items-center justify-center text-xl font-medium hover:bg-muted rounded cursor-pointer transition-colors"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button 
                        type="button"
                        disabled={product.stocks_available <= 0}
                        onClick={() => {
                          console.log("Added to cart:", {
                            product,
                            quantity,
                            options: isBean ? { weight, profile, grinding } : null
                          })
                        }}
                        className="flex-1 h-12 bg-foreground hover:bg-foreground/90 disabled:opacity-40 text-background font-medium rounded-md px-6 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                    >
                        {product.stocks_available > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                </div>
                
            </div>
          </div>
          
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  You Might Also Like
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedProducts.slice(0, 3).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}

        </div>
    )
}