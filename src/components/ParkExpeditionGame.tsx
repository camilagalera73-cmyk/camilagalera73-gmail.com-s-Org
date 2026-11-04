import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Award, Star, MapPin, Footprints, 
  Settings, Sparkles, Check, Trash2, X, Plus, RotateCcw, 
  Shuffle, User, Image as ImageIcon, ChevronRight, Eye, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ---------- Parque & Rutas ---------- */
interface Stop {
  short: string;
  place: string;
  x: number;
  y: number;
  badge: [number, number];
  tip: string;
}

const STOPS: Stop[] = [
  {
    short: 'Entrada',
    place: 'Espejos de agua, Av. Bélgica',
    x: 417,
    y: 88,
    badge: [-38, 2],
    tip: 'Mirá los espejos de agua sin hacer ruido. ¿Hay aves nadando, caminando en la orilla o volando? Contá cuántas ves antes de anotar.'
  },
  {
    short: '2da parada',
    place: 'Sendero junto al lago, cerca del banco',
    x: 273,
    y: 460,
    badge: [0, 40],
    tip: 'Parate junto al sendero y mirá para todos lados: árboles, arbustos, suelo y agua. Escuchá si hay cantos y fijate de dónde vienen.'
  },
  {
    short: '3ra parada',
    place: 'Puente sobre el lago',
    x: 598,
    y: 1072,
    badge: [-40, 8],
    tip: 'Desde el puente podés mirar el agua desde arriba. Fijate qué hacen las aves: si nadan, si se zambullen, si descansan o si pasan volando.'
  }
];

const EXIT = { x: 435, y: 1226 };
const ROUTE: [number, number][] = [
  [417, 88], [330, 170], [222, 265], [207, 298], [273, 460], 
  [450, 632], [558, 656], [720, 825], [688, 965], [598, 1072], 
  [500, 1165], [435, 1226]
];
const STOP_IDX = [0, 4, 9, 11];
const NEED = 1;

// Distancias acumuladas de la ruta
const cum: number[] = [0];
for (let i = 1; i < ROUTE.length; i++) {
  cum[i] = cum[i - 1] + Math.hypot(ROUTE[i][0] - ROUTE[i - 1][0], ROUTE[i][1] - ROUTE[i - 1][1]);
}

function heroXY(d: number) {
  d = Math.max(0, Math.min(d, cum[cum.length - 1]));
  let i = 1;
  while (i < cum.length - 1 && cum[i] < d) i++;
  const t = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
  return {
    x: ROUTE[i - 1][0] + (ROUTE[i][0] - ROUTE[i - 1][0]) * t,
    y: ROUTE[i - 1][1] + (ROUTE[i][1] - ROUTE[i - 1][1]) * t,
    i: i
  };
}

function trailPts(d: number) {
  const p = heroXY(d);
  const pts: string[] = [];
  for (let k = 0; k < p.i; k++) pts.push(`${ROUTE[k][0]},${ROUTE[k][1]}`);
  pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  return pts.join(' ');
}

/* ---------- Personalización del Avatar ---------- */
const SKIN: [string, string][] = [
  ['#f6d3b8', 'Piel muy clara'],
  ['#e8b98d', 'Piel clara'],
  ['#c98f63', 'Piel trigueña'],
  ['#a66a43', 'Piel morena'],
  ['#7a4a2e', 'Piel oscura'],
  ['#523020', 'Piel muy oscura']
];

const HAIR: [string, string][] = [
  ['#2b1b12', 'Negro'],
  ['#6b3f1e', 'Castaño'],
  ['#b5772f', 'Cobrizo'],
  ['#e3b44c', 'Rubio'],
  ['#c4452d', 'Colorado'],
  ['#8f9aa3', 'Canoso'],
  ['#3d6fb5', 'Azul'],
  ['#A8582E', 'Terracota'],
  ['#D0B48D', 'Arena'],
  ['#3D531B', 'Verde oliva'],
  ['#EEE5CA', 'Crema']
];

const COLORS: [string, string][] = [
  ['#d93b30', 'Rojo'],
  ['#ef8a2a', 'Naranja'],
  ['#f2c230', 'Amarillo'],
  ['#2a7d26', 'Verde'],
  ['#1f9a8a', 'Turquesa'],
  ['#2b78c9', 'Azul'],
  ['#7b4fc4', 'Violeta'],
  ['#e56a9a', 'Rosa'],
  ['#f4f1ea', 'Blanco'],
  ['#2c2f33', 'Negro'],
  ['#3D531B', 'Verde oliva'],
  ['#A8582E', 'Terracota'],
  ['#D0B48D', 'Arena'],
  ['#A4AC7C', 'Salvia'],
  ['#BDBF95', 'Salvia clara'],
  ['#EEE5CA', 'Crema']
];

const PANTS: [string, string][] = [
  ['#2f4b7c', 'Azul marino'],
  ['#3b3b3b', 'Gris oscuro'],
  ['#7a5a3a', 'Marrón'],
  ['#4a6b3a', 'Verde oliva'],
  ['#8a8f96', 'Gris'],
  ['#b23a48', 'Bordó'],
  ['#3D531B', 'Verde oliva'],
  ['#A8582E', 'Terracota'],
  ['#D0B48D', 'Arena']
];

const HAIR_STYLES = [
  ['corto', 'Corto'],
  ['largo', 'Largo'],
  ['flequillo', 'Largo con flequillo'],
  ['colitas', 'Colitas'],
  ['trenzas', 'Trenzas'],
  ['rodete', 'Rodete'],
  ['coleta', 'Coleta'],
  ['rulos', 'Rulos'],
  ['ninguno', 'Sin pelo']
];

const OUTFITS = [
  ['remera', 'Remera'],
  ['buzo', 'Buzo'],
  ['chaleco', 'Chaleco']
];

const GENDERS = [
  ['hombre', 'Hombre'],
  ['mujer', 'Mujer']
];

const BOTTOMS = [
  ['pantalon', 'Pantalón'],
  ['short', 'Short'],
  ['falda', 'Falda']
];

const HATS = [
  ['ninguno', 'Sin sombrero'],
  ['gorra', 'Gorra'],
  ['sombrero', 'Sombrero'],
  ['gorro', 'Gorro']
];

const ACCS = [
  ['binoculares', 'Binoculares'],
  ['anteojos', 'Anteojos'],
  ['mochila', 'Mochila'],
  ['camara', 'Cámara'],
  ['bufanda', 'Bufanda']
];

interface HeroState {
  name: string;
  gender: string;
  skin: number;
  hairStyle: string;
  hairColor: number;
  outfit: string;
  shirt: number;
  pants: number;
  bottom: string;
  hat: string;
  hatColor: number;
  acc: Record<string, boolean>;
}

