import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BirdMap } from './components/BirdMap';
import { BirdCatalog } from './components/BirdCatalog';
import { SightingsGallery } from './components/SightingsGallery';
import { FieldAlbum } from './components/FieldAlbum';
import { FieldGames } from './components/FieldGames';
import { ParkExpeditionGame } from './components/ParkExpeditionGame';
import { ConservationGuide } from './components/ConservationGuide';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

import { NewSightingModal } from './components/NewSightingModal';
import { SightingCardModal } from './components/SightingCardModal';
import { BirdDetailModal } from './components/BirdDetailModal';
import { AddBirdModal } from './components/AddBirdModal';
import { BrochureModal } from './components/BrochureModal';

import { Bird, BirdSighting } from './types/bird';
import { storageService } from './services/storageService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  const [activeTab, setActiveTab] = useState<string>('mapa');

  // Modals state
  const [isNewSightingOpen, setIsNewSightingOpen] = useState(false);
  const [newSightingCoords, setNewSightingCoords] = useState<{ lat: number; lng: number; placeName?: string } | null>(null);
  const [editingSighting, setEditingSighting] = useState<BirdSighting | null>(null);

  const [selectedSighting, setSelectedSighting] = useState<BirdSighting | null>(null);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [isAddBirdOpen, setIsAddBirdOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  // Success toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load initial data from local storage
  useEffect(() => {
    const loadedBirds = storageService.getAllBirds();
    const loadedSightings = storageService.getSightings();
    setBirds(loadedBirds);
    setSightings(loadedSightings);
  }, []);

  // Handlers for Sightings
  const handleSaveSighting = (sighting: BirdSighting) => {
    const updated = storageService.saveSighting(sighting);
    setSightings(updated);
    showToast(`¡Ficha de "${sighting.birdName}" guardada con éxito en tu bitácora!`);
    setEditingSighting(null);
    setNewSightingCoords(null);
  };

  const handleDeleteSighting = (id: string) => {
    const updated = storageService.deleteSighting(id);
    setSightings(updated);
    showToast('Ficha de avistamiento eliminada.');
  };

  const handleFocusOnMap = (sighting: BirdSighting) => {
    setActiveTab('mapa');
    setSelectedSighting(sighting);
    const mapSection = document.getElementById('mapa');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger new sighting modal from various sources
  const handleOpenNewSighting = (coords?: { lat: number; lng: number; placeName?: string }) => {
    setEditingSighting(null);
    setNewSightingCoords(coords || null);
    setIsNewSightingOpen(true);
  };

  const handleEditSighting = (sighting: BirdSighting) => {
    setEditingSighting(sighting);
    setNewSightingCoords(null);
    setIsNewSightingOpen(true);
  };

  const handleRecordFromBird = (birdName: string) => {
    setEditingSighting(null);
    setNewSightingCoords({
      lat: -33.6745,
      lng: -65.4620,
      placeName: 'Parque Costanera Río Quinto'
    });
    setIsNewSightingOpen(true);
  };

  const handleBirdAdded = (newBird: Bird) => {
    const updated = storageService.getAllBirds();
    setBirds(updated);
    showToast(`¡"${newBird.name}" agregada al catálogo de aves!`);
  };

  const handleImportDone = () => {
    setBirds(storageService.getAllBirds());
    setSightings(storageService.getSightings());
    showToast('Datos de bitácora y álbum sincronizados.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#f4bb29] selection:text-[#263b2b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[#263b2b] text-white text-xs font-bold rounded-2xl shadow-2xl border border-emerald-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenNewSighting={() => handleOpenNewSighting()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <Hero
          onOpenMap={() => {
            setActiveTab('mapa');
            document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenNewSighting={() => handleOpenNewSighting()}
          onOpenFieldNotebook={() => {
            setActiveTab('album');
            document.getElementById('album')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCatalog={() => {
            setActiveTab('aves');
            document.getElementById('aves')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* SECTION 1: MAPA DE AVES DE VILLA MERCEDES (Callejero y Satélite Real con Leaflet) */}
        <section id="mapa" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Header Card with Organic Blob Manchas and Generous Padding */}
          <div className="relative overflow-hidden rounded-3xl bg-[#f4f7ee]/90 border border-emerald-900/15 p-6 sm:p-8 md:p-10 shadow-sm mb-6 transition-all">
            {/* Organic Blob Mancha Backdrops (from user asset) */}
            <img
              src="/blob-shape.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -right-8 -bottom-12 w-48 sm:w-72 h-auto opacity-35 mix-blend-multiply pointer-events-none select-none rotate-12 transition-transform duration-700"
            />
            <img
              src="/blob-shape.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -left-12 -top-10 w-40 sm:w-56 h-auto opacity-20 mix-blend-multiply pointer-events-none select-none -rotate-45 scale-x-[-1]"
            />
            <img
              src="/blob-shape.jpg"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 -bottom-16 -translate-x-1/2 w-36 sm:w-48 h-auto opacity-15 mix-blend-multiply pointer-events-none select-none rotate-90"
            />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9a561d] bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-900/15 shadow-xs flex items-center gap-1.5">
                  <span className="text-sm">📍</span>
                  Eco-Quest • Mapa Interactivo de Villa Mercedes
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-fraunces text-[#263b2b] tracking-tight">
                Mapa de Aves de Villa Mercedes
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-3xl leading-relaxed">
                Puntos de avistaje de las 22 especies del catálogo en la ciudad, diques, parques y riberas del Río Quinto. Tocá cualquier punto para ver la ficha del ave o hacé clic en el mapa para marcar tu propio avistamiento con GPS.
              </p>
            </div>
          </div>

          <BirdMap
            sightings={sightings}
            onOpenNewSighting={handleOpenNewSighting}
            onSelectSighting={setSelectedSighting}
          />
        </section>

        {/* SECTION 2: CATÁLOGO OFICIAL DE AVES PROYECTO ECO-QUEST (UNVIM) */}
        <BirdCatalog
          birds={birds}
          onSelectBird={setSelectedBird}
          onRecordSighting={handleRecordFromBird}
          onAddNewBird={() => setIsAddBirdOpen(true)}
          onViewOriginalBrochure={() => setIsBrochureOpen(true)}
        />

        {/* SECTION 3: MIS FICHAS DE CAMPO (BITÁCORA) */}
        <SightingsGallery
          sightings={sightings}
          onOpenNewSighting={() => handleOpenNewSighting()}
          onSelectSighting={setSelectedSighting}
          onFocusOnMap={handleFocusOnMap}
          onEditSighting={handleEditSighting}
          onDeleteSighting={handleDeleteSighting}
          onImportDone={handleImportDone}
        />

        {/* SECTION 4: ÁLBUM CHECKLIST */}
        <FieldAlbum
          birds={birds}
          onSelectBird={setSelectedBird}
        />

        {/* SECTION 5: JUEGOS Y TRIVIA (EXPEDICIÓN POR PARADAS + TRIVIA + MEMOTEST) */}
        <div id="juegos" className="scroll-mt-20">
          <ParkExpeditionGame />
          <FieldGames />
        </div>

        {/* SECTION 6: CONSERVACIÓN */}
        <ConservationGuide />
      </main>

      {/* Footer */}
      <Footer />

      {/* Offline Status Floating Alert for field trips */}
      <OfflineIndicator />

      {/* MODALS */}
      <NewSightingModal
        isOpen={isNewSightingOpen}
        onClose={() => {
          setIsNewSightingOpen(false);
          setEditingSighting(null);
          setNewSightingCoords(null);
        }}
        onSave={handleSaveSighting}
        allBirds={birds}
        initialCoords={newSightingCoords}
        existingSighting={editingSighting}
      />

      <SightingCardModal
        sighting={selectedSighting}
        onClose={() => setSelectedSighting(null)}
        onEdit={handleEditSighting}
        onDelete={handleDeleteSighting}
      />

      <BirdDetailModal
        bird={selectedBird}
        onClose={() => setSelectedBird(null)}
        onRecordSighting={handleRecordFromBird}
      />

      <AddBirdModal
        isOpen={isAddBirdOpen}
        onClose={() => setIsAddBirdOpen(false)}
        onBirdAdded={handleBirdAdded}
      />

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
      />
    </div>
  );
}
