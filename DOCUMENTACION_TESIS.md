# Sistema de Prevención de Deserción Estudiantil mediante Inteligencia Artificial
## Caso: EESPP CREA - "CREA Bienestar"

### Documentación para Tesis

---

## 1. PROBLEMA IDENTIFICADO

### 1.1 Contexto Institucional

La Escuela de Educación Superior Pedagógica Privada "Calidad en Redes de Aprendizaje" (CREA) es una institución licenciada por el Ministerio de Educación del Perú, especializada en la formación de docentes de educación inicial. Con aproximadamente 250 estudiantes activas distribuidas en diferentes semestres, CREA enfrenta un desafío crítico que afecta la continuidad educativa y el cumplimiento de su misión institucional.

### 1.2 Problemática Central

**Deserción estudiantil por falta de atención temprana y oportuna**

Las estudiantes de CREA abandonan sus estudios de manera inesperada, "de la nada", sin que el personal académico pueda detectar las señales de alerta con anticipación suficiente para intervenir efectivamente.

### 1.3 Causas Identificadas

**Limitación de recursos humanos:**
- Un único psicólogo para atender 250+ estudiantes
- Un médico ocupacional con disponibilidad limitada
- Ratio de atención: 1 profesional de salud mental por cada 250 estudiantes
- Imposibilidad física de dar seguimiento personalizado a todas las estudiantes

**Falta de detección temprana:**
- Problemas emocionales, académicos o económicos no son visibilizados a tiempo
- Las estudiantes no solicitan ayuda por vergüenza, desconocimiento o barreras de acceso
- Personal académico detecta problemas cuando ya es tarde para intervenir efectivamente

**Barreras de acceso a apoyo:**
- Horario de atención limitado (lunes a viernes, 9 AM - 5 PM)
- Estudiantes con horarios incompatibles o que viven lejos
- Proceso manual y lento para agendar citas
- Falta de seguimiento después de consultas

**Deserción silenciosa:**
- Estudiantes que gradualmente se desconectan sin expresar explícitamente intención de desertar
- Patrones de comportamiento de riesgo que pasan desapercibidos
- Ausencia de sistemas de monitoreo preventivo

### 1.4 Impacto del Problema

**Impacto institucional:**
- Tasa estimada de deserción: 15-20% anual (dato típico en educación superior en Perú)
- Pérdida aproximada de 37-50 estudiantes por año
- Impacto económico negativo para la institución
- Afectación de indicadores de calidad educativa

**Impacto en estudiantes:**
- Proyectos de vida truncados
- Inversión económica y temporal perdida
- Frustración vocacional
- Perpetuación de desigualdades educativas

**Impacto social:**
- Menos maestras de educación inicial formadas
- Déficit en el sistema educativo peruano
- Comunidades sin acceso a educación inicial de calidad

### 1.5 Justificación de la Necesidad

La detección temprana de estudiantes en riesgo de deserción es crítica porque:

1. **Ventana de intervención:** La mayoría de problemas son solucionables si se detectan a tiempo
2. **Costo-efectividad:** Prevenir deserción es más económico que reclutar nuevas estudiantes
3. **Calidad educativa:** Estudiantes con bienestar emocional tienen mejor rendimiento académico
4. **Responsabilidad institucional:** CREA tiene compromiso ético con el éxito de sus estudiantes

---

## 2. SOLUCIÓN PROPUESTA

### 2.1 Descripción General

**Plataforma web "CREA Bienestar"**: Sistema integral de gestión de bienestar estudiantil con inteligencia artificial para detección temprana y prevención de deserción.

### 2.2 Componentes Principales

**Chatbot con Inteligencia Artificial (Gemini API)**
- Asistente virtual disponible 24/7
- Conversación natural en español
- Escucha activa y empática
- Detección automática de señales de riesgo de deserción
- Generación de alertas tempranas para el equipo de tutoría

**Sistema de Gestión de Citas**
- Agenda online de profesionales de salud
- Reserva automática sin intervención manual
- Recordatorios automatizados vía WhatsApp y email
- Videoconsultas para estudiantes que no pueden asistir presencialmente

**Dashboard de Alertas para Tutores**
- Visualización en tiempo real de estudiantes en riesgo
- Categorización por nivel de urgencia (alto, medio, bajo)
- Historial completo de cada caso
- Recomendaciones automáticas de intervención

**Biblioteca de Recursos de Bienestar**
- Contenido de autocuidado accesible 24/7
- Videos, artículos, guías descargables
- Personalización según necesidades detectadas

**Sistema de Seguimiento y Analytics**
- Historial médico/psicológico digital
- Métricas de bienestar estudiantil
- Reportes de efectividad de intervenciones
- Predicción de riesgo mediante algoritmos de machine learning

### 2.3 Funcionamiento del Sistema de Detección