function defaultHero(): HeroState {
  return {
    name: '',
    gender: 'hombre',
    bottom: 'pantalon',
    skin: 1,
    hairStyle: 'corto',
    hairColor: 1,
    outfit: 'chaleco',
    shirt: 11,
    pants: 6,
    hat: 'sombrero',
    hatColor: 12,
    acc: {
      binoculares: true,
      anteojos: false,
      mochila: false,
      camara: false,
      bufanda: false
    }
  };
}

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Renderizador del SVG del Explorador
function renderHeroSvgInner(h: HeroState) {
  const skin = SKIN[h.skin]?.[0] || SKIN[0][0];
  const hair = HAIR[h.hairColor]?.[0] || HAIR[0][0];
  const shirt = COLORS[h.shirt]?.[0] || COLORS[0][0];
  const pants = PANTS[h.pants]?.[0] || PANTS[0][0];
  const acc = COLORS[h.hatColor]?.[0] || COLORS[0][0];
  const a = h.acc || {};
  const ink = '#2a1c14';
  let s = '';

  s += '<ellipse cx="60" cy="163" rx="32" ry="6" fill="#000" opacity=".16"/>';
  if (a.mochila) s += `<rect x="29" y="76" width="62" height="42" rx="13" fill="${shade(acc, -0.18)}"/>`;
  if (h.hairStyle === 'largo' || h.hairStyle === 'flequillo') {
    s += `<rect x="30" y="24" width="60" height="64" rx="26" fill="${hair}"/>`;
  }
  const bt = h.bottom || 'pantalon';
  const fem = h.gender === 'mujer';

  if (bt === 'pantalon') {
    s += `<rect x="43" y="108" width="15" height="44" rx="6" fill="${pants}"/><rect x="62" y="108" width="15" height="44" rx="6" fill="${pants}"/>`;
  } else if (bt === 'short') {
    s += `<rect x="43" y="116" width="15" height="36" rx="6" fill="${skin}"/><rect x="62" y="116" width="15" height="36" rx="6" fill="${skin}"/><rect x="42" y="106" width="17" height="26" rx="7" fill="${pants}"/><rect x="61" y="106" width="17" height="26" rx="7" fill="${pants}"/>`;
  } else {
    s += `<rect x="43" y="112" width="15" height="40" rx="6" fill="${skin}"/><rect x="62" y="112" width="15" height="40" rx="6" fill="${skin}"/>`;
  }
  s += '<rect x="39" y="147" width="21" height="12" rx="6" fill="#3a2a22"/><rect x="60" y="147" width="21" height="12" rx="6" fill="#3a2a22"/>';

  s += fem ? '<g transform="translate(60 0) scale(.93 1) translate(-60 0)">' : '<g>';
  if (h.outfit === 'remera') {
    s += `<rect x="24" y="76" width="13" height="38" rx="6.5" fill="${skin}"/><rect x="83" y="76" width="13" height="38" rx="6.5" fill="${skin}"/>`;
    s += `<rect x="35" y="70" width="50" height="50" rx="14" fill="${shirt}"/>`;
    s += `<rect x="21" y="72" width="18" height="20" rx="8" fill="${shirt}"/><rect x="81" y="72" width="18" height="20" rx="8" fill="${shirt}"/>`;
  } else if (h.outfit === 'buzo') {
    s += `<rect x="22" y="74" width="16" height="42" rx="8" fill="${shade(shirt, -0.1)}"/><rect x="82" y="74" width="16" height="42" rx="8" fill="${shade(shirt, -0.1)}"/>`;
    s += `<rect x="35" y="70" width="50" height="50" rx="14" fill="${shirt}"/>`;
    s += `<path d="M42 68 Q60 86 78 68 Q78 76 60 90 Q42 76 42 68Z" fill="${shade(shirt, -0.22)}"/>`;
    s += `<rect x="47" y="102" width="26" height="11" rx="5" fill="${shade(shirt, -0.14)}"/>`;
  } else {
    const tan = '#EEE5CA';
    s += `<rect x="22" y="74" width="16" height="42" rx="8" fill="${tan}"/><rect x="82" y="74" width="16" height="42" rx="8" fill="${tan}"/>`;
    s += `<rect x="35" y="70" width="50" height="50" rx="14" fill="${tan}"/>`;
    s += `<path d="M36 76 Q36 70 43 70 L54 70 L54 118 L43 118 Q36 118 36 112Z" fill="${shirt}"/><path d="M84 76 Q84 70 77 70 L66 70 L66 118 L77 118 Q84 118 84 112Z" fill="${shirt}"/>`;
    s += `<rect x="40" y="96" width="11" height="10" rx="3" fill="${shade(shirt, -0.2)}"/><rect x="69" y="96" width="11" height="10" rx="3" fill="${shade(shirt, -0.2)}"/>`;
  }
  s += `<circle cx="30.5" cy="115" r="7.5" fill="${skin}"/><circle cx="89.5" cy="115" r="7.5" fill="${skin}"/></g>`;

  if (bt === 'falda') {
    s += `<path d="M36 104 L84 104 L94 137 Q60 147 26 137 Z" fill="${pants}"/><rect x="36" y="100" width="48" height="8" rx="4" fill="${shade(pants, -0.18)}"/>`;
  }
  if (a.mochila) {
    s += `<rect x="43" y="71" width="5" height="32" rx="2.5" fill="${shade(acc, -0.3)}"/><rect x="72" y="71" width="5" height="32" rx="2.5" fill="${shade(acc, -0.3)}"/>`;
  }
  s += `<rect x="53" y="60" width="14" height="14" rx="4" fill="${shade(skin, -0.1)}"/>`;
  s += `<circle cx="34" cy="44" r="5.5" fill="${skin}"/><circle cx="86" cy="44" r="5.5" fill="${skin}"/><circle cx="60" cy="42" r="26" fill="${skin}"/>`;

  const cap = `<path d="M33 40 C32 16 48 12 60 12 C74 12 88 17 87 40 C82 29 72 27 60 27 C48 27 38 29 33 40Z" fill="${hair}"/>`;
  const hs = h.hairStyle, tie = '#A8582E';

  if (hs === 'corto' || hs === 'largo') s += cap;
  else if (hs === 'flequillo') s += cap + `<path d="M34 41 C33 21 87 21 86 41 C80 30 70 37 60 31 C50 37 40 30 34 41Z" fill="${hair}"/>`;
  else if (hs === 'colitas') s += cap + `<path d="M36 34 C16 33 12 58 21 72 C23 56 30 47 38 42Z" fill="${hair}"/><path d="M84 34 C104 33 108 58 99 72 C97 56 90 47 82 42Z" fill="${hair}"/><circle cx="35" cy="37" r="4.5" fill="${tie}"/><circle cx="85" cy="37" r="4.5" fill="${tie}"/>`;
  else if (hs === 'trenzas') s += cap + `<g fill="${hair}"><ellipse cx="29" cy="56" rx="6.5" ry="8"/><ellipse cx="30" cy="69" rx="6.5" ry="8"/><ellipse cx="29" cy="82" rx="6.5" ry="8"/><ellipse cx="30" cy="95" rx="6.5" ry="8"/><ellipse cx="91" cy="56" rx="6.5" ry="8"/><ellipse cx="90" cy="69" rx="6.5" ry="8"/><ellipse cx="91" cy="82" rx="6.5" ry="8"/><ellipse cx="90" cy="95" rx="6.5" ry="8"/></g><circle cx="30" cy="106" r="4.5" fill="${tie}"/><circle cx="90" cy="106" r="4.5" fill="${tie}"/>`;
  else if (hs === 'rodete') s += cap + `<circle cx="60" cy="9" r="11" fill="${hair}"/><rect x="51" y="15" width="18" height="5" rx="2.5" fill="${tie}"/>`;
  else if (hs === 'coleta') s += cap + `<path d="M84 32 C106 30 108 62 96 72 C98 56 92 46 84 42Z" fill="${hair}"/><circle cx="85" cy="35" r="4" fill="#A8582E"/>`;
  else if (hs === 'rulos') s += `<g fill="${hair}"><circle cx="34" cy="38" r="10"/><circle cx="38" cy="24" r="11"/><circle cx="50" cy="16" r="11"/><circle cx="64" cy="14" r="11"/><circle cx="77" cy="18" r="11"/><circle cx="85" cy="30" r="11"/><circle cx="88" cy="42" r="9"/></g>`;

  s += `<circle cx="50" cy="44" r="3.2" fill="${ink}"/><circle cx="70" cy="44" r="3.2" fill="${ink}"/><circle cx="51" cy="43" r="1" fill="#fff"/><circle cx="71" cy="43" r="1" fill="#fff"/>`;
  if (fem) s += `<path d="M46.5 41.5 L43.5 39.5 M47.5 40.5 L46 37.5 M73.5 41.5 L76.5 39.5 M72.5 40.5 L74 37.5" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" fill="none"/>`;
  s += `<path d="M52 55 Q60 62 68 55" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="45" cy="52" r="4" fill="#ff8f8f" opacity=".35"/><circle cx="75" cy="52" r="4" fill="#ff8f8f" opacity=".35"/>`;

  if (a.anteojos) s += `<g fill="rgba(255,255,255,.28)" stroke="#2c2f33" stroke-width="2.4"><circle cx="50" cy="44" r="8.5"/><circle cx="70" cy="44" r="8.5"/></g><path d="M58.5 44h3" stroke="#2c2f33" stroke-width="2.4"/>`;
  if (h.hat === 'gorra') s += `<path d="M33 34 Q34 11 60 11 Q86 11 87 34Z" fill="${acc}"/><rect x="29" y="30" width="62" height="8" rx="4" fill="${shade(acc, -0.25)}"/>`;
  else if (h.hat === 'sombrero') s += `<ellipse cx="60" cy="30" rx="46" ry="9" fill="${shade(acc, -0.12)}"/><path d="M40 30 Q40 5 60 5 Q80 5 80 30Z" fill="${acc}"/><rect x="40" y="21" width="40" height="7" fill="${shade(acc, -0.3)}"/>`;
  else if (h.hat === 'gorro') s += `<path d="M33 36 Q33 8 60 8 Q87 8 87 36Z" fill="${acc}"/><rect x="31" y="29" width="58" height="11" rx="5.5" fill="${shade(acc, -0.25)}"/><circle cx="60" cy="7" r="6" fill="${shade(acc, 0.25)}"/>`;

  if (a.bufanda) s += `<rect x="42" y="63" width="36" height="11" rx="5.5" fill="${acc}"/><rect x="66" y="69" width="10" height="26" rx="4" fill="${shade(acc, -0.12)}"/>`;
  if (a.binoculares) s += '<path d="M47 70 Q60 100 73 70" stroke="#3a2a22" stroke-width="3" fill="none"/><rect x="47" y="90" width="12" height="17" rx="4.5" fill="#2e3a44"/><rect x="61" y="90" width="12" height="17" rx="4.5" fill="#2e3a44"/><rect x="58" y="94" width="4" height="6" fill="#2e3a44"/><ellipse cx="53" cy="107" rx="5" ry="2.6" fill="#7cc6e8"/><ellipse cx="67" cy="107" rx="5" ry="2.6" fill="#7cc6e8"/>';
  if (a.camara) s += '<rect x="76" y="100" width="22" height="15" rx="3.5" fill="#3b3b3b"/><rect x="82" y="97" width="9" height="4" rx="1.5" fill="#3b3b3b"/><circle cx="87" cy="108" r="5" fill="#9fd3ee" stroke="#222" stroke-width="1.5"/>';

  return s;
}

