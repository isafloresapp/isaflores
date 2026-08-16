import React from 'react';
import { Sparkles, ArrowRight, Zap, Gift, ShieldCheck, Flame, Bike, Clock, Award, Snowflake, Heart, Wand2, Truck } from 'lucide-react';
import heroArtImg from '../assets/images/hero_art.jpg';

interface HeroFullscreenProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroFullscreen: React.FC<HeroFullscreenProps> = ({
  onOpenCustomBuilder,
  onExploreCatalog,
  onSelectCategory,
}) => {
  return (
    <section className="bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-white py-6 border-b border-pink-200/70 text-[#2B051C]">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-6">
        
        {/* Winter Promo Hero Card Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B051C] via-[#4A0033] to-[#2B051C] text-white p-6 sm:p-10 shadow-2xl border-2 border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#ff96c5] border border-white/20">
              <Sparkles className="w-4 h-4 text-[#ff5aa4]" />
              <span>Flores Eternas de Autor · Santiago</span>
            </div>

            <h1 className="font-syne font-black text-3xl sm:text-5xl leading-tight tracking-tight text-white">
              Flores Hechas a Mano <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff96c5] via-[#ff1b82] to-[#f70071]">
                Recuerdos Inolvidables
              </span>
            </h1>

            <p className="text-xs sm:text-base font-semibold text-white/90 leading-relaxed">
              Moldeadas a mano con hilado afelpado de chenille de alta densidad. ¡Despacho <strong>GRATIS en La Florida</strong> y envíos a todo Chile!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExploreCatalog}
                className="bg-gradient-to-r from-[#f70071] to-[#ff1b82] hover:from-[#ff1b82] hover:to-[#f70071] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-xl transition-all cursor-pointer transform hover:scale-105 flex items-center gap-2 border border-white/30"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCustomBuilder}
                className="bg-white/15 hover:bg-white/25 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/30 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md"
              >
                <Wand2 className="w-4 h-4 text-[#ff96c5]" />
                <span>Diseña tu Ramo Taller</span>
              </button>
            </div>
          </div>

          {/* Banner Promo Graphic Frame */}
          <div className="relative shrink-0 w-full md:w-80 h-52 sm:h-64 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl group">
            <img
              src={heroArtImg}
              alt="IsaFlores Arte en Limpiapipas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="bg-[#25D366] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg border border-white/30 flex items-center gap-1">
                <span>🎉 Despacho GRATIS La Florida</span>
              </span>
            </div>
          </div>
        </div>

        {/* REPLACED: MODERN INTERACTIVE QUICK EXPERIENCE HUB (Reemplaza los círculos repetidos) */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-md space-y-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-pink-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FDF0F5] text-[#f70071] flex items-center justify-center font-bold text-base border border-pink-200">
                ⚡
              </span>
              <h3 className="font-syne font-black text-base sm:text-lg text-[#2B051C]">
                Experiencia Rápida: ¿Qué Ocasión Deseas Celebrar?
              </h3>
            </div>
            <span className="text-[11px] font-extrabold text-[#f70071]">
              Selecciona para filtrar tu catálogo al instante 🌸
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            <button
              onClick={() => {
                onSelectCategory('ramos');
                onExploreCatalog();
              }}
              className="bg-gradient-to-br from-pink-50 to-white hover:from-pink-100 hover:to-pink-50 p-3 rounded-2xl border border-pink-200 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white text-pink-500 font-bold text-lg flex items-center justify-center shadow-xs border border-pink-200 shrink-0 group-hover:scale-110 transition-transform">
                💖
              </span>
              <div>
                <span className="font-syne font-black text-xs text-[#2B051C] block group-hover:text-[#f70071]">
                  Aniversarios & Amor
                </span>
                <span className="text-[9px] text-gray-500 font-semibold block">Ramos Románticos</span>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectCategory('girasoles');
                onExploreCatalog();
              }}
              className="bg-gradient-to-br from-amber-50 to-white hover:from-amber-100 hover:to-amber-50 p-3 rounded-2xl border border-amber-200 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white text-amber-500 font-bold text-lg flex items-center justify-center shadow-xs border border-amber-200 shrink-0 group-hover:scale-110 transition-transform">
                🌻
              </span>
              <div>
                <span className="font-syne font-black text-xs text-[#2B051C] block group-hover:text-amber-600">
                  Girasoles Silvestres
                </span>
                <span className="text-[9px] text-gray-500 font-semibold block">Alegría & Brillo</span>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectCategory('bodas');
                onExploreCatalog();
              }}
              className="bg-gradient-to-br from-purple-50 to-white hover:from-purple-100 hover:to-purple-50 p-3 rounded-2xl border border-purple-200 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white text-purple-500 font-bold text-lg flex items-center justify-center shadow-xs border border-purple-200 shrink-0 group-hover:scale-110 transition-transform">
                💍
              </span>
              <div>
                <span className="font-syne font-black text-xs text-[#2B051C] block group-hover:text-purple-600">
                  Bodas & Novias
                </span>
                <span className="text-[9px] text-gray-500 font-semibold block">Bouquets Nupciales</span>
              </div>
            </button>

            <button
              onClick={onOpenCustomBuilder}
              className="bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100 hover:to-emerald-50 p-3 rounded-2xl border border-emerald-200 transition-all text-left group cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white text-emerald-600 font-bold text-lg flex items-center justify-center shadow-xs border border-emerald-200 shrink-0 group-hover:scale-110 transition-transform">
                🎨
              </span>
              <div>
                <span className="font-syne font-black text-xs text-[#2B051C] block group-hover:text-emerald-600">
                  Diseñar a Medida
                </span>
                <span className="text-[9px] text-gray-500 font-semibold block">Personalización 1 a 1</span>
              </div>
            </button>
          </div>
        </div>

        {/* TRUST BADGES STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-xs">
            <Bike className="w-5 h-5 text-[#f70071] shrink-0" />
            <div className="text-left">
              <span className="font-syne font-black text-xs block text-[#2B051C]">Envío Gratis La Florida</span>
              <span className="text-[9px] text-gray-500 font-bold">$0 en tu comuna</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-xs">
            <Clock className="w-5 h-5 text-[#f70071] shrink-0" />
            <div className="text-left">
              <span className="font-syne font-black text-xs block text-[#2B051C]">Elaboración 72h</span>
              <span className="text-[9px] text-gray-500 font-bold">Opción Express Hoy</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-xs">
            <Award className="w-5 h-5 text-[#f70071] shrink-0" />
            <div className="text-left">
              <span className="font-syne font-black text-xs block text-[#2B051C]">100% Hecho a Mano</span>
              <span className="text-[9px] text-gray-500 font-bold">No marchitan jamás</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-xs">
            <Zap className="w-5 h-5 text-[#25D366] shrink-0" />
            <div className="text-left">
              <span className="font-syne font-black text-xs block text-[#2B051C]">Cotización WhatsApp</span>
              <span className="text-[9px] text-gray-500 font-bold">Atención directa</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
