import React from 'react';
import { Heart, Clock, Truck, ShieldCheck, Sparkles, Award } from 'lucide-react';

export const CraftInfoBanner: React.FC = () => {
  const MARQUEE_ITEMS = [
    '🌸 taller ISAFLORES',
    '✨ HECHO A MANO EN CHILE',
    '🌿 flores hechas a mano duraderas',
    '📦 ENVIOS PROTEGIDOS A TODO EL PAÍS',
    '💖 CHENILLE DE ALTA DENSIDAD',
    '⭐ CERO MANTENIMIENTO',
  ];

  return (
    <section className="py-16 bg-[#451531] text-white border-y border-white/20 overflow-hidden" id="craft">
      {/* Infinite Marquee Ticker */}
      <div className="gradient-pal-hotpink py-3 text-xs font-black uppercase tracking-[0.25em] text-white shadow-lg mb-16 overflow-hidden border-y border-white/20">
        <div className="animate-marquee whitespace-nowrap flex items-center justify-around gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-3 shrink-0">
              <span>{item}</span>
              <span className="text-[#A5BEFA]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#A5BEFA] block">
            Garantía IsaFlores. Recuerdos que perduran.
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl font-black text-white">
            Por Qué Elegir Nuestras <span className="text-gradient-pal">Flores duraderas</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bento-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3877] text-white flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h4 className="font-syne font-extrabold text-xl text-white">
              Manufactura de Autor
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-bold">
              Esculpimos manualmente cada estambre y pétalo en chenille de alta densidad en nuestro taller de Santiago.
            </p>
          </div>

          <div className="bento-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B3093F] text-white flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-syne font-extrabold text-xl text-white">
              Preservación Inalterable
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-bold">
              flores eternas: conservan su volumen afelpado, textura y brillo cromático año tras año sin necesidad de agua.
            </p>
          </div>

          <div className="bento-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#64B7CC] text-[#451531] flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-syne font-extrabold text-xl text-white">
              Cobertura Nacional
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-bold">
              Despacho con embalaje especial reforzado a todas las regiones de Chile por couriers certificados.
            </p>
          </div>

          <div className="bento-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A5BEFA] text-[#451531] flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-syne font-extrabold text-xl text-white">
              atención por WhatsApp WhatsApp
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-bold">
              Atención personal inmediata para redactar dedicatorias a mano y agendar envíos en fechas especiales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
