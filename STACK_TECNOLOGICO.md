# Stack Tecnológico - CREA Bienestar

## Tecnologías Principales

### Frontend
- **Next.js 15** (App Router - última versión estable)
  - TypeScript para type safety
  - Server Components por defecto
  - Server Actions para mutations
  - Streaming y Suspense
  - Optimización automática de imágenes
  - Route Groups para organización
  - React 19 (canary)
  
- **Tailwind CSS 3.4**
  - Utility-first CSS
  - Configuración personalizada con colores CREA
  - Responsive design mobile-first
  - Dark mode ready
  
- **shadcn/ui**
  - Componentes accesibles (radix-ui)
  - Customizables vía Tailwind
  - Tree-shakeable
  - TypeScript nativo
  
### Backend
- **Supabase**
  - PostgreSQL 15 (base de datos)
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Storage para archivos
  - Auth integrado
  - Edge Functions (Deno runtime)
  - pg_cron para tareas programadas

### UI Components & Icons
- **lucide-react** - Iconos modernos y optimizados
- **Recharts** - Gráficos interactivos para dashboards
- **react-hook-form** - Manejo de formularios con validación
- **zod** - Schema validation
- **date-fns** - Manejo de fechas
- **clsx + tailwind-merge** - Utilidades CSS

### State Management
- **Zustand** - State management ligero
- **React Query (TanStack Query)** - Server state y caché
- **Supabase Realtime** - Estado sincronizado en tiempo real

### Inteligencia Artificial
- **Google Gemini API**
  - Gemini 1.5 Pro (conversaciones complejas)
  - Gemini 2.0 Flash (respuestas rápidas)
- **Vercel AI SDK** - Streaming de respuestas IA
- **LangChain.js** (opcional) - Orquestación de prompts

### Comunicaciones
- **Twilio**
  - WhatsApp Business API
  - SMS para notificaciones críticas
- **Resend** o **SendGrid** - Envío de emails
- **React Email** - Templates de email en React

### Video
- **Google Meet API** - Videoconsultas integradas
- **Supabase Realtime** - Notificaciones y actualizaciones en tiempo real (sin Socket.io)

### Validación & Seguridad
- **Zod** - Validación de schemas
- **bcrypt** - Hashing de passwords (en Edge Functions)
- **jose** - JWT handling
- **helmet** - Headers de seguridad

### Testing
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **Testing Library** - Component tests

### Dev Tools
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit validation
- **Commitizen** - Conventional commits

### Deployment & CI/CD
- **Vercel** - Hosting frontend (gratis)
- **Supabase Cloud** - Backend managed
- **GitHub Actions** - CI/CD pipelines
- **Vercel Analytics** - Performance monitoring

### Monitoring & Analytics
- **Sentry** - Error tracking
- **Vercel Analytics** - Web vitals
- **PostHog** (opcional) - Product analytics

## Estructura de Carpetas (Next.js 15 App Router)

```
crea-bienestar/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar-password/
│   ├── (estudiante)/
│   │   ├── dashboard/
│   │   ├── chat/
│   │   ├── citas/
│   │   │   ├── page.tsx
│   │   │   ├── nueva/
│   │   │   └── [id]/
│   │   ├── historial/
│   │   ├── recursos/
│   │   ├── talleres/
│   │   └── perfil/
│   ├── (profesional)/
│   │   ├── dashboard/
│   │   ├── agenda/
│   │   ├── pacientes/
│   │   │   └── [id]/
│   │   └── estadisticas/
│   ├── (tutor)/
│   │   ├── dashboard/
│   │   ├── alertas/
│   │   ├── estudiante/[id]/
│   │   └── reportes/
│   ├── (admin)/
│   │   ├── usuarios/
│   │   ├── recursos/
│   │   ├── talleres/
│   │   └── configuracion/
│   ├── api/
│   │   ├── chatbot/route.ts
│   │   ├── citas/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── webhooks/route.ts
│   │   └── cron/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── chat/
│   ├── dashboard/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── gemini/
│   │   └── chatbot.ts
│   ├── utils/
│   └── validations/
├── hooks/
├── types/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
├── public/
├── tests/
└── config files
```

## Buenas Prácticas Implementadas

### TypeScript
- Strict mode habilitado
- Interfaces para todas las entidades
- Tipos compartidos entre frontend/backend
- No usar `any`, preferir `unknown`