/* ---------- Diario & Fichas ---------- */
interface DiaryBird {
  id: string;
  name: string;
  unknown: boolean;
  size: string;
  beak: string;
  colors: string[];
  doing: string[];
  notes: string;
  stop: number;
  where: string;
  photo: string | null;
  date: string;
}

const BCOL: [string, string][] = [
  ['#1d1d1f', 'Negro'],
  ['#f6f6f2', 'Blanco'],
  ['#8d949b', 'Gris'],
  ['#8a5a36', 'Marrón'],
  ['#d03a2e', 'Rojo'],
  ['#f1c232', 'Amarillo'],
  ['#5aa845', 'Verde'],
  ['#3a7bc8', 'Azul'],
  ['#ef8a2a', 'Naranja']
];

const SIZES: [string, string][] = [
  ['Chico', 'Chico, como un gorrión'],
  ['Mediano', 'Mediano, como una paloma'],
  ['Grande', 'Grande, como una garza']
];

const BEAKS: [string, string][] = [
  ['Corto y fuerte', 'Corto y fuerte'],
  ['Largo y fino', 'Largo y fino'],
  ['Curvo', 'Curvo'],
  ['Ancho y plano', 'Ancho y plano']
];

const DOING = ['Nadaba', 'Volaba', 'Caminaba', 'Comía', 'Cantaba', 'Estaba posada', 'Se zambullía'];

