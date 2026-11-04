import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Plus, 
  MapPin, 
  Search, 
  Info, 
  Camera, 
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BirdSighting, EcoQuestCategory, CATEGORY_LABELS, Bird } from '../types/bird';
import { OFFICIAL_ECOQUEST_BIRDS } from '../data/birdsData';

// Villa Mercedes, San Luis center coordinates
const VM_CENTER: [number, number] = [-33.6756, -65.4578];
const VM_DEFAULT_ZOOM = 13;

// Map all 22 Eco-quest birds to real observation locations in Villa Mercedes
// So EVERY pin on the map represents AN ACTUAL BIRD from the poster!
const ECOQUEST_MAP_BIRDS: {
  birdId: string;
  name: string;
  scientificName: string;
  category: EcoQuestCategory;
  placeName: string;
  lat: number;
  lng: number;
  photoUrl: string;
  description: string;
}[] = [
  // Acuáticas y de humedales
  {
    birdId: 'garza-blanca',
    name: 'Garza blanca',
    scientificName: 'Ardea alba',
    category: 'acuaticas',
    placeName: 'Dique Vulpiani (Compuertas & Aguas Calmas)',
    lat: -33.6482,
    lng: -65.4985,
    photoUrl: '/birds/garza-blanca.jpg',
    description: 'Tamaño grande, plumaje completamente blanco, pico largo y de color amarillo brillante.'
  },
  {
    birdId: 'pato-de-collar',
    name: 'Pato de collar',
    scientificName: 'Callonetta leucophrys',
    category: 'acuaticas',
    placeName: 'Dique Vulpiani (Remansos del Río V)',
    lat: -33.6465,
    lng: -65.4950,
    photoUrl: '/birds/pato-de-collar.jpg',
    description: 'Pato pequeño y vistoso. Franja negra en cabeza y cuello, pecho rosáceo con pecas.'
  },
  {
    birdId: 'bigua',
    name: 'Biguá',
    scientificName: 'Nannopterum brasilianum',
    category: 'acuaticas',
    placeName: 'Río Quinto (Puente Peatonal de Madera)',
    lat: -33.6730,
    lng: -65.4650,
    photoUrl: '/birds/bigua.jpg',
    description: 'Ave acuática grande de plumaje negro brillante, cuello largo y pico con punta en gancho.'
  },
  {
    birdId: 'cuervillo-cara-pelada',
    name: 'Cuervillo cara pelada',
    scientificName: 'Phimosus infuscatus',
    category: 'acuaticas',
    placeName: 'Humedales del Río Quinto (Oeste)',
    lat: -33.6520,
    lng: -65.4910,
    photoUrl: '/birds/cuervillo-cara-pelada.jpg',
    description: 'Cara desnuda de color rosado, patas largas rojizas y pico largo curvado hacia abajo.'
  },
  {
    birdId: 'maca-comun',
    name: 'Macá común',
    scientificName: 'Rollandia rolland',
    category: 'acuaticas',
    placeName: 'Dique Vulpiani (Espejo de Agua)',
    lat: -33.6495,
    lng: -65.5010,
    photoUrl: '/birds/maca-comun.jpg',
    description: 'Pequeña y excelente buceadora, pasa gran parte del tiempo en el agua con ojos rojos.'
  },
  {
    birdId: 'pato-maicero',
    name: 'Pato maicero',
    scientificName: 'Anas georgica',
    category: 'acuaticas',
    placeName: 'Dique Chico & Balneario Municipal',
    lat: -33.6660,
    lng: -65.4760,
    photoUrl: '/birds/pato-maicero.jpg',
    description: 'Tamaño mediano, plumas marrones y beige, cuello largo y pico amarillo con mancha negra.'
  },
  {
    birdId: 'pato-barcino',
    name: 'Pato barcino',
    scientificName: 'Anas flavirostris',
    category: 'acuaticas',
    placeName: 'Costanera Río Quinto (Sector Sur)',
    lat: -33.6780,
    lng: -65.4590,
    photoUrl: '/birds/pato-barcino.jpg',
    description: 'Cuerpo compacto pardo finamente moteado y espejo alar negro y verde.'
  },
  {
    birdId: 'pollona-negra',
    name: 'Pollona negra',
    scientificName: 'Gallinula galeata',
    category: 'acuaticas',
    placeName: 'Lagunas y Bañados del Sur',
    lat: -33.7020,
    lng: -65.4850,
    photoUrl: '/birds/pollona-negra.jpg',
    description: 'Cabeza y pecho gris plomizo, patas rojizas y pico largo verdoso con zonas rojas.'
  },
  {
    birdId: 'gallareta',
    name: 'Gallareta',
    scientificName: 'Fulica leucoptera',
    category: 'acuaticas',
    placeName: 'Parque La Pedrera (Espejo de Agua)',
    lat: -33.6895,
    lng: -65.4320,
    photoUrl: '/birds/gallareta.jpg',
    description: 'Gris oscuro a negruzco, escudo frontal sobre el pico amarillo o rojizo.'
  },
  {
    birdId: 'gallineta-pico-pintado',
    name: 'Gallineta pico pintado',
    scientificName: 'Pardirallus sanguinolentus',
    category: 'acuaticas',
    placeName: 'Río Quinto (Juncales de Ribera)',
    lat: -33.6710,
    lng: -65.4700,
    photoUrl: '/birds/gallineta-pico-pintado.jpg',
    description: 'Pico largo verdoso con zonas celestes y rojas e iris rojo.'
  },
  {
    birdId: 'tero-real',
    name: 'Tero real',
    scientificName: 'Himantopus mexicanus',
    category: 'acuaticas',
    placeName: 'Parque La Pedrera (Borde de la Laguna)',
    lat: -33.6880,
    lng: -65.4350,
    photoUrl: '/birds/tero-real.jpg',
    description: 'Plumaje bicolor blanco y negro, patas muy largas de color rojo intenso y pico fino.'
  },

  // Árboles y arbustos
  {
    birdId: 'hornero',
    name: 'Hornero',
    scientificName: 'Furnarius rufus',
    category: 'arboles',
    placeName: 'Plaza Pedernera (Centro)',
    lat: -33.6710,
    lng: -65.4600,
    photoUrl: '/birds/hornero.jpg',
    description: 'Plumaje pardo rojizo, cuerpo robusto, cola corta y su famoso nido de barro.'
  },
  {
    birdId: 'benteveo',
    name: 'Benteveo',
    scientificName: 'Pitangus sulphuratus',
    category: 'arboles',
    placeName: 'Parque Costanera Río Quinto (Sauces)',
    lat: -33.6745,
    lng: -65.4620,
    photoUrl: '/birds/benteveo.jpg',
    description: 'Pecho amarillo intenso, antifaz negro ribeteado de blanco y grito "¡bichoféo!".'
  },
  {
    birdId: 'calandria-grande',
    name: 'Calandria grande',
    scientificName: 'Mimus saturninus',
    category: 'arboles',
    placeName: 'Arboleda de la Costanera Norte',
    lat: -33.6690,
    lng: -65.4680,
    photoUrl: '/birds/calandria-grande.jpg',
    description: 'Plumaje pardo grisáceo, vientre claro y cola larga con puntas blancas en vuelo.'
  },
  {
    birdId: 'cotorra',
    name: 'Cotorra',
    scientificName: 'Myiopsitta monachus',
    category: 'arboles',
    placeName: 'Complejo Molino Fénix & Calle Angosta',
    lat: -33.6640,
    lng: -65.4540,
    photoUrl: '/birds/cotorra.jpg',
    description: 'Verde brillante en espalda y alas, frente y pecho gris claro con líneas y chillidos.'
  },
  {
    birdId: 'paloma',
    name: 'Paloma',
    scientificName: 'Columba livia',
    category: 'arboles',
    placeName: 'Plaza San Martín (Centro)',
    lat: -33.6730,
    lng: -65.4570,
    photoUrl: '/birds/paloma.jpg',
    description: 'Plumaje gris ceniza o castaño con reflejos iridiscentes verdosos en el cuello.'
  },
  {
    birdId: 'chingolo-comun',
    name: 'Chingolo común',
    scientificName: 'Zonotrichia capensis',
    category: 'arboles',
    placeName: 'Jardines de Calle Av. Mitre',
    lat: -33.6680,
    lng: -65.4620,
    photoUrl: '/birds/chingolo-comun.jpg',
    description: 'Cabeza gris con copete de rayas negras y collar canela en el cuello.'
  },

  // Espacios abiertos y pastizales
  {
    birdId: 'carpintero-campestre',
    name: 'Carpintero campestre',
    scientificName: 'Colaptes campestris',
    category: 'pastizales',
    placeName: 'Parque Costanera Río Quinto (Troncos Viejos)',
    lat: -33.6760,
    lng: -65.4580,
    photoUrl: '/birds/carpintero-campestre.jpg',
    description: 'Cara y pecho amarillo intenso, nuca negra y espalda barrada.'
  },
  {
    birdId: 'picabuey',
    name: 'Picabuey',
    scientificName: 'Machetornis rixosa',
    category: 'pastizales',
    placeName: 'Pastizales de Parque La Pedrera',
    lat: -33.6910,
    lng: -65.4300,
    photoUrl: '/birds/picabuey.jpg',
    description: 'Pardo suave en dorso, pecho amarillo y corona oculta de plumas anaranjadas.'
  },
  {
    birdId: 'tordo-renegrido',
    name: 'Tordo renegrido',
    scientificName: 'Molothrus bonariensis',
    category: 'pastizales',
    placeName: 'Campos y Arboledas del Molino Fénix',
    lat: -33.6620,
    lng: -65.4510,
    photoUrl: '/birds/tordo-renegrido.jpg',
    description: 'Macho negro brillante con reflejos azulados violáceos al sol.'
  },
  {
    birdId: 'chimango',
    name: 'Chimango',
    scientificName: 'Daptrius chimango',
    category: 'pastizales',
    placeName: 'Caminos Rurales Norte / Ruta 7',
    lat: -33.6280,
    lng: -65.4650,
    photoUrl: '/birds/chimango.jpg',
    description: 'Rapaz pardo castaño con ventana alar clara visible en vuelo.'
  },
  {
    birdId: 'tero-comun',
    name: 'Tero común (o Teru-Teru)',
    scientificName: 'Vanellus chilensis',
    category: 'pastizales',
    placeName: 'Pastizales Abiertos de La Pedrera',
    lat: -33.6870,
    lng: -65.4380,
    photoUrl: '/birds/tero-comun.jpg',
    description: 'Patas largas, cresta fina detrás de la cabeza y espina afilada en las alas.'
  }
];

