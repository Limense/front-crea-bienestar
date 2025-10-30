import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { BookOpen, Download, ExternalLink, FileText, Video, Music, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recursos de Bienestar - CREA Bienestar',
  description: 'Accede a videos, guías, PDFs y recursos educativos sobre salud mental y bienestar estudiantil en EESPP CREA.',
  keywords: ['recursos', 'salud mental', 'autocuidado', 'videos educativos', 'guías', 'EESPP CREA'],
  openGraph: {
    title: 'Recursos de Bienestar - CREA Bienestar',
    description: 'Biblioteca de recursos educativos sobre bienestar estudiantil',
    type: 'website',
  },
}

export default async function RecursosPage() {
  const supabase = await crearClienteServidor()

  // Obtener todos los recursos
  const { data: recursos } = await supabase
    .from('recursos')
    .select('*')
    .order('creado_en', { ascending: false })

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'video': return <Video className="h-5 w-5" />
      case 'pdf': return <FileText className="h-5 w-5" />
      case 'audio': return <Music className="h-5 w-5" />
      case 'infografia': return <ImageIcon className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getCategoriaColor = (categoria: string) => {
    const colores: Record<string, string> = {
      estres: 'bg-red-100 text-red-700',
      nutricion: 'bg-green-100 text-green-700',
      estudio: 'bg-blue-100 text-blue-700',
      autocuidado: 'bg-purple-100 text-purple-700',
      vocacional: 'bg-yellow-100 text-yellow-700',
      practicas: 'bg-indigo-100 text-indigo-700'
    }
    return colores[categoria] || 'bg-gray-100 text-gray-700'
  }

  const categorias = ['estres', 'nutricion', 'estudio', 'autocuidado', 'vocacional', 'practicas']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recursos Educativos</h1>
          <p className="text-gray-500">Material de apoyo para tu bienestar y desarrollo</p>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Todos
          </Button>
          {categorias.map((cat) => (
            <Button key={cat} variant="ghost" size="sm">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Grid de Recursos */}
        {recursos && recursos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recursos.map((recurso) => (
              <Card key={recurso.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(recurso.tipo_contenido)}
                      <Badge className={getCategoriaColor(recurso.categoria)}>
                        {recurso.categoria}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {recurso.tipo_contenido}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{recurso.titulo}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recurso.descripcion || 'Sin descripción'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Download className="h-4 w-4" />
                    <span>{recurso.conteo_descargas} descargas</span>
                  </div>

                  {recurso.url ? (
                    <Link href={recurso.url} target="_blank">
                      <Button className="w-full" variant="default">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Recurso
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Próximamente
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay recursos disponibles
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Estamos trabajando en agregar contenido educativo valioso para ti.
                Vuelve pronto para encontrar recursos que te ayudarán en tu desarrollo.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
