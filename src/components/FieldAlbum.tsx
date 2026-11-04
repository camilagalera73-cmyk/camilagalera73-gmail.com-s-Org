import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { Bird, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';
import { storageService } from '../services/storageService';

interface FieldAlbumProps {
  birds: Bird[];
  onSelectBird: (bird: Bird) => void;
}

export const FieldAlbum: React.FC<FieldAlbumProps> = ({ birds, onSelectBird }) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = storageService.getAlbumChecked();
    setCheckedMap(saved);
  }, []);

  const totalBirds = birds.length;
  const spottedCount = birds.filter(b => !!checkedMap[b.id]).length;
  const progressPercent = totalBirds > 0 ? Math.round((spottedCount / totalBirds) * 100) : 0;

  const toggleBird = (birdId: string) => {
    const updated = {
      ...checkedMap,
      [birdId]: !checkedMap[birdId]
    };
    setCheckedMap(updated);
    storageService.setAlbumChecked(updated);

    const newSpotted = birds.filter(b => !!updated[b.id]).length;
    if (newSpotted === totalBirds && totalBirds > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Seguro que deseas desmarcar todas las aves observadas de tu álbum?')) {
      setCheckedMap({});
      storageService.setAlbumChecked({});
    }
  };

  const categories: EcoQuestCategory[] = ['acuaticas', 'arboles', 'pastizales'];

  return (
    <section id="album-check" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="leaf-card bg-white rounded-organic p-6 sm:p-8 relative overflow-hidden shadow-md">
        {/* Manchas orgánicas de fondo */}
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -right-8 -top-10 w-48 sm:w-64 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
        />
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -left-10 -bottom-10 w-44 sm:w-56 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
        />
        <img
          src="/blob-shape.jpg"
          alt=""
          aria-hidden="true"
          className="absolute right-1/3 -bottom-12 w-36 sm:w-48 h-auto opacity-15 mix-blend-multiply pointer-events-none select-none rotate-90"
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#9a561d] uppercase block">
              Proyecto Eco-quest • Villa Mercedes
            </span>
            <h2 className="text-3xl font-extrabold font-serif-fraunces text-[#263b2b]">
              Álbum de Monitoreo de Especies
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Marcá las aves del catálogo que vayas reconociendo en tus salidas de campo por Villa Mercedes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#263b2b]">
              Viste {spottedCount} de {totalBirds} especies ({progressPercent}%)
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition"
              title="Restablecer marcas"
            >
              Desmarcar todas
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="h-3 w-full bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f4bb29] via-[#b66b22] to-[#557544] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Celebration */}
        {spottedCount === totalBirds && totalBirds > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-bounce">
            <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">¡Felicitaciones! Has registrado las 22 aves del catálogo Eco-quest.</p>
              <p className="text-xs text-emerald-800">Completaste el monitoreo de la biósfera en Villa Mercedes.</p>
            </div>
          </div>
        )}

        {/* Birds Checklist grouped by the 3 official categories */}
        <div className="mt-6 space-y-6">
          {categories.map(cat => {
            const catBirds = birds.filter(b => b.category === cat);
            const catMeta = CATEGORY_LABELS[cat];
            if (catBirds.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: catMeta.dotColor }} />
                  <h3 className="text-base font-bold text-[#263b2b]">
                    {catMeta.name} ({catBirds.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catBirds.map(bird => {
                    const isChecked = !!checkedMap[bird.id];
                    return (
                      <div
                        key={bird.id}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-amber-500/5 border-amber-900/10 hover:bg-amber-500/10'
                        }`}
                      >
                        <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBird(bird.id)}
                            className="w-5 h-5 rounded accent-[#557544] cursor-pointer"
                          />
                          <div>
                            <span className={`text-sm sm:text-base font-bold block ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                              {bird.name}
                            </span>
                            <span className="text-xs sm:text-sm italic font-semibold text-slate-700 block">
                              {bird.scientificName}
                            </span>
                          </div>
                        </label>

                        <button
                          type="button"
                          onClick={() => onSelectBird(bird)}
                          className="text-xs sm:text-sm font-bold text-[#1c7692] hover:text-[#145366] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-sky-50 shadow-xs transition shrink-0"
                        >
                          Ver ficha
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
};
