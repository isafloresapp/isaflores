import React from 'react';
import { X, Heart, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-[#FBF3E7] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#F5E9D9] text-left">
        {/* Drawer Header */}
        <div className="p-5 bg-[#2D1E29] text-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#C05C6D] fill-[#C05C6D]" />
            <h2 className="font-serif font-bold text-lg">flores Favoritas Guardadas</h2>
            <span className="text-xs bg-[#C05C6D] text-white px-2.5 py-0.5 rounded-full font-semibold">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-3 rounded-2xl border border-[#E8DFD1] flex items-center gap-3 shadow-2xs"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl shrink-0"
                  style={{ backgroundColor: product.bgTint }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-sm text-[#2D1E29] truncate">
                    {product.name}
                  </h4>
                  <span className="text-xs text-[#C05C6D] font-semibold block">
                    ${product.price.toLocaleString('es-CL')} CLP
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-8 h-8 rounded-full bg-[#2D1E29] text-white flex items-center justify-center hover:bg-[#5E4657] transition-all cursor-pointer"
                    title="Añadir a la bolsa"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="w-8 h-8 rounded-full bg-[#F3ECE1] text-[#C05C6D] flex items-center justify-center hover:bg-[#C05C6D] hover:text-white transition-all cursor-pointer"
                    title="Quitar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-4">
              <span className="text-4xl block">🤍</span>
              <h3 className="font-serif font-bold text-lg text-[#2D1E29]">
                Sin ramos de flores guardadas
              </h3>
              <p className="text-xs text-[#5E4657] max-w-xs mx-auto">
                Seleccione el icono de corazón en cualquier pieza para conservarla en su lista personal.
              </p>
              <button
                onClick={onClose}
                className="bg-[#2D1E29] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#5E4657] transition-all cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
