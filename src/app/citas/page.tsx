import { obtenerPerfilUsuario } from '@/lib/auth'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { CitaConRelaciones } from '@/types/database'
import { ListaCitasClient } from './lista-citas-client'

interface PageProps {
  searchParams: Promise<{
    estado?: string
    tipo?: string
    modalidad?: string
    buscar?: string
  }>
}

export default async function CitasPage({ searchParams }: PageProps) {
  const perfil = await obtenerPerfilUsuario()
  const supabase = await crearClienteServidor()
  const params = await searchParams
  
  // Obtener citas según el rol
  let query = supabase
    .from('citas')
    .select(`
      *,
      profesional:perfiles!profesional_id(id, nombre_completo, email, especialidad, avatar_url),
      estudiante:perfiles!estudiante_id(id, nombre_completo, email, avatar_url)
    `)
  
  // Filtrar por usuario según rol
  if (perfil.rol === 'estudiante') {
    query = query.eq('estudiante_id', perfil.id)
  } else if (perfil.rol === 'profesional') {
    query = query.eq('profesional_id', perfil.id)
  }
  
  // Aplicar filtros de búsqueda server-side
  if (params.estado) {
    query = query.eq('estado', params.estado)
  }
  
  if (params.tipo) {
    query = query.eq('tipo', params.tipo)
  }
  
  if (params.modalidad) {
    query = query.eq('modalidad', params.modalidad)
  }
  
  // Ordenar por fecha
  query = query.order('fecha_hora', { ascending: true })
  
  const { data: citasData, error } = await query
  
  if (error) {
    console.error('Error al obtener citas:', error)
  }
  
  const citas = (citasData || []) as CitaConRelaciones[]
  
  return (
    <DashboardLayout>
      <ListaCitasClient citasIniciales={citas} rol={perfil.rol} />
    </DashboardLayout>
  )
}
