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