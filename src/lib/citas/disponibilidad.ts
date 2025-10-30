import { crearClienteServidor } from '@/lib/supabase/servidor'
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
 * Calcula los slots disponibles para un profesional en una fecha específica
 * @param profesionalId - ID del profesional
 * @param fecha - Fecha para verificar disponibilidad
 * @returns Array de slots disponibles con información de disponibilidad
 */
export async function calcularSlotsDisponibles(
  profesionalId: string,
  fecha: Date
): Promise<SlotDisponible[]> {
  const supabase = await crearClienteServidor()
  
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
  
  // Ordenar por hora
  return todosLosSlots.sort((a, b) => 
    a.fecha_hora.getTime() - b.fecha_hora.getTime()
  )
}

/**
 * Verifica si un slot específico está disponible
 * @param profesionalId - ID del profesional
 * @param fechaHora - Fecha y hora del slot
 * @param duracionMinutos - Duración de la cita en minutos
 * @returns Objeto con disponibilidad y motivo si no está disponible
 */
export async function verificarSlotDisponible(
  profesionalId: string,
  fechaHora: Date,
  duracionMinutos: number = 45
): Promise<{ disponible: boolean; motivo?: string }> {
  const supabase = await crearClienteServidor()
  
  // 1. Verificar que no sea en el pasado
  if (!esFutura(fechaHora)) {
    return { disponible: false, motivo: 'No se pueden agendar citas en el pasado' }
  }
  
  // 2. Verificar que sea con al menos 24 horas de anticipación
  const horasAnticipacion = (fechaHora.getTime() - new Date().getTime()) / (1000 * 60 * 60)
  if (horasAnticipacion < 24) {
    return { 
      disponible: false, 
      motivo: 'Las citas deben agendarse con al menos 24 horas de anticipación' 
    }
  }
  
  // 3. Verificar que el profesional tenga horario disponible ese día/hora
  const diaSemana = obtenerDiaSemana(fechaHora)
  
  const { data: horarios, error: errorHorarios } = await supabase
    .from('horarios_disponibilidad')
    .select('*')
    .eq('profesional_id', profesionalId)
    .eq('dia_semana', diaSemana)
    .eq('activo', true)
  
  if (errorHorarios || !horarios || horarios.length === 0) {
    return { 
      disponible: false, 
      motivo: 'El profesional no tiene horario disponible este día' 
    }
  }
  
  // Verificar que la hora esté dentro del rango
  let dentroDeLosHorarios = false
  for (const horario of horarios as HorarioDisponibilidad[]) {
    const [horaIni, minIni] = horario.hora_inicio.split(':').map(Number)
    const [horaFin, minFin] = horario.hora_fin.split(':').map(Number)
    
    const horaIniTotal = horaIni * 60 + minIni
    const horaFinTotal = horaFin * 60 + minFin
    const horaSlotTotal = fechaHora.getHours() * 60 + fechaHora.getMinutes()
    const horaFinSlot = horaSlotTotal + duracionMinutos
    
    if (horaSlotTotal >= horaIniTotal && horaFinSlot <= horaFinTotal) {
      dentroDeLosHorarios = true
      break
    }
  }
  
  if (!dentroDeLosHorarios) {
    return { 
      disponible: false, 
      motivo: 'La hora seleccionada está fuera del horario de atención del profesional' 
    }
  }
  
  // 4. Verificar que no haya conflicto con citas existentes
  const finSlot = addMinutes(fechaHora, duracionMinutos)
  
  const { data: citasConflicto, error: errorCitas } = await supabase
    .from('citas')
    .select('id, fecha_hora, duracion_minutos')
    .eq('profesional_id', profesionalId)
    .in('estado', ['pendiente', 'confirmada'])
    .gte('fecha_hora', new Date(fechaHora.getTime() - duracionMinutos * 60 * 1000).toISOString())
    .lte('fecha_hora', finSlot.toISOString())
  
  if (errorCitas) {
    return { disponible: false, motivo: 'Error al verificar disponibilidad' }
  }
  
  if (citasConflicto && citasConflicto.length > 0) {
    // Verificar si realmente hay solapamiento
    for (const cita of citasConflicto) {
      const inicioCita = new Date(cita.fecha_hora)
      const finCita = addMinutes(inicioCita, cita.duracion_minutos || 45)
      
      if (rangosSeSolapan(fechaHora, finSlot, inicioCita, finCita)) {
        return { disponible: false, motivo: 'El profesional ya tiene una cita agendada en este horario' }
      }
    }
  }
  
  return { disponible: true }
}

/**
 * Obtiene los próximos días disponibles para un profesional
 * @param profesionalId - ID del profesional
 * @param cantidadDias - Cantidad de días a buscar hacia adelante (default: 30)
 * @returns Array de fechas con disponibilidad
 */
export async function obtenerDiasDisponibles(
  profesionalId: string,
  cantidadDias: number = 30
): Promise<Date[]> {
  const supabase = await crearClienteServidor()
  
  // Obtener todos los días de la semana que el profesional atiende
  const { data: horarios, error } = await supabase
    .from('horarios_disponibilidad')
    .select('dia_semana')
    .eq('profesional_id', profesionalId)
    .eq('activo', true)
  
  if (error || !horarios || horarios.length === 0) {
    return []
  }
  
  const diasAtencion = [...new Set(horarios.map((h: { dia_semana: number }) => h.dia_semana))]
  const diasDisponibles: Date[] = []
  
  // Generar fechas futuras
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  for (let i = 1; i <= cantidadDias; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + i)
    
    // Verificar si el profesional atiende ese día
    if (diasAtencion.includes(obtenerDiaSemana(fecha))) {
      // Verificar que tenga al menos un slot disponible
      const slots = await calcularSlotsDisponibles(profesionalId, fecha)
      if (slots.some(slot => slot.disponible)) {
        diasDisponibles.push(fecha)
      }
    }
  }
  
  return diasDisponibles
}

/**
 * Cuenta las citas pendientes de un estudiante
 * @param estudianteId - ID del estudiante
 * @returns Número de citas pendientes/confirmadas
 */
export async function contarCitasPendientes(estudianteId: string): Promise<number> {
  const supabase = await crearClienteServidor()
  
  const { count, error } = await supabase
    .from('citas')
    .select('*', { count: 'exact', head: true })
    .eq('estudiante_id', estudianteId)
    .in('estado', ['pendiente', 'confirmada'])
    .gte('fecha_hora', new Date().toISOString())
  
  if (error) {
    console.error('Error al contar citas:', error)
    return 0
  }
  
  return count || 0
}

/**
 * Verifica si un estudiante puede agendar más citas
 * @param estudianteId - ID del estudiante
 * @returns true si puede agendar (tiene menos de 3 citas pendientes)
 */
export async function puedeAgendarCita(estudianteId: string): Promise<boolean> {
  const citasPendientes = await contarCitasPendientes(estudianteId)
  return citasPendientes < 3
}
