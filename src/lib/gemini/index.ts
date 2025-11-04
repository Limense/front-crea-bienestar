/**
 * Módulo de Chatbot con IA (Google Gemini)
 * Sistema de detección temprana de riesgo de deserción estudiantil
 */

// Cliente principal
export { GeminiClient, obtenerClienteGemini } from './client'

// Tipos
export type {
  RemitenteChat,
  NivelRiesgoChat,
  SentimientoAnalisis,
  PalabraClaveDetectada,
  AnalisisRiesgo,
  MensajeChat,
  ConversacionChat,
  RespuestaGemini,
  ConfiguracionChat,
} from './types'

// Prompts
export {
  SYSTEM_PROMPT_BASE,
  PROMPT_ANALISIS_RIESGO,
  PROMPT_BIENVENIDA,
  PROMPTS_SEGUIMIENTO,
  PROMPTS_CONTEXTO,
} from './prompts'

// Keywords
export {
  PALABRAS_ALTO_RIESGO,
  PALABRAS_RIESGO_MEDIO,
  PALABRAS_RIESGO_BAJO,
  TODAS_PALABRAS_CLAVE,
  detectarPalabrasClave,
  calcularPuntajePalabrasClave,
} from './keywords'

// Sentiment
export {
  analizarSentimiento,
  requiereAtencionUrgente,
} from './sentiment'

// Scoring
export {
  analizarRiesgo,
  calcularPuntajeConversacion,
  debeGenerarAlerta,
} from './scoring'
