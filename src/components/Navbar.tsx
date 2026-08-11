import React from 'react';
import { ShoppingBag, Heart, Search, MapPin, ChevronDown, Clock, PackageSearch, Sparkles } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCustomBuilder: () => void;
  onOpenOrderTracking: () => void;
}

const CATEGORIES_LIST = [
  { id: 'todos', label: 'Todas las Flores', icon: '🌸' },
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍' },
  { id: 'eventos', label: 'Eventos', icon: '✨' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨' },
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCustomBuilder,
  onOpenOrderTracking,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Delivery Address Top Header Bar */}
      <div className="bg-[#EA2840] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-bold">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-90">
            <MapPin className="w-4 h-4 fill-white text-[#EA2840]" />
            <span className="text-[#FFEAEA] font-medium">Entregar en:</span>
            <span className="font-extrabold underline decoration-white underline-offset-2">
              La Florida, Región Metropolitana
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white" />
            <span className="bg-[#00A859] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-1 hidden sm:inline-block">
              🎉 Envío GRATIS
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOrderTracking}
              className="bg-white/20 hover:bg-white text-white hover:text-[#EA2840] px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer text-[11px] font-black"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Estado Pedido</span>
            </button>
            <div className="hidden md:flex items-center gap-1 text-[11px] font-extrabold text-[#FFEAEA]">
              <Clock className="w-3.5 h-3.5" />
              <span>72h / 🚀 Express Hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Header Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <img
            src="/logo.png"
            alt="IsaFlores. Recuerdos que perduran."
            className="h-14 sm:h-16 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
          />
        </a>

        {/* Search Input */}
        <div className="flex-1 max-w-xl flex items-center bg-[#F7F7F8] border border-gray-300 rounded-full px-4 py-2 focus-within:border-[#EA2840] focus-within:bg-white transition-all shadow-inner">
          <Search className="w-4 h-4 text-[#EA2840] shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué flor o ramo buscas hoy en La Florida?..."
            className="w-full text-xs sm:text-sm bg-transparent outline-none text-[#1A1A1A] placeholder-gray-400 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#EA2840] font-black px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Custom Studio CTA Button */}
          <button
            onClick={onOpenCustomBuilder}
            className="hidden lg:flex items-center gap-1.5 bg-[#EA2840] hover:bg-[#D01E35] text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Diseña tu Ramo</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative w-9 h-9 rounded-full bg-[#F7F7F8] border border-gray-200 flex items-center justify-center text-[#EA2840] hover:bg-[#EA2840] hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Favoritos"
          >
            <Heart className="w-4.5 h-4.5 fill-current" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EA2840] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative bg-[#EA2840] hover:bg-[#D01E35] text-white font-black text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-md cursor-pointer transition-all transform hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Pedido</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#EA2840] font-extrabold text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Integrated Row (Prevents vertical clipping) */}
      <div className="border-t border-gray-100 bg-[#F7F7F8]/80 backdrop-blur-md py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById('productos');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EA2840] text-white shadow-xs'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
