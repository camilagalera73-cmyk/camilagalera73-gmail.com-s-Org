import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BirdCatalog } from './components/BirdCatalog';
import { SightingsGallery } from './components/SightingsGallery';
import { FieldGames } from './components/FieldGames';
import { ParkExpeditionGame } from './components/ParkExpeditionGame';
import { ConservationGuide } from './components/ConservationGuide';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

import { NewSightingModal } from './components/NewSightingModal';
import { SightingCardModal } from './components/SightingCardModal';
import { BirdDetailModal } from './components/BirdDetailModal';
import { BrochureModal } from './components/BrochureModal';
import { ShareAppModal } from './components/ShareAppModal';
import { FieldLogbookModal } from './components/FieldLogbookModal';
import { PermissionsWelcomeModal } from './components/PermissionsWelcomeModal';

import { Bird, BirdSighting } from './types/bird';
import { storageService } from './services/storageService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  const [activeTab, setActiveTab] = useState<string>('aves');

  // Modals state
  const [isNewSightingOpen, setIsNewSightingOpen] = useState(false);
  const [newSightingCoords, setNewSightingCoords] = useState<{ lat: number; lng: number; placeName?: string } | null>(null);
  const [editingSighting, setEditingSighting] = useState<BirdSighting | null>(null);

  const [selectedSighting, setSelectedSighting] = useState<BirdSighting | null>(null);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

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
    showToast(`¡"${newBird.name}" agregada con éxito!`);
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
        onOpenShare={() => setIsShareOpen(true)}
        onOpenLogbook={() => setIsLogbookOpen(true)}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <Hero
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

        {/* SECTION 1: CATÁLOGO OFICIAL DE AVES PROYECTO ECO-QUEST (UNViMe) */}
        <BirdCatalog
          birds={birds}
          onSelectBird={setSelectedBird}
          onRecordSighting={handleRecordFromBird}
          onViewOriginalBrochure={() => setIsBrochureOpen(true)}
        />

        {/* SECTION 2: MIS FICHAS DE CAMPO (FICHAS CON FOTO CAPTURADA Y DATOS COMPLETOS) */}
        <SightingsGallery
          sightings={sightings}
          allBirds={birds}
          onOpenNewSighting={() => handleOpenNewSighting()}
          onOpenLogbook={() => setIsLogbookOpen(true)}
          onSelectSighting={setSelectedSighting}
          onEditSighting={handleEditSighting}
          onDeleteSighting={handleDeleteSighting}
        />

        {/* SECTION 3: JUEGOS Y TRIVIA (EXPEDICIÓN POR PARADAS + TRIVIA + MEMOTEST) */}
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
        onAddBirdToCatalog={(newBird) => {
          storageService.saveCustomBird(newBird);
          handleBirdAdded(newBird);
        }}
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

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
      />

      <ShareAppModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <FieldLogbookModal
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        sightings={sightings}
        allBirds={birds}
        onOpenNewSighting={() => {
          setIsLogbookOpen(false);
          handleOpenNewSighting();
        }}
        onSelectSighting={(sighting) => {
          setIsLogbookOpen(false);
          setSelectedSighting(sighting);
        }}
      />

      <PermissionsWelcomeModal
        isOpen={isPermissionsOpen}
        onOpen={() => setIsPermissionsOpen(true)}
        onClose={() => setIsPermissionsOpen(false)}
      />
    </div>
  );
}
