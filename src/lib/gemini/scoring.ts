/**
 * Sistema de scoring de riesgo de deserción y crisis emocional
 * Combina múltiples factores para calcular un puntaje de riesgo (0-100)
 */

import { AnalisisRiesgo, NivelRiesgoChat, SentimientoAnalisis } from './types'
import { detectarPalabrasClave, calcularPuntajePalabrasClave } from './keywords'
import { analizarSentimiento } from './sentiment'

/**
 * Analiza el riesgo completo de un mensaje
 * @param mensajeEstudiante - Texto del mensaje del estudiante
 * @param historialPuntajes - Array de puntajes previos en la conversación (opcional)
 * @returns Análisis completo de riesgo
 */
export function analizarRiesgo(
  mensajeEstudiante: string,
  historialPuntajes: number[] = []
): AnalisisRiesgo {
  // 1. Detectar palabras clave de riesgo
  const palabrasDetectadas = detectarPalabrasClave(mensajeEstudiante)
  const puntajePalabrasClave = calcularPuntajePalabrasClave(palabrasDetectadas)
  
  // 2. Analizar sentimiento
  const sentimiento = analizarSentimiento(mensajeEstudiante)
  const puntajeSentimiento = 100 - sentimiento.puntaje // Invertir: bajo sentimiento = alto riesgo
  
  // 3. Analizar contexto (longitud, palabras totales, intensidad)
  const puntajeContexto = analizarContexto(mensajeEstudiante, historialPuntajes)
  
  // 4. Calcular puntaje total ponderado
  // Palabras clave tienen más peso (50%), seguido de sentimiento (35%) y contexto (15%)
  const puntajeTotal = Math.round(
    puntajePalabrasClave * 0.50 +
    puntajeSentimiento * 0.35 +
    puntajeContexto * 0.15
  )
  
  // 5. Determinar nivel de riesgo
  const nivel = determinarNivelRiesgo(puntajeTotal)
  
  // 6. Verificar si requiere alerta automática
  const requiereAlerta = puntajeTotal >= 60
  
  // 7. Generar recomendación
  const recomendacion = generarRecomendacion(nivel, palabrasDetectadas, sentimiento)
  
  return {
    puntajeTotal,
    nivel,
    factores: {
      sentimiento: Math.round(puntajeSentimiento),
      palabrasClave: Math.round(puntajePalabrasClave),
      contexto: Math.round(puntajeContexto),
    },
    palabrasDetectadas,
    requiereAlerta,
    recomendacion,
  }
}

/**
 * Analiza el contexto del mensaje
 * @param mensaje - Texto del mensaje
 * @param historialPuntajes - Puntajes previos
 * @returns Puntaje de contexto (0-100)
 */
function analizarContexto(mensaje: string, historialPuntajes: number[]): number {
  let puntaje = 0
  
  // 1. Longitud del mensaje (mensajes muy cortos o muy largos pueden indicar estrés)
  const palabras = mensaje.trim().split(/\s+/).length
  if (palabras < 5) {
    puntaje += 10 // Respuestas muy cortas pueden indicar apatía
  } else if (palabras > 150) {
    puntaje += 15 // Mensajes muy largos pueden indicar angustia
  }
  
  // 2. Uso excesivo de signos de exclamación o interrogación
  const signosExclamacion = (mensaje.match(/!/g) || []).length
  const signosInterrogacion = (mensaje.match(/\?/g) || []).length
  if (signosExclamacion > 3 || signosInterrogacion > 3) {
    puntaje += 10
  }
  
  // 3. Uso de mayúsculas sostenidas (puede indicar estrés)
  const palabrasMayusculas = mensaje.match(/[A-Z]{4,}/g)
  if (palabrasMayusculas && palabrasMayusculas.length > 0) {
    puntaje += 10
  }
  
  // 4. Tendencia en el historial (si el riesgo va en aumento)
  if (historialPuntajes.length >= 2) {
    const ultimosPuntajes = historialPuntajes.slice(-3)
    const tendenciaAscendente = ultimosPuntajes.every((p, i) => 
      i === 0 || p >= ultimosPuntajes[i - 1]
    )
    if (tendenciaAscendente && ultimosPuntajes[ultimosPuntajes.length - 1] > 50) {
      puntaje += 20 // Riesgo creciente es muy preocupante
    }
  }
  
  // 5. Primera conversación sin contexto previo
  if (historialPuntajes.length === 0 && palabras < 10) {
    puntaje += 5 // Respuesta inicial muy corta puede ser normal
  }
  
  return Math.min(puntaje, 100)
}

