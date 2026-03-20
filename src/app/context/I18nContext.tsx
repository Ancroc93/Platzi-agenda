import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { enUS, es } from 'date-fns/locale';

export type AppLocale = 'es' | 'en';

type Dict = Record<string, string>;

const DICTS: Record<AppLocale, Dict> = {
  es: {
    searchPlaceholder: '¿Qué quieres aprender?',
    plans: 'Planes',
    points: 'pts',
    agendaTitle: 'Agenda Platzi',
    agendaSubtitle: 'Mantente al día con lanzamientos y clases en vivo.',
    filters: 'Filtros',
    today: 'Hoy',
    more: 'más',
    noUpcomingEvents: 'No hay eventos próximos agendados.',
    evt: 'evt',
    evts: 'evts',
    language: 'Idioma',
    spanish: 'Español',
    english: 'English',
    translateAria: 'Cambiar idioma',
    viewDay: 'Día',
    view3days: '3 días',
    viewMonth: 'Mes',
    viewYear: 'Año',
    featuredTitle: 'Proximos eventos',
    featuredSubtitle:
      'Únete a nuestras Live Classes y aprende de la mano de expertos a potenciar tus habilidades.',
    carouselPrev: 'Desplazar carrusel a la izquierda',
    carouselNext: 'Desplazar carrusel a la derecha',
    viewFree: 'Ver gratis',
    registerFree: 'Regístrate gratis',
    hour: 'hora',
    hours: 'horas',
    mins: 'mins',
    live: 'Live',
  },
  en: {
    searchPlaceholder: 'What do you want to learn?',
    plans: 'Plans',
    points: 'pts',
    agendaTitle: 'Platzi Agenda',
    agendaSubtitle: 'Stay on top of launches and live classes.',
    filters: 'Filters',
    today: 'Today',
    more: 'more',
    noUpcomingEvents: 'No upcoming events scheduled.',
    evt: 'evt',
    evts: 'evts',
    language: 'Language',
    spanish: 'Spanish',
    english: 'English',
    translateAria: 'Change language',
    viewDay: 'Day',
    view3days: '3 days',
    viewMonth: 'Month',
    viewYear: 'Year',
    featuredTitle: "What you can't miss",
    featuredSubtitle:
      'Join our Live Classes and learn from experts to boost your skills.',
    carouselPrev: 'Scroll carousel left',
    carouselNext: 'Scroll carousel right',
    viewFree: 'Watch free',
    registerFree: 'Sign up free',
    hour: 'hour',
    hours: 'hours',
    mins: 'mins',
    live: 'Live',
  },
};

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
  dateLocale: typeof es;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'platzi-agenda-locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    if (typeof window === 'undefined') return 'es';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'es';
  });

  const setLocale = useCallback((l: AppLocale) => {
    setLocaleState(l);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'es';
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const t = useCallback(
    (key: string) => DICTS[locale][key] ?? key,
    [locale],
  );

  const dateLocale = locale === 'en' ? enUS : es;

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      dateLocale,
    }),
    [locale, setLocale, toggleLocale, t, dateLocale],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
