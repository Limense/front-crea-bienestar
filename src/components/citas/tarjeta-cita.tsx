'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CitaConRelaciones } from '@/types/database'
import { formatearFechaCita, formatearHora, tiempoRestante } from '@/lib/citas/horarios'
import { 
  obtenerColorEstado, 
  obtenerIconoTipo, 
  obtenerIconoModalidad 
} from '@/lib/citas/validaciones'
import { Calendar, Clock, MapPin, Video, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface TarjetaCitaProps {
  cita: CitaConRelaciones
  mostrarAcciones?: boolean
  onCancelar?: (citaId: string) => void
  onConfirmar?: (citaId: string) => void
  onCompletar?: (citaId: string) => void
  onUnirse?: (citaId: string) => void
  vistaCompacta?: boolean
}

export function TarjetaCita({
  cita,
  mostrarAcciones = true,
  onCancelar,
  onConfirmar,
  onCompletar,
  onUnirse,
  vistaCompacta = false
}: TarjetaCitaProps) {
  const fechaCita = new Date(cita.fecha_hora)
  const colorEstado = obtenerColorEstado(cita.estado)
  const tiempo = tiempoRestante(fechaCita)
  const esFutura = tiempo.total_minutos > 0
  const esProxima = esFutura && tiempo.total_minutos <= 120 // Próxima si es en las siguientes 2 horas
  
  // Obtener iniciales del profesional
  const iniciales = cita.profesional?.nombre_completo
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'
  
  if (vistaCompacta) {
    return (
      <Card className="card-hover animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={cita.profesional?.avatar_url} />
              <AvatarFallback>{iniciales}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">
                    {cita.profesional?.nombre_completo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {cita.profesional?.especialidad}
                  </p>
                </div>
                <Badge className={`${colorEstado.bg} ${colorEstado.text} border ${colorEstado.border} text-xs`}>
                  {cita.estado}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatearHora(fechaCita)}
                </span>
                <span>{obtenerIconoTipo(cita.tipo)}</span>
                <span>{obtenerIconoModalidad(cita.modalidad)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card 
      className={`card-hover animate-fade-in ${esProxima ? 'ring-2 ring-blue-500 badge-pulse' : ''}`}
      role="article"
      aria-label={`Cita con ${cita.profesional?.nombre_completo} el ${formatearFechaCita(fechaCita)}, estado: ${cita.estado}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12" aria-hidden="true">
              <AvatarImage src={cita.profesional?.avatar_url} alt={`Foto de ${cita.profesional?.nombre_completo}`} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {iniciales}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg" id={`cita-profesional-${cita.id}`}>
                {cita.profesional?.nombre_completo}
              </h3>
              <p className="text-sm text-gray-600" id={`cita-especialidad-${cita.id}`}>
                {cita.profesional?.especialidad}
              </p>
            </div>
          </div>
          
          <Badge 
            className={`${colorEstado.bg} ${colorEstado.text} border ${colorEstado.border}`}
            aria-label={`Estado de la cita: ${cita.estado}`}
          >
            {cita.estado}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Fecha y hora */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatearFechaCita(fechaCita, false)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{formatearHora(fechaCita)}</span>
          {esFutura && tiempo.dias === 0 && tiempo.horas > 0 && (
            <span className="text-blue-600 font-medium">
              (en {tiempo.horas}h {tiempo.minutos}min)
            </span>
          )}
          {esFutura && tiempo.dias > 0 && (
            <span className="text-gray-600">
              (en {tiempo.dias} {tiempo.dias === 1 ? 'día' : 'días'})
            </span>
          )}
        </div>
        
        {/* Tipo y modalidad */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">{obtenerIconoTipo(cita.tipo)}</span>
            <span className="capitalize">{cita.tipo.replace('_', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {cita.modalidad === 'presencial' ? (
              <MapPin className="h-4 w-4 text-gray-500" />
            ) : (
              <Video className="h-4 w-4 text-gray-500" />
            )}
            <span className="capitalize">{cita.modalidad}</span>
          </div>
        </div>
        
        {/* Motivo */}
        {cita.motivo && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-1">Motivo:</p>
            <p className="text-sm text-gray-600">{cita.motivo}</p>
          </div>
        )}
        
        {/* Notas del estudiante */}
        {cita.notas && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">Notas:</p>
            <p className="text-sm text-blue-600">{cita.notas}</p>
          </div>
        )}
        
        {/* Nota: notas_profesional se añadirá en futuro update del schema */}
        
        {/* Enlace de Google Meet */}
        {cita.modalidad === 'virtual' && cita.enlace_google_meet && esFutura && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-700 font-medium mb-2">
              Enlace de videollamada:
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onUnirse?.(cita.id)}
            >
              <Video className="h-4 w-4 mr-2" />
              Unirse a Google Meet
            </Button>
          </div>
        )}
        
        {/* Alerta de próxima cita */}
        {esProxima && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-700 font-medium">
              Tu cita es pronto. Prepárate para conectarte.
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Acciones */}
      {mostrarAcciones && (
        <CardFooter className="flex gap-2 bg-gray-50 pt-4">
          {/* Estudiante: Cancelar (solo si está pendiente/confirmada y es futura) */}
          {cita.estado !== 'completada' && cita.estado !== 'cancelada' && esFutura && onCancelar && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onCancelar(cita.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar cita
            </Button>
          )}
          
          {/* Profesional: Confirmar */}
          {cita.estado === 'pendiente' && onConfirmar && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => onConfirmar(cita.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar
            </Button>
          )}
          
          {/* Profesional: Completar */}
          {(cita.estado === 'confirmada' || cita.estado === 'pendiente') && !esFutura && onCompletar && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onCompletar(cita.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como completada
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
