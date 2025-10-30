'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  LogOut, 
  LucideIcon,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  BookOpen,
  AlertCircle,
  Users,
  FileText,
  Settings,
  GraduationCap
} from 'lucide-react'
import { RolUsuario } from '@/types/database'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  roles: RolUsuario[]
}

const getNavItems = (role: RolUsuario): NavItem[] => {
  // Dashboard específico por rol
  const dashboardHref = role === 'estudiante' ? '/dashboard' : `/${role}`
  
  const allItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: dashboardHref,
      icon: LayoutDashboard,
      roles: ['estudiante', 'profesional', 'tutor', 'admin'] as RolUsuario[]
    },
    {
      label: 'Chatbot',
      href: '/chatbot',
      icon: MessageSquare,
      roles: ['estudiante'] as RolUsuario[]
    },
  {
    label: 'Mis Citas',
    href: '/citas',
    icon: Calendar,
    roles: ['estudiante', 'profesional'] as RolUsuario[]
  },
  {
    label: 'Recursos',
    href: '/recursos',
    icon: BookOpen,
    roles: ['estudiante', 'profesional', 'tutor', 'admin'] as RolUsuario[]
  },
  {
    label: 'Talleres',
    href: '/talleres',
    icon: GraduationCap,
    roles: ['estudiante', 'profesional', 'tutor', 'admin'] as RolUsuario[]
  },
  {
    label: 'Alertas',
    href: '/alertas',
    icon: AlertCircle,
    roles: ['tutor', 'profesional', 'admin'] as RolUsuario[]
  },
  {
    label: 'Estudiantes',
    href: '/estudiantes',
    icon: Users,
    roles: ['profesional', 'tutor', 'admin'] as RolUsuario[]
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: FileText,
    roles: ['admin', 'tutor'] as RolUsuario[]
  },
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: Settings,
    roles: ['estudiante', 'profesional', 'tutor', 'admin'] as RolUsuario[]
  }
]

  return allItems.filter(item => item.roles.includes(role))
}

interface SidebarProps {
  userRole: RolUsuario
  userName: string
  userEmail: string
  userAvatar?: string
}

export function Sidebar({ userRole, userName, userAvatar }: Omit<SidebarProps, 'userEmail'>) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = crearClienteNavegador()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredNavItems = getNavItems(userRole)

  const getRoleLabel = (role: RolUsuario) => {
    const labels: Record<RolUsuario, string> = {
      estudiante: 'Estudiante',
      profesional: 'Profesional',
      tutor: 'Tutor',
      admin: 'Administrador'
    }
    return labels[role]
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-xl font-bold text-white">CB</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">CREA</h1>
            <p className="text-xs text-gray-500">Bienestar</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
            <p className="truncate text-xs text-gray-500">{getRoleLabel(userRole)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
