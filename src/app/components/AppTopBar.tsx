import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { cn } from './EventOverlay';
import { useI18n } from '../context/I18nContext';

function RocketIllustration({ className }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}rocket-green-v2.png`}
      alt=""
      aria-hidden
      className={className}
    />
  );
}

function TranslateIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M7 6.75h7M10.5 5v3.5M8 10.5c.7 1.2 1.6 2.2 2.8 3M15.8 19l-2.2-5.5L11.3 19M12.2 16.8h2.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.2" opacity=".15" />
    </svg>
  );
}

const PLATZI_GREEN = '#00ED80';
const HEADER_BG = 'rgba(19, 23, 27, 1)';
const HEADER_BORDER = '#898F9D';
const SEARCH_BG = '#0D0F12';
const DEMO_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';

type LanguageMenuProps = {
  locale: 'es' | 'en';
  t: (key: string) => string;
  setLocale: (locale: 'es' | 'en') => void;
};

function LanguageMenu({ locale, t, setLocale }: LanguageMenuProps) {
  return (
    <>
      <button
        type="button"
        className="p-1 text-[#898F9D] hover:text-white transition-colors"
        aria-label={t('translateAria')}
      >
        <TranslateIcon className="w-7 h-7" />
      </button>
      <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[#898F9D] bg-[#1C2230] shadow-xl py-1 z-50">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#898F9D]">
          {t('language')}
        </div>
        <button
          type="button"
          className={cn(
            'w-full text-left px-3 py-2 text-sm hover:bg-[#1C2230] rounded-lg transition-colors',
            locale === 'es' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
          )}
          onClick={() => setLocale('es')}
        >
          {t('spanish')}
        </button>
        <button
          type="button"
          className={cn(
            'w-full text-left px-3 py-2 text-sm hover:bg-[#1C2230] rounded-lg transition-colors',
            locale === 'en' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
          )}
          onClick={() => setLocale('en')}
        >
          {t('english')}
        </button>
      </div>
    </>
  );
}

export function AppTopBar({ isHidden }: { isHidden?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header
      className={cn(
        'absolute top-0 inset-x-0 md:relative z-30 transition-transform duration-300',
        isHidden ? '-translate-y-full' : 'translate-y-0',
      )}
      style={{ backgroundColor: HEADER_BG, borderColor: HEADER_BORDER }}
    >
      <div className="hidden md:flex h-[72px] items-center gap-5 px-6">
        <div className="flex-1 min-w-0">
          <div className="relative w-full max-w-[620px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#898F9D] pointer-events-none" />
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="w-full h-11 border rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-[#898F9D] focus:outline-none focus:border-[#00ED80] focus:ring-1 focus:ring-[#00ED80]/30 transition-shadow"
              style={{ backgroundColor: SEARCH_BG, borderColor: HEADER_BORDER }}
            />
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 text-white">
          <div className="flex items-center gap-1.5">
            <RocketIllustration className="w-7 h-7 shrink-0" />
            <span className="text-sm font-semibold tabular-nums">10</span>
          </div>

          <span className="text-base font-medium text-slate-100">{t('plans')}</span>

          <button type="button" className="flex items-center gap-2" aria-label="Perfil">
            <img
              src={DEMO_AVATAR}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-[#3B4658] grayscale contrast-[0.95]"
            />
            <span className="text-sm font-bold tabular-nums text-white">
              303 <span className="font-semibold text-[#898F9D]">{t('points')}</span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#898F9D]" />
          </button>

          <div className="h-7 w-px bg-[#898F9D] shrink-0" />

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="p-1 text-[#898F9D] hover:text-white transition-colors"
              aria-label={t('translateAria')}
              aria-expanded={langOpen}
            >
              <TranslateIcon className="w-7 h-7" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[#898F9D] bg-[#1C2230] shadow-xl py-1 z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#898F9D]">
                  {t('language')}
                </div>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[#1C2230]',
                    locale === 'es' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
                  )}
                  onClick={() => {
                    setLocale('es');
                    setLangOpen(false);
                  }}
                >
                  {t('spanish')}
                </button>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[#1C2230]',
                    locale === 'en' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
                  )}
                  onClick={() => {
                    setLocale('en');
                    setLangOpen(false);
                  }}
                >
                  {t('english')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex md:hidden h-16 items-center justify-between px-4">
        <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 min-w-0" aria-label="Platzi">
          <img
            src="https://static.platzi.com/media/platzi-isotipo@2x.png"
            alt=""
            className="w-8 h-8 object-contain shrink-0 platzi-logo-accent"
          />
          <span
            className="text-[32px] leading-none font-bold tracking-tight truncate"
            style={{ color: PLATZI_GREEN }}
          >
            Platzi
          </span>
        </a>

        <div className="flex items-center gap-3 shrink-0 text-white">
          <div className="flex items-center gap-1.5">
            <RocketIllustration className="w-7 h-7 shrink-0" />
            <span className="text-sm font-semibold tabular-nums">1</span>
          </div>

          <button type="button" className="p-0.5 text-slate-100" aria-label="Notifications">
            <Bell className="w-5 h-5" strokeWidth={1.9} />
          </button>

          <button type="button" className="flex items-center gap-1" aria-label="Perfil">
            <img
              src={DEMO_AVATAR}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#3B4658] grayscale contrast-[0.95]"
            />
            <ChevronDown className="w-4 h-4 text-[#898F9D]" />
          </button>

          <div className="h-7 w-px bg-[#898F9D] shrink-0" />

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="p-1 text-[#898F9D]"
              aria-label={t('translateAria')}
              aria-expanded={langOpen}
            >
              <TranslateIcon className="w-7 h-7" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[#898F9D] bg-[#1C2230] shadow-xl py-1 z-50">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#898F9D]">
                  {t('language')}
                </div>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[#1C2230]',
                    locale === 'es' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
                  )}
                  onClick={() => {
                    setLocale('es');
                    setLangOpen(false);
                  }}
                >
                  {t('spanish')}
                </button>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[#1C2230]',
                    locale === 'en' ? 'text-[#00ED80]' : 'text-[#898F9D] hover:text-white',
                  )}
                  onClick={() => {
                    setLocale('en');
                    setLangOpen(false);
                  }}
                >
                  {t('english')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
