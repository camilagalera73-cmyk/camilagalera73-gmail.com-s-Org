import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, ExternalLink } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shortDomain = 'is.gd/ecoquest';
  const fullShortUrl = 'https://is.gd/ecoquest';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Eco-Quest | Aves de Villa Mercedes',
        text: '¡Descubrí, identificá y registrá las aves de Villa Mercedes con la app Eco-Quest!',
        url: fullShortUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-900/15">
          <div className="flex items-center gap-2.5">
            <img src="/isologo_transparent.png?v=7" alt="Eco-Quest" className="h-8 w-auto object-contain" />
            <div>
              <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b]">
                Acceso Rápido y Corto
              </h3>
              <p className="text-xs text-slate-600">
                Compartí la aplicación fácilmente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-[#3a1c36] transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Domain Card */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-amber-900/15 shadow-sm">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Dirección corta oficial:
            </span>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#263b2b] text-white">
              <span className="font-mono text-base font-bold tracking-wide pl-1 select-all text-emerald-300">
                {shortDomain}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition active:scale-95 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Cualquier persona puede escribir directamente <b>{shortDomain}</b> en el navegador de su teléfono o PC para entrar.
            </p>
          </div>

          {/* QR Code Section for field trips / classroom */}
          <div className="p-4 rounded-2xl bg-white border border-amber-900/15 shadow-sm text-center">
            <span className="text-xs font-bold text-[#263b2b] flex items-center justify-center gap-1.5 mb-2.5">
              <QrCode className="w-4 h-4 text-[#1c7692]" />
              Escanear con la cámara del celular:
            </span>
            <div className="inline-block p-2.5 bg-white rounded-xl border border-slate-200 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fullShortUrl)}`}
                alt="Código QR de Eco-Quest"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Ideal para folletos, salidas de campo o presentaciones.
            </p>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-md active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              Compartir enlace
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Descubrí e identificá las aves de Villa Mercedes con Eco-Quest! Entrá desde acá: ${fullShortUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-md active:scale-95"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
