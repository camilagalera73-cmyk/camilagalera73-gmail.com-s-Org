import React, { useState } from 'react';
import { WifiOff, X, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <aside 
      aria-label="Estado de conexión sin internet"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 bg-[#1c2e20] text-white p-3.5 rounded-2xl shadow-2xl border-2 border-[#f4bb29]/60 animate-in slide-in-from-bottom-3"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#f4bb29] text-[#263b2b] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold font-serif-fraunces text-[#f4bb29] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Modo Campo Offline Activo
          </h4>
          <p className="text-[11px] text-amber-100/90 mt-0.5 leading-snug">
            La app funciona 100% sin internet. Podés tomar fotos con tu cámara, registrar avistamientos, usar el GPS del celular y jugar la trivia sin gastar datos ni tener señal.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white p-1 rounded-lg"
          aria-label="Cerrar aviso offline"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
