"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { productsService } from "../services/products"
import { categoriesService } from "../services/categories"
import type { Product, Category } from "../types"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | "">("")
  const [statusFilter, setStatusFilter] = useState<boolean | "">("")
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    product: Product | null
  }>({ isOpen: false, product: null })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, selectedCategory, statusFilter])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsService.getProducts(),
        categoriesService.getCategories(),
      ])

      setProducts(productsResponse.results)
      setCategories(categoriesResponse.results)
    } catch (error) {
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const filterProducts = async () => {
    try {
      const params: any = {}

      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory
      if (statusFilter !== "") params.is_active = statusFilter

      const response = await productsService.getProducts(params)
      setProducts(response.results)
    } catch (error) {
      console.error("Error filtering products:", error)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteDialog.product) return

    try {
      await productsService.deleteProduct(deleteDialog.product.id)
      setProducts(products.filter((p) => p.id !== deleteDialog.product!.id))
      toast.success("Producto eliminado correctamente")
    } catch (error) {
      toast.error("Error al eliminar el producto")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Cargando productos..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : "")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter.toString()}
              onChange={(e) => setStatusFilter(e.target.value === "" ? "" : e.target.value === "true")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setStatusFilter("")
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.is_active ? "Activo" : "Inactivo"}
                  </span>

                  {product.stock <= product.min_stock && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" title="Stock bajo" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SKU:</span>
                  <span className="text-sm font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span
                    className={`text-sm font-medium ${
                      product.stock <= product.min_stock ? "text-amber-600" : "text-gray-900"
                    }`}
                  >
                    {product.stock} / {product.min_stock} mín.
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{formatDate(product.created_at)}</span>

                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm">
                    <Link to={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => setDeleteDialog({ isOpen: true, product })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory || statusFilter !== ""
              ? "No se encontraron productos con los filtros aplicados."
              : "Comienza agregando tu primer producto."}
          </p>
          <Button asChild>
            <Link to="/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Crear Producto
            </Link>
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producto"
        description={`¿Estás seguro de que deseas eliminar el producto "${deleteDialog.product?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
