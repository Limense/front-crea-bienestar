'use server'

import { crearClienteServidor } from '@/lib/supabase/servidor'
import { obtenerPerfilUsuario } from '@/lib/auth'
import { CrearCitaData } from '@/types/citas'
import { verificarSlotDisponible, puedeAgendarCita } from './disponibilidad'
import { revalidatePath } from 'next/cache'

/**
 * Resultado de una acción del servidor
 */
type ResultadoAccion<T = void> = 
  | { exito: true; datos?: T; mensaje?: string }
  | { exito: false; error: string }

/**
 * Crea una nueva cita
 * @param datos - Datos de la cita a crear
 * @returns Resultado de la operación
 */
export async function agendarCita(
  datos: CrearCitaData
): Promise<ResultadoAccion<{ cita_id: string }>> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // 1. Validar que el usuario sea estudiante
    if (perfil.rol !== 'estudiante') {
      return { 
        exito: false, 
        error: 'Solo los estudiantes pueden agendar citas' 
      }
    }
    
    // 2. Verificar que el estudiante no tenga 3 o más citas pendientes
    const puedeAgendar = await puedeAgendarCita(perfil.id)
    if (!puedeAgendar) {
      return { 
        exito: false, 
        error: 'Has alcanzado el límite de 3 citas pendientes. Por favor, completa o cancela una cita antes de agendar una nueva.' 
      }
    }
    
    // 3. Validar datos básicos
    if (!datos.profesional_id || !datos.fecha_hora || !datos.tipo || !datos.modalidad) {
      return { 
        exito: false, 
        error: 'Faltan datos requeridos' 
      }
    }
    
    const fechaCita = new Date(datos.fecha_hora)
    
    // 4. Verificar que el slot esté disponible
    const verificacion = await verificarSlotDisponible(
      datos.profesional_id,
      fechaCita,
      datos.duracion_minutos || 45
    )
    
    if (!verificacion.disponible) {
      return { 
        exito: false, 
        error: verificacion.motivo || 'El horario seleccionado no está disponible' 
      }
    }
    
    // 5. Verificar que el profesional existe y está activo
    const { data: profesional, error: errorProfesional } = await supabase
      .from('perfiles')
      .select('id, nombre_completo, rol')
      .eq('id', datos.profesional_id)
      .single()
    
    if (errorProfesional || !profesional) {
      return { 
        exito: false, 
        error: 'El profesional seleccionado no existe' 
      }
    }
    
    if (profesional.rol !== 'profesional') {
      return { 
        exito: false, 
        error: 'El usuario seleccionado no es un profesional' 
      }
    }
    
    // 6. Crear la cita
    const { data: cita, error: errorCita } = await supabase
      .from('citas')
      .insert({
        estudiante_id: perfil.id,
        profesional_id: datos.profesional_id,
        fecha_hora: fechaCita.toISOString(),
        tipo: datos.tipo,
        modalidad: datos.modalidad,
        motivo: datos.motivo || null,
        notas: datos.notas || null,
        duracion_minutos: datos.duracion_minutos || 45,
        estado: 'pendiente'
      })
      .select('id')
      .single()
    
    if (errorCita || !cita) {
      console.error('Error al crear cita:', errorCita)
      return { 
        exito: false, 
        error: 'Error al agendar la cita. Por favor, intenta de nuevo.' 
      }
    }
    
    // 7. Crear notificación para el profesional
    await supabase
      .from('notificaciones')
      .insert({
        usuario_id: datos.profesional_id,
        tipo: 'nueva_cita',
        titulo: 'Nueva cita agendada',
        mensaje: `${perfil.nombre_completo} ha agendado una cita para ${new Intl.DateTimeFormat('es-PE', {
          dateStyle: 'long',
          timeStyle: 'short'
        }).format(fechaCita)}`,
        leido: false
      })
    
    // 8. Revalidar rutas relevantes
    revalidatePath('/citas')
    revalidatePath('/dashboard')
    revalidatePath('/profesional')
    
    return { 
      exito: true, 
      datos: { cita_id: cita.id },
      mensaje: 'Cita agendada exitosamente' 
    }
    
  } catch (error) {
    console.error('Error en agendarCita:', error)
    return { 
      exito: false, 
      error: 'Error inesperado al agendar la cita' 
    }
  }
}

