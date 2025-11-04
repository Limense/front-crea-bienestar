import { describe, it, expect } from 'vitest'
import { formatearFechaCita } from '@/lib/citas/horarios'

/**
 * Tests Unitarios para lib/citas/horarios.ts
 * 
 * EXPLICACIÓN:
 * - describe(): Agrupa tests relacionados
 * - it() o test(): Un test individual
 * - expect(): Afirmación que debe cumplirse
 */

describe('formatearFechaCita', () => {
  it('formatea correctamente una fecha con hora', () => {
    // ARRANGE: Preparar datos
    const fecha = new Date('2025-11-15T10:30:00')
    
    // ACT: Ejecutar función
    const resultado = formatearFechaCita(fecha)
    
    // ASSERT: Verificar resultado
    expect(resultado).toBe('sábado, 15 de noviembre a las 10:30')
  })
  
  it('maneja correctamente fechas en diferentes meses', () => {
    const enero = new Date('2025-01-05T14:00:00')
    const diciembre = new Date('2025-12-25T18:30:00')
    
    expect(formatearFechaCita(enero)).toBe('domingo, 5 de enero a las 14:00')
    expect(formatearFechaCita(diciembre)).toBe('jueves, 25 de diciembre a las 18:30')
  })
  
  it('formatea fecha sin hora cuando se especifica', () => {
    const fecha = new Date('2025-11-15T10:30:00')
    
    const resultado = formatearFechaCita(fecha, false)
    
    expect(resultado).toBe('sábado, 15 de noviembre')
  })
})
