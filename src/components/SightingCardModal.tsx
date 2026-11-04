import React from 'react';
import { X, Calendar, Clock, MapPin, Trash2, Edit3, Compass } from 'lucide-react';
import { BirdSighting, CATEGORY_LABELS } from '../types/bird';

interface SightingCardModalProps {
  sighting: BirdSighting | null;
  onClose: () => void;
  onEdit: (sighting: BirdSighting) => void;
  onDelete: (id: string) => void;
}

export const SightingCardModal: React.FC<SightingCardModalProps> = ({
  sighting,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!sighting) return null;

  const catMeta = CATEGORY_LABELS[sighting.category] || CATEGORY_LABELS.arboles;

  const handleDelete = () => {
    if (window.confirm(`¿Seguro que deseas eliminar la ficha de avistamiento de "${sighting.birdName}"?`)) {
      onDelete(sighting.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-amber-900/15">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#9a561d] uppercase block">
              Proyecto Eco-quest • Villa Mercedes
            </span>
            <h2 className="text-3xl font-bold font-serif-fraunces text-[#263b2b] mt-1">
              {sighting.birdName}
            </h2>
            {sighting.scientificName && (
              <p className="text-sm italic text-slate-600 font-serif">
                {sighting.scientificName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo if captured */}
        {(sighting.photoBase64 || sighting.photoUrl) ? (
          <div className="mt-4 rounded-2xl overflow-hidden border border-amber-900/15 shadow-md max-h-72 bg-slate-900">
            <img
              src={sighting.photoBase64 || sighting.photoUrl}
              alt={`Foto de ${sighting.birdName}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-900/15 text-center text-slate-600">
            <img src="/logo.png" alt="" className="w-9 h-9 mx-auto mb-1 object-contain opacity-70" />
            <p className="text-xs">Sin fotografía adjunta registrada en el campo.</p>
          </div>
        )}

        {/* Metadata badges */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-amber-900/15 shadow-sm">
            <span className="text-xs text-slate-600 uppercase font-extrabold block mb-1">Fecha</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#b66b22]" />
              {sighting.date}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-900/15 shadow-sm">
            <span className="text-xs text-slate-600 uppercase font-extrabold block mb-1">Hora</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#b66b22]" />
              {sighting.time || '--:--'}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-900/15 shadow-sm">
            <span className="text-xs text-slate-600 uppercase font-extrabold block mb-1">Cantidad</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900">
              {sighting.count} {sighting.count === 1 ? 'individuo' : 'individuos'}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-amber-900/15 shadow-sm">
            <span className="text-xs text-slate-600 uppercase font-extrabold block mb-1">Conducta</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900">
              {sighting.behavior}
            </span>
          </div>
        </div>

        {/* Place and Category */}
        <div className="mt-3.5 p-4 rounded-2xl bg-white border border-amber-900/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <MapPin className="w-4 h-4 text-[#1c7692] shrink-0" />
            <span className="font-extrabold text-sm sm:text-base">{sighting.placeName}</span>
          </div>
          <span className={`px-3 py-1 rounded-full font-bold border text-xs sm:text-sm ${catMeta.color}`}>
            {catMeta.name}
          </span>
        </div>

        {/* GPS Real Coordinates */}
        <div className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-700 px-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#1c7692]" />
          <span>Coordenadas en Villa Mercedes: {sighting.lat.toFixed(5)}, {sighting.lng.toFixed(5)}</span>
        </div>

        {/* Notes */}
        {sighting.notes ? (
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-900/15">
            <h4 className="text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
              Notas y características de campo
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {sighting.notes}
            </p>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 text-[11px] text-slate-500 italic">
            Sin notas adicionales registradas.
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-amber-900/15 flex items-center justify-between gap-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(sighting);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1c7692] text-white hover:bg-[#155b70] transition shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
