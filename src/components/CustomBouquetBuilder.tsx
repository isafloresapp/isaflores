import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Sparkles, Send, CheckCircle2, Heart, ShieldCheck, RefreshCw, Layers, Palette } from 'lucide-react';
import { db, CustomFlowerOption } from '../services/db';

interface CustomBouquetBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedFlowerItem {
  flowerOption: CustomFlowerOption;
  quantity: number;
}

const WRAPPING_OPTIONS = [
  { id: 'kraft', name: 'Papel Kraft Botánico', price: 1000 },
  { id: 'satin', name: 'Empaque Rosa Satinado Premium', price: 2000 },
  { id: 'transparente', name: 'Celofán Cristalino con Moño', price: 1500 },
];

const RIBBON_OPTIONS = [
  { id: 'dorado', name: 'Cinta Dorada IsaFlores', price: 500 },
  { id: 'fucsia', name: 'Cinta Fucsia Magenta', price: 500 },
  { id: 'blanco', name: 'Cinta Blanca Elegante', price: 500 },
];

export const CustomBouquetBuilder: React.FC<CustomBouquetBuilderProps> = ({ isOpen, onClose }) => {
  const [availableFlowers, setAvailableFlowers] = useState<CustomFlowerOption[]>([]);
  const [selectedFlowers, setSelectedFlowers] = useState<Record<string, number>>({});
  const [selectedWrapping, setSelectedWrapping] = useState('satin');
  const [selectedRibbon, setSelectedRibbon] = useState('fucsia');

  useEffect(() => {
    if (isOpen) {
      loadCustomFlowers();
    }
  }, [isOpen]);

  const loadCustomFlowers = async () => {
    const flowers = await db.getCustomFlowers();
    setAvailableFlowers(flowers);
  };

  if (!isOpen) return null;

  const handleUpdateQuantity = (flowerId: string, delta: number) => {
    setSelectedFlowers((prev) => {
      const currentQty = prev[flowerId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[flowerId];
        return copy;
      }
      return { ...prev, [flowerId]: newQty };
    });
  };

  // Price Calculations
  const flowersSubtotal = Object.entries(selectedFlowers).reduce((sum, [flId, qty]) => {
    const flOpt = availableFlowers.find((f) => f.id === flId);
    return sum + (flOpt ? flOpt.pricePerStem * qty : 0);
  }, 0);

  const wrappingPrice = WRAPPING_OPTIONS.find((w) => w.id === selectedWrapping)?.price || 0;
  const ribbonPrice = RIBBON_OPTIONS.find((r) => r.id === selectedRibbon)?.price || 0;
  const totalBouquetPrice = flowersSubtotal + wrappingPrice + ribbonPrice;
  const totalStemsCount = Object.values(selectedFlowers).reduce((a, b) => a + b, 0);

  const handleSendCustomQuote = () => {
    if (totalStemsCount === 0) {
      alert('Por favor selecciona al menos 1 flor para tu ramo personalizado.');
      return;
    }

    const selectedDetails = Object.entries(selectedFlowers)
      .map(([flId, qty]) => {
        const flOpt = availableFlowers.find((f) => f.id === flId);
        return flOpt ? `• ${flOpt.iconSvg} ${flOpt.name} (${flOpt.colorName}): x${qty} tallos ($${(flOpt.pricePerStem * qty).toLocaleString('es-CL')})` : null;
      })
      .filter(Boolean)
      .join('\n');

    let msg = `🌸 *SOLICITUD DE RAMO PERSONALIZADO - ISAFLORES* 🌸\n`;
    msg += `_Diseñado en el Estudio de la APP_\n\n`;
    msg += `💐 *TALLOS Y FLORES SELECCIONADAS (${totalStemsCount} piezas):*\n`;
    msg += `${selectedDetails}\n\n`;
    msg += `🎁 *EMPAQUE:* ${WRAPPING_OPTIONS.find((w) => w.id === selectedWrapping)?.name}\n`;
    msg += `🎀 *CINTA:* ${RIBBON_OPTIONS.find((r) => r.id === selectedRibbon)?.name}\n\n`;
    msg += `💰 *TOTAL ESTIMADO RAMO:* $${totalBouquetPrice.toLocaleString('es-CL')} CLP\n\n`;
    msg += `📲 *Nota:* Quisiera coordinar el envío de este diseño único.`;

    const whatsappUrl = `https://wa.me/56928704768?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      <div className="bg-white border-2 border-[#F9E2EC] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#1A0D18] text-left relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl p-6 border-b border-[#F9E2EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E91E63] text-white flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-flora text-2xl font-extrabold text-[#1A0D18]">
                Diseña tu Ramo Personalizado
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E91E63] block">
                Selecciona la Cantidad, Tipo de Flor, Color & Precios Dinámicos
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FDF0F5] text-[#1A0D18] hover:bg-[#E91E63] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Select Flowers & Quantities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#E91E63]">
                1. Selecciona las Flores, Colores y Cantidad de Tallos:
              </span>
              <span className="text-xs font-bold text-[#1A0D18]/60">
                {totalStemsCount} tallos en total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableFlowers.map((fl) => {
                const qty = selectedFlowers[fl.id] || 0;
                return (
                  <div
                    key={fl.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      qty > 0 ? 'bg-[#FDF0F5] border-[#E91E63] shadow-xs' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{fl.iconSvg}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: fl.colorHex }}
                          />
                          <h5 className="font-bold text-sm text-[#1A0D18]">{fl.name}</h5>
                        </div>
                        <span className="text-[11px] text-[#1A0D18]/70 font-semibold block">
                          Color: {fl.colorName}
                        </span>
                        <span className="text-xs font-black text-[#E91E63] font-serif-flora">
                          ${fl.pricePerStem.toLocaleString('es-CL')} CLP / tallo
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-2xs">
                      <button
                        onClick={() => handleUpdateQuantity(fl.id, -1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#1A0D18] font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-xs min-w-[18px] text-center">{qty}</span>
                      <button
                        onClick={() => handleUpdateQuantity(fl.id, 1)}
                        className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Wrapping Options */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#E91E63] block">
              2. Elige el Empaque del Ramo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {WRAPPING_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWrapping(w.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedWrapping === w.id
                      ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-md'
                      : 'bg-white border-gray-200 text-[#1A0D18] hover:bg-gray-50'
                  }`}
                >
                  <span className="block">{w.name}</span>
                  <span className="text-[10px] opacity-80">+${w.price.toLocaleString('es-CL')} CLP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary Box */}
          <div className="bg-[#FDF0F5] p-5 rounded-2xl border border-[#F9E2EC] space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Subtotal Flores ({totalStemsCount} tallos):</span>
              <span>${flowersSubtotal.toLocaleString('es-CL')} CLP</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Empaque & Cinta:</span>
              <span>${(wrappingPrice + ribbonPrice).toLocaleString('es-CL')} CLP</span>
            </div>
            <div className="pt-2 border-t border-[#F9E2EC] flex justify-between items-center text-base font-extrabold text-[#1A0D18]">
              <span>Total Ramo Personalizado:</span>
              <span className="font-serif-flora text-2xl text-[#E91E63]">
                ${totalBouquetPrice.toLocaleString('es-CL')} CLP
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSendCustomQuote}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>Enviar Diseño de Ramo a WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