**Fase 1: Captura de Señales**

El chatbot mantiene conversaciones naturales con las estudiantes. Durante estas interacciones, analiza:

- **Contenido explícito:** Frases como "quiero dejar la carrera", "no puedo más", "esto no es para mí"
- **Sentimiento emocional:** Análisis de tono (tristeza, frustración, desesperanza)
- **Contexto situacional:** Problemas económicos, familiares, académicos, de salud
- **Patrones de comportamiento:** Frecuencia de interacción, uso de recursos, asistencia a citas

**Fase 2: Análisis Multifactorial**

El sistema calcula un "score de riesgo de deserción" (0-100%) basado en:

```
Score = (Sentimiento negativo en conversaciones × 0.30) +
        (Inasistencias académicas × 0.25) +
        (Bajo rendimiento académico × 0.20) +
        (Desconexión de plataforma × 0.15) +
        (Consultas psicológicas repetidas por mismo tema × 0.10)
```

**Clasificación de riesgo:**
- 70-100%: ALTO (alerta roja - intervención inmediata)
- 40-69%: MEDIO (alerta amarilla - seguimiento cercano)
- 0-39%: BAJO (seguimiento normal)

**Fase 3: Generación de Alertas**

Cuando se detecta riesgo medio o alto:

1. **Notificación inmediata** al tutor académico asignado
2. **Registro automático** en dashboard de alertas
3. **Resumen del caso** con contexto relevante
4. **Recomendación de intervención** según tipo de problema
5. **Seguimiento automatizado** hasta resolución

**Fase 4: Facilitación de Intervención**

El sistema no solo detecta, sino que facilita la acción:

- Agenda automáticamente cita con psicólogo si la estudiante acepta
- Envía recursos de contención emocional inmediata
- Conecta con trabajadora social si es problema económico
- Sugiere al tutor estrategias de intervención basadas en casos similares previos

**Fase 5: Monitoreo y Cierre**

- Seguimiento automático post-intervención
- Medición de efectividad
- Actualización del nivel de riesgo
- Cierre de alerta cuando estudiante se estabiliza

### 2.4 Innovación Tecnológica

**Inteligencia Artificial conversacional:**
- Uso de Google Gemini API (modelo de lenguaje avanzado)
- Comprensión de contexto en español peruano
- Memoria de conversaciones para seguimiento coherente
- Mejora continua mediante aprendizaje de casos

**Arquitectura serverless:**
- Next.js 14 con App Router para frontend optimizado
- Supabase como Backend-as-a-Service (PostgreSQL, Auth, Storage, Realtime)
- Edge Functions para procesamiento distribuido
- Escalabilidad automática según demanda

**Tiempo real:**
- Notificaciones instantáneas a tutores
- Actualización automática de dashboards
- WebSockets para chat en vivo
- Sincronización entre dispositivos

### 2.5 Diferenciadores vs Soluciones Existentes

**Sistemas tradicionales de tutoría:**
- Reactivos (esperan a que estudiante solicite ayuda)
- Limitados a horario de oficina
- Requieren intervención manual constante
- No escalan con cantidad de estudiantes

**CREA Bienestar:**
- **Proactivo:** Detecta problemas antes de que estudiante pida ayuda
- **24/7:** Chatbot siempre disponible
- **Automatizado:** Alertas y seguimiento sin intervención manual
- **Escalable:** Puede atender a miles de estudiantes simultáneamente
- **Basado en datos:** Decisiones informadas por analytics y ML

---

## 3. OBJETIVOS

### 3.1 Objetivo General

Desarrollar e implementar un sistema web de gestión de bienestar estudiantil con inteligencia artificial para la detección temprana y prevención de deserción en la EESPP CREA, reduciendo la tasa de abandono académico mediante intervenciones oportunas y personalizadas.

### 3.2 Objetivos Específicos

**OE1: Implementar chatbot con IA para atención 24/7**
- Desarrollar asistente virtual con Google Gemini API
- Configurar detección de señales de riesgo de deserción
- Alcanzar 90% de satisfacción de estudiantes con interacciones del bot
- Lograr tiempo de respuesta menor a 3 segundos

**OE2: Desarrollar sistema de alertas tempranas para tutores**
- Crear dashboard en tiempo real de estudiantes en riesgo
- Implementar algoritmo de scoring de riesgo de deserción
- Reducir tiempo de detección de problemas de semanas a menos de 48 horas
- Clasificar correctamente al menos 85% de casos de riesgo real

**OE3: Automatizar gestión de citas con profesionales de salud**
- Desarrollar sistema de agenda online con disponibilidad en tiempo real
- Implementar recordatorios automáticos vía WhatsApp y email
- Reducir ausentismo a citas en 40%
- Aumentar capacidad de atención en 30% mediante optimización de agenda

