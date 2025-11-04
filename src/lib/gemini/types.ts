/**
 * Tipos y interfaces para el sistema de chatbot con IA
 */

export type RemitenteChat = 'estudiante' | 'bot'

export type NivelRiesgoChat = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO'

export interface SentimientoAnalisis {
  puntaje: number // 0-100 (0 = muy negativo, 100 = muy positivo)
  emocion: string // ej: 'tristeza', 'ansiedad', 'felicidad', 'neutral'
  confianza: number // 0-1 nivel de confianza del análisis
}

export interface PalabraClaveDetectada {
  palabra: string
  categoria: 'suicidio' | 'autolesion' | 'depresion' | 'ansiedad' | 'estres' | 'familiar' | 'academico' | 'economico'
  peso: number // 1-10 (importancia de la palabra)
}

export interface AnalisisRiesgo {
  puntajeTotal: number // 0-100
  nivel: NivelRiesgoChat
  factores: {
    sentimiento: number // 0-100
    palabrasClave: number // 0-100
    contexto: number // 0-100
  }
  palabrasDetectadas: PalabraClaveDetectada[]
  requiereAlerta: boolean // true si puntaje >= 60
  recomendacion: string
}

export interface MensajeChat {
  id?: string
  conversacion_id: string
  contenido: string
  remitente: RemitenteChat
  sentimiento?: SentimientoAnalisis
  palabras_clave_riesgo?: string[]
  creado_en?: string
}

export interface ConversacionChat {
  id?: string
  estudiante_id: string
  titulo: string
  puntaje_riesgo_actual: number
  nivel_riesgo_actual: NivelRiesgoChat
  ultima_actividad?: string
  creado_en?: string
  actualizado_en?: string
}

export interface RespuestaGemini {
  texto: string
  analisisRiesgo?: AnalisisRiesgo
  metadata?: {
    model: string
    tokensUsados?: number
    tiempoRespuesta?: number
  }
}

export interface ConfiguracionChat {
  temperature: number // 0-1 (creatividad)
  maxTokens: number
  topK: number
  topP: number
}
