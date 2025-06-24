import api from "./api"
import type { Product, ProductFormData, ApiResponse } from "../types"

export const productsService = {
  async getProducts(params?: {
    page?: number
    search?: string
    category?: number
    is_active?: boolean
  }): Promise<ApiResponse<Product>> {
    const response = await api.get("/products/", { params })
    return response.data
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}/`)
    return response.data
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    const response = await api.post("/products/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    const response = await api.patch(`/products/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}/`)
  },

  async getLowStockProducts(): Promise<Product[]> {
    const response = await api.get("/products/low-stock/")
    return response.data
  },
}