**OE4: Medir impacto en reducción de deserción**
- Implementar sistema de analytics y métricas
- Establecer línea base de deserción antes del sistema
- Lograr reducción de tasa de deserción del 15-20% al 5-8% en primer año
- Documentar casos de éxito de prevención de deserción

**OE5: Crear repositorio de recursos de autocuidado**
- Digitalizar y organizar materiales de bienestar
- Implementar sistema de recomendaciones personalizadas
- Lograr que 70% de estudiantes accedan a recursos al menos una vez al mes

### 3.3 Indicadores de Éxito

**Indicadores cuantitativos:**
- Reducción de deserción: Del 15-20% al 5-8% anual
- Tiempo de detección de riesgo: Menor a 48 horas desde primera señal
- Cobertura de atención: 100% de alertas atendidas en menos de 72 horas
- Uso de plataforma: 80% de estudiantes activas mensualmente
- Satisfacción: NPS (Net Promoter Score) mayor a 50

**Indicadores cualitativos:**
- Percepción de acompañamiento institucional mejorada
- Testimonios de estudiantes que consideraron desertar pero no lo hicieron
- Mejora en ambiente institucional y sentido de comunidad
- Reducción de estrés del personal por sistema automatizado

---

## 4. METODOLOGÍA

### 4.1 Tipo de Investigación

**Investigación Aplicada con enfoque mixto (cualitativo-cuantitativo)**

- Diseño experimental con grupo de control (cohorte sin sistema vs cohorte con sistema)
- Análisis de datos cuantitativos (métricas de deserción, uso de plataforma)
- Análisis cualitativo (entrevistas, grupos focales, análisis de conversaciones)

### 4.2 Metodología de Desarrollo de Software

**Agile - Scrum adaptado**

**Sprint 0 (1 semana): Configuración inicial**
- Setup de repositorio y estructura de proyecto
- Configuración de Next.js + Supabase
- Definición de arquitectura
- Setup de CI/CD

**Sprint 1 (2 semanas): Autenticación y base de datos**
- Sistema de login/registro
- Roles de usuario
- Base de datos PostgreSQL con migraciones
- Row Level Security

**Sprint 2 (2 semanas): Chatbot básico con IA**
- Integración con Gemini API
- Interface de chat
- Detección básica de sentimiento
- Almacenamiento de conversaciones

**Sprint 3 (2 semanas): Sistema de alertas**
- Algoritmo de scoring de riesgo
- Dashboard de alertas para tutores
- Notificaciones en tiempo real
- Gestión de casos

**Sprint 4 (2 semanas): Gestión de citas**
- Calendario de disponibilidad
- Reserva de citas
- Recordatorios automatizados
- Historial de consultas

**Sprint 5 (1 semana): Recursos y contenido**
- Biblioteca de recursos
- Sistema de categorización
- Recomendaciones personalizadas

**Sprint 6 (1 semana): Analytics y reportes**
- Dashboard de estadísticas
- Reportes automatizados
- Exportación de datos

**Sprint 7 (1 semana): Testing y refinamiento**
- Pruebas de usabilidad
- Corrección de bugs
- Optimización de performance

**Sprint 8 (1 semana): Deploy y capacitación**
- Deployment a producción
- Capacitación a personal
- Documentación de usuario

### 4.3 Población y Muestra

**Población:** Totalidad de estudiantes de EESPP CREA (~250 estudiantes)

**Muestra piloto:** 50 estudiantes voluntarias de diferentes semestres para testing beta

**Grupo de control:** Análisis histórico de cohortes anteriores (2022-2024) para comparación

### 4.4 Instrumentos de Recolección de Datos

**Datos automáticos del sistema:**
- Logs de conversaciones con chatbot
- Métricas de uso de plataforma
- Scores de riesgo generados
- Alertas creadas y su resolución
- Tasas de deserción por semestre

**Encuestas:**
- Encuesta inicial de bienestar (baseline)
- Encuestas trimestrales de satisfacción
- Encuesta final de impacto percibido
- NPS (Net Promoter Score) post-uso

**Entrevistas semi-estructuradas:**
- Estudiantes que usaron el chatbot en momentos de crisis
- Tutores sobre utilidad de alertas tempranas
- Profesionales de salud sobre optimización de su trabajo

**Grupos focales:**
- Discusión sobre experiencia de uso
- Identificación de mejoras necesarias

### 4.5 Plan de Análisis de Datos

**Análisis cuantitativo:**
- Estadística descriptiva (promedios, desviaciones, frecuencias)
- Pruebas de hipótesis (t-test para comparar deserción antes/después)
- Análisis de correlación (uso de plataforma vs retención)
- Regresión logística (predictores de deserción)

**Análisis cualitativo:**
- Análisis de contenido de conversaciones (NLP)
- Categorización de tipos de problemas detectados
- Análisis temático de entrevistas y grupos focales

