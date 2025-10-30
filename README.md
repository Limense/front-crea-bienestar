# CREA Bienestar

**Sistema de Bienestar Estudiantil con IA para Detección de Deserción**

Plataforma web integral para la gestión del bienestar estudiantil en el EESPP CREA (Escuela de Educación Superior Pedagógica Pública CREA), con enfoque en la detección temprana de deserción mediante inteligencia artificial.

---

## Descripción

CREA Bienestar es una aplicación web moderna que integra:

- **Sistema de Citas** - Agendamiento de citas con psicología y medicina ocupacional
- **Chatbot IA** - Detección de deserción estudiantil con Google Gemini API
- **Recursos** - Biblioteca de contenido educativo y de bienestar
- **Talleres** - Gestión de eventos y talleres grupales
- **Alertas** - Sistema de alertas tempranas para tutores y profesionales
- **Gestión de Usuarios** - 4 roles: Estudiante, Profesional, Tutor, Admin

---

## 🚀 Stack Tecnológico

### Frontend

- **Next.js 15** - App Router, React Server Components
- **React 19** - Última versión
- **TypeScript** - Strict mode
- **Tailwind CSS v4** - Estilos modernos
- **shadcn/ui** - Componentes UI (13 componentes)

### Backend

- **Supabase** - PostgreSQL, Auth, Storage, Realtime
- **Server Actions** - Mutations seguras desde el servidor
- **Row Level Security (RLS)** - Seguridad a nivel de base de datos

### IA & APIs

- **Google Gemini API** - Chatbot de detección de deserción (pendiente)
- **Google Meet API** - Videollamadas para citas virtuales (pendiente)

### Herramientas

- **date-fns** - Manejo de fechas
- **Radix UI** - Primitivos accesibles
- **Turbopack** - Build tool de Next.js

---

## 📊 Base de Datos

**12 Tablas** en PostgreSQL con RLS completo:

| Tabla                     | Descripción                     | Estado |
| ------------------------- | ------------------------------- | ------ |
| `perfiles`                | Usuarios del sistema            | ✅     |
| `citas`                   | Sistema de agendamiento         | ✅     |
| `horarios_disponibilidad` | Disponibilidad de profesionales | ✅     |
| `conversaciones`          | Historial de chat con IA        | ✅     |
| `mensajes`                | Mensajes del chatbot            | ✅     |
| `alertas`                 | Alertas de riesgo               | ✅     |
| `recursos`                | Biblioteca de contenido         | ✅     |
| `talleres`                | Eventos grupales                | ✅     |
| `inscripciones_talleres`  | Inscripciones a talleres        | ✅     |
| `documentos_medicos`      | Archivos médicos                | ✅     |
| `notificaciones`          | Sistema de notificaciones       | ✅     |
| `registros_auditoria`     | Logs de actividad               | ✅     |

---

## Características Principales

### Sistema de Citas (Completado 100%)

- **Agendamiento Inteligente**

  - Wizard de 5 pasos
  - Validación de disponibilidad en tiempo real
  - Selección de profesional, fecha y hora
  - Modalidad: presencial o virtual

- **Gestión de Citas**

  - Ver mis citas (estudiantes)
  - Confirmar/rechazar citas (profesionales)
  - Cancelar con motivo
  - Completar con notas médicas
  - Filtros por estado, tipo, modalidad

- **UX Profesional**
  - Loading skeletons (9 tipos)
  - Error boundaries
  - Animaciones CSS suaves
  - Accesibilidad WCAG 2.1 AA
  - Screen reader support
  - Navegación por teclado completa

### Autenticación (Completado)

- Login con email/password
- Registro de usuarios
- Recuperación de contraseña
- Middleware de protección de rutas
- Redirección por rol

### Dashboards (4 roles)

- **Estudiante**: Citas, chatbot, recursos, nivel de bienestar
- **Profesional**: Agenda, citas pendientes, horarios
- **Tutor**: Alertas, estudiantes en riesgo
- **Admin**: Panel completo de administración

### Recursos (Completado)

- Biblioteca de contenido
- Categorización (salud mental, académico, etc.)
- Filtros y búsqueda
- Vista de tarjetas responsive

---

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+
- npm, yarn o pnpm
- Cuenta de Supabase

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/crea-bienestar.git
cd crea-bienestar
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Opcional - Google Gemini API (para chatbot)
GEMINI_API_KEY=tu_gemini_api_key

