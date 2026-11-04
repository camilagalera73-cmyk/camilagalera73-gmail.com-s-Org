import React, { useState, useEffect } from 'react';
import { X, Camera, MapPin, Calendar, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Bird, BirdSighting, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';
import { storageService } from '../services/storageService';

interface NewSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sighting: BirdSighting) => void;
  allBirds: Bird[];
  initialCoords?: { lat: number; lng: number; placeName?: string } | null;
  existingSighting?: BirdSighting | null;
}

export const NewSightingModal: React.FC<NewSightingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  allBirds,
  initialCoords,
  existingSighting
}) => {
  const [birdName, setBirdName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [lat, setLat] = useState(-33.6756);
  const [lng, setLng] = useState(-65.4578);
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState<EcoQuestCategory>('arboles');
  const [behavior, setBehavior] = useState<BirdSighting['behavior']>('Posado');
  const [notes, setNotes] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (existingSighting) {
      setBirdName(existingSighting.birdName);
      setScientificName(existingSighting.scientificName || '');
      setPlaceName(existingSighting.placeName);
      setDate(existingSighting.date);
      setTime(existingSighting.time);
      setLat(existingSighting.lat);
      setLng(existingSighting.lng);
      setCount(existingSighting.count || 1);
      setCategory(existingSighting.category);
      setBehavior(existingSighting.behavior);
      setNotes(existingSighting.notes);
      setPhotoBase64(existingSighting.photoBase64);
    } else {
      const now = new Date();
      const localDate = now.toISOString().split('T')[0];
      const localTime = now.toTimeString().slice(0, 5);

      setBirdName('');
      setScientificName('');
      setDate(localDate);
      setTime(localTime);
      setCount(1);
      setBehavior('Posado');
      setNotes('');
      setPhotoBase64(undefined);
      setErrorMsg(null);

      if (initialCoords) {
        setLat(initialCoords.lat);
        setLng(initialCoords.lng);
        setPlaceName(initialCoords.placeName || 'Punto en Villa Mercedes');
      } else {
        setLat(-33.6745);
        setLng(-65.4620);
        setPlaceName('Parque Costanera Río Quinto');
      }
    }
  }, [isOpen, initialCoords, existingSighting]);

  const handleBirdSelect = (name: string) => {
    setBirdName(name);
    const found = allBirds.find(b => b.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setScientificName(found.scientificName);
      setCategory(found.category);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    try {
      const compressed = await storageService.compressImage(file);
      setPhotoBase64(compressed);
    } catch {
      setErrorMsg('No se pudo procesar la foto.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birdName.trim()) {
      setErrorMsg('Por favor indicá el nombre del ave observada.');
      return;
    }
    if (!placeName.trim()) {
      setErrorMsg('Por favor indicá el lugar del avistamiento.');
      return;
    }

    const sighting: BirdSighting = {
      id: existingSighting?.id || 'sighting-' + Date.now(),
      birdName: birdName.trim(),
      scientificName: scientificName.trim() || undefined,
      placeName: placeName.trim(),
      date,
      time,
      lat,
      lng,
      count: Number(count) || 1,
      category,
      behavior,
      notes: notes.trim(),
      photoBase64,
      createdAt: existingSighting?.createdAt || Date.now()
    };

    onSave(sighting);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/15">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/95 p-1 border border-amber-900/15 shadow-sm flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Eco-Quest" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#9a561d] uppercase tracking-wider block">
                Proyecto Eco-quest • Villa Mercedes
              </span>
              <h2 className="text-2xl font-bold font-serif-fraunces text-[#263b2b]">
                {existingSighting ? 'Editar Ficha de Campo' : 'Nueva Ficha de Avistamiento'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Bird Name & Scientific Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Ave del catálogo Eco-quest *
              </label>
              <input
                type="text"
                list="birdOptions"
                value={birdName}
                onChange={e => handleBirdSelect(e.target.value)}
                placeholder="Ej. Pato de collar, Benteveo, Hornero..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800"
              />
              <datalist id="birdOptions">
                {allBirds.map(b => (
                  <option key={b.id} value={b.name}>
                    {b.scientificName} ({b.categoryLabel})
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Nombre científico (automático)
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={e => setScientificName(e.target.value)}
                placeholder="Ej. Callonetta leucophrys"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800 italic"
              />
            </div>
          </div>

          {/* Place and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Lugar de Villa Mercedes *
              </label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                placeholder="Ej. Dique Vulpiani, Costanera, Calle Angosta..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800"
              />
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Categoría Eco-quest
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EcoQuestCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-xs font-bold text-slate-800"
              >
                <option value="acuaticas">💧 Aves acuáticas y de humedales</option>
                <option value="arboles">🌳 Aves de árboles y arbustos</option>
                <option value="pastizales">🌾 Aves de espacios abiertos y pastizales</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Behavior selection */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Comportamiento observado
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              {(['Posado', 'En vuelo', 'Cantando', 'Alimentándose', 'En nido', 'En el agua'] as const).map(b => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBehavior(b)}
                  className={`py-2 px-1 rounded-xl text-center font-bold transition border ${
                    behavior === b
                      ? 'bg-[#263b2b] text-white border-[#263b2b] shadow-sm'
                      : 'bg-white border-amber-900/15 text-slate-700 hover:bg-amber-100/50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Capture Section (Camera & Gallery offline!) */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Foto del ave en el campo (Cámara / Galería)
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border-2 border-dashed border-amber-900/20">
              {photoBase64 ? (
                <div className="relative group w-28 h-28 rounded-xl overflow-hidden border border-amber-900/20 shadow-md shrink-0">
                  <img
                    src={photoBase64}
                    alt="Foto del avistamiento"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoBase64(undefined)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow transition"
                    title="Eliminar foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white border border-amber-900/15 grid place-items-center text-slate-400 shrink-0">
                  <Camera className="w-7 h-7 text-[#b66b22]" />
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-slate-700 font-medium mb-2">
                  {photoBase64
                    ? '✓ Foto lista para guardar sin internet en tu bitácora.'
                    : 'Tomá una foto en el campo con la cámara del celular o subí una desde tu galería.'}
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#b66b22] text-white hover:bg-[#9a561d] shadow-sm cursor-pointer transition active:scale-95">
                  <Camera className="w-4 h-4" />
                  <span>{photoBase64 ? 'Cambiar foto' : 'Capturar con cámara / Subir foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={photoLoading}
                  />
                </label>
                {photoLoading && <p className="text-[11px] text-amber-800 mt-1 animate-pulse">Comprimiendo imagen...</p>}
              </div>
            </div>
          </div>

          {/* Characteristics and Notes */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Características observadas y notas de campo
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describí plumaje, pico, patas, sonidos o si andaba sola o en bandada..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-xs text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-900/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1b2b1e] shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Guardar Ficha de Campo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
