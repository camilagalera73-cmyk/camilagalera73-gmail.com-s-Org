import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BirdSighting } from '../types/bird';
import { storageService } from '../services/storageService';

interface SightingsGalleryProps {
  sightings: BirdSighting[];
  onOpenNewSighting: () => void;
  onSelectSighting: (sighting: BirdSighting) => void;
  onFocusOnMap: (sighting: BirdSighting) => void;
  onEditSighting: (sighting: BirdSighting) => void;
  onDeleteSighting: (id: string) => void;
  onImportDone: () => void;
}

export const SightingsGallery: React.FC<SightingsGalleryProps> = ({
  sightings,
  onOpenNewSighting,
  onSelectSighting,
  onFocusOnMap,
  onEditSighting,
  onDeleteSighting,
  onImportDone
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWithPhoto, setFilterWithPhoto] = useState(false);

  const filtered = sightings.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesTerm = s.birdName.toLowerCase().includes(term) ||
                        s.placeName.toLowerCase().includes(term) ||
                        (s.notes && s.notes.toLowerCase().includes(term));
    const matchesPhoto = filterWithPhoto ? !!s.photoBase64 : true;
    return matchesTerm && matchesPhoto;
  });

  const handleExport = () => {
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-aves-villa-mercedes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importBackup(content);
      if (success) {
        alert('¡Bitácora y avistajes importados con éxito!');
        onImportDone();
      } else {
        alert('El archivo no tiene el formato válido de respaldo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section id="album" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#9a561d] mb-1">
            Tu Libreta de Campo
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b]">
            Mis Fichas de Avistamiento
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {sightings.length} {sightings.length === 1 ? 'registro guardado' : 'registros guardados'} en este dispositivo (100% disponible sin internet).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Backup Export */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-white border border-amber-900/20 text-slate-800 hover:bg-amber-100/70 shadow-sm transition active:scale-95"
            title="Descargar copia de seguridad con fotos y datos"
          >
            <Download className="w-4 h-4 text-[#1c7692]" />
            Respaldar bitácora
          </button>

          {/* Backup Import */}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-white border border-amber-900/20 text-slate-800 hover:bg-amber-100/70 shadow-sm transition cursor-pointer active:scale-95">
            <Upload className="w-4 h-4 text-[#b66b22]" />
            Importar
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* New Sighting */}
          <button
            onClick={onOpenNewSighting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold bg-[#b66b22] text-white hover:bg-[#9a561d] shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nueva Ficha
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 p-4 rounded-3xl border border-amber-900/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por ave o lugar..."
            className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-amber-500/5 border border-amber-900/20 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1c7692]"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={filterWithPhoto}
            onChange={e => setFilterWithPhoto(e.target.checked)}
            className="h-4 w-4 rounded accent-[#b66b22]"
          />
          <span>Mostrar solo con foto de campo</span>
        </label>
      </div>

      {/* Grid of User Sightings */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-3xl border border-amber-900/15 p-8">
          <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-3 object-contain opacity-50" />
          <h3 className="text-lg font-bold text-[#263b2b]">Aún no hay fichas que coincidan</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Registrá las aves que encuentres en el Dique Vulpiani, Costanera Río V o en cualquier rincón de Villa Mercedes.
          </p>
          <button
            onClick={onOpenNewSighting}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Crear mi primera ficha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <article
              key={s.id}
              className="leaf-card bg-white rounded-organic overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Photo or placeholder */}
              {(s.photoBase64 || s.photoUrl) ? (
                <div 
                  onClick={() => onSelectSighting(s)}
                  className="relative h-44 bg-slate-900 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={s.photoBase64 || s.photoUrl}
                    alt={s.birdName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    <Camera className="w-3 h-3 text-[#f4bb29]" />
                    Foto de campo
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => onSelectSighting(s)}
                  className="h-28 bg-[#f5ecd7] flex items-center justify-center text-slate-400 cursor-pointer"
                >
                  <div className="text-center">
                    <img src="/logo.png" alt="" className="w-8 h-8 mx-auto mb-1 object-contain opacity-60" />
                    <span className="text-[11px] text-slate-500 font-medium">Sin foto de campo</span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 
                      onClick={() => onSelectSighting(s)}
                      className="text-xl font-bold font-serif-fraunces text-[#263b2b] cursor-pointer hover:text-[#1c7692] transition"
                    >
                      {s.birdName}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 shrink-0 border border-amber-900/10">
                      {s.behavior}
                    </span>
                  </div>

                  {s.scientificName && (
                    <p className="text-sm italic font-semibold text-slate-700 font-serif mb-2">
                      {s.scientificName}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-sm text-slate-800 mb-2">
                    <MapPin className="w-4 h-4 text-[#1c7692] shrink-0" />
                    <span className="font-bold truncate">{s.placeName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 mb-3">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-4 h-4 text-[#b66b22]" />
                      {s.date}
                    </span>
                    {s.time && (
                      <span className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-4 h-4 text-[#b66b22]" />
                        {s.time}
                      </span>
                    )}
                    <span className="text-slate-700">• {s.count} {s.count === 1 ? 'ejemplar' : 'ejemplares'}</span>
                  </div>

                  {s.notes && (
                    <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 italic bg-amber-500/10 p-2.5 rounded-xl mb-3 border border-amber-900/10">
                      "{s.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between text-sm">
                  <button
                    onClick={() => onFocusOnMap(s)}
                    className="inline-flex items-center gap-1.5 font-bold text-[#1c7692] hover:text-[#155b70] transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver en el mapa
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditSighting(s)}
                      className="p-2 rounded-xl text-slate-700 hover:bg-amber-100 transition"
                      title="Editar ficha"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la ficha de ${s.birdName}?`)) {
                          onDeleteSighting(s.id);
                        }
                      }}
                      className="p-2 rounded-xl text-rose-700 hover:bg-rose-100 transition"
                      title="Eliminar ficha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
