/**
 * Dashboard de Alertas (Tutor)
 * Sistema de gestión de alertas de riesgo estudiantil
 */

import { obtenerAlertas, obtenerEstadisticasAlertas } from '@/lib/alertas/actions'
import { ListaAlertas } from '@/components/alertas/lista-alertas'
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export default async function PaginaAlertas() {
  // Cargar alertas y estadísticas
  const [resultadoAlertas, resultadoEstadisticas] = await Promise.all([
    obtenerAlertas(),
    obtenerEstadisticasAlertas()
  ])

  const alertas = resultadoAlertas.exito ? resultadoAlertas.datos || [] : []
  const stats = resultadoEstadisticas.exito
    ? resultadoEstadisticas.datos
    : {
        total: 0,
        pendientes: 0,
        enProgreso: 0,
        resueltas: 0,
        porNivel: { alto: 0, medio: 0, bajo: 0 }
      }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Alertas
          </h1>
          <p className="text-gray-600">
            Gestiona las alertas de riesgo detectadas por el sistema de bienestar estudiantil
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de alertas */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Alertas</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-red-600">{stats?.pendientes || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* En Progreso */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Progreso</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.enProgreso || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Resueltas */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resueltas</p>
                <p className="text-3xl font-bold text-green-600">{stats?.resueltas || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Distribución por nivel de riesgo */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Nivel de Riesgo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-800">🔴 Alto Riesgo</span>
              <span className="text-2xl font-bold text-red-600">
                {stats?.porNivel?.alto || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">🟡 Riesgo Medio</span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats?.porNivel?.medio || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">🔵 Riesgo Bajo</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.porNivel?.bajo || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Alertas pendientes destacadas */}
        {stats && stats.pendientes > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">
                  Atención: Tienes {stats.pendientes} alerta(s) pendiente(s) de atender
                </p>
                <p className="text-sm text-red-700">
                  Por favor revisa y asigna las alertas para garantizar el bienestar estudiantil
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de alertas con filtros */}
        <ListaAlertas alertasIniciales={alertas} />
      </div>
    </div>
  )
}
