import { BirdSighting, Bird } from '../types/bird';
import { OFFICIAL_ECOQUEST_BIRDS } from '../data/birdsData';

// Incremented storage keys to ensure clean migration and flush any legacy birds from previous versions
const SIGHTINGS_KEY = 'ecoquest_unvime_sightings_v5';
const ALBUM_KEY = 'ecoquest_unvime_album_v5';
const CUSTOM_BIRDS_KEY = 'ecoquest_unvime_custom_v5';

// Valid bird names from the official UNViMe poster
const VALID_BIRD_NAMES = new Set(OFFICIAL_ECOQUEST_BIRDS.map(b => b.name.toLowerCase()));

// No sample sightings: starts empty so each user records their own field sheets
const INITIAL_SAMPLE_SIGHTINGS: BirdSighting[] = [];


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
      localStorage.removeItem('ecoquest_unvim_sightings_v4');
    } catch {
      // ignore
    }
  },

  getSightings(): BirdSighting[] {
    this.cleanLegacyData();
    try {
      const data = localStorage.getItem(SIGHTINGS_KEY);
      if (!data) {
        localStorage.setItem(SIGHTINGS_KEY, JSON.stringify([]));
        return [];
      }
      const parsed: BirdSighting[] = JSON.parse(data);
      // Filter out any legacy bird names that are not in the poster
      const cleaned = parsed.filter(s => VALID_BIRD_NAMES.has(s.birdName.toLowerCase()) || s.birdName);
      return cleaned;
    } catch (err) {
      console.error('Error reading sightings', err);
      return [];
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
      app: 'Eco-Quest - Proyecto UNViMe (Villa Mercedes)',
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
  },

  async readAudioFile(file: File): Promise<string> {
    const MAX_BYTES = 3.5 * 1024 * 1024; // 3.5 MB max for reliable localStorage offline persistence
    if (file.size > MAX_BYTES) {
      throw new Error('AUDIO_TOO_LARGE');
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
