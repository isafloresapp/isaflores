import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Truck, Heart } from 'lucide-react';
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
    `Hola IsaFlores 🌸, me interesa comprar ${quantity}x ${product.name} ($${(
      product.price * quantity
    ).toLocaleString('es-CL')} CLP). ¿Tienen disponibilidad?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-dropdown">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-white/90 hover:bg-gray-100 text-[#1A0D18] flex items-center justify-center shadow-md border border-gray-200 transition-all cursor-pointer active:scale-90"
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
              className="max-h-72 object-contain drop-shadow-xl rounded-2xl hover:scale-105 transition-transform duration-500"
            />

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#e91e63] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm">
                {product.badge}
              </span>
            )}

            {/* Wishlist Heart Button - Uber Eats Square Rounded Style */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`absolute bottom-4 left-4 w-11 h-11 rounded-2xl backdrop-blur-md shadow-md border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isWishlisted
                  ? 'bg-[#e91e63] text-white border-[#e91e63]'
                  : 'bg-white/90 hover:bg-white text-gray-800 border-gray-200'
              }`}
              title={isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : 'text-[#1A0D18] stroke-[2.5]'}`} />
            </button>
          </div>

          {/* Details Content Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white text-[#1A0D18]">
            <div className="space-y-3.5">
              {/* Rating & Verified Reviews */}
              <div className="flex items-center gap-2 text-xs text-[#1A0D18]/70">
                <span className="flex items-center gap-1 font-black text-[#e91e63] bg-[#FDF0F5] px-2.5 py-1 rounded-lg border border-[#e91e63]/20">
                  <Star className="w-3.5 h-3.5 fill-[#e91e63] text-[#e91e63]" />
                  <span>{product.rating}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-gray-600">{product.reviewsCount} evaluaciones verificadas</span>
              </div>

              {/* Product Title */}
              <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#1A0D18] leading-tight">
                {product.name}
              </h2>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2">
                <div className="font-syne text-3xl font-black text-[#e91e63]">
                  ${(product.price * quantity).toLocaleString('es-CL')}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">CLP</span>
              </div>

              {/* Product Description */}
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                {product.fullDetails || product.description}
              </p>

              {/* Guarantees */}
              <div className="space-y-2 pt-2 text-xs font-bold text-gray-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#e91e63] shrink-0" />
                  <span>Flor hecha a mano en limpiapipas de alta densidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#e91e63] shrink-0" />
                  <span>Despacho Gratis en La Florida · Envíos a todo Chile</span>
                </div>
              </div>
            </div>

            {/* Quantity Counter & Action Buttons - Uber Eats Square Rounded & Transparent Border Style */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* UNIDADES: [ - 1 + ] Square Rounded Box */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#1A0D18]">
                  UNIDADES:
                </span>
                <div className="bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-[#1A0D18] hover:bg-[#e91e63] hover:text-white hover:border-[#e91e63] font-bold text-base flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                    title="Disminuir"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-black text-[#1A0D18]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-[#1A0D18] hover:bg-[#e91e63] hover:text-white hover:border-[#e91e63] font-bold text-base flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                    title="Aumentar"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons Grid - Uber Eats Square Rounded with Transparent Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* AÑADIR A LA BOLSA - Semi-transparent background & border */}
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="bg-[#e91e63]/10 hover:bg-[#e91e63] text-[#e91e63] hover:text-white font-black text-xs uppercase tracking-wider py-4 px-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#e91e63] shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#e91e63] group-hover:text-white transition-colors" />
                  <span>AÑADIR A LA BOLSA</span>
                </button>

                {/* SOLICITAR POR WHATSAPP - Semi-transparent background & border */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366]/10 hover:bg-[#25D366] text-[#008A39] hover:text-white font-black text-xs uppercase tracking-wider py-4 px-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-[#25D366] shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 text-center group"
                >
                  <MessageCircle className="w-4 h-4 text-[#008A39] group-hover:text-white fill-[#008A39] group-hover:fill-white transition-colors" />
                  <span>SOLICITAR POR WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
