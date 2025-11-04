/**
 * Lista de mensajes del chat
 * Muestra conversación con scroll automático
 */

'use client'

import { Bot, User } from 'lucide-react'
import type { MensajeChat } from '@/lib/gemini'

interface MessageListProps {
  mensajes: MensajeChat[]
  cargando: boolean
  enviando: boolean
}

export function MessageList({ mensajes, cargando, enviando }: MessageListProps) {
  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-sm text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    )
  }
  
  if (mensajes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500">No hay mensajes aún</p>
      </div>
    )
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {mensajes.map((mensaje, index) => (
        <MessageBubble 
          key={mensaje.id || index} 
          mensaje={mensaje}
        />
      ))}
      
      {/* Indicador de "escribiendo..." */}
      {enviando && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Burbuja individual de mensaje
 */
function MessageBubble({ mensaje }: { mensaje: MensajeChat }) {
  const esBot = mensaje.remitente === 'bot'
  
  return (
    <div className={`flex items-start gap-3 ${esBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
        esBot ? 'bg-blue-100' : 'bg-green-100'
      }`}>
        {esBot ? (
          <Bot className="h-5 w-5 text-blue-600" />
        ) : (
          <User className="h-5 w-5 text-green-600" />
        )}
      </div>
      
      {/* Contenido del mensaje */}
      <div className={`flex flex-col max-w-[80%] ${esBot ? 'items-start' : 'items-end'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          esBot 
            ? 'bg-gray-100 text-gray-900' 
            : 'bg-blue-600 text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {mensaje.contenido}
          </p>
        </div>
        
        {/* Timestamp */}
        {mensaje.creado_en && (
          <span className="text-xs text-gray-500 mt-1 px-2">
            {formatearHora(mensaje.creado_en)}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Formatea la hora del mensaje
 */
function formatearHora(fecha: string): string {
  const date = new Date(fecha)
  const ahora = new Date()
  const ayer = new Date(ahora)
  ayer.setDate(ayer.getDate() - 1)
  
  // Si es hoy
  if (date.toDateString() === ahora.toDateString()) {
    return date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  // Si es ayer
  if (date.toDateString() === ayer.toDateString()) {
    return `Ayer ${date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }
  
  // Si es más antiguo
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
