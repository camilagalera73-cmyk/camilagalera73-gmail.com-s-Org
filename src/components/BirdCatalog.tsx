import React, { useState } from 'react';
import { Search, Plus, Eye, List, LayoutGrid, ChevronRight, Image as ImageIcon, Volume2 } from 'lucide-react';
import { Bird, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';

interface BirdCatalogProps {
  birds: Bird[];
  onSelectBird: (bird: Bird) => void;
  onRecordSighting: (birdName: string) => void;
  onViewOriginalBrochure: () => void;
}

export const BirdCatalog: React.FC<BirdCatalogProps> = ({
  birds,
  onSelectBird,
  onRecordSighting,
  onViewOriginalBrochure
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredBirds = birds.filter(bird => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nameMatch = bird.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term) ||
                      bird.scientificName.toLowerCase().includes(term) ||
                      bird.description.toLowerCase().includes(term);

    const categoryMatch = selectedCategory === 'all' || bird.category === selectedCategory;

    return nameMatch && categoryMatch;
  });

  return (
    <section id="aves" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Institutional Branding with Organic Blob Manchas */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f4f7ee]/90 border border-emerald-900/15 p-6 sm:p-8 md:p-10 shadow-sm mb-8 transition-all">
        {/* Organic Blob Manchas */}
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -right-8 -top-12 w-52 sm:w-72 h-auto opacity-35 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
        />
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -left-10 -bottom-10 w-44 sm:w-60 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
        />
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute left-1/3 -top-12 w-36 sm:w-48 h-auto opacity-15 mix-blend-multiply pointer-events-none select-none rotate-45"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#263b2b] tracking-tight">
              Identificá un Ave
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
              Seleccioná cualquier especie de la lista para abrir su ficha con fotografía, sonido e información detallada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onViewOriginalBrochure}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-white border border-amber-900/20 text-[#263b2b] hover:bg-amber-100/70 transition shadow-sm active:scale-95"
            >
              <ImageIcon className="w-4 h-4 text-[#1c7692]" />
              Ver Lámina Oficial
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar and View Switcher */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-amber-900/15 shadow-sm space-y-4 mb-6">
        {/* Search Input & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar ave por nombre (ej. Pato de collar, Benteveo, Hornero, Churrinche...)"
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-amber-500/5 border border-amber-900/20 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3a1c36]"
            />
          </div>

          {/* View Mode Toggle: Lista (default) vs Cuadrícula */}
          <div className="inline-flex items-center bg-[#f4f7ee] p-1 rounded-2xl border border-amber-900/15 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-[#3a1c36] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Ver solo lista de nombres de aves"
            >
              <List className="w-4 h-4" />
              Lista de Nombres
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-[#3a1c36] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
              title="Ver en tarjetas con fotos"
            >
              <LayoutGrid className="w-4 h-4" />
              Con Fotos
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
          <span className="text-slate-700 font-extrabold text-xs sm:text-sm whitespace-nowrap pl-1">
            Ambiente:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#3a1c36] text-white shadow-xs'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            Todas ({birds.length})
          </button>

          <button
            onClick={() => setSelectedCategory('acuaticas')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'acuaticas'
                ? 'bg-[#308ba8] text-white shadow-xs'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#308ba8]" />
            Acuáticas y humedales
          </button>

          <button
            onClick={() => setSelectedCategory('arboles')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'arboles'
                ? 'bg-[#557544] text-white shadow-xs'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#557544]" />
            Árboles y arbustos
          </button>

          <button
            onClick={() => setSelectedCategory('pastizales')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'pastizales'
                ? 'bg-[#b66b22] text-white shadow-xs'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#b66b22]" />
            Pastizales y abiertos
          </button>
        </div>
      </div>

      {/* Bird Listing Section */}
      {filteredBirds.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-3xl border border-amber-900/15 p-8">
          <img src="/isologo_transparent.png?v=7" alt="" className="w-14 h-14 mx-auto mb-3 object-contain opacity-50" />
          <h3 className="text-lg font-bold text-[#263b2b]">No se encontraron aves con ese nombre</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Probá con otro término o seleccioná "Todas" para ver la lista completa de especies de Villa Mercedes.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-5 py-2 rounded-full text-xs font-bold bg-[#3a1c36] text-white hover:bg-[#281325]"
          >
            Restablecer lista
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST OF NAMES ONLY VIEW (Requested by User) */
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            <span>{filteredBirds.length} aves registradas (hacé clic sobre el nombre para abrir la ficha)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredBirds.map(bird => {
              const catMeta = CATEGORY_LABELS[bird.category] || CATEGORY_LABELS.arboles;
              return (
                <button
                  key={bird.id}
                  onClick={() => onSelectBird(bird)}
                  className="w-full text-left bg-white hover:bg-[#fbfbf8] rounded-2xl p-4 sm:p-5 border border-amber-900/15 hover:border-[#3a1c36]/40 shadow-xs hover:shadow-md transition-all group flex items-center justify-between gap-3 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Small category color dot */}
                    <span 
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                        bird.category === 'acuaticas'
                          ? 'bg-[#308ba8]'
                          : bird.category === 'arboles'
                          ? 'bg-[#557544]'
                          : 'bg-[#b66b22]'
                      }`}
                      title={catMeta.name}
                    />

                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-[#263b2b] group-hover:text-[#3a1c36] transition-colors truncate">
                        {bird.name}
                      </h3>
                      <p className="text-xs italic text-[#3a1c36] font-medium truncate">
                        {bird.scientificName} • <span className="not-italic font-normal text-slate-600">{catMeta.name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {bird.audioUrl && (
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-[#557544] border border-emerald-900/15"
                        title="Incluye canto del ave"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="hidden sm:inline-block text-xs font-bold text-[#3a1c36] bg-[#3a1c36]/8 px-3 py-1 rounded-full group-hover:bg-[#3a1c36] group-hover:text-white transition-colors">
                      Ver ficha
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#3a1c36] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* GRID WITH PHOTOS VIEW (Alternative) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBirds.map(bird => {
            const catMeta = CATEGORY_LABELS[bird.category] || CATEGORY_LABELS.arboles;
            return (
              <article
                key={bird.id}
                className="leaf-card bg-white rounded-organic overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1.5 border border-amber-900/15 shadow-sm"
              >
                {/* Photo */}
                <div 
                  onClick={() => onSelectBird(bird)}
                  className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={bird.photoUrl}
                    alt={bird.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${catMeta.color}`}>
                      {catMeta.name}
                    </span>
                  </div>
                  {bird.audioUrl && (
                    <div
                      className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white backdrop-blur-xs shadow-sm"
                      title="Incluye canto del ave"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div 
                    onClick={() => onSelectBird(bird)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b] hover:text-[#3a1c36] transition-colors">
                      {bird.name}
                    </h3>
                    <p className="text-sm font-semibold italic text-slate-600 font-serif mb-2">
                      {bird.scientificName}
                    </p>

                    <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed mb-4">
                      {bird.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectBird(bird)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-[#3a1c36] hover:bg-[#3a1c36]/10 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver ficha
                    </button>

                    <button
                      onClick={() => onRecordSighting(bird.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Avisté esta
                    </button>
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
