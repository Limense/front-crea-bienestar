import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render para tests de React
 * Permite agregar providers globales (ThemeProvider, QueryProvider, etc.)
 */

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Aquí puedes agregar opciones custom si necesitas
}

/**
 * Wrapper con todos los providers necesarios
 */
function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Aquí agregarías providers globales si los tuvieras */}
      {/* <ThemeProvider> */}
      {/* <QueryClientProvider> */}
      {children}
      {/* </QueryClientProvider> */}
      {/* </ThemeProvider> */}
    </>
  )
}

/**
 * Render personalizado que incluye todos los providers
 * 
 * @example
 * import { render, screen } from '@/test-utils'
 * 
 * test('ejemplo', () => {
 *   render(<MiComponente />)
 *   expect(screen.getByText('Hola')).toBeInTheDocument()
 * })
 */
export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  })
}

// Re-exportar todo de @testing-library/react
export * from '@testing-library/react'

// Sobrescribir solo render
export { render as default }
