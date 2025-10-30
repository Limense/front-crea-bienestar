import { crearClienteServidor } from '@/lib/supabase/servidor'
import { redirect } from 'next/navigation'
import type { Perfil } from '@/types/database'

/**
 * Obtiene el perfil del usuario autenticado
 * Redirige a login si no está autenticado
 */
export async function obtenerPerfilUsuario(): Promise<Perfil> {
  const supabase = await crearClienteServidor()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !perfil) {
    console.error('Error al obtener perfil:', error)
    redirect('/login')
  }

  return perfil
}

/**
 * Verifica que el usuario tenga uno de los roles especificados
 * Redirige al dashboard correcto si no tiene permiso
 */
export async function verificarRol(rolesPermitidos: string | string[]) {
  const perfil = await obtenerPerfilUsuario()
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos]

  if (!roles.includes(perfil.rol)) {
    redirect('/dashboard')
  }

  return perfil
}
