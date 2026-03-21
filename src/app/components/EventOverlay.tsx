import { motion, AnimatePresence, useDragControls } from 'motion/react';
import {
  X, Clock, CalendarDays,
  Code2, Globe, Megaphone, Brain, Shield, Users, PenLine,
  Smartphone, Video, DollarSign, Cloud, Terminal, Palette,
  Boxes, UserPlus, Rocket, Briefcase, BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlatziEvent } from '../data/events';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useI18n } from '../context/I18nContext';

// ─── School icon map ─────────────────────────────────────────────────────────
const SCHOOL_ICONS: Record<string, LucideIcon> = {
  'Desarrollo Web':                        Code2,
  'English Academy':                       Globe,
  'Marketing Digital':                     Megaphone,
  'Inteligencia Artificial y Data Science': Brain,
  'Ciberseguridad':                        Shield,
  'Liderazgo y Habilidades Blandas':       Users,
  'Diseño de Producto y UX':               PenLine,
  'Desarrollo Móvil':                      Smartphone,
  'Contenido Audiovisual':                 Video,
  'Finanzas e Inversiones':                DollarSign,
  'Cloud Computing y DevOps':              Cloud,
  'Programación':                          Terminal,
  'Diseño Gráfico y Arte Digital':         Palette,
  'Blockchain y Web3':                     Boxes,
  'Recursos Humanos':                      UserPlus,
  'Startups':                              Rocket,
  'Negocios':                              Briefcase,
};

const normalizeSchoolName = (school: string) =>
  school.replace(/^Escuela de\s+/i, '').trim();

const SchoolCard = ({ school }: { school: string }) => {
  const name = normalizeSchoolName(school);
  const Icon = SCHOOL_ICONS[name] ?? BookOpen;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#11171B] border border-[#314158]/50">
      <div className="w-10 h-10 rounded-[10px] bg-[#0D0F12] border border-[#314158]/50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#00ED80]" />
      </div>
      <p className="text-[#F1F5F9] font-bold text-sm leading-snug">{name}</p>
    </div>
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EventOverlayProps {
  event: PlatziEvent;
  onClose: () => void;
}

export const EventOverlay = ({ event, onClose }: EventOverlayProps) => {
  const dragControls = useDragControls();

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
          /* ── Swipe-to-dismiss ── */
          drag="y"
          dragControls={dragControls}
          dragListener={false}          /* solo el grabber inicia el drag */
          dragConstraints={{ top: 0 }}  /* no permite arrastrar hacia arriba */
          dragElastic={{ top: 0, bottom: 0.3 }}
          dragSnapToOrigin             /* snap-back automático si no supera el umbral */
          onDragEnd={(_, info) => {
            if (info.velocity.y > 300 || info.offset.y > 100) onClose();
          }}
          /* ── Animación entrada/salida ── */
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#13171B] rounded-t-3xl overflow-hidden z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-[#898F9D]"
        >
          {/* Grabber — área táctil que inicia el gesto de cierre */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: 'none' }}
            className="absolute top-0 left-0 right-0 h-10 flex justify-center items-center z-20 cursor-grab active:cursor-grabbing select-none"
          >
            <div className="w-12 h-1.5 bg-white/25 rounded-full transition-colors group-active:bg-white/50" />
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
        <h2 className="text-2xl font-bold mb-4 leading-snug mt-6">
          {event.title}
        </h2>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#898F9D] mt-2 border-b border-[#1D293D] pb-5">
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
        <div className="mt-5 flex flex-col gap-3">
          {event.description.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-base text-[#898F9D] leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-8 space-y-4">
          {event.school && (
            <div>
              <h4 className="text-[10px] font-bold text-[#898F9D] mb-3 uppercase tracking-wider">Escuela</h4>
              <SchoolCard school={event.school} />
            </div>
          )}

          {event.instructor && (
            <div className="p-4 rounded-xl bg-[#1C2230]/60 border border-[#1D293D] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C2230] border border-[#1D293D] overflow-hidden flex-shrink-0 flex items-center justify-center">
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
      <div className="p-6 border-t border-[#1D293D] bg-[#0D0F12] w-full mt-auto shrink-0 z-20">
        <button className="w-full bg-[#00ED80] hover:bg-[#00ED80]/90 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-transform active:scale-[0.98]">
          {event.isCourse ? (
            <>Empezar Curso</>
          ) : event.isLive ? (
            <>Regístrate gratis</>
          ) : event.eventType === 'promocion' ? (
            <>Aprovechar Promoción</>
          ) : (
            <>Ver Detalles Completos</>
          )}
        </button>
      </div>
    </div>
  );
};