**Machine Learning:**
- Entrenamiento de modelo predictivo de deserción
- Validación cruzada de precisión del algoritmo
- Optimización de hiperparámetros

---

## 5. ARQUITECTURA TÉCNICA

### 5.1 Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN                   │
│                                                     │
│  Next.js 15 (App Router + Server Components)       │
│  - Routing dinámico                                 │
│  - Server-side rendering                            │
│  - Optimización automática                          │
│  - TypeScript estricto                              │
│  - Partial Prerendering (PPR)                       │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────┴──────────────────────────────────┐
│              CAPA DE APLICACIÓN                     │
│                                                     │
│  API Routes (Next.js)                               │
│  - RESTful endpoints                                │
│  - Server Actions                                   │
│  - Middleware de autenticación                      │
│  - Rate limiting                                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│           CAPA DE LÓGICA DE NEGOCIO                 │
│                                                     │
│  Supabase Edge Functions (Deno)                     │
│  - manejador-chatbot: Procesamiento IA              │
│  - detector-riesgo: Análisis de riesgo              │
│  - enviador-notificaciones: Envío de alertas        │
│  - gestor-citas: Gestión de citas                   │
│  - calculador-riesgo-diario: Cron job diario        │
│  - generador-google-meet: Crear enlaces Meet        │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│              CAPA DE DATOS                          │
│                                                     │
│  Supabase (PostgreSQL 15)                           │
│  - Row Level Security                               │
│  - Triggers y funciones                             │
│  - Índices optimizados                              │
│  - Backups automáticos                              │
│  - Tablas en español                                │
│                                                     │
│  Supabase Storage                                   │
│  - Archivos médicos (privado)                       │
│  - Recursos educativos (público)                    │
│  - Fotos de perfil (público)                        │
│                                                     │
│  Supabase Realtime                                  │
│  - Notificaciones en tiempo real                    │
│  - Actualizaciones de dashboard                     │
│  - Sin necesidad de Socket.io                       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│           SERVICIOS EXTERNOS                        │
│                                                     │
│  - Google Gemini API (chatbot IA)                   │
│  - Twilio (WhatsApp/SMS)                            │
│  - Resend/SendGrid (Email)                          │
│  - Google Meet API (Videoconsultas)                 │
└─────────────────────────────────────────────────────┘
```

### 5.2 Modelo de Base de Datos

**Entidades principales:**

```sql
-- Perfiles de usuario
perfiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  nombre_completo TEXT,
  rol TEXT CHECK (rol IN ('estudiante', 'profesional', 'tutor', 'admin')),
  avatar_url TEXT,
  telefono TEXT,
  semestre INTEGER, -- solo para estudiantes
  especialidad TEXT, -- solo para profesionales
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Citas médicas/psicológicas
citas (
  id UUID PRIMARY KEY,
  estudiante_id UUID REFERENCES perfiles(id),
  profesional_id UUID REFERENCES perfiles(id),
  fecha_hora TIMESTAMP,
  duracion_minutos INTEGER DEFAULT 45,
  tipo TEXT CHECK (tipo IN ('psicologia', 'medicina_ocupacional')),
  modalidad TEXT CHECK (modalidad IN ('presencial', 'virtual')),
  estado TEXT CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
  motivo TEXT,
  notas TEXT, -- notas del profesional post-consulta
  enlace_google_meet TEXT, -- URL de Google Meet si es virtual
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
)

