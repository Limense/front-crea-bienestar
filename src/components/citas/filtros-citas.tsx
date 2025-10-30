'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type FiltrosCitas } from '@/types/citas'
import { TipoCita, ModalidadCita, EstadoCita } from '@/types/database'
import { Search, Filter } from 'lucide-react'

interface FiltrosCitasProps {
  filtros: FiltrosCitas
  onCambiarFiltros: (filtros: FiltrosCitas) => void
  contadores?: {
    total: number
    pendiente: number
    confirmada: number
    completada: number
    cancelada: number
  }
}

export function FiltrosCitas({
  filtros,
  onCambiarFiltros,
  contadores
}: FiltrosCitasProps) {
  
  const actualizarFiltro = <K extends keyof FiltrosCitas>(
    campo: K,
    valor: FiltrosCitas[K]
  ) => {
    onCambiarFiltros({
      ...filtros,
      [campo]: valor
    })
  }
  
  // Función para establecer estado (puede ser un solo valor o array)
  const establecerEstado = (estado: string) => {
    if (estado === 'todas') {
      actualizarFiltro('estado', undefined)
    } else {
      actualizarFiltro('estado', estado as EstadoCita)
    }
  }
  
  // Obtener el estado actual como string
  const estadoActual = (): string => {
    if (!filtros.estado) return 'todas'
    if (Array.isArray(filtros.estado)) return filtros.estado[0]
    return filtros.estado
  }
  
  return (
    <div className="space-y-4">
      {/* Tabs de estado */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => establecerEstado('todas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !filtros.estado
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
          {contadores && (
            <Badge className="ml-2 bg-white/20 text-white border-0">
              {contadores.total}
            </Badge>
          )}
        </button>
        
        <button
          onClick={() => establecerEstado('pendiente')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            estadoActual() === 'pendiente'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
          }`}
        >
          Pendientes
          {contadores && contadores.pendiente > 0 && (
            <Badge className="ml-2 bg-yellow-700 text-white border-0">
              {contadores.pendiente}
            </Badge>
          )}
        </button>
        
        <button
          onClick={() => establecerEstado('confirmada')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            estadoActual() === 'confirmada'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          Confirmadas
          {contadores && contadores.confirmada > 0 && (
            <Badge className="ml-2 bg-blue-700 text-white border-0">
              {contadores.confirmada}
            </Badge>
          )}
        </button>
        
        <button
          onClick={() => establecerEstado('completada')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            estadoActual() === 'completada'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
          }`}
        >
          Completadas
          {contadores && contadores.completada > 0 && (
            <Badge className="ml-2 bg-green-700 text-white border-0">
              {contadores.completada}
            </Badge>
          )}
        </button>
        
        <button
          onClick={() => establecerEstado('cancelada')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            estadoActual() === 'cancelada'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          }`}
        >
          Canceladas
          {contadores && contadores.cancelada > 0 && (
            <Badge className="ml-2 bg-red-700 text-white border-0">
              {contadores.cancelada}
            </Badge>
          )}
        </button>
      </div>
      
      {/* Filtros adicionales */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-700">Filtros adicionales</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda por nombre */}
            <div className="space-y-2">
              <Label htmlFor="buscar" className="text-sm">
                Buscar por nombre
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="buscar"
                  type="text"
                  placeholder="Nombre del profesional..."
                  value={filtros.buscar || ''}
                  onChange={(e) => actualizarFiltro('buscar', e.target.value || undefined)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Tipo de cita */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm">
                Tipo de cita
              </Label>
              <Select
                value={filtros.tipo || 'todas'}
                onValueChange={(valor) => 
                  actualizarFiltro('tipo', valor === 'todas' ? undefined : valor as TipoCita)
                }
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los tipos</SelectItem>
                  <SelectItem value="psicologia">🧠 Psicología</SelectItem>
                  <SelectItem value="medicina_ocupacional">⚕️ Medicina Ocupacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Modalidad */}
            <div className="space-y-2">
              <Label htmlFor="modalidad" className="text-sm">
                Modalidad
              </Label>
              <Select
                value={filtros.modalidad || 'todas'}
                onValueChange={(valor) => 
                  actualizarFiltro('modalidad', valor === 'todas' ? undefined : valor as ModalidadCita)
                }
              >
                <SelectTrigger id="modalidad">
                  <SelectValue placeholder="Todas las modalidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las modalidades</SelectItem>
                  <SelectItem value="presencial">🏢 Presencial</SelectItem>
                  <SelectItem value="virtual">💻 Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Botón limpiar filtros */}
          {(filtros.buscar || filtros.tipo || filtros.modalidad) && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => onCambiarFiltros({ estado: filtros.estado })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros adicionales
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
