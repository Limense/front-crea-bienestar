import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno: happy-dom simula el DOM del navegador
    environment: 'happy-dom',
    
    // Archivos de setup que se ejecutan antes de cada test
    setupFiles: ['./src/test-utils/setup.ts'],
    
    // Patrón para encontrar archivos de test
    include: ['**/*.{test,spec}.{ts,tsx}'],
    
    // Excluir carpetas
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'e2e',
    ],
    
    // Configuración de coverage (cobertura)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test-utils/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        'dist/',
        '.next/',
      ],
      // Meta: 80% de cobertura
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    
    // Globals: permite usar expect, describe, test sin importar
    globals: true,
  },
  
  // Resolver alias como en Next.js (@/)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
