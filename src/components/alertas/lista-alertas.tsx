/**
 * Lista de alertas con filtros
 * Componente principal para mostrar y filtrar alertas
 */

'use client'

import { useState, useEffect } from 'react'
import { TarjetaAlerta } from './tarjeta-alerta'
import { DetalleAlerta } from './detalle-alerta'
import { Filter, Search } from 'lucide-react'
import type { AlertaConRelaciones } from '@/lib/alertas/actions'
import { obtenerAlertas } from '@/lib/alertas/actions'

interface ListaAlertasProps {
  alertasIniciales: AlertaConRelaciones[]
}

type FiltroNivel = 'TODOS' | 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'
type FiltroEstado = 'TODOS' | 'pendiente' | 'en_progreso' | 'resuelto'
type FiltroAsignacion = 'TODOS' | 'sin_asignar' | 'asignadas'

export function ListaAlertas({ alertasIniciales }: ListaAlertasProps) {
  const [alertas, setAlertas] = useState<AlertaConRelaciones[]>(alertasIniciales)
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaConRelaciones | null>(null)
  const [cargando, setCargando] = useState(false)
  
  // Estados de filtros
  const [filtroNivel, setFiltroNivel] = useState<FiltroNivel>('TODOS')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('TODOS')
  const [filtroAsignacion, setFiltroAsignacion] = useState<FiltroAsignacion>('TODOS')
  const [busqueda, setBusqueda] = useState('')

  // Recargar alertas con filtros
  const recargarAlertas = async () => {
    setCargando(true)
    try {
      const filtros: {
        nivel_riesgo?: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'
        estado?: 'pendiente' | 'en_progreso' | 'resuelto'
        asignado_a?: string
      } = {}
      
      if (filtroNivel !== 'TODOS') {
        filtros.nivel_riesgo = filtroNivel as any
      }
      
      if (filtroEstado !== 'TODOS') {
        filtros.estado = filtroEstado as any
      }
      
      if (filtroAsignacion === 'sin_asignar') {
        filtros.asignado_a = 'sin_asignar'
      }
      
      const resultado = await obtenerAlertas(filtros)
      
      if (resultado.exito && resultado.datos) {
        setAlertas(resultado.datos)
      }
    } catch (error) {
      console.error('Error al recargar alertas:', error)
    } finally {
      setCargando(false)
    }
  }

  // Efecto para recargar cuando cambien los filtros
  useEffect(() => {
    recargarAlertas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroNivel, filtroEstado, filtroAsignacion])

  // Filtrar por búsqueda localmente
  const alertasFiltradas = alertas.filter(alerta => {
    if (!busqueda) return true
    
    const textosBusqueda = [
      alerta.estudiante.nombre_completo,
      alerta.estudiante.email,
      alerta.tipo_problema,
      alerta.nivel_riesgo
    ].filter(Boolean).join(' ').toLowerCase()
    
    return textosBusqueda.includes(busqueda.toLowerCase())
  })

  return (
    <>
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="col-span-1 md:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por nivel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Riesgo
            </label>
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value as FiltroNivel)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos</option>
              <option value="CRÍTICO">🔴 Crítico</option>
              <option value="ALTO">🟠 Alto</option>
              <option value="MEDIO">🟡 Medio</option>
              <option value="BAJO">🔵 Bajo</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="en_progreso">⚙️ En Progreso</option>
              <option value="resuelto">✅ Resuelto</option>
            </select>
          </div>

          {/* Filtro por asignación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asignación
            </label>
            <select
              value={filtroAsignacion}
              onChange={(e) => setFiltroAsignacion(e.target.value as FiltroAsignacion)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todas</option>
              <option value="sin_asignar">Sin asignar</option>
              <option value="asignadas">Asignadas</option>
            </select>
          </div>

          {/* Botón refrescar */}
          <div className="flex items-end">
            <button
              onClick={recargarAlertas}
              disabled={cargando}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {cargando ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{alertasFiltradas.length}</span> alerta(s)
        </p>
      </div>

      {/* Lista de alertas */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alertas...</p>
        </div>
      ) : alertasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">No se encontraron alertas con los filtros seleccionados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertasFiltradas.map((alerta) => (
            <TarjetaAlerta
              key={alerta.id}
              alerta={alerta}
              onClick={() => setAlertaSeleccionada(alerta)}
            />
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {alertaSeleccionada && (
        <DetalleAlerta
          alerta={alertaSeleccionada}
          onClose={() => setAlertaSeleccionada(null)}
          onActualizar={recargarAlertas}
        />
      )}
    </>
  )
}
