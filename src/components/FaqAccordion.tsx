import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [
    {
      q: '¿Qué materiales componen las flores hechas a mano de IsaFlores?',
      a: 'Nuestras flores están elaboradas con hilado afelpado de chenille de alta densidad y estructuras de alambre floral templado de calibre flexible. Esta combinación otorga volumen, suavidad sedosa y resistencia inalterable.',
    },
    {
      q: '¿Cómo se gestionan los envíos en la Región Metropolitana y regiones?',
      a: 'En la comuna de La Florida todos los despachos son 100% GRATIS. En el resto de la Región Metropolitana tienen una tarifa fija de $3.500 CLP. Para regiones despachamos por pagar mediante Starken, Chilexpress o Blue Express.',
    },
    {
      q: '¿Con cuánto tiempo de anticipación debo hacer mi pedido?',
      a: 'El tiempo de elaboración y despacho estándar normal es de 72 horas (3 días). Si necesitas tu entrega hoy mismo, contamos con Servicio Express (+$3.500 CLP) con entrega en el día.',
    },
    {
      q: '¿Requieren agua o algún cuidado de conservación especial?',
      a: '¡No requieren agua, luz solar ni poda! Nuestras esculturas se conservan intactas año tras año sin marchitarse ni perder su color brillante. Para cuidarlas, basta con retirar el polvo ocasionalmente con un plumero suave.',
    },
    {
      q: '¿Cómo se realiza la coordinación y el pago?',
      a: 'Una vez seleccionadas tus flores en el carrito o cotización, la orden se envía directamente a nuestro chat oficial de WhatsApp. Allí coordinamos la dirección y el medio de pago (Transferencia, MercadoPago o Webpay).',
    },
  ];

  return (
    <section className="py-20 bg-[#2B051C] text-white border-t border-white/10" id="preguntas">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5] block mb-2">
          Información & Consultas Frecuentes
        </span>
        <h2 className="font-syne text-3xl sm:text-5xl font-black text-white mb-12">
          Preguntas Frecuentes sobre <span className="text-gradient-pink">IsaFlores</span>
        </h2>

        <div className="space-y-4 text-left">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#42082B] rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 font-syne font-extrabold text-sm sm:text-base text-white flex items-center justify-between gap-4 text-left hover:text-[#ffc0dc] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#f70071] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#ff96c5] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#f70071]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-white/95 leading-relaxed border-t border-white/15 bg-[#2B051C]/60 font-semibold">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
