import { Cita, Perfil, CitaConRelaciones } from '@/types/database'
import { addDays, addHours } from 'date-fns'

/**
 * Factories: Funciones que generan datos de prueba
 * 
 * ¿Por qué usar factories?
 * - No repetir objetos mock en cada test
 * - Crear datos válidos fácilmente
 * - Sobrescribir solo lo que necesitas
 */

/**
 * Crea un perfil de prueba
 */
export function createMockPerfil(overrides?: Partial<Perfil>): Perfil {
  return {
    id: 'user-123',
    nombre_completo: 'Juan Pérez',
    email: 'juan@test.com',
    rol: 'estudiante',
    telefono: '987654321',
    creado_en: new Date().toISOString(),
    ...overrides, // Sobrescribe con valores custom
  }
}

/**
 * Crea una cita de prueba
 */
export function createMockCita(overrides?: Partial<Cita>): Cita {
  const tomorrow = addDays(new Date(), 1)
  
  return {
    id: 'cita-123',
    estudiante_id: 'estudiante-123',
    profesional_id: 'profesional-123',
    tipo: 'psicologia',
    modalidad: 'presencial',
    fecha_hora: tomorrow.toISOString(),
    duracion_minutos: 60,
    estado: 'pendiente',
    motivo: 'Consulta general',
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Crea una cita mock CON relaciones (profesional + estudiante incluidos)
 * Útil para tests de componentes que muestran datos completos
 */
export function createMockCitaConRelaciones(
  overrides?: Partial<CitaConRelaciones>
): CitaConRelaciones {
  const profesional = createMockPerfil({
    rol: 'profesional',
    nombre_completo: 'Dra. María García',
    especialidad: 'Psicología Clínica',
  })

  const estudiante = createMockPerfil({
    rol: 'estudiante',
    nombre_completo: 'Juan Pérez',
    semestre: 4,
  })

  const baseCita = createMockCita()

  return {
    ...baseCita,
    profesional,
    estudiante,
    ...overrides,
  }
}

/**
 * Crea múltiples citas de prueba
 */
export function createMockCitas(count: number, overrides?: Partial<Cita>): Cita[] {
  return Array.from({ length: count }, (_, index) => 
    createMockCita({
      id: `cita-${index + 1}`,
      fecha_hora: addHours(new Date(), index * 2).toISOString(),
      ...overrides,
    })
  )
}

/**
 * Crea una cita próxima (en las próximas 24 horas)
 */
export function createMockCitaProxima(overrides?: Partial<Cita>): Cita {
  return createMockCita({
    fecha_hora: addHours(new Date(), 5).toISOString(), // En 5 horas
    estado: 'confirmada',
    ...overrides,
  })
}

/**
 * Crea una cita pasada
 */
export function createMockCitaPasada(overrides?: Partial<Cita>): Cita {
  return createMockCita({
    fecha_hora: addDays(new Date(), -5).toISOString(), // Hace 5 días
    estado: 'completada',
    ...overrides,
  })
}
