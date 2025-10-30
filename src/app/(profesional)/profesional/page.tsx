import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, AlertTriangle, TrendingUp, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function ProfesionalDashboardPage() {
  return (
    <DashboardLayout requiredRole="profesional">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Profesional</h1>
          <p className="text-gray-500">Panel de control para psicólogo/médico</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                4 completadas, 2 pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Pendientes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Asistencia</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-xs text-muted-foreground">
                Último mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agenda del Día */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda del Día
              </CardTitle>
              <CardDescription>
                Martes, 29 de Octubre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600">Completada</Badge>
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">9:00 AM</span>
                    </div>
                    <p className="text-sm font-medium">Ana María López</p>
                    <p className="text-xs text-gray-600">Seguimiento - Ansiedad</p>
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600">En curso</Badge>
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">11:00 AM</span>
                    </div>
                    <p className="text-sm font-medium">Carlos Ramírez</p>
                    <p className="text-xs text-gray-600">Primera consulta</p>
                  </div>
                  <Button size="sm">Iniciar</Button>
                </div>

                <div className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pendiente</Badge>
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">2:00 PM</span>
                    </div>
                    <p className="text-sm font-medium">María Fernández</p>
                    <p className="text-xs text-gray-600">Seguimiento - Estrés académico</p>
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pendiente</Badge>
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">4:00 PM</span>
                    </div>
                    <p className="text-sm font-medium">Pedro Sánchez</p>
                    <p className="text-xs text-gray-600">Evaluación inicial</p>
                  </div>
                </div>
              </div>

              <Link href="/citas">
                <Button variant="outline" className="w-full">
                  Ver Calendario Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Alertas de Riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Alertas de Riesgo
              </CardTitle>
              <CardDescription>
                Estudiantes que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-600">Alto Riesgo</Badge>
                        <span className="text-xs text-gray-500">Hace 2 horas</span>
                      </div>
                      <p className="text-sm font-medium">Lucía Torres</p>
                      <p className="text-xs text-gray-600">Riesgo emocional detectado</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-600">Medio Riesgo</Badge>
                        <span className="text-xs text-gray-500">Ayer</span>
                      </div>
                      <p className="text-sm font-medium">Roberto Díaz</p>
                      <p className="text-xs text-gray-600">Estrés académico</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-600">Medio Riesgo</Badge>
                        <span className="text-xs text-gray-500">Hace 3 días</span>
                      </div>
                      <p className="text-sm font-medium">Sofía Mendoza</p>
                      <p className="text-xs text-gray-600">Problemas familiares</p>
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

          {/* Pacientes Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pacientes Recientes
              </CardTitle>
              <CardDescription>
                Últimas consultas realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {['Ana López', 'Carlos Ramírez', 'María Fernández', 'Pedro Sánchez'].map((nombre) => (
                  <div key={nombre} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{nombre}</p>
                      <p className="text-xs text-gray-500">Última cita: Hace 2 días</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver Historial
                    </Button>
                  </div>
                ))}
              </div>

              <Link href="/estudiantes">
                <Button variant="outline" className="w-full">
                  Ver Todos los Estudiantes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reportes y Estadísticas
              </CardTitle>
              <CardDescription>
                Métricas de tu práctica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Citas completadas (mes)</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasa de asistencia</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Satisfacción promedio</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>

              <Link href="/reportes">
                <Button variant="outline" className="w-full">
                  Ver Reportes Completos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
