import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';

export interface BinocularsCuriosityWidgetProps {
  birdName?: string;
  customFact?: string;
  habitat?: string;
  compact?: boolean;
  initialOpen?: boolean;
  onSelectBirdByName?: (birdName: string) => void;
  showNextButton?: boolean;
}

export const BIRD_CURIOSITIES: Record<string, { fact: string; habitat: string }> = {
  'pato-de-collar': {
    fact: 'Posee un espéculo alar de destellos verdes y azules metálicos muy visibles al volar en los humedales del Río V.',
    habitat: 'Humedales y ríos de Villa Mercedes'
  },
  'pato-maicero': {
    fact: 'Es una de las aves acuáticas más comunes del Cono Sur y su fino pico amarillo con punta negra le permite filtrar semillas.',
    habitat: 'Lagunas y bañados del Río Quinto'
  },
  'pato-barcino': {
    fact: 'Excelente nadador y gregario, posee un espejo alar verde brillante y pico amarillo con línea negra en el culmen.',
    habitat: 'Espejos de agua y lagunas'
  },
  'pollona-negra': {
    fact: 'Su llamativo pico rojo con punta amarilla y escudo frontal contrasta con sus largas patas para caminar sobre la vegetación.',
    habitat: 'Bordes con juncales y vegetación flotante'
  },
  'maca-comun': {
    fact: 'Es un buceador extraordinario capaz de zambullirse en una fracción de segundo al menor peligro y asomar solo la cabeza.',
    habitat: 'Aguas abiertas y lagunas'
  },
  'gallareta': {
    fact: 'Posee lóbulos en los dedos en vez de membrana completa, lo que le permite tanto nadar con agilidad como correr sobre el agua.',
    habitat: 'Cuerpos de agua con vegetación'
  },
  'gallineta-pico-pintado': {
    fact: 'Muy reservada entre los juncales, tiene una llamativa mancha roja en la base del pico y punta verde-amarillenta.',
    habitat: 'Humedales con densa vegetación'
  },
  'garza-blanca': {
    fact: 'Usa su cuello en forma de S como un resorte de precisión para arponear peces y anfibios en las orillas del Río Quinto.',
    habitat: 'Riberas y aguas someras'
  },
  'cuervillo-cara-pelada': {
    fact: 'Su pico largo y curvo hacia abajo funciona como una pinza para sondear el fango en busca de invertebrados acuáticos.',
    habitat: 'Bañados y pastizales inundados'
  },
  'tero-real': {
    fact: 'Sus larguísimas patas rosadas son proporcionales a su cuerpo entre las más largas de todas las aves zancudas de la región.',
    habitat: 'Orillas de lagunas y ríos'
  },
  'bigua': {
    fact: 'Al no tener tantas glándulas oleosas en sus plumas, se empapa para bucear mejor y luego se posa con las alas abiertas al sol.',
    habitat: 'Río Quinto y grandes lagunas'
  },
  'paloma': {
    fact: 'Produce la leche de buche, una secreción nutritiva con la que ambos padres alimentan a sus pichones en los primeros días.',
    habitat: 'Parques arbolados y zonas urbanas'
  },
  'cotorra': {
    fact: 'Es la única especie de loro que construye enormes nidos comunales de ramas con múltiples habitaciones para varias parejas.',
    habitat: 'Arboledas, eucaliptos y parques'
  },
  'calandria-grande': {
    fact: 'Es una imitadora vocal prodigiosa, capaz de reproducir el canto de más de 20 especies distintas y sonidos de su entorno.',
    habitat: 'Arboledas y jardines'
  },
  'benteveo': {
    fact: 'Su canto onomatopéyico parece decir ¡bicho feo! o ¡bien te veo! y defiende con valentía su nido incluso de aves rapaces.',
    habitat: 'Árboles cercanos al agua y parques'
  },
  'chingolo-comun': {
    fact: 'Su melodioso trino de tres o cuatro notas es uno de los sonidos más familiares y alegres de las mañanas en Villa Mercedes.',
    habitat: 'Jardines, parques y pastizales'
  },
  'hornero': {
    fact: 'Ave nacional de Argentina, construye su nido de barro y paja de hasta 5 kg orientado contra el viento predominante.',
    habitat: 'Árboles y postes de la ciudad'
  },
  'carpintero-campestre': {
    fact: 'A diferencia de otros carpinteros, pasa mucho tiempo buscando hormigas en el suelo además de taladrar troncos y postes.',
    habitat: 'Pastizales con árboles y postes'
  },
  'picabuey': {
    fact: 'Suele posarse sobre el lomo de caballos y vacas para alimentarse de parásitos e insectos en una relación simbiótica.',
    habitat: 'Pastizales con ganado y áreas abiertas'
  },
  'tordo-renegrido': {
    fact: 'Es un ave parásita de cría: no construye nidos propios, sino que deposita sus huevos en los nidos de horneros y chingolos.',
    habitat: 'Pastizales y arboledas'
  },
  'chimango': {
    fact: 'Rapaz sumamente adaptable e inteligente, cumple un rol ecológico fundamental como limpiador de carroña y controlador de plagas.',
    habitat: 'Campos abiertos y zonas suburbanas'
  },
  'tero-comun': {
    fact: 'Finge tener un ala rota lejos de sus huevos y realiza vuelos rasantes con gritos estridentes para despistar depredadores.',
    habitat: 'Pastizales, canchas y orillas abiertas'
  }
};

