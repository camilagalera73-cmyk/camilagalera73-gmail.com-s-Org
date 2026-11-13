import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1b2b1e] text-amber-50 py-12 px-4 sm:px-6 border-t border-emerald-950 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Brand & Description */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/isologo_transparent.png?v=7"
                alt="Logo Eco-Quest"
                className="h-10 w-auto object-contain shrink-0 filter drop-shadow-sm"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png?v=7';
                  }
                }}
              />
              <span className="font-bold text-lg font-serif-fraunces text-white">
                Eco-Quest
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-2 max-w-xl leading-relaxed">
              Guía de campo interactiva y mapa local de aves de Villa Mercedes (San Luis, Argentina). Funciona sin conexión a internet para disfrutar en tus salidas de campo.
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-amber-100 tracking-wide mt-2.5">
              Cuidemos juntos nuestra ciudad.
            </p>
          </div>
        </div>

        {/* Institutional Attribution: UNViMe + EICA + EGEE */}
        <div className="mt-8 pt-7 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#f4bb29]">
              Participantes del Proyecto
            </p>
          </div>

          {/* Official Logos Row: UNViMe full horizontal logo + EICA & EGEE square logos */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-7 max-w-5xl mx-auto">
            {/* UNViMe Full Horizontal Logo */}
            <div className="bg-[#fff9ed] px-5 py-3 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
              <img
                src="/assets/aistudio/logo-completo_63b4190c.png"
                alt="Universidad Nacional de Villa Mercedes"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            {/* EICA Square Logo + Label */}
            <div className="flex items-center gap-3.5 bg-white/5 px-4 py-3 rounded-xl border border-white/15">
              <img
                src="/assets/aistudio/EICA_daed0404.png"
                alt="EICA UNViMe - Escuela de Ingeniería y Ciencias Ambientales"
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain shrink-0"
              />
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  Escuela de Ingeniería y Ciencias Ambientales
                </span>
                <span className="block text-[11px] text-[#86efac] font-semibold mt-1">
                  Tec. Sup. en Gestión Ambiental
                </span>
              </div>
            </div>

            {/* EGEE Square Logo + Label */}
            <div className="flex items-center gap-3.5 bg-white/5 px-4 py-3 rounded-xl border border-white/15">
              <img
                src="/assets/aistudio/EGEE_a2c27f63.png"
                alt="EGEE UNViMe - Escuela de Gestión de Empresas y Economía"
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain shrink-0"
              />
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  Escuela de Gestión de Empresas y Economía
                </span>
                <span className="block text-[11px] text-[#f4bb29] font-semibold mt-1">
                  Lic. en Diseño de Comunicación
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
