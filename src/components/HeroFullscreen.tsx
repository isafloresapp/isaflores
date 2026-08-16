import React from 'react';
import { Sparkles, ArrowRight, Zap, Gift, ShieldCheck, Flame, Bike, Clock, Award, Snowflake, Heart, Wand2, Truck, MessageCircle, Star, CheckCircle2 } from 'lucide-react';
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
        
        {/* LA CARA DEL SITIO: ULTRA-VIBRANTE, INTERACTIVA & LLAMATIVA PORTADA */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B051C] via-[#5C0638] to-[#1F0214] text-white p-6 sm:p-10 shadow-2xl border-2 border-[#f70071]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#f70071]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ff1b82]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="space-y-4 max-w-xl text-left z-10">
            
            {/* Live Trust & Promo Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#f70071]/30 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#ffc0dc] border border-[#f70071]/50 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#ff5aa4] animate-spin" />
                <span>Arte Floral Perenne · Santiago</span>
              </div>

              <div className="inline-flex items-center gap-1 bg-[#25D366]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#A7F3D0] border border-[#25D366]/40 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-[#25D366]" />
                <span>🎉 Despacho GRATIS La Florida</span>
              </div>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="font-syne font-black text-3xl sm:text-5xl lg:text-6xl leading-tight tracking-tight text-white drop-shadow-xl">
              Flores Eternas <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff96c5] via-[#ff5aa4] to-amber-300">
                Que No Marchitan Jamás
              </span>
            </h1>

            {/* SUBTITLE DESCRIPTION */}
            <p className="text-xs sm:text-base font-semibold text-white/95 leading-relaxed drop-shadow-md">
              Moldeadas individualmente a mano con hilado afelpado de chenille de alta densidad y alambre botánico flexible. ¡Recuerdos únicos hechos en Santiago con envío seguro a todo Chile!
            </p>

            {/* HIGH-IMPACT ATTENTION-GRABBING BUTTONS (LLAMADAS DE ATENCIÓN INTERACTIVAS) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* PRIMARY HIGH-GLOW ACTION BUTTON */}
              <button
                onClick={onExploreCatalog}
                className="bg-gradient-to-r from-[#f70071] via-[#ff1b82] to-[#ff5aa4] hover:from-[#ff1b82] hover:to-[#f70071] text-white font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-2xl shadow-[#f70071]/50 transition-all cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-white/40 ring-4 ring-[#f70071]/40"
              >
                <Heart className="w-4 h-4 fill-current text-white animate-bounce" />
                <span>Explorar Catálogo & Ofertas</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* SECONDARY INTERACTIVE CUSTOM BUILDER BUTTON */}
              <button
                onClick={onOpenCustomBuilder}
                className="bg-white/15 hover:bg-white/25 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full border border-white/30 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md transform hover:scale-105 active:scale-95 shadow-md"
              >
                <Wand2 className="w-4 h-4 text-[#ff96c5]" />
                <span>Diseñar Mi Ramo a Medida</span>
              </button>

              {/* TERTIARY WHATSAPP BUTTON */}
              <a
                href="https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20quisiera%20recibir%20asesoria%20directa%20para%20un%20ramo"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white font-black text-xs uppercase tracking-wider px-5 py-4 rounded-full border border-[#25D366]/40 transition-all cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Directo</span>
              </a>
            </div>

            {/* LIVE RATING & COMPACT METRICS */}
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-white/90">
              <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/15">
                <Star className="w-3.5 h-3.5 fill-[#F4C24C] text-[#F4C24C]" />
                <span>4.9/5.0 (+1.200 Ramos Entregados)</span>
              </div>
            </div>

          </div>

          {/* Right Banner Frame with Interactive Zoom Photo */}
          <div className="relative shrink-0 w-full md:w-80 h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl group z-10">
            <img
              src={heroArtImg}
              alt="IsaFlores Arte en Limpiapipas"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
              <div className="space-y-1 text-left">
                <span className="bg-[#f70071] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                  ✨ Confección 100% Artesanal
                </span>
                <span className="text-[10px] text-white/90 font-bold block">
                  Flores perennes hechas en La Florida, Santiago.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK INTERACTIVE EXPERIENCE HUB */}
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
