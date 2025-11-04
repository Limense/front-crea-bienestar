/**
 * Palabras clave y patrones para detección de riesgo
 * Basado en literatura de psicología clínica y prevención del suicidio
 */

import { PalabraClaveDetectada } from './types'

/**
 * Palabras clave de alto riesgo (peso 8-10)
 * Indican crisis inmediata o ideación suicida
 */
export const PALABRAS_ALTO_RIESGO: { palabra: string; peso: number; categoria: PalabraClaveDetectada['categoria'] }[] = [
  // Suicidio directo
  { palabra: 'suicidio', peso: 10, categoria: 'suicidio' },
  { palabra: 'suicidarme', peso: 10, categoria: 'suicidio' },
  { palabra: 'quitarme la vida', peso: 10, categoria: 'suicidio' },
  { palabra: 'acabar con todo', peso: 9, categoria: 'suicidio' },
  { palabra: 'no quiero vivir', peso: 9, categoria: 'suicidio' },
  { palabra: 'mejor muerto', peso: 9, categoria: 'suicidio' },
  { palabra: 'matarme', peso: 10, categoria: 'suicidio' },
  
  // Autolesión
  { palabra: 'cortarme', peso: 9, categoria: 'autolesion' },
  { palabra: 'lastimarme', peso: 8, categoria: 'autolesion' },
  { palabra: 'hacerme daño', peso: 8, categoria: 'autolesion' },
  { palabra: 'autolesión', peso: 9, categoria: 'autolesion' },
  
  // Desesperanza extrema
  { palabra: 'no hay salida', peso: 8, categoria: 'depresion' },
  { palabra: 'no tiene sentido', peso: 8, categoria: 'depresion' },
  { palabra: 'todo está perdido', peso: 8, categoria: 'depresion' },
  { palabra: 'no puedo más', peso: 8, categoria: 'depresion' },
]

/**
 * Palabras clave de riesgo medio (peso 5-7)
 * Indican depresión, ansiedad severa o problemas serios
 */
export const PALABRAS_RIESGO_MEDIO: { palabra: string; peso: number; categoria: PalabraClaveDetectada['categoria'] }[] = [
  // Depresión
  { palabra: 'deprimido', peso: 7, categoria: 'depresion' },
  { palabra: 'depresión', peso: 7, categoria: 'depresion' },
  { palabra: 'tristeza profunda', peso: 6, categoria: 'depresion' },
  { palabra: 'vacío', peso: 6, categoria: 'depresion' },
  { palabra: 'desesperado', peso: 7, categoria: 'depresion' },
  { palabra: 'sin esperanza', peso: 7, categoria: 'depresion' },
  { palabra: 'solo', peso: 5, categoria: 'depresion' },
  { palabra: 'aislado', peso: 6, categoria: 'depresion' },
  
  // Ansiedad severa
  { palabra: 'pánico', peso: 7, categoria: 'ansiedad' },
  { palabra: 'ataque de ansiedad', peso: 7, categoria: 'ansiedad' },
  { palabra: 'angustia', peso: 6, categoria: 'ansiedad' },
  { palabra: 'miedo constante', peso: 6, categoria: 'ansiedad' },
  { palabra: 'terror', peso: 6, categoria: 'ansiedad' },
  
  // Abandono académico
  { palabra: 'dejar la carrera', peso: 6, categoria: 'academico' },
  { palabra: 'desertar', peso: 7, categoria: 'academico' },
  { palabra: 'abandonar estudios', peso: 6, categoria: 'academico' },
  { palabra: 'no puedo seguir estudiando', peso: 6, categoria: 'academico' },
  
  // Problemas familiares graves
  { palabra: 'abuso', peso: 7, categoria: 'familiar' },
  { palabra: 'violencia familiar', peso: 7, categoria: 'familiar' },
  { palabra: 'maltrato', peso: 7, categoria: 'familiar' },
]

/**
 * Palabras clave de riesgo bajo (peso 2-4)
 * Indican estrés, preocupación o problemas moderados
 */
