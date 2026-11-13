import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerBarProps {
  src: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const formatAudioTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  src,
  title = 'Audio grabado en el campo',
  subtitle,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setHasError(true);
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        compact
          ? 'p-2.5 rounded-2xl bg-[#f4f7ee] border border-emerald-900/15'
          : 'p-4 rounded-2xl bg-[#f4f7ee] border border-emerald-900/15 shadow-xs'
      }
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Volume2 className="w-3.5 h-3.5 text-[#557544] shrink-0" />
          <span className="text-[11px] font-extrabold text-[#263b2b] truncate">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-bold font-mono text-slate-600 tabular-nums shrink-0">
          {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
        </span>
      </div>

      {hasError ? (
        <p className="text-[11px] text-rose-700">
          No se pudo reproducir este archivo de audio en este navegador.
        </p>
      ) : (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            className={
              compact
                ? 'w-8 h-8 rounded-full bg-[#3a1c36] hover:bg-[#281325] text-white flex items-center justify-center shadow-xs transition active:scale-95 shrink-0 cursor-pointer'
                : 'w-10 h-10 rounded-full bg-[#3a1c36] hover:bg-[#281325] text-white flex items-center justify-center shadow-md transition active:scale-95 shrink-0 cursor-pointer'
            }
          >
            {isPlaying ? (
              <Pause className={compact ? 'w-3.5 h-3.5 fill-current' : 'w-4 h-4 fill-current'} />
            ) : (
              <Play className={compact ? 'w-3.5 h-3.5 fill-current ml-0.5' : 'w-4 h-4 fill-current ml-0.5'} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progreso del audio"
            className="flex-1 min-w-0 h-1.5 rounded-full bg-[#d6dccd] cursor-pointer accent-[#3a1c36]"
          />

          {!compact && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              className="p-2 rounded-full bg-white hover:bg-amber-100/70 text-[#263b2b] border border-emerald-900/15 transition shrink-0 cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-700" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#263b2b]" />
              )}
            </button>
          )}
        </div>
      )}

      {subtitle && (
        <p className="mt-1.5 text-[10px] text-slate-600 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
