"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRelatedProducts(productId: number | string) {
  const supabase = await createClient();

  const { data: currentProduct, error: currentError } = await supabase
    .from("products")
    .select("category")
    .eq("id", productId)
    .single();

  if (currentError || !currentProduct) {
    return [];
  }

  const { data: relatedProducts, error: relatedError } = await supabase
    .from("products")
    .select("*")
    .eq("category", currentProduct.category)
    .neq("id", productId)
    .limit(3);

  if (relatedError) {
    console.error("Error fetching related products:", relatedError);
    return [];
  }

  return relatedProducts;
}