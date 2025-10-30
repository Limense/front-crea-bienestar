import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Activity, AlertTriangle, TrendingUp, Settings, Database, Shield } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
          <p className="text-gray-500">Panel de control del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">
                +12 este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividad del Sistema</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                Sesiones activas hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-muted-foreground">
                Sistema y seguridad
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Uso</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground">
                Usuarios activos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gestión de Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administración de cuentas y permisos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Estudiantes</p>
                    <p className="text-xs text-gray-500">250 activos</p>
                  </div>
                  <Button size="sm" variant="outline">Gestionar</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Profesionales</p>
                    <p className="text-xs text-gray-500">18 activos</p>
                  </div>
                  <Button size="sm" variant="outline">Gestionar</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Tutores</p>
                    <p className="text-xs text-gray-500">12 activos</p>
                  </div>
                  <Button size="sm" variant="outline">Gestionar</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Administradores</p>
                    <p className="text-xs text-gray-500">4 activos</p>
                  </div>
                  <Button size="sm" variant="outline">Gestionar</Button>
                </div>
              </div>

              <Link href="/usuarios">
                <Button className="w-full">
                  Ver Todos los Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estado del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
              <CardDescription>
                Monitoreo en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Base de Datos</span>
                    <span className="font-medium text-green-600">Operativo</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">API Gemini</span>
                    <span className="font-medium text-green-600">Operativo</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Almacenamiento</span>
                    <span className="font-medium text-yellow-600">65% usado</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-yellow-600" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rendimiento</span>
                    <span className="font-medium text-green-600">Excelente</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Ver Detalles Técnicos
              </Button>
            </CardContent>
          </Card>

          {/* Configuración Rápida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración Rápida
              </CardTitle>
              <CardDescription>
                Accesos directos a ajustes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/configuracion/general">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Configuración General
                </Button>
              </Link>
              <Link href="/configuracion/seguridad">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Seguridad y Privacidad
                </Button>
              </Link>
              <Link href="/configuracion/notificaciones">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Notificaciones
                </Button>
              </Link>
              <Link href="/configuracion/respaldos">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Respaldos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Últimos eventos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 rounded-lg border p-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-600"></div>
                  <div>
                    <p className="font-medium">Nuevo usuario registrado</p>
                    <p className="text-xs text-gray-500">Hace 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border p-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="font-medium">Actualización de sistema</p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border p-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-yellow-600"></div>
                  <div>
                    <p className="font-medium">Alerta de capacidad de almacenamiento</p>
                    <p className="text-xs text-gray-500">Hace 4 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg border p-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-600"></div>
                  <div>
                    <p className="font-medium">Respaldo completado exitosamente</p>
                    <p className="text-xs text-gray-500">Ayer</p>
                  </div>
                </div>
              </div>

              <Link href="/registros-auditoria">
                <Button variant="outline" className="w-full">
                  Ver Registro Completo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
