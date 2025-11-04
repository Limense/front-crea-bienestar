import { describe, it, expect } from 'vitest'
import { 
  validarDatosCita, 
  validarHorarioDisponibilidad,
  validarFormatoHora,
  validarMotivoCancelacion,
  formatearDuracion
} from '@/lib/citas/validaciones'
import { addDays, addHours } from 'date-fns'

/**
 * Tests para validaciones de citas
 * Estos tests son CRÍTICOS porque previenen datos inválidos en la BD
 */

describe('validarDatosCita', () => {
  it('valida correctamente datos válidos completos', () => {
    const datosValidos = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 5), // 5 días en el futuro
      motivo: 'Necesito orientación académica sobre mi rendimiento',
    }
    
    const resultado = validarDatosCita(datosValidos)
    
    expect(resultado.valido).toBe(true)
    expect(resultado.errores).toHaveLength(0)
  })
  
  it('retorna error si falta profesional_id', () => {
    const datosSinProfesional = {
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 5),
      motivo: 'Necesito orientación sobre mi rendimiento académico',
    }
    
    const resultado = validarDatosCita(datosSinProfesional)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Debe seleccionar un profesional')
  })
  
  it('retorna error si el tipo de cita es inválido', () => {
    const datosConTipoInvalido = {
      profesional_id: 'prof-123',
      tipo: 'invalido' as 'psicologia', // Simula tipo inválido
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 5),
      motivo: 'Consulta general sobre mi salud mental',
    }
    
    const resultado = validarDatosCita(datosConTipoInvalido)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Tipo de cita inválido')
  })
  
  it('retorna error si la fecha es en el pasado', () => {
    const datosConFechaPasada = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), -1), // Ayer
      motivo: 'Consulta sobre mi situación académica actual',
    }
    
    const resultado = validarDatosCita(datosConFechaPasada)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('No se pueden agendar citas en el pasado')
  })
  
  it('retorna error si la cita no tiene 24 horas de anticipación', () => {
    const datosConPocaAnticipacion = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addHours(new Date(), 12), // Solo 12 horas
      motivo: 'Urgente: necesito hablar sobre mi ansiedad',
    }
    
    const resultado = validarDatosCita(datosConPocaAnticipacion)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Las citas deben agendarse con al menos 24 horas de anticipación')
  })
  
  it('retorna error si el motivo es muy corto', () => {
    const datosConMotivoCorto = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 5),
      motivo: 'ayuda', // Solo 5 caracteres (mínimo 10)
    }
    
    const resultado = validarDatosCita(datosConMotivoCorto)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('El motivo debe tener al menos 10 caracteres')
  })
  
  it('retorna error si falta el motivo', () => {
    const datosSinMotivo = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 5),
    }
    
    const resultado = validarDatosCita(datosSinMotivo)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Debe indicar el motivo de la cita')
  })
  
  it('retorna error si la cita es con más de 60 días de anticipación', () => {
    const datosConMuchaAnticipacion = {
      profesional_id: 'prof-123',
      tipo: 'psicologia' as const,
      modalidad: 'presencial' as const,
      fecha_hora: addDays(new Date(), 90), // 90 días (más de 60)
      motivo: 'Quiero agendar una cita para dentro de 3 meses',
    }
    
    const resultado = validarDatosCita(datosConMuchaAnticipacion)
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('No se pueden agendar citas con más de 60 días de anticipación')
  })
})

describe('validarHorarioDisponibilidad', () => {
  it('valida horario laboral estándar (9:00 - 17:00)', () => {
    const resultado = validarHorarioDisponibilidad({
      dia_semana: 1, // Lunes
      hora_inicio: '09:00',
      hora_fin: '17:00'
    })
    
    expect(resultado.valido).toBe(true)
    expect(resultado.errores).toHaveLength(0)
  })
  
  it('retorna error si hora_inicio es después de hora_fin', () => {
    const resultado = validarHorarioDisponibilidad({
      dia_semana: 1,
      hora_inicio: '17:00',
      hora_fin: '09:00'
    })
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('La hora de fin debe ser posterior a la hora de inicio')
  })
  
  it('retorna error si las horas son iguales', () => {
    const resultado = validarHorarioDisponibilidad({
      dia_semana: 1,
      hora_inicio: '10:00',
      hora_fin: '10:00'
    })
    
    expect(resultado.valido).toBe(false)
  })
  
  it('retorna error si no hay al menos 45 minutos de diferencia', () => {
    const resultado = validarHorarioDisponibilidad({
      dia_semana: 1,
      hora_inicio: '10:00',
      hora_fin: '10:30' // Solo 30 minutos
    })
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Debe haber al menos 45 minutos entre la hora de inicio y fin')
  })
  
  it('retorna error si el día de la semana es inválido', () => {
    const resultado = validarHorarioDisponibilidad({
      dia_semana: 10, // Inválido (0-6)
      hora_inicio: '09:00',
      hora_fin: '17:00'
    })
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('Día de la semana inválido (debe ser 0-6)')
  })
})

describe('validarFormatoHora', () => {
  it('valida formatos de hora correctos', () => {
    expect(validarFormatoHora('09:00')).toBe(true)
    expect(validarFormatoHora('23:59')).toBe(true)
    expect(validarFormatoHora('00:00')).toBe(true)
    expect(validarFormatoHora('12:30')).toBe(true)
  })
  
  it('rechaza formatos de hora incorrectos', () => {
    expect(validarFormatoHora('25:00')).toBe(false) // Hora inválida
    expect(validarFormatoHora('12:60')).toBe(false) // Minutos inválidos
    expect(validarFormatoHora('12-30')).toBe(false) // Separador incorrecto
    expect(validarFormatoHora('abc')).toBe(false)   // No es hora
  })
  
  it('acepta horas con un solo dígito (9:00 es válido)', () => {
    // La función acepta formatos como 9:00 (sin cero al inicio)
    expect(validarFormatoHora('9:00')).toBe(true)
    expect(validarFormatoHora('8:30')).toBe(true)
  })
})

describe('validarMotivoCancelacion', () => {
  it('valida motivo de cancelación válido', () => {
    const resultado = validarMotivoCancelacion('Tengo un compromiso importante')
    
    expect(resultado.valido).toBe(true)
    expect(resultado.errores).toHaveLength(0)
  })
  
  it('retorna error si el motivo es muy corto', () => {
    const resultado = validarMotivoCancelacion('ok')
    
    expect(resultado.valido).toBe(false)
    expect(resultado.errores).toContain('El motivo de cancelación debe tener al menos 5 caracteres')
  })
  
  it('acepta motivo vacío o undefined', () => {
    const resultado1 = validarMotivoCancelacion()
    const resultado2 = validarMotivoCancelacion('')
    
    expect(resultado1.valido).toBe(true)
    expect(resultado2.valido).toBe(true)
  })
})

describe('formatearDuracion', () => {
  it('formatea minutos menores a 60', () => {
    expect(formatearDuracion(30)).toBe('30 min')
    expect(formatearDuracion(45)).toBe('45 min')
  })
  
  it('formatea horas exactas', () => {
    expect(formatearDuracion(60)).toBe('1h')
    expect(formatearDuracion(120)).toBe('2h')
  })
  
  it('formatea horas con minutos', () => {
    expect(formatearDuracion(90)).toBe('1h 30min')
    expect(formatearDuracion(135)).toBe('2h 15min')
  })
})

