export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface Category {
  id: number
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  sku: string
  category: Category
  price: number
  stock: number
  min_stock: number
  is_active: boolean
  image?: string
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  name: string
  description: string
  sku: string
  category_id: number
  price: number
  stock: number
  min_stock: number
  is_active: boolean
  image?: File
}

export interface CategoryFormData {
  name: string
  description: string
  is_active: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface ApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface DashboardStats {
  total_products: number
  total_categories: number
  low_stock_products: number
  total_value: number
}
