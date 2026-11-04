import React from 'react';
import { ShieldCheck, HeartHandshake, Phone, AlertTriangle, Droplets, MapPin } from 'lucide-react';

export const ConservationGuide: React.FC = () => {
  return (
    <section id="conservacion" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#9a561d] mb-1">
          Ciencia Ciudadana y Conservación
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b]">
          Monitoreo de la Biósfera en Villa Mercedes
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Proyecto Eco-quest de la Universidad Nacional de Villa Mercedes: conocer para valorar y proteger los ecosistemas del Río Quinto y sus aves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pichón caído o ave herida */}
        <div className="leaf-card bg-white rounded-organic p-6 sm:p-7 relative overflow-hidden shadow-md">
          {/* Manchas orgánicas de fondo */}
          <img
            src="/blob-shape.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -right-8 -top-8 w-44 sm:w-56 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
          />
          <img
            src="/blob-shape.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -left-10 -bottom-10 w-40 sm:w-52 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-[#b66b22]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b]">
                ¿Encontraste un pichón o ave en el suelo?
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#557544] mt-0.5">1.</span>
                <span><b>Observá primero sin tocar:</b> En primavera, muchos pichones volantones aprenden a volar cerca del suelo mientras sus padres los vigilan y alimentan desde ramas cercanas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#557544] mt-0.5">2.</span>
                <span><b>Alejá mascotas:</b> Si hay perros o gatos cerca, podés colocar con cuidado al pichón en una rama baja o arbusto fuera de su alcance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#557544] mt-0.5">3.</span>
                <span><b>No le des leche ni agua forzada:</b> El líquido forzado en el pico puede ingresar a sus vías respiratorias y causarle asfixia.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#557544] mt-0.5">4.</span>
                <span><b>Si está visiblemente herido:</b> Colocalo en una caja de cartón ventilada a oscuras y comunicate con las autoridades ambientales de Villa Mercedes y San Luis.</span>
              </li>
            </ul>

            <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-900/15">
              <p className="text-xs sm:text-sm font-extrabold text-[#7e4218] flex items-center gap-1.5 mb-2">
                <Phone className="w-4 h-4 text-[#b66b22]" /> Contacto de atención ambiental en San Luis y Villa Mercedes:
              </p>
              <div className="bg-white/95 p-3.5 rounded-xl border border-amber-900/10 mb-2.5 flex items-center justify-between flex-wrap gap-2.5 shadow-xs">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-600 block">Teléfono de atención directa:</span>
                  <a 
                    href="tel:02664452000" 
                    className="text-base font-extrabold text-[#263b2b] hover:text-[#1c7692] transition flex items-center gap-1"
                  >
                    📞 0266 445-2000
                  </a>
                </div>
                <a
                  href="tel:02664452000"
                  className="px-4 py-2 rounded-full text-sm font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-xs"
                >
                  Llamar ahora
                </a>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                • <b>Policía Ambiental / Rescate de Fauna:</b> 0266 445-2000<br />
                • <b>Secretaría de Ambiente y Desarrollo Sustentable de San Luis:</b> Coordinación para asistencia y liberación.<br />
                • <b>Subsecretaría de Medio Ambiente Municipal de Villa Mercedes:</b> Atención de emergencias de arbolado y espacios públicos.
              </p>
            </div>
          </div>
        </div>

        {/* Buenas prácticas en humedales y riberas del Río V */}
        <div className="leaf-card bg-white rounded-organic p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md">
          {/* Manchas orgánicas de fondo */}
          <img
            src="/blob-shape.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -right-8 -top-8 w-44 sm:w-56 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-45 transition-transform duration-700"
          />
          <img
            src="/blob-shape.jpg"
            alt=""
            aria-hidden="true"
            className="absolute -left-10 -bottom-10 w-40 sm:w-52 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-12 scale-x-[-1]"
          />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-sky-500/10 text-[#1c7692]">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b]">
                  Cuidado de los Humedales del Río Quinto
                </h3>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                El Río Quinto y sus diques albergan la mayor diversidad de aves acuáticas del catálogo Eco-quest (patos, garzas, cuervillos y gallaretas). Mantener limpios sus cauces es indispensable para su subsistencia.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p className="font-bold text-[#9a561d]">Reglas de oro en una salida de campo:</p>
                <p>• <b>Sin huella:</b> Traé de vuelta todos tus residuos, plásticos y restos de comida.</p>
                <p>• <b>No usar reproducciones sonoras:</b> Hacer sonar cantos grabados perturba el cortejo y la nidificación de las aves.</p>
                <p>• <b>Respetar los nidos:</b> Nunca toques huevos ni te quedes largo tiempo junto a un nido para evitar alertar predadores.</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <img src="/unvim-logo.png" alt="UNViM" className="w-5 h-5 object-contain" />
                <span>Universidad Nacional de Villa Mercedes</span>
              </div>
              <span className="font-bold text-[#263b2b]">Proyecto Eco-quest</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
