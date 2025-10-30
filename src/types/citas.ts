import { TipoCita, ModalidadCita, EstadoCita } from './database'

/**
 * Slot de tiempo disponible para agendar
 */
export interface SlotDisponible {
  hora: string // Format: "HH:MM"
  fecha_hora: Date
  disponible: boolean
  motivo_no_disponible?: string
}

/**
 * Horario de disponibilidad de un profesional
 */
export interface HorarioDisponibilidad {
  id: string
  profesional_id: string
  dia_semana: number // 0-6 (domingo-sábado)
  hora_inicio: string
  hora_fin: string
  activo: boolean
  creado_en: string
}

/**
 * Datos para crear una nueva cita
 */
export interface CrearCitaData {
  profesional_id: string
  fecha_hora: Date
  tipo: TipoCita
  modalidad: ModalidadCita
  motivo: string
  notas?: string
  duracion_minutos?: number
}

/**
 * Filtros para listar citas
 */
export interface FiltrosCitas {
  estado?: EstadoCita | EstadoCita[]
  tipo?: TipoCita
  modalidad?: ModalidadCita
  desde?: Date
  hasta?: Date
  buscar?: string
}

/**
 * Profesional con información de disponibilidad
 */
export interface ProfesionalConDisponibilidad {
  id: string
  nombre_completo: string
  email: string
  especialidad: string
  avatar_url?: string
  tiene_horarios: boolean
  total_citas: number
}

/**
 * Estadísticas de citas de un profesional
 */
export interface EstadisticasCitas {
  total: number
  pendientes: number
  confirmadas: number
  completadas: number
  canceladas: number
  tasa_asistencia: number
}
