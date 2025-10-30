import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, MessageCircle, Calendar, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CREA Bienestar
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tu compañera de bienestar durante tu formación como maestra de educación inicial
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="lg" variant="outline">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Asistente IA 24/7</h3>
            <p className="text-sm text-gray-600">
              Conversa con nuestro chatbot siempre que lo necesites
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Agenda de Citas</h3>
            <p className="text-sm text-gray-600">
              Reserva consultas psicológicas y médicas fácilmente
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600" />
            <h3 className="font-semibold mb-2">Recursos de Autocuidado</h3>
            <p className="text-sm text-gray-600">
              Accede a guías, videos y talleres de bienestar
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Seguimiento Personalizado</h3>
            <p className="text-sm text-gray-600">
              Acompañamiento continuo durante tu carrera
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas ayuda ahora?
          </h2>
          <p className="text-lg mb-6">
            Nuestro equipo de bienestar está aquí para apoyarte
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Habla con Nosotros
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 CREA Bienestar - Escuela de Educación Superior Pedagógica CREA</p>
          <p className="text-sm mt-2">Av. Aguarico 1015, Breña, Lima</p>
        </div>
      </footer>
    </div>
  )
}
