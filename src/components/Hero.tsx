import React from 'react';
import { Camera, Sparkles, ArrowRight, BookOpen, Eye, Users } from 'lucide-react';

interface HeroProps {
  onOpenMap: () => void;
  onOpenNewSighting: () => void;
  onOpenCatalog: () => void;
  onOpenFieldNotebook: () => void;
  onOpenExpedition?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenNewSighting,
  onOpenFieldNotebook,
}) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1d3222] via-[#263b2b] to-[#16271c] text-white p-6 sm:p-10 md:p-12 shadow-2xl border border-emerald-900/30 overflow-hidden">
        {/* Glow & organic shapes */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#f4bb29]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#78bfd5]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Institutional badge: Binocular icon box + "Un poco de nuestro proyecto" pill */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white/95 border border-amber-400/40 p-1.5 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Binoculares Eco-Quest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('icon-192.png')) {
                    target.src = '/icon-192.png';
                  }
                }}
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4bb29] text-[#263b2b] text-xs font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#263b2b]" />
              <span>Un poco de nuestro proyecto</span>
            </div>
          </div>

          {/* Main Title Question */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif-fraunces leading-[1.15] text-white tracking-tight">
            ¿Alguna vez te detuviste a observar las aves que hay en tu ciudad?
          </h1>

          {/* Narrative Text */}
          <div className="mt-5 space-y-4 text-sm sm:text-base md:text-lg text-amber-50/95 leading-relaxed font-sans">
            <p>
              <strong className="text-[#f4bb29] font-bold">Eco-Quest</strong> es una iniciativa que te invita a descubrir, observar y registrar las aves que habitan en Villa Mercedes, San Luis.
            </p>
            <p className="text-amber-100/90 text-sm sm:text-base">
              A través de esta aplicación, cualquier persona puede convertirse en parte de una experiencia colectiva de observación de la naturaleza. No necesitás ser especialista ni tener conocimientos previos: solamente curiosidad, ganas de explorar y prestar atención a lo que sucede a tu alrededor.
            </p>
          </div>

          {/* Section: ¿Para qué hacemos esto? */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <h2 className="text-lg sm:text-2xl font-bold font-serif-fraunces text-[#f4bb29] flex items-center gap-2">
              ¿Para qué hacemos esto?
            </h2>
            <div className="mt-3 space-y-3 text-xs sm:text-sm md:text-base text-amber-100/90 leading-relaxed">
              <p>
                Las aves pueden darnos pistas importantes sobre las condiciones del ambiente en el que vivimos. Conocer qué especies están presentes, dónde las encontramos y cómo varía su presencia nos permite reunir información sobre la biodiversidad local.
              </p>
              <p>
                Estos registros no determinan por sí solos el estado de toda la biosfera, pero sí representan una herramienta valiosa para estudiar el ambiente, reconocer posibles cambios y generar información que contribuya a futuras investigaciones y acciones de conservación.
              </p>
            </div>
          </div>

          {/* Section: ¿Cómo podés participar? */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <h2 className="text-lg sm:text-2xl font-bold font-serif-fraunces text-[#f4bb29] mb-4">
              ¿Cómo podés participar?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Observá with Image 5 */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f4bb29] text-[#263b2b] font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h3 className="font-extrabold text-base text-white font-serif-fraunces flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#f4bb29]" />
                      Observá
                    </h3>
                  </div>

                  {/* Image 5: Estudiante observando con binoculares en el campo */}
                  <div className="relative rounded-xl overflow-hidden h-48 sm:h-52 bg-emerald-950/40 mb-3 shadow-md border border-white/10">
                    <img
                      src="/assets/aistudio/IMG_3030__1__ff7d6d87.jpg"
                      alt="Observación de aves con binoculares en Villa Mercedes"
                      className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('observacion_aves.jpg')) {
                          target.src = '/observacion_aves.jpg';
                        }
                      }}
                    />
                  </div>

                  <p className="text-sm sm:text-base text-amber-50 leading-snug">
                    Prestá atención a las aves que encuentres en tu entorno.
                  </p>
                </div>
              </div>

              {/* Step 2: Registrá with button to field notebook */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#f4bb29] text-[#263b2b] font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h3 className="font-extrabold text-lg text-white font-serif-fraunces flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#f4bb29]" />
                      Registrá
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-amber-50 leading-relaxed mb-4">
                    Compartí tus observaciones mediante la aplicación.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={onOpenFieldNotebook}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold bg-[#f4bb29] text-[#263b2b] hover:bg-[#ffc940] transition shadow-md active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ir a la libreta de campo</span>
                  </button>
                  <button
                    onClick={onOpenNewSighting}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-white/15 text-white hover:bg-white/25 transition active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>+ Cargar nueva ficha</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Contribuí */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#f4bb29] text-[#263b2b] font-black text-sm flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h3 className="font-extrabold text-lg text-white font-serif-fraunces flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#f4bb29]" />
                      Contribuí
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-amber-50 leading-relaxed">
                    Sumá información para conocer mejor la biodiversidad de nuestra ciudad.
                  </p>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-400/30 text-xs sm:text-sm text-emerald-100">
                  <span className="font-bold text-white block mb-0.5">Ciencia Comunitaria:</span>
                  Tus registros ayudan a estudiantes, docentes e investigadores de Villa Mercedes.
                </div>
              </div>
            </div>
          </div>

          {/* Closing callout */}
          <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-left">
            <h4 className="font-serif-fraunces text-lg sm:text-xl font-bold text-[#f4bb29] mb-2">
              Cada observación cuenta.
            </h4>
            <p className="text-sm sm:text-base text-amber-50 leading-relaxed">
              No importa si sabés mucho o poco sobre aves. Tu participación puede ayudar a construir un mayor conocimiento sobre el ambiente que compartimos.
            </p>
            <p className="mt-2.5 text-sm sm:text-base font-extrabold text-white">
              ¡Sumate a Eco-Quest y descubrí todo lo que la naturaleza tiene para mostrarte!
            </p>

            {/* Main Action Link Button requested by user: ver fotos y aportes */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://extension.unvime.edu.ar/galeria/cmr0qplo10000f93lhcigk4w0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-extrabold bg-[#f4bb29] text-[#263b2b] hover:bg-[#ffc940] transition shadow-xl active:scale-95"
              >
                <Camera className="w-5 h-5 text-[#263b2b]" />
                <span>Ver fotos y aportes de la comunidad</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
