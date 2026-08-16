import React from 'react';
import { Star, CheckCircle2, Heart, Sparkles, MessageCircle, MapPin, Package, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const REVIEWS_DATA = [
    {
      id: 'rev-1',
      author: 'Camila Rojas',
      location: 'La Florida, Santiago',
      rating: 5,
      date: 'Hace 2 días',
      productName: 'Ramo Girasoles & Rosas',
      avatarBg: 'bg-pink-100 text-[#f70071]',
      comment: 'Se lo regalé a mi mamá para su cumpleaños y quedó fascinada. Las flores se ven hermosas en el living y no se marchitan jamás. ¡Super recomendable el despacho gratis en La Florida!',
      verified: true,
      tag: '🎉 Despacho Gratis'
    },
    {
      id: 'rev-2',
      author: 'Ignacio Fuentes',
      location: 'Providencia, Santiago',
      rating: 5,
      date: 'Hace 4 días',
      productName: 'Ramo Coral Eterno',
      avatarBg: 'bg-emerald-100 text-[#128C7E]',
      comment: 'Llegó impecable en su caja reforzada y con la tarjeta redactada con caligrafía manual. Mi polola lo amó para nuestro aniversario. ¡Atención de 10 por WhatsApp!',
      verified: true,
      tag: '💖 Aniversario'
    },
    {
      id: 'rev-3',
      author: 'Francisca Morales',
      location: 'Viña del Mar',
      rating: 5,
      date: 'Hace 1 semana',
      productName: 'Kit DIY Armar Flores',
      avatarBg: 'bg-[#FDF0F5] text-[#8E24AA]',
      comment: 'Me preocupaba el envío por Starken a región pero llegó perfecto en 48 horas. El trabajo en limpiapipas de alta densidad es hermoso y muy fácil de mantener.',
      verified: true,
      tag: '📦 Envío Regiones'
    },
    {
      id: 'rev-4',
      author: 'Javier Silva',
      location: 'Concepción',
      rating: 5,
      date: 'Hace 2 semanas',
      productName: 'Tulipanes Holandeses',
      avatarBg: 'bg-[#FFF8E1] text-[#D97706]',
      comment: 'Compré el ramo de tulipanes fucsia. El color es súper vivo y la textura afelpada se siente genial al tacto. Se ve como una escultura botánica de tienda de lujo.',
      verified: true,
      tag: '🌷 Tulipanes'
    },
  ];

  return (
    <section className="py-8 sm:py-14 bg-gradient-to-b from-[#FFFDFE] via-[#FDF0F5] to-white border-t border-pink-200/70 text-[#2B051C]" id="testimonios">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 text-center space-y-6 sm:space-y-10">
        
        {/* SECTION HEADER */}
        <div className="space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-3.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-[#f70071]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experiencias IsaFlores · Opiniones Reales</span>
          </div>
          <h2 className="font-syne text-xl sm:text-4xl font-black text-[#2B051C]">
            Lo Que Dicen Quienes Ya Regalaron <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#8E24AA]">IsaFlores</span>
          </h2>
        </div>

        {/* REALISTIC & SIMPLE METRICS BAR */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-pink-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start px-2 py-1">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-sm sm:text-lg border border-amber-200 shrink-0">
              ⭐
            </span>
            <div className="text-left">
              <span className="font-syne font-black text-xs sm:text-lg text-[#2B051C] block leading-none">
                4.9 / 5.0
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block truncate">
                Valoración Clientes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 justify-center sm:justify-start px-2 py-1">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-pink-50 text-[#f70071] flex items-center justify-center font-black text-sm sm:text-lg border border-pink-200 shrink-0">
              📦
            </span>
            <div className="text-left">
              <span className="font-syne font-black text-xs sm:text-lg text-[#2B051C] block leading-none">
                +1.200 Ramos
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block truncate">
                Entregados en Chile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 justify-center sm:justify-start px-2 py-1">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-[#128C7E] flex items-center justify-center font-black text-sm sm:text-lg border border-emerald-200 shrink-0">
              🎉
            </span>
            <div className="text-left">
              <span className="font-syne font-black text-xs sm:text-lg text-[#2B051C] block leading-none">
                100% Gratis
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block truncate">
                En La Florida
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 justify-center sm:justify-start px-2 py-1">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-50 text-[#8E24AA] flex items-center justify-center font-black text-sm sm:text-lg border border-purple-200 shrink-0">
              💬
            </span>
            <div className="text-left">
              <span className="font-syne font-black text-xs sm:text-lg text-[#2B051C] block leading-none">
                WhatsApp
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block truncate">
                Atención Directa
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Mobile Grid / 4-Column Desktop Grid for Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-pink-100/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#8E24AA]" />

              <div className="space-y-2 pt-1">
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#F4C24C] text-[#F4C24C]"
                      />
                    ))}
                  </div>

                  <span className="text-[9px] text-gray-400 font-extrabold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {rev.date}
                  </span>
                </div>

                {/* Comment Paragraph */}
                <p className="text-xs text-[#2B051C] leading-relaxed font-semibold line-clamp-4 sm:line-clamp-none">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product Footer */}
              <div className="pt-2 border-t border-pink-100 flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full ${rev.avatarBg} font-black text-xs flex items-center justify-center shadow-xs shrink-0`}>
                      {rev.author.substring(0, 1)}
                    </span>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1 font-syne font-black text-xs text-[#2B051C]">
                        <span className="truncate">{rev.author}</span>
                        <CheckCircle2 className="w-3 h-3 text-[#25D366] shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold truncate">
                        <MapPin className="w-2.5 h-2.5 text-[#f70071] shrink-0" />
                        <span>{rev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-[#FDF0F5] text-[#f70071] px-2 py-0.5 rounded-full border border-pink-200 truncate max-w-full">
                    {rev.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE ACTION BUTTON */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20quisiera%20recibir%20asesoria%20para%20un%20ramo"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-black text-[11px] sm:text-xs uppercase tracking-widest px-6 py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
