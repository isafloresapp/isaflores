import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, HelpCircle, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
  time: string;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');

  // User captured data
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userInterest, setUserInterest] = useState('');
  const [step, setStep] = useState<'name' | 'interest' | 'phone' | 'address' | 'ready'>('name');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTimeStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! 🌸 Soy Isa, tu asistente virtual de IsaFlores. Recuerdos que perduran.\n\nPara ayudarte con tu cotización, ¿cuál es tu nombre completo?',
      time: getTimeStr(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const addBotMessage = (text: string, options?: { label: string; action: string }[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text,
        options,
        time: getTimeStr(),
      },
    ]);
  };

  const handleUserSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text,
        time: getTimeStr(),
      },
    ]);

    setInputMessage('');

    // Step by Step Questionnaire Flow
    setTimeout(() => {
      if (step === 'name') {
        setUserName(text);
        setStep('interest');
        addBotMessage(
          `¡Encantada, ${text}! 🌸 ¿Cuál es la ramo de flores o producto que más te gustó o te gustaría cotizar?`,
          [
            { label: '💐 ramo Coral duradera', action: 'ramo Coral duradera' },
            { label: '🌻 Colección Girasoles Silvestres', action: 'Colección Girasoles Silvestres' },
            { label: '💖 ramo Blush & Seda', action: 'ramo Blush & Seda' },
            { label: '🎨 Kit DIY de Taller', action: 'Kit DIY' },
            { label: '✨ Ramo 100% Personalizado', action: 'Ramo Personalizado' },
          ]
        );
      } else if (step === 'interest') {
        setUserInterest(text);
        setStep('phone');
        addBotMessage(
          `¡Excelente elección! *${text}* es una obra hermosa. 💖\n\n¿Nos compartes tu número de celular o WhatsApp de contacto?`
        );
      } else if (step === 'phone') {
        setUserPhone(text);
        setStep('address');
        addBotMessage(
          `¡Perfecto! Y por último, ¿cuál es tu dirección y comuna de despacho? (Recuerda que en La Florida el despacho es GRATIS 🎉)`
        );
      } else if (step === 'address') {
        setUserAddress(text);
        setStep('ready');
        addBotMessage(
          `¡Genial, ${userName}! 🌸 He guardado tus datos:\n` +
          `• *Nombre:* ${userName}\n` +
          `• *Producto:* ${userInterest}\n` +
          `• *Teléfono:* ${userPhone}\n` +
          `• *Dirección/Comuna:* ${text}\n\n` +
          `Haz clic en el botón verde de abajo para iniciar el chat en WhatsApp con tu cotización lista.`
        );
      } else {
        addBotMessage(
          `Puedes enviarnos tu consulta directa por WhatsApp con el botón verde de abajo.`
        );
      }
    }, 600);
  };

  const handleOptionClick = (option: { label: string; action: string }) => {
    handleUserSend(option.label);
  };

  const handleOpenWhatsAppDirect = () => {
    let msg = `🌸 *COTIZACIÓN DESDE CHATBOT ISA - ISAFLORES* 🌸\n`;
    msg += `_Recuerdos que perduran._\n\n`;
    msg += `👤 *DATOS DEL CLIENTE:*\n`;
    msg += `• *Nombre:* ${userName || 'Cliente Web'}\n`;
    msg += `• *Teléfono:* ${userPhone || 'No especificado'}\n`;
    msg += `• *Dirección / Comuna:* ${userAddress || 'A convenir'}\n`;
    msg += `• *Producto que le gustó:* ${userInterest || 'ramos de flores'}\n\n`;
    msg += `✨ *Hola IsaFlores, vengo conversando con la asistente Isa y me gustaría recibir asesoría.*`;

    window.open(`https://wa.me/56928704768?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button - Positioned safely above Mobile Tab Bar */}
      <div className="fixed bottom-24 left-4 sm:bottom-8 sm:left-8 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-[#2B051C] hover:bg-[#f70071] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center gap-3 transition-all cursor-pointer border-2 border-[#f70071] transform hover:scale-105"
          title="Asistente Virtual Isa"
        >
          <div className="w-8 h-8 rounded-full bg-[#f70071] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline font-syne font-black text-xs uppercase tracking-wider pr-1">
            Asistente Isa
          </span>

          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25D366] rounded-full border-2 border-white animate-ping" />
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-8 sm:right-auto sm:w-96 z-50 bg-[#2B051C] border-2 border-[#f70071]/40 rounded-3xl shadow-2xl text-white flex flex-col h-[500px] overflow-hidden animate-dropdown">
          {/* Header */}
          <div className="bg-[#42082B] p-4 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f70071] flex items-center justify-center shadow-lg border border-white/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-syne text-base font-black text-white leading-none">
                  Isa · Asistente Virtual
                </h4>
                <span className="text-[10px] font-black uppercase text-[#25D366] flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  En Línea · IsaFlores
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-left no-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-bold leading-relaxed shadow-md ${
                    m.sender === 'user'
                      ? 'bg-[#f70071] text-white rounded-br-none'
                      : 'bg-[#42082B] text-white border border-white/20 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] text-white/60 font-semibold px-1 pt-1">{m.time}</span>

                {/* Quick Option Buttons */}
                {m.options && (
                  <div className="flex flex-col gap-1.5 pt-2 w-full max-w-[90%]">
                    {m.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-white/10 hover:bg-[#f70071] text-white text-[11px] font-black px-3 py-2 rounded-xl border border-white/20 transition-all cursor-pointer text-left flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#ffc0dc]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {step === 'ready' && (
              <div className="pt-2 text-center">
                <button
                  onClick={handleOpenWhatsAppDirect}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 border border-white/30 cursor-pointer transform hover:scale-102"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Enviar Datos a WhatsApp</span>
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#42082B] border-t border-white/20 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserSend()}
              placeholder="Escribe aquí tu respuesta..."
              className="flex-1 bg-white/10 border border-white/30 rounded-full px-4 py-2 text-xs font-bold text-white placeholder-white/50 outline-none focus:border-[#f70071]"
            />
            <button
              onClick={() => handleUserSend()}
              className="w-9 h-9 rounded-full bg-[#f70071] text-white flex items-center justify-center shadow-lg hover:bg-[#ff1b82] transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
