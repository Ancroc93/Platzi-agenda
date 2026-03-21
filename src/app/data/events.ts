// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dos categorías principales según el PRD:
 * - promocion  → se muestran como "Día completo" en el calendario
 * - divulgacion → se muestran en horarios específicos
 */
export type EventType = 'promocion' | 'divulgacion';

/**
 * Categorías de Divulgación (horario específico):
 *   Platzi Live · Lanzamiento de cursos · Clases Platzi Master
 *   Clases abiertas al público · Platzi CONF Charla
 *
 * Categorías de Promoción (día completo):
 *   Platzi Gratis · Descuentos y promociones · Platzi CONF
 */
export type EventCategory =
  // Divulgación
  | 'Platzi Live'
  | 'Lanzamiento de cursos'
  | 'Clases Platzi Master'
  | 'Clases abiertas al público'
  | 'Platzi CONF Charla'
  // Promoción
  | 'Platzi Gratis'
  | 'Descuentos y promociones'
  | 'Platzi CONF';

export interface PlatziEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** Clasificación principal según el PRD */
  eventType: EventType;
  /** true → se muestra en la franja "Todo el día"; false → posicionado por hora */
  isAllDay: boolean;
  isLive: boolean;
  isCourse: boolean;
  isFree: boolean;
  school?: string;
  /** Para eventos de día completo (isAllDay=true): hora ignorada, se usa durationMinutes para calcular el rango de días */
  date: Date;
  /** En minutos. Para eventos de día completo: múltiplos de 1440 (1 día = 1440 min) */
  durationMinutes: number;
  tags: string[];
  description: string;
  imageUrl?: string;
  instructor?: string;
  instructorRole?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const today = new Date();
const currentYear = today.getFullYear();

const createDate = (dayOffset: number, hour: number, minute = 0): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};

/**
 * Devuelve todos los jueves del año actual a las 16:00 (hora Colombia, UTC-5).
 * Platzi Live se transmite cada jueves de 4 pm a 7 pm.
 */
