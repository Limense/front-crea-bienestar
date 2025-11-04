/**
 * Server Actions para el sistema de chatbot
 * Maneja conversaciones, mensajes y análisis de riesgo
 */

'use server'

import { crearClienteServidor } from '@/lib/supabase/servidor'
import { obtenerPerfilUsuario } from '@/lib/auth'
import { 
  obtenerClienteGemini, 
  analizarRiesgo, 
  calcularPuntajeConversacion,
  debeGenerarAlerta,
  PROMPT_BIENVENIDA,
  type MensajeChat,
  type ConversacionChat,
} from '@/lib/gemini'
import type { NivelRiesgo, TipoProblema } from '@/types/database'

interface ResultadoAccion<T = void> {
  exito: boolean
  mensaje?: string
  error?: string
  datos?: T
}

/**
 * Crea una nueva conversación
 * @returns ID de la conversación creada
 */
export async function crearConversacion(): Promise<ResultadoAccion<{ conversacion_id: string; mensaje_bienvenida: string }>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que sea estudiante
    if (perfil.rol !== 'estudiante') {
      return {
        exito: false,
        error: 'Solo los estudiantes pueden usar el chatbot'
      }
    }
    
    // Crear conversación
    const { data: conversacion, error: errorConversacion } = await supabase
      .from('conversaciones')
      .insert({
        estudiante_id: perfil.id,
        titulo: `Conversación ${new Date().toLocaleDateString('es-PE')}`,
        puntaje_riesgo_actual: 0,
        nivel_riesgo_actual: 'BAJO',
        ultima_actividad: new Date().toISOString(),
      })
      .select('id')
      .single()
    
    if (errorConversacion || !conversacion) {
      console.error('Error al crear conversación:', errorConversacion)
      return {
        exito: false,
        error: 'Error al crear la conversación'
      }
    }
    
    // Crear mensaje de bienvenida del bot
    const { error: errorMensaje } = await supabase
      .from('mensajes')
      .insert({
        conversacion_id: conversacion.id,
        contenido: PROMPT_BIENVENIDA,
        remitente: 'bot',
      })
    
    if (errorMensaje) {
      console.error('Error al crear mensaje de bienvenida:', errorMensaje)
    }
    
    return {
      exito: true,
      datos: {
        conversacion_id: conversacion.id,
        mensaje_bienvenida: PROMPT_BIENVENIDA,
      }
    }
  } catch (error) {
    console.error('Error en crearConversacion:', error)
    return {
      exito: false,
      error: 'Error inesperado al crear conversación'
    }
  }
}

/**
 * Envía un mensaje del estudiante y obtiene respuesta del bot
 * @param conversacionId - ID de la conversación
 * @param mensaje - Mensaje del estudiante
 */
export async function enviarMensaje(
  conversacionId: string,
  mensaje: string
): Promise<ResultadoAccion<{ respuesta_bot: string; analisis_riesgo: any }>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que sea estudiante
    if (perfil.rol !== 'estudiante') {
      return {
        exito: false,
        error: 'Solo los estudiantes pueden enviar mensajes'
      }
    }
    
    // Validar que la conversación pertenezca al estudiante
    const { data: conversacion, error: errorConversacion } = await supabase
      .from('conversaciones')
      .select('*')
      .eq('id', conversacionId)
      .eq('estudiante_id', perfil.id)
      .single()
    
    if (errorConversacion || !conversacion) {
      return {
        exito: false,
        error: 'Conversación no encontrada'
      }
    }
    
    // 1. Guardar mensaje del estudiante
    const { error: errorMensajeEstudiante } = await supabase
      .from('mensajes')
      .insert({
        conversacion_id: conversacionId,
        contenido: mensaje,
        remitente: 'estudiante',
      })
    
    if (errorMensajeEstudiante) {
      console.error('Error al guardar mensaje:', errorMensajeEstudiante)
      return {
        exito: false,
        error: 'Error al guardar tu mensaje'
      }
    }
    
    // 2. Analizar riesgo del mensaje
    const { data: mensajesPrevios } = await supabase
      .from('mensajes')
      .select('contenido, remitente')
      .eq('conversacion_id', conversacionId)
      .order('creado_en', { ascending: true })
      .limit(20) // Solo últimos 20 mensajes para contexto (optimización)
    
    const historialPuntajes: number[] = [] // TODO: Obtener puntajes previos si se guardan
    const analisisRiesgo = analizarRiesgo(mensaje, historialPuntajes)
    
    // 3. Generar respuesta con Gemini
    const clienteGemini = obtenerClienteGemini()
    
    if (!clienteGemini.estaListo()) {
      return {
        exito: false,
        error: 'El servicio de chatbot no está disponible en este momento. Por favor contacta directamente con un profesional.'
      }
    }
    
    // Construir historial para el modelo
    const historialGemini = (mensajesPrevios || []).map(m => ({
      rol: m.remitente === 'estudiante' ? 'user' as const : 'model' as const,
      texto: m.contenido,
    }))
    
    const respuestaGemini = await clienteGemini.generarRespuesta(mensaje, historialGemini)
    
    // 4. Guardar respuesta del bot con análisis
    const { error: errorRespuestaBot } = await supabase
      .from('mensajes')
      .insert({
        conversacion_id: conversacionId,
        contenido: respuestaGemini.texto,
        remitente: 'bot',
        sentimiento: {
          puntaje: 100 - analisisRiesgo.factores.sentimiento,
          emocion: 'neutral', // La respuesta del bot es neutral
        },
        palabras_clave_riesgo: analisisRiesgo.palabrasDetectadas.map(p => p.palabra),
      })
    
    if (errorRespuestaBot) {
      console.error('Error al guardar respuesta del bot:', errorRespuestaBot)
    }
    
    // 5. Actualizar puntaje de riesgo de la conversación
    const { error: errorActualizar } = await supabase
      .from('conversaciones')
      .update({
        puntaje_riesgo_actual: analisisRiesgo.puntajeTotal,
        nivel_riesgo_actual: analisisRiesgo.nivel as NivelRiesgo,
        ultima_actividad: new Date().toISOString(),
      })
      .eq('id', conversacionId)
    
    if (errorActualizar) {
      console.error('Error al actualizar conversación:', errorActualizar)
    }
    
    // 6. Verificar si debe generar alerta
    if (debeGenerarAlerta(analisisRiesgo)) {
      // Verificar si ya existe alerta activa
      const { data: alertaExistente } = await supabase
        .from('alertas')
        .select('id')
        .eq('estudiante_id', perfil.id)
        .in('estado', ['pendiente', 'en_progreso'])
        .single()
      
      if (!alertaExistente) {
        // Crear alerta automática
        await crearAlertaAutomatica(perfil.id, conversacionId, analisisRiesgo)
      }
    }
    
    return {
      exito: true,
      datos: {
        respuesta_bot: respuestaGemini.texto,
        analisis_riesgo: analisisRiesgo,
      }
    }
  } catch (error) {
    console.error('Error en enviarMensaje:', error)
    return {
      exito: false,
      error: 'Error al procesar tu mensaje. Por favor intenta de nuevo.'
    }
  }
}