### Next.js 15
- Server Components por defecto
- Client Components solo cuando necesario (interactividad)
- Server Actions para mutations (crear/actualizar citas)
- Metadata API para SEO
- Lazy loading de componentes pesados
- Image optimization automática
- Partial Prerendering (PPR) habilitado
- Turbopack para builds más rápidos

### Supabase
- Row Level Security en todas las tablas
- Índices en foreign keys
- Triggers para acciones automáticas
- Migrations versionadas
- Políticas de backup diario

### Code Quality
- ESLint + Prettier configurados
- Conventional commits
- Pre-commit hooks con Husky
- Code review obligatorio
- Cobertura de tests mínima 70%

### Performance
- Code splitting automático
- Lazy loading de componentes
- Debouncing en búsquedas
- Virtualization para listas largas
- Optimistic updates
- Caché estratégico con React Query

### Security
- HTTPS obligatorio
- CORS configurado
- Rate limiting en APIs
- Input sanitization
- XSS prevention
- CSRF protection

### Accesibilidad
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Contraste mínimo WCAG AA

## Nomenclatura

### Archivos y Carpetas
- Carpetas: kebab-case (`components/chat-message`)
- Componentes React: PascalCase (`ChatMessage.tsx`)
- Utilidades: camelCase (`formatDate.ts`)
- Constantes: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Variables y Funciones
- Variables: camelCase (`userProfile`)
- Funciones: camelCase (`getUserById`)
- Componentes: PascalCase (`ChatMessage`)
- Hooks: camelCase con prefijo `use` (`useAuth`)
- Tipos/Interfaces: PascalCase (`UserProfile`)

### Base de Datos (Supabase)
- Tablas: snake_case plural (`appointments`, `user_profiles`)
- Columnas: snake_case (`created_at`, `student_id`)
- Índices: `idx_[tabla]_[columna]` (`idx_appointments_student_id`)

### Mezcla Español/Inglés
- **Código técnico**: Inglés (variables, funciones, componentes)
- **Dominio de negocio**: Español (nombres de entidades del dominio CREA)
- **UI/UX**: Español (textos, labels, mensajes)
- **Comentarios**: Español para lógica de negocio, inglés para técnico

Ejemplo:
```typescript
// Validar disponibilidad del profesional
async function checkProfessionalAvailability(
  profesionalId: string,
  fechaConsulta: Date
): Promise<boolean> {
  const appointments = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', profesionalId)
    // Verificar conflictos de horario
    .overlaps('datetime', fechaConsulta)
  
  return appointments.data.length === 0
}
```

## Costos Estimados (Mensual)

### Tier Gratuito (MVP - Primeros 6 meses)
- Vercel: $0 (Hobby plan)
- Supabase: $0 (Free tier)
- Gemini API: $0 (1500 req/día gratis)
- Twilio: $0-10 (créditos iniciales)
- SendGrid: $0 (100 emails/día gratis)
- **Total: $0-10/mes**

### Producción (250+ estudiantes activas)
- Vercel Pro: $20
- Supabase Pro: $25
- Gemini API: $5-15
- Twilio WhatsApp: $20-30
- SendGrid: $15
- Google Workspace (para Meet API): $0-12
- **Total: $85-117/mes**

## Escalabilidad

### Manejo de Crecimiento
- Supabase escala automáticamente hasta 10GB BD
- Next.js serverless escala con demanda
- CDN global de Vercel
- Edge Functions distribuidas
- Database connection pooling

### Plan de Migración (si crece mucho)
- PostgreSQL dedicado (AWS RDS)
- Redis para caché
- S3 para archivos
- Load balancer
- Microservicios si necesario

## Seguridad & Compliance

### Datos Sensibles
- Encriptación en reposo (Supabase nativo)
- Encriptación en tránsito (HTTPS)
- Backups diarios automáticos
- Retención de datos: 7 años (requisito médico)

### Privacidad
- Consentimiento informado para estudiantes
- Política de privacidad clara
- GDPR compliant (aunque no aplica en Perú, es buena práctica)
- Logs de acceso a historiales médicos

### Auditoría
- Tabla `audit_logs` para cambios sensibles
- Tracking de quién accedió a qué historial
- Registro de todas las alertas generadas
- Trazabilidad completa
