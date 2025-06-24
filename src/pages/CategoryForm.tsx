"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { categoriesService } from "../services/categories"
import type { CategoryFormData } from "../types"
import toast from "react-hot-toast"

export function CategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormData>({
    defaultValues: {
      is_active: true,
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      loadCategory()
    }
  }, [isEditing, id])

  const loadCategory = async () => {
    try {
      setIsLoading(true)
      const category = await categoriesService.getCategory(Number(id))
      setValue("name", category.name)
      setValue("description", category.description)
      setValue("is_active", category.is_active)
    } catch (error) {
      toast.error("Error al cargar la categoría")
      navigate("/categories")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && id) {
        await categoriesService.updateCategory(Number(id), data)
        toast.success("Categoría actualizada correctamente")
      } else {
        await categoriesService.createCategory(data)
        toast.success("Categoría creada correctamente")
      }

      navigate("/categories")
    } catch (error) {
      toast.error("Error al guardar la categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Cargando categoría..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/categories")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Editar Categoría" : "Nueva Categoría"}</h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría *</label>
                <Input
                  {...register("name", { required: "El nombre es requerido" })}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Ingresa el nombre de la categoría"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción de la categoría (opcional)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register("is_active")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Categoría activa
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/categories")} disabled={isSubmitting}>
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
                      {isEditing ? "Actualizar" : "Crear"} Categoría
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