-- Conversaciones con chatbot
conversaciones (
  id UUID PRIMARY KEY,
  estudiante_id UUID REFERENCES perfiles(id),
  mensaje TEXT,
  remitente TEXT CHECK (remitente IN ('estudiante', 'bot')),
  sentimiento JSONB, -- {puntaje: 0.8, emocion: 'ansiedad'}
  palabras_clave_riesgo TEXT[], -- array de keywords detectadas
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Alertas de riesgo de deserción
alertas (
  id UUID PRIMARY KEY,
  estudiante_id UUID REFERENCES perfiles(id),
  nivel_riesgo TEXT CHECK (nivel_riesgo IN ('ALTO', 'MEDIO', 'BAJO')),
  puntaje_riesgo DECIMAL(5,2), -- 0.00 a 100.00
  detectado_en TIMESTAMP DEFAULT NOW(),
  tipo_problema TEXT CHECK (tipo_problema IN ('economico', 'emocional', 'academico', 'vocacional', 'familiar', 'salud')),
  resumen_conversacion TEXT,
  estado TEXT CHECK (estado IN ('pendiente', 'en_progreso', 'resuelto', 'cerrado')),
  asignado_a UUID REFERENCES perfiles(id), -- tutor
  descripcion_intervencion TEXT,
  fecha_intervencion TIMESTAMP,
  resuelto_en TIMESTAMP
)

-- Recursos de bienestar
recursos (
  id UUID PRIMARY KEY,
  titulo TEXT,
  descripcion TEXT,
  tipo_contenido TEXT CHECK (tipo_contenido IN ('video', 'pdf', 'articulo', 'audio', 'infografia')),
  categoria TEXT CHECK (categoria IN ('estres', 'nutricion', 'estudio', 'autocuidado', 'vocacional', 'practicas')),
  url TEXT,
  ruta_archivo TEXT, -- si está en Supabase Storage
  conteo_descargas INTEGER DEFAULT 0,
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Talleres y eventos
talleres (
  id UUID PRIMARY KEY,
  titulo TEXT,
  descripcion TEXT,
  facilitador_id UUID REFERENCES perfiles(id),
  fecha_hora TIMESTAMP,
  duracion_minutos INTEGER,
  modalidad TEXT CHECK (modalidad IN ('presencial', 'virtual')),
  capacidad_maxima INTEGER,
  conteo_inscritos INTEGER DEFAULT 0,
  estado TEXT CHECK (estado IN ('programado', 'completado', 'cancelado')),
  enlace_google_meet TEXT, -- si es virtual
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Inscripciones a talleres
inscripciones_talleres (
  id UUID PRIMARY KEY,
  taller_id UUID REFERENCES talleres(id) ON DELETE CASCADE,
  estudiante_id UUID REFERENCES perfiles(id),
  inscrito_en TIMESTAMP DEFAULT NOW(),
  asistio BOOLEAN DEFAULT FALSE,
  url_certificado TEXT,
  UNIQUE(taller_id, estudiante_id)
)

-- Documentos médicos
documentos_medicos (
  id UUID PRIMARY KEY,
  estudiante_id UUID REFERENCES perfiles(id),
  profesional_id UUID REFERENCES perfiles(id),
  cita_id UUID REFERENCES citas(id),
  tipo_documento TEXT CHECK (tipo_documento IN ('receta', 'certificado', 'informe', 'resultado_examen')),
  ruta_archivo TEXT,
  subido_en TIMESTAMP DEFAULT NOW()
)

-- Horarios de disponibilidad de profesionales
horarios_disponibilidad (
  id UUID PRIMARY KEY,
  profesional_id UUID REFERENCES perfiles(id),
  dia_semana INTEGER CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=domingo, 6=sábado
  hora_inicio TIME,
  hora_fin TIME,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Notificaciones
notificaciones (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id),
  tipo TEXT CHECK (tipo IN ('recordatorio_cita', 'alerta', 'mensaje', 'taller')),
  titulo TEXT,
  mensaje TEXT,
  leido BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT NOW()
)

-- Logs de auditoría
registros_auditoria (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id),
  accion TEXT, -- 'ver_historial_medico', 'actualizar_alerta', 'crear_cita', etc.
  tipo_recurso TEXT,
  recurso_id UUID,
  fecha_hora TIMESTAMP DEFAULT NOW(),
  direccion_ip TEXT
)
```

### 5.3 Políticas de Seguridad (Row Level Security)

```sql
-- Estudiantes solo ven SUS propios datos
CREATE POLICY "estudiantes_datos_propios" ON perfiles
  FOR SELECT USING (auth.uid() = id AND rol = 'estudiante');

-- Estudiantes solo ven SUS citas
CREATE POLICY "estudiantes_citas_propias" ON citas
  FOR SELECT USING (auth.uid() = estudiante_id);

-- Profesionales ven citas donde ellos atienden
CREATE POLICY "profesionales_citas_asignadas" ON citas
  FOR SELECT USING (auth.uid() = profesional_id);

-- Tutores ven alertas de estudiantes asignados
CREATE POLICY "tutores_alertas_asignadas" ON alertas
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM perfiles WHERE rol = 'tutor'
    ) AND asignado_a = auth.uid()
  );

-- Admins ven todo
CREATE POLICY "admins_acceso_total" ON perfiles
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM perfiles WHERE rol = 'admin'
    )
  );

-- Estudiantes solo ven SUS conversaciones con el bot
CREATE POLICY "estudiantes_conversaciones_propias" ON conversaciones
  FOR SELECT USING (auth.uid() = estudiante_id);
