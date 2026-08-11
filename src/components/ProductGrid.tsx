import React from 'react';
import { Product } from '../types';
import { Heart, Eye, Plus, Star, Flame, Clock, Bike, Snowflake } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  onQuickView: (product: Product) => void;
  onOpenCustomBuilder: () => void;
}

const WINTER_FILTER_CHIPS = [
  { id: 'todos', label: 'Todas las Flores', icon: '❄️' },
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍' },
  { id: 'eventos', label: 'Eventos', icon: '✨' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨' },
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenCustomBuilder,
}) => {
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const topRatedProducts = products.filter((p) => p.rating >= 4.9).slice(0, 4);

  return (
    <section className="py-8 bg-[#F4F8FA] text-[#1A237E]" id="productos">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">

        {/* "Recomendados del Taller" Featured Horizontal Row */}
        {selectedCategory === 'todos' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-[#00838F]" />
                <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
                  Destacados de Invierno
                </h3>
              </div>
              <span className="text-xs font-bold text-[#00838F] uppercase">
                ❄️ Envío Gratis en La Florida
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRatedProducts.map((p) => {
                const pImage = p.image || (p as any).images?.[0];
                return (
                  <div
                    key={`feat-${p.id}`}
                    onClick={() => onQuickView(p)}
                    className="bg-white rounded-2xl p-3 border border-cyan-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-cyan-50 mb-3">
                      <img
                        src={pImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#00838F] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        ❄️ Favorito Invierno
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1A237E] group-hover:text-[#00838F] transition-colors truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-extrabold text-base text-[#1A237E]">
                          ${p.price.toLocaleString('es-CL')} CLP
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(p);
                          }}
                          className="bg-[#C2185B] hover:bg-[#8E24AA] text-white p-2 rounded-full shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Product Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-200 pb-3">
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
              {selectedCategory === 'todos' ? 'Colección de Ramos' : WINTER_FILTER_CHIPS.find(c => c.id === selectedCategory)?.label}
            </h3>
            <span className="text-xs font-bold text-cyan-900/60">
              {filteredProducts.length} productos
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-cyan-100">
              <span className="text-4xl block mb-3">❄️</span>
              <h4 className="font-bold text-lg text-[#1A237E] mb-1">No hay flores en esta sección</h4>
              <button
                onClick={() => setSelectedCategory('todos')}
                className="bg-[#00838F] text-white px-6 py-2 rounded-full text-xs font-bold uppercase mt-3"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const productImage = product.image || (product as any).images?.[0] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-cyan-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group text-left relative"
                  >
                    {/* Media Header */}
                    <div className="relative h-60 w-full bg-cyan-50 overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Winter Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="bg-[#00695C] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          ❄️ Despacho Gratis La Florida
                        </span>
                        <span className="bg-white/90 backdrop-blur-md text-[#1A237E] text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-cyan-100">
                          ⏰ 72h / Express
                        </span>
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={() => onToggleWishlist(product)}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                          isWishlisted ? 'bg-[#C2185B] text-white' : 'bg-white/90 text-[#1A237E] hover:bg-[#C2185B] hover:text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>

                        <h4 className="font-extrabold text-lg text-[#1A237E] group-hover:text-[#00838F] transition-colors leading-snug">
                          {product.name}
                        </h4>

                        <p className="text-xs text-cyan-950/70 line-clamp-2 leading-relaxed font-medium">
                          {product.description}
                        </p>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="pt-3 border-t border-cyan-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-cyan-900/40 block">Precio Total</span>
                          <span className="font-extrabold text-2xl text-[#C2185B]">
                            ${product.price.toLocaleString('es-CL')} <span className="text-xs text-cyan-900/60 font-normal">CLP</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onQuickView(product)}
                            className="bg-cyan-50 hover:bg-cyan-100 text-[#1A237E] text-xs font-bold px-3 py-2 rounded-full cursor-pointer border border-cyan-200"
                          >
                            Detalles
                          </button>

                          <button
                            onClick={() => onAddToCart(product)}
                            className="bg-[#C2185B] hover:bg-[#8E24AA] text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md flex items-center gap-1 cursor-pointer transform hover:scale-105"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
