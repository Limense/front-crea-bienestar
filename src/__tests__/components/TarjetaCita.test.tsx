import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test-utils/render'
import { TarjetaCita } from '@/components/citas/tarjeta-cita'
import { createMockCitaConRelaciones } from '@/test-utils/factories'
import { addDays, addHours } from 'date-fns'

/**
 * Tests de Componente: TarjetaCita
 * 
 * CONCEPTOS IMPORTANTES:
 * - render(): Renderiza el componente en un DOM virtual
 * - screen: Objeto para buscar elementos en el DOM
 * - getByRole(), getByText(): Queries que buscan elementos
 * - toBeInTheDocument(): Matcher que verifica que el elemento existe
 */

describe('TarjetaCita', () => {
  /**
   * TEST 1: Renderizado Básico
   * Verifica que el componente renderiza correctamente con datos básicos
   */
  it('renderiza correctamente una cita pendiente', () => {
    // ARRANGE: Crear datos de prueba
    const cita = createMockCitaConRelaciones({
      estado: 'pendiente',
      tipo: 'psicologia',
      modalidad: 'presencial',
    })
    
    // ACT: Renderizar componente
    render(<TarjetaCita cita={cita} />)
    
    // ASSERT: Verificar que se muestran los datos
    expect(screen.getByText('Dra. María García')).toBeInTheDocument()
    expect(screen.getByText('Psicología Clínica')).toBeInTheDocument()
    expect(screen.getByText(/pendiente/i)).toBeInTheDocument()
  })
  
  /**
   * TEST 2: Estados Diferentes
   * Verifica que muestra el badge correcto según el estado
   */
  it('muestra badge de "confirmada" para citas confirmadas', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'confirmada',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/confirmada/i)).toBeInTheDocument()
  })
  
  it('muestra badge de "completada" para citas completadas', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'completada',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/completada/i)).toBeInTheDocument()
  })
  
  it('muestra badge de "cancelada" para citas canceladas', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'cancelada',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/cancelada/i)).toBeInTheDocument()
  })
  
  /**
   * TEST 3: Citas Próximas
   * Verifica que muestra alerta especial para citas próximas (dentro de 2 horas)
   */
  it('muestra alerta para citas próximas (dentro de 2 horas)', () => {
    // Crear cita en 1 hora (dentro del rango de 2 horas)
    const cita = createMockCitaConRelaciones({
      fecha_hora: addHours(new Date(), 1).toISOString(),
      estado: 'confirmada',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    // Verifica que muestra la alerta de cita próxima
    expect(screen.getByText(/tu cita es pronto/i)).toBeInTheDocument()
  })
  
  /**
   * TEST 4: Botones de Acción
   * El componente muestra botones según los callbacks que recibe
   */
  it('muestra botón "Cancelar cita" cuando se proporciona onCancelar', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'pendiente',
    })
    
    const mockCancelar = vi.fn()
    
    render(<TarjetaCita cita={cita} onCancelar={mockCancelar} />)
    
    // Buscar botón por texto
    expect(screen.getByRole('button', { name: /cancelar cita/i })).toBeInTheDocument()
  })
  
  it('NO muestra botón "Cancelar" en cita completada', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'completada',
    })
    
    const mockCancelar = vi.fn()
    
    render(<TarjetaCita cita={cita} onCancelar={mockCancelar} />)
    
    // No debe haber botón de cancelar
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
  })
  
  /**
   * TEST 5: Profesional ve más botones
   */
  it('muestra botón "Confirmar" cuando se proporciona onConfirmar y está pendiente', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'pendiente',
    })
    
    const mockConfirmar = vi.fn()
    
    render(<TarjetaCita cita={cita} onConfirmar={mockConfirmar} />)
    
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
  })
  
  it('muestra botón "Marcar como completada" para cita confirmada pasada con onCompletar', () => {
    const citaPasada = createMockCitaConRelaciones({
      estado: 'confirmada',
      fecha_hora: addDays(new Date(), -1).toISOString(), // Ayer
    })
    
    const mockCompletar = vi.fn()
    
    render(<TarjetaCita cita={citaPasada} onCompletar={mockCompletar} />)
    
    expect(screen.getByRole('button', { name: /marcar como completada/i })).toBeInTheDocument()
  })
  
  /**
   * TEST 6: Tipos y Modalidades
   */
  it('muestra texto de psicología en el componente', () => {
    const cita = createMockCitaConRelaciones({
      tipo: 'psicologia',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    // Puede aparecer múltiples veces (especialidad + tipo), usamos getAllByText
    const elementos = screen.getAllByText(/psicología|psicologia/i)
    expect(elementos.length).toBeGreaterThan(0)
  })
  
  it('muestra "Presencial" para citas presenciales', () => {
    const cita = createMockCitaConRelaciones({
      modalidad: 'presencial',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/presencial/i)).toBeInTheDocument()
  })
  
  it('muestra "Virtual" para citas virtuales', () => {
    const cita = createMockCitaConRelaciones({
      modalidad: 'virtual',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/virtual/i)).toBeInTheDocument()
  })
  
  /**
   * TEST 7: Accesibilidad (a11y)
   */
  it('tiene atributo role="article" para semántica', () => {
    const cita = createMockCitaConRelaciones()
    
    const { container } = render(<TarjetaCita cita={cita} />)
    
    // Buscar elemento con role="article"
    const article = container.querySelector('[role="article"]')
    expect(article).toBeInTheDocument()
  })
  
  it('tiene aria-label descriptivo', () => {
    const cita = createMockCitaConRelaciones({
      estado: 'pendiente',
    })
    
    const { container } = render(<TarjetaCita cita={cita} />)
    
    const article = container.querySelector('[role="article"]')
    expect(article).toHaveAttribute('aria-label')
    
    // El aria-label debe contener información importante
    const ariaLabel = article?.getAttribute('aria-label') || ''
    expect(ariaLabel).toContain('Dra. María García')
    expect(ariaLabel).toContain('pendiente')
  })
  
  /**
   * TEST 8: Motivo de la Cita
   */
  it('muestra el motivo de la cita si existe', () => {
    const cita = createMockCitaConRelaciones({
      motivo: 'Necesito ayuda con ansiedad pre-exámenes',
    })
    
    render(<TarjetaCita cita={cita} />)
    
    expect(screen.getByText(/ansiedad pre-exámenes/i)).toBeInTheDocument()
  })
  
  /**
   * TEST 9: Fecha y Hora
   */
  it('muestra la fecha y hora de la cita formateada', () => {
    const fecha = new Date('2025-11-15T14:30:00')
    const cita = createMockCitaConRelaciones({
      fecha_hora: fecha.toISOString(),
    })
    
    render(<TarjetaCita cita={cita} />)
    
    // Buscar que contenga el día y la hora
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/14:30/)).toBeInTheDocument()
  })
  
  /**
   * TEST 10: Vista Compacta
   */
  it('renderiza en vista compacta cuando se especifica', () => {
    const cita = createMockCitaConRelaciones()
    
    render(<TarjetaCita cita={cita} vistaCompacta />)
    
    // En vista compacta muestra el nombre del profesional
    expect(screen.getByText('Dra. María García')).toBeInTheDocument()
  })
})
