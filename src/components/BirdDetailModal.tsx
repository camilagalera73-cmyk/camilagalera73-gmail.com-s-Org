import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, BookOpen, ZoomIn, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Bird, CATEGORY_LABELS } from '../types/bird';

interface BirdDetailModalProps {
  bird: Bird | null;
  onClose: () => void;
  onRecordSighting: (birdName: string) => void;
}

const formatAudioTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const BirdDetailModal: React.FC<BirdDetailModalProps> = ({
  bird,
  onClose,
  onRecordSighting
}) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    setIsImageZoomed(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [bird?.id]);

  if (!bird) return null;

  const catMeta = CATEGORY_LABELS[bird.category] || CATEGORY_LABELS.arboles;

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onClose();
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setAudioError(true);
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && isFinite(val)) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
        <div 
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-5 sm:p-7 md:p-8"
          role="dialog"
          aria-modal="true"
        >
          {/* Header: Category Badge + Title & Subtitle + Close Button */}
          <div className="flex items-start justify-between pb-4 border-b border-amber-900/15">
            <div>
              <div className="mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${catMeta.color}`}>
                  {catMeta.name}
                </span>
              </div>

              {/* Title in Green */}
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#263b2b] tracking-tight">
                {bird.name}
              </h2>

              {/* Subtitle in Violet */}
              <p className="text-sm sm:text-base italic text-[#3a1c36] font-medium mt-0.5">
                {bird.scientificName}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-amber-100 text-[#3a1c36] transition"
              aria-label="Cerrar ventana"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="space-y-5 mt-5">
            {/* Bird Photo with Zoom/Expand Button */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-900/15 shadow-md aspect-video max-h-80 bg-slate-900 group">
              <img
                src={bird.photoUrl}
                alt={bird.name}
                onClick={() => setIsImageZoomed(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Botón / Signo para agrandar la imagen */}
              <button
                type="button"
                onClick={() => setIsImageZoomed(true)}
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-xs transition shadow-md active:scale-95 border border-white/20 cursor-pointer"
                title="Tocar para agrandar la imagen del ave"
              >
                <ZoomIn className="w-4 h-4 text-emerald-300" />
                <span>Agrandar imagen</span>
              </button>

              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-medium pointer-events-none">
                {bird.name} en su entorno natural
              </div>
            </div>

            {/* Bird Song / Sound Player */}
            {bird.audioUrl && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f7ee] border border-emerald-900/15 shadow-xs">
                <audio
                  ref={audioRef}
                  src={bird.audioUrl}
                  preload="metadata"
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  onError={() => {
                    setAudioError(true);
                    setIsPlaying(false);
                  }}
                />

                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#263b2b]/10 text-[#263b2b]">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#263b2b] uppercase tracking-wider">
                      Canto y sonido del ave
                    </h4>
                  </div>

                  <span className="text-[11px] font-bold font-mono text-slate-600 tabular-nums">
                    {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
                  </span>
                </div>

                {audioError ? (
                  <p className="text-xs text-slate-600">
                    No se pudo cargar el audio en este momento.
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? `Pausar canto de ${bird.name}` : `Escuchar canto de ${bird.name}`}
                      className="w-11 h-11 rounded-full bg-[#3a1c36] hover:bg-[#281325] text-white flex items-center justify-center shadow-md transition active:scale-95 shrink-0 cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        aria-label="Progreso del audio"
                        className="w-full h-2 rounded-full bg-[#d6dccd] cursor-pointer accent-[#3a1c36]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                      className="p-2.5 rounded-full bg-white hover:bg-amber-100/70 text-[#263b2b] border border-emerald-900/15 transition shrink-0 cursor-pointer"
                      title={isMuted ? 'Activar sonido' : 'Silenciar'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-700" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#263b2b]" />
                      )}
                    </button>
                  </div>
                )}

                {bird.audioAttribution && (
                  <p className="mt-2.5 text-[11px] text-slate-600">
                    {bird.audioAttribution}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-900/10 shadow-xs">
              <h4 className="text-xs sm:text-sm font-bold text-[#3a1c36] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#3a1c36]" />
                Descripción de la especie
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {bird.description}
              </p>
            </div>

            {/* Sighting Action Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#3a1c36]/5 border border-[#3a1c36]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="text-sm font-bold text-[#3a1c36]">
                  ¿La viste en Villa Mercedes?
                </h5>
                <p className="text-xs text-slate-600 mt-0.5">
                  Registrá tu observación en tu libreta de campo con fecha, hora y ubicación.
                </p>
              </div>
              <button
                onClick={() => {
                  onRecordSighting(bird.name);
                  handleClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-md transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Registrar avistamiento
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-amber-900/15 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-amber-100 transition"
            >
              Cerrar ficha
            </button>
          </div>
        </div>
      </div>

      {/* Visor de imagen agrandada / pantalla completa */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in"
          onClick={() => setIsImageZoomed(false)}
        >
          {/* Header con nombre del ave y botón de cerrar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between py-2 shrink-0 border-b border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <h3 className="text-white text-lg sm:text-2xl font-extrabold flex items-center gap-2">
                <span>{bird.name}</span>
                <span className="text-emerald-300 italic text-sm sm:text-base font-normal">
                  ({bird.scientificName})
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {catMeta.name} • Fotografía de alta resolución
              </p>
            </div>
            <button
              onClick={() => setIsImageZoomed(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold transition shadow-lg active:scale-95 cursor-pointer"
              aria-label="Cerrar imagen grande"
            >
              <X className="w-5 h-5" />
              <span>Cerrar</span>
            </button>
          </div>

          {/* Imagen agrandada en tamaño máximo */}
          <div 
            className="flex-1 w-full max-w-5xl flex items-center justify-center p-2 min-h-0 my-3"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={bird.photoUrl}
              alt={bird.name}
              className="max-h-[78vh] sm:max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
            />
          </div>

          {/* Pie de imagen indicativo */}
          <div className="text-center py-1 text-xs text-white/70 shrink-0">
            Tocá en cualquier lugar exterior o en "Cerrar" para volver a la ficha
          </div>
        </div>
      )}
    </>
  );
};
