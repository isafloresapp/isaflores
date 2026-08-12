import React from 'react';
import { PhoneCall, Instagram, Heart, ArrowUp, Zap, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenCrm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrm }) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(true);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'Para instalar la App de IsaFlores en tu celular o computador:\n\n' +
        '• En iPhone/iPad (Safari): Presiona el botón "Compartir" 📤 y selecciona "Agregar a la pantalla de inicio" 📲.\n' +
        '• En Android (Chrome): Presiona los tres puntos verticales en la esquina superior derecha y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".\n' +
        '• En Computador (Chrome/Edge): Haz clic en el icono de instalación 💻 en la barra de direcciones superior.'
      );
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } catch (e) {
      console.warn('Error displaying PWA install prompt:', e);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FDF0F5] text-[#1A0D18] pt-16 pb-12 border-t-2 border-[#F9E2EC] text-left relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F9E2EC]">
        {/* Official Brand Logo & Summary */}
        <div className="md:col-span-5 space-y-4">
          <img
            src="/logo.png"
            alt="IsaFlores - Hecho con cariño, no marchitan"
            className="h-28 sm:h-36 md:h-40 w-auto object-contain rounded-2xl shadow-xs"
          />

          <p className="text-xs sm:text-sm font-semibold text-[#1A0D18]/80 leading-relaxed max-w-md">
            💖 <strong>Hecho a mano con amor:</strong> Flores de Goma EVA y Limpiapipas. Hecho con cariño, no marchitan. Flores que duran, emociones que perduran.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white text-[#E91E63] flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-110 border border-[#F9E2EC]"
              title="Instagram Atelier"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/56928704768"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-110 border border-white font-bold"
              title="WhatsApp Concierge"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div className="md:col-span-3 space-y-3 text-xs font-bold">
          <h4 className="font-extrabold text-[#E91E63] uppercase tracking-widest text-xs">
            Categorías Frecuentes
          </h4>
          <ul className="space-y-2.5 text-[#1A0D18]/80">
            <li><a href="#productos" className="hover:text-[#E91E63] transition-colors">Bodas & Celebraciones</a></li>
            <li><a href="#productos" className="hover:text-[#E91E63] transition-colors">Eventos & Regalos</a></li>
            <li><a href="#productos" className="hover:text-[#E91E63] transition-colors">Ramos Eternos de Autor</a></li>
            <li><a href="#custom-builder" className="hover:text-[#E91E63] transition-colors">Atelier de Diseño a Medida</a></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className="md:col-span-4 space-y-3 text-xs font-bold">
          <h4 className="font-extrabold text-[#E91E63] uppercase tracking-widest text-xs">
            Despachos & Logística
          </h4>
          <ul className="space-y-2.5 text-[#1A0D18]/80">
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Taller: +56 9 2870 4768</span>
            </li>
            <li>🎉 Despacho GRATIS en la comuna de La Florida</li>
            <li>🚚 Región Metropolitana: $3.500 CLP fijo</li>
            <li>📦 Regiones: Starken / Chilexpress / Blue Express</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar with CRM & Install App Buttons */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#1A0D18]/70">
        <span>© 2026 IsaFlores. Flores que duran, emociones que perduran.</span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full border border-transparent shadow-xs transition-all cursor-pointer font-bold"
              title="Instalar la Aplicación en tu Dispositivo"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instalar App 📲</span>
            </button>
          )}

          <button
            onClick={onOpenCrm}
            className="flex items-center gap-2 bg-[#E91E63] hover:bg-[#C2185B] text-white px-4 py-2 rounded-full border border-transparent shadow-xs transition-all cursor-pointer font-bold"
            title="Ingresar al Panel CRM de Gestión"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Acceso al CRM</span>
          </button>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#1A0D18] hover:text-[#E91E63] transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-[#F9E2EC] shadow-xs"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-4 h-4 text-[#E91E63]" />
          </button>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20deseo%20solicitar%20informacion%20sobre%20sus%20creaciones."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl wa-pulse hover:scale-110 transition-all cursor-pointer border-2 border-white"
        title="Atención por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white" />
      </a>
    </footer>
  );
};