export const ParkExpeditionGame: React.FC = () => {
  // Estado general cargado desde localStorage
  const STORAGE_KEY = 'ecoquest-v1';
  
  const [started, setStarted] = useState<boolean>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return !!d.started;
    } catch {
      return false;
    }
  });

  const [level, setLevel] = useState<number>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Math.max(0, Math.min(3, d.level || 0));
    } catch {
      return 0;
    }
  });

  const [hero, setHero] = useState<HeroState>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (d.hero) {
        return { ...defaultHero(), ...d.hero, acc: { ...defaultHero().acc, ...(d.hero.acc || {}) } };
      }
    } catch {}
    return defaultHero();
  });

  const [birds, setBirds] = useState<DiaryBird[]>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(d.birds) ? d.birds : [];
    } catch {
      return [];
    }
  });

  const [coords, setCoords] = useState<({ lat: number; lon: number } | null)[]>(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(d.coords) && d.coords.length === 3 ? d.coords : [null, null, null];
    } catch {
      return [null, null, null];
    }
  });

  // Vistas y navegación interna: 'map' | 'diary' | 'hero'
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'diary' | 'hero'>('map');

  // Distancia del avatar en el mapa
  const [heroDist, setHeroDist] = useState<number>(() => cum[STOP_IDX[level]] || 0);
  const [walking, setWalking] = useState<boolean>(false);

  // Modales
  const [isFichaOpen, setIsFichaOpen] = useState<boolean>(false);
  const [editingBirdId, setEditingBirdId] = useState<string | null>(null);
  const [selectedStopForNewBird, setSelectedStopForNewBird] = useState<number>(0);
  
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [celebrationData, setCelebrationData] = useState<{ title: string; text: string; isFinal: boolean }>({ title: '', text: '', isFinal: false });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Toast flotante
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Formulario de Ficha
  const [fName, setFName] = useState<string>('');
  const [fUnknown, setFUnknown] = useState<boolean>(false);
  const [fSize, setFSize] = useState<string>('');
  const [fBeak, setFBeak] = useState<string>('');
  const [fColors, setFColors] = useState<string[]>([]);
  const [fDoing, setFDoing] = useState<string[]>([]);
  const [fNotes, setFNotes] = useState<string>('');
  const [fStop, setFStop] = useState<number>(0);
  const [fWhere, setFWhere] = useState<string>('');
  const [fPhoto, setFPhoto] = useState<string | null>(null);
  const [fErr, setFErr] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        started,
        level,
        hero,
        birds,
        coords
      }));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }, [started, level, hero, birds, coords]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const getScore = (b: DiaryBird) => {
    return 10 + (b.photo ? 5 : 0) + 
      ((b.size || b.beak || (b.colors && b.colors.length) || (b.doing && b.doing.length) || (b.notes && b.notes.trim())) ? 5 : 0) + 
      ((b.where && b.where.trim()) ? 5 : 0);
  };

  const totalStars = birds.reduce((a, b) => a + getScore(b), 0) + 10 * Math.min(level, 3);
  const birdsAtStop = (i: number) => birds.filter(b => b.stop === i).length;

  // Caminata animada hacia la siguiente parada
  const handleAdvance = () => {
    if (walking || level > 2) return;
    const currentNeed = birdsAtStop(level);
    if (currentNeed < NEED) {
      showToast(`Primero completá al menos una ficha de ave en la parada actual (${STOPS[level].short}).`);
      return;
    }

    setWalking(true);
    const nextStopIdx = STOP_IDX[level + 1];
    const targetDist = cum[nextStopIdx];
    const fromDist = heroDist;
    const duration = 2000;
    const t0 = performance.now();

    const animateWalk = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const currentD = fromDist + (targetDist - fromDist) * ease;
      setHeroDist(currentD);

      if (progress < 1) {
        requestAnimationFrame(animateWalk);
      } else {
        setWalking(false);
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setHeroDist(cum[STOP_IDX[nextLevel]] || targetDist);

        if (nextLevel >= 3) {
          confetti({ particleCount: 120, spread: 80 });
          setCelebrationData({
            title: '¡Completaste todo el recorrido!',
            text: `Anotaste ${birds.length} ${birds.length === 1 ? 'ave' : 'aves'} y acumulaste ${totalStars} estrellas en tu diario de explorador.`,
            isFinal: true
          });
        } else {
          confetti({ particleCount: 80, spread: 60 });
          setCelebrationData({
            title: `¡Llegaste a la ${STOPS[nextLevel].short}!`,
            text: `Nivel ${nextLevel + 1} de 3 alcanzado. Sumaste 10 estrellas. Mirá a tu alrededor y registrá las aves de este punto.`,
            isFinal: false
          });
        }
        setIsCelebrationOpen(true);
      }
    };

    requestAnimationFrame(animateWalk);
  };

  // Abrir modal de Ficha
  const handleOpenFicha = (birdId?: string | null, stopIdx?: number) => {
    if (birdId) {
      const b = birds.find(x => x.id === birdId);
      if (b) {
        setEditingBirdId(b.id);
        setFName(b.name || '');
        setFUnknown(!!b.unknown);
        setFSize(b.size || '');
        setFBeak(b.beak || '');
        setFColors(b.colors || []);
        setFDoing(b.doing || []);
        setFNotes(b.notes || '');
        setFStop(b.stop);
        setFWhere(b.where || '');
        setFPhoto(b.photo || null);
        setFErr('');
        setConfirmDelete(false);
        setIsFichaOpen(true);
        return;
      }
    }

    // Nueva Ficha
    setEditingBirdId(null);
    setFName('');
    setFUnknown(false);
    setFSize('');
    setFBeak('');
    setFColors([]);
    setFDoing([]);
    setFNotes('');
    setFStop(stopIdx !== undefined ? stopIdx : Math.min(level, 2));
    setFWhere('');
    setFPhoto(null);
    setFErr('');
    setConfirmDelete(false);
    setIsFichaOpen(true);
  };

  // Manejo de fotos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 720;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          setFPhoto(compressed);
          setFErr('');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Guardar ficha
  const handleSaveFicha = (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = fName.trim();
    if (!nameTrimmed && !fUnknown) {
      setFErr('Escribí qué ave es o marcá "Todavía no sé qué ave es".');
      return;
    }

    const newBird: DiaryBird = {
      id: editingBirdId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
      name: nameTrimmed,
      unknown: fUnknown && !nameTrimmed,
      size: fSize,
      beak: fBeak,
      colors: [...fColors],
      doing: [...fDoing],
      notes: fNotes.trim(),
      stop: fStop,
      where: fWhere.trim(),
      photo: fPhoto,
      date: new Date().toISOString()
    };

    if (editingBirdId) {
      setBirds(prev => prev.map(b => (b.id === editingBirdId ? { ...newBird, date: b.date } : b)));
      showToast('Ficha actualizada con éxito.');
    } else {
      setBirds(prev => [...prev, newBird]);
      const pts = getScore(newBird);
      showToast(`¡Ficha guardada! Sumaste +${pts} estrellas.`);
      confetti({ particleCount: 50, spread: 50 });
    }

    setIsFichaOpen(false);
  };

  const handleDeleteBird = () => {
    if (!editingBirdId) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBirds(prev => prev.filter(b => b.id !== editingBirdId));
    setIsFichaOpen(false);
    showToast('Ficha eliminada del diario.');
  };

  // Generar héroe al azar
  const handleRandomizeHero = () => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const newHero: HeroState = {
      name: hero.name,
      gender: pick(GENDERS)[0],
      skin: Math.floor(Math.random() * SKIN.length),
      hairStyle: pick(HAIR_STYLES)[0],
      hairColor: Math.floor(Math.random() * HAIR.length),
      outfit: pick(OUTFITS)[0],
      shirt: Math.floor(Math.random() * COLORS.length),
      pants: Math.floor(Math.random() * PANTS.length),
      bottom: pick(BOTTOMS)[0],
      hat: pick(HATS)[0],
      hatColor: Math.floor(Math.random() * COLORS.length),
      acc: {
        binoculares: true,
        anteojos: Math.random() < 0.4,
        mochila: Math.random() < 0.4,
        camara: Math.random() < 0.4,
        bufanda: Math.random() < 0.4
      }
    };
    setHero(newHero);
    showToast('¡Nuevo estilo de explorador generado!');
  };

  // Posición actual del héroe en el mapa
  const heroPos = heroXY(heroDist);

  return (
    <section id="expedicion" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Toast Flotante */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#263b2b] text-amber-50 px-5 py-3 rounded-2xl shadow-xl border border-amber-400/40 text-sm font-bold animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f4bb29]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Encabezado Principal de la Expedición */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#263b2b] via-[#334c38] to-[#1f3023] text-white p-6 sm:p-8 shadow-xl border border-emerald-900/30 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#f4bb29] text-[#263b2b] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Footprints className="w-3.5 h-3.5" />
                Juego de Campo • Paradas y Misiones
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs font-extrabold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {totalStars} Estrellas
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-fraunces tracking-tight text-white">
              Eco-Quest: Expedición por Paradas
            </h2>
            <p className="text-amber-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Juego interactivo para salidas de campo. Recorré las paradas marcadas en el mapa del parque, sacá fotos con tu celular y creá tus fichas de avistamiento.
            </p>

            {/* Acceso rápido a Trivia y Memotest */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
              <span className="text-[11px] font-bold text-amber-300">Más desafíos en esta sección:</span>
              <a
                href="#trivia"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/25 text-white text-xs font-bold transition"
              >
                ❓ Trivia de Aves ↓
              </a>
              <a
                href="#trivia"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/25 text-white text-xs font-bold transition"
              >
                🃏 Memotest de Aves ↓
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pill del Explorador */}
            <div 
              onClick={() => setActiveSubTab('hero')}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition shadow-sm"
              title="Personalizar mi personaje"
            >
              <div 
                className="w-8 h-10 overflow-hidden shrink-0 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 120 170" width="30" height="42">${renderHeroSvgInner(hero)}</svg>` }}
              />
              <div className="text-left">
                <div className="text-[10px] text-amber-300 uppercase tracking-widest font-black">Tu personaje</div>
                <div className="text-xs font-bold text-white line-clamp-1">{hero.name.trim() || (hero.gender === 'mujer' ? 'Exploradora' : 'Explorador')}</div>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white border border-white/20 transition shadow-sm"
              title="Ajustes de la expedición"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Juego */}
        <div className="mt-6 flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15 w-fit">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'map'
                ? 'bg-[#f4bb29] text-[#263b2b] shadow-md'
                : 'text-amber-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Mapa del Parque
          </button>
          
          <button
            onClick={() => setActiveSubTab('diary')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'diary'
                ? 'bg-[#f4bb29] text-[#263b2b] shadow-md'
                : 'text-amber-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            Mi Diario de Aves
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#263b2b] text-amber-300">
              {birds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('hero')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'hero'
                ? 'bg-[#f4bb29] text-[#263b2b] shadow-md'
                : 'text-amber-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="w-4 h-4" />
            Mi Explorador
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: EL MAPA DEL PARQUE (Siempre visible o preponderante) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[480px] aspect-[864/1226] rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-900/20 bg-[#9bd46b]">
            <img 
              src="/mapa-parque.jpg" 
              alt="Mapa ilustrado del parque"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback elegante si tarda la carga
                e.currentTarget.style.opacity = '0.9';
              }}
            />

            {/* Capa vectorial de recorrido, paradas y explorador */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 864 1226">
              {/* Línea punteada de recorrido */}
              <polyline 
                points={trailPts(heroDist)} 
                fill="none" 
                stroke="#A8582E" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeDasharray="0.1 18"
              />

              {/* Paradas 1, 2 y 3 */}
              {STOPS.map((s, idx) => {
                const isDone = level > idx;
                const isCurrent = level === idx;
                const badgeX = s.x + s.badge[0];
                const badgeY = s.y + s.badge[1];

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer group"
                    onClick={() => {
                      if (!started) {
                        setStarted(true);
                        showToast('¡Comenzó la expedición! Registrá tu ave en la Entrada.');
                      } else {
                        handleOpenFicha(null, idx);
                      }
                    }}
                  >
                    {/* Efecto halo/pulso */}
                    {isCurrent && (
                      <circle cx={s.x} cy={s.y} r="24" fill="none" stroke="#fff" strokeWidth="5" className="animate-ping opacity-75" />
                    )}
                    <circle cx={s.x} cy={s.y} r="22" fill={isDone ? '#3D531B' : '#fff'} stroke="#A8582E" strokeWidth="4" />
                    
                    {/* Badge con número o tilde */}
                    <circle 
                      cx={badgeX} 
                      cy={badgeY} 
                      r="19" 
                      fill={isDone ? '#3D531B' : '#fff'} 
                      stroke="#A8582E" 
                      strokeWidth="5" 
                      className="group-hover:scale-110 transition-transform origin-center"
                    />
                    <text 
                      x={badgeX} 
                      y={badgeY + 1} 
                      textAnchor="middle" 
                      dominantBaseline="central"
                      fill={isDone ? '#fff' : '#A8582E'}
                      fontSize="20"
                      fontWeight="900"
                    >
                      {isDone ? '✓' : idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Avatar del alumno posicionado en el mapa */}
              <g transform={`translate(${heroPos.x.toFixed(1)} ${(heroPos.y + (walking ? -Math.abs(Math.sin(heroDist / 12)) * 6 : 0)).toFixed(1)})`} style={{ pointerEvents: 'none' }}>
                <ellipse cx="0" cy="15" rx="20" ry="6" fill="#000" opacity="0.25" />
                <g 
                  transform="translate(-30, -67) scale(0.5)"
                  dangerouslySetInnerHTML={{ __html: renderHeroSvgInner(hero) }}
                />

                {/* Etiqueta identificatoria del alumno */}
                <rect x="-24" y="-80" width="48" height="15" rx="7.5" fill="#263b2b" opacity="0.9" stroke="#f4bb29" strokeWidth="1" />
                <text x="0" y="-72" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="9" fontWeight="900">
                  {hero.name ? hero.name.slice(0, 8) : 'Alumno'}
                </text>
              </g>
            </svg>

            {/* Pantalla inicial sobre el mapa si aún no arrancó */}
            {!started && (
              <div className="absolute inset-0 bg-[#263b2b]/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#f4bb29] text-[#263b2b] flex items-center justify-center mb-4 shadow-xl">
                  <Footprints className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold font-serif-fraunces text-white">
                  Eco-Quest Parque
                </h3>
                <p className="text-sm text-amber-100 mt-2 max-w-xs leading-relaxed">
                  Recorré las 3 paradas del parque, identificá las aves de la zona y armá tu diario de campo.
                </p>
                <button
                  onClick={() => {
                    setStarted(true);
                    setActiveSubTab('hero');
                    showToast('Paso 1: Armá tu explorador y volvé al mapa.');
                  }}
                  className="mt-6 px-8 py-3.5 rounded-full text-base font-extrabold bg-[#f4bb29] text-[#263b2b] hover:bg-[#ffc940] transition shadow-xl active:scale-95"
                >
                  ¡Empezar la salida!
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE JUEGO (Misión, Brújula, Diario o Creador de Avatar) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* TAB 1: MAPA Y BRÚJULA */}
          {activeSubTab === 'map' && (
            <>
              {/* Tarjeta de la Misión Actual */}
              <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-[#fff9ed]/95 border-2 border-amber-900/15 shadow-sm transition-all">
                {/* Manchas orgánicas de fondo (iguales a las demás tarjetas de la app) */}
                <img
                  src="/blob-shape.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 w-52 sm:w-64 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
                />
                <img
                  src="/blob-shape.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute -left-10 -bottom-10 w-44 sm:w-56 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
                />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-900/10 mb-4">
                    {/* Badge de Nivel con números 1 y 3 bien legibles */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4bb29] text-[#263b2b] border border-amber-900/20 shadow-xs">
                      <Award className="w-4 h-4 text-[#263b2b] shrink-0" />
                      {level > 2 ? (
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wide">Recorrido Finalizado</span>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wide">
                          <span>Nivel</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#263b2b] text-[#f4bb29] font-black text-sm sm:text-base leading-none clear-nums">
                            {level + 1}
                          </span>
                          <span className="text-[11px] font-bold text-[#263b2b]/80 lowercase">de</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#263b2b] text-[#f4bb29] font-black text-sm sm:text-base leading-none clear-nums">
                            3
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full bg-amber-100 text-[#9a561d] border border-amber-900/10">
                      {hero.name ? `Explorador/a: ${hero.name}` : (hero.gender === 'mujer' ? 'Exploradora' : 'Explorador')}
                    </span>
                  </div>

                  {level > 2 ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <Sparkles className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif-fraunces text-[#263b2b]">
                        ¡Felicitaciones, completaste el sendero!
                      </h3>
                      <p className="text-sm text-slate-700 mt-2 max-w-md mx-auto">
                        Registraste un total de <b>{birds.length} {birds.length === 1 ? 'ave' : 'aves'}</b> y reuniste <b>{totalStars} estrellas</b>. Tu bitácora de campo está completa.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveSubTab('diary')}
                          className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md"
                        >
                          Ver mi Diario de Aves
                        </button>
                        <button
                          onClick={() => {
                            setLevel(0);
                            setHeroDist(cum[0]);
                            showToast('Recorrido reiniciado. Tus fichas anteriores se mantienen guardadas.');
                          }}
                          className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                        >
                          Recorrer de nuevo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-fraunces text-[#263b2b] flex flex-wrap items-baseline gap-2">
                        <span>{STOPS[level].short}:</span>
                        <span className="text-amber-950 font-bold">{STOPS[level].place}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                        {STOPS[level].tip}
                      </p>

                      {/* Barra de progreso de la parada */}
                      <div className="mt-5 p-4 rounded-2xl bg-[#f4f7ee]/90 border border-green-900/10 shadow-xs">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                          <span>Fichas registradas en esta parada:</span>
                          <span className="text-[#263b2b] font-black clear-nums text-sm">
                            {Math.min(birdsAtStop(level), NEED)} / {NEED}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-amber-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-700 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (birdsAtStop(level) / NEED) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Acciones de la parada */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleOpenFicha(null, level)}
                          disabled={walking}
                          className="px-6 py-3.5 rounded-full text-sm sm:text-base font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md active:scale-95 flex items-center gap-2.5"
                        >
                          <Camera className="w-5 h-5 text-[#f4bb29]" />
                          Anotar un ave en esta parada
                        </button>

                        <button
                          onClick={handleAdvance}
                          disabled={birdsAtStop(level) < NEED || walking}
                          className={`px-6 py-3.5 rounded-full text-sm sm:text-base font-extrabold transition shadow-md flex items-center gap-2.5 ${
                            birdsAtStop(level) >= NEED && !walking
                              ? 'bg-[#A8582E] text-white hover:bg-[#8d4724] active:scale-95'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {walking ? 'Caminando...' : level < 2 ? `Avanzar a la ${STOPS[level + 1].short} →` : 'Completar el recorrido →'}
                        </button>
                      </div>

                      {/* Aviso claro y de gran tamaño sobre el requisito de avance */}
                      {birdsAtStop(level) < NEED && (
                        <div className="mt-5 p-4 rounded-2xl bg-amber-100/95 border-2 border-amber-400/80 text-amber-950 flex items-start sm:items-center gap-3.5 shadow-xs">
                          <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-xs">
                            <AlertCircle className="w-5 h-5 text-amber-800" />
                          </div>
                          <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#5c310b] leading-snug">
                            Completá al menos una ficha en esta parada para habilitar el avance a la siguiente.
                          </p>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MI DIARIO DE AVES */}
          {activeSubTab === 'diary' && (
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-[#fff9ed]/95 border-2 border-amber-900/15 shadow-sm transition-all">
              {/* Manchas orgánicas de fondo */}
              <img
                src="/blob-shape.jpg"
                alt=""
                aria-hidden="true"
                className="absolute -right-8 -top-8 w-52 sm:w-64 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
              />
              <img
                src="/blob-shape.jpg"
                alt=""
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-44 sm:w-56 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
              />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/10 mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold font-serif-fraunces text-[#263b2b]">
                    Mi Diario de Aves del Parque
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {birds.length} {birds.length === 1 ? 'ave registrada' : 'aves registradas'} • {totalStars} estrellas acumuladas
                  </p>
                </div>

                <button
                  onClick={() => handleOpenFicha(null, Math.min(level, 2))}
                  className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-[#f4bb29]" />
                  Nueva ficha de ave
                </button>
              </div>

              {birds.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-amber-900/20 rounded-3xl text-center flex flex-col items-center justify-center text-slate-500">
                  <Camera className="w-12 h-12 text-amber-700/40 mb-3" />
                  <h4 className="text-lg font-bold text-[#263b2b]">Tu diario está esperando tu primera observación</h4>
                  <p className="text-xs max-w-sm mt-1 text-slate-600">
                    En cada parada del parque hacé clic en "Nueva ficha de ave" para registrar una foto, los colores, el pico y qué estaba haciendo.
                  </p>
                  <button
                    onClick={() => handleOpenFicha(null, Math.min(level, 2))}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#A8582E] text-white hover:bg-[#8d4724] transition shadow-sm"
                  >
                    Crear mi primera ficha
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {STOPS.map((s, stopIdx) => {
                    const stopBirds = birds.filter(b => b.stop === stopIdx);
                    if (stopBirds.length === 0) return null;

                    return (
                      <div key={stopIdx}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="h-6 w-6 rounded-full bg-[#3D531B] text-white text-xs font-black flex items-center justify-center">
                            {stopIdx + 1}
                          </span>
                          <h4 className="text-lg font-bold font-serif-fraunces text-[#263b2b]">
                            {s.short} ({s.place})
                          </h4>
                          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            {stopBirds.length} {stopBirds.length === 1 ? 'ave' : 'aves'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {stopBirds.map((b) => (
                            <div
                              key={b.id}
                              onClick={() => handleOpenFicha(b.id)}
                              className="p-3.5 rounded-2xl bg-white border border-amber-900/15 shadow-sm hover:shadow-md cursor-pointer transition flex gap-3.5 items-center group"
                            >
                              <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-100/70 border border-amber-900/10 shrink-0 flex items-center justify-center">
                                {b.photo ? (
                                  <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Camera className="w-8 h-8 text-amber-700/40" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-sm text-[#263b2b] truncate group-hover:text-emerald-800 transition">
                                  {b.unknown ? 'Ave sin identificar' : (b.name || 'Ave sin nombre')}
                                </h5>

                                {/* Bolitas de colores */}
                                {b.colors && b.colors.length > 0 && (
                                  <div className="flex items-center gap-1 my-1">
                                    {b.colors.map((cName, cIdx) => {
                                      const found = BCOL.find(x => x[1] === cName);
                                      return (
                                        <span 
                                          key={cIdx} 
                                          className="w-3 h-3 rounded-full border border-black/20" 
                                          style={{ background: found ? found[0] : '#ccc' }} 
                                          title={cName}
                                        />
                                      );
                                    })}
                                  </div>
                                )}

                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {[b.size, b.doing?.join(', ')].filter(Boolean).join(' • ')}
                                </p>
                                <p className="text-[10px] text-amber-900 font-semibold mt-0.5 truncate">
                                  {b.where || s.place}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
                </div>
            </div>
          )}

          {/* TAB 3: CREADOR DE EXPLORADOR */}
          {activeSubTab === 'hero' && (
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-[#fff9ed]/95 border-2 border-amber-900/15 shadow-sm transition-all">
              {/* Manchas orgánicas de fondo */}
              <img
                src="/blob-shape.jpg"
                alt=""
                aria-hidden="true"
                className="absolute -right-8 -top-8 w-52 sm:w-64 h-auto opacity-25 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
              />
              <img
                src="/blob-shape.jpg"
                alt=""
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-44 sm:w-56 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-amber-900/10 mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold font-serif-fraunces text-[#263b2b]">
                    Armá tu {hero.gender === 'mujer' ? 'Exploradora' : 'Explorador'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Elegí tu ropa, colores y accesorios para la salida de campo.
                  </p>
                </div>

                <button
                  onClick={handleRandomizeHero}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-[#263b2b] border border-amber-900/15 transition flex items-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  ¡Sorpresa!
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Vista previa en grande */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-[#D0B48D]/40 border-2 border-[#A4AC7C] flex flex-col items-center justify-center">
                  <div 
                    className="w-36 h-48 flex items-center justify-center drop-shadow-md"
                    dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 120 170" width="140" height="190">${renderHeroSvgInner(hero)}</svg>` }}
                  />
                  <div className="mt-3 text-center">
                    <span className="text-xs font-black uppercase text-[#3D531B] tracking-wider block">Vista previa</span>
                    <span className="text-sm font-bold text-[#263b2b]">{hero.name.trim() || (hero.gender === 'mujer' ? 'Exploradora' : 'Explorador')}</span>
                  </div>
                </div>

                {/* Controles de Personalización */}
                <div className="md:col-span-7 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Nombre</label>
                    <input 
                      type="text" 
                      value={hero.name} 
                      onChange={(e) => setHero(h => ({ ...h, name: e.target.value }))}
                      placeholder="Escribí tu nombre..."
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-900/20 bg-white text-xs font-bold text-[#263b2b] focus:outline-emerald-700"
                    />
                  </div>

                  {/* Género */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Soy</label>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, gender: val }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                            hero.gender === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color de piel */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Color de piel</label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN.map(([color, label], idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, skin: idx }))}
                          style={{ backgroundColor: color }}
                          className={`w-7 h-7 rounded-full border-2 transition ${
                            hero.skin === idx ? 'border-black scale-110 shadow-md' : 'border-white'
                          }`}
                          title={label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Peinado */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Peinado</label>
                    <div className="flex flex-wrap gap-1.5">
                      {HAIR_STYLES.map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, hairStyle: val }))}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                            hero.hairStyle === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color de pelo */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Color de pelo</label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR.map(([color, label], idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, hairColor: idx }))}
                          style={{ backgroundColor: color }}
                          className={`w-7 h-7 rounded-full border-2 transition ${
                            hero.hairColor === idx ? 'border-black scale-110 shadow-md' : 'border-white'
                          }`}
                          title={label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Ropa de arriba */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Ropa de arriba</label>
                    <div className="flex flex-wrap gap-2">
                      {OUTFITS.map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, outfit: val }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                            hero.outfit === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color de ropa */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Color de ropa</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(([color, label], idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, shirt: idx }))}
                          style={{ backgroundColor: color }}
                          className={`w-7 h-7 rounded-full border-2 transition ${
                            hero.shirt === idx ? 'border-black scale-110 shadow-md' : 'border-white'
                          }`}
                          title={label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Parte de abajo */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Parte de abajo</label>
                    <div className="flex flex-wrap gap-2">
                      {BOTTOMS.map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, bottom: val }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                            hero.bottom === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sombrero */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Sombrero</label>
                    <div className="flex flex-wrap gap-2">
                      {HATS.map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHero(h => ({ ...h, hat: val }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                            hero.hat === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accesorios */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Accesorios</label>
                    <div className="flex flex-wrap gap-2">
                      {ACCS.map(([val, label]) => {
                        const isSelected = !!hero.acc[val];
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setHero(h => ({ ...h, acc: { ...h.acc, [val]: !h.acc[val] } }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                              isSelected ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-300 text-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('map');
                      showToast('Explorador guardado. ¡Listo para la salida!');
                    }}
                    className="mt-4 px-6 py-3 rounded-full text-xs font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 text-[#f4bb29]" />
                    Listo, volver al mapa
                  </button>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: FICHA DE AVE */}
      {isFichaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <form 
            onSubmit={handleSaveFicha}
            className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-5 sm:p-7 flex flex-col gap-4 text-slate-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/15">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9a561d] block">
                  Bitácora de Observación • {STOPS[fStop]?.short}
                </span>
                <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b]">
                  {editingBirdId ? 'Editar Ficha de Ave' : 'Nueva Ficha de Ave'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFichaOpen(false)}
                className="p-1.5 rounded-full hover:bg-amber-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto de la cámara o galería */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-amber-900/15">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-amber-100/60 border border-amber-900/15 shrink-0 flex items-center justify-center">
                {fPhoto ? (
                  <img src={fPhoto} alt="Foto tomada" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-amber-700/40" />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition flex items-center gap-1.5 mx-auto sm:mx-0 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-[#f4bb29]" />
                  {fPhoto ? 'Cambiar foto' : 'Sacar o subir foto'}
                </button>
                {fPhoto && (
                  <button
                    type="button"
                    onClick={() => setFPhoto(null)}
                    className="text-[11px] text-red-600 font-bold hover:underline mt-1.5 block mx-auto sm:mx-0"
                  >
                    Quitar foto
                  </button>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  Podés sacarla con la cámara de tu celular o elegirla desde tu galería.
                </p>
              </div>
            </div>

            {/* Nombre del Ave */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                ¿Qué ave es?
              </label>
              <input
                type="text"
                list="birdDatalist"
                value={fName}
                onChange={(e) => {
                  setFName(e.target.value);
                  setFErr('');
                }}
                placeholder="Ejemplo: Tero real, Hornero, Benteveo..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-900/20 bg-white text-xs font-bold text-[#263b2b] focus:outline-emerald-700"
              />
              <datalist id="birdDatalist">
                <option value="Tero real" />
                <option value="Hornero" />
                <option value="Benteveo" />
                <option value="Pato de collar" />
                <option value="Biguá" />
                <option value="Carpintero campestre" />
                <option value="Chimango" />
                <option value="Cotorra" />
                <option value="Cuervillo cara pelada" />
                <option value="Gallareta" />
                <option value="Macá común" />
                <option value="Picabuey" />
                <option value="Calandria grande" />
                <option value="Chingolo común" />
                <option value="Garza blanca" />
                <option value="Pato maicero" />
                <option value="Pollona negra" />
                <option value="Tordo renegrido" />
              </datalist>

              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={fUnknown} 
                  onChange={(e) => {
                    setFUnknown(e.target.checked);
                    setFErr('');
                  }} 
                  className="rounded text-emerald-700 focus:ring-emerald-700" 
                />
                <span className="text-xs font-bold text-slate-600">Todavía no sé qué ave es (investigar más tarde)</span>
              </label>
            </div>

            {/* Tamaño */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">Tamaño</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFSize(prev => prev === val ? '' : val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      fSize === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores que viste */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">Colores que viste</label>
              <div className="flex flex-wrap gap-2">
                {BCOL.map(([hex, label]) => {
                  const isChecked = fColors.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setFColors(prev => isChecked ? prev.filter(c => c !== label) : [...prev, label]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                        isChecked ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: hex }} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forma del pico */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">Forma del pico</label>
              <div className="flex flex-wrap gap-2">
                {BEAKS.map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFBeak(prev => prev === val ? '' : val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      fBeak === val ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ¿Qué hacía? */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">¿Qué hacía?</label>
              <div className="flex flex-wrap gap-2">
                {DOING.map((act) => {
                  const isChecked = fDoing.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => {
                        setFDoing(prev => isChecked ? prev.filter(a => a !== act) : [...prev, act]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                        isChecked ? 'bg-[#3D531B] text-white' : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{act}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Otras notas */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Otras características (cresta, patas, canto...)
              </label>
              <textarea
                value={fNotes}
                onChange={(e) => setFNotes(e.target.value)}
                rows={2}
                placeholder="Anotá si tenía cresta, patas rojas, cola larga, si cantaba fuerte..."
                className="w-full px-3.5 py-2 rounded-xl border border-amber-900/20 bg-white text-xs font-medium text-[#263b2b] focus:outline-emerald-700"
              />
            </div>

            {/* ¿Dónde la viste? */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Parada</label>
                <select
                  value={fStop}
                  onChange={(e) => setFStop(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-amber-900/20 bg-white text-xs font-bold text-[#263b2b]"
                >
                  {STOPS.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.short} ({s.place})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Detalle del lugar</label>
                <input
                  type="text"
                  value={fWhere}
                  onChange={(e) => setFWhere(e.target.value)}
                  placeholder="Ej.: en la orilla, sobre una rama..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-900/20 bg-white text-xs font-bold text-[#263b2b]"
                />
              </div>
            </div>

            {/* Error si falta nombre */}
            {fErr && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {fErr}
              </p>
            )}

            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-3 border-t border-amber-900/15">
              {editingBirdId ? (
                <button
                  type="button"
                  onClick={handleDeleteBird}
                  className="px-4 py-2 rounded-full text-xs font-bold text-red-700 hover:bg-red-50 border border-red-300 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmDelete ? 'Confirmar eliminar' : 'Eliminar'}
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFichaOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-md"
                >
                  Guardar ficha
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CELEBRACIÓN */}
      {isCelebrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div 
              className="w-32 h-44 flex items-center justify-center mb-2 drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 120 170" width="130" height="175">${renderHeroSvgInner(hero)}</svg>` }}
            />
            <h3 className="text-2xl font-extrabold font-serif-fraunces text-[#263b2b]">
              {celebrationData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              {celebrationData.text}
            </p>
            <button
              onClick={() => {
                setIsCelebrationOpen(false);
                if (celebrationData.isFinal) {
                  setActiveSubTab('diary');
                }
              }}
              className="mt-6 px-8 py-3 rounded-full text-xs sm:text-sm font-extrabold bg-[#263b2b] text-white hover:bg-[#1a2b1e] transition shadow-lg active:scale-95"
            >
              {celebrationData.isFinal ? 'Ver todas mis fichas' : '¡Continuar expedición!'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: AJUSTES & CALIBRACIÓN GPS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 text-slate-800 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/15">
              <h3 className="text-xl font-bold font-serif-fraunces text-[#263b2b] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#b66b22]" />
                Ajustes de la Expedición
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-amber-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#9a561d] mb-1">
                Calibración de Paradas con GPS Real
              </h4>
              <p className="text-[11px] text-slate-600 mb-3">
                Para docentes y guías. Párate físicamente en cada parada del parque y toca "Fijar acá" para registrar las coordenadas exactas de tu celular.
              </p>

              <div className="flex flex-col gap-2">
                {STOPS.map((s, idx) => {
                  const c = coords[idx];
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-amber-900/15 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#263b2b]">{s.short}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {c ? `${c.lat.toFixed(5)}, ${c.lon.toFixed(5)}` : 'Sin fijar (usa mapa)'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              showToast('Geolocalización no disponible.');
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (p) => {
                                setCoords(prev => {
                                  const next = [...prev];
                                  next[idx] = { lat: p.coords.latitude, lon: p.coords.longitude };
                                  return next;
                                });
                                showToast(`Parada ${s.short} fijada con GPS.`);
                              },
                              () => {
                                showToast('No se pudo obtener la posición GPS.');
                              },
                              { enableHighAccuracy: true, timeout: 10000 }
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200"
                        >
                          Fijar acá
                        </button>
                        {c && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoords(prev => {
                                const next = [...prev];
                                next[idx] = null;
                                return next;
                              });
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50"
                            title="Borrar coordenada"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-amber-900/15">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-800 mb-1">
                Reiniciar Avance
              </h4>
              <p className="text-[11px] text-slate-600 mb-2">
                Borra el diario de campo, el personaje y reinicia la salida desde la Entrada.
              </p>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch {}
                  setStarted(false);
                  setLevel(0);
                  setHero(defaultHero());
                  setBirds([]);
                  setCoords([null, null, null]);
                  setHeroDist(cum[0]);
                  setIsSettingsOpen(false);
                  showToast('Expedición reiniciada de cero.');
                }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-red-100 hover:bg-red-200 text-red-900 transition"
              >
                Borrar todo y reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
