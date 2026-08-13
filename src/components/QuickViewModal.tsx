import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Truck, Heart, Zap, CheckCircle2, Sparkles, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const productImage = product.image || (product as any).images?.[0] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

  const whatsappUrl = `https://wa.me/56928704768?text=${encodeURIComponent(
    `Hola IsaFlores 🌸, quiero comprar ${quantity}x ${product.name} ($${(
      product.price * quantity
    ).toLocaleString('es-CL')} CLP). ¿Tienen disponibilidad para envío inmediato?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-dropdown">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-[#f70071]/30 overflow-hidden my-auto relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#f70071] text-[#1A0D18] hover:text-white flex items-center justify-center shadow-xl border border-gray-200 transition-all cursor-pointer active:scale-90"
          title="Cerrar vista de producto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 text-left">
          {/* Media View Column */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[340px] bg-gradient-to-b from-[#FDF0F5] to-white border-b md:border-b-0 md:border-r border-gray-100">
            <img
              src={productImage}
              alt={product.name}
              className="max-h-72 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl"
            />

            {product.badge && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#f70071] to-[#e91e63] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
                ✨ {product.badge}
              </span>
            )}

            {/* Wishlist Heart Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`absolute bottom-4 left-4 px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 border ${
                isWishlisted
                  ? 'bg-[#f70071] text-white border-white'
                  : 'bg-white text-[#1A0D18] hover:bg-[#f70071] hover:text-white border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              <span className="text-xs font-black">
                {isWishlisted ? 'En Favoritos' : 'Agregar a Favoritos'}
              </span>
            </button>
          </div>

          {/* Details Content Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white text-[#1A0D18]">
            <div className="space-y-4">
              {/* Rating & Verified Badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-black text-[#f70071] bg-[#FDF0F5] px-2.5 py-1 rounded-full border border-[#f70071]/20">
                  <Star className="w-3.5 h-3.5 fill-[#f70071] text-[#f70071]" />
                  <span>{product.rating}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="font-extrabold text-gray-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{product.reviewsCount} evaluaciones verificadas</span>
                </span>
              </div>

              {/* Product Title */}
              <h2 className="font-syne text-2xl sm:text-3xl font-black text-[#1A0D18] leading-tight">
                {product.name}
              </h2>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2">
                <div className="font-syne text-3xl font-black text-[#f70071]">
                  ${(product.price * quantity).toLocaleString('es-CL')}
                </div>
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">CLP</span>
                {quantity > 1 && (
                  <span className="text-[11px] text-[#25D366] font-bold">
                    (${product.price.toLocaleString('es-CL')} c/u)
                  </span>
                )}
              </div>

              {/* Product Full Description */}
              <div className="bg-[#FDF0F5]/50 p-4 rounded-2xl border border-[#f70071]/15 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#f70071] block">
                  Descripción & Detalles del Ramo
                </span>
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">
                  {product.fullDetails || product.description}
                </p>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 gap-2 pt-1 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#f70071] shrink-0" />
                  <span>Flores artesanales en limpiapipas de alta densidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Despacho Gratis en La Florida · Envíos a todo Chile</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & High-Impact Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* Unit Counter */}
              <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 pl-1">
                  Cantidad de Ramos:
                </span>
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#f70071] text-gray-800 hover:text-white font-black text-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    title="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-6 text-center text-sm font-black text-[#1A0D18]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#f70071] text-gray-800 hover:text-white font-black text-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    title="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[#f70071] via-[#e91e63] to-[#d81b60] hover:from-[#e91e63] hover:to-[#c2185b] text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#f70071]/30 transition-all cursor-pointer active:scale-95 border border-white/20"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Añadir a la Bolsa</span>
                </button>

                {/* WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all cursor-pointer active:scale-95 border border-white/20 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Cotizar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
