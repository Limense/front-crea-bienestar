'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { TarjetaCita } from '@/components/citas/tarjeta-cita'
import { FiltrosCitas as FiltrosCitasComponent } from '@/components/citas/filtros-citas'
import { Button } from '@/components/ui/button'
import { CitaConRelaciones, RolUsuario } from '@/types/database'
import { type FiltrosCitas } from '@/types/citas'
import { CitasErrorBoundary } from '@/components/error-boundary'
import Link from 'next/link'
import { Calendar, Plus } from 'lucide-react'
import { HandlersCitas } from './handlers-citas'

interface ListaCitasClientProps {
  citasIniciales: CitaConRelaciones[]
  rol: RolUsuario
}

export function ListaCitasClient({ citasIniciales, rol }: ListaCitasClientProps) {
  return (
    <CitasErrorBoundary>
      <ListaCitasContent citasIniciales={citasIniciales} rol={rol} />
    </CitasErrorBoundary>
  )
}

function ListaCitasContent({ citasIniciales, rol }: ListaCitasClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Construir filtros desde URL
  const filtros: FiltrosCitas = {
    estado: searchParams.get('estado') as FiltrosCitas['estado'],
    tipo: searchParams.get('tipo') as FiltrosCitas['tipo'],
    modalidad: searchParams.get('modalidad') as FiltrosCitas['modalidad'],
    buscar: searchParams.get('buscar') || undefined
  }
  
  // Filtrar citas client-side por búsqueda
  let citas = citasIniciales
  if (filtros.buscar && citas.length > 0) {
    const busqueda = filtros.buscar.toLowerCase()
    citas = citas.filter(cita => {
      if (rol === 'estudiante') {
        return cita.profesional?.nombre_completo.toLowerCase().includes(busqueda)
      } else {
        return cita.estudiante?.nombre_completo.toLowerCase().includes(busqueda)
      }
    })
  }
  
  // Función para cambiar filtros (actualiza URL)
  const handleCambiarFiltros = (nuevosFiltros: FiltrosCitas) => {
    const params = new URLSearchParams()
    
    if (nuevosFiltros.estado) params.set('estado', nuevosFiltros.estado as string)
    if (nuevosFiltros.tipo) params.set('tipo', nuevosFiltros.tipo)
    if (nuevosFiltros.modalidad) params.set('modalidad', nuevosFiltros.modalidad)
    if (nuevosFiltros.buscar) params.set('buscar', nuevosFiltros.buscar)
    
    router.push(`/citas?${params.toString()}`)
  }
  
  // Calcular contadores
  const contadores = {
    total: citas.length,
    pendiente: citas.filter(c => c.estado === 'pendiente').length,
    confirmada: citas.filter(c => c.estado === 'confirmada').length,
    completada: citas.filter(c => c.estado === 'completada').length,
    cancelada: citas.filter(c => c.estado === 'cancelada').length
  }
  
  // Separar citas futuras y pasadas
  const ahora = new Date()
  const citasFuturas = citas.filter(c => new Date(c.fecha_hora) >= ahora)
  const citasPasadas = citas.filter(c => new Date(c.fecha_hora) < ahora)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            {rol === 'estudiante' ? 'Mis Citas' : 'Citas Agendadas'}
          </h1>
          <p className="text-gray-600 mt-1">
            {rol === 'estudiante' 
              ? 'Gestiona tus citas de bienestar' 
              : 'Revisa y gestiona las citas de tus estudiantes'}
          </p>
        </div>
        
        {rol === 'estudiante' && (
          <Link href="/citas/nueva">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Agendar Cita
            </Button>
          </Link>
        )}
      </div>
      
      {/* Filtros */}
      <FiltrosCitasComponent
        filtros={filtros}
        onCambiarFiltros={handleCambiarFiltros}
        contadores={contadores}
      />
      
      {/* Lista de citas */}
      {citas.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filtros.estado || filtros.tipo || filtros.modalidad || filtros.buscar
              ? 'No se encontraron citas'
              : 'No tienes citas agendadas'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filtros.estado || filtros.tipo || filtros.modalidad || filtros.buscar
              ? 'Intenta ajustar los filtros de búsqueda'
              : rol === 'estudiante'
              ? 'Agenda tu primera cita para comenzar'
              : 'Aún no hay citas agendadas con estudiantes'}
          </p>
          {rol === 'estudiante' && !filtros.estado && (
            <Link href="/citas/nueva">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Agendar Cita
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Citas futuras */}
          {citasFuturas.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Próximas citas
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({citasFuturas.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {citasFuturas.map(cita => (
                  <HandlersCitas key={cita.id} cita={cita} rol={rol}>
                    <TarjetaCita cita={cita} mostrarAcciones={true} />
                  </HandlersCitas>
                ))}
              </div>
            </div>
          )}
          
          {/* Citas pasadas */}
          {citasPasadas.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Historial
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({citasPasadas.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {citasPasadas.map(cita => (
                  <HandlersCitas key={cita.id} cita={cita} rol={rol}>
                    <TarjetaCita cita={cita} mostrarAcciones={true} />
                  </HandlersCitas>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
