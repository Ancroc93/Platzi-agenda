// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type EventType = 'promocion' | 'divulgacion';

export type EventCategory =
  | 'Platzi Live'
  | 'Lanzamiento de cursos'
  | 'Clases Platzi Master'
  | 'Clases abiertas al público'
  | 'Platzi CONF Charla'
  | 'Platzi Gratis'
  | 'Descuentos y promociones'
  | 'Platzi CONF';

export interface PlatziEvent {
  id: string;
  title: string;
  category: EventCategory;
  eventType: EventType;
  isAllDay: boolean;
  isLive: boolean;
  isCourse: boolean;
  isFree: boolean;
  school?: string;
  date: Date;
  durationMinutes: number;
  tags: string[];
  description: string;
  imageUrl?: string;
  instructor?: string;
  instructorRole?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BASE DATA (4-MONTH SCENARIO)
// ─────────────────────────────────────────────────────────────────────────────

const TODAY = new Date();
const FOUR_MONTHS_END = new Date(TODAY);
FOUR_MONTHS_END.setMonth(FOUR_MONTHS_END.getMonth() + 4);

const LEARNING_SCHOOLS = [
  'Desarrollo Web',
  'English Academy',
  'Marketing Digital',
  'Inteligencia Artificial y Data Science',
  'Ciberseguridad',
  'Liderazgo y Habilidades Blandas',
  'Diseño de Producto y UX',
  'Desarrollo Móvil',
  'Contenido Audiovisual',
  'Finanzas e Inversiones',
  'Cloud Computing y DevOps',
  'Programación',
  'Diseño Gráfico y Arte Digital',
  'Blockchain y Web3',
  'Recursos Humanos',
  'Startups',
  'Negocios',
  'Arquitectura',
];

const MASTER_TOPICS = [
  'Arquitecturas escalables',
  'Automatización con IA',
  'Optimización de performance',
  'Diseño de producto orientado a datos',
  'Seguridad aplicada',
  'Estrategias de crecimiento',
  'Colaboración efectiva en equipos',
  'Roadmaps de aprendizaje',
];

const FREE_TOPICS = [
  'Introducción práctica',
  'Fundamentos en 60 minutos',
  'Primeros pasos guiados',
  'Taller para principiantes',
  'Sesión abierta de dudas',
];

const COURSE_LAUNCHES = [
  'Curso de React Avanzado para Equipos',
  'Curso de Python para Análisis de Datos',
  'Curso de Ciberseguridad Defensiva',
  'Curso de UX Writing para Producto',
  'Curso de IA Generativa para Marketing',
  'Curso de Arquitectura de Microservicios',
  'Curso de Liderazgo Técnico',
  'Curso de Estrategia de Negocios Digitales',
];

const SPEAKERS = [
  { name: 'Camila Torres', role: 'Senior Learning Coach' },
  { name: 'Diego Cueva', role: 'Principal Engineer' },
  { name: 'Laura Pérez', role: 'Community Educator' },
  { name: 'Andrés Jaramillo', role: 'Lead Instructor' },
  { name: 'María Camacho', role: 'Product Education Manager' },
  { name: 'Santiago Rojas', role: 'Tech Mentor' },
  { name: 'Valentina Ruiz', role: 'Growth Specialist' },
  { name: 'Julián Ocampo', role: 'Curriculum Designer' },
];

const OVERLOADED_DAY_OFFSETS = [4, 15, 29, 43, 57, 72, 89, 104];
const OVERLOADED_DAY_TIMES = [
  { h: 9, m: 0 },
  { h: 9, m: 30 },
  { h: 10, m: 0 },
  { h: 10, m: 30 },
];
const DISTRIBUTED_TIMES = [
  { h: 8, m: 30 },
  { h: 10, m: 0 },
  { h: 11, m: 30 },
  { h: 14, m: 0 },
  { h: 15, m: 30 },
  { h: 17, m: 0 },
  { h: 18, m: 30 },
];

const TECH_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80&auto=format&fit=crop',
];

const pickTechImage = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TECH_IMAGE_POOL[hash % TECH_IMAGE_POOL.length];
};

const seedImg = (seed: string) => pickTechImage(seed);

const createDate = (dayOffset: number, hour: number, minute = 0): Date => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const getSlotDate = (slotIndex: number): Date => {
  if (slotIndex < OVERLOADED_DAY_OFFSETS.length * 4) {
    const day = OVERLOADED_DAY_OFFSETS[Math.floor(slotIndex / 4)];
    const t = OVERLOADED_DAY_TIMES[slotIndex % OVERLOADED_DAY_TIMES.length];
    return createDate(day, t.h, t.m);
  }

  const n = slotIndex - OVERLOADED_DAY_OFFSETS.length * 4;
  const dayOffset = ((n * 5) % 112) + 3 + (n % 3);
  const t = DISTRIBUTED_TIMES[n % DISTRIBUTED_TIMES.length];
  return createDate(Math.min(dayOffset, 118), t.h, t.m);
};

const speakerByIndex = (i: number) => SPEAKERS[i % SPEAKERS.length];

