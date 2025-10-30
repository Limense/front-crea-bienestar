'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SelectorProfesional } from '@/components/citas/selector-profesional'
import { Calendario } from '@/components/citas/calendario'
import { CalendarioSkeleton, SlotsSkeleton } from '@/components/citas/skeletons'
import { ProfesionalConDisponibilidad, SlotDisponible, CrearCitaData } from '@/types/citas'
import { TipoCita, ModalidadCita } from '@/types/database'
import { agendarCita } from '@/lib/citas/actions'
import { calcularSlotsDisponibles, obtenerDiasDisponibles } from '@/lib/citas/disponibilidad-client'
import { validarDatosCita } from '@/lib/citas/validaciones'
import { formatearFechaCita } from '@/lib/citas/horarios'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react'

interface WizardAgendarCitaProps {
  profesionales: ProfesionalConDisponibilidad[]
  citasPendientes: number
}

export function WizardAgendarCita({ profesionales, citasPendientes }: WizardAgendarCitaProps) {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estado del formulario
  const [tipo, setTipo] = useState<TipoCita | null>(null)
  const [modalidad, setModalidad] = useState<ModalidadCita | null>(null)
  const [profesionalId, setProfesionalId] = useState<string>('')
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>()
  const [slotSeleccionado, setSlotSeleccionado] = useState<SlotDisponible | undefined>()
  const [motivo, setMotivo] = useState('')
  const [notasAdicionales, setNotasAdicionales] = useState('')
  
  // Estado para días y slots
  const [diasDisponibles, setDiasDisponibles] = useState<Date[]>([])
  const [slots, setSlots] = useState<SlotDisponible[]>([])
  const [cargandoDias, setCargandoDias] = useState(false)
  const [cargandoSlots, setCargandoSlots] = useState(false)
  
  // Cargar días disponibles cuando se selecciona profesional
  const cargarDiasDisponibles = async (profId: string) => {
    setCargandoDias(true)
    try {
      const dias = await obtenerDiasDisponibles(profId, 60)
      setDiasDisponibles(dias)
    } catch (err) {
      console.error('Error al cargar días:', err)
      setDiasDisponibles([])
    }
    setCargandoDias(false)
  }
  
  // Cargar slots cuando se selecciona fecha
  const cargarSlots = async (fecha: Date) => {
    if (!profesionalId) return
    
    setCargandoSlots(true)
    try {
      const slotsData = await calcularSlotsDisponibles(profesionalId, fecha)
      setSlots(slotsData)
    } catch (err) {
      console.error('Error al cargar slots:', err)
      setSlots([])
    }
    setCargandoSlots(false)
  }
  
  // Handlers de selección
  const handleSeleccionarProfesional = (profId: string) => {
    setProfesionalId(profId)
    setFechaSeleccionada(undefined)
    setSlotSeleccionado(undefined)
    setSlots([])
    cargarDiasDisponibles(profId)
  }
  
  const handleSeleccionarFecha = (fecha: Date) => {
    setFechaSeleccionada(fecha)
    setSlotSeleccionado(undefined)
    cargarSlots(fecha)
  }
  
  const handleSeleccionarSlot = (slot: SlotDisponible) => {
    setSlotSeleccionado(slot)
  }
  
  // Validaciones por paso
  const validarPaso = (pasoActual: number): { valido: boolean; mensaje?: string } => {
    switch (pasoActual) {
      case 1:
        if (!tipo) return { valido: false, mensaje: 'Selecciona el tipo de cita' }
        return { valido: true }
      
      case 2:
        if (!modalidad) return { valido: false, mensaje: 'Selecciona la modalidad' }
        return { valido: true }
      
      case 3:
        if (!profesionalId) return { valido: false, mensaje: 'Selecciona un profesional' }
        const prof = profesionales.find(p => p.id === profesionalId)
        if (prof && !prof.tiene_horarios) {
          return { valido: false, mensaje: 'El profesional seleccionado no tiene horarios disponibles' }
        }
        return { valido: true }
      
      case 4:
        if (!slotSeleccionado) return { valido: false, mensaje: 'Selecciona una fecha y hora' }
        return { valido: true }
      
      case 5:
        if (!motivo.trim()) return { valido: false, mensaje: 'Ingresa el motivo de la cita' }
        if (motivo.trim().length < 10) {
          return { valido: false, mensaje: 'El motivo debe tener al menos 10 caracteres' }
        }
        return { valido: true }
      
      default:
        return { valido: false }
    }
  }
  
  // Navegación entre pasos
  const siguientePaso = () => {
    const validacion = validarPaso(paso)
    if (!validacion.valido) {
      setError(validacion.mensaje || 'Completa este paso antes de continuar')
      return
    }
    setError(null)
    setPaso(paso + 1)
  }
  
  const pasoAnterior = () => {
    setError(null)
    setPaso(paso - 1)
  }
  
  // Enviar formulario
  const handleSubmit = async () => {
    // Validación final
    if (!tipo || !modalidad || !profesionalId || !slotSeleccionado || !motivo.trim()) {
      setError('Faltan datos requeridos')
      return
    }
    
    const datos: CrearCitaData = {
      profesional_id: profesionalId,
      fecha_hora: slotSeleccionado.fecha_hora,
      tipo,
      modalidad,
      motivo: motivo.trim(),
      notas: notasAdicionales.trim() || undefined,
      duracion_minutos: 45
    }
    
    // Validar con validaciones
    const validacion = validarDatosCita(datos)
    if (!validacion.valido) {
      setError(validacion.errores.join(', '))
      return
    }
    
    setCargando(true)
    setError(null)
    
    const resultado = await agendarCita(datos)
    
    if (resultado.exito) {
      // Redirigir a la página de citas con mensaje de éxito
      router.push('/citas?exito=cita-agendada')
    } else {
      setError(resultado.error)
      setCargando(false)
    }
  }
  
  // Obtener profesional seleccionado
  const profesionalSeleccionado = profesionales.find(p => p.id === profesionalId)
  
  // Pasos del wizard
  const pasos = [
    { numero: 1, titulo: 'Tipo de cita', icono: Calendar },
    { numero: 2, titulo: 'Modalidad', icono: Calendar },
    { numero: 3, titulo: 'Profesional', icono: User },
    { numero: 4, titulo: 'Fecha y hora', icono: Calendar },
    { numero: 5, titulo: 'Detalles', icono: FileText }
  ]
  
  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {pasos.map((p, index) => {
              const completado = paso > p.numero
              const activo = paso === p.numero
              
              return (
                <React.Fragment key={p.numero}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center font-semibold
                      ${completado ? 'bg-green-600 text-white' : ''}
                      ${activo ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                      ${!completado && !activo ? 'bg-gray-200 text-gray-600' : ''}
                    `}>
                      {completado ? <CheckCircle2 className="h-5 w-5" /> : p.numero}
                    </div>
                    <span className={`text-xs font-medium ${activo ? 'text-blue-600' : 'text-gray-600'}`}>
                      {p.titulo}
                    </span>
                  </div>
                  
                  {index < pasos.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      completado ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Alerta de límite de citas */}
      {citasPendientes >= 2 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Tienes {citasPendientes} {citasPendientes === 1 ? 'cita pendiente' : 'citas pendientes'}.
            Puedes agendar hasta 3 citas simultáneas.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Error global */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Paso {paso} de 5: {pasos[paso - 1].titulo}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="min-h-[400px]">
          {/* Paso 1: Tipo de cita */}
          {paso === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Selecciona el tipo de atención que necesitas
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setTipo('psicologia')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    tipo === 'psicologia'
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🧠</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Psicología</h3>
                      <p className="text-sm text-gray-600">
                        Atención psicológica para bienestar emocional, manejo de estrés,
                        orientación vocacional y apoyo académico
                      </p>
                      {tipo === 'psicologia' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setTipo('medicina_ocupacional')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    tipo === 'medicina_ocupacional'
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">⚕️</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Medicina Ocupacional</h3>
                      <p className="text-sm text-gray-600">
                        Evaluación de salud física, prevención de riesgos,
                        atención de primeros auxilios y orientación médica
                      </p>
                      {tipo === 'medicina_ocupacional' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 2: Modalidad */}
          {paso === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                ¿Cómo prefieres tener tu cita?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setModalidad('presencial')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    modalidad === 'presencial'
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🏢</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Presencial</h3>
                      <p className="text-sm text-gray-600">
                        Atención cara a cara en las instalaciones de EESPP CREA.
                        Interacción directa con el profesional.
                      </p>
                      {modalidad === 'presencial' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setModalidad('virtual')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    modalidad === 'virtual'
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">💻</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Virtual</h3>
                      <p className="text-sm text-gray-600">
                        Videollamada a través de Google Meet. Atención desde
                        cualquier lugar con conexión a internet.
                      </p>
                      {modalidad === 'virtual' && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 3: Profesional */}
          {paso === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Selecciona el profesional con quien deseas agendar tu cita
              </p>
              
              <SelectorProfesional
                profesionales={profesionales}
                profesionalId={profesionalId}
                onSeleccionar={handleSeleccionarProfesional}
              />
            </div>
          )}
          
          {/* Paso 4: Fecha y hora */}
          {paso === 4 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Profesional seleccionado:</strong> {profesionalSeleccionado?.nombre_completo}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {profesionalSeleccionado?.especialidad}
                </p>
              </div>
              
              <Calendario
                fechaSeleccionada={fechaSeleccionada}
                slotSeleccionado={slotSeleccionado}
                onSeleccionarFecha={handleSeleccionarFecha}
                onSeleccionarSlot={handleSeleccionarSlot}
                diasDisponibles={diasDisponibles}
                slots={slots}
                cargandoDias={cargandoDias}
                cargandoSlots={cargandoSlots}
              />
            </div>
          )}
          
          {/* Paso 5: Detalles */}
          {paso === 5 && (
            <div className="space-y-6">
              {/* Resumen */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Resumen de tu cita</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium mt-1">
                      {tipo === 'psicologia' ? '🧠 Psicología' : '⚕️ Medicina Ocupacional'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Modalidad:</span>
                    <p className="font-medium mt-1">
                      {modalidad === 'presencial' ? '🏢 Presencial' : '💻 Virtual'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Profesional:</span>
                    <p className="font-medium mt-1">{profesionalSeleccionado?.nombre_completo}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Fecha y hora:</span>
                    <p className="font-medium mt-1">
                      {slotSeleccionado && formatearFechaCita(slotSeleccionado.fecha_hora)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Motivo */}
              <div className="space-y-2">
                <Label htmlFor="motivo" className="text-base font-semibold">
                  Motivo de la cita <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Describe brevemente el motivo por el cual solicitas esta cita (mínimo 10 caracteres)
                </p>
                <Textarea
                  id="motivo"
                  placeholder="Ejemplo: Necesito orientación para manejar el estrés académico..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  {motivo.length} / 500 caracteres
                </p>
              </div>
              
              {/* Notas adicionales */}
              <div className="space-y-2">
                <Label htmlFor="notas" className="text-base font-semibold">
                  Notas adicionales (opcional)
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Información adicional que consideres relevante para el profesional
                </p>
                <Textarea
                  id="notas"
                  placeholder="Cualquier información adicional que quieras compartir..."
                  value={notasAdicionales}
                  onChange={(e) => setNotasAdicionales(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-50 border-t">
          <Button
            variant="outline"
            onClick={pasoAnterior}
            disabled={paso === 1 || cargando}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {paso < 5 ? (
            <Button onClick={siguientePaso} disabled={cargando}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={cargando} className="bg-green-600 hover:bg-green-700">
              {cargando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Agendar Cita
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
