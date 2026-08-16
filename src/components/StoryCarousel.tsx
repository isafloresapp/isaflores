import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Heart, Star, Compass, Wand2, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { db, SliderItem, INITIAL_SLIDERS } from '../services/db';

interface StoryCarouselProps {
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  onOpenCustomBuilder,
  onExploreCatalog,
}) => {
  const [sliders, setSliders] = useState<SliderItem[]>(INITIAL_SLIDERS);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load Sliders from DB
  useEffect(() => {
    const loadSliders = async () => {
      const data = await db.getSliders();
      if (data && data.length > 0) {
        setSliders(data);
      }
    };

    loadSliders();

    const handleSlidersChanged = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setSliders(e.detail);
      }
    };

    window.addEventListener('isaflores_sliders_changed', handleSlidersChanged);
    return () => {
      window.removeEventListener('isaflores_sliders_changed', handleSlidersChanged);
    };
  }, []);

  const totalSlides = sliders.length || 3;

  // FLUID NATURAL SCROLL-DRIVEN HORIZONTAL PARALLAX
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = rect.height - windowHeight;

      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollableHeight));

      setScrollProgress(progress);

      const slideIndex = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
      setActiveSlideIndex(slideIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalSlides]);

  if (!sliders || sliders.length === 0) return null;

  const getActionFn = (idx: number) => {
    if (idx === 0) return onExploreCatalog;
    if (idx === 1) return onOpenCustomBuilder;
    return () => {
      window.open(
        'https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20deseo%20recibir%20asesoria%20para%20un%20pedido%20de%20autor',
        '_blank'
      );
    };
  };

  const getActionText = (idx: number) => {
    if (idx === 0) return 'EXPLORAR CATÁLOGO DE RAMOS';
    if (idx === 1) return 'DISEÑAR RAMO A MEDIDA';
    return 'HABLAR POR WHATSAPP';
  };

  const getSubtitles = (idx: number) => {
    if (idx === 0) return 'Artesanía Botánica de Autor';
    if (idx === 1) return 'Flores Perennes Inalterables';
    return 'Atención Exclusiva & Regalo Listo';
  };

  const SLIDE_THEMES = [
    { emoji: '🌸', badge: 'MANIFIESTO ARTESANAL', accentColor: '#f70071' },
    { emoji: '💧', badge: 'TECNOLOGÍA BOTÁNICA', accentColor: '#00838F' },
    { emoji: '🎁', badge: 'ATENCIÓN PERSONALIZADA', accentColor: '#AB47BC' },
  ];

  return (
    /* OUTER CONTAINER WITH HEIGHT TO DRIVE HORIZONTAL SCROLL */
    <section className="relative bg-[#1A0312] text-white h-[280vh]" id="historia" ref={containerRef}>
      {/* STICKY FULLSCREEN VIEWPORT */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-4 sm:p-8 overflow-hidden z-20 bg-[#1A0312]">
        
        {/* TOP TOOLBAR HEADER */}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4 shrink-0 z-30">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#f70071]/20 border border-[#f70071]/40 px-3.5 py-1 rounded-full text-xs font-black uppercase text-[#ff96c5]">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5aa4] animate-spin" />
              <span>Experiencia IsaFlores</span>
            </div>
            <h2 className="font-syne text-xl sm:text-3xl font-black text-white">
              El Arte Detrás de Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff96c5] to-amber-300">Flores Eternas</span>
            </h2>
          </div>

          {/* Interactive Slide Selector Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {sliders.map((s, idx) => {
              const isCurrent = idx === activeSlideIndex;
              return (
                <button
                  key={s.id || idx}
                  onClick={() => {
                    if (containerRef.current) {
                      const containerTop = containerRef.current.offsetTop;
                      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
                      const targetScroll = containerTop + (idx / (totalSlides - 1)) * containerHeight;
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                    isCurrent
                      ? 'bg-[#f70071] text-white border-[#f70071] shadow-lg scale-105 ring-2 ring-[#f70071]/40'
                      : 'bg-white/10 text-white/70 border-white/15 hover:bg-white/20'
                  }`}
                >
                  <span>{SLIDE_THEMES[idx % SLIDE_THEMES.length].emoji}</span>
                  <span>0{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FULL-BLEED SLIDE TRACK */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex items-center justify-center my-3 overflow-hidden relative">
          <div
            className="flex w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollProgress * (totalSlides - 1) * 100}%)` }}
          >
            {sliders.map((slide, idx) => {
              const theme = SLIDE_THEMES[idx % SLIDE_THEMES.length];
              const isCurrent = idx === activeSlideIndex;

              return (
                <div
                  key={slide.id || idx}
                  className="w-full h-full shrink-0 flex items-center justify-center px-1 sm:px-4"
                >
                  {/* FULL-BLEED IMAGE BACKGROUND SLIDE CARD */}
                  <div
                    className={`w-full max-w-6xl h-full max-h-[620px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative flex items-end sm:items-center text-left transition-all duration-500 transform ${
                      isCurrent ? 'scale-100 opacity-100' : 'scale-95 opacity-75'
                    }`}
                  >
                    {/* FULL-BLEED BACKGROUND IMAGE */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000"
                    />

                    {/* CINEMATIC GRADIENT OVERLAY FOR PERFECT READABILITY */}
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/95 via-black/80 to-black/30 z-10" />

                    {/* WATERMARK NUMBER */}
                    <span className="absolute bottom-2 right-4 font-syne text-[140px] sm:text-[220px] font-black text-white/5 select-none pointer-events-none leading-none z-10">
                      0{idx + 1}
                    </span>

                    {/* OVERLAY SLIDE TEXT CONTENT (SUBTITULO, TITULO, DESCRIPCION & BOTON LLAMADO A LA ATENCION) */}
                    <div className="relative z-20 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-4 sm:space-y-6">
                      
                      {/* Floating Badge & Subtitle */}
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-[#f70071]/30 backdrop-blur-md border border-[#f70071]/50 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#ffc0dc] shadow-lg">
                          <span className="text-base">{theme.emoji}</span>
                          <span>{slide.badge || theme.badge}</span>
                        </div>

                        <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#ff96c5] block pt-1">
                          {getSubtitles(idx)}
                        </span>
                      </div>

                      {/* MAIN TITLE */}
                      <h3 className="font-syne text-2xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-xl">
                        {slide.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-sm sm:text-lg text-white/95 leading-relaxed font-semibold max-w-2xl drop-shadow-md">
                        {slide.desc}
                      </p>

                      {/* HIGHLIGHTS CHECKLIST */}
                      {slide.highlights && slide.highlights.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {slide.highlights.map((h, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-xs sm:text-sm font-bold text-white shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#ff5aa4] shrink-0" />
                              <span className="line-clamp-1">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* EYE-CATCHING CALL TO ACTION BUTTON (BOTON DESTACADO DE LLAMADO DE ATENCION) */}
                      <div className="pt-3 sm:pt-6">
                        <button
                          onClick={getActionFn(idx)}
                          className="w-full sm:w-auto bg-gradient-to-r from-[#f70071] to-[#ff1b82] hover:from-[#ff1b82] hover:to-[#f70071] text-white font-black text-xs sm:text-sm uppercase tracking-widest px-8 sm:px-10 py-4 rounded-full flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:scale-105 cursor-pointer ring-4 ring-[#f70071]/30 active:scale-95"
                        >
                          <span>{getActionText(idx)}</span>
                          <ArrowRight className="w-5 h-5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM PROGRESS BAR */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 border-t border-white/15 pt-4 shrink-0 z-30">
          <div className="flex items-center gap-2 text-xs text-white/90 font-bold">
            <span className="text-base animate-pulse">📜</span>
            <span>
              Sigue bajando: la historia avanza automáticamente ({Math.round(scrollProgress * 100)}%)
            </span>
          </div>

          <div className="w-36 sm:w-60 bg-white/20 h-2.5 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-[#f70071] via-[#ff5aa4] to-amber-300 h-full transition-all duration-150 rounded-full shadow-lg"
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
