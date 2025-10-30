import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Users, TrendingDown, FileText, Bell } from 'lucide-react'
import Link from 'next/link'

export default async function TutorDashboardPage() {
  return (
    <DashboardLayout requiredRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Tutor</h1>
          <p className="text-gray-500">Panel de seguimiento y alertas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes Asignados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                Bajo tu tutela
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <p className="text-xs text-muted-foreground">
                Requieren seguimiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Críticos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">
                Atención inmediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Nuevas hoy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alertas Críticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Alertas Críticas
              </CardTitle>
              <CardDescription>
                Estudiantes que necesitan atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">Laura Martínez</p>
                        <p className="text-xs text-gray-600">Semestre 4</p>
                      </div>
                      <Badge className="bg-red-600">Crítico</Badge>
                    </div>
                    <p className="text-xs text-gray-700">
                      Riesgo emocional alto detectado. Conversación con chatbot indica posible crisis.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Contactar</Button>
                      <Button size="sm" variant="outline" className="flex-1">Ver Detalles</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">Diego Vargas</p>
                        <p className="text-xs text-gray-600">Semestre 2</p>
                      </div>
                      <Badge className="bg-red-600">Crítico</Badge>
                    </div>
                    <p className="text-xs text-gray-700">
                      Faltas recurrentes y bajo rendimiento académico. Posible deserción.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Contactar</Button>
                      <Button size="sm" variant="outline" className="flex-1">Ver Detalles</Button>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/alertas">
                <Button variant="outline" className="w-full">
                  Ver Todas las Alertas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Alertas Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertas Recientes
              </CardTitle>
              <CardDescription>
                Notificaciones de seguimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-600">Medio</Badge>
                        <span className="text-xs text-gray-500">Hace 1 hora</span>
                      </div>
                      <p className="text-sm font-medium">Carmen Flores</p>
                      <p className="text-xs text-gray-600">Estrés académico - Exámenes finales</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-600">Medio</Badge>
                        <span className="text-xs text-gray-500">Hace 3 horas</span>
                      </div>
                      <p className="text-sm font-medium">Miguel Ángeles</p>
                      <p className="text-xs text-gray-600">Problemas económicos reportados</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">Bajo</Badge>
                        <span className="text-xs text-gray-500">Ayer</span>
                      </div>
                      <p className="text-sm font-medium">Andrea Rojas</p>
                      <p className="text-xs text-gray-600">Consulta general sobre organización</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Ver Historial Completo
              </Button>
            </CardContent>
          </Card>

          {/* Estudiantes Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mis Estudiantes
              </CardTitle>
              <CardDescription>
                Estudiantes bajo tu tutela
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  { nombre: 'Laura Martínez', semestre: 4, estado: 'Crítico', color: 'red' },
                  { nombre: 'Diego Vargas', semestre: 2, estado: 'Crítico', color: 'red' },
                  { nombre: 'Carmen Flores', semestre: 3, estado: 'Atención', color: 'yellow' },
                  { nombre: 'Andrea Rojas', semestre: 5, estado: 'Normal', color: 'green' },
                ].map((estudiante) => (
                  <div key={estudiante.nombre} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{estudiante.nombre}</p>
                      <p className="text-xs text-gray-500">Semestre {estudiante.semestre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${estudiante.color}-100 text-${estudiante.color}-700`}>
                        {estudiante.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/estudiantes">
                <Button variant="outline" className="w-full">
                  Ver Todos (28)
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reportes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reportes de Seguimiento
              </CardTitle>
              <CardDescription>
                Estadísticas y métricas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Alertas resueltas (mes)</span>
                    <span className="font-medium">12/15</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Casos críticos activos</span>
                    <span className="font-medium text-red-600">2</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-red-600" style={{ width: '7%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Seguimientos programados</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>

              <Link href="/reportes">
                <Button variant="outline" className="w-full">
                  Generar Reporte Completo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
