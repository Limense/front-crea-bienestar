import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Sidebar } from '@/components/dashboard/sidebar'
import { RolUsuario } from '@/types/database'

interface DashboardLayoutProps {
  children: ReactNode
  requiredRole?: RolUsuario | RolUsuario[]
}

export async function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const supabase = await crearClienteServidor()

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener perfil del usuario
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    redirect('/login')
  }

  // Verificar rol si se especificó
  if (requiredRole) {
    const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!rolesPermitidos.includes(perfil.rol)) {
      // Redirigir al dashboard correcto según su rol
      redirect(`/${perfil.rol}/dashboard`)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        userRole={perfil.rol}
        userName={perfil.nombre_completo}
        userAvatar={perfil.avatar_url}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
