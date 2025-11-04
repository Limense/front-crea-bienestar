/**
 * Modal de detalle de alerta
 * Muestra información completa y permite tomar acciones
 */

'use client'

import { useState, useEffect } from 'react'
import { X, User, Calendar, MessageSquare, AlertTriangle, FileText, CheckCircle } from 'lucide-react'
import type { AlertaConRelaciones } from '@/lib/alertas/actions'
import {
  asignarAlerta,
  actualizarEstadoAlerta,
  obtenerConversacionAlerta
} from '@/lib/alertas/actions'

interface DetalleAlertaProps {
  alerta: AlertaConRelaciones
  onClose: () => void
  onActualizar: () => void
}

export function DetalleAlerta({ alerta, onClose, onActualizar }: DetalleAlertaProps) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversacion, setConversacion] = useState<any>(null)
  const [descripcionIntervencion, setDescripcionIntervencion] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Cargar conversación relacionada
  useEffect(() => {
    const cargarConversacion = async () => {
      const resultado = await obtenerConversacionAlerta(alerta.id)
      if (resultado.exito && resultado.datos) {
        setConversacion(resultado.datos)
      }
    }
    cargarConversacion()
  }, [alerta.id])

  // Asignar alerta a mí mismo
  const handleAsignarme = async () => {
    setCargando(true)
    setError(null)
    
    try {
      // TODO: Obtener ID del usuario actual (necesitamos auth context)
      const resultado = await asignarAlerta(alerta.id, 'usuario-actual-id')
      
      if (resultado.exito) {
        onActualizar()
        onClose()
      } else {
        setError(resultado.error || 'Error al asignar')
      }
    } catch (err) {
      setError('Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  // Actualizar estado
  const handleActualizarEstado = async (nuevoEstado: 'en_progreso' | 'resuelto') => {
    setCargando(true)
    setError(null)
    
    try {
      const resultado = await actualizarEstadoAlerta(
        alerta.id,
        nuevoEstado,
        descripcionIntervencion || undefined
      )
      
      if (resultado.exito) {
        onActualizar()
        onClose()
      } else {
        setError(resultado.error || 'Error al actualizar')
      }
    } catch (err) {
      setError('Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  // Color según nivel
  const colorNivel = {
    CRÍTICO: 'text-red-700 bg-red-100',
    ALTO: 'text-orange-700 bg-orange-100',
    MEDIO: 'text-yellow-700 bg-yellow-100',
    BAJO: 'text-blue-700 bg-blue-100'
  }[alerta.nivel_riesgo] || 'text-gray-700 bg-gray-100'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Alerta
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Nivel de riesgo y puntaje */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nivel de Riesgo</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorNivel}`}>
                {alerta.nivel_riesgo}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Puntaje</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerta.puntaje_riesgo}<span className="text-sm text-gray-500">/100</span>
              </p>
            </div>
          </div>

          {/* Información del estudiante */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Estudiante
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Nombre:</span>
                <span className="ml-2 font-medium">{alerta.estudiante.nombre_completo}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{alerta.estudiante.email}</span>
              </div>
              {alerta.estudiante.semestre && (
                <div>
                  <span className="text-gray-600">Semestre:</span>
                  <span className="ml-2 font-medium">{alerta.estudiante.semestre}°</span>
                </div>
              )}
            </div>
          </div>

          {/* Tipo de problema */}
          {alerta.tipo_problema && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Tipo de Problema</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {alerta.tipo_problema}
              </span>
            </div>
          )}

          {/* Fecha de detección */}
          <div>
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Detección
            </p>
            <p className="text-sm font-medium">
              {new Date(alerta.detectado_en).toLocaleString('es-PE', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </p>
          </div>

          {/* Estado actual */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Estado Actual</p>
            <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
              alerta.estado === 'pendiente'
                ? 'bg-red-100 text-red-800'
                : alerta.estado === 'en_progreso'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {alerta.estado === 'pendiente' ? '⏳ Pendiente' : 
               alerta.estado === 'en_progreso' ? '⚙️ En Progreso' : 
               '✅ Resuelto'}
            </span>
          </div>

          {/* Tutor asignado */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Tutor Asignado</p>
            {alerta.tutor_asignado ? (
              <p className="text-sm font-medium">{alerta.tutor_asignado.nombre_completo}</p>
            ) : (
              <p className="text-sm text-red-600 font-medium">Sin asignar</p>
            )}
          </div>

          {/* Conversación relacionada */}
          {conversacion && conversacion.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Últimos Mensajes del Estudiante
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {conversacion[0]?.mensajes?.slice(-5).map((mensaje: any) => (
                  <div
                    key={mensaje.id}
                    className={`p-3 rounded ${
                      mensaje.remitente === 'estudiante'
                        ? 'bg-blue-100 ml-4'
                        : 'bg-gray-200 mr-4'
                    }`}
                  >
                    <p className="text-xs text-gray-600 mb-1">
                      {mensaje.remitente === 'estudiante' ? 'Estudiante' : 'Bot'}
                    </p>
                    <p className="text-sm">{mensaje.contenido}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulario de intervención */}
          {mostrarFormulario && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Descripción de Intervención
              </h3>
              <textarea
                value={descripcionIntervencion}
                onChange={(e) => setDescripcionIntervencion(e.target.value)}
                placeholder="Describe las acciones tomadas..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">Acciones</p>
            
            {/* Si no está asignada */}
            {!alerta.tutor_asignado && alerta.estado === 'pendiente' && (
              <button
                onClick={handleAsignarme}
                disabled={cargando}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                Asignarme esta alerta
              </button>
            )}

            {/* Si está pendiente o en progreso */}
            {alerta.estado !== 'resuelto' && (
              <>
                {alerta.estado === 'pendiente' && alerta.tutor_asignado && (
                  <button
                    onClick={() => handleActualizarEstado('en_progreso')}
                    disabled={cargando}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
                  >
                    Marcar como En Progreso
                  </button>
                )}
                
                <button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {mostrarFormulario ? 'Ocultar' : 'Agregar'} Descripción de Intervención
                </button>
                
                <button
                  onClick={() => handleActualizarEstado('resuelto')}
                  disabled={cargando}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Resuelto
                </button>
              </>
            )}

            {/* Si ya está resuelta */}
            {alerta.estado === 'resuelto' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Esta alerta ya fue resuelta</p>
                {alerta.resuelto_en && (
                  <p className="text-sm text-green-600 mt-1">
                    {new Date(alerta.resuelto_en).toLocaleString('es-PE')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
