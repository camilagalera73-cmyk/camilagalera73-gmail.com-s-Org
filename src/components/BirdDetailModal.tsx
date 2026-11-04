import React from 'react';
import { X, MapPin, CheckCircle2, Plus } from 'lucide-react';
import { Bird, CATEGORY_LABELS } from '../types/bird';

interface BirdDetailModalProps {
  bird: Bird | null;
  onClose: () => void;
  onRecordSighting: (birdName: string) => void;
}

export const BirdDetailModal: React.FC<BirdDetailModalProps> = ({
  bird,
  onClose,
  onRecordSighting
}) => {
  if (!bird) return null;

  const catMeta = CATEGORY_LABELS[bird.category] || CATEGORY_LABELS.arboles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-amber-900/15">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${catMeta.color}`}>
                {catMeta.name}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Proyecto Eco-quest • Villa Mercedes
              </span>
            </div>
            <h2 className="text-3xl font-bold font-serif-fraunces text-[#263b2b]">
              {bird.name}
            </h2>
            <p className="text-sm italic text-slate-600 font-serif">
              {bird.scientificName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bird Photo */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-amber-900/15 shadow-md aspect-video max-h-72 bg-slate-900">
          <img
            src={bird.photoUrl}
            alt={bird.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Official Description from UNViM Brochure */}
        <div className="mt-5 p-4 rounded-2xl bg-white border border-amber-900/10 shadow-sm">
          <h4 className="text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
            Descripción de la especie (Catálogo de Villa Mercedes)
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {bird.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-amber-900/15 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100 transition"
          >
            Cerrar
          </button>

          <button
            onClick={() => {
              onRecordSighting(bird.name);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#b66b22] text-white hover:bg-[#9a561d] shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Registrar avistamiento de esta ave
          </button>
        </div>
      </div>
    </div>
  );
};
