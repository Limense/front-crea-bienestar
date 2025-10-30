import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, BookOpen, AlertCircle, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { obtenerPerfilUsuario } from '@/lib/auth'

export default async function EstudianteDashboardPage() {
  const perfil = await obtenerPerfilUsuario()
  const supabase = await crearClienteServidor()

  // Obtener próximas citas del estudiante
  const { data: citas } = await supabase
    .from('citas')
    .select(`
      *,
      profesional:perfiles!citas_profesional_id_fkey(nombre_completo, especialidad)
    `)
    .eq('estudiante_id', perfil.id)
    .in('estado', ['pendiente', 'confirmada'])
    .gte('fecha_hora', new Date().toISOString())
    .order('fecha_hora', { ascending: true })
    .limit(3)

  // Obtener conversaciones del chatbot
  const { data: conversaciones, count: totalConversaciones } = await supabase
    .from('conversaciones')
    .select('*', { count: 'exact' })
    .eq('estudiante_id', perfil.id)

  // Obtener recursos (todos para mostrar recomendados)
  const { data: recursos } = await supabase
    .from('recursos')
    .select('*')
    .limit(3)

  // Obtener próximos talleres
  const { data: talleres } = await supabase
    .from('talleres')
    .select(`
      *,
      facilitador:perfiles!talleres_facilitador_id_fkey(nombre_completo)
    `)
    .eq('estado', 'programado')
    .gte('fecha_hora', new Date().toISOString())
    .order('fecha_hora', { ascending: true })
    .limit(2)

  // Calcular nivel de bienestar basado en conversaciones
  const nivelBienestar = conversaciones && conversaciones.length > 0
    ? conversaciones[0].nivel_riesgo_actual === 'BAJO' || conversaciones[0].nivel_riesgo_actual === 'MEDIO'
      ? 'Bueno'
      : 'Requiere Atención'
    : 'Sin Evaluar'

  return (
    <DashboardLayout requiredRole="estudiante">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
          <p className="text-gray-500">Bienvenido a tu espacio de bienestar</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{citas?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {citas?.length ? 'Esta semana' : 'No tienes citas'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversaciones || 0}</div>
              <p className="text-xs text-muted-foreground">
                Con el chatbot
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recursos Disponibles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                En la biblioteca
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel de Bienestar</CardTitle>
              <TrendingUp className={`h-4 w-4 ${nivelBienestar === 'Bueno' ? 'text-green-600' : 'text-yellow-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${nivelBienestar === 'Bueno' ? 'text-green-600' : 'text-yellow-600'}`}>
                {nivelBienestar}
              </div>
              <p className="text-xs text-muted-foreground">
                {conversaciones?.length ? 'Última evaluación' : 'Usa el chatbot'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chatbot Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chatbot de Bienestar
              </CardTitle>
              <CardDescription>
                Conversa con nuestro asistente virtual sobre tus preocupaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Estoy aquí para escucharte y ayudarte. Puedes hablar conmigo sobre estrés, 
                problemas académicos, emociones, o cualquier cosa que te preocupe.
              </p>
              <Link href="/chatbot">
                <Button className="w-full">
                  Iniciar Conversación
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Próximas Citas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Citas
              </CardTitle>
              <CardDescription>
                Tus consultas programadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {citas && citas.length > 0 ? (
                <div className="space-y-3">
                  {citas.map((cita) => (
                    <div key={cita.id} className="flex items-start justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {cita.tipo === 'psicologia' ? 'Psicología' : 'Medicina Ocupacional'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cita.profesional?.nombre_completo || 'Profesional'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(cita.fecha_hora).toLocaleDateString('es-PE', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={cita.modalidad === 'virtual' ? 'default' : 'outline'}>
                        {cita.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No tienes citas programadas</p>
                  <Link href="/citas">
                    <Button variant="outline" className="mt-4">
                      Agendar Cita
                    </Button>
                  </Link>
                </div>
              )}

              {citas && citas.length > 0 && (
                <Link href="/citas">
                  <Button variant="outline" className="w-full">
                    Ver Todas las Citas
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recursos Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recursos Recomendados
              </CardTitle>
              <CardDescription>
                Material educativo para ti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recursos && recursos.length > 0 ? (
                <div className="space-y-2">
                  {recursos.map((recurso) => (
                    <div key={recurso.id} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{recurso.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {recurso.tipo_contenido === 'video' && '📹 Video'}
                        {recurso.tipo_contenido === 'pdf' && '📄 PDF'}
                        {recurso.tipo_contenido === 'articulo' && '📰 Artículo'}
                        {recurso.tipo_contenido === 'audio' && '🎧 Audio'}
                        {recurso.tipo_contenido === 'infografia' && '📊 Infografía'}
                        {' • '}
                        {recurso.categoria.charAt(0).toUpperCase() + recurso.categoria.slice(1)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay recursos disponibles
                </p>
              )}
              <Link href="/recursos">
                <Button variant="outline" className="w-full">
                  Ver Todos los Recursos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Talleres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Próximos Talleres
              </CardTitle>
              <CardDescription>
                Eventos y workshops disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {talleres && talleres.length > 0 ? (
                <div className="space-y-2">
                  {talleres.map((taller) => {
                    const cuposDisponibles = taller.capacidad_maxima - taller.conteo_inscritos
                    const porcentajeOcupado = (taller.conteo_inscritos / taller.capacidad_maxima) * 100
                    
                    return (
                      <div key={taller.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{taller.titulo}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(taller.fecha_hora).toLocaleDateString('es-PE', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge className={
                            porcentajeOcupado < 50 ? 'bg-green-100 text-green-700' :
                            porcentajeOcupado < 80 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {cuposDisponibles} cupos
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay talleres programados
                </p>
              )}
              <Link href="/talleres">
                <Button variant="outline" className="w-full">
                  Ver Todos los Talleres
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
