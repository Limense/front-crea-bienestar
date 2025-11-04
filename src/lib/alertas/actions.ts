/**
 * Server Actions para el sistema de alertas
 * Gestión de alertas de riesgo generadas por el chatbot
 */

'use server'

import { crearClienteServidor } from '@/lib/supabase/servidor'
import { obtenerPerfilUsuario } from '@/lib/auth'
import type { Alerta, NivelRiesgo, EstadoAlerta } from '@/types/database'

interface ResultadoAccion<T = void> {
  exito: boolean
  mensaje?: string
  error?: string
  datos?: T
}

export interface AlertaConRelaciones extends Alerta {
  estudiante: {
    nombre_completo: string
    email: string
    semestre?: number
  }
  tutor_asignado?: {
    nombre_completo: string
    email: string
  }
}

/**
 * Obtiene todas las alertas (para tutores y admins)
 * @param filtros - Filtros opcionales por nivel, estado, etc.
 */
export async function obtenerAlertas(filtros?: {
  nivel_riesgo?: NivelRiesgo
  estado?: EstadoAlerta
  asignado_a?: string
}): Promise<ResultadoAccion<AlertaConRelaciones[]>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que sea tutor o admin
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'Solo tutores y administradores pueden ver alertas'
      }
    }
    
    // Construir query base
    let query = supabase
      .from('alertas')
      .select(`
        *,
        estudiante:perfiles!alertas_estudiante_id_fkey(
          nombre_completo,
          email,
          semestre
        ),
        tutor_asignado:perfiles!alertas_asignado_a_fkey(
          nombre_completo,
          email
        )
      `)
      .order('detectado_en', { ascending: false })
    
    // Aplicar filtros si existen
    if (filtros?.nivel_riesgo) {
      query = query.eq('nivel_riesgo', filtros.nivel_riesgo)
    }
    
    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado)
    }
    
    if (filtros?.asignado_a) {
      if (filtros.asignado_a === 'sin_asignar') {
        query = query.is('asignado_a', null)
      } else {
        query = query.eq('asignado_a', filtros.asignado_a)
      }
    }
    
    const { data: alertas, error } = await query
    
    if (error) {
      console.error('Error al obtener alertas:', error)
      return {
        exito: false,
        error: 'Error al cargar alertas'
      }
    }
    
    return {
      exito: true,
      datos: alertas || []
    }
  } catch (error) {
    console.error('Error en obtenerAlertas:', error)
    return {
      exito: false,
      error: 'Error inesperado al cargar alertas'
    }
  }
}

/**
 * Obtiene una alerta específica por ID
 */