/**
 * Cancela una cita existente
 * @param citaId - ID de la cita a cancelar
 * @param motivo - Motivo de cancelación
 * @returns Resultado de la operación
 */
export async function cancelarCita(
  citaId: string,
  motivo?: string
): Promise<ResultadoAccion> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // 1. Verificar que la cita existe y pertenece al usuario
    const { data: cita, error: errorCita } = await supabase
      .from('citas')
      .select('id, estudiante_id, profesional_id, fecha_hora, estado')
      .eq('id', citaId)
      .single()
    
    if (errorCita || !cita) {
      return { 
        exito: false, 
        error: 'La cita no existe' 
      }
    }
    
    // 2. Verificar permisos
    const esEstudiante = perfil.rol === 'estudiante' && cita.estudiante_id === perfil.id
    const esProfesional = perfil.rol === 'profesional' && cita.profesional_id === perfil.id
    const esAdmin = perfil.rol === 'admin'
    
    if (!esEstudiante && !esProfesional && !esAdmin) {
      return { 
        exito: false, 
        error: 'No tienes permisos para cancelar esta cita' 
      }
    }
    
    // 3. Verificar que la cita se pueda cancelar
    if (cita.estado === 'cancelada') {
      return { 
        exito: false, 
        error: 'Esta cita ya fue cancelada' 
      }
    }
    
    if (cita.estado === 'completada') {
      return { 
        exito: false, 
        error: 'No se puede cancelar una cita completada' 
      }
    }
    
    // 4. Verificar que la cita no sea dentro de las próximas 24 horas (solo para estudiantes)
    if (perfil.rol === 'estudiante') {
      const fechaCita = new Date(cita.fecha_hora)
      const horasHastaCita = (fechaCita.getTime() - new Date().getTime()) / (1000 * 60 * 60)
      
      if (horasHastaCita < 24) {
        return { 
          exito: false, 
          error: 'No se puede cancelar una cita con menos de 24 horas de anticipación. Por favor, contacta al profesional.' 
        }
      }
    }
    
    // 5. Actualizar la cita
    const { error: errorActualizar } = await supabase
      .from('citas')
      .update({
        estado: 'cancelada',
        motivo_cancelacion: motivo || 'Sin motivo especificado'
      })
      .eq('id', citaId)
    
    if (errorActualizar) {
      console.error('Error al cancelar cita:', errorActualizar)
      return { 
        exito: false, 
        error: 'Error al cancelar la cita' 
      }
    }
    
    // 6. Crear notificación para la otra parte
    const notificarA = perfil.rol === 'estudiante' ? cita.profesional_id : cita.estudiante_id
    
    await supabase
      .from('notificaciones')
      .insert({
        usuario_id: notificarA,
        tipo: 'cita_cancelada',
        titulo: 'Cita cancelada',
        mensaje: `${perfil.nombre_completo} ha cancelado la cita del ${new Intl.DateTimeFormat('es-PE', {
          dateStyle: 'long',
          timeStyle: 'short'
        }).format(new Date(cita.fecha_hora))}`,
        leido: false
      })
    
    // 7. Revalidar rutas
    revalidatePath('/citas')
    revalidatePath('/dashboard')
    revalidatePath('/profesional')
    
    return { 
      exito: true, 
      mensaje: 'Cita cancelada exitosamente' 
    }
    
  } catch (error) {
    console.error('Error en cancelarCita:', error)
    return { 
      exito: false, 
      error: 'Error inesperado al cancelar la cita' 
    }
  }
}

/**
 * Confirma una cita (solo profesionales)
 * @param citaId - ID de la cita a confirmar
 * @returns Resultado de la operación
 */
