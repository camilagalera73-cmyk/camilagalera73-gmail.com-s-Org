import React, { useState, useEffect } from 'react';
import { HelpCircle, Shuffle, Award, CheckCircle2, RotateCcw, Sparkles, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TriviaQuestion {
  question: string;
  photoUrl: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Trivia questions strictly based on the 22 species of the Eco-quest UNViM poster
const TRIVIA_DATA: Record<number, TriviaQuestion[]> = {
  0: [ // Principiante
    {
      question: '¿Qué ave acuática de Villa Mercedes tiene patas largas de color rojo intenso y un pico recto, fino y largo de color negro?',
      photoUrl: '/birds/tero-real.jpg',
      options: ['Hornero', 'Tero real', 'Paloma', 'Cotorra'],
      correctIndex: 1, // B
      explanation: 'El Tero real (Himantopus mexicanus) es un ave estilizada de plumaje bicolor blanco y negro con llamativas patas rojas.'
    },
    {
      question: '¿Cuál de estos patos presenta una franja negra en la cabeza y cuello, y pecho rosáceo con pecas negras?',
      photoUrl: '/birds/pato-de-collar.jpg',
      options: ['Pollona negra', 'Pato maicero', 'Pato de collar', 'Pato barcino'],
      correctIndex: 2, // C
      explanation: 'El Pato de collar (Callonetta leucophrys) es un pato pequeño y vistoso muy característico de los humedales del Río Quinto.'
    },
    {
      question: '¿Qué ave construye un resistente nido de barro con forma de horno y tiene plumaje pardo rojizo con pico fuerte?',
      photoUrl: '/birds/hornero.jpg',
      options: ['Benteveo', 'Calandria grande', 'Chingolo común', 'Hornero'],
      correctIndex: 3, // D
      explanation: 'El Hornero (Furnarius rufus) es el ave nacional, con plumaje pardo rojizo, cola corta y característico nido de barro.'
    },
    {
      question: '¿Qué ave posee un antifaz negro sobre los ojos, garganta blanca, pecho amarillo intenso y emite un canto que parece decir su nombre?',
      photoUrl: '/birds/benteveo.jpg',
      options: ['Benteveo', 'Picabuey', 'Tordo renegrido', 'Calandria grande'],
      correctIndex: 0, // A
      explanation: 'El Benteveo (Pitangus sulphuratus) tiene vientre amarillo brillante, corona negra con ceja blanca y oculta plumas amarillas que despliega al alarmarse.'
    }
  ],
  1: [ // Observador
    {
      question: '¿Qué ave acuática grande (70-75 cm) tiene plumaje negro brillante, cuello largo y pico con punta en forma de gancho para pescar?',
      photoUrl: '/birds/bigua.jpg',
      options: ['Garza blanca', 'Macá común', 'Biguá', 'Gallareta'],
      correctIndex: 2, // C
      explanation: 'El Biguá (Nannopterum brasilianum) es un excelente buceador con patas negras palmeadas y pico ganchudo que suele secar sus alas al sol.'
    },
    {
      question: '¿Qué especie tiene la cara y el pecho de color amarillo intenso, con la parte superior de la cabeza y nuca de color negro?',
      photoUrl: '/birds/carpintero-campestre.jpg',
      options: ['Benteveo', 'Carpintero campestre', 'Picabuey', 'Tordo renegrido'],
      correctIndex: 1, // B
      explanation: 'El Carpintero campestre (Colaptes campestris) tiene pecho amarillo brillante y los machos presentan una línea roja a los lados de la garganta.'
    },
    {
      question: '¿Qué rapaz de plumaje pardo castaño presenta en vuelo una notable "ventana" clara en sus alas largas y se ve en pastizales de Villa Mercedes?',
      photoUrl: '/birds/chimango.jpg',
      options: ['Paloma', 'Gallineta pico pintado', 'Cuervillo cara pelada', 'Chimango'],
      correctIndex: 3, // D
      explanation: 'El Chimango (Daptrius chimango) es una rapaz mediana con cola barrada y pico claro con cera amarillenta.'
    },
    {
      question: '¿Qué ave de tamaño mediano es de color verde brillante en espalda y alas, frente y pecho gris claro con líneas y vuelo ruidoso en bandadas?',
      photoUrl: '/birds/cotorra.jpg',
      options: ['Cotorra', 'Calandria grande', 'Chingolo común', 'Pollona negra'],
      correctIndex: 0, // A
      explanation: 'La Cotorra (Myiopsitta monachus) es gregaria, de plumaje verde brillante con pecho gris y pico curvo color carne.'
    }
  ],
  2: [ // Experto
    {
      question: '¿Qué ave se caracteriza por tener la cara desnuda de color rosado y un pico largo, grueso y curvado hacia abajo?',
      photoUrl: '/birds/cuervillo-cara-pelada.jpg',
      options: ['Tero real', 'Garza blanca', 'Macá común', 'Cuervillo cara pelada'],
      correctIndex: 3, // D
      explanation: 'El Cuervillo cara pelada (Phimosus infuscatus) posee plumaje castaño oscuro con cara desnuda rosada y pico curvo para buscar invertebrados en el lodo.'
    },
    {
      question: '¿Qué ave acuática pequeña tiene un escudo frontal sobre el pico de color amarillo o rojizo y una mancha blanca visible en el borde trasero del ala?',
      photoUrl: '/birds/gallareta.jpg',
      options: ['Pollona negra', 'Gallareta', 'Gallineta pico pintado', 'Pato barcino'],
      correctIndex: 1, // B
      explanation: 'La Gallareta (Fulica leucoptera) es de color gris oscuro a negruzco con mancha blanca alar posterior y escudo frontal.'
    },
    {
      question: '¿Qué ave pequeña es una buceadora experta que pasa casi todo el tiempo en el agua y en época reproductiva tiene penachos blancos y ojos rojos?',
      photoUrl: '/birds/maca-comun.jpg',
      options: ['Macá común', 'Pato maicero', 'Pollona negra', 'Tero real'],
      correctIndex: 0, // A
      explanation: 'El Macá común (Rollandia rolland) se sumerge rápidamente para buscar peces e insectos en el Dique Vulpiani y Río Quinto.'
    },
    {
      question: '¿Qué pequeña ave de pastizales suele posarse sobre el ganado o en el suelo, con pico corto, pecho amarillo y una corona roja oculta?',
      photoUrl: '/birds/picabuey.jpg',
      options: ['Benteveo', 'Tordo renegrido', 'Picabuey', 'Chingolo común'],
      correctIndex: 2, // C
      explanation: 'El Picabuey (Machetornis rixosa) despliega su corona naranja o roja encendida cuando se encuentra alterado o en cortejo.'
    }
  ]
};

import { OFFICIAL_ECOQUEST_BIRDS } from '../data/birdsData';

export const FieldGames: React.FC = () => {
  // Trivia State
  const [level, setLevel] = useState<number>(0);
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [triviaFinished, setTriviaFinished] = useState<boolean>(false);

  // Memotest State
  const [cards, setCards] = useState<{ id: number; birdId: string; name: string; photoUrl: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  // Initialize Memory with 6 random birds from the 22 official species
  const initMemory = () => {
    const shuffledPool = [...OFFICIAL_ECOQUEST_BIRDS].sort(() => Math.random() - 0.5);
    const selectedBirds = shuffledPool.slice(0, 6).map(b => ({
      id: b.id,
      name: b.name,
      photoUrl: b.photoUrl
    }));

    const deck = [...selectedBirds, ...selectedBirds].map((item, index) => ({
      id: index,
      birdId: item.id,
      name: item.name,
      photoUrl: item.photoUrl,
      flipped: false,
      matched: false
    })).sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedCards([]);
    setAttempts(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    initMemory();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      const [first, second] = newFlipped;
      if (newCards[first].birdId === newCards[second].birdId) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedCards([]);

        if (newCards.every(c => c.matched)) {
          setMemoryWon(true);
          confetti({ particleCount: 90, spread: 70 });
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const currentQuestions = TRIVIA_DATA[level] || TRIVIA_DATA[0];
  const qItem = currentQuestions[currentQ];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    if (idx === qItem.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQ + 1 < currentQuestions.length) {
      setCurrentQ(q => q + 1);
    } else {
      setTriviaFinished(true);
      confetti({ particleCount: 80, spread: 60 });
    }
  };

  const handleRestartTrivia = (lvl: number) => {
    setLevel(lvl);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTriviaFinished(false);
  };

  return (
    <section id="trivia" className="pt-2 pb-12 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header with Official Logo */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-2xl overflow-hidden bg-white/95 p-1 border border-amber-900/15 shadow-sm flex items-center justify-center shrink-0">
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
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#9a561d]">
            Juegos y Trivia • Eco-Quest
          </p>
          <a
            href="#juegos"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-[#9a561d] text-xs font-bold transition shadow-xs ml-2"
          >
            ↑ Ir a Expedición por Paradas
          </a>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b]">
          Entrená tu mirada con las aves de Villa Mercedes
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Desafíos visuales y preguntas para aprender a identificar las 22 especies de aves de Villa Mercedes en el campo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Trivia Box */}
        <div className="leaf-card bg-white rounded-organic p-6 sm:p-7 flex flex-col justify-between shadow-lg border border-amber-900/10 relative overflow-hidden">
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

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              {/* Trivia Header with Logo */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-900/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl overflow-hidden bg-white/95 p-1 shadow-sm border border-amber-900/15 shrink-0 flex items-center justify-center">
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
                <h3 className="text-lg sm:text-xl font-bold font-serif-fraunces text-[#263b2b] flex items-center gap-1.5">
                  <HelpCircle className="w-5 h-5 text-[#b66b22]" />
                  Trivia Eco-quest (22 Aves)
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-[#9a561d]">
                Puntaje: {score}
              </span>
            </div>

            {/* Level selection */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {['Principiante', 'Observador', 'Experto'].map((lvlName, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRestartTrivia(idx)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    level === idx
                      ? 'bg-[#263b2b] text-white shadow-sm'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  {lvlName}
                </button>
              ))}
            </div>

            {triviaFinished ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#263b2b]">¡Nivel completado!</h4>
                <p className="text-sm sm:text-base text-slate-700 mt-1 max-w-sm mx-auto">
                  Acertaste {score} de {currentQuestions.length} preguntas sobre las 22 aves de Villa Mercedes.
                </p>
                <button
                  onClick={() => handleRestartTrivia(level)}
                  className="mt-5 px-6 py-3 rounded-full text-sm font-bold bg-[#b66b22] text-white hover:bg-[#9a561d] transition shadow-md inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Jugar de nuevo este nivel
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-3">
                  <span>Pregunta {currentQ + 1} de {currentQuestions.length}</span>
                  <span className="text-amber-900 font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Catálogo de Villa Mercedes
                  </span>
                </div>

                {/* Bird visual aid card */}
                {qItem.photoUrl && (
                  <div className="mb-4 flex items-center gap-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-200">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-amber-300 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={qItem.photoUrl}
                        alt="Ave del catálogo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#9a561d] flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Pista visual
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium">
                        Observá los rasgos y plumaje de esta especie del folleto para responder.
                      </p>
                    </div>
                  </div>
                )}

                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
                  {qItem.question}
                </h4>

                <div className="space-y-2.5">
                  {qItem.options.map((opt, idx) => {
                    let btnStyle = 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-900/15 text-slate-800 font-medium';
                    if (selectedAnswer !== null) {
                      if (idx === qItem.correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (idx === selectedAnswer) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                      } else {
                        btnStyle = 'opacity-40 border-slate-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-sm sm:text-base transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && idx === qItem.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-950 animate-in fade-in">
                    <p className="font-bold mb-1">
                      {selectedAnswer === qItem.correctIndex ? '¡Excelente acierto! 🪶' : 'Casi...'}
                    </p>
                    <p className="leading-relaxed text-slate-800">{qItem.explanation}</p>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-3 px-5 py-2.5 rounded-full text-sm font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-sm"
                    >
                      {currentQ + 1 < currentQuestions.length ? 'Siguiente pregunta' : 'Ver resultado'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Memotest Box */}
        <div className="leaf-card bg-[#f4f7ee] rounded-organic p-6 sm:p-7 flex flex-col justify-between shadow-lg border border-green-900/10 relative overflow-hidden">
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
              {/* Memotest Header with Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-green-900/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl overflow-hidden bg-white/95 p-1 shadow-sm border border-emerald-900/15 shrink-0 flex items-center justify-center">
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
                <h3 className="text-lg sm:text-xl font-bold font-serif-fraunces text-[#263b2b] flex items-center gap-1.5">
                  <Shuffle className="w-5 h-5 text-emerald-700" />
                  Memotest Eco-Quest
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                Intentos: {attempts}
              </span>
            </div>

            {memoryWon && (
              <div className="mb-4 p-3.5 bg-white rounded-2xl border-2 border-emerald-400 text-emerald-950 text-xs font-bold text-center shadow-sm animate-in fade-in">
                ¡Memoria impecable! Encontraste los 6 pares de aves del catálogo en {attempts} intentos. 🎉
              </div>
            )}

            {/* Cards Grid: 12 cards (6 pairs) strictly from the 22 species */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {cards.map((card, idx) => {
                const isRevealed = card.flipped || card.matched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    disabled={card.matched}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 text-center transition-all duration-300 transform select-none shadow-sm ${
                      isRevealed
                        ? 'bg-white border-2 border-emerald-500 scale-100'
                        : 'bg-[#263b2b] text-white hover:bg-[#1c2e20] hover:scale-105 active:scale-95 border border-amber-900/20'
                    }`}
                  >
                    {isRevealed ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center mb-1">
                          <img
                            src={card.photoUrl}
                            alt={card.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#263b2b] leading-tight line-clamp-1">
                          {card.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/95 p-0.5 border border-amber-400/50 shadow-sm flex items-center justify-center">
                          <img
                            src="/logo.png"
                            alt="Eco-Quest"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('icon-192.png')) {
                                target.src = '/icon-192.png';
                              }
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-amber-200 mt-1 uppercase tracking-wider">
                          Eco-Quest
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-green-900/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-600 font-medium">
              Encontrá los 6 pares de las aves del catálogo.
            </span>
            <button
              onClick={initMemory}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Mezclar de nuevo
            </button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
