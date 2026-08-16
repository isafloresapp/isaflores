import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, CreditCard, Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const OrderStepsSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    {
      num: '01',
      label: '1. Selección de Ramo',
      title: 'Elige o Diseña tu Flor de Autor',
      desc: 'Explora nuestro catálogo perenne o configura un ramo personalizado combinando tus colores y flores de chenille favoritas.',
      icon: <ShoppingBag className="w-5 h-5 text-white" />,
      badge: '🌸 Catálogo & Custom',
      gradient: 'from-[#f70071] via-[#ff1b82] to-[#c2185b]',
      accentText: 'text-[#f70071]',
      glowColor: 'shadow-[#f70071]/30',
      activeBorder: 'border-[#f70071] ring-4 ring-[#f70071]/25',
      badgeBg: 'bg-[#f70071]/15 text-[#f70071] border-[#f70071]/30',
      actionText: 'Explorar Catálogo',
      actionUrl: '#productos'
    },
    {
      num: '02',
      label: '2. Pedido por WhatsApp',
      title: 'Atención Directa por WhatsApp',
      desc: 'Sincronizamos tu pedido en 1 clic enviando el detalle técnico, importe, fecha de entrega y tu dedicatoria escrita a mano.',
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      badge: '💬 1-Clic WhatsApp',
      gradient: 'from-[#25D366] via-[#10B981] to-[#059669]',
      accentText: 'text-[#10B981]',
      glowColor: 'shadow-[#10B981]/30',
      activeBorder: 'border-[#10B981] ring-4 ring-[#10B981]/25',
      badgeBg: 'bg-[#10B981]/15 text-[#059669] border-[#10B981]/30',
      actionText: 'Hablar por WhatsApp',
      actionUrl: 'https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20deseo%20realizar%20un%20pedido'
    },
    {
      num: '03',
      label: '3. Pago & Despacho',
      title: 'Coordinación de Entrega y Pago',
      desc: 'Aceptamos transferencias y tarjetas. Despacho GRATIS en La Florida y envíos por pagar a todas las regiones de Chile.',
      icon: <CreditCard className="w-5 h-5 text-white" />,
      badge: '💳 Pago Seguro & Envío',
      gradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
      accentText: 'text-[#D97706]',
      glowColor: 'shadow-[#F59E0B]/30',
      activeBorder: 'border-[#F59E0B] ring-4 ring-[#F59E0B]/25',
      badgeBg: 'bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30',
      actionText: 'Ver Catálogo de Ramos',
      actionUrl: '#productos'
    },
    {
      num: '04',
      label: '4. Recepción de Regalo',
      title: 'Recepción de la Flor Hecha a Mano',
      desc: 'Ensamblaje artesanal, perfumado exclusivo con esencias florales y embalaje protector en caja lista para sorprender.',
      icon: <Gift className="w-5 h-5 text-white" />,
      badge: '🎁 Empaque Especial',
      gradient: 'from-[#8E24AA] via-[#A855F7] to-[#7E22CE]',
      accentText: 'text-[#8E24AA]',
      glowColor: 'shadow-[#8E24AA]/30',
      activeBorder: 'border-[#8E24AA] ring-4 ring-[#8E24AA]/25',
      badgeBg: 'bg-[#8E24AA]/15 text-[#8E24AA] border-[#8E24AA]/30',
      actionText: 'Pedir Ahora Mismo',
      actionUrl: '#productos'
    },
  ];

  // Auto cycle steps every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [STEPS.length]);

  const currentStep = STEPS[activeStep];

  return (
    <section className="py-10 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] border-y border-pink-200/60 relative overflow-hidden" id="pasos-pedido">
      
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-pink-300/30 to-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-emerald-300/30 to-amber-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 text-center space-y-6 relative z-10">
        
        {/* COMPACT FLOATING HEADER */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#f70071]/15 text-[#f70071] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#f70071]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experiencia Ágil & Distinguida</span>
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-black text-[#2B051C]">
            Adquirir tu obra botánica en 4 pasos
          </h2>
        </div>

        {/* 4 FLOATING COLORFUL STEP BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-3xl border-2 transition-all duration-500 cursor-pointer flex items-center gap-3 text-left relative transform hover:-translate-y-1.5 ${
                  isActive
                    ? `bg-white ${step.activeBorder} shadow-2xl ${step.glowColor} scale-[1.03] z-20`
                    : 'bg-white/80 border-pink-100 hover:bg-white hover:border-pink-300 shadow-md hover:shadow-lg opacity-85'
                }`}
              >
                {/* Floating Colorful Icon Circle */}
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br ${step.gradient} transform transition-transform duration-300 ${
                    isActive ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  {step.icon}
                </span>

                <div className="overflow-hidden">
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${step.accentText}`}>
                    Paso {step.num}
                  </span>
                  <span className={`text-xs font-black line-clamp-1 ${isActive ? 'text-[#2B051C]' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* FLOATING 3D ACTIVE DISPLAY CARD WITH VIBRANT COLORS & SHADOWS */}
        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-white shadow-2xl ${currentStep.glowColor} text-left transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transform hover:-translate-y-1`}>
          
          {/* Top Colorful Accent Line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentStep.gradient}`} />

          <div className="space-y-2 flex-1 pt-1">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border shadow-xs ${currentStep.badgeBg}`}>
                {currentStep.badge}
              </span>
              <span className="text-xs text-gray-400 font-extrabold">Paso {currentStep.num} de 04</span>
            </div>

            <h3 className="font-syne font-black text-xl sm:text-2xl text-[#2B051C]">
              {currentStep.title}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-2xl">
              {currentStep.desc}
            </p>
          </div>

          {/* VIBRANT FLOATING CTA BUTTON */}
          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={currentStep.actionUrl}
              target={currentStep.actionUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              className={`w-full sm:w-auto bg-gradient-to-r ${currentStep.gradient} text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-xl ${currentStep.glowColor} flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer`}
            >
              <span>{currentStep.actionText}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