```

### 5.4 Algoritmo de Detección de Riesgo

**Pseudocódigo del algoritmo principal:**

```typescript
function calcularPuntajeRiesgo(estudianteId: string): number {
  // Factor 1: Análisis de sentimiento en conversaciones (30%)
  const conversacionesRecientes = obtenerConversaciones(estudianteId, ultimos30Dias)
  const puntajeSentimiento = analizarSentimiento(conversacionesRecientes)
  // 0 = muy negativo, 100 = muy positivo
  const factorSentimiento = (100 - puntajeSentimiento) * 0.30
  
  // Factor 2: Inasistencias académicas (25%)
  const tasaAsistencia = obtenerTasaAsistencia(estudianteId)
  // 0 = 0% asistencia, 100 = 100% asistencia
  const factorAsistencia = (100 - tasaAsistencia) * 0.25
  
  // Factor 3: Rendimiento académico (20%)
  const promedioNotas = obtenerPromedioNotas(estudianteId)
  // 0 = nota 0, 100 = nota 20 (escala vigesimal peruana)
  const factorNotas = (100 - (promedioNotas / 20 * 100)) * 0.20
  
  // Factor 4: Desconexión de plataforma (15%)
  const usoPlataforma = obtenerTasaUsoPlataforma(estudianteId, ultimos30Dias)
  // 0 = no usó, 100 = uso diario
  const factorUso = (100 - usoPlataforma) * 0.15
  
  // Factor 5: Consultas repetidas por mismo tema (10%)
  const problemasRepetidos = obtenerPuntajeProblemasRepetidos(estudianteId)
  // 0 = sin repetición, 100 = mismo problema 5+ veces
  const factorRepeticion = problemasRepetidos * 0.10
  
  // Puntaje total (0-100)
  const puntajeTotal = factorSentimiento + factorAsistencia + 
                       factorNotas + factorUso + factorRepeticion
  
  return Math.min(100, Math.max(0, puntajeTotal))
}

function clasificarNivelRiesgo(puntaje: number): string {
  if (puntaje >= 70) return 'ALTO'
  if (puntaje >= 40) return 'MEDIO'
  return 'BAJO'
}