# Opcional - Google Meet API
GOOGLE_MEET_API_KEY=tu_google_meet_api_key
```

### 4. Configurar base de datos en Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones SQL desde `/supabase/migrations/`
3. (Opcional) Ejecutar el seed para datos de ejemplo

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
crea-bienestar/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Login, Registro, Recovery
│   │   ├── (estudiante)/      # Dashboard estudiante
│   │   ├── (profesional)/     # Dashboard profesional
│   │   ├── (tutor)/           # Dashboard tutor
│   │   ├── (admin)/           # Dashboard admin
│   │   ├── citas/             # Sistema de citas ⭐
│   │   │   ├── page.tsx       # Lista de citas
│   │   │   ├── nueva/         # Wizard de agendamiento
│   │   │   └── handlers-citas.tsx
│   │   └── recursos/          # Biblioteca de recursos
│   ├── components/
│   │   ├── dashboard/         # Sidebar, Layout
│   │   ├── citas/             # 8 componentes de citas ⭐
│   │   ├── ui/                # shadcn/ui components
│   │   └── error-boundary.tsx # Error handling ⭐
│   ├── lib/
│   │   ├── supabase/          # Cliente, Servidor, Middleware
│   │   ├── citas/             # Lógica de citas ⭐
│   │   │   ├── actions.ts     # Server Actions
│   │   │   ├── disponibilidad.ts
│   │   │   ├── disponibilidad-client.ts ⭐
│   │   │   ├── horarios.ts
│   │   │   └── validaciones.ts
│   │   ├── auth.ts            # Helpers de autenticación
│   │   ├── accessibility.tsx  # Utilities a11y ⭐
│   │   └── utils.ts
│   └── types/
│       ├── database.ts        # Tipos de BD
│       └── citas.ts           # Tipos de citas
├── supabase/
│   ├── migrations/            # Migraciones SQL
│   └── seed.sql              # Datos de ejemplo
├── public/                    # Assets estáticos
└── docs-internos/            # Documentación interna (no se sube)
```

---

## 🎨 Componentes Destacados

### Sistema de Citas

| Componente                 | Descripción               | Líneas |
| -------------------------- | ------------------------- | ------ |
| `wizard-agendar-cita.tsx`  | Wizard de 5 pasos         | 539    |
| `tarjeta-cita.tsx`         | Card de cita con acciones | 277    |
| `calendario.tsx`           | Calendario mensual        | 227    |
| `selector-profesional.tsx` | Selector con RadioGroup   | 151    |
| `filtros-citas.tsx`        | Tabs y filtros            | 215    |
| `skeletons.tsx`            | 9 componentes skeleton    | 310    |
| `handlers-citas.tsx`       | Wrapper con dialogs       | 220    |
| `lista-citas-client.tsx`   | Lista con filtros         | 178    |

**Total**: ~2,100 líneas solo en componentes de citas

### Utilities

- `accessibility.tsx` - 8 hooks/components para a11y (245 líneas)
- `error-boundary.tsx` - Error handling profesional (185 líneas)
- `disponibilidad-client.ts` - Lógica client-side (179 líneas)

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (Turbopack)

# Producción
npm run build        # Build para producción
npm run start        # Servidor de producción

# Linting
npm run lint         # ESLint
```

---

## 🔐 Seguridad

- **RLS (Row Level Security)** - Políticas a nivel de base de datos
- **Server Actions** - Mutations seguras desde servidor
- **Middleware** - Protección de rutas
- **Validaciones** - Client-side y server-side
- **Sanitización** - Prevención de XSS/SQL injection

---

## ♿ Accesibilidad

Sistema **WCAG 2.1 Level AA** compliant:

- Screen reader support
- Keyboard navigation
- Focus management
- ARIA labels completos
- Alto contraste
- Skip links
- Semantic HTML

---

## 📈 Roadmap

### Completado ✅

- [x] Autenticación completa
- [x] 4 Dashboards por rol
- [x] Sistema de citas 100%
- [x] Recursos biblioteca
- [x] RLS completo
- [x] UX profesional (skeletons, animations, a11y)

### En Progreso 🚧

- [ ] Chatbot con Gemini API
- [ ] Sistema de alertas
- [ ] Talleres completos

### Próximas Features 🔮

- [ ] Google Meet auto-links
- [ ] Notificaciones push (Realtime)
- [ ] Gestión de horarios (profesionales)
- [ ] Email reminders
- [ ] Analytics y reportes
- [ ] App móvil (React Native)

---

## 👥 Contribuir

Este es un proyecto académico para EESPP CREA. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso académico para EESPP CREA.

---

## 👨‍💻 Autor

**Equipo de Desarrollo CREA Bienestar**

- Proyecto de tesis - EESPP CREA
- Año: 2025

---

## Agradecimientos

- EESPP CREA por el apoyo institucional
- Comunidad de Next.js y Supabase
- shadcn por los componentes UI
- Vercel por el hosting

---

**Si este proyecto te fue útil, dale una estrella en GitHub!**
