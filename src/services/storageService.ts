import { BirdSighting, Bird } from '../types/bird';
import { OFFICIAL_ECOQUEST_BIRDS } from '../data/birdsData';

// Incremented storage keys to ensure clean migration and flush any legacy birds from previous versions
const SIGHTINGS_KEY = 'ecoquest_unvim_sightings_v4';
const ALBUM_KEY = 'ecoquest_unvim_album_v4';
const CUSTOM_BIRDS_KEY = 'ecoquest_unvim_custom_v4';

// Valid bird names from the official UNViM poster
const VALID_BIRD_NAMES = new Set(OFFICIAL_ECOQUEST_BIRDS.map(b => b.name.toLowerCase()));

// Sample initial sightings placed on real geographical coordinates of Villa Mercedes
// Strictly from the 22 birds in the Eco-quest poster!
const INITIAL_SAMPLE_SIGHTINGS: BirdSighting[] = [
  {
    id: 'eco-sample-1',
    birdName: 'Garza blanca',
    scientificName: 'Ardea alba',
    date: '2026-10-21',
    time: '08:45',
    placeName: 'Dique Vulpiani (Compuertas & Humedal)',
    lat: -33.6482,
    lng: -65.4985,
    count: 2,
    category: 'acuaticas',
    behavior: 'Alimentándose',
    photoUrl: '/birds/garza-blanca.jpg',
    notes: 'Dos ejemplares vadeando en el agua mansa. Tamaño grande, plumaje completamente blanco y pico amarillo brillante.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'eco-sample-2',
    birdName: 'Pato de collar',
    scientificName: 'Callonetta leucophrys',
    date: '2026-10-22',
    time: '09:20',
    placeName: 'Río Quinto - Sector Dique Chico',
    lat: -33.6660,
    lng: -65.4760,
    count: 3,
    category: 'acuaticas',
    behavior: 'En el agua',
    photoUrl: '/birds/pato-de-collar.jpg',
    notes: 'Pato pequeño y vistoso nadando en el remanso. Macho con franja negra en la cabeza y pecho rosáceo con pecas.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'eco-sample-3',
    birdName: 'Hornero',
    scientificName: 'Furnarius rufus',
    date: '2026-10-22',
    time: '11:15',
    placeName: 'Plaza Pedernera (Centro Urbano)',
    lat: -33.6710,
    lng: -65.4600,
    count: 2,
    category: 'arboles',
    behavior: 'En nido',
    photoUrl: '/birds/hornero.jpg',
    notes: 'Ave mediana de plumaje pardo rojizo. Construyendo su nido de barro sobre la rama de una tipa.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'eco-sample-4',
    birdName: 'Carpintero campestre',
    scientificName: 'Colaptes campestris',
    date: '2026-10-23',
    time: '15:30',
    placeName: 'Parque Costanera Río Quinto',
    lat: -33.6745,
    lng: -65.4620,
    count: 1,
    category: 'pastizales',
    behavior: 'Posado',
    photoUrl: '/birds/carpintero-campestre.jpg',
    notes: 'Pájaro mediano con cara y pecho amarillo intenso y nuca negra.',
    createdAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: 'eco-sample-5',
    birdName: 'Tero real',
    scientificName: 'Himantopus mexicanus',
    date: '2026-10-23',
    time: '10:10',
    placeName: 'Parque La Pedrera (Espejo de Agua)',
    lat: -33.6895,
    lng: -65.4320,
    count: 2,
    category: 'acuaticas',
    behavior: 'Alimentándose',
    photoUrl: '/birds/tero-real.jpg',
    notes: 'Ave estilizada con plumaje bicolor y larguísimas patas rojo intenso vadeando en la orilla.',
    createdAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

export const storageService = {
  // Purge any legacy data from previous versions
  cleanLegacyData() {
    try {
      localStorage.removeItem('alas_vm_sightings_v1');
      localStorage.removeItem('alasAlbum');
      localStorage.removeItem('alas_vm_album_checked');
      localStorage.removeItem('alas_vm_custom_birds');
      localStorage.removeItem('alas_vm_ecoquest_sightings_v2');
      localStorage.removeItem('alas_vm_ecoquest_album_v2');
      localStorage.removeItem('alas_vm_ecoquest_custom_v2');
      localStorage.removeItem('ecoquest_unvim_sightings_v3');
    } catch {
      // ignore
    }
  },

  getSightings(): BirdSighting[] {
    this.cleanLegacyData();
    try {
      const data = localStorage.getItem(SIGHTINGS_KEY);
      if (!data) {
        localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(INITIAL_SAMPLE_SIGHTINGS));
        return INITIAL_SAMPLE_SIGHTINGS;
      }
      const parsed: BirdSighting[] = JSON.parse(data);
      // Filter out any legacy bird names that are not in the poster
      const cleaned = parsed.filter(s => VALID_BIRD_NAMES.has(s.birdName.toLowerCase()) || s.birdName);
      if (cleaned.length === 0) {
        localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(INITIAL_SAMPLE_SIGHTINGS));
        return INITIAL_SAMPLE_SIGHTINGS;
      }
      return cleaned;
    } catch (err) {
      console.error('Error reading sightings', err);
      return INITIAL_SAMPLE_SIGHTINGS;
    }
  },

  saveSighting(sighting: BirdSighting): BirdSighting[] {
    const list = this.getSightings();
    const existingIndex = list.findIndex(s => s.id === sighting.id);
    let updated: BirdSighting[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = sighting;
    } else {
      updated = [sighting, ...list];
    }
    try {
      localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
    return updated;
  },

  deleteSighting(id: string): BirdSighting[] {
    const list = this.getSightings().filter(s => s.id !== id);
    localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(list));
    return list;
  },

  getAlbumChecked(): Record<string, boolean> {
    try {
      const data = localStorage.getItem(ALBUM_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  setAlbumChecked(checkedMap: Record<string, boolean>) {
    try {
      localStorage.setItem(ALBUM_KEY, JSON.stringify(checkedMap));
    } catch (e) {
      console.error(e);
    }
  },

  getCustomBirds(): Bird[] {
    try {
      const data = localStorage.getItem(CUSTOM_BIRDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomBird(bird: Bird): Bird[] {
    const existing = this.getCustomBirds().filter(b => b.id !== bird.id);
    const updated = [bird, ...existing];
    localStorage.setItem(CUSTOM_BIRDS_KEY, JSON.stringify(updated));
    return updated;
  },

  getAllBirds(): Bird[] {
    // Only return the official 22 Eco-quest birds plus user-created custom birds
    const custom = this.getCustomBirds();
    return [...OFFICIAL_ECOQUEST_BIRDS, ...custom];
  },

  exportBackup(): string {
    const sightings = this.getSightings();
    const album = this.getAlbumChecked();
    const customBirds = this.getCustomBirds();
    const backup = {
      app: 'Eco-Quest - Proyecto UNViM (Villa Mercedes)',
      exportDate: new Date().toISOString(),
      sightings,
      album,
      customBirds
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.sightings && Array.isArray(parsed.sightings)) {
        localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(parsed.sightings));
      }
      if (parsed.album && typeof parsed.album === 'object') {
        localStorage.setItem(ALBUM_KEY, JSON.stringify(parsed.album));
      }
      if (parsed.customBirds && Array.isArray(parsed.customBirds)) {
        localStorage.setItem(CUSTOM_BIRDS_KEY, JSON.stringify(parsed.customBirds));
      }
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  },

  async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 900;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
