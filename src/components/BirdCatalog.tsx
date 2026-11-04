import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Bird, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';

interface BirdCatalogProps {
  birds: Bird[];
  onSelectBird: (bird: Bird) => void;
  onRecordSighting: (birdName: string) => void;
  onAddNewBird: () => void;
  onViewOriginalBrochure: () => void;
}

export const BirdCatalog: React.FC<BirdCatalogProps> = ({
  birds,
  onSelectBird,
  onRecordSighting,
  onAddNewBird,
  onViewOriginalBrochure
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBirds = birds.filter(bird => {
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nameMatch = bird.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term) ||
                      bird.scientificName.toLowerCase().includes(term) ||
                      bird.description.toLowerCase().includes(term);

    const categoryMatch = selectedCategory === 'all' || bird.category === selectedCategory;

    return nameMatch && categoryMatch;
  });

  return (
    <section id="aves" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Institutional Branding with Organic Blob Manchas & Generous Padding */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f4f7ee]/90 border border-emerald-900/15 p-6 sm:p-8 md:p-10 shadow-sm mb-8 transition-all">
        {/* Organic Blob Manchas (from user image asset) */}
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
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9a561d] bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-900/15 shadow-xs flex items-center gap-1.5">
                <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
                Eco-Quest • Universidad Nacional de Villa Mercedes
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b] tracking-tight">
              Catálogo Oficial de Aves
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              Aula viva, ciencia ciudadana y monitoreo de la biósfera en Villa Mercedes, San Luis. Las 22 especies oficiales del proyecto clasificadas por ambiente natural.
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

            <button
              onClick={onAddNewBird}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Sumar otra especie
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-amber-900/15 shadow-sm space-y-3 mb-8">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre común o científico (ej. Pato de collar, Benteveo, Anas, Gallinula...)"
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-amber-500/5 border border-amber-900/20 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1c7692]"
          />
        </div>

        {/* 3 Eco-quest Category Filter Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-sm no-scrollbar">
          <span className="text-slate-700 font-extrabold text-xs sm:text-sm whitespace-nowrap pl-1">
            Categorías:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#263b2b] text-white shadow-sm'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            Todas ({birds.length})
          </button>

          <button
            onClick={() => setSelectedCategory('acuaticas')}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === 'acuaticas'
                ? 'bg-[#308ba8] text-white shadow-sm'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-[#308ba8]" />
            Aves acuáticas y de humedales
          </button>

          <button
            onClick={() => setSelectedCategory('arboles')}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === 'arboles'
                ? 'bg-[#557544] text-white shadow-sm'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-[#557544]" />
            Aves de árboles y arbustos
          </button>

          <button
            onClick={() => setSelectedCategory('pastizales')}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === 'pastizales'
                ? 'bg-[#b66b22] text-white shadow-sm'
                : 'bg-white border border-amber-900/15 text-slate-800 hover:bg-amber-100/70'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-[#b66b22]" />
            Aves de espacios abiertos y pastizales
          </button>
        </div>
      </div>

      {/* Bird Cards Grid */}
      {filteredBirds.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-3xl border border-amber-900/15 p-8">
          <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-3 object-contain opacity-50" />
          <h3 className="text-lg font-bold text-[#263b2b]">No se encontraron aves con ese criterio</h3>
          <p className="text-xs text-slate-600 mt-1">
            Revisá la ortografía o seleccioná "Todas" para ver el catálogo completo de Villa Mercedes.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-[#1c7692] text-white"
          >
            Restablecer catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBirds.map(bird => {
            const catMeta = CATEGORY_LABELS[bird.category] || CATEGORY_LABELS.arboles;
            return (
              <article
                key={bird.id}
                className="leaf-card bg-white rounded-organic overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1.5"
              >
                {/* Photo */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={bird.photoUrl}
                    alt={bird.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b]">
                      {bird.name}
                    </h3>
                    <p className="text-sm font-semibold italic text-slate-700 font-serif mb-2">
                      {bird.scientificName}
                    </p>

                    <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed mb-4">
                      {bird.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectBird(bird)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-[#1c7692] hover:bg-sky-50 hover:text-[#145366] transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver ficha
                    </button>

                    <button
                      onClick={() => onRecordSighting(bird.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-sm active:scale-95"
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
