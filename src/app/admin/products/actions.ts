"use server"

import { createClient } from "@/utils/supabase/server"

export async function SaveProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const category = formData.get("category") as string
  const stocksAvailable = Number(formData.get("stocksAvailable"))
  const status = formData.get("status") as string
  const image = formData.get("image") as File | null

  let imageUrl = ""

  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, image)

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)

    imageUrl = data.publicUrl
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      image_url: imageUrl,
      description,
      price,
      category,
      stocks_available: stocksAvailable,
      status,
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return { success: true, data }
}

export async function UpdateProduct(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const category = formData.get("category") as string
  const stocksAvailable = Number(formData.get("stocksAvailable"))
  const status = formData.get("status") as string
  const image = formData.get("image") as File | null

  const { data: currentProduct, error: fetchError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch existing product: ${fetchError.message}`)
  }

  let imageUrl = currentProduct?.image_url || ""

  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, image)

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)

    imageUrl = data.publicUrl
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      image_url: imageUrl,
      description,
      price,
      category,
      stocks_available: stocksAvailable,
      status,
    })
    .eq("id", id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return { success: true, data }
}

export async function DeleteProduct(id: string | number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true, data }
}

export async function GetProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function GetProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Categories
export interface Category {
  id: string;
  name: string;
  product_count?: number;
}

export async function GetCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (catError) throw new Error(catError.message);

  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category", cat.name);

      if (error) throw new Error(error.message);

      return {
        id: cat.id,
        name: cat.name,
        product_count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}


export async function SaveCategory(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function UpdateCategory(id: string, newName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update({ name: newName })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function DeleteCategory(categoryId: string) {
  const supabase = await createClient();

  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single();

  if (catError) throw new Error(catError.message);

  if (category) {

    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", category.name);

    if (countError) throw new Error(countError.message);

    if (count && count > 0) {
      throw new Error(
        `Cannot delete "${category.name}": ${count} product(s) are currently assigned to it.`
      );
    }
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw new Error(error.message);
  return true;
}
