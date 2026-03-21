import { MOCK_EVENTS, PlatziEvent } from '../data/events';
import { cn } from './EventOverlay';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useI18n } from '../context/I18nContext';

export const FeaturedEvents = ({ onEventClick }: { onEventClick: (e: PlatziEvent) => void }) => {
  const { t, dateLocale } = useI18n();
  // Próximos eventos en vivo + Clases Platzi Master + Clases abiertas al público
  const featured = useMemo(() => {
    const now = new Date();
    return MOCK_EVENTS
      .filter(e =>
        (e.isLive && e.date >= now) ||
        e.category === 'Clases Platzi Master' ||
        e.category === 'Clases abiertas al público',
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, []);
  const [ctaAddedByEventId, setCtaAddedByEventId] = useState<Record<string, boolean>>({});
  const trackRef = useRef<HTMLDivElement>(null);

  if (featured.length === 0) return null;

  const scrollByCards = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const scrollAmount = Math.max(320, Math.round(el.clientWidth * 0.9));
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="mb-8 group">
      <p className="text-[32px] font-bold text-white leading-[1.2] mb-2 tracking-tight">{t('featuredTitle')}</p>
      <p className="text-[#898F9D] text-sm mb-6 max-w-3xl leading-relaxed">
        {t('featuredSubtitle')}
      </p>

      {/* Carrusel horizontal (móvil + web) */}
      <div className="relative">
        {/* Mobile: opacidad lateral para sugerir scroll */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-14 md:w-16 bg-gradient-to-r from-[#13171B] via-[#13171B]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-14 md:w-16 bg-gradient-to-l from-[#13171B] via-[#13171B]/80 to-transparent z-10" />

        {/* Desktop: flechas sutiles que aparecen al interactuar */}
        <button
          type="button"
          onClick={() => scrollByCards('left')}
          aria-label={t('carouselPrev')}
          className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-[#13171B]/10 text-white/60 hover:text-white hover:bg-[#13171B]/35 transition-all backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards('right')}
          aria-label={t('carouselNext')}
          className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-[#13171B]/10 text-white/60 hover:text-white hover:bg-[#13171B]/35 transition-all backdrop-blur-sm pointer-events-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={trackRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar scroll-smooth"
        >
        {featured.map((event) => {
          const isPlatziLive = event.category === 'Platzi Live';
          const isLiveNow = event.isLive && event.date <= new Date();
          
          return (
            <div 
              key={event.id}
              onClick={() => onEventClick(event)}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] md:w-[360px] h-[240px] rounded-2xl p-5 flex flex-col justify-between cursor-pointer border border-[#1D293D] hover:border-[#898F9D]/50 transition-all relative overflow-hidden group shadow-lg"
            >
              {/* Background Gradient Effect matching the image */}
              <div className={cn(
                "absolute inset-0 opacity-90 z-0",
                isPlatziLive 
                  ? "bg-gradient-to-br from-[#12241C] via-[#101E17] to-[#12161E]" 
                  : "bg-gradient-to-br from-[#1E1128] via-[#151121] to-[#11121B]"
              )}>
                {/* Decorative blob */}
                <div className={cn(
                  "absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[60px] opacity-40",
                  isPlatziLive ? "bg-[#00ED80]" : "bg-[#B265E6]"
                )} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  {isLiveNow ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EF4444] text-white rounded-full text-[11px] font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {t('live')}
                    </div>
                  ) : (
                    <div className="text-white font-semibold text-sm">
                      {format(event.date, 'MMMM · dd / HH:mm', { locale: dateLocale })}
                    </div>
                  )}
                  <div className="text-[#898F9D] text-xs font-medium">
                    {(() => {
                      const h = Math.floor(event.durationMinutes / 60);
                      const m = event.durationMinutes % 60;
                      if (event.durationMinutes < 60) {
                        return `${event.durationMinutes} ${t('mins')}`;
                      }
                      const hp = h === 1 ? t('hour') : t('hours');
                      if (m > 0) return `${h} ${hp} ${m} ${t('mins')}`;
                      return `${h} ${hp}`;
                    })()}
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-base leading-snug transition-colors line-clamp-2">
                  {event.title} {isPlatziLive && <span className="inline-block">🔥</span>}
                </h3>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  {isPlatziLive ? (
                    <>
                      <div className="w-9 h-9 rounded-full bg-[#1A2534] border-2 border-indigo-900/50 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(123,232,142,0.15)]">
                        <img src="https://static.platzi.com/media/platzi-isotipo@2x.png" alt="Platzi" className="w-full h-full object-contain platzi-logo-accent" />
                      </div>
                      <p className="text-white text-sm font-semibold">Team Platzi</p>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-slate-700 shrink-0 overflow-hidden border-2 border-slate-600">
                        {/* Mock avatar */}
                        <img src={`https://i.pravatar.cc/150?u=${event.id}`} alt={event.instructor || "Instructor"} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-white text-sm font-semibold truncate">{event.instructor}</p>
                         <p className="text-[#898F9D] text-[10px] font-bold uppercase tracking-wider truncate">{event.instructorRole}</p>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCtaAddedByEventId((prev) => ({ ...prev, [event.id]: true }));
                  }}
                  className={cn(
                    "w-full py-2.5 px-3 font-bold text-sm rounded-xl transition-colors shadow-sm",
                    ctaAddedByEventId[event.id]
                      ? "bg-[#4B5563] text-white flex items-center justify-between"
                      : "bg-white hover:bg-slate-200 text-black"
                  )}
                >
                  {ctaAddedByEventId[event.id] ? (
                    <>
                      <span>Agregar</span>
                      <CalendarDays className="w-4 h-4 shrink-0" />
                    </>
                  ) : (
                    'Regístrate gratis'
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};
