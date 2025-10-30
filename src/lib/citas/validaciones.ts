import { TipoCita, ModalidadCita } from '@/types/database'

/**
 * Resultado de validación
 */
export type ResultadoValidacion = {
  valido: boolean
  errores: string[]
}

/**
 * Valida los datos para crear una cita
 */
export function validarDatosCita(datos: {
  profesional_id?: string
  fecha_hora?: Date
  tipo?: TipoCita
  modalidad?: ModalidadCita
  motivo?: string
}): ResultadoValidacion {
  const errores: string[] = []
  
  // Validar profesional_id
  if (!datos.profesional_id || datos.profesional_id.trim() === '') {
    errores.push('Debe seleccionar un profesional')
  }
  
  // Validar fecha_hora
  if (!datos.fecha_hora) {
    errores.push('Debe seleccionar una fecha y hora')
  } else {
    // Verificar que no sea en el pasado
    if (datos.fecha_hora < new Date()) {
      errores.push('No se pueden agendar citas en el pasado')
    }
    
    // Verificar que sea con al menos 24 horas de anticipación
    const horasAnticipacion = (datos.fecha_hora.getTime() - new Date().getTime()) / (1000 * 60 * 60)
    if (horasAnticipacion < 24) {
      errores.push('Las citas deben agendarse con al menos 24 horas de anticipación')
    }
    
    // Verificar que no sea más de 60 días en el futuro
    const diasFuturo = (datos.fecha_hora.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    if (diasFuturo > 60) {
      errores.push('No se pueden agendar citas con más de 60 días de anticipación')
    }
  }
  
  // Validar tipo
  const tiposValidos: TipoCita[] = ['psicologia', 'medicina_ocupacional']
  if (!datos.tipo) {
    errores.push('Debe seleccionar el tipo de cita')
  } else if (!tiposValidos.includes(datos.tipo)) {
    errores.push('Tipo de cita inválido')
  }
  
  // Validar modalidad
  const modalidadesValidas: ModalidadCita[] = ['presencial', 'virtual']
  if (!datos.modalidad) {
    errores.push('Debe seleccionar la modalidad de la cita')
  } else if (!modalidadesValidas.includes(datos.modalidad)) {
    errores.push('Modalidad de cita inválida')
  }
  
  // Validar motivo
  if (!datos.motivo || datos.motivo.trim() === '') {
    errores.push('Debe indicar el motivo de la cita')
  } else if (datos.motivo.trim().length < 10) {
    errores.push('El motivo debe tener al menos 10 caracteres')
  } else if (datos.motivo.length > 500) {
    errores.push('El motivo no puede exceder 500 caracteres')
  }
  
  return {
    valido: errores.length === 0,
    errores
  }
}

/**
 * Valida el motivo de cancelación
 */
export function validarMotivoCancelacion(motivo?: string): ResultadoValidacion {
  const errores: string[] = []
  
  if (motivo && motivo.trim() !== '') {
    if (motivo.trim().length < 5) {
      errores.push('El motivo de cancelación debe tener al menos 5 caracteres')
    }
    
    if (motivo.length > 300) {
      errores.push('El motivo de cancelación no puede exceder 300 caracteres')
    }
  }
  
  return {
    valido: errores.length === 0,
    errores
  }
}

/**
 * Valida las notas del profesional
 */
export function validarNotasProfesional(notas?: string): ResultadoValidacion {
  const errores: string[] = []
  
  if (notas && notas.trim() !== '') {
    if (notas.length > 1000) {
      errores.push('Las notas no pueden exceder 1000 caracteres')
    }
  }
  
  return {
    valido: errores.length === 0,
    errores
  }
}

/**
 * Valida un horario de disponibilidad
 */
export function validarHorarioDisponibilidad(datos: {
  dia_semana?: number
  hora_inicio?: string
  hora_fin?: string
}): ResultadoValidacion {
  const errores: string[] = []
  
  // Validar día de la semana
  if (datos.dia_semana === undefined || datos.dia_semana === null) {
    errores.push('Debe seleccionar un día de la semana')
  } else if (datos.dia_semana < 0 || datos.dia_semana > 6) {
    errores.push('Día de la semana inválido (debe ser 0-6)')
  }
  
  // Validar hora de inicio
  if (!datos.hora_inicio || !validarFormatoHora(datos.hora_inicio)) {
    errores.push('Hora de inicio inválida (formato: HH:MM)')
  }
  
  // Validar hora de fin
  if (!datos.hora_fin || !validarFormatoHora(datos.hora_fin)) {
    errores.push('Hora de fin inválida (formato: HH:MM)')
  }
  
  // Validar que hora_fin sea después de hora_inicio
  if (datos.hora_inicio && datos.hora_fin && validarFormatoHora(datos.hora_inicio) && validarFormatoHora(datos.hora_fin)) {
    const [horaIni, minIni] = datos.hora_inicio.split(':').map(Number)
    const [horaFin, minFin] = datos.hora_fin.split(':').map(Number)
    
    const totalIni = horaIni * 60 + minIni
    const totalFin = horaFin * 60 + minFin
    
    if (totalFin <= totalIni) {
      errores.push('La hora de fin debe ser posterior a la hora de inicio')
    }
    
    // Validar que haya al menos 45 minutos de diferencia
    if (totalFin - totalIni < 45) {
      errores.push('Debe haber al menos 45 minutos entre la hora de inicio y fin')
    }
  }
  
  return {
    valido: errores.length === 0,
    errores
  }
}

/**
 * Valida el formato de una hora (HH:MM)
 */
export function validarFormatoHora(hora: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  
  if (!regex.test(hora)) {
    return false
  }
  
  const [h, m] = hora.split(':').map(Number)
  
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/**
 * Formatea un número de minutos a formato de duración legible
 * @param minutos - Cantidad de minutos
 * @returns String formateado (ej: "1h 30min")
 */
export function formatearDuracion(minutos: number): string {
  if (minutos < 60) {
    return `${minutos} min`
  }
  
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  
  if (mins === 0) {
    return `${horas}h`
  }
  
  return `${horas}h ${mins}min`
}

/**
 * Obtiene el color para un estado de cita
 */
export function obtenerColorEstado(estado: string): {
  bg: string
  text: string
  border: string
} {
  switch (estado) {
    case 'pendiente':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      }
    case 'confirmada':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200'
      }
    case 'completada':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      }
    case 'cancelada':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200'
      }
  }
}

/**
 * Obtiene el icono para un tipo de cita
 */
export function obtenerIconoTipo(tipo: TipoCita): string {
  switch (tipo) {
    case 'psicologia':
      return '🧠'
    case 'medicina_ocupacional':
      return '⚕️'
    default:
      return '📅'
  }
}

/**
 * Obtiene el icono para una modalidad de cita
 */
export function obtenerIconoModalidad(modalidad: ModalidadCita): string {
  switch (modalidad) {
    case 'presencial':
      return '🏢'
    case 'virtual':
      return '💻'
    default:
      return '📍'
  }
}