/**
 * Crea una alerta automática cuando se detecta riesgo alto
 */
async function crearAlertaAutomatica(
  estudianteId: string,
  conversacionId: string,
  analisisRiesgo: any
): Promise<void> {
  try {
    const supabase = await crearClienteServidor()
    
    // Determinar tipo de problema dominante
    const categorias = analisisRiesgo.palabrasDetectadas.map((p: any) => p.categoria)
    const categoriaDominante = categorias[0] || 'emocional'
    
    // Mapear categoría a tipo_problema
    const mapeoTipos: Record<string, TipoProblema> = {
      'suicidio': 'emocional',
      'autolesion': 'emocional',
      'depresion': 'emocional',
      'ansiedad': 'emocional',
      'estres': 'emocional',
      'academico': 'academico',
      'economico': 'economico',
      'familiar': 'familiar',
    }
    
    const tipoProblema: TipoProblema = mapeoTipos[categoriaDominante] || 'emocional'
    
    // Obtener resumen de la conversación
    const { data: mensajes } = await supabase
      .from('mensajes')
      .select('contenido, remitente')
      .eq('conversacion_id', conversacionId)
      .order('creado_en', { ascending: false })
      .limit(5)
    
    const resumen = mensajes
      ?.filter(m => m.remitente === 'estudiante')
      .map(m => m.contenido)
      .join(' | ')
      .substring(0, 500) || 'Conversación con riesgo detectado'
    
    // Crear alerta
    const { error } = await supabase
      .from('alertas')
      .insert({
        estudiante_id: estudianteId,
        nivel_riesgo: analisisRiesgo.nivel,
        puntaje_riesgo: analisisRiesgo.puntajeTotal,
        detectado_en: new Date().toISOString(),
        tipo_problema: tipoProblema,
        resumen_conversacion: resumen,
        estado: 'pendiente',
      })
    
    if (error) {
      console.error('Error al crear alerta automática:', error)
    } else {
      console.log('✅ Alerta automática creada para estudiante:', estudianteId)
    }
  } catch (error) {
    console.error('Error en crearAlertaAutomatica:', error)
  }
}

/**
 * Obtiene todas las conversaciones del estudiante actual
 */
export async function obtenerConversaciones(): Promise<ResultadoAccion<ConversacionChat[]>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    const { data: conversaciones, error } = await supabase
      .from('conversaciones')
      .select('*')
      .eq('estudiante_id', perfil.id)
      .order('ultima_actividad', { ascending: false })
    
    if (error) {
      console.error('Error al obtener conversaciones:', error)
      return {
        exito: false,
        error: 'Error al cargar conversaciones'
      }
    }
    
    return {
      exito: true,
      datos: conversaciones || []
    }
  } catch (error) {
    console.error('Error en obtenerConversaciones:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}

/**
 * Obtiene todos los mensajes de una conversación
 */
export async function obtenerMensajes(conversacionId: string): Promise<ResultadoAccion<MensajeChat[]>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que la conversación pertenezca al estudiante
    const { data: conversacion } = await supabase
      .from('conversaciones')
      .select('id')
      .eq('id', conversacionId)
      .eq('estudiante_id', perfil.id)
      .single()
    
    if (!conversacion) {
      return {
        exito: false,
        error: 'Conversación no encontrada'
      }
    }
    
    const { data: mensajes, error } = await supabase
      .from('mensajes')
      .select('*')
      .eq('conversacion_id', conversacionId)
      .order('creado_en', { ascending: true })
    
    if (error) {
      console.error('Error al obtener mensajes:', error)
      return {
        exito: false,
        error: 'Error al cargar mensajes'
      }
    }
    
    return {
      exito: true,
      datos: mensajes || []
    }
  } catch (error) {
    console.error('Error en obtenerMensajes:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}
