// Tipos base de usuario
export type RolUsuario = 'estudiante' | 'profesional' | 'tutor' | 'admin'

export type TipoCita = 'psicologia' | 'medicina_ocupacional'
export type ModalidadCita = 'presencial' | 'virtual'
export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada'

export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO'
export type TipoProblema = 'economico' | 'emocional' | 'academico' | 'vocacional' | 'familiar' | 'salud'
export type EstadoAlerta = 'pendiente' | 'en_progreso' | 'resuelto' | 'cerrado'

// Entidades de base de datos
export interface Perfil {
  id: string
  email: string
  nombre_completo: string
  rol: RolUsuario
  avatar_url?: string
  telefono?: string
  semestre?: number // solo estudiantes
  especialidad?: string // solo profesionales
  creado_en: string
}

export interface Cita {
  id: string
  estudiante_id: string
  profesional_id: string
  fecha_hora: string
  duracion_minutos: number
  tipo: TipoCita
  modalidad: ModalidadCita
  estado: EstadoCita
  motivo?: string
  notas?: string
  enlace_google_meet?: string
  creado_en: string
  actualizado_en: string
}

export interface Conversacion {
  id: string
  estudiante_id: string
  titulo: string
  puntaje_riesgo_actual: number
  nivel_riesgo_actual: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO'
  ultima_actividad: string
  creado_en: string
  actualizado_en: string
}

export interface Mensaje {
  id: string
  conversacion_id: string
  contenido: string
  remitente: 'estudiante' | 'bot'
  sentimiento?: {
    puntaje: number
    emocion: string
  }
  palabras_clave_riesgo?: string[]
  metadata?: Record<string, unknown>
  creado_en: string
}

export interface Alerta {
  id: string
  estudiante_id: string
  nivel_riesgo: NivelRiesgo
  puntaje_riesgo: number
  detectado_en: string
  tipo_problema: TipoProblema
  resumen_conversacion: string
  estado: EstadoAlerta
  asignado_a?: string
  descripcion_intervencion?: string
  fecha_intervencion?: string
  resuelto_en?: string
}

export interface Recurso {
  id: string
  titulo: string
  descripcion: string
  tipo_contenido: 'video' | 'pdf' | 'articulo' | 'audio' | 'infografia'
  categoria: 'estres' | 'nutricion' | 'estudio' | 'autocuidado' | 'vocacional' | 'practicas'
  url?: string
  ruta_archivo?: string
  conteo_descargas: number
  creado_en: string
}

export interface Taller {
  id: string
  titulo: string
  descripcion: string
  facilitador_id: string
  fecha_hora: string
  duracion_minutos: number
  modalidad: ModalidadCita
  capacidad_maxima: number
  conteo_inscritos: number
  estado: 'programado' | 'completado' | 'cancelado'
  enlace_google_meet?: string
  creado_en: string
}

// Tipos extendidos con relaciones
export interface CitaConRelaciones extends Cita {
  estudiante: Perfil
  profesional: Perfil
}

export interface ConversacionConRelaciones extends Conversacion {
  estudiante: Perfil
  mensajes?: Mensaje[]
  total_mensajes?: number
}

export interface MensajeConRelaciones extends Mensaje {
  conversacion: Conversacion
}

export interface AlertaConRelaciones extends Alerta {
  estudiante: Perfil
  tutor?: Perfil
}

export interface TallerConRelaciones extends Taller {
  facilitador: Perfil
  inscrito?: boolean
}
