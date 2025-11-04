/**
 * Cliente de Google Gemini API para el chatbot CREA Bienestar
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { GenerateContentResult } from '@google/generative-ai'
import { RespuestaGemini, ConfiguracionChat } from './types'
import { SYSTEM_PROMPT_BASE } from './prompts'

// Validar que la API key esté configurada
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY no está configurada en las variables de entorno')
}

/**
 * Configuración por defecto del modelo
 */
const CONFIG_DEFAULT: ConfiguracionChat = {
  temperature: 0.7, // Balance entre creatividad y consistencia
  maxTokens: 500, // Respuestas concisas
  topK: 40,
  topP: 0.95,
}

/**
 * Configuración de seguridad
 * Importante: NO bloqueamos contenido de autolesión/suicidio porque necesitamos detectarlo
 */
const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Necesitamos detectar contenido de riesgo
  },
]

/**
 * Clase cliente para interactuar con Gemini API
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  private config: ConfiguracionChat

  constructor(config: Partial<ConfiguracionChat> = {}) {
    this.config = { ...CONFIG_DEFAULT, ...config }
    
    // Inicializar solo si hay API key
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro', // Modelo más potente y reciente
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
          topK: this.config.topK,
          topP: this.config.topP,
        },
      })
    }
  }

  /**
   * Genera una respuesta del chatbot
   * @param mensajeUsuario - Mensaje del estudiante
   * @param historialConversacion - Mensajes previos de la conversación (opcional)
   * @returns Respuesta del bot con metadata
   */
  async generarRespuesta(
    mensajeUsuario: string,
    historialConversacion: { rol: 'user' | 'model'; texto: string }[] = []
  ): Promise<RespuestaGemini> {
    // Validar que el cliente esté inicializado
    if (!this.model) {
      throw new Error('Gemini API no está configurada. Verifica tu GEMINI_API_KEY.')
    }

    const tiempoInicio = Date.now()

    try {
      // Construir el contexto completo
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'Contexto del sistema' }],
          },
          {
            role: 'model',
            parts: [{ text: SYSTEM_PROMPT_BASE }],
          },
          ...historialConversacion.map(msg => ({
            role: msg.rol,
            parts: [{ text: msg.texto }],
          })),
        ],
      })

      // Enviar mensaje del usuario
      const result: GenerateContentResult = await chat.sendMessage(mensajeUsuario)
      const response = result.response
      const textoRespuesta = response.text()

      // Calcular tiempo de respuesta
      const tiempoRespuesta = Date.now() - tiempoInicio

      return {
        texto: textoRespuesta,
        metadata: {
          model: 'gemini-1.5-pro',
          tokensUsados: response.usageMetadata?.totalTokenCount,
          tiempoRespuesta,
        },
      }
    } catch (error) {
      console.error('Error al generar respuesta con Gemini:', error)
      
      // Respuesta de fallback
      return {
        texto: 'Disculpa, estoy teniendo problemas técnicos en este momento. ¿Podrías intentar de nuevo o contactar directamente con un profesional de CREA? Tu bienestar es importante. ❤️',
        metadata: {
          model: 'gemini-1.5-pro',
          tiempoRespuesta: Date.now() - tiempoInicio,
        },
      }
    }
  }

  /**
   * Verifica si el cliente está listo para usar
   */
  estaListo(): boolean {
    return this.model !== null
  }
}

/**
 * Instancia singleton del cliente
 */
let clienteGlobal: GeminiClient | null = null

/**
 * Obtiene la instancia del cliente Gemini (singleton)
 */
export function obtenerClienteGemini(): GeminiClient {
  if (!clienteGlobal) {
    clienteGlobal = new GeminiClient()
  }
  return clienteGlobal
}