function detectarPalabrasClave(mensaje: string): string[] {
  const palabrasClaveRiesgoAlto = [
    'desertar', 'dejar la carrera', 'no puedo más',
    'quiero irme', 'renunciar', 'no sirvo',
    'no es para mí', 'me quiero morir', 'suicidio'
  ]
  
  const palabrasClaveRiesgoMedio = [
    'estresada', 'ansiosa', 'no sé si seguir',
    'difícil', 'complicado', 'no entiendo',
    'problemas económicos', 'no tengo dinero',
    'mis papás', 'familia', 'dificultades'
  ]
  
  const detectadas = []
  const mensajeMinusculas = mensaje.toLowerCase()
  
  for (const palabraClave of palabrasClaveRiesgoAlto) {
    if (mensajeMinusculas.includes(palabraClave)) {
      detectadas.push(`ALTO:${palabraClave}`)
    }
  }
  
  for (const palabraClave of palabrasClaveRiesgoMedio) {
    if (mensajeMinusculas.includes(palabraClave)) {
      detectadas.push(`MEDIO:${palabraClave}`)
    }
  }
  
  return detectadas
}
```

---

## 6. RESULTADOS ESPERADOS

### 6.1 Resultados Cuantitativos

**Reducción de deserción:**
- Línea base: 15-20% anual
- Meta año 1: 8-12%
- Meta año 2: 5-8%
- Estudiantes retenidas adicionales: 25-30 por año

**Eficiencia en detección:**
- Tiempo promedio de detección: Reducción de 2-4 semanas a menos de 48 horas
- Cobertura de detección: 95% de casos de riesgo real identificados
- Falsos positivos: Menos del 15%

**Optimización de recursos:**
- Capacidad de atención aumentada en 30% (por optimización de agenda)
- Ausentismo a citas reducido en 40%
- Tiempo de gestión administrativa reducido en 50%

**Uso de plataforma:**
- 80% de estudiantes activas mensualmente
- Promedio de 3-5 interacciones con chatbot por estudiante al mes
- 70% de estudiantes acceden a recursos al menos una vez al mes

### 6.2 Resultados Cualitativos

**Mejora en bienestar estudiantil:**
- Percepción de acompañamiento institucional mejorada
- Reducción de niveles de estrés y ansiedad
- Mayor sentido de pertenencia a la comunidad CREA

**Impacto en personal:**
- Tutores más informados y con herramientas para intervenir
- Profesionales de salud con información previa para consultas más efectivas
- Reducción de carga administrativa

**Cultura institucional:**
- Normalización de pedir ayuda psicológica
- Enfoque preventivo vs reactivo
- Toma de decisiones basada en datos

### 6.3 Productos Entregables

**Software:**
- Plataforma web CREA Bienestar desplegada y funcional
- Aplicación móvil (opcional, fase 2)
- Panel administrativo completo

**Documentación:**
- Manual de usuario para estudiantes
- Manual de usuario para profesionales y tutores
- Manual de administración del sistema
- Documentación técnica de arquitectura y código

**Investigación:**
- Tesis completa documentando el proceso y resultados
- Artículo científico para publicación
- Presentación de resultados para CREA y comunidad académica

---

## 7. CRONOGRAMA

### Fase 1: Investigación y Diseño (4 semanas)
- Semana 1-2: Revisión de literatura, marco teórico
- Semana 3: Diseño de arquitectura y base de datos
- Semana 4: Diseño de UI/UX, prototipos

### Fase 2: Desarrollo (8 semanas)
- Semana 5-6: Autenticación y base de datos
- Semana 7-8: Chatbot con IA
- Semana 9-10: Sistema de alertas
- Semana 11-12: Gestión de citas y videoconsultas

### Fase 3: Testing y Ajustes (2 semanas)
- Semana 13: Testing con grupo piloto
- Semana 14: Correcciones y optimizaciones

### Fase 4: Implementación y Evaluación (12 semanas)
- Semana 15: Despliegue en producción
- Semana 16: Capacitación a personal
- Semana 17-26: Monitoreo y recolección de datos

### Fase 5: Análisis y Documentación (4 semanas)
- Semana 27-28: Análisis de resultados
- Semana 29-30: Redacción de tesis

**Total: 30 semanas (7.5 meses)**

---

## 8. BIBLIOGRAFÍA PRELIMINAR

### Deserción Estudiantil

- Tinto, V. (2012). Completing College: Rethinking Institutional Action. University of Chicago Press.
- Himmel, E. (2002). Modelos de análisis de la deserción estudiantil en la educación superior. Revista Calidad en la Educación, 17, 91-108.
- Donoso, S., & Schiefelbein, E. (2007). Análisis de los modelos explicativos de retención de estudiantes en la universidad.

### Inteligencia Artificial en Educación

- Holmes, W., Bialik, M., & Fadel, C. (2019). Artificial Intelligence in Education: Promises and Implications for Teaching and Learning.
- Zawacki-Richter, O., et al. (2019). Systematic review of research on artificial intelligence applications in higher education. International Journal of Educational Technology in Higher Education, 16(1), 39.
- Goel, A. K., & Polepeddi, L. (2016). Jill Watson: A Virtual Teaching Assistant for Online Education.

### Sistemas de Alerta Temprana

- Arnold, K. E., & Pistilli, M. D. (2012). Course signals at Purdue: Using learning analytics to increase student success. LAK '12: Proceedings of the 2nd International Conference on Learning Analytics and Knowledge.
- Macfadyen, L. P., & Dawson, S. (2010). Mining LMS data to develop an "early warning system" for educators.

### Chatbots y Salud Mental

- Fitzpatrick, K. K., Darcy, A., & Vierhile, M. (2017). Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial. JMIR Mental Health, 4(2), e19.
- Inkster, B., Sarda, S., & Subramanian, V. (2018). An Empathy-Driven, Conversational Artificial Intelligence Agent (Wysa) for Digital Mental Well-Being.

### Contexto Peruano

- MINEDU (2020). Estudio sobre la deserción estudiantil en la educación superior universitaria y no universitaria en el Perú.
- SUNEDU (2021). Informe Bienal sobre la Realidad Universitaria en el Perú.

---

## 9. CONSIDERACIONES ÉTICAS

### 9.1 Privacidad y Confidencialidad

**Consentimiento informado:**
Todas las estudiantes firmarán documento donde se explica:
- Qué datos se recopilan
- Cómo se usan (solo para bienestar estudiantil)
- Quién tiene acceso
- Derecho a rechazar sin consecuencias académicas

**Anonimización para investigación:**
Datos usados en tesis serán completamente anonimizados. Ninguna estudiante será identificable.

**Almacenamiento seguro:**
- Encriptación en reposo y en tránsito
- Acceso mediante autenticación de dos factores
- Logs de auditoría de quién accedió a qué información
- Backups encriptados

### 9.2 Uso Responsable de IA

**Transparencia:**
Las estudiantes sabrán que están hablando con un bot, no con una persona.

**Supervisión humana:**
El chatbot NO toma decisiones finales. Siempre hay un profesional humano en el loop.

**Limitaciones claras:**
El bot está programado para derivar casos complejos o de emergencia a humanos inmediatamente.

**Sesgo algorítmico:**
Monitoreo constante para detectar sesgos (por ejemplo, que el algoritmo discrimine por semestre, edad, etc.).

### 9.3 Protección de Grupos Vulnerables

Las estudiantes en crisis emocional son población vulnerable. Protocolos especiales:

**Emergencias:**
Si se detecta riesgo suicida, protocolo automático de contacto inmediato con profesional de salud y familiar de emergencia.

**No discriminación:**
El sistema no puede ser usado para castigar o discriminar. Alertas son solo para ayuda.

**Derecho a no participar:**
Estudiantes pueden optar por no usar la plataforma sin afectar su situación académica.

---

## 10. LIMITACIONES Y RIESGOS

### 10.1 Limitaciones Técnicas

**Dependencia de conectividad:**
Estudiantes sin internet estable pueden tener acceso limitado. Mitigación: Versión móvil optimizada para bajo ancho de banda.

**Precisión del algoritmo:**
El sistema puede tener falsos positivos (alerta sin riesgo real) o falsos negativos (no detecta riesgo real). Mitigación: Mejora continua y supervisión humana.

**Adopción tecnológica:**
Estudiantes poco familiarizadas con tecnología pueden tener curva de aprendizaje. Mitigación: Interfaz muy intuitiva y capacitación inicial.

### 10.2 Limitaciones de Alcance

**No reemplaza atención humana:**
El sistema complementa, no sustituye, a profesionales de salud.

**Problemas externos:**
Estudiantes con problemas fuera del alcance institucional (violencia doméstica severa, enfermedades graves) requieren derivación a servicios externos.

**Muestra limitada:**
CREA tiene ~250 estudiantes. Resultados pueden no ser generalizables a instituciones mucho más grandes o con perfiles diferentes.

### 10.3 Riesgos y Mitigación

**Riesgo: Violación de privacidad**
- Mitigación: Encriptación, RLS, auditoría, políticas estrictas de acceso

**Riesgo: Dependencia excesiva del sistema**
- Mitigación: Capacitación continua sobre que es herramienta de apoyo, no solución mágica

**Riesgo: Resistencia al cambio del personal**
- Mitigación: Involucramiento desde diseño, capacitación, demostración de valor

**Riesgo: Falla técnica en momento crítico**
- Mitigación: Sistema de respaldo, monitoreo 24/7, protocolo de emergencia manual

---

## 11. ESCALABILIDAD Y SOSTENIBILIDAD

### 11.1 Plan de Escalamiento

**Fase 1 (Año 1): CREA - 250 estudiantes**
- Implementación completa
- Validación de modelo
- Refinamiento basado en feedback

**Fase 2 (Año 2): Otras EESP de Lima**
- Replicación en 3-5 instituciones similares
- Adaptación a contextos específicos
- Modelo SaaS multi-tenant

**Fase 3 (Año 3+): Nacional**
- Escalamiento a nivel Perú
- Integración con MINEDU
- Versión para universidades

### 11.2 Sostenibilidad Financiera

**Modelo para CREA (sin costo):**
- Tier gratuito de servicios cloud
- Donación de desarrollo (tesis)
- Bajo costo de mantenimiento ($10-20/mes)

**Modelo comercial para escalamiento:**
- SaaS (Software as a Service)
- Licencia por estudiante: $2-3/mes por estudiante
- Institución de 250 estudiantes: $500-750/mes
- Cubre costos de infraestructura, soporte y mejora continua

**Fuentes alternativas:**
- Financiamiento MINEDU para innovación educativa
- Fondos de investigación universitaria
- Alianzas con ONG enfocadas en educación

### 11.3 Mantenimiento a Largo Plazo

**Actualizaciones tecnológicas:**
- Next.js y Supabase tienen actualizaciones automáticas
- Gemini API mejora continuamente sin cambios de código

**Mejora del algoritmo:**
- Con más datos, el modelo de ML se vuelve más preciso
- Feedback loop continuo de casos reales

**Soporte:**
- Documentación exhaustiva
- Capacitación a personal técnico de CREA
- Comunidad de desarrolladores (si se open-source parte del código)

---

## 12. CONCLUSIONES PRELIMINARES

### 12.1 Viabilidad Técnica

El stack tecnológico seleccionado (Next.js + Supabase + Gemini API) es:
- Moderno y probado en producción por miles de empresas
- Con tier gratuito suficiente para fase piloto
- Escalable a millones de usuarios si es necesario
- Con amplia documentación y comunidad de soporte

### 12.2 Viabilidad Económica

- Inversión inicial: ~$0 (desarrollo en tesis, servicios gratuitos)
- Costo operacional: $10-125/mes según escala
- ROI para CREA: Retener 25-30 estudiantes/año = $50,000-75,000 en ingresos retenidos
- Sostenible financieramente

### 12.3 Impacto Social Potencial

- Más maestras formadas = mejor educación inicial en Perú
- Modelo replicable en otras instituciones
- Contribución a reducción de deserción en educación superior
- Democratización de acceso a apoyo psicológico

### 12.4 Innovación

- Primera plataforma en Perú que combina IA conversacional + detección de deserción + gestión de bienestar
- Enfoque preventivo y proactivo (no solo reactivo)
- Basado en datos y evidencia
- Open source potencial para beneficiar a más instituciones

---

**Autor:** [Tu nombre]  
**Institución:** [Tu universidad]  
**Programa:** [Tu carrera/programa]  
**Asesor:** [Nombre del asesor]  
**Fecha:** Octubre 2025  
**Versión:** 1.0
