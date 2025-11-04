import { test, expect } from '@playwright/test'

/**
 * TEST E2E: Flujo Completo de Agendar Cita
 * 
 * CONCEPTO E2E (End-to-End):
 * - Prueba TODO el sistema integrado
 * - Simula un usuario real en un navegador
 * - Verifica la experiencia completa
 * - Más lento pero más cercano a la realidad
 * 
 * PLAYWRIGHT:
 * - page: Representa la pestaña del navegador
 * - page.goto(): Navegar a una URL
 * - page.click(): Hacer clic en elementos
 * - page.fill(): Rellenar campos de texto
 * - expect(page).toHaveURL(): Verificar URL actual
 * - expect(locator).toBeVisible(): Verificar que algo se ve
 */

test.describe('Agendar Cita - Flujo Completo', () => {
  /**
   * beforeEach: Se ejecuta ANTES de cada test
   * Útil para preparar el estado inicial
   */
  test.beforeEach(async ({ page }) => {
    // TODO: En producción, aquí harías login primero
    // Por ahora asumimos que el usuario ya está autenticado
    await page.goto('/')
  })
  
  /**
   * TEST 1: Verificar que la página principal carga
   */
  test('la página principal carga correctamente', async ({ page }) => {
    // ASSERT: Verificar que llegamos a la home
    await expect(page).toHaveURL('/')
    
    // Verificar que aparece el título de la app
    await expect(page.locator('h1')).toBeVisible()
  })
  
  /**
   * TEST 2: Navegación al formulario de agendar cita
   */
  test('puede navegar a la página de agendar cita', async ({ page }) => {
    // ACT: Buscar y hacer clic en el botón/link de "Agendar cita"
    // Usamos getByRole para accesibilidad
    const agendarLink = page.getByRole('link', { name: /agendar cita|nueva cita/i })
    await agendarLink.click()
    
    // ASSERT: Verificar que navegamos correctamente
    await expect(page).toHaveURL(/\/citas\/nueva/)
    
    // Verificar que aparece el formulario
    await expect(page.getByText(/tipo de consulta/i)).toBeVisible()
  })
  
  /**
   * TEST 3: Flujo completo de agendar una cita
   * Este es el test más importante - simula un usuario real
   */
  test('puede completar el flujo de agendar una cita de psicología', async ({ page }) => {
    // PASO 1: Navegar al formulario
    await page.goto('/citas/nueva')
    
    // PASO 2: Seleccionar tipo de cita (Psicología)
    await page.getByLabel(/psicología|tipo.*psicología/i).click()
    
    // PASO 3: Continuar al siguiente paso
    await page.getByRole('button', { name: /continuar|siguiente/i }).click()
    
    // PASO 4: Seleccionar modalidad (Presencial)
    await page.getByLabel(/presencial/i).click()
    await page.getByRole('button', { name: /continuar|siguiente/i }).click()
    
    // PASO 5: Seleccionar profesional
    // Esperamos a que cargue la lista de profesionales
    await page.waitForSelector('[data-testid="lista-profesionales"]', { timeout: 5000 })
    
    // Seleccionar el primer profesional disponible
    const primerProfesional = page.locator('[data-testid="card-profesional"]').first()
    await primerProfesional.click()
    
    await page.getByRole('button', { name: /continuar|siguiente/i }).click()
    
    // PASO 6: Seleccionar fecha y hora
    // Esperamos a que cargue el calendario
    await page.waitForSelector('[data-testid="calendario"]', { timeout: 5000 })
    
    // Seleccionar una fecha futura (por ejemplo, en 5 días)
    const fechaFutura = page.locator('[data-testid="dia-disponible"]').first()
    await fechaFutura.click()
    
    // Seleccionar un horario disponible
    const horarioDisponible = page.locator('[data-testid="slot-disponible"]').first()
    await horarioDisponible.click()
    
    await page.getByRole('button', { name: /continuar|siguiente/i }).click()
    
    // PASO 7: Completar motivo de consulta
    const motivoTextarea = page.getByLabel(/motivo|describe.*consulta/i)
    await motivoTextarea.fill('Necesito orientación académica para mejorar mi rendimiento en el semestre')
    
    // PASO 8: Confirmar la cita
    const confirmarButton = page.getByRole('button', { name: /confirmar|agendar/i })
    await confirmarButton.click()
    
    // PASO 9: Verificar confirmación
    // Debería aparecer un mensaje de éxito
    await expect(page.getByText(/cita agendada|confirmación/i)).toBeVisible({ timeout: 10000 })
    
    // Debería redirigir a la página de citas
    await expect(page).toHaveURL(/\/citas/, { timeout: 5000 })
    
    // La nueva cita debería aparecer en la lista
    await expect(page.getByText(/orientación académica/i)).toBeVisible()
  })
  
  /**
   * TEST 4: Validación de formulario
   * Verifica que no se puede enviar sin completar campos requeridos
   */
  test('muestra errores de validación cuando falta información', async ({ page }) => {
    await page.goto('/citas/nueva')
    
    // Intentar continuar sin seleccionar tipo de cita
    const continuarButton = page.getByRole('button', { name: /continuar|siguiente/i })
    await continuarButton.click()
    
    // Debería mostrar un mensaje de error
    await expect(page.getByText(/selecciona.*tipo|requerido/i)).toBeVisible()
    
    // No debería avanzar al siguiente paso
    await expect(page).toHaveURL(/\/citas\/nueva/)
  })
  
  /**
   * TEST 5: Cancelar proceso de agendar
   */
  test('puede cancelar el proceso de agendar cita', async ({ page }) => {
    await page.goto('/citas/nueva')
    
    // Seleccionar tipo
    await page.getByLabel(/psicología/i).click()
    await page.getByRole('button', { name: /continuar/i }).click()
    
    // Buscar botón de cancelar o volver
    const cancelarButton = page.getByRole('button', { name: /cancelar|volver|atrás/i })
    await cancelarButton.click()
    
    // Debería volver al paso anterior o a la página de citas
    // (ajusta según tu implementación)
    await expect(page).toHaveURL(/\/citas/)
  })
  
  /**
   * TEST 6: Accesibilidad - Navegación por teclado
   * Verifica que se puede usar la app sin mouse
   */
  test('puede navegar el formulario usando solo el teclado', async ({ page }) => {
    await page.goto('/citas/nueva')
    
    // Usar Tab para navegar entre elementos
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Seleccionar con Enter/Space
    await page.keyboard.press('Enter')
    
    // Verificar que funcionó
    // (Este test depende de tu implementación específica)
  })
  
  /**
   * TEST 7: Responsive - Vista móvil
   * Verifica que funciona en pantallas pequeñas
   */
  test('el formulario funciona en dispositivos móviles', async ({ page }) => {
    // Cambiar viewport a móvil (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 })
    
    await page.goto('/citas/nueva')
    
    // Verificar que el formulario se ve y es usable
    await expect(page.getByLabel(/psicología/i)).toBeVisible()
    
    // El botón debería ser tocable (no demasiado pequeño)
    const button = page.getByRole('button', { name: /continuar/i })
    const box = await button.boundingBox()
    
    // Verificar que tiene al menos 44x44px (recomendación de iOS)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })
})

/**
 * TEST SUITE: Gestión de Citas Existentes
 */
test.describe('Gestión de Citas', () => {
  test('puede ver la lista de citas agendadas', async ({ page }) => {
    await page.goto('/citas')
    
    // Debería mostrar el encabezado
    await expect(page.getByRole('heading', { name: /mis citas/i })).toBeVisible()
    
    // Si hay citas, deberían aparecer
    // Si no hay, debería mostrar estado vacío
    const tieneCitas = await page.getByTestId('tarjeta-cita').count() > 0
    
    if (tieneCitas) {
      await expect(page.getByTestId('tarjeta-cita').first()).toBeVisible()
    } else {
      await expect(page.getByText(/no tienes citas|agenda tu primera/i)).toBeVisible()
    }
  })
  
  test('puede cancelar una cita existente', async ({ page }) => {
    await page.goto('/citas')
    
    // Verificar que hay al menos una cita
    const primeraCita = page.getByTestId('tarjeta-cita').first()
    
    if (await primeraCita.isVisible()) {
      // Hacer clic en cancelar
      await primeraCita.getByRole('button', { name: /cancelar/i }).click()
      
      // Debería aparecer un modal de confirmación
      await expect(page.getByText(/confirmar cancelación|seguro.*cancelar/i)).toBeVisible()
      
      // Confirmar cancelación
      await page.getByRole('button', { name: /confirmar|sí/i }).click()
      
      // Debería mostrar mensaje de éxito
      await expect(page.getByText(/cita cancelada/i)).toBeVisible({ timeout: 5000 })
    }
  })
})
