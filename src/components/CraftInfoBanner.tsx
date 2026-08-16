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
      desc: 'Esculpimos manualmente cada estambre y pétalo en chenille de alta densidad y alambre flexible en nuestro taller de Santiago de Chile.',
      icon: <Heart className="w-6 h-6 fill-current text-white" />,
      badge: '🌸 100% Artesanal',
      gradient: 'from-[#f70071] via-[#ff1b82] to-[#c2185b]',
      borderGlow: 'border-[#f70071] shadow-[#f70071]/30',
      badgeBg: 'bg-[#f70071]/15 text-[#f70071] border-[#f70071]/30',
      metric: '+1.200 Ramos',
      metricSub: 'Creados con Amor'
    },
    {
      id: 'preservacion',
      title: 'Preservación Inalterable',
      subtitle: 'Cero Necesidad de Agua',
      desc: 'Flores eternas que conservan su volumen afelpado, textura suave al tacto y brillo cromático año tras año sin marchitarse.',
      icon: <Clock className="w-6 h-6 text-white" />,
      badge: '💧 Cero Mantención',
      gradient: 'from-[#00838F] via-[#00ACC1] to-[#00695C]',
      borderGlow: 'border-[#00838F] shadow-[#00838F]/30',
      badgeBg: 'bg-[#00838F]/15 text-[#00838F] border-[#00838F]/30',
      metric: 'Indefinida',
      metricSub: 'Duración Garantizada'
    },
    {
      id: 'cobertura',
      title: 'Cobertura & Envío Seguro',
      subtitle: 'Cajas Rígidas Anti-Impacto',
      desc: 'Envíos asegurados a todas las regiones de Chile por couriers certificados. ¡Además contamos con despacho GRATIS en La Florida!',
      icon: <Truck className="w-6 h-6 text-white" />,
      badge: '📦 Envíos a Todo Chile',
      gradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
      borderGlow: 'border-[#F59E0B] shadow-[#F59E0B]/30',
      badgeBg: 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]/30',
      metric: '100% Seguro',
      metricSub: 'Embalaje Reforzado'
    },
    {
      id: 'whatsapp',
      title: 'Atención Directa por WhatsApp',
      subtitle: 'Asesoría 1 a 1 Personalizada',
      desc: 'Atención personal inmediata para elegir tus flores, redactar dedicatorias en papel artesanal y agendar despachos en fechas especiales.',
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      badge: '💬 1-Clic WhatsApp',
      gradient: 'from-[#25D366] via-[#10B981] to-[#059669]',
      borderGlow: 'border-[#25D366] shadow-[#25D366]/30',
      badgeBg: 'bg-[#25D366]/15 text-[#059669] border-[#25D366]/30',
      metric: '< 5 min',
      metricSub: 'Respuesta Inmediata'
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] border-y border-pink-200/70 relative overflow-hidden text-[#2B051C]" id="craft">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Infinite Marquee Ticker */}
      <div className="bg-gradient-to-r from-[#2B051C] via-[#4A0033] to-[#2B051C] py-3 text-xs font-black uppercase tracking-[0.25em] text-white shadow-md mb-12 overflow-hidden border-y border-pink-300/30">
        <div className="animate-marquee whitespace-nowrap flex items-center justify-around gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-3 shrink-0">
              <span className="text-[#ff96c5]">{item}</span>
              <span className="text-amber-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#f70071]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Garantía IsaFlores · Recuerdos que Perduran</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-5xl font-black text-[#2B051C]">
            ¿Por Qué Elegir Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#8E24AA]">Flores Eternas</span>?
          </h2>
          <p className="text-xs sm:text-base text-gray-600 font-medium max-w-xl mx-auto">
            Descubre los 4 pilares fundamentales que convierten cada uno de nuestros ramos en una escultura viva inolvidable.
          </p>
        </div>

        {/* 4 Interactive Floating Colorful Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {FEATURES.map((feat, idx) => {
            const isHovered = activeCardIndex === idx;

            return (
              <div
                key={feat.id}
                onMouseEnter={() => setActiveCardIndex(idx)}
                className={`rounded-3xl p-6 border-2 transition-all duration-500 relative flex flex-col justify-between transform hover:-translate-y-2 cursor-pointer ${
                  isHovered
                    ? `bg-white ${feat.borderGlow} shadow-2xl scale-[1.02]`
                    : 'bg-white/80 border-pink-100 shadow-md hover:border-pink-300'
                }`}
              >
                {/* Top Glowing Color Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${feat.gradient}`} />

                <div className="space-y-4 pt-1">
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-lg transform transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                      {feat.icon}
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-xs ${feat.badgeBg}`}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f70071] block">
                      {feat.subtitle}
                    </span>
                    <h3 className="font-syne font-black text-xl text-[#2B051C]">
                      {feat.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                {/* Metric Footer */}
                <div className="pt-4 mt-4 border-t border-pink-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-syne font-black text-base text-[#2B051C] block">
                      {feat.metric}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block">
                      {feat.metricSub}
                    </span>
                  </div>

                  <span className="w-7 h-7 rounded-full bg-pink-50 text-[#f70071] flex items-center justify-center font-bold shadow-xs">
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
