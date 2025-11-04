/**
 * Página del Chatbot de Bienestar
 * Interfaz conversacional con IA para detección de riesgo
 */

import { Suspense } from 'react'
import { MessageSquare, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChatInterface } from '@/components/chat/chat-interface'
import { obtenerPerfilUsuario } from '@/lib/auth'
import { crearClienteServidor } from '@/lib/supabase/servidor'

export const metadata = {
  title: 'Chatbot de Bienestar | CREA',
  description: 'Conversa con nuestro asistente virtual de bienestar',
}

export default async function ChatbotPage() {
  const perfil = await obtenerPerfilUsuario()
  const supabase = await crearClienteServidor()
  
  // Obtener conversaciones previas
  const { data: conversaciones } = await supabase
    .from('conversaciones')
    .select('*')
    .eq('estudiante_id', perfil.id)
    .order('ultima_actividad', { ascending: false })
    .limit(5)
  
  // Verificar si el servicio está disponible
  const geminiDisponible = !!process.env.GEMINI_API_KEY
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Chatbot de Bienestar</h1>
        </div>
        <p className="text-gray-600">
          Conversa de forma confidencial sobre tus preocupaciones, estrés o cualquier tema que te inquiete.
          Estoy aquí para escucharte.
        </p>
      </div>
      
      {/* Alerta si el servicio no está disponible */}
      {!geminiDisponible && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            El servicio de chatbot está temporalmente no disponible. 
            Por favor, agenda una cita con un profesional o contacta a tu tutor.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Información importante */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            Importante: ¿Qué debes saber?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>
            ✅ <strong>Confidencial:</strong> Todo lo que compartas aquí es privado.
          </p>
          <p>
            ✅ <strong>Apoyo inicial:</strong> Soy un asistente virtual, no reemplazo la ayuda profesional.
          </p>
          <p>
            ✅ <strong>Detección temprana:</strong> Si detecto riesgo alto, se notificará a tu tutor para apoyarte.
          </p>
          <p>
            ⚠️ <strong>Emergencias:</strong> Si estás en crisis, contacta al <strong>113</strong> (Salud Mental Perú) o acude a emergencias.
          </p>
        </CardContent>
      </Card>
      
      {/* Chat Interface */}
      <Suspense fallback={<ChatLoadingSkeleton />}>
        <ChatInterface 
          estudianteId={perfil.id}
          conversacionesPrevias={conversaciones || []}
          servicioDisponible={geminiDisponible}
        />
      </Suspense>
      
      {/* Recursos adicionales */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Agenda una Cita</CardTitle>
            <CardDescription>
              Habla con un psicólogo profesional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="/citas/nueva" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Agendar ahora →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Recursos de Bienestar</CardTitle>
            <CardDescription>
              Videos, artículos y guías útiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="/recursos" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Ver recursos →
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Talleres Grupales</CardTitle>
            <CardDescription>
              Participa en sesiones de bienestar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="/talleres" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Ver talleres →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Loading skeleton para el chat
 */
function ChatLoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