const DEFAULT_CURIOSITIES = [
  {
    fact: 'Es una de las aves acuáticas más comunes del Cono Sur y su fino pico amarillo le permite filtrar semillas.',
    bird: 'Pato maicero',
    habitat: 'Humedales y lagunas del Río V'
  },
  {
    fact: 'El Benteveo debe su nombre a su canto onomatopéyico que parece decir claramente ¡bicho feo! o ¡bien te veo!.',
    bird: 'Benteveo',
    habitat: 'Árboles y parques urbanos'
  },
  {
    fact: 'El Hornero es el ave nacional de Argentina y construye su nido de barro y paja con una cámara interior aislada del viento.',
    bird: 'Hornero',
    habitat: 'Árboles y postes de Villa Mercedes'
  },
  {
    fact: 'El Pato de collar posee un espéculo alar de destellos verdes y azules metálicos muy visibles al volar en los humedales.',
    bird: 'Pato de collar',
    habitat: 'Humedales del Río Quinto'
  },
  {
    fact: 'El Macá común es un buceador extraordinario capaz de desaparecer bajo el agua en una fracción de segundo al menor peligro.',
    bird: 'Macá común',
    habitat: 'Espejos de agua y lagunas'
  },
  {
    fact: 'El Tero realiza vuelos rasantes y finge tener un ala rota lejos de sus huevos para distraer a los depredadores.',
    bird: 'Tero común',
    habitat: 'Pastizales y áreas abiertas'
  },
  {
    fact: 'La Garza blanca utiliza su estilizado cuello en forma de S como un resorte para arponear peces con precisión milimétrica.',
    bird: 'Garza blanca',
    habitat: 'Orillas del Río Quinto'
  }
];

