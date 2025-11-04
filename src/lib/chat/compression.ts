/**
 * Utilidad para comprimir conversaciones largas
 * Resume mensajes antiguos para reducir tokens y BD
 */

import { obtenerClienteGemini } from '@/lib/gemini'
import { crearClienteServidor } from '@/lib/supabase/servidor'

/**
 * Comprime una conversación larga en un resumen
 * @param conversacionId - ID de la conversación
 * @returns Resumen de la conversación
 */
export async function comprimirConversacion(conversacionId: string): Promise<string> {
  const supabase = await crearClienteServidor()
  
  // Obtener todos los mensajes
  const { data: mensajes } = await supabase
    .from('mensajes')
    .select('contenido, remitente, creado_en')
    .eq('conversacion_id', conversacionId)
    .order('creado_en', { ascending: true })
  
  if (!mensajes || mensajes.length < 30) {
    return '' // Solo comprimir si hay muchos mensajes
  }
  
  // Tomar solo los primeros 20 mensajes (los más antiguos)
  const mensajesAComprimir = mensajes.slice(0, 20)
  
  // Construir texto de la conversación
  const textoConversacion = mensajesAComprimir
    .map(m => `${m.remitente === 'estudiante' ? 'Estudiante' : 'Bot'}: ${m.contenido}`)
    .join('\n')
  
  // Generar resumen con Gemini
  const cliente = obtenerClienteGemini()
  const prompt = `Resume esta conversación en 3-5 oraciones, enfocándote en los problemas principales mencionados y el estado emocional del estudiante:\n\n${textoConversacion}`
  
  const respuesta = await cliente.generarRespuesta(prompt, [])
  
  return respuesta.texto
}

/**
 * Job para comprimir conversaciones largas periódicamente
 * Ejecutar con pg_cron o como Edge Function
 */
export async function comprimirConversacionesLargas() {
  const supabase = await crearClienteServidor()
  
  // Obtener conversaciones con más de 30 mensajes
  const { data: conversaciones } = await supabase
    .from('conversaciones')
    .select(`
      id,
      estudiante_id,
      mensajes:mensajes(count)
    `)
    .gt('mensajes.count', 30)
  
  if (!conversaciones) return
  
  for (const conv of conversaciones) {
    const resumen = await comprimirConversacion(conv.id)
    
    if (resumen) {
      // Guardar resumen en la conversación
      await supabase
        .from('conversaciones')
        .update({ 
          titulo: resumen.substring(0, 100) // Actualizar título con resumen corto
        })
        .eq('id', conv.id)
      
      // Eliminar mensajes antiguos (dejar solo últimos 10)
      const { data: mensajesOrdenados } = await supabase
        .from('mensajes')
        .select('id')
        .eq('conversacion_id', conv.id)
        .order('creado_en', { ascending: false })
        .limit(100)
      
      if (mensajesOrdenados && mensajesOrdenados.length > 10) {
        const idsAEliminar = mensajesOrdenados
          .slice(10) // Mantener solo los últimos 10
          .map(m => m.id)
        
        await supabase
          .from('mensajes')
          .delete()
          .in('id', idsAEliminar)
      }
    }
  }
}