export const PALABRAS_RIESGO_BAJO: { palabra: string; peso: number; categoria: PalabraClaveDetectada['categoria'] }[] = [
  // Estrés
  { palabra: 'estresado', peso: 4, categoria: 'estres' },
  { palabra: 'estrés', peso: 4, categoria: 'estres' },
  { palabra: 'agobiado', peso: 4, categoria: 'estres' },
  { palabra: 'cansado', peso: 3, categoria: 'estres' },
  { palabra: 'agotado', peso: 4, categoria: 'estres' },
  
  // Ansiedad moderada
  { palabra: 'ansioso', peso: 4, categoria: 'ansiedad' },
  { palabra: 'nervioso', peso: 3, categoria: 'ansiedad' },
  { palabra: 'preocupado', peso: 3, categoria: 'ansiedad' },
  { palabra: 'intranquilo', peso: 3, categoria: 'ansiedad' },
  
  // Problemas académicos
  { palabra: 'reprobar', peso: 4, categoria: 'academico' },
  { palabra: 'suspender', peso: 4, categoria: 'academico' },
  { palabra: 'bajo rendimiento', peso: 4, categoria: 'academico' },
  { palabra: 'dificultad para estudiar', peso: 3, categoria: 'academico' },
  { palabra: 'no entiendo', peso: 2, categoria: 'academico' },
  
  // Problemas económicos
  { palabra: 'dinero', peso: 3, categoria: 'economico' },
  { palabra: 'económico', peso: 3, categoria: 'economico' },
  { palabra: 'pagar', peso: 2, categoria: 'economico' },
  { palabra: 'deuda', peso: 4, categoria: 'economico' },
  
  // Problemas familiares
  { palabra: 'familia', peso: 2, categoria: 'familiar' },
  { palabra: 'padres', peso: 2, categoria: 'familiar' },
  { palabra: 'conflicto familiar', peso: 4, categoria: 'familiar' },
  { palabra: 'problemas en casa', peso: 3, categoria: 'familiar' },
]

/**
 * Combina todas las palabras clave en un solo array
 */
export const TODAS_PALABRAS_CLAVE = [
  ...PALABRAS_ALTO_RIESGO,
  ...PALABRAS_RIESGO_MEDIO,
  ...PALABRAS_RIESGO_BAJO,
]

/**
 * Detecta palabras clave de riesgo en un texto
 * @param texto - Texto a analizar
 * @returns Array de palabras clave detectadas con su peso
 */
export function detectarPalabrasClave(texto: string): PalabraClaveDetectada[] {
  const textoNormalizado = texto.toLowerCase()
  const palabrasDetectadas: PalabraClaveDetectada[] = []
  
  for (const item of TODAS_PALABRAS_CLAVE) {
    if (textoNormalizado.includes(item.palabra)) {
      palabrasDetectadas.push({
        palabra: item.palabra,
        categoria: item.categoria,
        peso: item.peso,
      })
    }
  }
  
  // Ordenar por peso (más grave primero)
  return palabrasDetectadas.sort((a, b) => b.peso - a.peso)
}

/**
 * Calcula el puntaje de riesgo basado en palabras clave
 * @param palabrasDetectadas - Array de palabras detectadas
 * @returns Puntaje de 0-100
 */
export function calcularPuntajePalabrasClave(palabrasDetectadas: PalabraClaveDetectada[]): number {
  if (palabrasDetectadas.length === 0) return 0
  
  // Sumar pesos, pero con rendimientos decrecientes
  let puntajeTotal = 0
  let factorDecremento = 1.0
  
  for (const palabra of palabrasDetectadas) {
    puntajeTotal += palabra.peso * factorDecremento
    factorDecremento *= 0.8 // Cada palabra adicional aporta 80% del valor anterior
  }
  
  // Normalizar a escala 0-100
  // Asumimos que 50 puntos de peso es 100 de riesgo
  const puntajeNormalizado = Math.min((puntajeTotal / 50) * 100, 100)
  
  return Math.round(puntajeNormalizado)
}