const schoolShort = (school: string) => school.replace(/^Escuela de\s+/i, '').trim();

// ─────────────────────────────────────────────────────────────────────────────
// GENERATED EVENTS
// ─────────────────────────────────────────────────────────────────────────────

const MASTER_EVENTS: PlatziEvent[] = LEARNING_SCHOOLS.flatMap((school, schoolIdx) =>
  [0, 1].map((n) => {
    const slot = schoolIdx * 2 + n;
    const speaker = speakerByIndex(slot + 2);
    const topic = MASTER_TOPICS[(schoolIdx + n) % MASTER_TOPICS.length];
    return {
      id: `master-${schoolIdx + 1}-${n + 1}`,
      title: `Masterclass: ${topic} en ${schoolShort(school)}`,
      category: 'Clases Platzi Master' as EventCategory,
      eventType: 'divulgacion' as EventType,
      isAllDay: false,
      isLive: true,
      isCourse: false,
      isFree: false,
      school,
      date: getSlotDate(slot),
      durationMinutes: n === 0 ? 90 : 120,
      tags: ['Master', schoolShort(school)],
      description:
        `Sesión avanzada enfocada en ${topic.toLowerCase()} aplicada a retos reales de ${schoolShort(school)}.\n\n` +
        'Trabajaremos casos prácticos, resolución en vivo y buenas prácticas para llevar lo aprendido a tu día a día.\n\n' +
        'Incluye espacio de preguntas y recursos descargables para continuar profundizando.',
      imageUrl: seedImg(`master-${schoolIdx}-${n}`),
      instructor: speaker.name,
      instructorRole: speaker.role,
    };
  }),
);

const FREE_EVENTS: PlatziEvent[] = LEARNING_SCHOOLS.map((school, schoolIdx) => {
  const slot = 32 + schoolIdx;
  const speaker = speakerByIndex(slot + 4);
  const topic = FREE_TOPICS[schoolIdx % FREE_TOPICS.length];
  return {
    id: `free-${schoolIdx + 1}`,
    title: `Clase gratuita: ${topic} de ${schoolShort(school)}`,
    category: 'Clases abiertas al público' as EventCategory,
    eventType: 'divulgacion' as EventType,
    isAllDay: false,
    isLive: true,
    isCourse: false,
    isFree: true,
    school,
    date: getSlotDate(slot),
    durationMinutes: 60,
    tags: ['Gratis', schoolShort(school)],
    description:
      `Clase abierta para descubrir los fundamentos de ${schoolShort(school)}.\n\n` +
      'Ideal para iniciar desde cero: veremos conceptos clave, una demo guiada y recomendaciones para seguir aprendiendo.\n\n' +
      'No requiere experiencia previa y queda grabada para quienes se registren.',
    imageUrl: seedImg(`free-${schoolIdx}`),
    instructor: speaker.name,
    instructorRole: 'Instructor(a) Invitado(a)',
  };
});

const COURSE_LAUNCH_EVENTS: PlatziEvent[] = COURSE_LAUNCHES.map((courseTitle, i) => {
  const slot = 32 + LEARNING_SCHOOLS.length + i;
  const school = LEARNING_SCHOOLS[i % LEARNING_SCHOOLS.length];
  const speaker = speakerByIndex(slot + 7);
  return {
    id: `launch-${i + 1}`,
    title: `Lanzamiento: ${courseTitle}`,
    category: 'Lanzamiento de cursos' as EventCategory,
    eventType: 'divulgacion' as EventType,
    isAllDay: false,
    isLive: false,
    isCourse: true,
    isFree: i % 3 === 0,
    school,
    date: getSlotDate(slot),
    durationMinutes: i % 2 === 0 ? 90 : 120,
    tags: ['Lanzamiento', schoolShort(school)],
    description:
      `Presentamos ${courseTitle}, un curso creado para acelerar tu progreso en ${schoolShort(school)}.\n\n` +
      'Revisaremos el temario, proyectos incluidos, nivel recomendado y ruta sugerida para aprovecharlo al máximo.\n\n' +
      'Al finalizar conocerás cómo integrarlo en tu plan semanal de estudio.',
    imageUrl: seedImg(`launch-${i}`),
    instructor: speaker.name,
    instructorRole: 'Autor(a) del curso',
  };
});

// Platzi Live semanal durante los próximos 4 meses.
const getNextThursdays = (): Date[] => {
  const dates: Date[] = [];
  const d = new Date(TODAY);
  const day = d.getDay(); // 4 = jueves
  const offset = (4 - day + 7) % 7;
  d.setDate(d.getDate() + offset);
  d.setHours(16, 0, 0, 0);

  while (d <= FOUR_MONTHS_END) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return dates;
};

