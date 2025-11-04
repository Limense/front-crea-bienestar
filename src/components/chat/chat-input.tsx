/**
 * Input de chat con autosize y manejo de Enter
 */

'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onEnviar: (mensaje: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onEnviar, disabled = false, placeholder = 'Escribe tu mensaje...' }: ChatInputProps) {
  const [mensaje, setMensaje] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Ajustar altura del textarea automáticamente
  const ajustarAltura = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMensaje(e.target.value)
    ajustarAltura()
  }
  
  const handleEnviar = () => {
    if (mensaje.trim() && !disabled) {
      onEnviar(mensaje.trim())
      setMensaje('')
      // Reset altura
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sin Shift envía el mensaje
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }
  
  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={mensaje}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed max-h-[120px] overflow-y-auto"
          aria-label="Mensaje de chat"
        />
        <Button
          onClick={handleEnviar}
          disabled={disabled || !mensaje.trim()}
          size="lg"
          className="flex-shrink-0"
          aria-label="Enviar mensaje"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Presiona <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> para enviar, 
        <kbd className="px-1 py-0.5 bg-gray-100 border rounded ml-1">Shift + Enter</kbd> para nueva línea
      </p>
    </div>
  )
}
