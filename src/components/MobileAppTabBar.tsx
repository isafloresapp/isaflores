import React from 'react';
import { Home, Search, ShoppingBag, Heart, Sparkles, PackageSearch } from 'lucide-react';

interface MobileAppTabBarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCustomBuilder: () => void;
  onScrollToTop: () => void;
  onScrollToCatalog: () => void;
}

export const MobileAppTabBar: React.FC<MobileAppTabBarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCustomBuilder,
  onScrollToTop,
  onScrollToCatalog,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {/* Home */}
        <button
          onClick={onScrollToTop}
          className="flex flex-col items-center gap-1 text-[#EA2840] font-black text-[10px] cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        {/* Catalog Search */}
        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#EA2840] font-bold text-[10px] cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>Catálogo</span>
        </button>

        {/* Custom Bouquet Studio Highlighted Circle */}
        <button
          onClick={onOpenCustomBuilder}
          className="flex flex-col items-center -mt-5 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#EA2840] text-white flex items-center justify-center shadow-lg border-2 border-white transform active:scale-95">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black text-[#EA2840] uppercase mt-0.5">Diseñar</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#EA2840] font-bold text-[10px] cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          <span>Favoritos</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#EA2840] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart / Pedidos */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 text-gray-500 hover:text-[#EA2840] font-bold text-[10px] cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Mi Pedido</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#EA2840] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
