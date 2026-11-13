import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, Printer, Download, Calendar, MapPin, 
  Camera, Award, CheckCircle2, Sparkles, Plus, 
  HelpCircle, ChevronRight, Share2, Compass, AlertCircle
} from 'lucide-react';
import { Bird, BirdSighting } from '../types/bird';
import { storageService } from '../services/storageService';
import { AudioPlayerBar } from './AudioPlayerBar';

interface FieldLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  sightings: BirdSighting[];
  allBirds: Bird[];
  onOpenNewSighting: () => void;
  onSelectSighting: (sighting: BirdSighting) => void;
}

export const FieldLogbookModal: React.FC<FieldLogbookModalProps> = ({
  isOpen,
  onClose,
  sightings,
  allBirds,
  onOpenNewSighting,
  onSelectSighting
}) => {
  const [observerName, setObserverName] = useState<string>(() => {
    return localStorage.getItem('ecoquest_observer_name') || 'Observador de Campo';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [albumChecked, setAlbumChecked] = useState<Record<string, boolean>>({});
  const [expeditionData, setExpeditionData] = useState<{
    level?: number;
    birds?: Array<{ name: string; stop: number; date: string; notes?: string; photo?: string | null }>;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setAlbumChecked(storageService.getAlbumChecked());
      try {
        const exp = JSON.parse(localStorage.getItem('ecoquest-v1') || '{}');
        setExpeditionData(exp);
      } catch {
        setExpeditionData({});
      }
    }
  }, [isOpen, sightings]);

  if (!isOpen) return null;

  const handleNameSave = (newName: string) => {
    const trimmed = newName.trim() || 'Observador de Campo';
    setObserverName(trimmed);
    localStorage.setItem('ecoquest_observer_name', trimmed);
    setIsEditingName(false);
  };

  const totalSightings = sightings.length;
  const checkedBirdCount = Object.values(albumChecked).filter(Boolean).length;
  const expeditionBirdsCount = expeditionData.birds?.length || 0;
  const photosCount = sightings.filter(s => !!s.photoBase64).length;

  // Add demo sample sighting if requested
  const handleAddSampleSighting = () => {
    const sample: BirdSighting = {
      id: 'sample-' + Date.now(),
      birdName: 'Hornero',
      scientificName: 'Furnarius rufus',
      category: 'arboles',
      date: new Date().toISOString().slice(0, 10),
      time: '11:45',
      placeName: 'Parque La Pedrera, Villa Mercedes',
      lat: -33.684,
      lng: -65.452,
      count: 2,
      behavior: 'Cantando',
      notes: 'Observado en la copa de un chañar construyendo su nido de barro junto a su pareja. Muy activo cantando al atardecer.',
      photoUrl: '/birds/hornero.jpg',
      createdAt: Date.now()
    };
    storageService.saveSighting(sample);
    window.location.reload();
  };

  // Trigger print (clean @media print styles applied)
  const handlePrint = () => {
    window.print();
  };

  // Download human-readable HTML document that opens in browser (NOT VS Code / raw JSON!)
  const handleDownloadHtml = () => {
    const today = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const sightingsHtml = sightings.length > 0 ? sightings.map((s, idx) => {
      const birdInfo = allBirds.find(b => b.name.toLowerCase() === s.birdName.toLowerCase());
      const rawImg = s.photoBase64 || s.photoUrl || birdInfo?.photoUrl || '/birds/paloma.jpg';
      const resolvedImg = rawImg.startsWith('/') ? `${window.location.origin}${rawImg}` : rawImg;
      const dateObj = new Date(s.date.includes('T') ? s.date : `${s.date}T${s.time || '12:00'}`);
      const dateFormatted = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) + (s.time ? ` • ${s.time} hs` : '')
        : `${s.date}${s.time ? ` • ${s.time} hs` : ''}`;
      return `
        <div style="border: 1px solid #e2d7c0; border-radius: 12px; padding: 18px; margin-bottom: 20px; background: #ffffff; page-break-inside: avoid; display: flex; gap: 18px; flex-wrap: wrap;">
          <div style="flex: 0 0 160px; max-width: 200px;">
            <img src="${resolvedImg}" alt="${s.birdName}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid #d4c29d;" />
            <div style="font-size: 11px; text-align: center; color: #666; margin-top: 6px;">Registro #${idx + 1}</div>
          </div>
          <div style="flex: 1; min-width: 240px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #557544; padding-bottom: 6px; margin-bottom: 10px;">
              <h3 style="margin: 0; color: #263b2b; font-size: 20px; font-weight: bold;">${s.birdName}</h3>
              <span style="font-size: 13px; font-style: italic; color: #6d5b3d;">${s.scientificName || birdInfo?.scientificName || ''}</span>
            </div>
            <div style="font-size: 13px; color: #444; line-height: 1.6;">
              <p style="margin: 4px 0;"><strong>📅 Fecha y hora:</strong> ${dateFormatted}</p>
              <p style="margin: 4px 0;"><strong>📍 Lugar de avistaje:</strong> ${s.placeName || 'Villa Mercedes, San Luis'}</p>
              <p style="margin: 4px 0;"><strong>🔢 Ejemplares observados:</strong> ${s.count || 1}</p>
              ${s.notes ? `<p style="margin: 8px 0; background: #fff9ed; padding: 8px 12px; border-left: 3px solid #b66b22; border-radius: 4px;"><strong>📝 Notas de campo:</strong> ${s.notes}</p>` : ''}
              ${s.audioBase64 ? `<div style="margin-top: 8px; padding: 8px 10px; background: #f4f7ee; border-radius: 8px; border: 1px solid #d6dccd;"><div style="font-size: 12px; font-weight: bold; color: #263b2b; margin-bottom: 4px;">🎙️ Audio captado en campo${s.audioFileName ? `: ${s.audioFileName}` : ''}</div><audio controls src="${s.audioBase64}" style="width: 100%; height: 34px;"></audio></div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('') : `
      <div style="text-align: center; padding: 40px 20px; background: #fff9ed; border-radius: 12px; border: 1px dashed #c4ad82;">
        <p style="font-size: 16px; color: #665235; margin: 0;">No se registraron fichas personales todavía.</p>
      </div>
    `;

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Bitácora de Campo - Eco-Quest Villa Mercedes</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #faf6ee; color: #263b2b; margin: 0; padding: 30px; }
    .container { max-width: 860px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { text-align: center; border-bottom: 3px solid #3a1c36; padding-bottom: 24px; margin-bottom: 30px; }
    .header h1 { color: #3a1c36; font-size: 28px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; }
    .header h2 { color: #557544; font-size: 17px; margin: 0 0 12px 0; font-weight: normal; }
    .badge { display: inline-block; background: #3a1c36; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .stats { display: flex; justify-content: space-around; background: #fff9ed; border: 1px solid #edd8ab; border-radius: 12px; padding: 18px; margin-bottom: 30px; text-align: center; }
    .stat-box h4 { margin: 0; font-size: 28px; color: #b66b22; }
    .stat-box p { margin: 4px 0 0 0; font-size: 12px; color: #555; text-transform: uppercase; font-weight: bold; }
    .footer { text-align: center; border-top: 1px solid #ddd; margin-top: 40px; padding-top: 20px; font-size: 12px; color: #777; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">PROYECTO UNIVERSITARIO UNViMe</span>
      <h1>Eco-Quest • Bitácora de Campo</h1>
      <h2>Aves Silvestres de Villa Mercedes, San Luis, Argentina</h2>
      <p style="margin: 8px 0 0; font-size: 14px; color: #555;">
        <strong>Observador:</strong> ${observerName} &nbsp;|&nbsp; <strong>Fecha del reporte:</strong> ${today}
      </p>
    </div>

    <div class="stats">
      <div class="stat-box">
        <h4>${totalSightings}</h4>
        <p>Avistajes Registrados</p>
      </div>
      <div class="stat-box">
        <h4>${photosCount}</h4>
        <p>Fotos Propias</p>
      </div>
      <div class="stat-box">
        <h4>${checkedBirdCount} / 22</h4>
        <p>Especies del Álbum</p>
      </div>
    </div>

    <h2 style="color: #263b2b; font-size: 20px; border-left: 4px solid #b66b22; padding-left: 10px; margin-bottom: 20px;">
      Historial Cronológico de Observaciones
    </h2>

    ${sightingsHtml}

    <div class="footer">
      <p>Generado con la aplicación comunitaria <strong>Eco-Quest Villa Mercedes</strong> • UNViMe</p>
      <p>Cuidemos juntos el hábitat y la biodiversidad de nuestra ciudad.</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bitacora-EcoQuest-${observerName.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#fff9ed] rounded-3xl border border-amber-900/20 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* MODAL HEADER - Hidden when printing */}
        <div className="bg-[#3a1c36] text-white px-5 sm:px-8 py-5 flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#f4bb29]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f4bb29] bg-white/10 px-2 py-0.5 rounded-full">
                  Libreta Personal
                </span>
                <span className="text-xs text-white/70">Proyecto UNViMe</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif-fraunces">
                Mi Cuaderno de Bitácora
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
            title="Cerrar bitácora"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTION BAR: PRINT / DOWNLOAD HTML - Hidden when printing */}
        <div className="bg-[#f5ebd7] px-5 sm:px-8 py-3 border-b border-amber-900/15 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span>Observador:</span>
            {isEditingName ? (
              <input
                type="text"
                defaultValue={observerName}
                autoFocus
                onBlur={(e) => handleNameSave(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave(e.currentTarget.value);
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="bg-white px-2 py-1 rounded border border-amber-900/30 font-bold text-[#263b2b] text-xs focus:outline-hidden"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="font-extrabold text-[#3a1c36] hover:underline flex items-center gap-1 bg-amber-100/60 px-2 py-0.5 rounded"
                title="Hacé clic para cambiar tu nombre"
              >
                {observerName} ✎
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1b2b1e] shadow-sm transition active:scale-95"
              title="Imprimir directamente o guardar en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#f4bb29]" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Download legible HTML doc */}
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-[#263b2b] hover:bg-amber-100/70 border border-amber-900/20 shadow-xs transition active:scale-95"
              title="Descargar archivo legible con fotos y diseño para abrir en cualquier navegador sin internet"
            >
              <Download className="w-3.5 h-3.5 text-[#557544]" />
              <span>Descargar Documento</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE & PRINTABLE) */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 print:p-0 print:overflow-visible">
          
          {/* Printable Header - Only shows in print mode */}
          <div className="hidden print:block text-center border-b-2 border-[#3a1c36] pb-4 mb-6">
            <h1 className="text-2xl font-black text-[#3a1c36] uppercase tracking-wide">
              Eco-Quest • Bitácora de Campo de Aves
            </h1>
            <p className="text-sm text-slate-700">
              Universidad Nacional de Villa Mercedes (UNViMe) • Villa Mercedes, San Luis
            </p>
            <p className="text-xs text-slate-600 mt-1">
              <strong>Observador:</strong> {observerName} &nbsp;|&nbsp; 
              <strong>Fecha:</strong> {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Activity Statistics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#3a1c36]">
                {totalSightings}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Fichas Registradas
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#557544]">
                {photosCount}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Fotos Capturadas
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#b66b22]">
                {checkedBirdCount} <span className="text-base text-slate-400 font-normal">/ 22</span>
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Aves Vistas (Álbum)
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-900/15 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#1c7692]">
                {expeditionBirdsCount}
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Paradas Expedición
              </span>
            </div>
          </div>

          {/* SIGHTINGS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 rounded-full bg-[#b66b22]" />
                <h3 className="text-lg sm:text-xl font-bold font-serif-fraunces text-[#263b2b]">
                  Registros y Fichas de Observación
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-amber-900/15">
                {sightings.length} {sightings.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            {sightings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-amber-900/25 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-[#b66b22] mb-3">
                  <Compass className="w-7 h-7" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#263b2b]">
                  Tu bitácora aún no tiene avistajes cargados
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  Para que tu bitácora muestre lo que has hecho, necesitás guardar tu primera observación de un ave (con foto de tu cámara o celular, lugar donde la viste y tus notas de campo).
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNewSighting();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar mi primer avistaje ahora
                  </button>

                  <button
                    onClick={handleAddSampleSighting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-amber-100 text-[#b66b22] hover:bg-amber-200 border border-amber-300 transition"
                    title="Carga una ficha de ejemplo de un Hornero para probar cómo se ve y se imprime tu bitácora"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Cargar ejemplo para probar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sightings.map((sighting, idx) => {
                  const birdInfo = allBirds.find(
                    b => b.name.toLowerCase() === sighting.birdName.toLowerCase()
                  );
                  const dateObj = new Date(sighting.date.includes('T') ? sighting.date : `${sighting.date}T${sighting.time || '12:00'}`);
                  const dateStr = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : sighting.date;
                  const timeStr = sighting.time || (!isNaN(dateObj.getTime())
                    ? dateObj.toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '');

                  return (
                    <div
                      key={sighting.id || idx}
                      onClick={() => onSelectSighting(sighting)}
                      className="bg-white rounded-2xl border border-amber-900/15 p-4 sm:p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-4 items-start relative group print:cursor-default"
                    >
                      {/* Photo Thumbnail */}
                      <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-amber-100 border border-amber-900/15 shrink-0 relative">
                        <img
                          src={sighting.photoBase64 || sighting.photoUrl || birdInfo?.photoUrl || '/birds/paloma.jpg'}
                          alt={sighting.birdName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </div>
                        {sighting.photoBase64 ? (
                          <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <Camera className="w-3 h-3" /> Foto propia
                          </div>
                        ) : (
                          <div className="absolute bottom-2 right-2 bg-slate-800/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                            Foto guía
                          </div>
                        )}
                      </div>

                      {/* Information */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-amber-900/10 pb-2 mb-2">
                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-[#263b2b] group-hover:text-[#3a1c36] transition-colors">
                              {sighting.birdName}
                            </h4>
                            <p className="text-xs italic text-slate-500 font-serif">
                              {birdInfo?.scientificName || 'Especie observada en Villa Mercedes'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-900/15">
                              <Calendar className="w-3 h-3 text-[#b66b22]" />
                              {dateStr} {timeStr && `• ${timeStr} hs`}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 mb-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#a84d2b] shrink-0" />
                            <span className="truncate"><strong>Lugar:</strong> {sighting.placeName || 'Villa Mercedes'}</span>
                          </div>
                          <div>
                            <span><strong>Individuos:</strong> {sighting.count || 1} {sighting.count === 1 ? 'ave' : 'aves'}</span>
                          </div>
                        </div>

                        {sighting.notes ? (
                          <div className="bg-[#fff9ed] p-2.5 rounded-xl border-l-3 border-[#b66b22] text-xs text-slate-800 italic mt-2">
                            "{sighting.notes}"
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">Sin notas adicionales.</p>
                        )}

                        {sighting.audioBase64 && (
                          <div className="mt-2.5 print:hidden">
                            <AudioPlayerBar
                              compact
                              src={sighting.audioBase64}
                              title={sighting.audioFileName || 'Audio captado en campo'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* EXPEDITION SECTION (if user did park expedition stops) */}
          {expeditionData.birds && expeditionData.birds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-amber-900/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-6 rounded-full bg-[#1c7692]" />
                <h3 className="text-lg sm:text-xl font-bold font-serif-fraunces text-[#263b2b]">
                  Registros en la Expedición del Parque La Pedrera
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Aves registradas en las postas y senderos del parque:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expeditionData.birds.map((b, bIdx) => (
                  <div key={bIdx} className="bg-white p-3 rounded-xl border border-amber-900/15 shadow-2xs flex items-center gap-3">
                    {b.photo ? (
                      <img src={b.photo} alt={b.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-700 font-bold text-xs">
                        Posta {b.stop + 1}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#263b2b] truncate">{b.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.date || 'Posta La Pedrera'} {b.notes ? `• ${b.notes}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER - Hidden when printing */}
        <div className="bg-[#fff9ed] px-5 sm:px-8 py-3.5 border-t border-amber-900/15 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-600">
            <strong>Eco-Quest Villa Mercedes</strong> • UNViMe
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-xs transition active:scale-95"
          >
            Cerrar Bitácora
          </button>
        </div>

      </div>
    </div>
  );
};
