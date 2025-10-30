/**
 * Servicio centralizado de logging y manejo de errores
 * Preparado para integración con Sentry, LogRocket, etc.
 */

interface LogContext {
  userId?: string
  component?: string
  action?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  /**
   * Log general (info)
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log('ℹ️ [INFO]', message, context)
    }
    // TODO: Enviar a servicio de logging en producción
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: LogContext) {
    console.warn('⚠️ [WARN]', message, context)
    // TODO: Enviar a servicio de logging en producción
  }

  /**
   * Log de error
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error('❌ [ERROR]', message, error, context)
    
    // TODO: Integración con Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: {
    //       component: context?.component,
    //       action: context?.action,
    //     },
    //     extra: context?.metadata,
    //   })
    // }
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      console.debug('🐛 [DEBUG]', message, data)
    }
  }

  /**
   * Captura excepciones no manejadas
   */
  captureException(error: Error | unknown, context?: LogContext) {
    this.error('Excepción capturada', error, context)
    
    // TODO: Enviar a Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: {
    //       component: context?.component,
    //     },
    //     extra: context?.metadata,
    //   })
    // }
  }

  /**
   * Registra eventos de usuario (analytics)
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.log('📊 [EVENT]', eventName, properties)
    }
    
    // TODO: Integración con Google Analytics / Vercel Analytics
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', eventName, properties)
    // }
  }
}

// Singleton
export const logger = new Logger()

/**
 * Wrapper para funciones asíncronas con manejo de errores
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: LogContext
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error) {
    logger.error('Error en operación asíncrona', error, context)
    return { data: null, error: error as Error }
  }
}

/**
 * Hook para logging en componentes (React)
 */
export function useLogger(componentName: string) {
  return {
    info: (message: string, metadata?: Record<string, unknown>) =>
      logger.info(message, { component: componentName, metadata }),
    warn: (message: string, metadata?: Record<string, unknown>) =>
      logger.warn(message, { component: componentName, metadata }),
    error: (message: string, error?: Error | unknown, metadata?: Record<string, unknown>) =>
      logger.error(message, error, { component: componentName, metadata }),
    debug: (message: string, data?: unknown) =>
      logger.debug(`[${componentName}] ${message}`, data),
    trackEvent: (eventName: string, properties?: Record<string, unknown>) =>
      logger.trackEvent(eventName, { component: componentName, ...properties }),
  }
}
