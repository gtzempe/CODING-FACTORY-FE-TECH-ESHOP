const API_URL: string = import.meta.env.VITE_API_URL

export type Product = {
  id: number
  product: string
  description: string
  category: string
  image: string
  price: number
  stock: number
}

export async function getAllProducts(): Promise<{ status: boolean; data: Product[] }> {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Failed to get all products')
  const data = await res.json()
  console.log(data)
  return data
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`)
  if (!res.ok) throw new Error('Failed to get product')
  const data = await res.json()
  console.log(data)
  return data.data
}