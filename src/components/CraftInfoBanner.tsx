import React, { useState } from 'react';
import { Heart, Clock, Truck, ShieldCheck, Sparkles, MessageCircle, Check } from 'lucide-react';

export const CraftInfoBanner: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const MARQUEE_ITEMS = [
    '🌸 TALLER ISAFORES SANTIAGO',
    '✨ HECHO 100% A MANO EN CHILE',
    '🌿 FLORES PERENNES QUE DURAN AÑOS',
    '📦 ENVÍOS PROTEGIDOS A TODO CHILE',
    '💖 CHENILLE AFELPADO ALTA DENSIDAD',
    '⭐ CERO MANTENIMIENTO NI AGUA',
    '🎉 DESPACHO GRATIS EN LA FLORIDA',
  ];

  const FEATURES = [
    {
      id: 'autor',
      title: 'Manufactura de Autor',
      subtitle: 'Escultura Botánica a Mano',
      desc: 'Esculpimos manualmente cada estambre y pétalo en chenille de alta densidad en Santiago de Chile.',
      icon: <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current text-white" />,
      badge: '🌸 100% Artesanal',
      gradient: 'from-[#f70071] via-[#ff1b82] to-[#c2185b]',
      borderGlow: 'border-[#f70071] shadow-[#f70071]/20',
      badgeBg: 'bg-[#f70071]/15 text-[#f70071] border-[#f70071]/30',
      metric: '+1.200 Ramos',
      metricSub: 'Creados con Amor'
    },
    {
      id: 'preservacion',
      title: 'Preservación Inalterable',
      subtitle: 'Cero Necesidad de Agua',
      desc: 'Flores eternas que conservan su volumen afelpado, textura suave y brillo sin marchitarse.',
      icon: <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      badge: '💧 Cero Agua',
      gradient: 'from-[#00838F] via-[#00ACC1] to-[#00695C]',
      borderGlow: 'border-[#00838F] shadow-[#00838F]/20',
      badgeBg: 'bg-[#00838F]/15 text-[#00838F] border-[#00838F]/30',
      metric: 'Indefinida',
      metricSub: 'Garantía Eterna'
    },
    {
      id: 'cobertura',
      title: 'Cobertura & Envío Seguro',
      subtitle: 'Cajas Rígidas Protegidas',
      desc: 'Envíos asegurados a todas las regiones por couriers. ¡Despacho GRATIS en La Florida!',
      icon: <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      badge: '📦 Envíos Chile',
      gradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
      borderGlow: 'border-[#F59E0B] shadow-[#F59E0B]/20',
      badgeBg: 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]/30',
      metric: '100% Seguro',
      metricSub: 'Embalaje Rígido'
    },
    {
      id: 'whatsapp',
      title: 'Atención por WhatsApp',
      subtitle: 'Asesoría Personalizada 1 a 1',
      desc: 'Atención personal inmediata para elegir tus flores y redactar dedicatorias escritas a mano.',
      icon: <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
      badge: '💬 WhatsApp 1-Clic',
      gradient: 'from-[#25D366] via-[#10B981] to-[#059669]',
      borderGlow: 'border-[#25D366] shadow-[#25D366]/20',
      badgeBg: 'bg-[#25D366]/15 text-[#059669] border-[#25D366]/30',
      metric: '< 5 min',
      metricSub: 'Respuesta Rápida'
    },
  ];

  return (
    <section className="py-6 sm:py-14 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] border-y border-pink-200/70 relative overflow-hidden text-[#2B051C]" id="craft">
      
      {/* Infinite Marquee Ticker */}
      <div className="bg-gradient-to-r from-[#2B051C] via-[#4A0033] to-[#2B051C] py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white shadow-xs mb-6 sm:mb-12 overflow-hidden border-y border-pink-300/30">
        <div className="animate-marquee whitespace-nowrap flex items-center justify-around gap-6">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 shrink-0">
              <span className="text-[#ff96c5]">{item}</span>
              <span className="text-amber-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-8 relative z-10 space-y-6 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1 bg-[#f70071]/10 text-[#f70071] px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-[#f70071]/20">
            <Sparkles className="w-3 h-3" />
            <span>Garantía IsaFlores · Recuerdos que Perduran</span>
          </div>
          <h2 className="font-syne text-xl sm:text-4xl font-black text-[#2B051C]">
            ¿Por Qué Elegir Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#8E24AA]">Flores Eternas</span>?
          </h2>
        </div>

        {/* 2-Column Mobile Grid / 4-Column Desktop Grid for Ultra-Compact Mobile Viewing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 text-left">
          {FEATURES.map((feat, idx) => {
            const isHovered = activeCardIndex === idx;

            return (
              <div
                key={feat.id}
                onClick={() => setActiveCardIndex(idx)}
                onMouseEnter={() => setActiveCardIndex(idx)}
                className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border-2 transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? `bg-white ${feat.borderGlow} shadow-lg scale-[1.01]`
                    : 'bg-white/90 border-pink-100/90 shadow-xs'
                }`}
              >
                {/* Top Glowing Color Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${feat.gradient}`} />

                <div className="space-y-2 sm:space-y-4 pt-1">
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-xs shrink-0`}>
                      {feat.icon}
                    </div>

                    <span className={`text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${feat.badgeBg} truncate max-w-[90px] sm:max-w-none`}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#f70071] block truncate">
                      {feat.subtitle}
                    </span>
                    <h3 className="font-syne font-black text-xs sm:text-xl text-[#2B051C] leading-snug">
                      {feat.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] sm:text-xs text-gray-600 font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {feat.desc}
                  </p>
                </div>

                {/* Metric Footer */}
                <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-pink-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-syne font-black text-xs sm:text-base text-[#2B051C] block leading-none">
                      {feat.metric}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold block truncate">
                      {feat.metricSub}
                    </span>
                  </div>

                  <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-pink-50 text-[#f70071] flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
                    ✓
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
