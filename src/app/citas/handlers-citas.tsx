'use client'

import React, { useState } from 'react'
import { CitaConRelaciones } from '@/types/database'
import { RolUsuario } from '@/types/database'
import { cancelarCita, confirmarCita, completarCita } from '@/lib/citas/actions'
import { useRouter } from 'next/navigation'
import { useAnnouncer } from '@/lib/accessibility'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface HandlersCitasProps {
  cita: CitaConRelaciones
  rol?: RolUsuario // Opcional, para futuras expansiones
  children: React.ReactNode
}

export function HandlersCitas({ cita, children }: HandlersCitasProps) {
  const router = useRouter()
  const { announce, AnnouncerComponent } = useAnnouncer()
  const [dialogoAbierto, setDialogoAbierto] = useState<'cancelar' | 'confirmar' | 'completar' | null>(null)
  const [motivo, setMotivo] = useState('')
  const [notas, setNotas] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)
  
  const handleCancelar = async () => {
    setCargando(true)
    setError(null)
    
    const resultado = await cancelarCita(cita.id, motivo || undefined)
    
    if (resultado.exito) {
      const mensaje = resultado.mensaje || 'Cita cancelada'
      setExito(mensaje)
      announce(mensaje, 'assertive')
      setDialogoAbierto(null)
      setMotivo('')
      router.refresh()
    } else {
      setError(resultado.error)
      announce(`Error: ${resultado.error}`, 'assertive')
    }
    
    setCargando(false)
  }
  
  const handleConfirmar = async () => {
    setCargando(true)
    setError(null)
    
    const resultado = await confirmarCita(cita.id)
    
    if (resultado.exito) {
      setExito(resultado.mensaje || 'Cita confirmada')
      setDialogoAbierto(null)
      router.refresh()
    } else {
      setError(resultado.error)
    }
    
    setCargando(false)
  }
  
  const handleCompletar = async () => {
    setCargando(true)
    setError(null)
    
    const resultado = await completarCita(cita.id, notas || undefined)
    
    if (resultado.exito) {
      setExito(resultado.mensaje || 'Cita completada')
      setDialogoAbierto(null)
      setNotas('')
      router.refresh()
    } else {
      setError(resultado.error)
    }
    
    setCargando(false)
  }
  
  const handleUnirse = () => {
    if (cita.enlace_google_meet) {
      window.open(cita.enlace_google_meet, '_blank')
    }
  }
  
  // Renderizar el children pasándole las funciones como props
  const renderizarChildren = () => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        onCancelar: () => setDialogoAbierto('cancelar'),
        onConfirmar: () => setDialogoAbierto('confirmar'),
        onCompletar: () => setDialogoAbierto('completar'),
        onUnirse: handleUnirse
      } as Partial<typeof children.props>)
    }
    return children
  }
  
  return (
    <>
      <AnnouncerComponent />
      {renderizarChildren()}
      
      {/* Alertas de éxito/error */}
      {exito && (
        <Alert className="fixed bottom-4 right-4 w-96 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{exito}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="fixed bottom-4 right-4 w-96 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Diálogo de cancelación */}
      <AlertDialog open={dialogoAbierto === 'cancelar'} onOpenChange={() => setDialogoAbierto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cita será marcada como cancelada y se notificará a la otra parte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 my-4">
            <Label htmlFor="motivo">Motivo de cancelación (opcional)</Label>
            <Textarea
              id="motivo"
              placeholder="Explica brevemente el motivo de la cancelación..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cargando}>
              No, mantener cita
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleCancelar}
              disabled={cargando}
            >
              {cargando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sí, cancelar cita
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de confirmación */}
      <AlertDialog open={dialogoAbierto === 'confirmar'} onOpenChange={() => setDialogoAbierto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar esta cita?</AlertDialogTitle>
            <AlertDialogDescription>
              Se notificará al estudiante que has confirmado la cita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cargando}>
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleConfirmar} disabled={cargando}>
              {cargando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmar cita
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de completar */}
      <AlertDialog open={dialogoAbierto === 'completar'} onOpenChange={() => setDialogoAbierto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar cita como completada</AlertDialogTitle>
            <AlertDialogDescription>
              Puedes agregar notas sobre la sesión si lo deseas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 my-4">
            <Label htmlFor="notas">Notas de la sesión (opcional)</Label>
            <Textarea
              id="notas"
              placeholder="Agrega observaciones o notas sobre la sesión..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cargando}>
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleCompletar} disabled={cargando}>
              {cargando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Marcar como completada
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
