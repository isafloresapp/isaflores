import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Heart, Star, Compass, Wand2, MessageCircle, Eye, ShoppingBag, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [mobilePageIndex, setMobilePageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

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

  // FLUID DESKTOP SCROLL-DRIVEN HORIZONTAL PARALLAX
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

  // Mobile Scroll Snap Event Listener for Magazine Page Index
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const scrollLeft = mobileScrollRef.current.scrollLeft;
    const width = mobileScrollRef.current.clientWidth;
    const page = Math.round(scrollLeft / (width * 0.85));
    setMobilePageIndex(Math.min(totalSlides - 1, Math.max(0, page)));
  };

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
    if (idx === 0) return 'EXPLORAR RAMOS';
    if (idx === 1) return 'DISEÑAR A MEDIDA';
    return 'WHATSAPP DIRECTO';
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
    <section id="historia">
      
      {/* 📱 MOBILE VERSION: COMPACT MAGAZINE PAGE-FLIP SLIDER (Nativo para Celular - Ocupa porción razonable sin trabar el sitio) */}
      <div className="block md:hidden bg-[#1A0312] text-white py-6 px-3 border-y border-pink-300/30 space-y-4">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between text-left border-b border-white/15 pb-2">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 bg-[#f70071]/20 border border-[#f70071]/40 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-[#ff96c5]">
              <BookOpen className="w-3 h-3 text-[#ff5aa4]" />
              <span>Revista Digital IsaFlores</span>
            </div>
            <h3 className="font-syne text-base font-black text-white">
              El Arte Detrás de Nuestras Flores
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-black text-[#ff96c5] border border-white/20">
            <span>Pág. {mobilePageIndex + 1}/{totalSlides}</span>
          </div>
        </div>

        {/* Mobile Horizontal Snap Magazine Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1"
        >
          {sliders.map((slide, idx) => {
            const theme = SLIDE_THEMES[idx % SLIDE_THEMES.length];

            return (
              <div
                key={`mob-${slide.id || idx}`}
                className="snap-center shrink-0 w-[86vw] h-[350px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl relative flex flex-col justify-end p-5 text-left transition-transform duration-300 active:scale-98"
              >
                {/* Full-Bleed Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Magazine Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/30 z-10" />

                {/* Page Watermark Number */}
                <span className="absolute top-2 right-3 font-syne text-[50px] font-black text-white/10 select-none pointer-events-none z-10">
                  0{idx + 1}
                </span>

                {/* Content Overlay */}
                <div className="relative z-20 space-y-2">
                  <div className="space-y-0.5">
                    <span className="inline-flex items-center gap-1 bg-[#f70071]/30 backdrop-blur-md border border-[#f70071]/50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-[#ffc0dc]">
                      <span>{theme.emoji}</span>
                      <span>{slide.badge || theme.badge}</span>
                    </span>

                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ff96c5] block pt-0.5">
                      {getSubtitles(idx)}
                    </span>
                  </div>

                  <h4 className="font-syne text-lg font-black text-white leading-tight line-clamp-2">
                    {slide.title}
                  </h4>

                  <p className="text-[11px] text-white/90 leading-snug font-medium line-clamp-2">
                    {slide.desc}
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={getActionFn(idx)}
                      className="w-full bg-gradient-to-r from-[#f70071] to-[#ff1b82] text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 border border-white/30"
                    >
                      <span>{getActionText(idx)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Page Turn Swipe Hint */}
        <div className="flex items-center justify-between text-[10px] text-white/70 font-bold px-1">
          <span className="flex items-center gap-1">
            <span>👈 Desliza de lado como revista</span>
          </span>
          <div className="flex items-center gap-1">
            {sliders.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === mobilePageIndex ? 'bg-[#f70071] w-4' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

      </div>


      {/* 💻 DESKTOP VERSION: FULL STICKY HORIZONTAL PARALLAX SLIDER (Sólo en Computador md:block) */}
      <div className="hidden md:block relative bg-[#1A0312] text-white h-[260vh]" ref={containerRef}>
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-8 overflow-hidden z-20 bg-[#1A0312]">
          
          {/* Top Toolbar Header */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 border-b border-white/15 pb-4 shrink-0 z-30">
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-2 bg-[#f70071]/20 border border-[#f70071]/40 px-3.5 py-1 rounded-full text-xs font-black uppercase text-[#ff96c5]">
                <Sparkles className="w-3.5 h-3.5 text-[#ff5aa4] animate-spin" />
                <span>Experiencia IsaFlores</span>
              </div>
              <h2 className="font-syne text-3xl font-black text-white">
                El Arte Detrás de Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff96c5] to-amber-300">Flores Eternas</span>
              </h2>
            </div>

            {/* Slide Navigation Buttons */}
            <div className="flex items-center gap-2">
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

          {/* Full-Bleed Desktop Slide Track */}
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
                    className="w-full h-full shrink-0 flex items-center justify-center px-4"
                  >
                    <div
                      className={`w-full max-w-6xl h-full max-h-[620px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative flex items-center text-left transition-all duration-500 transform ${
                        isCurrent ? 'scale-100 opacity-100' : 'scale-95 opacity-75'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000"
                      />

                      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30 z-10" />

                      <span className="absolute bottom-2 right-4 font-syne text-[220px] font-black text-white/5 select-none pointer-events-none leading-none z-10">
                        0{idx + 1}
                      </span>

                      <div className="relative z-20 p-12 lg:p-16 max-w-3xl space-y-6">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 bg-[#f70071]/30 backdrop-blur-md border border-[#f70071]/50 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#ffc0dc] shadow-lg">
                            <span className="text-base">{theme.emoji}</span>
                            <span>{slide.badge || theme.badge}</span>
                          </div>

                          <span className="text-sm font-black uppercase tracking-widest text-[#ff96c5] block pt-1">
                            {getSubtitles(idx)}
                          </span>
                        </div>

                        <h3 className="font-syne text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-xl">
                          {slide.title}
                        </h3>

                        <p className="text-lg text-white/95 leading-relaxed font-semibold max-w-2xl drop-shadow-md">
                          {slide.desc}
                        </p>

                        {slide.highlights && slide.highlights.length > 0 && (
                          <div className="grid grid-cols-2 gap-2.5 pt-1">
                            {slide.highlights.map((h, hIdx) => (
                              <div
                                key={hIdx}
                                className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-sm font-bold text-white shadow-md"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#ff5aa4] shrink-0" />
                                <span className="line-clamp-1">{h}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-6">
                          <button
                            onClick={getActionFn(idx)}
                            className="bg-gradient-to-r from-[#f70071] to-[#ff1b82] hover:from-[#ff1b82] hover:to-[#f70071] text-white font-black text-sm uppercase tracking-widest px-10 py-4 rounded-full flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:scale-105 cursor-pointer ring-4 ring-[#f70071]/30 active:scale-95"
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

          {/* Desktop Progress Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 border-t border-white/15 pt-4 shrink-0 z-30">
            <div className="flex items-center gap-2 text-xs text-white/90 font-bold">
              <span className="text-base animate-pulse">📜</span>
              <span>
                Sigue bajando: la historia avanza automáticamente ({Math.round(scrollProgress * 100)}%)
              </span>
            </div>

            <div className="w-60 bg-white/20 h-2.5 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-[#f70071] via-[#ff5aa4] to-amber-300 h-full transition-all duration-150 rounded-full shadow-lg"
                style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
