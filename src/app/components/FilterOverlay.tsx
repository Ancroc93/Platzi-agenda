import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, Check } from 'lucide-react';
import { cn } from './EventOverlay';
import { EventCategory } from '../data/events';

// ─────────────────────────────────────────────────────────────────────────────
// Categorías agrupadas por tipo (según PRD)
// ─────────────────────────────────────────────────────────────────────────────

const DIVULGACION_CATEGORIES: EventCategory[] = [
  'Platzi Live',
  'Lanzamiento de cursos',
  'Clases Platzi Master',
  'Clases abiertas al público',
  'Platzi CONF Charla',
];

const PROMOCION_CATEGORIES: EventCategory[] = [
  'Platzi Gratis',
  'Descuentos y promociones',
  'Platzi CONF',
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterCategories: EventCategory[];
  setFilterCategories: (cats: EventCategory[]) => void;
  filterPago: boolean | null;
  setFilterPago: (val: boolean | null) => void;
  filterSchools: string[];
  setFilterSchools: (schools: string[]) => void;
  availableSchools: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const FilterOverlay = ({
  isOpen,
  onClose,
  filterCategories,
  setFilterCategories,
  filterPago,
  setFilterPago,
  filterSchools,
  setFilterSchools,
  availableSchools,
}: FilterOverlayProps) => {
  // Los hooks deben ir siempre antes de cualquier early return
  const dragControls = useDragControls();

  if (!isOpen) return null;

  const toggleCategory = (cat: EventCategory) => {
    if (filterCategories.includes(cat)) {
      setFilterCategories(filterCategories.filter(c => c !== cat));
    } else {
      setFilterCategories([...filterCategories, cat]);
    }
  };

  const toggleSchool = (school: string) => {
    if (filterSchools.includes(school)) {
      setFilterSchools(filterSchools.filter(s => s !== school));
    } else {
      setFilterSchools([...filterSchools, school]);
    }
  };

  const clearAll = () => {
    setFilterCategories([]);
    setFilterPago(null);
    setFilterSchools([]);
  };

  const activeFiltersCount =
    filterCategories.length +
    (filterPago !== null ? 1 : 0) +
    filterSchools.length;

  const CategoryCheckbox = ({ cat }: { cat: EventCategory }) => {
    const isSelected = filterCategories.includes(cat);
    return (
      <button
        type="button"
        onClick={() => toggleCategory(cat)}
        className="flex items-center gap-3 cursor-pointer group w-full text-left"
      >
        <div
          className={cn(
            'w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0',
            isSelected
              ? 'bg-[#00ED80] border-[#00ED80]'
              : 'border-[#898F9D] bg-[#1C2230] group-hover:border-white',
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
        </div>
        <span className="text-[#898F9D] font-medium group-hover:text-white transition-colors">{cat}</span>
      </button>
    );
  };

  const OverlayContent = (
    <div className="relative flex flex-col h-full bg-[#13171B] text-white overflow-hidden">
      {/* Botón cerrar (desktop, patrón unificado de modales) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-[#13171B]/60 hover:bg-[#13171B]/80 rounded-full transition-colors backdrop-blur-sm z-10 hidden lg:block"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#1D293D] shrink-0">
        <div>
          <h2 className="text-xl font-bold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <span className="text-xs text-[#00ED80] font-medium">{activeFiltersCount} aplicados</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-[#1C2230]/70 hover:bg-[#1C2230] rounded-full transition-colors lg:hidden"
        >
          <X className="w-5 h-5 text-[#898F9D]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-6 space-y-8">

        {/* Categorías */}
        <section>
          <h3 className="text-[10px] font-bold text-[#898F9D] uppercase tracking-wider mb-4">Categorías</h3>
          <div className="space-y-3">
            {DIVULGACION_CATEGORIES.map(cat => (
              <CategoryCheckbox key={cat} cat={cat} />
            ))}
          </div>
        </section>

        {/* Escuelas */}
        {availableSchools.length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold text-[#898F9D] uppercase tracking-wider mb-4">Escuelas</h3>
            <div className="space-y-3 pb-8">
              {availableSchools.map(school => {
                const isSelected = filterSchools.includes(school);
                return (
                  <button
                    key={school}
                    type="button"
                    onClick={() => toggleSchool(school)}
                    className="flex items-center gap-3 cursor-pointer group w-full text-left"
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded flex items-center justify-center border transition-colors',
                        isSelected
                          ? 'bg-[#00ED80] border-[#00ED80]'
                          : 'border-[#898F9D] bg-[#1C2230] group-hover:border-white',
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <span className="text-[#898F9D] font-medium group-hover:text-white transition-colors">{school}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#1D293D] bg-[#0D0F12] shrink-0 flex gap-4">
        <button
          onClick={clearAll}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-[#898F9D] hover:text-white bg-[#1C2230]/60 hover:bg-[#1C2230] transition-colors"
        >
          Limpiar
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-900 bg-[#00ED80] hover:bg-[#00ED80]/90 transition-colors"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
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
              dragListener={false}
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.velocity.y > 300 || info.offset.y > 100) onClose();
              }}
              /* ── Animación entrada/salida ── */
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#13171B] rounded-t-3xl overflow-hidden z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-[#898F9D]"
            >
              {/* Grabber — área táctil que inicia el gesto de cierre */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                style={{ touchAction: 'none' }}
                className="absolute top-0 left-0 right-0 h-10 flex justify-center items-center z-20 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="w-12 h-1.5 bg-white/25 rounded-full" />
              </div>
              {OverlayContent}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-[400px] bg-[#13171B] shadow-2xl z-50 flex flex-col border-l border-[#898F9D]"
            >
              {OverlayContent}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
