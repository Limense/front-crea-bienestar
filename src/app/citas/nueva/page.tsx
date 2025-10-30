import { redirect } from 'next/navigation'
import { obtenerPerfilUsuario } from '@/lib/auth'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { WizardAgendarCita } from './wizard-agendar-cita'
import { ProfesionalConDisponibilidad } from '@/types/citas'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function NuevaCitaPage() {
  const perfil = await obtenerPerfilUsuario()
  
  // Solo estudiantes pueden agendar citas
  if (perfil.rol !== 'estudiante') {
    redirect('/citas')
  }
  
  // Verificar límite de citas
  const supabase = await crearClienteServidor()
  const { count } = await supabase
    .from('citas')
    .select('*', { count: 'exact', head: true })
    .eq('estudiante_id', perfil.id)
    .in('estado', ['pendiente', 'confirmada'])
    .gte('fecha_hora', new Date().toISOString())
  
  const citasPendientes = count || 0
  
  if (citasPendientes >= 3) {
    redirect('/citas?error=limite-alcanzado')
  }
  
  // Obtener profesionales activos
  const { data: profesionalesData } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, email, especialidad, avatar_url')
    .eq('rol', 'profesional')
    .order('nombre_completo')
  
  // Para cada profesional, verificar si tiene horarios y contar citas
  const profesionales: ProfesionalConDisponibilidad[] = await Promise.all(
    (profesionalesData || []).map(async (prof) => {
      // Verificar horarios
      const { count: horariosCount } = await supabase
        .from('horarios_disponibilidad')
        .select('*', { count: 'exact', head: true })
        .eq('profesional_id', prof.id)
        .eq('activo', true)
      
      // Contar citas
      const { count: citasCount } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .eq('profesional_id', prof.id)
      
      return {
        id: prof.id,
        nombre_completo: prof.nombre_completo,
        email: prof.email,
        especialidad: prof.especialidad || 'Profesional de bienestar',
        avatar_url: prof.avatar_url,
        tiene_horarios: (horariosCount || 0) > 0,
        total_citas: citasCount || 0
      }
    })
  )
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/citas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Agendar Nueva Cita
            </h1>
            <p className="text-gray-600 mt-1">
              Completa los siguientes pasos para agendar tu cita de bienestar
            </p>
          </div>
        </div>
        
        {/* Wizard */}
        <WizardAgendarCita
          profesionales={profesionales}
          citasPendientes={citasPendientes}
        />
      </div>
    </DashboardLayout>
  )
}