interface BirdMapProps {
  sightings: BirdSighting[];
  onOpenNewSighting: (coords?: { lat: number; lng: number; placeName?: string; birdName?: string }) => void;
  onSelectSighting: (sighting: BirdSighting) => void;
  onSelectBird?: (bird: Bird) => void;
}

export const BirdMap: React.FC<BirdMapProps> = ({
  sightings,
  onOpenNewSighting,
  onSelectSighting,
  onSelectBird
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [selectedFilter, setSelectedFilter] = useState<'all' | EcoQuestCategory | 'user'>('all');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempPoint, setTempPoint] = useState<{ lat: number; lng: number } | null>(null);

  const tileLayers = {
    streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri'
    }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; OpenTopoMap'
    })
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: VM_CENTER,
      zoom: VM_DEFAULT_ZOOM,
      zoomControl: false
    });

    tileLayers.streets.addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Click anywhere on the map of Villa Mercedes to place a new sighting
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setTempPoint({ lat, lng });

      if (tempMarkerRef.current) {
        tempMarkerRef.current.remove();
      }

      const customPinIcon = L.divIcon({
        className: 'custom-temp-pin',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:28px;height:28px;background:rgba(225,29,72,0.3);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:20px;height:20px;background:#e11d48;border:2.5px solid #ffffff;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const tempMarker = L.marker([lat, lng], { icon: customPinIcon }).addTo(map);
      tempMarkerRef.current = tempMarker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    tileLayers[activeLayer].addTo(map);
  }, [activeLayer]);

  // Update Markers: ONLY BIRD PINS!
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Add ALL 22 Eco-quest BIRDS to the map
    if (selectedFilter !== 'user') {
      const birdsToShow = ECOQUEST_MAP_BIRDS.filter(b => {
        if (selectedFilter === 'all') return true;
        return b.category === selectedFilter;
      });

      birdsToShow.forEach(bird => {
        const catMeta = CATEGORY_LABELS[bird.category];

        const birdIcon = L.divIcon({
          className: 'custom-bird-pin',
          html: `
            <div style="
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
            ">
              <div style="
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: 3px solid #ffffff;
                box-shadow: 0 4px 14px rgba(0,0,0,0.4);
                background: #ffffff;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <img 
                  src="${bird.photoUrl}" 
                  alt="${bird.name}"
                  style="width: 100%; height: 100%; object-fit: contain; background: #faf4e6;"
                  onerror="this.style.display='none'"
                />
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid ${catMeta.dotColor};
                margin-top: -2px;
              "></div>
              <div style="
                background: rgba(38,59,43,0.92);
                color: #ffffff;
                font-size: 10px;
                font-weight: 800;
                padding: 1px 7px;
                border-radius: 10px;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                margin-top: 2px;
                border: 1px solid rgba(255,255,255,0.3);
              ">
                ${bird.name}
              </div>
            </div>
          `,
          iconSize: [80, 70],
          iconAnchor: [40, 52]
        });

        const marker = L.marker([bird.lat, bird.lng], { icon: birdIcon });

        // Popup showing the BIRD (not just a place!)
        const popupDiv = document.createElement('div');
        popupDiv.className = 'p-1 text-slate-800 text-xs';
        popupDiv.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <img src="${bird.photoUrl}" style="width:48px; height:48px; object-fit:contain; border-radius:8px; background:#fff9ed; border:1px solid #dfcda4;" />
            <div>
              <strong style="font-size:14px; color:#263b2b; display:block;">${bird.name}</strong>
              <em style="color:#64748b; font-size:11px; display:block;">${bird.scientificName}</em>
              <span style="font-size:10px; font-weight:bold; color:${catMeta.dotColor};">
                ● ${catMeta.name}
              </span>
            </div>
          </div>
          <div style="font-size:11px; color:#334155; margin-bottom:6px; background:#f8fafc; padding:4px 8px; border-radius:6px;">
            📍 <b>Lugar en Villa Mercedes:</b> ${bird.placeName}
          </div>
          <p style="margin:0 0 8px 0; color:#475569; font-size:11px; line-height:1.4;">
            ${bird.description}
          </p>
        `;

        const btn = document.createElement('button');
        btn.textContent = '+ Registrar mi avistaje de esta ave aquí';
        btn.className = 'w-full py-2 px-3 rounded-xl font-bold text-white bg-[#b66b22] hover:bg-[#9a561d] text-xs cursor-pointer shadow-sm';
        btn.onclick = () => {
          onOpenNewSighting({
            lat: bird.lat,
            lng: bird.lng,
            placeName: bird.placeName,
            birdName: bird.name
          });
          map.closePopup();
        };
        popupDiv.appendChild(btn);

        marker.bindPopup(popupDiv);
        layer.addLayer(marker);
      });
    }

    // 2. Add User Recorded Sightings
    const userFiltered = sightings.filter(s => {
      if (selectedFilter === 'all' || selectedFilter === 'user') return true;
      return s.category === selectedFilter;
    });

    userFiltered.forEach(sighting => {
      const catMeta = CATEGORY_LABELS[sighting.category] || CATEGORY_LABELS.arboles;
      
      const userIcon = L.divIcon({
        className: 'custom-user-sighting-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50%;
              border: 3px solid #f4bb29;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
              background: #263b2b;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
            ">
              ${sighting.photoBase64 ? '📷' : '🪶'}
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 7px solid #263b2b;
              margin-top: -1px;
            "></div>
            <div style="
              background: #f4bb29;
              color: #263b2b;
              font-size: 9.5px;
              font-weight: 800;
              padding: 1px 6px;
              border-radius: 8px;
              white-space: nowrap;
              margin-top: 1px;
            ">
              Tu avistaje: ${sighting.birdName}
            </div>
          </div>
        `,
        iconSize: [90, 65],
        iconAnchor: [45, 45]
      });

      const userMarker = L.marker([sighting.lat, sighting.lng], { icon: userIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 text-xs';
      popupContent.innerHTML = `
        ${sighting.photoBase64 ? `<img src="${sighting.photoBase64}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:6px;" />` : ''}
        <strong style="font-size: 14px; color: #263b2b; display: block;">${sighting.birdName}</strong>
        ${sighting.scientificName ? `<em style="color: #64748b; font-size: 11px; display: block; margin-bottom: 4px;">${sighting.scientificName}</em>` : ''}
        <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
          📍 ${sighting.placeName}
        </div>
        <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">
          📅 ${sighting.date} • ${sighting.behavior} • ${sighting.count} ej.
        </div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'Ver Ficha de Campo';
      viewBtn.className = 'w-full py-1.5 px-3 rounded-lg font-bold text-white bg-[#263b2b] hover:bg-[#1a2b1e] text-xs cursor-pointer shadow-sm';
      viewBtn.onclick = () => {
        onSelectSighting(sighting);
        map.closePopup();
      };
      popupContent.appendChild(viewBtn);

      userMarker.bindPopup(popupContent);
      layer.addLayer(userMarker);
    });
  }, [sightings, selectedFilter]);

  // GPS Geolocation Handler
  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Tu navegador no soporta geolocalización GPS.');
      setTimeout(() => setGpsMessage(null), 4000);
      return;
    }

    setGpsLoading(true);
    setGpsMessage('Buscando satélites GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsMessage(`GPS activo: Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`);
        setTimeout(() => setGpsMessage(null), 5000);

        setTempPoint({ lat: latitude, lng: longitude });

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 16, { duration: 1.5 });

          if (tempMarkerRef.current) tempMarkerRef.current.remove();

          const gpsIcon = L.divIcon({
            className: 'custom-gps-pin',
            html: `
              <div style="position:relative;display:flex;align-items:center;justify-content:center;">
                <div style="position:absolute;width:34px;height:34px;background:rgba(28,118,146,0.3);border-radius:50%;animation:ping 1.5s infinite;"></div>
                <div style="width:22px;height:22px;background:#1c7692;border:3px solid #ffffff;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,0.5);"></div>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          });

          tempMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon }).addTo(map);
        }
      },
      () => {
        setGpsLoading(false);
        setGpsMessage('No se pudo obtener señal GPS. Tocá directamente en el mapa para marcar.');
        setTimeout(() => setGpsMessage(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Search for a specific bird or place in Villa Mercedes
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const query = searchQuery.toLowerCase();
    // Search first by bird name!
    const birdMatch = ECOQUEST_MAP_BIRDS.find(b => 
      b.name.toLowerCase().includes(query) || 
      b.scientificName.toLowerCase().includes(query) ||
      b.placeName.toLowerCase().includes(query)
    );

    if (birdMatch) {
      mapInstanceRef.current.flyTo([birdMatch.lat, birdMatch.lng], 16, { duration: 1.5 });
      setTempPoint({ lat: birdMatch.lat, lng: birdMatch.lng });
    } else {
      mapInstanceRef.current.flyTo(VM_CENTER, 14, { duration: 1.2 });
    }
  };

  const handleResetCenter = () => {
    mapInstanceRef.current?.flyTo(VM_CENTER, VM_DEFAULT_ZOOM, { duration: 1.2 });
    setTempPoint(null);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search & Actions Top Bar */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-amber-900/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search for bird or location in Villa Mercedes */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar ave en el mapa (ej. Pato de collar, Garza, Hornero...)"
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-amber-500/5 border border-amber-900/20 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1c7692]"
          />
        </form>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
          {/* Layer switcher */}
          <div className="flex items-center rounded-2xl bg-amber-100/60 p-1 border border-amber-900/10 text-xs font-bold text-slate-700">
            <button
              onClick={() => setActiveLayer('streets')}
              className={`px-3 py-1.5 rounded-xl transition ${activeLayer === 'streets' ? 'bg-white shadow-sm text-[#263b2b]' : 'hover:bg-white/50'}`}
              title="Mapa callejero con todas las calles"
            >
              Callejero
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-3 py-1.5 rounded-xl transition ${activeLayer === 'satellite' ? 'bg-white shadow-sm text-[#263b2b]' : 'hover:bg-white/50'}`}
              title="Vista satelital real del Río Quinto y ciudad"
            >
              Satélite
            </button>
            <button
              onClick={() => setActiveLayer('topo')}
              className={`px-3 py-1.5 rounded-xl transition ${activeLayer === 'topo' ? 'bg-white shadow-sm text-[#263b2b]' : 'hover:bg-white/50'}`}
              title="Topográfico y relieve"
            >
              Relieve
            </button>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleGPS}
            disabled={gpsLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#1c7692] text-white hover:bg-[#155d74] shadow-sm transition active:scale-95 disabled:opacity-50"
            title="Usar GPS del teléfono"
          >
            <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            {gpsLoading ? 'GPS...' : '📍 Mi GPS'}
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetCenter}
            className="p-2 rounded-full bg-white border border-amber-900/20 text-slate-700 hover:bg-amber-100 transition shadow-sm"
            title="Centrar en Villa Mercedes"
            aria-label="Centrar en Villa Mercedes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GPS Notice Toast */}
      {gpsMessage && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-950 text-xs rounded-2xl flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#1c7692] shrink-0" />
            <span>{gpsMessage}</span>
          </div>
          <button onClick={() => setGpsMessage(null)} className="font-bold text-sky-800 text-sm">
            ×
          </button>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 font-bold text-[11px] whitespace-nowrap pl-1">
          Aves en el mapa:
        </span>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-[#263b2b] text-white shadow-sm'
              : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-100/50'
          }`}
        >
          Todas las 22 aves
        </button>
        <button
          onClick={() => setSelectedFilter('acuaticas')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'acuaticas'
              ? 'bg-[#308ba8] text-white shadow-sm'
              : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-100/50'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#308ba8]" />
          Acuáticas (11)
        </button>
        <button
          onClick={() => setSelectedFilter('arboles')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'arboles'
              ? 'bg-[#557544] text-white shadow-sm'
              : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-100/50'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#557544]" />
          De árboles (6)
        </button>
        <button
          onClick={() => setSelectedFilter('pastizales')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'pastizales'
              ? 'bg-[#b66b22] text-white shadow-sm'
              : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-100/50'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#b66b22]" />
          De pastizales (5)
        </button>
        <button
          onClick={() => setSelectedFilter('user')}
          className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'user'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'bg-white border border-amber-900/10 text-slate-700 hover:bg-amber-100/50'
          }`}
        >
          ⭐ Mis avistajes registrados ({sightings.length})
        </button>
      </div>

      {/* Main Map Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-amber-900/20 shadow-2xl z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Tip Badge */}
        <div className="absolute top-4 left-4 z-[400] hidden sm:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md text-amber-50 px-3.5 py-1.5 rounded-full text-[11px] shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tocá cualquier ave para ver su ficha, o hacé clic en el mapa para marcar tu avistaje</span>
        </div>

        {/* Temporary point selected floating banner */}
        {tempPoint && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl border-2 border-[#e11d48] shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Punto marcado en Villa Mercedes
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {tempPoint.lat.toFixed(5)}, {tempPoint.lng.toFixed(5)}
              </p>
            </div>
            <button
              onClick={() => {
                onOpenNewSighting({
                  lat: tempPoint.lat,
                  lng: tempPoint.lng,
                  placeName: 'Punto seleccionado en Villa Mercedes'
                });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e11d48] hover:bg-rose-700 text-white shadow-md transition active:scale-95"
            >
              Completar Ficha de Ave Aquí
            </button>
            <button
              onClick={() => {
                setTempPoint(null);
                if (tempMarkerRef.current) {
                  tempMarkerRef.current.remove();
                  tempMarkerRef.current = null;
                }
              }}
              className="text-slate-400 hover:text-slate-700 text-xs px-2"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 bg-white/70 p-3 rounded-2xl border border-amber-900/10">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#308ba8] border border-white shrink-0 shadow-sm" />
          <span><b>Acuáticas y humedales</b> (11 aves)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#557544] border border-white shrink-0 shadow-sm" />
          <span><b>Árboles y arbustos</b> (6 aves)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#b66b22] border border-white shrink-0 shadow-sm" />
          <span><b>Pastizales</b> (5 aves)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f4bb29] border border-[#263b2b] shrink-0 shadow-sm" />
          <span><b>Tus avistajes de campo</b></span>
        </div>
      </div>
    </div>
  );
};
