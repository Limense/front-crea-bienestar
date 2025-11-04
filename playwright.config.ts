import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración de Playwright para tests E2E
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Carpeta donde están los tests E2E
  testDir: './e2e',
  
  // Timeout para cada test (30 segundos)
  timeout: 30 * 1000,
  
  // Configuración de cada test
  use: {
    // URL base de la app
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    
    // Tomar screenshot solo cuando falla
    screenshot: 'only-on-failure',
    
    // Grabar video solo cuando falla
    video: 'retain-on-failure',
    
    // Trace (grabación de todo) solo cuando falla
    trace: 'on-first-retry',
  },
  
  // Configuración del servidor local
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // En CI siempre crear server nuevo
    timeout: 120 * 1000, // 2 minutos para que inicie el server
  },
  
  // Proyectos: diferentes navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Descomenta para testear en más navegadores
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Tests móviles
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  
  // Carpeta para artefactos (screenshots, videos, traces)
  outputDir: 'test-results/',
  
  // Reportes
  reporter: [
    ['html'], // Reporte HTML interactivo
    ['list'], // Lista en consola
  ],
})