const PLATZI_LIVE_EVENTS: PlatziEvent[] = getNextThursdays().map((date, i) => ({
  id: `pl-live-${i + 1}`,
  title: 'Platzi Live',
  category: 'Platzi Live' as EventCategory,
  eventType: 'divulgacion' as EventType,
  isAllDay: false,
  isLive: true,
  isCourse: false,
  isFree: true,
  date,
  durationMinutes: 180,
  tags: ['Comunidad', 'En vivo'],
  description:
    'Platzi Live es un espacio para aprender, compartir y crecer en comunidad con referentes del ecosistema tech.\n\n' +
    'En cada edición abordamos un tema actual con ejemplos prácticos, casos reales y una sesión abierta de preguntas.\n\n' +
    'Regístrate para recibir recordatorio y materiales complementarios.',
  imageUrl: seedImg(`platzi-live-${i}`),
  instructor: 'Freddy Vega',
  instructorRole: 'CEO de Platzi',
}));

const FULL_DAY_PROMO_EVENTS: PlatziEvent[] = [
  {
    id: 'promo-free-1',
    title: 'Platzi Day: 48 horas de acceso libre',
    category: 'Platzi Gratis',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: true,
    date: createDate(11, 0, 0),
    durationMinutes: 2 * 24 * 60,
    tags: ['Promo', 'Gratis', 'Acceso libre'],
    description:
      'Durante 48 horas tendrás acceso abierto a rutas de aprendizaje seleccionadas para que explores nuevos temas y avances a tu ritmo.\n\n' +
      'Activa recordatorios para no perderte los contenidos clave y comparte el evento con tu equipo.',
    imageUrl: seedImg('promo-free-1'),
    instructor: 'Team Platzi',
    instructorRole: 'Community Team',
  },
  {
    id: 'promo-discount-1',
    title: 'Flash Sale: 40% de descuento en planes anuales',
    category: 'Descuentos y promociones',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: false,
    date: createDate(24, 0, 0),
    durationMinutes: 24 * 60,
    tags: ['Descuento', 'Oferta', 'Planes'],
    description:
      'Promoción de un día para renovar o activar plan anual con 40% de descuento.\n\n' +
      'Revisa las condiciones de la oferta y los beneficios incluidos antes de finalizar tu compra.',
    imageUrl: seedImg('promo-discount-1'),
    instructor: 'Valentina Ruiz',
    instructorRole: 'Growth Specialist',
  },
  {
    id: 'promo-conf-1',
    title: 'Platzi CONF 2026',
    category: 'Platzi CONF',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: false,
    date: new Date(TODAY.getFullYear(), 4, 16, 0, 0, 0, 0),
    durationMinutes: 24 * 60,
    tags: ['CONF', 'Networking', 'Comunidad'],
    description:
      'Tres días de charlas, talleres y networking con speakers del ecosistema tech de Latinoamérica.\n\n' +
      'Consulta la agenda oficial para conocer las franjas temáticas y actividades especiales.',
    imageUrl: seedImg('promo-conf-1'),
    instructor: 'Freddy Vega',
    instructorRole: 'Host',
  },
  {
    id: 'promo-free-2',
    title: 'Platzi Gratis Weekend',
    category: 'Platzi Gratis',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: true,
    date: createDate(63, 0, 0),
    durationMinutes: 2 * 24 * 60,
    tags: ['Gratis', 'Weekend'],
    description:
      'Fin de semana abierto con clases destacadas y rutas introductorias para nuevos estudiantes.\n\n' +
      'Aprovecha para probar escuelas diferentes y definir tu plan de estudio del próximo mes.',
    imageUrl: seedImg('promo-free-2'),
    instructor: 'Laura Pérez',
    instructorRole: 'Community Educator',
  },
  {
    id: 'promo-discount-2',
    title: 'Semana de descuentos: ruta completa de IA',
    category: 'Descuentos y promociones',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: false,
    date: createDate(82, 0, 0),
    durationMinutes: 7 * 24 * 60,
    tags: ['Descuento', 'IA', 'Semana'],
    description:
      'Precio especial por una semana para rutas de Inteligencia Artificial y Data Science.\n\n' +
      'Incluye recomendaciones de cursos para perfiles de producto, ingeniería y marketing.',
    imageUrl: seedImg('promo-discount-2'),
    instructor: 'Andrés Jaramillo',
    instructorRole: 'Lead Instructor',
  },
  {
    id: 'promo-conf-2',
    title: 'Platzi CONF Global Sessions',
    category: 'Platzi CONF',
    eventType: 'promocion',
    isAllDay: true,
    isLive: false,
    isCourse: false,
    isFree: false,
    date: createDate(104, 0, 0),
    durationMinutes: 24 * 60,
    tags: ['CONF', 'Global', 'Sessions'],
    description:
      'Edición especial de CONF con sesiones globales y paneles temáticos en formato híbrido.\n\n' +
      'Consulta speakers invitados, horarios y enlaces de transmisión para cada sala.',
    imageUrl: seedImg('promo-conf-2'),
    instructor: 'Santiago Rojas',
    instructorRole: 'Tech Mentor',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: PlatziEvent[] = [
  ...MASTER_EVENTS,
  ...FREE_EVENTS,
  ...COURSE_LAUNCH_EVENTS,
  ...PLATZI_LIVE_EVENTS,
  ...FULL_DAY_PROMO_EVENTS,
]
  .filter((e) => e.date >= TODAY && e.date <= FOUR_MONTHS_END)
  .sort((a, b) => a.date.getTime() - b.date.getTime());
