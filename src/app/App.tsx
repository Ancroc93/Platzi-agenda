import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router';
import { 
  Search, Home, MessageSquare, Map, 
  Trophy, Award, ChevronLeft, ChevronRight, 
  ChevronDown, Check, Calendar as CalendarIcon, List, SlidersHorizontal, Settings
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, 
  isToday, isSameDay, addDays, subDays, addWeeks, subWeeks,
  startOfYear, endOfYear, eachMonthOfInterval, addYears, subYears,
  startOfDay, isAfter
} from 'date-fns';
import { MOCK_EVENTS, PlatziEvent, EventCategory } from './data/events';
import { EventOverlay, cn } from './components/EventOverlay';

import { FilterOverlay } from './components/FilterOverlay';
import { FeaturedEvents } from './components/FeaturedEvents';
import { AppTopBar } from './components/AppTopBar';
import { I18nProvider, useI18n } from './context/I18nContext';

// --- Types & Constants ---
type ViewMode = 'day' | '3days' | 'month' | 'year';

const VIEW_OPTIONS_BASE: { id: ViewMode; shortcut: string }[] = [
  { id: 'day', shortcut: 'D' },
  { id: '3days', shortcut: '3' },
  { id: 'month', shortcut: 'M' },
  { id: 'year', shortcut: 'Y' },
];

const SCHOOLS_FROM_IMAGE: string[] = [
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
];

// Colores por categoría (clases Tailwind — para fondos de pills)
const CATEGORY_COLORS: Record<EventCategory, string> = {
  // Divulgación
  'Platzi Live':              'bg-[#F23A3A]',
  'Lanzamiento de cursos':    'bg-[#2D7AEB]',
  'Clases Platzi Master':     'bg-[#F5B402]',
  'Clases abiertas al público': 'bg-[#8E55EA]',
  'Platzi CONF Charla':       'bg-[#33B864]',
  // Promoción
  'Platzi Gratis':            'bg-[#00ED80]',
  'Descuentos y promociones': 'bg-[#E39422]',
  'Platzi CONF':              'bg-[#A855F7]',
};

// Colores hex por categoría (para inline styles dinámicos)
const CATEGORY_HEX: Record<EventCategory, string> = {
  'Platzi Live':              '#F23A3A',
  'Lanzamiento de cursos':    '#2D7AEB',
  'Clases Platzi Master':     '#F5B402',
  'Clases abiertas al público': '#8E55EA',
  'Platzi CONF Charla':       '#33B864',
  'Platzi Gratis':            '#00ED80',
  'Descuentos y promociones': '#E39422',
  'Platzi CONF':              '#A855F7',
};

/**
 * Devuelve los eventos que ocurren en un día dado.
 * Para eventos de día completo (isAllDay=true) se evalúa el rango de días
 * usando durationMinutes (1440 min = 1 día).
 */
const getEventsForDay = (day: Date, allEvents: PlatziEvent[]): PlatziEvent[] => {
  return allEvents.filter(event => {
    if (event.isAllDay) {
      const startDay = new Date(event.date);
      startDay.setHours(0, 0, 0, 0);
      const durationDays = Math.max(1, Math.ceil(event.durationMinutes / 1440));
      const endDay = new Date(startDay);
      endDay.setDate(endDay.getDate() + durationDays - 1);
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= startDay.getTime() && d.getTime() <= endDay.getTime();
    }
    return isSameDay(event.date, day);
  });
};

// --- Sidebar ---
const Sidebar = () => (
  <aside className="w-[80px] shrink-0 bg-[#13171B] border-r border-slate-800/50 hidden md:flex flex-col items-center h-screen sticky top-0 py-6">
    <div className="flex items-center justify-center mb-8">
      <img src="https://static.platzi.com/media/platzi-isotipo@2x.png" alt="Platzi Logo" className="w-8 h-8 object-contain platzi-logo-accent" />
    </div>
    <nav className="flex-1 flex flex-col gap-4 w-full px-3">
      {[
        { icon: Home, label: 'Inicio', active: false },
        { icon: CalendarIcon, label: 'Agenda', active: true },
        { icon: MessageSquare, label: 'Comentarios', active: false },
        { icon: Map, label: 'Mis Rutas', active: false },
        { icon: Trophy, label: 'Mi progreso', active: false },
        { icon: Award, label: 'Mis certificados', active: false },
      ].map((item, i) => (
        <a 
          key={i} 
          href="#" 
          title={item.label}
          className={cn(
            "flex items-center justify-center w-full aspect-square rounded-xl transition-colors group relative",
            item.active 
              ? "bg-[#1C2230] text-white" 
              : "text-[#898F9D] hover:text-white hover:bg-[#1C2230]/50"
          )}
        >
          <item.icon className="w-6 h-6" />
          
          {/* Tooltip on hover */}
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1C2230] text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-slate-800/50 shadow-xl z-50">
             {item.label}
          </div>
        </a>
      ))}
    </nav>
  </aside>
);

