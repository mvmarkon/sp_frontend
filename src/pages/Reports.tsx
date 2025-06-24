"use client"

import { useEffect, useState } from "react"
import { Download, AlertTriangle, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { productsService } from "../services/products"
import type { Product } from "../types"
import { formatCurrency, formatDate, exportToCSV } from "@/lib/utils"
import toast from "react-hot-toast"

export function Reports() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    try {
      setIsLoading(true)
      const [lowStockResponse, allProductsResponse] = await Promise.all([
        productsService.getLowStockProducts(),
        productsService.getProducts(),
      ])

      setLowStockProducts(lowStockResponse)
      setAllProducts(allProductsResponse.results)
    } catch (error) {
      toast.error("Error al cargar los reportes")
    } finally {
      setIsLoading(false)
    }
  }

  const exportLowStockReport = () => {
    const data = lowStockProducts.map((product) => ({
      Nombre: product.name,
      SKU: product.sku,
      Categoría: product.category.name,
      "Stock Actual": product.stock,
      "Stock Mínimo": product.min_stock,
      Precio: product.price,
      Estado: product.is_active ? "Activo" : "Inactivo",
    }))

    exportToCSV(data, `productos-stock-bajo-${new Date().toISOString().split("T")[0]}.csv`)
    toast.success("Reporte exportado correctamente")
  }

  const exportAllProductsReport = () => {
    const data = allProducts.map((product) => ({
      Nombre: product.name,
      SKU: product.sku,
      Categoría: product.category.name,
      Stock: product.stock,
      "Stock Mínimo": product.min_stock,
      Precio: product.price,
      "Valor Total": product.price * product.stock,
      Estado: product.is_active ? "Activo" : "Inactivo",
      "Fecha Creación": formatDate(product.created_at),
    }))

    exportToCSV(data, `inventario-completo-${new Date().toISOString().split("T")[0]}.csv`)
    toast.success("Reporte exportado correctamente")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Cargando reportes..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <div className="text-sm text-gray-500">Generado el: {new Date().toLocaleString("es-CO")}</div>
      </div>

      {/* Resumen de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos con Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Requieren reposición</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProducts.length}</div>
            <p className="text-xs text-muted-foreground">En el inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total del Inventario</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(allProducts.reduce((sum, p) => sum + p.price * p.stock, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Valor total en stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Productos con stock bajo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Productos con Stock Bajo
          </CardTitle>
          <Button onClick={exportLowStockReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Producto</th>
                    <th className="text-left p-2">SKU</th>
                    <th className="text-left p-2">Categoría</th>
                    <th className="text-right p-2">Stock Actual</th>
                    <th className="text-right p-2">Stock Mínimo</th>
                    <th className="text-right p-2">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{product.name}</td>
                      <td className="p-2 text-gray-600">{product.sku}</td>
                      <td className="p-2">{product.category.name}</td>
                      <td className="p-2 text-right text-amber-600 font-medium">{product.stock}</td>
                      <td className="p-2 text-right">{product.min_stock}</td>
                      <td className="p-2 text-right">{formatCurrency(product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">¡Excelente! No hay productos con stock bajo</h3>
              <p className="text-gray-500">Todos los productos tienen stock suficiente según sus límites mínimos.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exportar inventario completo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventario Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Exportar Inventario Completo</h3>
              <p className="text-sm text-gray-600">Descarga un archivo CSV con todos los productos del inventario</p>
            </div>
            <Button onClick={exportAllProductsReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
