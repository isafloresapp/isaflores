import React from 'react';
import { Sparkles, MessageCircle, Heart, ShieldCheck, Truck, Star } from 'lucide-react';
import heroBouquetImg from '../assets/images/hero_pipe_cleaner_bouquet_1786069749958.jpg';

interface HeroProps {
  onOpenCustomBuilder: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomBuilder, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-radial from-[#FDEFDD] via-[#FBF3E7] to-[#FBF3E7] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4F6B41] shadow-xs border border-[#F5E9D9]">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E8637D]" />
              <span className="w-2 h-2 rounded-full bg-[#F4C24C]" />
              <span className="w-2 h-2 rounded-full bg-[#6F8F5B]" />
            </div>
            <span>Arte Floral Hecho a Mano</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2233] leading-tight">
            Ramos de <span className="italic text-[#E8637D] font-medium">limpiapipas</span>,<br className="hidden sm:inline" />
            flores eternas llenas de amor
          </h1>

          <p className="text-base sm:text-lg text-[#6B4A5C] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            En IsaFlores creamos arreglos artesanales únicos con limpiapipas afelpados:
            coloridos, duraderos y sin marchitarse nunca. Elige tu modelo listo o personaliza tu ramo paso a paso y pide directo por WhatsApp.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onExploreCatalog}
              className="bg-[#E8637D] hover:bg-[#C94764] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Ver Catálogo Completo
            </button>

            <button
              onClick={onOpenCustomBuilder}
              className="bg-[#F4C24C]/25 hover:bg-[#F4C24C]/40 text-[#3D2233] border border-[#F4C24C]/60 font-bold text-sm px-5 py-3.5 rounded-full flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-[#E8637D]" />
              <span>Diseñar Ramo Custom</span>
            </button>

            <a
              href="https://wa.me/56912345678?text=Hola%20IsaFlores%2C%20quiero%20cotizar%20un%20ramo%20especial"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-sm px-5 py-3.5 rounded-full flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir por WhatsApp</span>
            </a>
          </div>

          {/* Social Proof & Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3D2233]/10 max-w-lg mx-auto lg:mx-0 text-left">
            <div>
              <strong className="font-serif text-2xl font-bold text-[#3D2233] block">
                +1.200
              </strong>
              <span className="text-xs text-[#6B4A5C] font-semibold">Ramos Entregados</span>
            </div>
            <div>
              <strong className="font-serif text-2xl font-bold text-[#3D2233] block">
                100%
              </strong>
              <span className="text-xs text-[#6B4A5C] font-semibold">Hecho a Mano</span>
            </div>
            <div>
              <strong className="font-serif text-2xl font-bold text-[#3D2233] flex items-center gap-1">
                4.9 <Star className="w-4 h-4 fill-[#F4C24C] text-[#F4C24C]" />
              </strong>
              <span className="text-xs text-[#6B4A5C] font-semibold">Calificación Real</span>
            </div>
          </div>
        </div>

        {/* Right Product Showcase Banner */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative max-w-md w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
            <img
              src={heroBouquetImg}
              alt="Ramo de flores hechas a mano con limpiapipas - IsaFlores"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2233]/60 via-transparent to-transparent" />

            {/* Floating Tags */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#3D2233] shadow-sm flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#E8637D] text-[#E8637D]" />
              <span>Flores Eternas</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#F5E9D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#4F6B41] font-bold block">
                  Top Ventas IsaFlores
                </span>
                <span className="font-serif font-bold text-sm text-[#3D2233]">
                  Ramo Coral & Mostaza
                </span>
              </div>
              <span className="font-serif font-bold text-base text-[#E8637D]">
                $14.990 <span className="text-[10px] text-[#6B4A5C]">CLP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