// --- Mobile Bottom Navigation ---
const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#13171B]/95 backdrop-blur border-t border-[#898F9D]">
    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
      {[
        { icon: Search, label: 'Buscar', active: false },
        { icon: Home, label: 'Inicio', active: false },
        { icon: CalendarIcon, label: 'Agenda', active: true },
        { icon: Trophy, label: 'Progreso', active: false },
        { icon: Settings, label: 'Ajustes', active: false },
      ].map((item) => (
        <a
          key={item.label}
          href="#"
          title={item.label}
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors",
            item.active ? "bg-[#1C2230] text-white" : "text-[#898F9D] hover:text-white hover:bg-[#1C2230]/60"
          )}
        >
          <item.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
    {/* Safe-area spacer */}
    <div className="h-[env(safe-area-inset-bottom)]" />
  </nav>
);

// --- Sub Views Components ---

const TimeGridView = ({ 
  days, events, onEventClick 
}: { 
  days: Date[], events: PlatziEvent[], onEventClick: (e: PlatziEvent) => void 
}) => {
  const { dateLocale } = useI18n();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to 8am on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 8 * 60;
    }
  }, [days.length]);

  // ¿Hay algún evento de día completo en los días visibles?
  const hasAllDayEvents = days.some(day =>
    events.some(e => e.isAllDay && getEventsForDay(day, events).some(ev => ev.id === e.id && ev.isAllDay))
  );

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-280px)] overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#13171B] border border-[#898F9D] rounded-2xl shadow-xl scroll-smooth"
    >
      {/* Cabecera sticky: días + franja "Todo el día" */}
      <div className="sticky top-0 z-20">
        {/* Fila de días */}
        <div className="flex bg-[#1F2229]/95 backdrop-blur border-b border-[#1D293D]">
          <div className="w-16 shrink-0 border-r border-[#1D293D] bg-[#1F2229]" />
          {days.map(day => (
            <div key={day.toISOString()} className="flex-1 text-center py-3 border-r border-[#1D293D]/50 min-w-[100px]">
              <div className="text-[11px] font-bold text-[#62748E] uppercase tracking-wider">{format(day, 'EEE', { locale: dateLocale })}</div>
              <div className={cn(
                "text-2xl font-light mt-1 w-10 h-10 mx-auto flex items-center justify-center rounded-full transition-colors", 
                isToday(day) ? "bg-[#00ED80] text-slate-900 shadow-md font-medium" : "text-[#90A1B9] hover:bg-[#1C2230]"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Franja "Todo el día" — solo visible si hay eventos de día completo */}
        {hasAllDayEvents && (
          <div className="flex bg-[#161B26]/95 backdrop-blur border-b border-[#1D293D]">
            <div className="w-16 shrink-0 border-r border-[#1D293D] flex items-center justify-center py-2 px-1">
              <span className="text-[8px] font-bold text-[#62748E] uppercase tracking-wider text-center leading-tight">
                Todo<br />el día
              </span>
            </div>
            {days.map(day => {
              const allDayForDay = getEventsForDay(day, events).filter(e => e.isAllDay);
              return (
                <div key={day.toISOString()} className="flex-1 border-r border-[#1D293D]/50 p-1 min-w-[100px] min-h-[28px] flex flex-col gap-0.5">
                  {allDayForDay.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white cursor-pointer truncate hover:brightness-110 transition-all",
                        CATEGORY_COLORS[event.category] || "bg-slate-700"
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Grid de horas — solo eventos con hora específica */}
      <div className="flex flex-1 relative">
        {/* Etiquetas de hora (eje Y) */}
        <div className="w-16 shrink-0 border-r border-[#1D293D] bg-[#1F2229] relative">
          {hours.map(hour => (
            <div key={hour} className="h-[60px] relative">
              <span className="absolute -top-2.5 right-3 text-[10px] text-[#62748E] font-medium">
                {hour === 0 ? '' : `${hour}:00`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Columnas de días */}
        {days.map(day => (
          <div key={day.toISOString()} className="flex-1 border-r border-[#1D293D]/50 relative min-w-[100px] bg-[#13171B]">
            {/* Líneas horizontales */}
            {hours.map(h => (
              <div key={h} className="h-[60px] border-b border-[#1D293D]/30" />
            ))}
            
            {/* Eventos con hora específica (excluir isAllDay) */}
            {getEventsForDay(day, events).filter(e => !e.isAllDay).map(event => {
              const top = event.date.getHours() * 60 + event.date.getMinutes();
              const height = Math.max(event.durationMinutes, 24);
              
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "absolute left-1 right-2 rounded-md p-1.5 overflow-hidden cursor-pointer transition-all hover:brightness-110 shadow-sm opacity-90 hover:opacity-100 hover:z-10 group",
                    CATEGORY_COLORS[event.category] || "bg-slate-700",
                    height <= 30 ? "flex items-center gap-2" : "flex flex-col gap-0.5"
                  )}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="font-semibold text-white text-[10px] sm:text-xs leading-tight truncate w-full drop-shadow-sm">
                    {event.title}
                  </div>
                  <div className="text-[9px] text-white/80 font-medium whitespace-nowrap">
                    {format(event.date, 'HH:mm')}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthView = ({ 
  currentDate, events, onEventClick 
}: { 
  currentDate: Date, events: PlatziEvent[], onEventClick: (e: PlatziEvent) => void 
}) => {
  const { dateLocale, t } = useI18n();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDayLabels = useMemo(() => {
    const monday = startOfWeek(new Date(2024, 0, 8), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: monday, end: addDays(monday, 6) }).map((d) =>
      format(d, 'EEE', { locale: dateLocale }),
    );
  }, [dateLocale]);

  return (
    <div className="bg-[#13171B] border border-[#898F9D] rounded-2xl overflow-hidden shadow-xl">
      <div className="grid grid-cols-7 border-b border-[#1D293D] bg-[#1F2229]">
        {weekDayLabels.map((day) => (
          <div key={day} className="py-3 text-center text-[10px] sm:text-[11px] font-bold text-[#62748E] uppercase tracking-[1px]">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)] bg-[#1D293D] gap-px">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDate = isToday(day);
          // Primero all-day (promoción), luego eventos con hora (divulgación)
          const dayEvents = getEventsForDay(day, events).sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            return a.date.getTime() - b.date.getTime();
          });

          // Separar all-day de timed para controlar espacio independientemente
          const allDayEvents = dayEvents.filter(e => e.isAllDay);
          const timedEvents = dayEvents.filter(e => !e.isAllDay);
          // Color del primer evento de día completo (para el foco visual de la celda)
          const firstAllDay = allDayEvents[0];
          const allDayAccent = firstAllDay && isCurrentMonth
            ? CATEGORY_HEX[firstAllDay.category]
            : null;

          return (
            <div 
              key={`cal-day-${day.toISOString()}-${idx}`} 
              className={cn(
                "min-h-[100px] p-1 sm:p-2 transition-colors group relative overflow-hidden",
                !isCurrentMonth ? "bg-[#151A25] opacity-60" : "bg-[#13171B]",
                isTodayDate && "ring-1 ring-[#00ED80] ring-inset"
              )}
            >
              {/* Foco de día completo: strip superior + tinte de fondo */}
              {allDayAccent && (
                <>
                  {/* Tinte de fondo sutil */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: allDayAccent, opacity: 0.07 }}
                  />
                  {/* Strip de acento en el top de la celda */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ backgroundColor: allDayAccent }}
                  />
                </>
              )}

              <div className="relative flex justify-center sm:justify-between items-start mb-1 sm:mb-2 pt-0.5">
                <span className={cn(
                  "text-xs sm:text-[13px] font-bold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors",
                  isTodayDate ? "bg-[#00ED80] text-slate-900 shadow-md" : "text-[#90A1B9] group-hover:text-white"
                )}>
                  {format(day, 'd')}
                </span>
                {/* Contador solo para eventos con hora (los all-day ya están indicados por el strip) */}
                {dayEvents.filter(e => !e.isAllDay).length > 0 && (
                  <span className="text-[9px] sm:text-[10px] text-[#898F9D] font-medium hidden sm:block uppercase tracking-wider mt-1">
                    {dayEvents.filter(e => !e.isAllDay).length}{' '}
                    {dayEvents.filter(e => !e.isAllDay).length === 1 ? t('evt') : t('evts')}
                  </span>
                )}
              </div>
              <div className="relative space-y-0.5">
                {/* Bandas finas de eventos de día completo (todas, son casi invisibles) */}
                {allDayEvents.map(event => (
                  <button
                    key={`${event.id}-${day.toISOString()}`}
                    onClick={() => onEventClick(event)}
                    title={event.title}
                    aria-label={event.title}
                    className="w-full focus:outline-none block"
                  >
                    <div
                      className={cn(
                        "w-full h-[4px] rounded-full opacity-75 hover:opacity-100 hover:scale-y-125 transition-all",
                        CATEGORY_COLORS[event.category] || "bg-slate-700"
                      )}
                    />
                  </button>
                ))}

                {/* Pills normales para eventos con hora (máx. 2 para dejar espacio) */}
                {timedEvents.slice(0, 2).map(event => (
                  <button
                    key={`${event.id}-${day.toISOString()}`}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left focus:outline-none"
                  >
                    <div className={cn(
                      "text-[9px] sm:text-[10px] px-1.5 py-1 flex items-center gap-1.5 rounded transition-all w-full overflow-hidden",
                      CATEGORY_COLORS[event.category] || "bg-slate-700",
                      "hover:brightness-110 hover:-translate-y-px hover:shadow-md"
                    )}>
                      {event.isLive && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_6px_white] shrink-0 hidden sm:block" />
                      )}
                      <span className="font-semibold text-white truncate w-full drop-shadow-sm leading-tight">
                        {event.title}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Overflow: mostrar solo el excedente de eventos con hora */}
                {timedEvents.length > 2 && (
                  <div className="text-[9px] font-medium text-[#898F9D] text-center pt-0.5 cursor-pointer hover:text-white transition-colors">
                    + {timedEvents.length - 2} {t('more')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const YearView = ({
  currentDate,
  events,
  setViewMode,
  setCurrentDate,
}: {
  currentDate: Date;
  events: PlatziEvent[];
  setViewMode: (v: ViewMode) => void;
  setCurrentDate: (d: Date) => void;
}) => {
  const { dateLocale } = useI18n();
  const months = eachMonthOfInterval({ 
    start: startOfYear(currentDate), 
    end: endOfYear(currentDate) 
  });

  const miniWeekLetters = useMemo(() => {
    const monday = startOfWeek(new Date(2024, 0, 8), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: monday, end: addDays(monday, 6) }).map((d) =>
      format(d, 'EEEEE', { locale: dateLocale }).replace('.', ''),
    );
  }, [dateLocale]);

  const MonthCard = ({ month }: { month: Date }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    });

    return (
      <div className="bg-[#13171B] p-4 rounded-2xl border border-[#898F9D] hover:border-[#1D293D] transition-colors">
        <button
          onClick={() => {
            setCurrentDate(month);
            setViewMode('month');
          }}
              className="text-white font-bold text-base mb-3 hover:text-[#00ED80] capitalize flex items-center justify-between w-full"
        >
          {format(month, 'MMMM', { locale: dateLocale })}
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {miniWeekLetters.map((d, i) => (
            <div key={`${d}-${i}`} className="text-[9px] font-bold text-[#62748E] uppercase">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, month);
            const dayEvts = getEventsForDay(day, events);
            const hasEvents = dayEvts.length > 0;
            const firstAllDay = dayEvts.find(e => e.isAllDay);
            const allDayAccent = firstAllDay && isCurrentMonth
              ? CATEGORY_HEX[firstAllDay.category]
              : null;

            return (
              <div
                key={`day-${day.toISOString()}-${idx}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-[10px] rounded-full relative overflow-hidden",
                  !isCurrentMonth
                    ? "text-slate-700"
                    : isToday(day)
                      ? "bg-[#00ED80] text-slate-900 font-bold"
                      : "text-[#90A1B9]",
                  hasEvents && isCurrentMonth && !isToday(day) && "font-bold text-white bg-[#1C2230]"
                )}
                style={allDayAccent && !isToday(day) ? {
                  boxShadow: `0 0 0 1.5px ${allDayAccent}`,
                } : undefined}
              >
                {/* Tinte sutil para días con evento de día completo */}
                {allDayAccent && !isToday(day) && (
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ backgroundColor: allDayAccent, opacity: 0.15 }}
                  />
                )}
                <span className="relative">{format(day, 'd')}</span>
                {hasEvents && isCurrentMonth && !isToday(day) && (
                  <div
                    className="absolute bottom-0.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: allDayAccent ?? '#00ED80' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile: carrusel horizontal finito (12 meses) */}
      <div className="sm:hidden pb-8">
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {months.map(month => (
            <div key={month.toISOString()} className="snap-start shrink-0 w-[280px]">
              <MonthCard month={month} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop/tablet: grilla */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8">
        {months.map(month => (
          <MonthCard key={month.toISOString()} month={month} />
        ))}
      </div>
    </>
  );
};

const AgendaView = ({ events, onEventClick }: { events: PlatziEvent[], onEventClick: (e: PlatziEvent) => void }) => {
  const { dateLocale, t } = useI18n();
  // Solo eventos desde hoy, ordenados por fecha (all-day primero por día)
  const upcomingEvents = [...events]
    .filter(e => isAfter(e.date, startOfDay(subDays(new Date(), 1))))
    .sort((a, b) => {
      const dayDiff = startOfDay(a.date).getTime() - startOfDay(b.date).getTime();
      if (dayDiff !== 0) return dayDiff;
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      return a.date.getTime() - b.date.getTime();
    });

  if (upcomingEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#898F9D] bg-[#13171B] rounded-2xl border border-[#898F9D]">
        <List className="w-12 h-12 mb-4 opacity-20" />
        <p>{t('noUpcomingEvents')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#13171B] border border-[#898F9D] rounded-2xl overflow-hidden shadow-xl">
      {upcomingEvents.map((event, index) => {
        const showDateHeader = index === 0 || !isSameDay(event.date, upcomingEvents[index - 1].date);
        
        return (
          <React.Fragment key={event.id}>
            {showDateHeader && (
              <div className="bg-[#1F2229] px-6 py-3 border-y border-[#1D293D] flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#1C2230] flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[10px] font-bold text-[#62748E] leading-none">{format(event.date, 'EEE', { locale: dateLocale }).toUpperCase()}</span>
                    <span className="text-sm font-bold leading-none mt-0.5">{format(event.date, 'd')}</span>
                 </div>
                 <h3 className="text-sm font-semibold text-[#898F9D] capitalize">
                   {format(event.date, "MMMM yyyy", { locale: dateLocale })}
                 </h3>
              </div>
            )}
            <div 
              onClick={() => onEventClick(event)}
              className="px-6 py-4 flex flex-col sm:flex-row gap-4 hover:bg-[#1C2230] transition-colors cursor-pointer border-l-[3px] border-transparent hover:border-[#00ED80]"
            >
              <div className="w-24 shrink-0 text-[#898F9D] text-sm font-medium flex items-center gap-2">
                 {event.isAllDay ? (
                   <span className="text-xs font-bold uppercase tracking-wider text-[#898F9D]">Todo el día</span>
                 ) : (
                   <>
                     {format(event.date, 'HH:mm')}
                     {event.isLive && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                   </>
                 )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("w-2 h-2 rounded-full", CATEGORY_COLORS[event.category] || "bg-slate-500")} />
                  <span className="text-xs font-semibold text-[#898F9D] uppercase tracking-wider">{event.category}</span>
                </div>
                <h4 className="text-white font-bold text-base">{event.title}</h4>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  );
};


// --- Main Application ---
const Root = () => {
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    // Only hide on mobile (arbitrary breakpoint < 768px)
    if (window.innerWidth < 768) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 72) {
        // Scrolling down & past the topbar height
        setIsTopBarHidden(true);
      } else {
        // Scrolling up
        setIsTopBarHidden(false);
      }
    }
    lastScrollY.current = currentScrollY;
  };

  return (
    <I18nProvider>
      <div className="flex h-screen bg-[#13171B] text-[#898F9D] font-sans overflow-hidden selection:bg-[#00ED80]/30 selection:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AppTopBar isHidden={isTopBarHidden} />
          <main 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pb-24 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
    </I18nProvider>
  );
};

const Agenda = () => {
  const { t, dateLocale, locale } = useI18n();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<PlatziEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Filters state
  const [filterCategories, setFilterCategories] = useState<EventCategory[]>([]);
  const [filterPago, setFilterPago] = useState<boolean | null>(null);
  const [filterSchools, setFilterSchools] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const normalizeSchool = (school: string) =>
    school.replace(/^Escuela de\s+/i, '').trim();

  // Available Schools for filter
  const availableSchools = useMemo(() => {
    const schools = new Set<string>();

    SCHOOLS_FROM_IMAGE.forEach(s => schools.add(s));

    MOCK_EVENTS.forEach(e => {
      if (e.school) schools.add(normalizeSchool(e.school));
    });

    const ordered: string[] = [];
    SCHOOLS_FROM_IMAGE.forEach(s => {
      if (schools.has(s)) ordered.push(s);
    });
    Array.from(schools).forEach(s => {
      if (!ordered.includes(s)) ordered.push(s);
    });

    return ordered;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile && viewMode === 'year') setViewMode('month');
  }, [isMobile, viewMode]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      if (filterCategories.length > 0 && !filterCategories.includes(event.category)) return false;
      if (filterPago !== null) {
        if (filterPago && event.isFree) return false;
        if (!filterPago && !event.isFree) return false;
      }
      if (filterSchools.length > 0) {
        const eventSchool = event.school ? normalizeSchool(event.school) : null;
        if (!eventSchool || !filterSchools.includes(eventSchool)) return false;
      }
      return true;
    });
  }, [filterCategories, filterPago, filterSchools]);

  const viewOptionsForDevice = useMemo(() => {
    const base = isMobile
      ? VIEW_OPTIONS_BASE.filter((o) => o.id !== 'year')
      : VIEW_OPTIONS_BASE;
    return base.map((o) => ({
      ...o,
      label:
        o.id === 'day'
          ? t('viewDay')
          : o.id === '3days'
            ? t('view3days')
            : o.id === 'month'
              ? t('viewMonth')
              : t('viewYear'),
    }));
  }, [isMobile, t]);

  // Navigation Logic based on ViewMode
  const handleNext = () => {
    switch (viewMode) {
      case 'day': setCurrentDate(addDays(currentDate, 1)); break;
      case '3days': setCurrentDate(addDays(currentDate, 3)); break;
      case 'month': setCurrentDate(addMonths(currentDate, 1)); break;
      case 'year': setCurrentDate(addYears(currentDate, 1)); break;
    }
  };

  const handlePrev = () => {
    switch (viewMode) {
      case 'day': setCurrentDate(subDays(currentDate, 1)); break;
      case '3days': setCurrentDate(subDays(currentDate, 3)); break;
      case 'month': setCurrentDate(subMonths(currentDate, 1)); break;
      case 'year': setCurrentDate(subYears(currentDate, 1)); break;
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  // Dynamic header text based on view
  const getHeaderText = () => {
    if (viewMode === 'year') return format(currentDate, 'yyyy');
    if (viewMode === 'day') {
      if (locale === 'en') {
        return format(currentDate, 'MMMM d, yyyy', { locale: dateLocale });
      }
      return format(currentDate, "d 'de' MMMM, yyyy", { locale: dateLocale });
    }
    if (viewMode === '3days') {
      const start = currentDate;
      const end = addDays(currentDate, 2);
      if (locale === 'en') {
        if (isSameMonth(start, end)) {
          return `${format(start, 'MMM d', { locale: dateLocale })}–${format(end, 'd, yyyy', { locale: dateLocale })}`;
        }
        return `${format(start, 'MMM d', { locale: dateLocale })} – ${format(end, 'MMM d, yyyy', { locale: dateLocale })}`;
      }
      if (isSameMonth(start, end)) {
        return `${format(start, 'd')} - ${format(end, 'd')} de ${format(start, 'MMMM, yyyy', { locale: dateLocale })}`;
      }
      return `${format(start, "d 'de' MMM", { locale: dateLocale })} - ${format(end, "d 'de' MMM, yyyy", { locale: dateLocale })}`;
    }
    return format(currentDate, 'MMMM yyyy', { locale: dateLocale });
  };

  // Render content based on view
  const renderViewContent = () => {
    switch (viewMode) {
      case 'day':
        return <TimeGridView days={[currentDate]} events={filteredEvents} onEventClick={setSelectedEvent} />;
      case '3days':
        return <TimeGridView days={Array.from({length: 3}, (_, i) => addDays(currentDate, i))} events={filteredEvents} onEventClick={setSelectedEvent} />;
      case 'month':
        return <MonthView currentDate={currentDate} events={filteredEvents} onEventClick={setSelectedEvent} />;
      case 'year':
        return <YearView currentDate={currentDate} events={filteredEvents} setViewMode={setViewMode} setCurrentDate={setCurrentDate} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto min-h-full">
      {/* Header & Controls */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Featured Events Section */}
        <FeaturedEvents onEventClick={setSelectedEvent} />

        <div className="mt-2">
          <h1 className="text-3xl sm:text-[32px] font-bold text-white mb-0 tracking-tight">{t('agendaTitle')}</h1>
        </div>

        {/* Calendar Controls (desktop layout like reference) */}
        <div className="flex items-center justify-between mt-0">
          <div className="flex items-center gap-3">
            {/* View Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                className="flex items-center gap-4 bg-[#13171B] border border-[#898F9D] rounded-xl px-0 py-3 text-sm font-semibold text-white hover:bg-[#1C2230] transition-colors w-full min-w-[100px] justify-center"
              >
                {viewOptionsForDevice.find(o => o.id === viewMode)?.label ?? 'Mes'}
                <ChevronDown className={cn("w-4 h-4 text-[#898F9D] transition-transform duration-200", isViewMenuOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isViewMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsViewMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 w-48 bg-[#1C2230] border border-slate-700 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden"
                    >
                      {viewOptionsForDevice.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => { setViewMode(option.id); setIsViewMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#2A3441] flex items-center justify-between group transition-colors"
                        >
                          <span className={cn(
                            "font-medium",
                            viewMode === option.id ? "text-white" : "text-[#898F9D] group-hover:text-white"
                          )}>
                            {option.label}
                          </span>
                          <div className="flex items-center text-[#898F9D]">
                            {viewMode === option.id ? <Check className="w-4 h-4 text-[#00ED80]" /> : <div className="w-4 h-4" />}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center bg-[#13171B] rounded-xl border border-[#898F9D] p-0">
              <button onClick={handlePrev} className="px-3 py-3 hover:bg-[#1C2230] rounded-lg transition-colors text-[#898F9D] hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <button 
                onClick={handleToday}
                className="px-4 py-3 bg-[#13171B] hover:bg-[#1C2230] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {t('today')}
              </button>
              <button onClick={handleNext} className="px-3 py-3 hover:bg-[#1C2230] rounded-lg transition-colors text-[#898F9D] hover:text-white"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <button 
            onClick={() => setIsFilterOpen(true)}
            className="relative p-3 text-[#898F9D] hover:text-white hover:bg-[#1C2230] rounded-xl transition-colors"
            aria-label={t('filters')}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {(filterCategories.length + (filterPago !== null ? 1 : 0) + filterSchools.length) > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00ED80] text-slate-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {filterCategories.length + (filterPago !== null ? 1 : 0) + filterSchools.length}
              </span>
            )}
          </button>
        </div>

        <h2 className="text-2xl sm:text-[16px] font-bold text-white capitalize tracking-tight mt-6">
          {getHeaderText()}
        </h2>
      </div>

      {/* Main Content Area */}
      {renderViewContent()}

      {/* Overlays */}
      <AnimatePresence>
        {selectedEvent && (
          <EventOverlay 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>

      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterCategories={filterCategories}
        setFilterCategories={setFilterCategories}
        filterPago={filterPago}
        setFilterPago={setFilterPago}
        filterSchools={filterSchools}
        setFilterSchools={setFilterSchools}
        availableSchools={availableSchools}
      />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Agenda },
      { path: "*", Component: () => <div className="p-8 text-white">404 No encontrado</div> },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});

export default function App() {
  return <RouterProvider router={router} />;
}
