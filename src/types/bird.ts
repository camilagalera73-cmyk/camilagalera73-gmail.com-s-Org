export type EcoQuestCategory = 'acuaticas' | 'arboles' | 'pastizales';

export const CATEGORY_LABELS: Record<EcoQuestCategory, { name: string; color: string; dotColor: string }> = {
  acuaticas: {
    name: 'Aves acuáticas y de humedales',
    color: 'bg-sky-100 text-sky-900 border-sky-300',
    dotColor: '#308ba8'
  },
  arboles: {
    name: 'Aves de árboles y arbustos',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    dotColor: '#557544'
  },
  pastizales: {
    name: 'Aves de espacios abiertos y pastizales',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    dotColor: '#b66b22'
  }
};

export interface Bird {
  id: string;
  name: string;
  scientificName: string;
  category: EcoQuestCategory;
  categoryLabel: string;
  description: string;
  photoUrl: string;
  isCustom?: boolean;
}

export interface BirdSighting {
  id: string;
  birdName: string;
  scientificName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  placeName: string;
  lat: number;
  lng: number;
  count: number;
  category: EcoQuestCategory;
  behavior: 'Posado' | 'En vuelo' | 'Cantando' | 'Alimentándose' | 'En nido' | 'Con pichones' | 'En el agua';
  notes: string;
  photoBase64?: string;
  photoUrl?: string;
  createdAt: number;
}
