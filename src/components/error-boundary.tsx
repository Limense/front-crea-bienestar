'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component para manejo elegante de errores
 * Envuelve componentes que pueden fallar y muestra UI amigable
 * 
 * @example
 * <ErrorBoundary>
 *   <ComponenteQuePuedeFallar />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    }
    
    // TODO: Enviar error a servicio de monitoreo (Sentry, LogRocket, etc)
    // logErrorToService(error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      // Usar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback por defecto
      return (
        <div className="container mx-auto p-6 max-w-2xl">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-900">
                    ¡Oops! Algo salió mal
                  </CardTitle>
                  <p className="text-sm text-red-700 mt-1">
                    Ocurrió un error inesperado
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {this.state.error?.message || 'Error desconocido'}
                </AlertDescription>
              </Alert>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Detalles técnicos (solo en desarrollo)
                  </summary>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-64 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <p className="text-sm text-gray-600">
                Intenta recargar la página o volver al inicio. Si el problema persiste, 
                contacta al soporte técnico.
              </p>
            </CardContent>

            <CardFooter className="gap-2">
              <Button 
                onClick={this.handleReset}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Intentar de nuevo
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Error Boundary específico para el sistema de citas
 */
export function CitasErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto p-6">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-amber-600" />
                <div>
                  <CardTitle className="text-amber-900">
                    Error en el sistema de citas
                  </CardTitle>
                  <p className="text-sm text-amber-700 mt-1">
                    No pudimos cargar tus citas en este momento
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600">
                Por favor, intenta nuevamente en unos momentos. Si el problema continúa, 
                contacta al área de bienestar estudiantil.
              </p>
            </CardContent>

            <CardFooter className="gap-2">
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar página
              </Button>
              <Button variant="outline" asChild>
                <a href="/estudiante/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Ir al dashboard
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
