import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-4 sm:p-6 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 mb-3">
          <div>
            <span className="text-[10px] font-bold text-[#9a561d] uppercase tracking-wider block">
              Documento Fuente Original • Universidad Nacional de Villa Mercedes
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-fraunces text-[#263b2b]">
              Lámina Proyecto Eco-quest: Catálogo de Aves
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto rounded-2xl bg-slate-900 border border-amber-900/15 p-1 flex items-center justify-center min-h-[50vh]">
          <img
            src="/assets/aistudio/IMG-20261020-WA0049_5cc126f5.jpg"
            alt="Catálogo de aves Proyecto Eco-quest UNViM"
            className="w-full h-auto object-contain rounded-xl max-h-[75vh]"
          />
        </div>

        <div className="mt-3 pt-3 border-t border-amber-900/15 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <img src="/unvim-logo.png" alt="UNViM" className="w-5 h-5 object-contain" />
            <span>Licenciatura en Diseño de Comunicación • Tecnicatura Superior en Gestión Ambiental</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#263b2b] text-white font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
