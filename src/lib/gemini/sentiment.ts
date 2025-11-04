/**
 * Análisis de sentimientos para mensajes del chatbot
 * Usa heurísticas y patrones lingüísticos para determinar estado emocional
 */

import { SentimientoAnalisis } from './types'

/**
 * Palabras indicadoras de emociones específicas
 */
const EMOCIONES_DICCIONARIO = {
  tristeza: [
    'triste', 'deprimido', 'melancólico', 'llorar', 'lloro', 'lágrimas',
    'decaído', 'desanimado', 'desesperanzado', 'vacío', 'solo'
  ],
  ansiedad: [
    'ansioso', 'nervioso', 'preocupado', 'angustiado', 'estresado',
    'pánico', 'miedo', 'terror', 'inquieto', 'intranquilo', 'tenso'
  ],
  enojo: [
    'enojado', 'molesto', 'furioso', 'irritado', 'frustrado',
    'rabia', 'ira', 'indignado', 'harto', 'cansado de'
  ],
  felicidad: [
    'feliz', 'contento', 'alegre', 'emocionado', 'bien',
    'genial', 'excelente', 'mejor', 'animado', 'optimista'
  ],
  desesperanza: [
    'imposible', 'sin salida', 'perdido', 'inútil', 'fracaso',
    'no puedo', 'nunca', 'siempre mal', 'todo mal', 'no vale la pena'
  ],
}

/**
 * Modificadores de intensidad
 */
const INTENSIFICADORES = ['muy', 'mucho', 'demasiado', 'extremadamente', 'bastante', 'super', 'súper']
const NEGACIONES = ['no', 'nunca', 'jamás', 'tampoco', 'sin']

/**
 * Analiza el sentimiento de un texto
 * @param texto - Texto a analizar
 * @returns Objeto con puntaje, emoción dominante y nivel de confianza
 */
export function analizarSentimiento(texto: string): SentimientoAnalisis {
  const textoNormalizado = texto.toLowerCase()
  const palabras = textoNormalizado.split(/\s+/)
  
  // Contadores de emociones
  const conteoEmociones: Record<string, number> = {
    tristeza: 0,
    ansiedad: 0,
    enojo: 0,
    felicidad: 0,
    desesperanza: 0,
  }
  
  // Detectar emociones y contar ocurrencias
  let intensidad = 1.0
  let hayNegacion = false
  
  for (let i = 0; i < palabras.length; i++) {
    const palabra = palabras[i]
    
    // Detectar intensificadores
    if (INTENSIFICADORES.includes(palabra)) {
      intensidad = 1.5
      continue
    }
    
    // Detectar negaciones
    if (NEGACIONES.includes(palabra)) {
      hayNegacion = true
      continue
    }
    
    // Contar emociones
    for (const [emocion, palabrasClave] of Object.entries(EMOCIONES_DICCIONARIO)) {
      for (const palabraClave of palabrasClave) {
        if (palabra.includes(palabraClave) || palabraClave.includes(palabra)) {
          const peso = hayNegacion ? 0.3 : intensidad
          conteoEmociones[emocion] += peso
          break
        }
      }
    }
    
    // Resetear modificadores después de cada palabra
    if (!INTENSIFICADORES.includes(palabras[i + 1] || '')) {
      intensidad = 1.0
    }
    if (!NEGACIONES.includes(palabras[i + 1] || '')) {
      hayNegacion = false
    }
  }
  
  // Determinar emoción dominante
  let emocionDominante = 'neutral'
  let maxConteo = 0
  
  for (const [emocion, conteo] of Object.entries(conteoEmociones)) {
    if (conteo > maxConteo) {
      maxConteo = conteo
      emocionDominante = emocion
    }
  }
  
  // Calcular puntaje (0-100)
  // Emociones negativas bajan el puntaje, positivas lo suben
  const puntajeBase = 50
  const impactoNegativo = (
    conteoEmociones.tristeza * 8 +
    conteoEmociones.ansiedad * 6 +
    conteoEmociones.enojo * 5 +
    conteoEmociones.desesperanza * 10
  )
  const impactoPositivo = conteoEmociones.felicidad * 8
  
  let puntaje = puntajeBase - impactoNegativo + impactoPositivo
  puntaje = Math.max(0, Math.min(100, puntaje))
  
  // Calcular confianza basado en cantidad de palabras emocionales detectadas
  const totalPalabrasEmocionales = Object.values(conteoEmociones).reduce((a, b) => a + b, 0)
  const confianza = Math.min(totalPalabrasEmocionales / 3, 1.0)
  
  return {
    puntaje: Math.round(puntaje),
    emocion: emocionDominante,
    confianza: Number(confianza.toFixed(2)),
  }
}

/**
 * Determina si un mensaje requiere atención urgente basado en sentimiento
 * @param sentimiento - Resultado del análisis de sentimiento
 * @returns true si el sentimiento indica crisis
 */
export function requiereAtencionUrgente(sentimiento: SentimientoAnalisis): boolean {
  // Puntaje muy bajo + alta confianza + emoción de desesperanza
  return (
    sentimiento.puntaje < 20 &&
    sentimiento.confianza > 0.5 &&
    (sentimiento.emocion === 'desesperanza' || sentimiento.emocion === 'tristeza')
  )
}