/**
 * Determina el nivel de riesgo basado en el puntaje
 * @param puntaje - Puntaje total (0-100)
 * @returns Nivel de riesgo
 */
function determinarNivelRiesgo(puntaje: number): NivelRiesgoChat {
  if (puntaje >= 80) return 'CRITICO'
  if (puntaje >= 60) return 'ALTO'
  if (puntaje >= 30) return 'MEDIO'
  return 'BAJO'
}

/**
 * Genera una recomendación de acción basada en el análisis
 * @param nivel - Nivel de riesgo
 * @param palabrasDetectadas - Palabras clave detectadas
 * @param sentimiento - Análisis de sentimiento
 * @returns Texto de recomendación
 */
function generarRecomendacion(
  nivel: NivelRiesgoChat,
  palabrasDetectadas: any[],
  sentimiento: SentimientoAnalisis
): string {
  // Detectar categorías específicas
  const categorias = new Set(palabrasDetectadas.map(p => p.categoria))
  const tieneSuicidio = categorias.has('suicidio')
  const tieneAutolesion = categorias.has('autolesion')
  
  if (nivel === 'CRITICO') {
    if (tieneSuicidio || tieneAutolesion) {
      return 'URGENTE: Contactar INMEDIATAMENTE con profesional. Riesgo de autolesión o suicidio detectado. Activar protocolo de crisis.'
    }
    return 'URGENTE: Derivar a psicología inmediatamente. Nivel de riesgo crítico requiere intervención profesional sin demora.'
  }
  
  if (nivel === 'ALTO') {
    if (tieneSuicidio || tieneAutolesion) {
      return 'PRIORITARIO: Agendar cita urgente con psicología. Monitorear de cerca. Informar a tutor.'
    }
    return 'PRIORITARIO: Agendar cita con psicología en las próximas 24-48 horas. Seguimiento cercano recomendado.'
  }
  
  if (nivel === 'MEDIO') {
    if (categorias.has('academico')) {
      return 'Sugerir cita con psicología educativa. Ofrecer recursos de técnicas de estudio. Informar a tutor si persiste.'
    }
    if (categorias.has('economico')) {
      return 'Derivar a bienestar estudiantil para apoyo económico. Considerar cita con psicología si afecta rendimiento.'
    }
    return 'Sugerir agendar cita con psicología preventiva. Ofrecer recursos de afrontamiento y talleres grupales.'
  }
  
  // BAJO
  return 'Ofrecer recursos educativos de bienestar. Invitar a talleres grupales. Seguimiento opcional.'
}

/**
 * Calcula el puntaje promedio de una conversación
 * @param puntajes - Array de puntajes de mensajes
 * @returns Promedio ponderado (más peso a mensajes recientes)
 */
export function calcularPuntajeConversacion(puntajes: number[]): number {
  if (puntajes.length === 0) return 0
  if (puntajes.length === 1) return puntajes[0]
  
  // Ponderar más los mensajes recientes
  let suma = 0
  let pesoTotal = 0
  
  for (let i = 0; i < puntajes.length; i++) {
    const peso = i + 1 // Mensajes más recientes tienen más peso
    suma += puntajes[i] * peso
    pesoTotal += peso
  }
  
  return Math.round(suma / pesoTotal)
}

/**
 * Determina si debe generarse una alerta automática
 * @param analisis - Resultado del análisis de riesgo
 * @param yaExisteAlerta - Si ya existe una alerta activa para este estudiante
 * @returns true si debe crear alerta
 */
export function debeGenerarAlerta(
  analisis: AnalisisRiesgo,
  yaExisteAlerta: boolean = false
): boolean {
  // Si ya existe alerta activa, no duplicar
  if (yaExisteAlerta) return false
  
  // Generar alerta si:
  // 1. Puntaje >= 60 (ALTO o CRÍTICO)
  // 2. Palabras clave de suicidio o autolesión detectadas
  return (
    analisis.requiereAlerta ||
    analisis.palabrasDetectadas.some(p => 
      p.categoria === 'suicidio' || p.categoria === 'autolesion'
    )
  )
}