export async function obtenerAlertaPorId(alertaId: string): Promise<ResultadoAccion<AlertaConRelaciones>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar rol
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'No tienes permiso para ver esta alerta'
      }
    }
    
    const { data: alerta, error } = await supabase
      .from('alertas')
      .select(`
        *,
        estudiante:perfiles!alertas_estudiante_id_fkey(
          nombre_completo,
          email,
          semestre,
          telefono
        ),
        tutor_asignado:perfiles!alertas_asignado_a_fkey(
          nombre_completo,
          email
        )
      `)
      .eq('id', alertaId)
      .single()
    
    if (error || !alerta) {
      console.error('Error al obtener alerta:', error)
      return {
        exito: false,
        error: 'Alerta no encontrada'
      }
    }
    
    return {
      exito: true,
      datos: alerta
    }
  } catch (error) {
    console.error('Error en obtenerAlertaPorId:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}

/**
 * Asigna una alerta a un tutor
 */
export async function asignarAlerta(
  alertaId: string,
  tutorId: string
): Promise<ResultadoAccion> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que sea tutor o admin
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'No tienes permiso para asignar alertas'
      }
    }
    
    // Actualizar alerta
    const { error } = await supabase
      .from('alertas')
      .update({
        asignado_a: tutorId,
        estado: 'en_progreso',
        fecha_intervencion: new Date().toISOString()
      })
      .eq('id', alertaId)
    
    if (error) {
      console.error('Error al asignar alerta:', error)
      return {
        exito: false,
        error: 'Error al asignar la alerta'
      }
    }
    
    // Crear notificación para el tutor
    await supabase
      .from('notificaciones')
      .insert({
        usuario_id: tutorId,
        tipo: 'alerta',
        titulo: 'Nueva alerta asignada',
        mensaje: 'Se te ha asignado una nueva alerta de riesgo'
      })
    
    return {
      exito: true,
      mensaje: 'Alerta asignada correctamente'
    }
  } catch (error) {
    console.error('Error en asignarAlerta:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}

/**
 * Actualiza el estado de una alerta
 */
export async function actualizarEstadoAlerta(
  alertaId: string,
  nuevoEstado: EstadoAlerta,
  descripcionIntervencion?: string
): Promise<ResultadoAccion> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar que sea tutor o admin
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'No tienes permiso para actualizar alertas'
      }
    }
    
    const updateData: any = {
      estado: nuevoEstado
    }
    
    // Si se marca como resuelta, agregar timestamp
    if (nuevoEstado === 'resuelto') {
      updateData.resuelto_en = new Date().toISOString()
    }
    
    // Si hay descripción, agregarla
    if (descripcionIntervencion) {
      updateData.descripcion_intervencion = descripcionIntervencion
    }
    
    const { error } = await supabase
      .from('alertas')
      .update(updateData)
      .eq('id', alertaId)
    
    if (error) {
      console.error('Error al actualizar alerta:', error)
      return {
        exito: false,
        error: 'Error al actualizar el estado'
      }
    }
    
    return {
      exito: true,
      mensaje: `Alerta marcada como ${nuevoEstado}`
    }
  } catch (error) {
    console.error('Error en actualizarEstadoAlerta:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}

/**
 * Obtiene estadísticas de alertas
 */
export async function obtenerEstadisticasAlertas(): Promise<ResultadoAccion<{
  total: number
  pendientes: number
  enProgreso: number
  resueltas: number
  porNivel: {
    alto: number
    medio: number
    bajo: number
  }
}>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar rol
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'No tienes permiso'
      }
    }
    
    // Obtener todas las alertas
    const { data: alertas, error } = await supabase
      .from('alertas')
      .select('estado, nivel_riesgo')
    
    if (error) {
      console.error('Error al obtener estadísticas:', error)
      return {
        exito: false,
        error: 'Error al cargar estadísticas'
      }
    }
    
    // Calcular estadísticas
    const stats = {
      total: alertas?.length || 0,
      pendientes: alertas?.filter(a => a.estado === 'pendiente').length || 0,
      enProgreso: alertas?.filter(a => a.estado === 'en_progreso').length || 0,
      resueltas: alertas?.filter(a => a.estado === 'resuelto').length || 0,
      porNivel: {
        alto: alertas?.filter(a => a.nivel_riesgo === 'ALTO').length || 0,
        medio: alertas?.filter(a => a.nivel_riesgo === 'MEDIO').length || 0,
        bajo: alertas?.filter(a => a.nivel_riesgo === 'BAJO').length || 0,
      }
    }
    
    return {
      exito: true,
      datos: stats
    }
  } catch (error) {
    console.error('Error en obtenerEstadisticasAlertas:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}

/**
 * Obtiene la conversación relacionada con una alerta
 */
export async function obtenerConversacionAlerta(alertaId: string): Promise<ResultadoAccion<any>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // Validar rol
    if (perfil.rol !== 'tutor' && perfil.rol !== 'admin') {
      return {
        exito: false,
        error: 'No tienes permiso'
      }
    }
    
    // Obtener alerta para obtener el detectado_en
    const { data: alerta } = await supabase
      .from('alertas')
      .select('detectado_en, estudiante_id')
      .eq('id', alertaId)
      .single()
    
    if (!alerta) {
      return { exito: false, error: 'Alerta no encontrada' }
    }
    
    // Obtener conversaciones recientes del estudiante
    const { data: conversaciones, error } = await supabase
      .from('conversaciones')
      .select(`
        *,
        mensajes:mensajes(
          id,
          contenido,
          remitente,
          creado_en
        )
      `)
      .eq('estudiante_id', alerta.estudiante_id)
      .order('creado_en', { ascending: false })
      .limit(3)
    
    if (error) {
      console.error('Error al obtener conversación:', error)
      return {
        exito: false,
        error: 'Error al cargar conversación'
      }
    }
    
    return {
      exito: true,
      datos: conversaciones || []
    }
  } catch (error) {
    console.error('Error en obtenerConversacionAlerta:', error)
    return {
      exito: false,
      error: 'Error inesperado'
    }
  }
}
