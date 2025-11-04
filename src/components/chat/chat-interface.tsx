/**
 * Componente principal del chat
 * Maneja estado, mensajes y comunicación con el backend
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { MessageSquare, Plus, AlertCircle } from 'lucide-react'
import { crearConversacion, enviarMensaje, obtenerMensajes } from '@/lib/chat/actions'
import type { MensajeChat, ConversacionChat } from '@/lib/gemini'

interface ChatInterfaceProps {
  estudianteId: string
  conversacionesPrevias?: ConversacionChat[]
  servicioDisponible: boolean
}

export function ChatInterface({ 
  estudianteId, 
  conversacionesPrevias = [],
  servicioDisponible 
}: ChatInterfaceProps) {
  const [conversacionActual, setConversacionActual] = useState<string | null>(null)
  const [mensajes, setMensajes] = useState<MensajeChat[]>([])
  const [cargando, setCargando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mensajesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [mensajes])
  
  // Iniciar nueva conversación
  const iniciarNuevaConversacion = async () => {
    if (!servicioDisponible) {
      setError('El servicio no está disponible en este momento')
      return
    }
    
    setCargando(true)
    setError(null)
    
    const resultado = await crearConversacion()
    
    if (resultado.exito && resultado.datos) {
      setConversacionActual(resultado.datos.conversacion_id)
      setMensajes([{
        id: 'bienvenida',
        conversacion_id: resultado.datos.conversacion_id,
        contenido: resultado.datos.mensaje_bienvenida,
        remitente: 'bot',
        creado_en: new Date().toISOString(),
      }])
    } else {
      setError(resultado.error || 'Error al crear conversación')
    }
    
    setCargando(false)
  }
  
  // Cargar conversación existente
  const cargarConversacion = async (conversacionId: string) => {
    setCargando(true)
    setError(null)
    
    const resultado = await obtenerMensajes(conversacionId)
    
    if (resultado.exito && resultado.datos) {
      setConversacionActual(conversacionId)
      setMensajes(resultado.datos)
    } else {
      setError(resultado.error || 'Error al cargar mensajes')
    }
    
    setCargando(false)
  }
  
  // Enviar mensaje
  const handleEnviarMensaje = async (mensaje: string) => {
    if (!conversacionActual || !mensaje.trim() || enviando) return
    
    setEnviando(true)
    setError(null)
    
    // Agregar mensaje del usuario optimísticamente
    const mensajeUsuario: MensajeChat = {
      id: `temp-${Date.now()}`,
      conversacion_id: conversacionActual,
      contenido: mensaje,
      remitente: 'estudiante',
      creado_en: new Date().toISOString(),
    }
    setMensajes(prev => [...prev, mensajeUsuario])
    
    // Enviar al backend
    const resultado = await enviarMensaje(conversacionActual, mensaje)
    
    if (resultado.exito && resultado.datos) {
      // Agregar respuesta del bot
      const mensajeBot: MensajeChat = {
        id: `bot-${Date.now()}`,
        conversacion_id: conversacionActual,
        contenido: resultado.datos.respuesta_bot,
        remitente: 'bot',
        creado_en: new Date().toISOString(),
      }
      setMensajes(prev => [...prev, mensajeBot])
      
      // Mostrar alerta si hay riesgo alto
      if (resultado.datos.analisis_riesgo.nivel === 'ALTO' || resultado.datos.analisis_riesgo.nivel === 'CRITICO') {
        setError(`Se ha detectado una situación que requiere atención. Se notificará a tu tutor para brindarte el apoyo necesario. No estás solo. ❤️`)
      }
    } else {
      setError(resultado.error || 'Error al enviar mensaje')
      // Remover mensaje optimista si falló
      setMensajes(prev => prev.filter(m => m.id !== mensajeUsuario.id))
    }
    
    setEnviando(false)
  }
  
  // Estado inicial: sin conversación
  if (!conversacionActual) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold mb-2">¿Listo para conversar?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Inicia una nueva conversación o continúa con una anterior.
            Todo es confidencial y seguro.
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <Button 
              onClick={iniciarNuevaConversacion}
              disabled={cargando || !servicioDisponible}
              size="lg"
              className="w-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              Iniciar Nueva Conversación
            </Button>
            
            {/* Conversaciones previas */}
            {conversacionesPrevias.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">O continuar con:</p>
                <div className="space-y-2">
                  {conversacionesPrevias.slice(0, 3).map(conv => (
                    <Button
                      key={conv.id}
                      onClick={() => cargarConversacion(conv.id!)}
                      variant="outline"
                      className="w-full justify-start text-left"
                      disabled={cargando}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.titulo}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(conv.ultima_actividad!).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        conv.nivel_riesgo_actual === 'BAJO' ? 'bg-green-100 text-green-800' :
                        conv.nivel_riesgo_actual === 'MEDIO' ? 'bg-yellow-100 text-yellow-800' :
                        conv.nivel_riesgo_actual === 'ALTO' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {conv.nivel_riesgo_actual}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <Alert className="mt-6 bg-red-50 border-red-200 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Chat activo
  return (
    <Card className="flex flex-col h-[600px]">
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
        {/* Header del chat */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-sm">CREA Asistente</span>
            <span className="h-2 w-2 bg-green-500 rounded-full" title="En línea" />
          </div>
          <Button
            onClick={iniciarNuevaConversacion}
            variant="outline"
            size="sm"
            disabled={cargando || enviando}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva
          </Button>
        </div>
        
        {/* Alerta de riesgo alto */}
        {error && error.includes('riesgo') && (
          <Alert className="m-4 mb-0 bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Lista de mensajes */}
        <MessageList 
          mensajes={mensajes}
          cargando={cargando}
          enviando={enviando}
        />
        <div ref={mensajesEndRef} />
        
        {/* Input de chat */}
        <ChatInput 
          onEnviar={handleEnviarMensaje}
          disabled={cargando || enviando || !servicioDisponible}
          placeholder={enviando ? 'Esperando respuesta...' : 'Escribe tu mensaje...'}
        />
      </CardContent>
    </Card>
  )
}
