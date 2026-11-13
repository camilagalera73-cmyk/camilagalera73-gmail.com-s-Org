import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Trash2, Edit3, Compass, ZoomIn } from 'lucide-react';
import { BirdSighting, CATEGORY_LABELS } from '../types/bird';
import { AudioPlayerBar } from './AudioPlayerBar';

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
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setIsImageZoomed(false);
  }, [sighting?.id]);

  if (!sighting) return null;

  const catMeta = CATEGORY_LABELS[sighting.category] || CATEGORY_LABELS.arboles;
  const photoSrc = sighting.photoBase64 || sighting.photoUrl;

  const handleConfirmDelete = () => {
    onDelete(sighting.id);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <>
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

          {/* Photo section: Imagen del ave que captó con opción de agrandar */}
          {photoSrc ? (
            <div className="mt-4 rounded-2xl overflow-hidden border border-amber-900/15 shadow-md max-h-80 bg-slate-900 relative group">
              <img
                src={photoSrc}
                alt={`Foto de ${sighting.birdName}`}
                onClick={() => setIsImageZoomed(true)}
                className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
              />

              {/* Botón para agrandar */}
              <button
                type="button"
                onClick={() => setIsImageZoomed(true)}
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-xs transition shadow-md active:scale-95 border border-white/20 cursor-pointer"
                title="Tocar para agrandar la imagen del ave"
              >
                <ZoomIn className="w-4 h-4 text-emerald-300" />
                <span>Agrandar imagen</span>
              </button>

              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-2 shadow-md pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fotografía del ave captada en el campo</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-900/15 text-center text-slate-700">
              <img src="/isologo_transparent.png?v=7" alt="" className="w-10 h-10 mx-auto mb-2 object-contain opacity-70" />
              <p className="text-xs font-bold text-[#263b2b]">Sin fotografía adjunta registrada en el campo.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Podés tocar en "Editar" para tomar o subir una foto con la cámara.</p>
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

          {/* User field audio */}
          {sighting.audioBase64 && (
            <div className="mt-4">
              <AudioPlayerBar
                src={sighting.audioBase64}
                title="Audio captado por el observador"
                subtitle={sighting.audioFileName}
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-amber-900/15 flex flex-wrap items-center justify-between gap-2">
            {confirmDelete ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-rose-900">¿Eliminar?</span>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onEdit(sighting);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                Editar Ficha y Foto
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

      {/* Visor de imagen agrandada a pantalla completa para el avistamiento */}
      {isImageZoomed && photoSrc && (
        <div 
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in"
          onClick={() => setIsImageZoomed(false)}
        >
          <div 
            className="w-full max-w-5xl flex items-center justify-between py-2 shrink-0 border-b border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <h3 className="text-white text-lg sm:text-2xl font-extrabold flex items-center gap-2">
                <span>{sighting.birdName}</span>
                {sighting.scientificName && (
                  <span className="text-emerald-300 italic text-sm sm:text-base font-normal">
                    ({sighting.scientificName})
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Registrado en {sighting.placeName} • {sighting.date}
              </p>
            </div>
            <button
              onClick={() => setIsImageZoomed(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold transition shadow-lg active:scale-95 cursor-pointer"
              aria-label="Cerrar imagen grande"
            >
              <X className="w-5 h-5" />
              <span>Cerrar</span>
            </button>
          </div>

          <div 
            className="flex-1 w-full max-w-5xl flex items-center justify-center p-2 min-h-0 my-3"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={photoSrc}
              alt={sighting.birdName}
              className="max-h-[78vh] sm:max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
            />
          </div>

          <div className="text-center py-1 text-xs text-white/70 shrink-0">
            Tocá en cualquier lugar exterior o en "Cerrar" para volver a la ficha
          </div>
        </div>
      )}
    </>
  );
};
