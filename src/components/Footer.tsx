import React from 'react';
import { Heart, Download } from 'lucide-react';
import { storageService } from '../services/storageService';

export const Footer: React.FC = () => {
  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-eco-quest-villa-mercedes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="bg-[#1b2b1e] text-amber-50 py-12 px-4 sm:px-6 border-t border-emerald-950 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/95 p-1 border border-white/30 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Logo Eco-Quest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('icon-192.png')) {
                    target.src = '/icon-192.png';
                  }
                }}
              />
            </div>
            <span className="font-bold text-lg font-serif-fraunces text-white">
              Eco-Quest
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1 max-w-md">
            Guía de campo interactiva y mapa local de aves de Villa Mercedes (San Luis, Argentina). Funciona sin conexión a internet para disfrutar en tus salidas de campo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
          >
            <Download className="w-3.5 h-3.5 text-[#f4bb29]" />
            Descargar copia de mi bitácora
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/80">
        <p className="font-medium text-amber-100">
          Cuidemos juntos nuestra ciudad.
        </p>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-sm flex items-center justify-center">
            <img
              src="/unvim-logo.png"
              alt="Universidad Nacional de Villa Mercedes"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/aistudio/C9Mvpprn_400x400_2e201597.png';
              }}
            />
          </div>
          <p className="text-amber-200/90 font-medium">
            Hecho por alumnos de la Licenciatura en Diseño de Comunicación
          </p>
        </div>
      </div>
    </footer>
  );
};
