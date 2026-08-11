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
    `Hola IsaFlores, quiero comprar ${quantity}x ${product.name} ($${(
      product.price * quantity
    ).toLocaleString('es-CL')} CLP). ¿Tienen disponibilidad?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-dropdown">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-[#F9E2EC] overflow-hidden my-auto relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-[#FDF0F5] text-[#1A0D18] flex items-center justify-center shadow-md border border-[#F9E2EC] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 text-left">
          {/* Media View Column */}
          <div
            className="p-8 flex items-center justify-center relative min-h-[320px] bg-[#FDF0F5]"
          >
            <img
              src={productImage}
              alt={product.name}
              className="max-h-72 object-contain drop-shadow-xl rounded-2xl"
            />

            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#E91E63] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}

            <button
              onClick={() => onToggleWishlist(product)}
              className={`absolute bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-[#E91E63] text-white'
                  : 'bg-white text-[#1A0D18] hover:bg-[#E91E63] hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Details Content Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white text-[#1A0D18]">
            <div className="space-y-3">
              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-xs text-[#1A0D18]/70">
                <span className="flex items-center gap-1 font-bold text-[#E91E63]">
                  <Star className="w-4 h-4 fill-[#E91E63] text-[#E91E63]" />
                  <span>{product.rating}</span>
                </span>
                <span>•</span>
                <span className="font-semibold">{product.reviewsCount} evaluaciones verificadas</span>
              </div>

              {/* Product Title */}
              <h2 className="font-serif-flora text-2xl sm:text-3xl font-extrabold text-[#1A0D18]">
                {product.name}
              </h2>

              {/* Price */}
              <div className="font-serif-flora text-3xl font-black text-[#E91E63]">
                ${product.price.toLocaleString('es-CL')}{' '}
                <span className="text-xs font-bold text-[#1A0D18]/60">CLP</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#1A0D18]/80 font-medium leading-relaxed whitespace-pre-line">
                {product.fullDetails || product.description}
              </p>

              {/* Value Guarantees */}
              <div className="space-y-2 pt-3 text-xs font-bold text-[#1A0D18]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E91E63]" />
                  <span>Flor hecha a mano en limpiapipas de alta densidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#E91E63]" />
                  <span>Despacho Gratis en La Florida · Envíos a todo Chile</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Purchase Buttons */}
            <div className="space-y-4 pt-4 border-t border-[#F9E2EC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1A0D18]">Unidades:</span>
                <div className="flex items-center gap-3 bg-[#FDF0F5] p-1.5 rounded-full border border-[#F9E2EC]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white text-[#1A0D18] font-bold text-xs flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black text-[#1A0D18]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-full bg-white text-[#1A0D18] font-bold text-xs flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="bg-[#E91E63] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir a la Bolsa</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all border border-white/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Solicitar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
