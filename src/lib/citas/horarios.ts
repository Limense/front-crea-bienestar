import { addMinutes, format, isAfter, isBefore, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Genera slots de tiempo disponibles entre dos horas
 * @param horaInicio - Hora de inicio (formato "HH:MM")
 * @param horaFin - Hora de fin (formato "HH:MM")
 * @param fecha - Fecha para generar los slots
 * @param duracionMinutos - Duración de cada slot en minutos (default: 45)
 * @returns Array de slots con fecha_hora completa
 */
export function generarSlots(
  horaInicio: string,
  horaFin: string,
  fecha: Date,
  duracionMinutos: number = 45
): Date[] {
  const slots: Date[] = []
  
  // Parsear horas
  const [horaIni, minIni] = horaInicio.split(':').map(Number)
  const [horaFin2, minFin] = horaFin.split(':').map(Number)
  
  // Crear fecha base con hora de inicio
  let slotActual = new Date(fecha)
  slotActual.setHours(horaIni, minIni, 0, 0)
  
  // Crear fecha de fin
  const fechaFin = new Date(fecha)
  fechaFin.setHours(horaFin2, minFin, 0, 0)
  
  // Generar slots
  while (isBefore(slotActual, fechaFin)) {
    // Verificar que el slot + duración no exceda el horario de fin
    const finSlot = addMinutes(slotActual, duracionMinutos)
    if (isAfter(finSlot, fechaFin)) break
    
    slots.push(new Date(slotActual))
    slotActual = addMinutes(slotActual, duracionMinutos)
  }
  
  return slots
}

/**
 * Formatea una fecha para mostrar al usuario
 * @param fecha - Fecha a formatear
 * @param incluirHora - Si incluye la hora (default: true)
 * @returns Fecha formateada en español
 */
export function formatearFechaCita(fecha: Date | string, incluirHora: boolean = true): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  if (incluirHora) {
    return format(fechaObj, "EEEE, d 'de' MMMM 'a las' HH:mm", { locale: es })
  }
  
  return format(fechaObj, "EEEE, d 'de' MMMM", { locale: es })
}

/**
 * Formatea solo la hora de una fecha
 * @param fecha - Fecha con hora
 * @returns Hora en formato "HH:MM"
 */
export function formatearHora(fecha: Date | string): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(fechaObj, 'HH:mm')
}

/**
 * Obtiene el día de la semana (0-6, domingo-sábado)
 * @param fecha - Fecha
 * @returns Número del día de la semana
 */
export function obtenerDiaSemana(fecha: Date): number {
  return fecha.getDay()
}

/**
 * Verifica si una fecha es hoy
 * @param fecha - Fecha a verificar
 * @returns true si es hoy
 */
export function esHoy(fecha: Date | string): boolean {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  return isSameDay(fechaObj, new Date())
}

/**
 * Verifica si una fecha es en el futuro
 * @param fecha - Fecha a verificar
 * @returns true si es futura
 */
export function esFutura(fecha: Date | string): boolean {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  return isAfter(fechaObj, new Date())
}

/**
 * Verifica si una fecha está dentro de un rango
 * @param fecha - Fecha a verificar
 * @param inicio - Inicio del rango
 * @param fin - Fin del rango
 * @returns true si está en el rango
 */
export function estaEnRango(fecha: Date, inicio: Date, fin: Date): boolean {
  return (isAfter(fecha, inicio) || isSameDay(fecha, inicio)) && 
         (isBefore(fecha, fin) || isSameDay(fecha, fin))
}

/**
 * Calcula el tiempo restante hasta una fecha
 * @param fecha - Fecha objetivo
 * @returns Objeto con días, horas y minutos restantes
 */
export function tiempoRestante(fecha: Date | string): {
  dias: number
  horas: number
  minutos: number
  total_minutos: number
} {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  const ahora = new Date()
  const diff = fechaObj.getTime() - ahora.getTime()
  
  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, total_minutos: 0 }
  }
  
  const minutos = Math.floor(diff / 1000 / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)
  
  return {
    dias,
    horas: horas % 24,
    minutos: minutos % 60,
    total_minutos: minutos
  }
}

/**
 * Obtiene el nombre del día de la semana
 * @param diaSemana - Número del día (0-6)
 * @returns Nombre del día en español
 */
export function nombreDiaSemana(diaSemana: number): string {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[diaSemana] || 'Día inválido'
}

/**
 * Verifica si dos rangos de tiempo se solapan
 * @param inicio1 - Inicio del primer rango
 * @param fin1 - Fin del primer rango
 * @param inicio2 - Inicio del segundo rango
 * @param fin2 - Fin del segundo rango
 * @returns true si se solapan
 */
export function rangosSeSolapan(
  inicio1: Date,
  fin1: Date,
  inicio2: Date,
  fin2: Date
): boolean {
  return (
    (isAfter(inicio1, inicio2) || isSameDay(inicio1, inicio2)) && 
    (isBefore(inicio1, fin2) || isSameDay(inicio1, fin2))
  ) || (
    (isAfter(inicio2, inicio1) || isSameDay(inicio2, inicio1)) && 
    (isBefore(inicio2, fin1) || isSameDay(inicio2, fin1))
  )
}