export const BinocularsCuriosityWidget: React.FC<BinocularsCuriosityWidgetProps> = ({
  birdName,
  customFact,
  habitat,
  compact = false,
  initialOpen = true,
  onSelectBirdByName,
  showNextButton = true
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [curiosityIndex, setCuriosityIndex] = useState(0);
  const [parallax, setParallax] = useState({ px: 0, py: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  // Determine current fact
  const factText = customFact || (birdName 
    ? (BIRD_CURIOSITIES[birdName.toLowerCase().replace(/\s+/g, '-')]?.fact || DEFAULT_CURIOSITIES[0].fact)
    : DEFAULT_CURIOSITIES[curiosityIndex].fact
  );

  const birdLabel = birdName || DEFAULT_CURIOSITIES[curiosityIndex].bird;
  const habitatLabel = habitat || (birdName 
    ? (BIRD_CURIOSITIES[birdName.toLowerCase().replace(/\s+/g, '-')]?.habitat || '')
    : DEFAULT_CURIOSITIES[curiosityIndex].habitat
  );

  const words = factText.split(' ');

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleNextCuriosity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCuriosityIndex(prev => (prev + 1) % DEFAULT_CURIOSITIES.length);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isOpen || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({
      px: Number(x.toFixed(3)),
      py: Number(y.toFixed(3))
    });
  };

  const handlePointerLeave = () => {
    setParallax({ px: 0, py: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`w-full ${compact ? 'max-w-md mx-auto my-2' : 'max-w-2xl mx-auto my-6'} px-1 sm:px-2`}>
      <style>{`
        .binoculars-scene-${compact ? 'compact' : 'regular'} {
          --ease-out: cubic-bezier(.2, .75, .25, 1);
          --ease-spring: cubic-bezier(.34, 1.3, .5, 1);
          --dur: 900ms;
          --s: ${compact ? '0.70' : '0.66'};
          --d: ${compact ? '14.5%' : '14.5%'};
          --cy: 45.7%;
          --ch: ${compact ? '18.5%' : '19%'};
          --tuck: 2.2%;
          position: relative;
          width: 100%;
          aspect-ratio: 1472 / 832;
          overflow: hidden;
          isolation: isolate;
          background: transparent;
          perspective: 1400px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 640px) {
          .binoculars-scene-${compact ? 'compact' : 'regular'} {
            --s: 0.70;
            --d: 19%;
            --cy: 45.4%;
            --ch: 21%;
            --tuck: 2.5%;
            aspect-ratio: 1472 / 920;
          }
        }

        /* Parchment Paper in Center: Fitted snugly between oculars without square corner overflow */
        .bino-clean-paper {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: var(--cy);
          width: calc(var(--d) * 2 + var(--tuck) * 2);
          min-height: var(--ch);
          padding: 1% calc(var(--tuck) + 2.5%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0 4px,
              rgba(130, 103, 48, .03) 5px,
              transparent 6px
            ),
            linear-gradient(90deg, #ecdcae, #f7e9bf 10%, #f7e9bf 90%, #ecdcae);
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(58, 28, 54, 0.12), inset 0 0 10px rgba(130, 103, 48, 0.14);
          opacity: 0;
          clip-path: inset(0 50% 0 50%);
          transform: translate(-50%, -50%);
          transition: clip-path 850ms var(--ease-out), opacity 250ms ease;
          overflow: hidden;
        }

        .bino-clean-paper .bino-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(100deg, transparent 35%, rgba(255, 255, 255, 0.6) 50%, transparent 65%);
          transform: translateX(-120%);
          pointer-events: none;
        }

        .bino-clean-paper h2 {
          margin: 0 0 .25em;
          color: #3a1c36;
          font-family: 'Josefin Sans', sans-serif !important;
          font-weight: 700;
          font-size: ${compact ? 'clamp(10px, 2.2cqw, 16px)' : 'clamp(11px, 2.3cqw, 18px)'};
          letter-spacing: .08em;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 500ms ease, transform 600ms var(--ease-out);
        }

        .bino-clean-paper p {
          max-width: 100%;
          margin: 0;
          color: #241620;
          font-family: 'Josefin Sans', sans-serif !important;
          font-weight: 350;
          letter-spacing: 0.01em;
          font-size: ${compact ? 'clamp(9.5px, 2.15cqw, 14.5px)' : 'clamp(10.5px, 2.15cqw, 16.5px)'};
          line-height: 1.35;
          text-align: center;
        }

        .bino-clean-paper .w {
          display: inline-block;
          font-weight: 350;
          font-family: 'Josefin Sans', sans-serif !important;
          opacity: 0;
          transform: translateY(.4em);
          filter: blur(1px);
          transition: opacity 450ms ease, transform 550ms var(--ease-out), filter 450ms ease;
        }

        .bino-binoculars {
          position: absolute;
          z-index: 2;
          inset: 0;
          pointer-events: none;
          transform-style: preserve-3d;
          transition: transform 400ms ease-out;
        }

        .bino-float {
          position: absolute;
          inset: 0;
          animation: bino-float 4.5s ease-in-out infinite;
        }

        .bino-half {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform-origin: 50% 50%;
          transition: transform var(--dur) var(--ease-spring);
          will-change: transform;
        }

        .bino-half img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        .bino-left { clip-path: inset(0 50% 0 0); }
        .bino-right { clip-path: inset(0 0 0 50%); }

        /* Estado abierto */
        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-left {
          transform: translateX(calc(var(--d) * -1)) scale(var(--s));
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-right {
          transform: translateX(var(--d)) scale(var(--s));
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-binoculars {
          transform: none !important;
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-float {
          animation: none;
          transform: translateY(0);
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-clean-paper {
          opacity: 1;
          clip-path: inset(0 0 0 0);
          transition-delay: 350ms;
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-clean-paper .bino-shine {
          animation: bino-shine 1100ms ease-out 1100ms 1 both;
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-clean-paper h2 {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 800ms;
        }

        .binoculars-scene-${compact ? 'compact' : 'regular'}.open .bino-clean-paper .w {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          transition-delay: calc(950ms + var(--i) * 45ms);
        }

        /* Al cerrar */
        .binoculars-scene-${compact ? 'compact' : 'regular'}:not(.open) .bino-clean-paper,
        .binoculars-scene-${compact ? 'compact' : 'regular'}:not(.open) .bino-clean-paper h2,
        .binoculars-scene-${compact ? 'compact' : 'regular'}:not(.open) .bino-clean-paper .w {
          transition-delay: 0ms;
          transition-duration: 250ms;
        }

        @keyframes bino-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-1%); }
        }

        @keyframes bino-shine {
          from { transform: translateX(-120%); }
          to   { transform: translateX(120%); }
        }
      `}</style>

      {/* Decorative Container Card */}
      <div className={`relative rounded-3xl bg-white/90 backdrop-blur-sm border border-amber-900/15 ${compact ? 'p-3' : 'p-4 sm:p-5'} shadow-xs overflow-hidden text-center`}>
        {/* Top header badge */}
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3a1c36] bg-[#3a1c36]/10 px-3 py-0.5 rounded-full border border-[#3a1c36]/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3a1c36]" />
            {birdName ? `Curiosidad: ${birdName}` : '¿Sabías que...? • Eco-Quest'}
          </span>
        </div>

        {/* Scene */}
        <div
          ref={sceneRef}
          onClick={handleToggle}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`binoculars-scene-${compact ? 'compact' : 'regular'} ${isOpen ? 'open' : ''}`}
          aria-label="Binoculares interactivos"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          {/* Paper in Center (clean rounded parchment without square artifacts) */}
          <section className="bino-clean-paper" aria-live="polite">
            <span className="bino-shine" aria-hidden="true" />
            <h2>¿SABÍAS QUE...?</h2>
            <p id="fact">
              {words.map((word, i) => (
                <React.Fragment key={`${factText}-${i}`}>
                  <span
                    className="w"
                    style={{ '--i': i } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    {word}
                  </span>
                  {i < words.length - 1 && ' '}
                </React.Fragment>
              ))}
            </p>

            {habitatLabel && (
              <span className="text-[8px] sm:text-[10px] font-semibold text-[#3a1c36]/80 mt-1 uppercase tracking-wider">
                — {birdLabel} {habitatLabel ? `(${habitatLabel})` : ''}
              </span>
            )}
          </section>

          {/* Binoculars Split View */}
          <div
            className="bino-binoculars"
            aria-hidden="true"
            style={{
              transform: !isOpen
                ? `rotateX(${parallax.py * -2}deg) rotateY(${parallax.px * 3}deg)`
                : 'none'
            }}
          >
            <div className="bino-float">
              {/* Left Half */}
              <div className="bino-half bino-left">
                <img
                  src="/binoculares_scroll.png"
                  alt="Binoculares Eco-Quest"
                  loading="lazy"
                />
              </div>

              {/* Right Half */}
              <div className="bino-half bino-right">
                <img
                  src="/binoculares_scroll.png"
                  alt="Binoculares Eco-Quest"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
          <button
            onClick={handleToggle}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#3a1c36] text-white hover:bg-[#281325] transition shadow-xs active:scale-95"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Cerrar binoculares
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Descubrir curiosidad
              </>
            )}
          </button>

          {!birdName && showNextButton && (
            <button
              onClick={handleNextCuriosity}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-[#3a1c36]/25 text-[#3a1c36] hover:bg-amber-100/70 transition shadow-2xs active:scale-95"
              title="Ver otra curiosidad de aves"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Otra curiosidad
            </button>
          )}

          {!birdName && isOpen && onSelectBirdByName && birdLabel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectBirdByName(birdLabel);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-2xs active:scale-95"
            >
              Ver ficha de {birdLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
