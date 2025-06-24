"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { productsService } from "../services/products"
import { categoriesService } from "../services/categories"
import type { ProductFormData, Category } from "../types"
import toast from "react-hot-toast"

export function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      is_active: true,
      min_stock: 10,
    },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Cargar categorías
      const categoriesResponse = await categoriesService.getCategories()
      setCategories(categoriesResponse.results)

      // Si estamos editando, cargar el producto
      if (isEditing && id) {
        const product = await productsService.getProduct(Number(id))
        setValue("name", product.name)
        setValue("description", product.description)
        setValue("sku", product.sku)
        setValue("category_id", product.category.id)
        setValue("price", product.price)
        setValue("stock", product.stock)
        setValue("min_stock", product.min_stock)
        setValue("is_active", product.is_active)
      }
    } catch (error) {
      toast.error("Error al cargar los datos")
      navigate("/products")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && id) {
        await productsService.updateProduct(Number(id), data)
        toast.success("Producto actualizado correctamente")
      } else {
        await productsService.createProduct(data)
        toast.success("Producto creado correctamente")
      }

      navigate("/products")
    } catch (error) {
      toast.error("Error al guardar el producto")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Cargando formulario..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Editar Producto" : "Nuevo Producto"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información básica */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                  <Input
                    {...register("name", { required: "El nombre es requerido" })}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="Ingresa el nombre del producto"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <Input
                      {...register("sku", { required: "El SKU es requerido" })}
                      className={errors.sku ? "border-red-500" : ""}
                      placeholder="Código SKU"
                    />
                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                    <select
                      {...register("category_id", {
                        required: "La categoría es requerida",
                        valueAsNumber: true,
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category_id ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de inventario */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Inventario y Precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "El precio es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "El precio debe ser mayor a 0" },
                    })}
                    className={errors.price ? "border-red-500" : ""}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual *</label>
                  <Input
                    type="number"
                    {...register("stock", {
                      required: "El stock es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "El stock no puede ser negativo" },
                    })}
                    className={errors.stock ? "border-red-500" : ""}
                    placeholder="0"
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo *</label>
                  <Input
                    type="number"
                    {...register("min_stock", {
                      required: "El stock mínimo es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "El stock mínimo no puede ser negativo" },
                    })}
                    className={errors.min_stock ? "border-red-500" : ""}
                    placeholder="10"
                  />
                  {errors.min_stock && <p className="text-red-500 text-xs mt-1">{errors.min_stock.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Producto activo
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Imagen del producto */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Imagen del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <input type="file" accept="image/*" {...register("image")} className="hidden" id="image-upload" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Seleccionar Imagen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/products")} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loading size="sm" />
                <span className="ml-2">Guardando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Actualizar" : "Crear"} Producto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
