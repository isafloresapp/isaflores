import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#3D5A45] block mb-1">
          Testimonios de Coleccionistas
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E29]">
          Experiencias en el IsaFlores
        </h2>
        <p className="text-xs sm:text-sm text-[#5E4657] max-w-md mx-auto mt-1">
          Más de 1.200 ramos de flores botánicas entregadas en todo Chile
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#E8DFD1] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#5E4657] font-medium">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#2D1E29] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD1] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#2D1E29]">
                    <span>{rev.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E7E4B]" />
                  </div>
                  <span className="text-[10px] text-[#5E4657] block">
                    {rev.location}
                  </span>
                </div>

                <span className="text-[9px] bg-[#F3ECE1] px-2.5 py-1 rounded-full text-[#3D5A45] font-semibold tracking-wide">
                  {rev.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