const getThursdaysOfYear = (): Date[] => {
  const thursdays: Date[] = [];
  const jan1 = new Date(currentYear, 0, 1);
  // getDay(): 0=Dom … 4=Jue … 6=Sáb
  const firstThursdayOffset = (4 - jan1.getDay() + 7) % 7;
  let d = new Date(currentYear, 0, 1 + firstThursdayOffset);
  while (d.getFullYear() === currentYear) {
    const slot = new Date(d);
    slot.setHours(16, 0, 0, 0); // 4:00 pm Colombia
    thursdays.push(slot);
    d = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return thursdays;
};

// ─────────────────────────────────────────────────────────────────────────────
// PLATZI LIVE — Auto-generado (todos los jueves del año)
// ─────────────────────────────────────────────────────────────────────────────

const PLATZI_LIVE_EVENTS: PlatziEvent[] = getThursdaysOfYear().map((date, i) => ({
  id: `pl-${i + 1}`,
  title: 'Platzi Live',
  category: 'Platzi Live' as EventCategory,
  eventType: 'divulgacion' as EventType,
  isAllDay: false,
  isLive: true,
  isCourse: false,
  isFree: true,
  date,
  durationMinutes: 180, // 4 pm → 7 pm
  tags: ['Comunidad', 'En vivo'],
  description:
    'Platzi Live es un espacio de aprendizaje en vivo donde la comunidad TECH se reúne para aprender, interactuar y crecer en conjunto 🚀.\n\nAquí aprendes con las personas más TOP en IA, marketing, programación, liderazgo, y mucho más.\n\nLa agenda estará pronto disponible, pero te aseguramos que estará increíble, así que regístrate YA.\n\n¿Quieres que hablemos de un tema? Escríbenos en team@platzi.com',
  instructor: 'Freddy Vega',
  instructorRole: 'CEO de Platzi',
}));

// ─────────────────────────────────────────────────────────────────────────────
// EVENTOS MANUALES
// ─────────────────────────────────────────────────────────────────────────────

const MANUAL_EVENTS: PlatziEvent[] = [

  // ── Divulgación: Lanzamiento de cursos ────────────────────────────────────

  {
    id: 'e1',
    title: 'Curso de Fundamentos de Computación e Informática',
    category: 'Lanzamiento de cursos',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: true,
    isLive: false,
    isFree: true,
    school: 'Escuela de Desarrollo Web',
    date: createDate(0, 9, 0),
    durationMinutes: 120,
    tags: ['Nuevo', 'Básico'],
    description:
      'Domina lo esencial: periféricos, puertos USB-C/HDMI/Ethernet, CPU, RAM y SSD. El punto de partida ideal para tu carrera tech.',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    instructor: 'Jhon Carvajal',
    instructorRole: 'Profesor',
  },
  {
    id: 'e2',
    title: 'Curso de ChatGPT Avanzado',
    category: 'Lanzamiento de cursos',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: true,
    isLive: false,
    isFree: false,
    school: 'Escuela de Inteligencia Artificial y Data Science',
    date: createDate(3, 10, 0),
    durationMinutes: 180,
    tags: ['Próximamente', 'IA'],
    description:
      'Crea prompts complejos, conecta APIs de OpenAI y construye tus propios agentes inteligentes con las últimas técnicas de prompt engineering.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    instructor: 'Rodrigo Rojo',
    instructorRole: 'Experto en IA',
  },
  {
    id: 'e3',
    title: 'Curso de Fundamentos de .NET',
    category: 'Lanzamiento de cursos',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: true,
    isLive: false,
    isFree: false,
    school: 'Escuela de Desarrollo Web',
    date: createDate(-4, 11, 0),
    durationMinutes: 150,
    tags: ['Nuevo', '.NET'],
    description:
      'Inicia tu camino en el ecosistema de Microsoft. Crea APIs modernas y escalables con C# y .NET 8.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    instructor: 'Sebastián Martínez',
    instructorRole: 'Backend Dev',
  },

  // ── Divulgación: Clases Platzi Master ─────────────────────────────────────

  {
    id: 'e4',
    title: 'Taller en vivo: Testing de Frontend con React',
    category: 'Clases Platzi Master',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: true,
    isFree: false,
    school: 'Escuela de Desarrollo Web',
    date: createDate(2, 19, 0),
    durationMinutes: 90,
    tags: ['Master', 'Frontend'],
    description:
      'Sesión en vivo: estrategias de testing en React con Vitest y Testing Library aplicadas a casos reales de producción.',
    instructor: 'Camila Torres',
    instructorRole: 'Frontend Engineer',
  },
  {
    id: 'e5',
    title: 'Taller en vivo: Diseño de APIs con Node.js',
    category: 'Clases Platzi Master',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: true,
    isFree: false,
    school: 'Escuela de Desarrollo Web',
    date: createDate(6, 18, 30),
    durationMinutes: 120,
    tags: ['Master', 'Backend', 'APIs'],
    description:
      'Construye una API robusta con Node.js: versionado, manejo de errores y buenas prácticas para entornos productivos.',
    instructor: 'Diego Cueva',
    instructorRole: 'Backend Tech Lead',
  },

  // ── Divulgación: Clases abiertas al público ───────────────────────────────

  {
    id: 'e6',
    title: 'Clase abierta: Introducción a Python desde cero',
    category: 'Clases abiertas al público',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: true,
    isFree: true,
    school: 'Escuela de Programación',
    date: createDate(4, 17, 0),
    durationMinutes: 60,
    tags: ['Gratis', 'Básico', 'Python'],
    description:
      'Clase gratuita y abierta para quienes quieren dar sus primeros pasos en programación con Python. Sin requisitos previos.',
    instructor: 'Laura Pérez',
    instructorRole: 'Instructora de Programación',
  },
  {
    id: 'e7',
    title: 'Clase abierta: Cómo empezar en ciberseguridad',
    category: 'Clases abiertas al público',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: true,
    isFree: true,
    school: 'Escuela de Ciberseguridad',
    date: createDate(10, 16, 0),
    durationMinutes: 60,
    tags: ['Gratis', 'Ciberseguridad'],
    description:
      'Perfiles de trabajo en ciberseguridad, habilidades más demandadas y cómo iniciar tu carrera en este campo tan crítico.',
    instructor: 'Carlos Mendoza',
    instructorRole: 'Especialista en Seguridad',
  },

  // ── Divulgación: Platzi CONF Charlas ──────────────────────────────────────

  {
    id: 'e8',
    title: 'CONF: El futuro del trabajo en la era de la IA',
    category: 'Platzi CONF Charla',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: false,
    isFree: false,
    date: createDate(20, 10, 0),
    durationMinutes: 60,
    tags: ['CONF', 'IA', 'Trabajo'],
    description:
      'Cómo los modelos de lenguaje grande redefinen los roles profesionales y qué habilidades serán más valiosas en la próxima década.',
    instructor: 'Ana García',
    instructorRole: 'Investigadora del Futuro del Trabajo',
  },
  {
    id: 'e9',
    title: 'CONF: IA en la educación latinoamericana',
    category: 'Platzi CONF Charla',
    eventType: 'divulgacion',
    isAllDay: false,
    isCourse: false,
    isLive: false,
    isFree: false,
    date: createDate(20, 12, 0),
    durationMinutes: 45,
    tags: ['CONF', 'IA', 'Educación'],
    description:
      'Cómo plataformas de aprendizaje adaptan la IA generativa para personalizar trayectorias y democratizar la educación técnica en LATAM.',
    instructor: 'Freddy Vega',
    instructorRole: 'CEO de Platzi',
  },

  // ── Promoción: Platzi Gratis ───────────────────────────────────────────────

  {
    id: 'e10',
    title: 'Platzi Day: 48 horas de acceso libre',
    category: 'Platzi Gratis',
    eventType: 'promocion',
    isAllDay: true,
    isCourse: false,
    isLive: false,
    isFree: true,
    date: createDate(5, 0, 0),
    durationMinutes: 2 * 24 * 60, // 2 días
    tags: ['Promo', 'Gratis'],
    description:
      'Abre todas las escuelas y cursos de Platzi sin costo durante 48 horas. ¡Aprovecha para aprender lo que siempre quisiste!',
  },

  // ── Promoción: Descuentos y promociones ───────────────────────────────────

  {
    id: 'e11',
    title: 'Cyber Monday Platzi: 40% de descuento',
    category: 'Descuentos y promociones',
    eventType: 'promocion',
    isAllDay: true,
    isCourse: false,
    isLive: false,
    isFree: false,
    date: createDate(14, 0, 0),
    durationMinutes: 24 * 60, // 1 día
    tags: ['Promo', 'Descuento'],
    description:
      'Solo por 24 horas: accede al plan anual con 40% de descuento. La oferta más grande del año en Platzi.',
  },
  {
    id: 'e12',
    title: 'Semana de descuentos: planes anuales',
    category: 'Descuentos y promociones',
    eventType: 'promocion',
    isAllDay: true,
    isCourse: false,
    isLive: false,
    isFree: false,
    date: createDate(28, 0, 0),
    durationMinutes: 7 * 24 * 60, // 7 días
    tags: ['Promo', 'Descuento', 'Semana'],
    description:
      'Una semana completa de precios especiales en todos los planes de Platzi. Comparte con tu equipo y aprendan juntos.',
  },

  // ── Promoción: Platzi CONF ─────────────────────────────────────────────────

  {
    id: 'e13',
    title: 'Platzi CONF 2026',
    category: 'Platzi CONF',
    eventType: 'promocion',
    isAllDay: true,
    isCourse: false,
    isLive: false,
    isFree: false,
    date: createDate(20, 0, 0),
    durationMinutes: 3 * 24 * 60, // 3 días
    tags: ['CONF', 'Presencial'],
    description:
      'La conferencia de tecnología y educación más grande de Latinoamérica. Tres días de charlas, talleres y networking con los mejores referentes del ecosistema tech.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: PlatziEvent[] = [...PLATZI_LIVE_EVENTS, ...MANUAL_EVENTS];
