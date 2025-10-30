'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ProfesionalConDisponibilidad } from '@/types/citas'
import { CheckCircle2, Calendar } from 'lucide-react'

interface SelectorProfesionalProps {
  profesionales: ProfesionalConDisponibilidad[]
  profesionalId?: string
  onSeleccionar: (profesionalId: string) => void
  disabled?: boolean
}

export function SelectorProfesional({
  profesionales,
  profesionalId,
  onSeleccionar,
  disabled = false
}: SelectorProfesionalProps) {
  
  // Obtener iniciales del profesional
  const obtenerIniciales = (nombre: string): string => {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  if (profesionales.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No hay profesionales disponibles</p>
            <p className="text-sm text-gray-400">
              Por favor, contacta al administrador o intenta más tarde
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <RadioGroup
      value={profesionalId}
      onValueChange={onSeleccionar}
      disabled={disabled}
      className="space-y-3"
    >
      {profesionales.map((profesional) => {
        const seleccionado = profesionalId === profesional.id
        
        return (
          <div key={profesional.id}>
            <Label
              htmlFor={`profesional-${profesional.id}`}
              className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Card className={`transition-all hover:shadow-md ${
                seleccionado 
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Radio button */}
                    <RadioGroupItem
                      value={profesional.id}
                      id={`profesional-${profesional.id}`}
                      className="mt-1"
                    />
                    
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profesional.avatar_url} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {obtenerIniciales(profesional.nombre_completo)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {profesional.nombre_completo}
                            {seleccionado && (
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {profesional.especialidad}
                          </p>
                        </div>
                      </div>
                      
                      {/* Email */}
                      <p className="text-xs text-gray-500 mb-2">
                        {profesional.email}
                      </p>
                      
                      {/* Badges de información */}
                      <div className="flex flex-wrap gap-2">
                        {profesional.tiene_horarios ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Horarios disponibles
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Sin horarios configurados
                          </Badge>
                        )}
                        
                        {profesional.total_citas > 0 && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {profesional.total_citas} {profesional.total_citas === 1 ? 'cita' : 'citas'}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Advertencia si no tiene horarios */}
                      {!profesional.tiene_horarios && (
                        <p className="text-xs text-yellow-600 mt-2 italic">
                          Este profesional aún no ha configurado sus horarios de atención
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        )
      })}
    </RadioGroup>
  )
}
