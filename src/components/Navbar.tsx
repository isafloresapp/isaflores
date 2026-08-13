import React from 'react';
import { ShoppingBag, Heart, Search, MapPin, ChevronDown, Clock, PackageSearch, Sparkles, Snowflake } from 'lucide-react';

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
  { id: 'todos', label: 'Todas las Flores', icon: '❄️' },
  { id: 'flores-temporada', label: 'Flores Temporada', icon: '🌺' },
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
    <header className="sticky top-0 z-40 bg-white border-b border-cyan-100 shadow-xs">
      {/* Winter Delivery Address Top Header Bar */}
      <div className="bg-gradient-to-r from-[#00838F] via-[#0288D1] to-[#1A237E] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-bold">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-90">
            <Snowflake className="w-4 h-4 text-[#E0F7FA] animate-spin-slow" />
            <MapPin className="w-4 h-4 fill-white text-[#00838F]" />
            <span className="text-[#E0F7FA] font-medium">Entregar en:</span>
            <span className="font-extrabold underline decoration-white underline-offset-2">
              La Florida, Región Metropolitana
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white" />
            <span className="bg-[#00695C] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-1 hidden sm:inline-block">
              ❄️ Despacho Gratis
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOrderTracking}
              className="bg-white/20 hover:bg-white text-white hover:text-[#00838F] px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer text-[11px] font-black"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Estado Pedido</span>
            </button>
            <div className="hidden md:flex items-center gap-1 text-[11px] font-extrabold text-[#E0F7FA]">
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
            className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-full border border-[#f70071]/15 group-hover:scale-105 transition-transform"
          />
        </a>

        {/* Winter Search Input */}
        <div className="flex-1 max-w-xl flex items-center bg-[#F4F8FA] border border-cyan-200 rounded-full px-4 py-2 focus-within:border-[#0288D1] focus-within:bg-white transition-all shadow-inner">
          <Search className="w-4 h-4 text-[#0288D1] shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué ramo o flor invernal buscas hoy?..."
            className="w-full text-xs sm:text-sm bg-transparent outline-none text-[#1A237E] placeholder-cyan-900/50 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#C2185B] font-black px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCustomBuilder}
            className="hidden sm:flex items-center gap-1.5 bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#00838F] px-3.5 py-2 rounded-full font-black text-xs transition-all cursor-pointer shadow-xs border border-cyan-200"
          >
            <Sparkles className="w-4 h-4 text-[#00838F]" />
            <span>Diseña tu Ramo</span>
          </button>

          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#1A237E] hover:text-[#C2185B] transition-colors rounded-full hover:bg-cyan-50 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C2185B] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="relative bg-gradient-to-r from-[#00838F] to-[#0288D1] hover:from-[#00695C] hover:to-[#01579B] text-white px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#00838F] font-extrabold text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Winter Category Filter Chips Row */}
      <div className="bg-[#E0F7FA]/40 border-t border-cyan-100 py-2 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#00838F] text-white border-[#00838F] shadow-sm'
                    : 'bg-white text-[#1A237E] border-cyan-200 hover:border-[#0288D1] hover:bg-cyan-50'
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
