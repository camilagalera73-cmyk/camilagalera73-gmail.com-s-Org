import React, { useState } from 'react';
import { X, Camera, Check, AlertCircle } from 'lucide-react';
import { Bird, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';
import { storageService } from '../services/storageService';

interface AddBirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBirdAdded: (bird: Bird) => void;
}

export const AddBirdModal: React.FC<AddBirdModalProps> = ({
  isOpen,
  onClose,
  onBirdAdded
}) => {
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<EcoQuestCategory>('arboles');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await storageService.compressImage(file);
      setPhotoUrl(compressed);
    } catch {
      setErrorMsg('No se pudo procesar la foto.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor indicá el nombre del ave.');
      return;
    }

    const newBird: Bird = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      scientificName: scientificName.trim() || 'Especie silvestre',
      category,
      categoryLabel: CATEGORY_LABELS[category].name,
      description: description.trim() || 'Especie observada en Villa Mercedes.',
      photoUrl: photoUrl || 'https://images.pexels.com/photos/36824760/pexels-photo-36824760.jpeg?auto=compress&cs=tinysrgb&w=800',
      isCustom: true
    };

    storageService.saveCustomBird(newBird);
    onBirdAdded(newBird);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/15">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white/95 p-1 border border-amber-900/15 shadow-sm flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Eco-Quest" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif-fraunces text-[#263b2b]">
                Agregar Especie al Catálogo
              </h2>
              <p className="text-xs text-slate-600">
                Añadí una nueva ave a tu guía de campo local
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
                Nombre común *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Espinero grande, Tacuarita..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
                Nombre científico
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={e => setScientificName(e.target.value)}
                placeholder="Ej. Phacellodomus ruber"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs italic text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as EcoQuestCategory)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800 font-bold"
            >
              <option value="acuaticas">💧 Aves acuáticas y de humedales</option>
              <option value="arboles">🌳 Aves de árboles y arbustos</option>
              <option value="pastizales">🌾 Aves de espacios abiertos y pastizales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
              Foto de la especie
            </label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-amber-900/20" />
              ) : null}
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#b66b22] text-white cursor-pointer shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                <span>{photoUrl ? 'Cambiar foto' : 'Subir o capturar foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1">
              Descripción y características
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descripción del ave, plumaje y comportamiento..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-900/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] shadow-md"
            >
              <Check className="w-4 h-4" />
              Guardar en Catálogo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
