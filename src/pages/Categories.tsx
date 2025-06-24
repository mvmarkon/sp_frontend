"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { categoriesService } from "../services/categories"
import type { Category } from "../types"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    category: Category | null
  }>({ isOpen: false, category: null })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoriesService.getCategories()
      setCategories(response.results)
    } catch (error) {
      toast.error("Error al cargar las categorías")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deleteDialog.category) return

    try {
      await categoriesService.deleteCategory(deleteDialog.category.id)
      setCategories(categories.filter((c) => c.id !== deleteDialog.category!.id))
      toast.success("Categoría eliminada correctamente")
    } catch (error) {
      toast.error("Error al eliminar la categoría")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Cargando categorías..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <Button asChild>
          <Link to="/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{category.description || "Sin descripción"}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{formatDate(category.created_at)}</span>

                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => setDeleteDialog({ isOpen: true, category })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
          <p className="text-gray-500 mb-4">Comienza creando tu primera categoría para organizar tus productos.</p>
          <Button asChild>
            <Link to="/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Crear Categoría
            </Link>
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, category: null })}
        onConfirm={handleDeleteCategory}
        title="Eliminar Categoría"
        description={`¿Estás seguro de que deseas eliminar la categoría "${deleteDialog.category?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
