import React from 'react';
import { Star, Heart, ShoppingBag, MessageCircle, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const whatsappUrl = `https://wa.me/56928704768?text=${encodeURIComponent(
    `Hola IsaFlores, me interesa comprar el ${product.name} ($${product.price.toLocaleString('es-CL')}). Tienen disponibilidad?`
  )}`;

  return (
    <div className="bento-card-light overflow-hidden flex flex-col group relative text-left bg-white border-2 border-[#FF3877]/20 hover:border-[#FF3877]">
      {/* Image Frame with High Contrast Overlays */}
      <div
        className="relative aspect-4/3 w-full overflow-hidden flex items-center justify-center p-6 border-b border-[#451531]/10"
        style={{ background: product.bgTint }}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-56 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badge with Solid High-Contrast Dark Pill */}
        {product.badge && (
          <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full text-white bg-[#451531] shadow-xl border border-white/40">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isWishlisted
              ? 'bg-[#FF3877] text-white shadow-lg border border-white'
              : 'bg-white text-[#451531] hover:bg-[#FF3877] hover:text-white'
          }`}
          title={isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Hover Bar */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 z-10">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 bg-[#451531] hover:bg-[#FF3877] text-white font-black text-xs uppercase tracking-wider py-3 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/30"
          >
            <Eye className="w-4 h-4 text-[#A5BEFA]" />
            <span>Detalle Completo</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4 bg-white">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#451531] bg-[#F4F7FF] px-3 py-1 rounded-full border border-[#451531]/15">
              <Star className="w-4 h-4 fill-[#B3093F] text-[#B3093F]" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#B3093F] font-black">({product.reviewsCount})</span>
            </span>
            {product.flowerCount && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#64B7CC] text-white px-3 py-1 rounded-full shadow-xs">
                {product.flowerCount} flores
              </span>
            )}
          </div>

          <h3 className="font-syne text-2xl font-black text-[#451531] group-hover:text-[#FF3877] transition-colors leading-tight pt-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#5E2B4A] line-clamp-2 leading-relaxed font-bold">
            {product.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-black text-[#451531] bg-[#F4F7FF] px-3 py-1 rounded-full border border-[#FF3877]/30 shadow-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Price & Purchase Actions */}
        <div className="pt-4 border-t border-[#451531]/15 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#B3093F] block -mb-1">
              Precio Especial
            </span>
            <span className="font-syne text-3xl font-black text-[#451531]">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#FF3877] hover:bg-[#B3093F] text-white p-3.5 rounded-full shadow-lg transition-all cursor-pointer transform hover:scale-110"
              title="Añadir a la Bolsa"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#64B7CC] hover:bg-[#451531] text-white p-3.5 rounded-full shadow-lg transition-all cursor-pointer transform hover:scale-110"
              title="Comprar por WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
