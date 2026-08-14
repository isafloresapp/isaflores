import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { db, SliderItem, INITIAL_SLIDERS } from '../services/db';

interface StoryCarouselProps {
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  onOpenCustomBuilder,
  onExploreCatalog,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sliders, setSliders] = useState<SliderItem[]>(INITIAL_SLIDERS);

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

  useEffect(() => {
    if (sliders.length === 0) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev >= sliders.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [sliders]);

  if (!sliders || sliders.length === 0) return null;

  const currentSlider = sliders[activeTab] || sliders[0];

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
    if (idx === 0) return 'Explorar Todos los Ramos';
    if (idx === 1) return 'Diseñar Ramo a Medida';
    return 'Hablar con un Asesor WhatsApp';
  };

  return (
    <section className="py-12 sm:py-20 bg-[#2B051C] text-white" id="historia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b border-white/20 pb-4 sm:pb-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#ff96c5] block">
              Proceso & Experiencia IsaFlores
            </span>
            <h2 className="font-syne text-2xl sm:text-5xl font-black text-white">
              El Secreto de Cada <span className="text-gradient-pink">ramo de flores</span>
            </h2>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 p-1.5 rounded-full self-start md:self-auto">
            {sliders.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                  idx === activeTab
                    ? 'bg-[#f70071] text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Story Showcase Box */}
        <div className="bento-card p-5 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center text-left">
          {/* Image Left */}
          <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl group">
            <img
              src={currentSlider.image}
              alt={currentSlider.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 bg-[#2B051C]/90 backdrop-blur-md text-[#ffc0dc] font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white/20">
              {currentSlider.badge}
            </span>
          </div>

          {/* Details Right */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <h3 className="font-syne text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {currentSlider.title}
            </h3>

            <p className="text-xs sm:text-base text-white/90 leading-relaxed font-semibold">
              {currentSlider.desc}
            </p>

            {currentSlider.highlights && currentSlider.highlights.length > 0 && (
              <div className="space-y-2 pt-1">
                {currentSlider.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-extrabold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#ff5aa4] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 sm:pt-4">
              <button
                onClick={getActionFn(activeTab)}
                className="w-full sm:w-auto bg-white hover:bg-[#ffc0dc] text-[#2B051C] font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-full flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer"
              >
                <span>{getActionText(activeTab)}</span>
                <ArrowRight className="w-4 h-4 text-[#f70071]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
