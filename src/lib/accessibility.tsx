/**
 * Utilidades y hooks para mejorar la accesibilidad (a11y)
 * Basado en WCAG 2.1 Level AA
 */

import { useEffect, useRef, useState } from 'react'

/**
 * Hook para anunciar mensajes a lectores de pantalla
 * @param message - Mensaje a anunciar
 * @param politeness - Nivel de urgencia: 'polite' | 'assertive'
 * @param timeout - Tiempo en ms antes de limpiar el mensaje (default: 5000)
 * 
 * @example
 * const announce = useAnnouncer()
 * announce('Cita agendada exitosamente')
 */
export function useAnnouncer() {
  const [announcement, setAnnouncement] = useState('')
  const [politenessLevel, setPolitenessLevel] = useState<'polite' | 'assertive'>('polite')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite', timeout = 5000) => {
    setAnnouncement(message)
    setPolitenessLevel(politeness)
    
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    timerRef.current = setTimeout(() => {
      setAnnouncement('')
    }, timeout)
  }

  return {
    announce,
    AnnouncerComponent: () => (
      <div
        role="status"
        aria-live={politenessLevel}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    )
  }
}

/**
 * Hook para gestionar focus trap en modales/dialogs
 * @param isOpen - Si el modal está abierto
 * @param onClose - Callback al cerrar con ESC
 * 
 * @example
 * const dialogRef = useFocusTrap(isOpen, () => setIsOpen(false))
 */
export function useFocusTrap(isOpen: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Guardar elemento con focus actual
    previousFocusRef.current = document.activeElement as HTMLElement

    // Focus al primer elemento focusable
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }

    // Handler para ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }

      // Tab cycling
      if (e.key === 'Tab') {
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restaurar focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  return containerRef
}

/**
 * Hook para navegación por teclado en listas
 * @param itemCount - Cantidad de items en la lista
 * @param onSelect - Callback al seleccionar con Enter/Space
 * 
 * @example
 * const { selectedIndex, handleKeyDown } = useKeyboardNavigation(items.length, selectItem)
 */
export function useKeyboardNavigation(
  itemCount: number,
  onSelect?: (index: number) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % itemCount)
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + itemCount) % itemCount)
        break
      
      case 'Home':
        e.preventDefault()
        setSelectedIndex(0)
        break
      
      case 'End':
        e.preventDefault()
        setSelectedIndex(itemCount - 1)
        break
      
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (onSelect) {
          onSelect(selectedIndex)
        }
        break
    }
  }

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown
  }
}

/**
 * Componente VisuallyHidden - Oculta visualmente pero accesible para screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

/**
 * Componente SkipLink - Link para saltar navegación
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Saltar al contenido principal
    </a>
  )
}

/**
 * Genera ID único para aria-describedby y aria-labelledby
 */
let idCounter = 0
export function useId(prefix = 'a11y') {
  const [id] = useState(() => {
    idCounter++
    return `${prefix}-${idCounter}`
  })
  return id
}

/**
 * Formatea fecha de manera accesible para lectores de pantalla
 * @param date - Fecha a formatear
 * @returns String legible para screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleDateString('es-PE', options)
}

/**
 * Obtiene texto descriptivo para estado de cita (screen readers)
 */
export function getEstadoCitaDescription(estado: string): string {
  const descriptions: Record<string, string> = {
    'pendiente': 'Cita pendiente de confirmación',
    'confirmada': 'Cita confirmada por el profesional',
    'completada': 'Cita realizada y completada',
    'cancelada': 'Cita cancelada'
  }
  return descriptions[estado] || estado
}

/**
 * Valida contraste de color (WCAG AA)
 * @param hex1 - Color de texto en hex
 * @param hex2 - Color de fondo en hex
 * @returns true si cumple WCAG AA (ratio >= 4.5:1)
 */
export function meetsContrastRatio(hex1: string, hex2: string): boolean {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  
  return ratio >= 4.5
}
