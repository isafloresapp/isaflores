import React from 'react';
import { ShoppingBag, MessageCircle, CreditCard, Gift } from 'lucide-react';

export const OrderStepsSection: React.FC = () => {
  const STEPS = [
    {
      num: '1',
      title: 'Selección o Diseño de Autor',
      desc: 'Explore nuestro catálogo exclusivo o configure una ramo personalizada en nuestro IsaFlores Custom.',
      icon: <ShoppingBag className="w-5 h-5 text-[#C05C6D]" />,
    },
    {
      num: '2',
      title: 'pedido Vía atención por WhatsApp WhatsApp',
      desc: 'Sincronización directa por WhatsApp con el detalle técnico, importe y dedicatoria previa redactada.',
      icon: <MessageCircle className="w-5 h-5 text-[#1E7E4B]" />,
    },
    {
      num: '3',
      title: 'Coordinación de Entrega y Pago',
      desc: 'Verificación de disponibilidad, transferencia o datos de despacho en atención de trato directo.',
      icon: <CreditCard className="w-5 h-5 text-[#D4AF37]" />,
    },
    {
      num: '4',
      title: 'Recepción de la flor hecha a mano',
      desc: 'Ensamblaje, perfumado exclusivo y embalaje protector en caja rígida enviado a su destino.',
      icon: <Gift className="w-5 h-5 text-[#3D5A45]" />,
    },
  ];

  return (
    <section className="py-16 bg-[#F3ECE1]/60">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#3D5A45] block mb-1">
          Experiencia Ágil y Distinguida
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E29] max-w-lg mx-auto">
          Adquirir una obra botánica en 4 pasos esenciales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 text-left">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white p-6 rounded-3xl shadow-xs border border-[#E8DFD1] relative hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center border border-[#E8DFD1]">
                  {step.icon}
                </span>
                <span className="font-serif text-2xl font-bold text-[#C05C6D]/30">
                  0{step.num}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#2D1E29] mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-[#5E4657] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
