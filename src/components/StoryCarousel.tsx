import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import heroBouquetImg from '../assets/images/hero_pipe_cleaner_bouquet_1786069749958.jpg';
import girasolesImg from '../assets/images/girasoles_limpiapipas_1786069760102.jpg';
import kitDiyImg from '../assets/images/kit_diy_limpiapipas_1786069771911.jpg';

interface StoryCarouselProps {
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  onOpenCustomBuilder,
  onExploreCatalog,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const STORIES = [
    {
      id: 1,
      badge: 'MANIFIESTO ARTESANAL',
      title: 'Esculturas Vivas Creadas para Perdurar',
      desc: 'En el IsaFlores IsaFlores, cada tallo floral no es solo una adorno; es una escultura individual concebida con alambre de calibre flexible y fibras de chenille afelpadas de alta densidad.',
      image: heroBouquetImg,
      highlights: [
        'Modelado 100% artesanal en Santiago',
        'Textura afelpada que conservas al tacto',
        'Colores vivos inalterables con los años',
      ],
      actionText: 'Explorar Todos los Ramos',
      actionFn: onExploreCatalog,
    },
    {
      id: 2,
      badge: 'TECNOLOGÍA BOTÁNICA',
      title: 'Preservación Inalterable Sin Agua',
      desc: 'Nuestras ramos de flores se mantienen radiantes y firmes a lo largo de las estaciones. Di adiós a cambiar agua o preocuparte por marchitez.',
      image: girasolesImg,
      highlights: [
        'Cero consumo de agua ni poda',
        'Resistente a polvo y humedad ambiental',
        'Ideal para alérgicos al polen natural',
      ],
      actionText: 'Diseñar Ramo a Medida',
      actionFn: onOpenCustomBuilder,
    },
    {
      id: 3,
      badge: 'ATENCIÓN PERSONALIZADA',
      title: 'atención por WhatsApp Directo por WhatsApp',
      desc: 'Coordinamos cada detalle de tu sorpresa: agregamos dedicatoria escrita a mano en papel artesanal, envolvemos en cintas de satén y despachamos en la fecha que necesites.',
      image: kitDiyImg,
      highlights: [
        'Tarjeta de cortesía con caligrafía manual',
        'Empaque de regalo listo para entregar',
        'Seguimiento directo en tiempo real',
      ],
      actionText: 'Hablar con un Asesor',
      actionFn: () => {
        window.open(
          'https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20deseo%20recibir%20asesoria%20para%20un%20pedido%20de%20autor',
          '_blank'
        );
      },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === STORIES.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const story = STORIES[activeTab];

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
            {STORIES.map((s, idx) => (
              <button
                key={s.id}
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
              src={story.image}
              alt={story.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 bg-[#2B051C]/90 backdrop-blur-md text-[#ffc0dc] font-black text-[9px] sm:text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white/20">
              {story.badge}
            </span>
          </div>

          {/* Details Right */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <h3 className="font-syne text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {story.title}
            </h3>

            <p className="text-xs sm:text-base text-white/90 leading-relaxed font-semibold">
              {story.desc}
            </p>

            <div className="space-y-2 pt-1">
              {story.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-extrabold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5aa4] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={story.actionFn}
                className="w-full sm:w-auto bg-white hover:bg-[#ffc0dc] text-[#2B051C] font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-full flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer"
              >
                <span>{story.actionText}</span>
                <ArrowRight className="w-4 h-4 text-[#f70071]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
