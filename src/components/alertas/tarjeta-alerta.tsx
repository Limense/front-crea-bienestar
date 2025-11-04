/**
 * Tarjeta de alerta individual
 * Muestra información resumida de una alerta de riesgo
 */

'use client'

import { AlertTriangle, Clock, User, Calendar } from 'lucide-react'
import type { AlertaConRelaciones } from '@/lib/alertas/actions'

interface TarjetaAlertaProps {
  alerta: AlertaConRelaciones
  onClick?: () => void
}

export function TarjetaAlerta({ alerta, onClick }: TarjetaAlertaProps) {
  // Determinar color según nivel de riesgo
  const colorNivel = {
    CRÍTICO: 'border-red-500 bg-red-50',
    ALTO: 'border-orange-500 bg-orange-50',
    MEDIO: 'border-yellow-500 bg-yellow-50',
    BAJO: 'border-blue-500 bg-blue-50'
  }[alerta.nivel_riesgo] || 'border-gray-300 bg-gray-50'

  const colorTexto = {
    CRÍTICO: 'text-red-700',
    ALTO: 'text-orange-700',
    MEDIO: 'text-yellow-700',
    BAJO: 'text-blue-700'
  }[alerta.nivel_riesgo] || 'text-gray-700'

  const colorBadge = {
    CRÍTICO: 'bg-red-100 text-red-800',
    ALTO: 'bg-orange-100 text-orange-800',
    MEDIO: 'bg-yellow-100 text-yellow-800',
    BAJO: 'bg-blue-100 text-blue-800'
  }[alerta.nivel_riesgo] || 'bg-gray-100 text-gray-800'

  // Formato de estado
  const estadoTexto = {
    pendiente: 'Pendiente',
    en_progreso: 'En Progreso',
    resuelto: 'Resuelto',
    cerrado: 'Cerrado'
  }[alerta.estado] || alerta.estado

  const estadoColor = {
    pendiente: 'bg-red-100 text-red-800',
    en_progreso: 'bg-yellow-100 text-yellow-800',
    resuelto: 'bg-green-100 text-green-800',
    cerrado: 'bg-gray-100 text-gray-800'
  }[alerta.estado] || 'bg-gray-100 text-gray-800'

  // Formatear fecha
  const fecha = new Date(alerta.detectado_en)
  const fechaFormateada = fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div
      className={`border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${colorNivel}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-5 w-5 ${colorTexto}`} />
          <span className={`text-sm font-semibold ${colorTexto}`}>
            {alerta.nivel_riesgo}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor}`}>
          {estadoTexto}
        </span>
      </div>

      {/* Información del estudiante */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            {alerta.estudiante.nombre_completo}
          </span>
        </div>
        {alerta.estudiante.semestre && (
          <p className="text-sm text-gray-600 ml-6">
            {alerta.estudiante.semestre}° Semestre
          </p>
        )}
      </div>

      {/* Tipo de problema */}
      {alerta.tipo_problema && (
        <div className="mb-3">
          <span className={`inline-block text-xs px-2 py-1 rounded ${colorBadge}`}>
            {alerta.tipo_problema}
          </span>
        </div>
      )}

      {/* Puntaje de riesgo */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Puntaje de Riesgo:</span>
          <span className={`font-bold ${colorTexto}`}>
            {alerta.puntaje_riesgo}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className={`h-2 rounded-full ${
              alerta.nivel_riesgo === 'CRÍTICO'
                ? 'bg-red-500'
                : alerta.nivel_riesgo === 'ALTO'
                ? 'bg-orange-500'
                : alerta.nivel_riesgo === 'MEDIO'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${alerta.puntaje_riesgo}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{fechaFormateada}</span>
        </div>
        {alerta.tutor_asignado ? (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{alerta.tutor_asignado.nombre_completo}</span>
          </div>
        ) : (
          <span className="text-red-500 font-medium">Sin asignar</span>
        )}
      </div>
    </div>
  )
}
