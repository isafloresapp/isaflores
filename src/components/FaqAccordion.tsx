import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Send, X, Phone, Mail, Clock, Heart, CheckCircle2, Search, Zap } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('Cotización Personalizada');
  const [contactMessage, setContactMessage] = useState<string>('');

  const FAQS = [
    {
      id: 1,
      tag: 'materiales',
      tagLabel: '🌸 Materiales',
      icon: '🌺',
      q: '¿Qué materiales componen las flores hechas a mano de IsaFlores?',
      a: 'Nuestras flores están elaboradas con hilado afelpado de chenille de alta densidad y estructuras de alambre floral templado de calibre flexible. Esta combinación otorga volumen, suavidad sedosa y resistencia inalterable año tras año.',
    },
    {
      id: 2,
      tag: 'envios',
      tagLabel: '📦 Envíos & Tiempos',
      icon: '📦',
      q: '¿Cómo se gestionan los envíos en la Región Metropolitana y regiones?',
      a: 'En la comuna de La Florida todos los despachos son 100% GRATIS. En el resto de la Región Metropolitana tienen una tarifa accesible de $3.500 CLP. Para regiones despachamos por pagar mediante Starken, Chilexpress, CorreosChile o Blue Express.',
    },
    {
      id: 3,
      tag: 'envios',
      tagLabel: '⚡ Servicio Express',
      icon: '⚡',
      q: '¿Con cuánto tiempo de anticipación debo hacer mi pedido?',
      a: 'El tiempo de elaboración y despacho estándar normal es de 72 horas (3 días). Si necesitas tu entrega de emergencia para hoy mismo, contamos con Servicio Express especial con entrega en el día.',
    },
    {
      id: 4,
      tag: 'cuidado',
      tagLabel: '💧 Cuidado & Conservación',
      icon: '💧',
      q: '¿Requieren agua o algún cuidado de conservación especial?',
      a: '¡No requieren agua, luz solar ni poda! Nuestras esculturas de limpiapipas se conservan intactas año tras año sin marchitarse ni perder su color brillante. Basta con retirar el polvo ocasionalmente con un plumero suave.',
    },
    {
      id: 5,
      tag: 'pagos',
      tagLabel: '💳 Pagos & Coordinación',
      icon: '💳',
      q: '¿Cómo se realiza la coordinación y el pago?',
      a: 'Una vez seleccionadas tus flores en el carrito o cotización, la orden se sincroniza directamente a nuestro chat oficial de WhatsApp (+56928704768). Allí coordinamos la dirección y el medio de pago (Transferencia bancaria, MercadoPago o Webpay).',
    },
  ];

  const TAG_FILTERS = [
    { id: 'todos', label: 'Todas las Dudas', icon: '✨' },
    { id: 'materiales', label: 'Materiales 🌸', icon: '🌺' },
    { id: 'envios', label: 'Envíos & Tiempos 📦', icon: '🚚' },
    { id: 'cuidado', label: 'Cuidado & Agua 💧', icon: '🌿' },
    { id: 'pagos', label: 'Pagos 💳', icon: '💵' },
  ];

  const filteredFaqs = FAQS.filter(
    (faq) => selectedTag === 'todos' || faq.tag === selectedTag
  );

  const handleSendContactModal = (e: React.FormEvent) => {
    e.preventDefault();
    const nameStr = contactName.trim() || 'Cliente IsaFlores';
    const phoneStr = contactPhone.trim() ? ` (%2B56${contactPhone.replace(/\D/g, '')})` : '';
    const subjectStr = contactSubject;
    const msgStr = contactMessage.trim() ? `%0A*Mensaje:* ${encodeURIComponent(contactMessage)}` : '';

    const text = `Hola%20IsaFlores%2C%20soy%20*${encodeURIComponent(nameStr)}*${phoneStr}.%0A*Asunto:* ${encodeURIComponent(subjectStr)}${msgStr}`;
    window.open(`https://wa.me/56928704768?text=${text}`, '_blank');
    setIsContactModalOpen(false);
  };

  return (
    <section className="py-14 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] border-t border-pink-200/70 text-[#2B051C]" id="preguntas">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#f70071]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Información & Consultas Frecuentes</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-5xl font-black text-[#2B051C]">
            Preguntas Frecuentes sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#8E24AA]">IsaFlores</span>
          </h2>
          <p className="text-xs sm:text-base text-gray-600 font-medium max-w-xl mx-auto">
            Resolvemos tus inquietudes principales sobre materiales, despacho gratis, medios de pago y conservación.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {TAG_FILTERS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedTag === tag.id
                  ? 'bg-[#2B051C] text-white border-[#2B051C] shadow-md ring-2 ring-[#f70071]'
                  : 'bg-white text-gray-700 border-pink-100 hover:bg-pink-50'
              }`}
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#f70071] shadow-xl ring-2 ring-[#f70071]/20'
                    : 'border-pink-100/90 shadow-sm hover:border-pink-300 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 font-syne font-black text-sm sm:text-base text-[#2B051C] flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="w-9 h-9 rounded-2xl bg-[#FDF0F5] text-[#f70071] flex items-center justify-center text-lg font-bold shrink-0 border border-pink-200 group-hover:scale-110 transition-transform">
                      {faq.icon}
                    </span>
                    <span className="group-hover:text-[#f70071] transition-colors leading-snug">
                      {faq.q}
                    </span>
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-[#f70071] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#f70071]' : 'text-gray-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-pink-100 bg-[#FDF0F5]/50 font-medium space-y-3">
                    <p>{faq.a}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#f70071] font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Garantía de Satisfacción IsaFlores</span>
                      </span>
                      <span className="bg-white px-2.5 py-0.5 rounded-full border border-pink-200 text-gray-500">
                        {faq.tagLabel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DIRECT CONTACT BANNER WITH POPUP BUTTON */}
        <div className="bg-gradient-to-r from-[#2B051C] via-[#4A0033] to-[#2B051C] rounded-3xl p-6 sm:p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-white/20 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5] block">
              ¿No encontraste lo que buscabas?
            </span>
            <h3 className="font-syne font-black text-xl sm:text-2xl text-white">
              Habla directamente con nuestro Taller
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Resolvemos tus preguntas de cotización, envío o encargos urgentes en tiempo real.
            </p>
          </div>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="z-10 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-black text-xs uppercase tracking-widest px-7 py-4 rounded-full shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-white/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contacto Directo / Abrir Consulta</span>
          </button>
        </div>

      </div>

      {/* POPUP MODAL DE CONTACTO DIRECTO */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-pink-200 relative text-left space-y-5 animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#128C7E] px-3 py-0.5 rounded-full text-[10px] font-black uppercase">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Atención Inmediata por WhatsApp</span>
              </div>
              <h3 className="font-syne font-black text-xl text-[#2B051C]">
                Contacto Directo IsaFlores
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Completa tus datos o duda para abrir un chat directo con nuestro taller:
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendContactModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#2B051C] block mb-1">
                  Tu Nombre o Apodo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Constanza Silva"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-bold outline-none focus:border-[#f70071] focus:ring-2 focus:ring-[#f70071]/20 bg-pink-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B051C] block mb-1">
                  Tu Celular / WhatsApp:
                </label>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-600 border border-gray-200">
                    +56 9
                  </span>
                  <input
                    type="tel"
                    placeholder="12345678"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-bold outline-none focus:border-[#f70071] focus:ring-2 focus:ring-[#f70071]/20 bg-pink-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B051C] block mb-1">
                  Motivo de la Consulta:
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-bold outline-none focus:border-[#f70071] focus:ring-2 focus:ring-[#f70071]/20 bg-pink-50/50"
                >
                  <option value="Cotización Personalizada">🌸 Cotización de Ramo Personalizado</option>
                  <option value="Consulta sobre Envíos">📦 Consultas de Envío y Fechas</option>
                  <option value="Pedido Urgente Express">⚡ Pedido Urgente Express (Hoy Mismo)</option>
                  <option value="Consulta General">💬 Otra Consulta</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B051C] block mb-1">
                  Mensaje o Detalles Adicionales:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Hola, quiero regalar un ramo de girasoles y rosas amarillas para este viernes..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-bold outline-none focus:border-[#f70071] focus:ring-2 focus:ring-[#f70071]/20 bg-pink-50/50 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensaje a IsaFlores</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
