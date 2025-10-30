'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SlotDisponible } from '@/types/citas'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

interface CalendarioProps {
  profesionalId?: string // Opcional, para futuras expansiones
  fechaSeleccionada?: Date
  slotSeleccionado?: SlotDisponible
  onSeleccionarFecha: (fecha: Date) => void
  onSeleccionarSlot: (slot: SlotDisponible) => void
  diasDisponibles: Date[] // Días que el profesional atiende
  slots: SlotDisponible[] // Slots del día seleccionado
  cargandoDias?: boolean
  cargandoSlots?: boolean
}

export function Calendario({
  fechaSeleccionada,
  slotSeleccionado,
  onSeleccionarFecha,
  onSeleccionarSlot,
  diasDisponibles,
  slots,
  cargandoDias = false,
  cargandoSlots = false
}: CalendarioProps) {
  const [mesActual, setMesActual] = useState(new Date())
  
  // Generar días del calendario (incluyendo días de meses adyacentes para completar semanas)
  const inicioMes = startOfMonth(mesActual)
  const finMes = endOfMonth(mesActual)
  const inicioCalendario = startOfWeek(inicioMes, { weekStartsOn: 0 }) // Domingo
  const finCalendario = endOfWeek(finMes, { weekStartsOn: 0 })
  
  const diasCalendario = eachDayOfInterval({
    start: inicioCalendario,
    end: finCalendario
  })
  
  // Verificar si un día está disponible
  const esDiaDisponible = (dia: Date): boolean => {
    return diasDisponibles.some(d => isSameDay(d, dia))
  }
  
  // Navegación de mes
  const mesAnterior = () => setMesActual(subMonths(mesActual, 1))
  const mesSiguiente = () => setMesActual(addMonths(mesActual, 1))
  
  // Obtener clase CSS para un día
  const obtenerClaseDia = (dia: Date): string => {
    const clases: string[] = ['h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer']
    
    // Día del mes actual
    if (!isSameMonth(dia, mesActual)) {
      clases.push('text-gray-300 cursor-not-allowed')
      return clases.join(' ')
    }
    
    // Día pasado
    if (dia < new Date() && !isToday(dia)) {
      clases.push('text-gray-300 cursor-not-allowed')
      return clases.join(' ')
    }
    
    // Día seleccionado
    if (fechaSeleccionada && isSameDay(dia, fechaSeleccionada)) {
      clases.push('bg-blue-600 text-white shadow-md')
      return clases.join(' ')
    }
    
    // Día disponible
    if (esDiaDisponible(dia)) {
      clases.push('bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200')
      return clases.join(' ')
    }
    
    // Hoy
    if (isToday(dia)) {
      clases.push('border-2 border-blue-400 text-blue-600 hover:bg-blue-50')
      return clases.join(' ')
    }
    
    // Día sin disponibilidad
    clases.push('text-gray-400 cursor-not-allowed')
    return clases.join(' ')
  }
  
  // Manejar clic en día
  const handleClickDia = (dia: Date) => {
    // Solo permitir clic en días del mes actual, futuros y disponibles
    if (!isSameMonth(dia, mesActual)) return
    if (dia < new Date() && !isToday(dia)) return
    if (!esDiaDisponible(dia)) return
    
    onSeleccionarFecha(dia)
  }
  
  // Obtener clase para slot
  const obtenerClaseSlot = (slot: SlotDisponible): string => {
    const clases: string[] = ['px-3 py-2 rounded-lg text-sm font-medium transition-all']
    
    if (!slot.disponible) {
      clases.push('bg-gray-100 text-gray-400 cursor-not-allowed')
      return clases.join(' ')
    }
    
    if (slotSeleccionado && isSameDay(slot.fecha_hora, slotSeleccionado.fecha_hora) && slot.hora === slotSeleccionado.hora) {
      clases.push('bg-blue-600 text-white shadow-md')
      return clases.join(' ')
    }
    
    clases.push('bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 cursor-pointer')
    return clases.join(' ')
  }
  
  return (
    <div className="space-y-4">
      {/* Calendario mensual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={mesAnterior}
              disabled={cargandoDias}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(mesActual, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={mesSiguiente}
              disabled={cargandoDias}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {cargandoDias ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div>
              {/* Encabezados de días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                  <div key={dia} className="h-10 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {dia}
                  </div>
                ))}
              </div>
              
              {/* Grid de días */}
              <div className="grid grid-cols-7 gap-1">
                {diasCalendario.map((dia, index) => (
                  <div
                    key={index}
                    className={obtenerClaseDia(dia)}
                    onClick={() => handleClickDia(dia)}
                  >
                    {format(dia, 'd')}
                  </div>
                ))}
              </div>
              
              {/* Leyenda */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-blue-50 border border-blue-200"></div>
                  <span className="text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-blue-600"></div>
                  <span className="text-gray-600">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-100"></div>
                  <span className="text-gray-600">No disponible</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Slots de horario */}
      {fechaSeleccionada && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios disponibles - {format(fechaSeleccionada, "EEEE, d 'de' MMMM", { locale: es })}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {cargandoSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No hay horarios disponibles para este día</p>
                <p className="text-sm text-gray-400">Selecciona otra fecha</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      className={obtenerClaseSlot(slot)}
                      onClick={() => slot.disponible && onSeleccionarSlot(slot)}
                      disabled={!slot.disponible}
                      title={slot.motivo_no_disponible}
                    >
                      {slot.hora}
                    </button>
                  ))}
                </div>
                
                {/* Resumen de disponibilidad */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {slots.filter(s => s.disponible).length} disponibles
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                      {slots.filter(s => !s.disponible).length} ocupados
                    </Badge>
                  </div>
                  
                  {slotSeleccionado && (
                    <div className="text-blue-600 font-medium">
                      Seleccionado: {slotSeleccionado.hora}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
