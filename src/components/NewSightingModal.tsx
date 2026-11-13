import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Check, AlertCircle, Mic, Square, Upload, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Bird, BirdSighting, EcoQuestCategory, CATEGORY_LABELS } from '../types/bird';
import { storageService } from '../services/storageService';
import { AudioPlayerBar } from './AudioPlayerBar';

interface NewSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sighting: BirdSighting) => void;
  onAddBirdToCatalog?: (bird: Bird) => void;
  allBirds: Bird[];
  initialCoords?: { lat: number; lng: number; placeName?: string } | null;
  existingSighting?: BirdSighting | null;
}

export const NewSightingModal: React.FC<NewSightingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onAddBirdToCatalog,
  allBirds,
  initialCoords,
  existingSighting
}) => {
  const [birdName, setBirdName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [lat, setLat] = useState(-33.6756);
  const [lng, setLng] = useState(-65.4578);
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState<EcoQuestCategory>('arboles');
  const [behavior, setBehavior] = useState<BirdSighting['behavior']>('Posado');
  const [notes, setNotes] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [audioBase64, setAudioBase64] = useState<string | undefined>(undefined);
  const [audioFileName, setAudioFileName] = useState<string | undefined>(undefined);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [addToCatalog, setAddToCatalog] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const stopCameraResources = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const stopMicResources = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  useEffect(() => {
    if (!isOpen) {
      stopMicResources();
      stopCameraResources();
      return;
    }

    if (existingSighting) {
      setBirdName(existingSighting.birdName);
      setScientificName(existingSighting.scientificName || '');
      setPlaceName(existingSighting.placeName);
      setDate(existingSighting.date);
      setTime(existingSighting.time);
      setLat(existingSighting.lat);
      setLng(existingSighting.lng);
      setCount(existingSighting.count || 1);
      setCategory(existingSighting.category);
      setBehavior(existingSighting.behavior);
      setNotes(existingSighting.notes);
      setPhotoBase64(existingSighting.photoBase64);
      setAudioBase64(existingSighting.audioBase64);
      setAudioFileName(existingSighting.audioFileName);
      setAddToCatalog(false);
      setErrorMsg(null);
    } else {
      const now = new Date();
      const localDate = now.toISOString().split('T')[0];
      const localTime = now.toTimeString().slice(0, 5);

      setBirdName('');
      setScientificName('');
      setDate(localDate);
      setTime(localTime);
      setCount(1);
      setBehavior('Posado');
      setNotes('');
      setPhotoBase64(undefined);
      setAudioBase64(undefined);
      setAudioFileName(undefined);
      setAddToCatalog(false);
      setErrorMsg(null);

      if (initialCoords) {
        setLat(initialCoords.lat);
        setLng(initialCoords.lng);
        setPlaceName(initialCoords.placeName || 'Punto en Villa Mercedes');
      } else {
        setLat(-33.6745);
        setLng(-65.4620);
        setPlaceName('Parque Costanera Río Quinto');
      }
    }

    return () => {
      stopMicResources();
      stopCameraResources();
    };
  }, [isOpen, initialCoords, existingSighting]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraOpen]);

  const handleBirdSelect = (name: string) => {
    setBirdName(name);
    const found = allBirds.find(b => b.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setScientificName(found.scientificName);
      setCategory(found.category);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setErrorMsg(null);
    try {
      const compressed = await storageService.compressImage(file);
      setPhotoBase64(compressed);
    } catch {
      setErrorMsg('No se pudo procesar la foto.');
    } finally {
      setPhotoLoading(false);
      e.target.value = '';
    }
  };

  const openLiveCamera = async (requestedFacing: 'environment' | 'user' = cameraFacing) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Tu navegador no permite abrir la cámara en vivo aquí. Usá "Subir desde galería".');
      return;
    }

    stopCameraResources();
    setErrorMsg(null);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: requestedFacing } }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      cameraStreamRef.current = stream;
      setCameraFacing(requestedFacing);
      setIsCameraOpen(true);
    } catch {
      setErrorMsg(
        'No se pudo acceder a la cámara (permiso denegado o bloqueado). Aceptá el permiso en tu navegador o usá "Subir desde galería".'
      );
    }
  };

  const handleCapturePhotoFromVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;
    const maxDim = 900;
    let width = vw;
    let height = vh;
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
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoBase64(dataUrl);
    }
    stopCameraResources();
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioLoading(true);
    setErrorMsg(null);
    try {
      const dataUrl = await storageService.readAudioFile(file);
      setAudioBase64(dataUrl);
      setAudioFileName(file.name);
    } catch (err) {
      if (err instanceof Error && err.message === 'AUDIO_TOO_LARGE') {
        setErrorMsg('El archivo de audio supera los 3.5 MB. Probá con un clip más corto para poder guardarlo sin internet.');
      } else {
        setErrorMsg('No se pudo procesar el archivo de audio.');
      }
    } finally {
      setAudioLoading(false);
      e.target.value = '';
    }
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMsg('Tu navegador no permite grabar directo desde el micrófono. Podés usar el botón "Subir archivo de audio".');
      return;
    }

    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const supportedTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const chosenMime = supportedTypes.find(t =>
        typeof MediaRecorder.isTypeSupported === 'function' ? MediaRecorder.isTypeSupported(t) : false
      );
      const recorder = chosenMime
        ? new MediaRecorder(stream, { mimeType: chosenMime })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || chosenMime || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setAudioBase64(result);
            setAudioFileName('Grabación de campo');
          }
        };
        reader.readAsDataURL(blob);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop());
          mediaStreamRef.current = null;
        }
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);
        setRecordingSeconds(0);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 44) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return 45;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('No se pudo acceder al micrófono. Verificá los permisos o subí un archivo de audio desde tu dispositivo.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      stopMicResources();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      setErrorMsg('Detené la grabación de audio antes de guardar la ficha.');
      return;
    }
    if (!birdName.trim()) {
      setErrorMsg('Por favor indicá el nombre del ave observada.');
      return;
    }
    if (!placeName.trim()) {
      setErrorMsg('Por favor indicá el lugar del avistamiento.');
      return;
    }

    const sighting: BirdSighting = {
      id: existingSighting?.id || 'sighting-' + Date.now(),
      birdName: birdName.trim(),
      scientificName: scientificName.trim() || undefined,
      placeName: placeName.trim(),
      date,
      time,
      lat,
      lng,
      count: Number(count) || 1,
      category,
      behavior,
      notes: notes.trim(),
      photoBase64,
      photoUrl: existingSighting?.photoUrl,
      audioBase64,
      audioFileName: audioBase64 ? audioFileName : undefined,
      createdAt: existingSighting?.createdAt || Date.now()
    };

    const isKnownBird = allBirds.some(
      b => b.name.trim().toLowerCase() === birdName.trim().toLowerCase()
    );

    if (addToCatalog && !isKnownBird && onAddBirdToCatalog) {
      const newBird: Bird = {
        id: 'custom-' + Date.now(),
        name: birdName.trim(),
        scientificName: scientificName.trim() || 'Especie silvestre',
        category,
        categoryLabel: CATEGORY_LABELS[category].name,
        description: notes.trim() || 'Especie observada en Villa Mercedes.',
        photoUrl: photoBase64 || '/isologo_transparent.png?v=7',
        audioUrl: audioBase64,
        audioAttribution: audioBase64 ? 'Audio captado en campo por el observador' : undefined,
        isCustom: true
      };
      onAddBirdToCatalog(newBird);
    }

    onSave(sighting);
    onClose();
  };

  if (!isOpen) return null;

  const isAlreadyInCatalog = allBirds.some(
    b => b.name.trim().toLowerCase() === birdName.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/15">
          <div className="flex items-center gap-3">
            <img src="/isologo_transparent.png?v=7" alt="Eco-Quest" className="h-10 w-auto object-contain shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-[#9a561d] uppercase tracking-wider block">
                Proyecto Eco-quest • Villa Mercedes
              </span>
              <h2 className="text-2xl font-bold font-serif-fraunces text-[#263b2b]">
                {existingSighting ? 'Editar Ficha de Campo' : 'Nueva Ficha de Avistamiento'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Bird Name & Scientific Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Nombre del ave *
              </label>
              <input
                type="text"
                list="birdOptions"
                value={birdName}
                onChange={e => handleBirdSelect(e.target.value)}
                placeholder="Ej. Pato de collar, Benteveo, Hornero..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800"
              />
              <datalist id="birdOptions">
                {allBirds.map(b => (
                  <option key={b.id} value={b.name}>
                    {b.scientificName} ({b.categoryLabel})
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Nombre científico (automático)
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={e => setScientificName(e.target.value)}
                placeholder="Ej. Callonetta leucophrys"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800 italic"
              />
            </div>
          </div>

          {/* Place and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Lugar de Villa Mercedes *
              </label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                placeholder="Ej. Dique Vulpiani, Costanera, Calle Angosta..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-sm text-slate-800"
              />
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Categoría Eco-quest
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EcoQuestCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-xs font-bold text-slate-800"
              >
                <option value="acuaticas">💧 Aves acuáticas y de humedales</option>
                <option value="arboles">🌳 Aves de árboles y arbustos</option>
                <option value="pastizales">🌾 Aves de espacios abiertos y pastizales</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/20 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Behavior selection */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Comportamiento observado
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              {(['Posado', 'En vuelo', 'Cantando', 'Alimentándose', 'En nido', 'En el agua'] as const).map(b => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBehavior(b)}
                  className={`py-2 px-1 rounded-xl text-center font-bold transition border ${
                    behavior === b
                      ? 'bg-[#263b2b] text-white border-[#263b2b] shadow-sm'
                      : 'bg-white border-amber-900/15 text-slate-700 hover:bg-amber-100/50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Capture Section (Live Camera & Gallery offline!) */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Foto del ave en el campo (Cámara / Galería)
            </label>

            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-dashed border-amber-900/20 space-y-3">
              {isCameraOpen ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-amber-900/20 aspect-video max-h-64 mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleCapturePhotoFromVideo}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-md transition active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-[#f4bb29]" />
                      <span>Capturar foto ahora</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openLiveCamera(cameraFacing === 'environment' ? 'user' : 'environment')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#263b2b] border border-amber-900/20 hover:bg-amber-100/70 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Cambiar cámara</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCameraResources}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {photoBase64 ? (
                    <div className="relative group w-28 h-28 rounded-xl overflow-hidden border border-amber-900/20 shadow-md shrink-0">
                      <img
                        src={photoBase64}
                        alt="Foto del avistamiento"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoBase64(undefined)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow transition"
                        title="Eliminar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white border border-amber-900/15 grid place-items-center text-slate-400 shrink-0">
                      <Camera className="w-7 h-7 text-[#b66b22]" />
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs text-slate-700 font-medium mb-2.5">
                      {photoBase64
                        ? '✓ Foto lista para guardar sin internet en tu bitácora.'
                        : 'Usá tu cámara en vivo para sacarle una foto ahora o elegí una imagen desde tu galería.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => openLiveCamera()}
                        disabled={photoLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-sm cursor-pointer transition active:scale-95 disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4 text-[#f4bb29]" />
                        <span>Usar cámara en vivo</span>
                      </button>

                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#263b2b] hover:bg-amber-100/70 border border-amber-900/20 shadow-2xs cursor-pointer transition active:scale-95">
                        <ImageIcon className="w-4 h-4 text-[#b66b22]" />
                        <span>{photoBase64 ? 'Cambiar de galería' : 'Subir desde galería'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={photoLoading}
                        />
                      </label>
                    </div>
                    {photoLoading && <p className="text-[11px] text-amber-800 mt-1 animate-pulse">Comprimiendo imagen...</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audio Capture / Upload Section */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Audio captado en el campo (Opcional)
            </label>

            <div className="p-4 rounded-2xl bg-[#f4f7ee] border-2 border-dashed border-emerald-900/20 space-y-3">
              {audioBase64 ? (
                <div className="space-y-2.5">
                  <AudioPlayerBar
                    src={audioBase64}
                    title={audioFileName || 'Audio grabado en el campo'}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#557544]">
                      ✓ Audio listo para guardar sin internet en tu ficha.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioBase64(undefined);
                        setAudioFileName(undefined);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Quitar audio
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 font-medium">
                  Grabá el canto del ave en vivo con tu micrófono o subí una nota de voz / archivo de audio que ya tengas en tu celular.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                {isRecording ? (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
                    <span>
                      Detener grabación (0:{recordingSeconds.toString().padStart(2, '0')} / 0:45)
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={audioLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1b2b1e] shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4 text-[#f4bb29]" />
                    <span>{audioBase64 ? 'Grabar nuevo audio' : 'Grabar con micrófono'}</span>
                  </button>
                )}

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#3a1c36] hover:bg-amber-100/70 border border-amber-900/20 shadow-2xs cursor-pointer transition active:scale-95">
                  <Upload className="w-4 h-4 text-[#3a1c36]" />
                  <span>{audioBase64 ? 'Cambiar archivo' : 'Subir archivo de audio'}</span>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.opus,.webm"
                    onChange={handleAudioUpload}
                    className="hidden"
                    disabled={audioLoading || isRecording}
                  />
                </label>

                {audioLoading && (
                  <span className="text-[11px] text-amber-800 animate-pulse">
                    Cargando audio...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Characteristics and Notes */}
          <div>
            <label className="block text-xs font-bold text-[#263b2b] uppercase tracking-wider mb-1.5">
              Características observadas y notas de campo
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describí plumaje, pico, patas, sonidos o si andaba sola o en bandada..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/20 focus:outline-none focus:ring-2 focus:ring-[#1c7692] text-xs text-slate-800"
            />
          </div>

          {/* Optional: Also add as new species in Identificá un Ave */}
          {onAddBirdToCatalog && !isAlreadyInCatalog && (
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-900/15 cursor-pointer hover:bg-amber-500/15 transition">
              <input
                type="checkbox"
                checked={addToCatalog}
                onChange={e => setAddToCatalog(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#3a1c36] shrink-0"
              />
              <div>
                <span className="block text-xs font-extrabold text-[#263b2b]">
                  Sumar también esta especie a la lista de "Identificá un Ave"
                </span>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  Si es un ave nueva que no figura en la guía, se agregará automáticamente con su foto, audio y descripción.
                </span>
              </div>
            </label>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-900/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1b2b1e] shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Guardar Ficha de Campo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
