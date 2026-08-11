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

        {/* Uber Eats "Seleccionados para Ti" Featured Row */}
        {selectedCategory === 'todos' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C2185B] fill-[#C2185B]" />
                <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
                  Seleccionados para Ti
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
                    className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex justify-between gap-3 relative"
                  >
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <span className="bg-[#00838F] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block">
                          🔥 Popular
                        </span>
                        <h4 className="font-extrabold text-sm text-[#1A237E] group-hover:text-[#00838F] transition-colors leading-tight">
                          {p.name}
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <span className="font-extrabold text-base text-[#C2185B] block">
                          ${p.price.toLocaleString('es-CL')} CLP
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          Envío Gratis
                        </span>
                      </div>
                    </div>

                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-cyan-50 shrink-0 border border-cyan-100">
                      <img
                        src={pImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p);
                        }}
                        className="absolute bottom-1 right-1 bg-[#C2185B] hover:bg-[#8E24AA] text-white p-2 rounded-full shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uber Eats Clean Split-Card Product Items List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-200 pb-3">
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
              {selectedCategory === 'todos' ? 'Menú de Ramos & Flores' : WINTER_FILTER_CHIPS.find(c => c.id === selectedCategory)?.label}
            </h3>
            <span className="text-xs font-bold text-cyan-900/60">
              {filteredProducts.length} opciones
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const productImage = product.image || (product as any).images?.[0] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

                return (
                  <div
                    key={product.id}
                    onClick={() => onQuickView(product)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-cyan-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex justify-between gap-4 text-left relative"
                  >
                    {/* Item Text & Price Details (Left Side Uber Eats Style) */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{product.rating}</span>
                          </span>
                          <span className="bg-cyan-50 text-[#00838F] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-cyan-200">
                            ❄️ 72h / Express
                          </span>
                        </div>

                        <h4 className="font-extrabold text-base sm:text-lg text-[#1A237E] group-hover:text-[#00838F] transition-colors leading-snug">
                          {product.name}
                        </h4>

                        <p className="text-xs text-cyan-950/70 line-clamp-2 leading-relaxed font-medium">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="font-extrabold text-xl text-[#C2185B] block">
                            ${product.price.toLocaleString('es-CL')} <span className="text-xs text-cyan-900/60 font-normal">CLP</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            🎉 Envío Gratis La Florida
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          className={`p-2 rounded-full border transition-all ${
                            isWishlisted ? 'bg-[#C2185B] text-white border-[#C2185B]' : 'bg-gray-50 text-gray-400 hover:text-[#C2185B] border-gray-200'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Item Thumbnail & Plus Button (Right Side Uber Eats Style) */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-cyan-50 shrink-0 border border-cyan-100">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="absolute bottom-2 right-2 bg-[#C2185B] hover:bg-[#8E24AA] text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all transform hover:scale-110 flex items-center justify-center"
                        title="Agregar al pedido"
                      >
                        <Plus className="w-5 h-5 stroke-[3]" />
                      </button>
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
