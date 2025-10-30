/**
 * Versión client-side de las funciones de disponibilidad
 * Estas funciones usan crearClienteNavegador() para ser usadas desde Client Components
 */

import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { SlotDisponible, HorarioDisponibilidad } from '@/types/citas'
import { 
  generarSlots, 
  obtenerDiaSemana, 
  formatearHora,
  rangosSeSolapan,
  esFutura 
} from './horarios'
import { addMinutes } from 'date-fns'

/**
 * Calcula los slots disponibles para un profesional en una fecha específica (versión client)
 * @param profesionalId - ID del profesional
 * @param fecha - Fecha para verificar disponibilidad
 * @returns Array de slots disponibles con información de disponibilidad
 */
export async function calcularSlotsDisponibles(
  profesionalId: string,
  fecha: Date
): Promise<SlotDisponible[]> {
  const supabase = crearClienteNavegador()
  
  // 1. Obtener horarios de disponibilidad del profesional para el día de la semana
  const diaSemana = obtenerDiaSemana(fecha)
  
  const { data: horarios, error: errorHorarios } = await supabase
    .from('horarios_disponibilidad')
    .select('*')
    .eq('profesional_id', profesionalId)
    .eq('dia_semana', diaSemana)
    .eq('activo', true)
  
  if (errorHorarios || !horarios || horarios.length === 0) {
    return []
  }
  
  // 2. Obtener citas existentes del profesional para esa fecha
  const inicioDia = new Date(fecha)
  inicioDia.setHours(0, 0, 0, 0)
  
  const finDia = new Date(fecha)
  finDia.setHours(23, 59, 59, 999)
  
  const { data: citas, error: errorCitas } = await supabase
    .from('citas')
    .select('fecha_hora, duracion_minutos')
    .eq('profesional_id', profesionalId)
    .gte('fecha_hora', inicioDia.toISOString())
    .lte('fecha_hora', finDia.toISOString())
    .in('estado', ['pendiente', 'confirmada'])
  
  if (errorCitas) {
    console.error('Error al obtener citas:', errorCitas)
    return []
  }
  
  const citasOcupadas = citas || []
  
  // 3. Generar todos los slots posibles basados en horarios
  const todosLosSlots: SlotDisponible[] = []
  
  for (const horario of horarios as HorarioDisponibilidad[]) {
    const slotsHorario = generarSlots(
      horario.hora_inicio,
      horario.hora_fin,
      fecha,
      45 // duración estándar de 45 minutos
    )
    
    // Convertir cada slot a SlotDisponible
    for (const slotFecha of slotsHorario) {
      // Verificar si el slot es en el pasado
      if (!esFutura(slotFecha)) {
        todosLosSlots.push({
          hora: formatearHora(slotFecha),
          fecha_hora: slotFecha,
          disponible: false,
          motivo_no_disponible: 'Horario pasado'
        })
        continue
      }
      
      // Verificar si el slot está ocupado por una cita existente
      const finSlot = addMinutes(slotFecha, 45)
      let estaOcupado = false
      let motivoOcupado = ''
      
      for (const cita of citasOcupadas) {
        const inicioCita = new Date(cita.fecha_hora)
        const finCita = addMinutes(inicioCita, cita.duracion_minutos || 45)
        
        if (rangosSeSolapan(slotFecha, finSlot, inicioCita, finCita)) {
          estaOcupado = true
          motivoOcupado = 'Horario ocupado'
          break
        }
      }
      
      todosLosSlots.push({
        hora: formatearHora(slotFecha),
        fecha_hora: slotFecha,
        disponible: !estaOcupado,
        motivo_no_disponible: estaOcupado ? motivoOcupado : undefined
      })
    }
  }
  
  return todosLosSlots
}

/**
 * Obtiene los días con disponibilidad para un profesional en los próximos N días (versión client)
 * @param profesionalId - ID del profesional
 * @param diasAdelante - Cantidad de días a revisar (default: 30)
 * @returns Array de fechas que tienen al menos un slot disponible
 */
export async function obtenerDiasDisponibles(
  profesionalId: string,
  diasAdelante: number = 30
): Promise<Date[]> {
  const supabase = crearClienteNavegador()
  
  // 1. Obtener todos los horarios del profesional
  const { data: horarios, error } = await supabase
    .from('horarios_disponibilidad')
    .select('dia_semana, hora_inicio, hora_fin')
    .eq('profesional_id', profesionalId)
    .eq('activo', true)
  
  if (error || !horarios || horarios.length === 0) {
    return []
  }
  
  // 2. Crear un Set con los días de la semana que tienen horarios
  const diasConHorario = new Set(horarios.map(h => h.dia_semana))
  
  // 3. Generar fechas para los próximos N días que coincidan con días con horario
  const diasDisponibles: Date[] = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  for (let i = 1; i <= diasAdelante; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + i)
    
    const diaSemana = obtenerDiaSemana(fecha)
    
    if (diasConHorario.has(diaSemana)) {
      diasDisponibles.push(fecha)
    }
  }
  
  return diasDisponibles
}

/**
 * Verifica si un profesional puede agendar una cita (no excede límite) (versión client)
 * @param estudianteId - ID del estudiante
 * @returns true si puede agendar, false si alcanzó el límite
 */
export async function puedeAgendarCita(estudianteId: string): Promise<boolean> {
  const supabase = crearClienteNavegador()
  
  const { data: citas, error } = await supabase
    .from('citas')
    .select('id')
    .eq('estudiante_id', estudianteId)
    .in('estado', ['pendiente', 'confirmada'])
  
  if (error) {
    console.error('Error al verificar límite de citas:', error)
    return false
  }
  
  // Límite de 3 citas pendientes/confirmadas
  return (citas?.length || 0) < 3
}
