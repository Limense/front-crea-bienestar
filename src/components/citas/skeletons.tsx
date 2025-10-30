/**
 * Componentes de Loading Skeletons para el sistema de citas
 * Proporciona feedback visual profesional durante la carga de datos
 */

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

/**
 * Skeleton para tarjeta de cita individual
 */
export function TarjetaCitaSkeleton() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="h-12 w-12 rounded-full skeleton-shimmer" />
            <div className="space-y-2">
              {/* Nombre skeleton */}
              <div className="h-4 w-32 skeleton-shimmer rounded" />
              {/* Email skeleton */}
              <div className="h-3 w-24 skeleton-shimmer rounded" />
            </div>
          </div>
          {/* Badge skeleton */}
          <div className="h-6 w-20 skeleton-shimmer rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Separator />
        
        {/* Fecha y hora skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 skeleton-shimmer rounded" />
          <div className="h-4 w-48 skeleton-shimmer rounded" />
        </div>

        {/* Tipo skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 skeleton-shimmer rounded" />
          <div className="h-4 w-36 skeleton-shimmer rounded" />
        </div>

        {/* Modalidad skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 skeleton-shimmer rounded" />
          <div className="h-4 w-28 skeleton-shimmer rounded" />
        </div>

        {/* Motivo skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full skeleton-shimmer rounded" />
          <div className="h-3 w-3/4 skeleton-shimmer rounded" />
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {/* Botones skeleton */}
        <div className="h-9 w-24 skeleton-shimmer rounded-md" />
        <div className="h-9 w-24 skeleton-shimmer rounded-md" />
      </CardFooter>
    </Card>
  )
}

/**
 * Skeleton para lista completa de citas (2 columnas)
 */
export function ListaCitasSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TarjetaCitaSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton para el calendario mensual
 */
export function CalendarioSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        {/* Header con mes y navegación */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-6 skeleton-shimmer rounded" />
          <div className="h-6 w-32 skeleton-shimmer rounded" />
          <div className="h-6 w-6 skeleton-shimmer rounded" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 w-8 skeleton-shimmer rounded mx-auto" />
          ))}
        </div>

        {/* Días del mes (5 semanas) */}
        {Array.from({ length: 5 }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="h-10 w-10 skeleton-shimmer rounded-md mx-auto"
              />
            ))}
          </div>
        ))}

        {/* Leyenda */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 skeleton-shimmer rounded" />
            <div className="h-3 w-20 skeleton-shimmer rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 skeleton-shimmer rounded" />
            <div className="h-3 w-24 skeleton-shimmer rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton para slots de tiempo
 */
export function SlotsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="h-5 w-40 skeleton-shimmer rounded animate-pulse" />
      
      {/* Grid de slots */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-12 skeleton-shimmer rounded-md animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton para selector de profesional
 */
export function SelectorProfesionalSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full skeleton-shimmer" />
              
              <div className="flex-1 space-y-2">
                {/* Nombre */}
                <div className="h-4 w-40 skeleton-shimmer rounded" />
                {/* Especialidad */}
                <div className="h-3 w-32 skeleton-shimmer rounded" />
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-6 w-20 skeleton-shimmer rounded-full" />
                <div className="h-6 w-16 skeleton-shimmer rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Skeleton para filtros
 */
export function FiltrosSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 skeleton-shimmer rounded-md" />
          ))}
        </div>

        {/* Filtros adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 skeleton-shimmer rounded-md" />
          <div className="h-10 skeleton-shimmer rounded-md" />
          <div className="h-10 skeleton-shimmer rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton para header de página
 */
export function HeaderCitasSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="space-y-2">
        {/* Título */}
        <div className="h-8 w-48 skeleton-shimmer rounded" />
        {/* Descripción */}
        <div className="h-4 w-64 skeleton-shimmer rounded" />
      </div>
      
      {/* Botón */}
      <div className="h-10 w-32 skeleton-shimmer rounded-md" />
    </div>
  )
}

/**
 * Skeleton para wizard de agendamiento (paso completo)
 */
export function WizardPasoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Progress indicator */}
      <div className="flex justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="h-10 w-10 rounded-full skeleton-shimmer" />
            {i < 4 && <div className="h-0.5 w-16 skeleton-shimmer ml-2" />}
          </div>
        ))}
      </div>

      {/* Contenido del paso */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 skeleton-shimmer rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 skeleton-shimmer rounded-lg" />
          <div className="h-32 skeleton-shimmer rounded-lg" />
        </CardContent>
        <CardFooter className="gap-2 justify-between">
          <div className="h-10 w-24 skeleton-shimmer rounded-md" />
          <div className="h-10 w-24 skeleton-shimmer rounded-md" />
        </CardFooter>
      </Card>
    </div>
  )
}
