import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, PlayCircle, Star, CalendarDays, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlatziEvent } from '../data/events';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useI18n } from '../context/I18nContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EventOverlayProps {
  event: PlatziEvent;
  onClose: () => void;
}

export const EventOverlay = ({ event, onClose }: EventOverlayProps) => {
  return (
    <>
      {/* Mobile Backdrop & Bottom Sheet */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#13171B]/80 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#13171B] rounded-t-3xl overflow-hidden z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-[#898F9D]"
        >
          {/* Grabber for bottom sheet affordance */}
          <div className="absolute top-0 left-0 right-0 h-6 flex justify-center items-center z-20 cursor-pointer" onClick={onClose}>
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>
          <OverlayContent event={event} onClose={onClose} />
        </motion.div>
      </div>

      {/* Desktop Backdrop & Side Sheet */}
      <div className="hidden lg:block">
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#13171B]/60 backdrop-blur-[2px] z-40"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 bottom-0 right-0 w-[440px] bg-[#13171B] shadow-2xl z-50 flex flex-col border-l border-[#898F9D]"
        >
          <OverlayContent event={event} onClose={onClose} />
        </motion.div>
      </div>
    </>
  );
};

const OverlayContent = ({ event, onClose }: { event: PlatziEvent, onClose: () => void }) => {
  const { dateLocale } = useI18n();

  // Categorías que usan el fondo de Platzi Live
  const usesPlatziLiveBg =
    event.category === 'Platzi Live' ||
    event.category === 'Platzi CONF' ||
    event.category === 'Platzi CONF Charla';

  return (
    <div className="flex flex-col h-full bg-[#13171B] text-white overflow-hidden">
      {/* Header: imagen o gradiente */}
      <div className="relative w-full h-48 sm:h-56 bg-[#13171B] shrink-0">
        {event.imageUrl ? (
          <>
            <ImageWithFallback
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13171B] to-transparent pointer-events-none" />
          </>
        ) : usesPlatziLiveBg ? (
          <>
            <img
              src="/platzi-live-bg.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13171B] via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#13171B] to-[#0B0F19] flex items-center justify-center p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#13171B] to-transparent pointer-events-none" />
          </div>
        )}

        {/* Badge de tipo */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
            event.eventType === 'promocion' ? 'bg-[#A855F7]/80' : 'bg-[#1C2230]/80'
          } backdrop-blur-sm`}>
            {event.eventType === 'promocion' ? 'Promoción' : 'Divulgación'}
          </span>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#13171B]/60 hover:bg-[#13171B]/80 rounded-full transition-colors backdrop-blur-sm z-10 hidden lg:block"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-6 pb-6 relative -mt-6 sm:-mt-8 z-10">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight mt-6">
          {event.title}
        </h2>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#898F9D] mt-2 border-b border-[#898F9D] pb-5">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#00ED80]" />
            <span className="capitalize">
              {format(event.date, "EEEE, d 'de' MMMM", { locale: dateLocale })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00ED80]" />
            {event.isAllDay ? (
              <span className="font-semibold text-white">Todo el día</span>
            ) : (
              <span>{format(event.date, 'HH:mm')} ({event.durationMinutes} min)</span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-5">
          <p className="text-base text-[#898F9D] leading-relaxed">{event.description}</p>
        </div>

        {/* Info adicional */}
        <div className="mt-8 space-y-4">
          {event.school && (
            <div className="p-4 rounded-xl bg-[#1C2230]/60 border border-[#898F9D]">
              <h4 className="text-xs font-semibold text-[#898F9D] mb-1.5 uppercase tracking-wider">Escuela</h4>
              <p className="text-white font-medium flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#33B864]" />
                {event.school}
              </p>
            </div>
          )}

          {event.instructor && (
            <div className="p-4 rounded-xl bg-[#1C2230]/60 border border-[#898F9D] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C2230] border border-[#898F9D] overflow-hidden flex-shrink-0 flex items-center justify-center">
                <span className="text-lg text-[#898F9D] font-bold">{event.instructor.charAt(0)}</span>
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">{event.instructor}</h4>
                <p className="text-xs text-[#898F9D] mt-0.5">{event.instructorRole}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 border-t border-[#898F9D] bg-[#0D0F12] w-full mt-auto shrink-0 z-20">
        <button className="w-full bg-[#00ED80] hover:bg-[#00ED80]/90 text-slate-900 font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
          {event.isCourse ? (
            <><PlayCircle className="w-5 h-5" /> Empezar Curso</>
          ) : event.isLive ? (
            <><CalendarDays className="w-5 h-5" /> Agendar Recordatorio</>
          ) : event.eventType === 'promocion' ? (
            <><Star className="w-5 h-5" /> Aprovechar Promoción</>
          ) : (
            <><ExternalLink className="w-5 h-5" /> Ver Detalles Completos</>
          )}
        </button>
      </div>
    </div>
  );
};
