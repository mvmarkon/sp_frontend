import api from "./api"
import type { Category, CategoryFormData, ApiResponse } from "../types"

export const categoriesService = {
  async getCategories(params?: {
    page?: number
    search?: string
    is_active?: boolean
  }): Promise<ApiResponse<Category>> {
    const response = await api.get("/categories/", { params })
    return response.data
  },

  async getCategory(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}/`)
    return response.data
  },

  async createCategory(data: CategoryFormData): Promise<Category> {
    const response = await api.post("/categories/", data)
    return response.data
  },

  async updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category> {
    const response = await api.patch(`/categories/${id}/`, data)
    return response.data
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}/`)
  },
}
