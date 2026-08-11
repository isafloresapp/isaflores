import React from 'react';
import { Sparkles, ArrowRight, Zap, Gift, ShieldCheck, Flame, Bike, Clock, Award } from 'lucide-react';

interface HeroFullscreenProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
  onSelectCategory: (cat: string) => void;
}

const CATEGORY_BUBBLES = [
  { id: 'todos', label: 'Ver Todo', icon: '🌸', color: 'bg-red-50 border-red-200' },
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐', color: 'bg-pink-50 border-pink-200' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍', color: 'bg-purple-50 border-purple-200' },
  { id: 'regalos', label: 'Regalos', icon: '🎁', color: 'bg-red-50 border-red-200' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨', color: 'bg-green-50 border-green-200' },
];

export const HeroFullscreen: React.FC<HeroFullscreenProps> = ({
  onOpenCustomBuilder,
  onExploreCatalog,
  onSelectCategory,
}) => {
  return (
    <section className="bg-white py-6 border-b border-gray-200 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        
        {/* Promo Hero Card Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#EA2840] via-[#F73859] to-[#FF526C] text-white p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white">
              <Flame className="w-4 h-4 fill-white text-white animate-pulse" />
              <span>Tienda Oficial IsaFlores APP</span>
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight">
              Pide tus Flores Eternas <br className="hidden sm:inline" />
              <span className="text-[#FFC107]">y Recibe con Amor</span>
            </h1>

            <p className="text-sm sm:text-base font-semibold text-[#FFEAEA] leading-relaxed">
              Elaboradas a mano en Chile con limpiapipas y goma EVA. ¡Despacho <strong>GRATIS en La Florida</strong> y envíos a todo Chile!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="bg-white hover:bg-[#FFEAEA] text-[#EA2840] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer transform hover:scale-105 flex items-center gap-2"
              >
                <span>Pedir Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCustomBuilder}
                className="bg-black/30 hover:bg-black/50 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFC107]" />
                <span>Arma tu Ramo</span>
              </button>
            </div>
          </div>

          {/* Banner Promo Side Graphics */}
          <div className="relative shrink-0 w-full md:w-72 h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800"
              alt="Flores IsaFlores"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="bg-[#00A859] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                🚀 Entrega HOY con Express
              </span>
            </div>
          </div>
        </div>

        {/* Circular Category Avatars Row */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-[#1A1A1A]">Categorías de Flores</h3>
            <span className="text-xs font-bold text-[#EA2840]">Selecciona para explorar</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {CATEGORY_BUBBLES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onExploreCatalog();
                }}
                className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border ${cat.color} flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-extrabold text-[#1A1A1A] group-hover:text-[#EA2840] transition-colors">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-gray-200 flex items-center gap-3">
            <Bike className="w-6 h-6 text-[#EA2840] shrink-0" />
            <div className="text-left">
              <span className="font-black text-xs block text-[#1A1A1A]">Envío Gratis La Florida</span>
              <span className="text-[10px] text-gray-500 font-semibold">$0 en tu comuna</span>
            </div>
          </div>

          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-gray-200 flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#EA2840] shrink-0" />
            <div className="text-left">
              <span className="font-black text-xs block text-[#1A1A1A]">Elaboración 72 Horas</span>
              <span className="text-[10px] text-gray-500 font-semibold">Opción Express Hoy</span>
            </div>
          </div>

          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-gray-200 flex items-center gap-3">
            <Award className="w-6 h-6 text-[#EA2840] shrink-0" />
            <div className="text-left">
              <span className="font-black text-xs block text-[#1A1A1A]">100% Hecho a Mano</span>
              <span className="text-[10px] text-gray-500 font-semibold">No marchitan jamás</span>
            </div>
          </div>

          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-gray-200 flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#00A859] shrink-0" />
            <div className="text-left">
              <span className="font-black text-xs block text-[#1A1A1A]">Cotización WhatsApp</span>
              <span className="text-[10px] text-gray-500 font-semibold">Atención directa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
