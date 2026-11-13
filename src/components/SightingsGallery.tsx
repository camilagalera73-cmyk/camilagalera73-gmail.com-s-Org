import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Search,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { BirdSighting, Bird, CATEGORY_LABELS } from '../types/bird';
import { AudioPlayerBar } from './AudioPlayerBar';

interface SightingsGalleryProps {
  sightings: BirdSighting[];
  allBirds?: Bird[];
  onOpenNewSighting: () => void;
  onOpenLogbook?: () => void;
  onSelectSighting: (sighting: BirdSighting) => void;
  onFocusOnMap?: (sighting: BirdSighting) => void;
  onEditSighting: (sighting: BirdSighting) => void;
  onDeleteSighting: (id: string) => void;
}

export const SightingsGallery: React.FC<SightingsGalleryProps> = ({
  sightings,
  allBirds = [],
  onOpenNewSighting,
  onOpenLogbook,
  onSelectSighting,
  onEditSighting,
  onDeleteSighting
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWithPhoto, setFilterWithPhoto] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = sightings.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesTerm = s.birdName.toLowerCase().includes(term) ||
                        s.placeName.toLowerCase().includes(term) ||
                        (s.notes && s.notes.toLowerCase().includes(term));
    const matchesPhoto = filterWithPhoto ? !!s.photoBase64 : true;
    return matchesTerm && matchesPhoto;
  });

  return (
    <section id="album" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header with Title and Actions wrapped in a solid card to guarantee full legibility */}
      <div className="leaf-card bg-[#fff9ed]/95 rounded-3xl p-6 sm:p-8 border border-amber-900/15 shadow-sm relative overflow-hidden mb-6">
        {/* Organic background manchas */}
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -right-8 -top-8 w-48 sm:w-60 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
        />
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -left-10 -bottom-10 w-40 sm:w-52 h-auto opacity-15 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#3a1c36] mb-1">
              Tu Libreta de Campo
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b]">
              Mis Fichas de Avistamiento
            </h2>
            <p className="text-sm text-slate-700 font-medium mt-1">
              {sightings.length} {sightings.length === 1 ? 'registro guardado' : 'registros guardados'} en este dispositivo (100% disponible sin internet).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View & Print Field Logbook (Primary action) */}
            {onOpenLogbook && (
              <button
                onClick={onOpenLogbook}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-md transition active:scale-95"
                title="Abrir tu cuaderno de bitácora interactivo para ver todo tu historial de observaciones, imprimir o guardar en PDF"
              >
                <BookOpen className="w-4 h-4 text-[#f4bb29]" />
                Ver Cuaderno de Bitácora
              </button>
            )}

            {/* New Sighting */}
            <button
              onClick={onOpenNewSighting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-[#edd8ab] text-[#263b2b] hover:bg-[#e4cc98] border border-amber-900/30 shadow-xs transition active:scale-95"
              title="Registrar un nuevo avistamiento de ave en Villa Mercedes"
            >
              <Plus className="w-4 h-4 text-[#557544]" />
              Nueva Ficha
            </button>
          </div>
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
          <img src="/isologo_transparent.png?v=7" alt="" className="w-14 h-14 mx-auto mb-3 object-contain opacity-50" />
          <h3 className="text-xl font-bold text-[#263b2b]">Tu libreta de campo está lista</h3>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Aún no tenés fichas registradas. Salí a explorar Villa Mercedes, observá un ave y creá tu propia ficha de campo con foto, notas y ubicación.
          </p>
          <button
            onClick={onOpenNewSighting}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Crear mi primera ficha de avistamiento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => {
            const refBird = allBirds.find(
              b => b.name.toLowerCase() === s.birdName.toLowerCase() ||
                   (s.scientificName && b.scientificName.toLowerCase() === s.scientificName.toLowerCase())
            );
            const displayPhoto = s.photoBase64 || s.photoUrl || refBird?.photoUrl || '/birds/hornero.jpg';
            const hasFieldPhoto = !!(s.photoBase64 || s.photoUrl);
            const catMeta = CATEGORY_LABELS[s.category] || CATEGORY_LABELS.arboles;

            return (
              <article
                key={s.id}
                className="leaf-card bg-white rounded-organic overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-amber-900/15"
              >
                {/* SECCIÓN 1: IMAGEN DEL AVE QUE CAPTÓ */}
                <div 
                  onClick={() => onSelectSighting(s)}
                  className="relative h-56 bg-slate-900 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={displayPhoto}
                    alt={`Foto de ${s.birdName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (refBird?.photoUrl && target.src !== refBird.photoUrl) {
                        target.src = refBird.photoUrl;
                      }
                    }}
                  />

                  {/* Gradient shadow overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                  {/* Badge de Categoría */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border shadow-md ${catMeta.color}`}>
                      {catMeta.name}
                    </span>
                  </div>

                  {/* Badge de Foto capturada o ilustración */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>{hasFieldPhoto ? 'Foto capturada en el campo' : 'Ilustración del ave'}</span>
                  </div>

                  {/* Indicador de ampliar */}
                  <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* SECCIÓN 2: TODOS LOS DATOS DEL AVE */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Título y Conducta */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 
                          onClick={() => onSelectSighting(s)}
                          className="text-xl sm:text-2xl font-bold font-serif-fraunces text-[#263b2b] cursor-pointer hover:text-[#3a1c36] transition leading-tight"
                        >
                          {s.birdName}
                        </h3>
                        {s.scientificName && (
                          <p className="text-xs sm:text-sm italic font-medium text-slate-500 mt-0.5 font-serif">
                            {s.scientificName}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-[#5c310b] shrink-0 border border-amber-900/10">
                        {s.behavior}
                      </span>
                    </div>

                    {/* Bloque: Lugar donde se encuentra en Villa Mercedes */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-900/10">
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                        <MapPin className="w-4 h-4 text-[#3a1c36] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#9a561d] block">
                            Lugar de avistamiento:
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {s.placeName}
                          </span>
                          {s.lat && s.lng && (
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              Coordenadas: {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bloque: Fecha, Hora y Cantidad */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-700">
                      <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 flex items-center gap-1.5 shadow-2xs">
                        <Calendar className="w-3.5 h-3.5 text-[#3a1c36]" />
                        <span className="font-bold text-slate-800">{s.date}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 flex items-center gap-1.5 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-[#3a1c36]" />
                        <span className="font-bold text-slate-800">{s.time || 'Registro diurno'}</span>
                      </div>
                    </div>

                    <div className="mt-2 p-2.5 rounded-xl bg-white border border-amber-900/10 flex items-center justify-between text-xs text-slate-700 shadow-2xs">
                      <span className="font-medium text-slate-600">Ejemplares observados:</span>
                      <span className="font-extrabold text-sm text-[#263b2b]">
                        {s.count} {s.count === 1 ? 'individuo' : 'individuos'}
                      </span>
                    </div>

                    {/* Bloque: Notas y características observadas */}
                    {s.notes && (
                      <div className="mt-2.5 p-3 rounded-2xl bg-[#f4f7ee] border border-green-900/10 text-xs text-slate-700">
                        <span className="font-extrabold text-[#263b2b] block mb-0.5">
                          Características observadas:
                        </span>
                        <p className="italic leading-relaxed line-clamp-2">
                          "{s.notes}"
                        </p>
                      </div>
                    )}

                    {/* Bloque: Audio captado por el usuario */}
                    {s.audioBase64 && (
                      <div className="mt-2.5">
                        <AudioPlayerBar
                          compact
                          src={s.audioBase64}
                          title={s.audioFileName || 'Audio captado en campo'}
                        />
                      </div>
                    )}
                  </div>

                  {/* Acciones de la ficha */}
                  <div className="mt-4 pt-3.5 border-t border-amber-900/10 flex items-center justify-between text-sm">
                    {confirmDeleteId === s.id ? (
                      <div className="w-full flex items-center justify-between gap-2 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2">
                        <span className="text-xs font-bold text-rose-900">
                          ¿Eliminar esta ficha?
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteSighting(s.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition shadow-xs active:scale-95"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectSighting(s)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-sm active:scale-95"
                        >
                          <span>Ver ficha completa</span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditSighting(s)}
                            className="p-2 rounded-xl text-slate-700 hover:bg-amber-100 transition"
                            title="Editar ficha y foto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(s.id)}
                            className="p-2 rounded-xl text-rose-700 hover:bg-rose-100 transition"
                            title="Eliminar ficha"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