export async function confirmarCita(citaId: string): Promise<ResultadoAccion> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // 1. Verificar que el usuario sea profesional
    if (perfil.rol !== 'profesional') {
      return { 
        exito: false, 
        error: 'Solo los profesionales pueden confirmar citas' 
      }
    }
    
    // 2. Verificar que la cita existe y pertenece al profesional
    const { data: cita, error: errorCita } = await supabase
      .from('citas')
      .select('id, estudiante_id, profesional_id, estado')
      .eq('id', citaId)
      .eq('profesional_id', perfil.id)
      .single()
    
    if (errorCita || !cita) {
      return { 
        exito: false, 
        error: 'La cita no existe o no tienes permisos' 
      }
    }
    
    // 3. Verificar estado
    if (cita.estado !== 'pendiente') {
      return { 
        exito: false, 
        error: 'Solo se pueden confirmar citas pendientes' 
      }
    }
    
    // 4. Actualizar estado
    const { error: errorActualizar } = await supabase
      .from('citas')
      .update({ estado: 'confirmada' })
      .eq('id', citaId)
    
    if (errorActualizar) {
      console.error('Error al confirmar cita:', errorActualizar)
      return { 
        exito: false, 
        error: 'Error al confirmar la cita' 
      }
    }
    
    // 5. Notificar al estudiante
    await supabase
      .from('notificaciones')
      .insert({
        usuario_id: cita.estudiante_id,
        tipo: 'cita_confirmada',
        titulo: 'Cita confirmada',
        mensaje: `${perfil.nombre_completo} ha confirmado tu cita`,
        leido: false
      })
    
    // 6. Revalidar
    revalidatePath('/citas')
    revalidatePath('/profesional')
    
    return { 
      exito: true, 
      mensaje: 'Cita confirmada exitosamente' 
    }
    
  } catch (error) {
    console.error('Error en confirmarCita:', error)
    return { 
      exito: false, 
      error: 'Error inesperado al confirmar la cita' 
    }
  }
}

/**
 * Marca una cita como completada (solo profesionales)
 * @param citaId - ID de la cita
 * @param notasProfesional - Notas del profesional (se guardarán en el campo 'notas')
 * @returns Resultado de la operación
 */
export async function completarCita(
  citaId: string,
  notasProfesional?: string
): Promise<ResultadoAccion> {
  try {
    const perfil = await obtenerPerfilUsuario()
    const supabase = await crearClienteServidor()
    
    // 1. Verificar que el usuario sea profesional
    if (perfil.rol !== 'profesional') {
      return { 
        exito: false, 
        error: 'Solo los profesionales pueden completar citas' 
      }
    }
    
    // 2. Verificar que la cita existe
    const { data: cita, error: errorCita } = await supabase
      .from('citas')
      .select('id, estudiante_id, profesional_id, estado, notas')
      .eq('id', citaId)
      .eq('profesional_id', perfil.id)
      .single()
    
    if (errorCita || !cita) {
      return { 
        exito: false, 
        error: 'La cita no existe o no tienes permisos' 
      }
    }
    
    // 3. Verificar estado
    if (cita.estado === 'completada') {
      return { 
        exito: false, 
        error: 'Esta cita ya fue completada' 
      }
    }
    
    if (cita.estado === 'cancelada') {
      return { 
        exito: false, 
        error: 'No se puede completar una cita cancelada' 
      }
    }
    
    // 4. Actualizar - agregar notas del profesional al campo existente
    const notasActualizadas = notasProfesional
      ? (cita.notas ? `${cita.notas}\n\n---\nNotas del profesional:\n${notasProfesional}` : `Notas del profesional:\n${notasProfesional}`)
      : cita.notas
    
    const { error: errorActualizar } = await supabase
      .from('citas')
      .update({
        estado: 'completada',
        notas: notasActualizadas
      })
      .eq('id', citaId)
    
    if (errorActualizar) {
      console.error('Error al completar cita:', errorActualizar)
      return { 
        exito: false, 
        error: 'Error al completar la cita' 
      }
    }
    
    // 5. Notificar
    await supabase
      .from('notificaciones')
      .insert({
        usuario_id: cita.estudiante_id,
        tipo: 'cita_completada',
        titulo: 'Cita completada',
        mensaje: `${perfil.nombre_completo} ha marcado tu cita como completada`,
        leido: false
      })
    
    // 6. Revalidar
    revalidatePath('/citas')
    revalidatePath('/profesional')
    revalidatePath('/dashboard')
    
    return { 
      exito: true, 
      mensaje: 'Cita completada exitosamente' 
    }
    
  } catch (error) {
    console.error('Error en completarCita:', error)
    return { 
      exito: false, 
      error: 'Error inesperado al completar la cita' 
    }
  }
}
