import React, { useState, useEffect } from 'react';
import { Camera, Mic, Image as ImageIcon, FileAudio, CheckCircle2, ShieldCheck, X, AlertCircle } from 'lucide-react';

type PermStatus = 'unknown' | 'granted' | 'denied' | 'unsupported';

const STORAGE_KEY = 'ecoquest_permissions_prompt_seen_v1';

interface PermissionsWelcomeModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const PermissionsWelcomeModal: React.FC<PermissionsWelcomeModalProps> = ({
  isOpen,
  onOpen,
  onClose
}) => {
  const [camStatus, setCamStatus] = useState<PermStatus>('unknown');
  const [micStatus, setMicStatus] = useState<PermStatus>('unknown');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const checkCurrentPermissions = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStatus('unsupported');
      setMicStatus('unsupported');
      return { camGranted: false, micGranted: false };
    }
    let camGranted = false;
    let micGranted = false;
    try {
      if (navigator.permissions?.query) {
        const camPerm = await navigator.permissions.query({ name: 'camera' as PermissionName }).catch(() => null);
        const micPerm = await navigator.permissions.query({ name: 'microphone' as PermissionName }).catch(() => null);
        camGranted = camPerm?.state === 'granted';
        micGranted = micPerm?.state === 'granted';
        if (camPerm) setCamStatus(camGranted ? 'granted' : camPerm.state === 'denied' ? 'denied' : 'unknown');
        if (micPerm) setMicStatus(micGranted ? 'granted' : micPerm.state === 'denied' ? 'denied' : 'unknown');
      }
    } catch {
      // ignore Permissions API unsupported
    }
    return { camGranted, micGranted };
  };

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    let mounted = true;
    const init = async () => {
      const { camGranted, micGranted } = await checkCurrentPermissions();
      if (!mounted) return;
      if (camGranted && micGranted) {
        localStorage.setItem(STORAGE_KEY, '1');
        return;
      }
      onOpen();
    };
    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStatusMessage(null);
      checkCurrentPermissions();
    }
  }, [isOpen]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    onClose();
  };

  const requestCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStatus('unsupported');
      setStatusMessage('Tu navegador no admite cámara en vivo, pero podés subir fotos desde tu galería.');
      return;
    }
    setIsRequesting(true);
    setStatusMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setCamStatus('granted');
    } catch {
      setCamStatus('denied');
      setStatusMessage('No se otorgó permiso de cámara desde el navegador. Igual podés subir fotos desde tu galería.');
    } finally {
      setIsRequesting(false);
    }
  };

  const requestMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unsupported');
      setStatusMessage('Tu navegador no admite grabación en vivo, pero podés subir audios desde tus archivos.');
      return;
    }
    setIsRequesting(true);
    setStatusMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicStatus('granted');
    } catch {
      setMicStatus('denied');
      setStatusMessage('No se otorgó permiso de micrófono desde el navegador. Igual podés subir audios desde tus archivos.');
    } finally {
      setIsRequesting(false);
    }
  };

  const requestBoth = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStatus('unsupported');
      setMicStatus('unsupported');
      setStatusMessage('Tu navegador no permite activar cámara o micrófono en vivo aquí, pero siempre podés subir fotos de tu galería y archivos de audio.');
      return;
    }
    setIsRequesting(true);
    setStatusMessage(null);

    let camOk = camStatus === 'granted';
    let micOk = micStatus === 'granted';

    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      camStream.getTracks().forEach(t => t.stop());
      camOk = true;
      setCamStatus('granted');
    } catch {
      setCamStatus('denied');
    }

    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getTracks().forEach(t => t.stop());
      micOk = true;
      setMicStatus('granted');
    } catch {
      setMicStatus('denied');
    }

    setIsRequesting(false);

    if (camOk && micOk) {
      localStorage.setItem(STORAGE_KEY, '1');
      onClose();
    } else if (!camOk || !micOk) {
      setStatusMessage(
        'Si el navegador bloqueó algún permiso, igual podés usar tus fotos de la galería y archivos de audio al crear cada ficha.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#fff9ed] rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perm-modal-title"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-900/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#263b2b] text-[#f4bb29] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9a561d] block">
                Configuración de Salida de Campo
              </span>
              <h2 id="perm-modal-title" className="text-xl sm:text-2xl font-bold font-serif-fraunces text-[#263b2b]">
                Permisos de Cámara y Audio
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="p-2 rounded-full hover:bg-amber-100 text-slate-500 transition"
            aria-label="Cerrar aviso de permisos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed">
          Para registrar aves en el momento desde tu celular o computadora, podés habilitar ahora el acceso a tu <strong>cámara</strong> y <strong>micrófono</strong>. También podés subir fotos y audios desde tu galería cuando quieras.
        </p>

        <div className="mt-4 space-y-2.5">
          {/* Camera permission row */}
          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#b66b22] flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#263b2b]">Cámara en vivo</p>
                <p className="text-[11px] text-slate-600">Para fotografiar aves en el momento.</p>
              </div>
            </div>
            {camStatus === 'granted' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Permitida
              </span>
            ) : (
              <button
                type="button"
                onClick={requestCamera}
                disabled={isRequesting}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#3a1c36] text-white hover:bg-[#281325] transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                Permitir
              </button>
            )}
          </div>

          {/* Microphone permission row */}
          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#f4f7ee] text-[#557544] flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#263b2b]">Micrófono</p>
                <p className="text-[11px] text-slate-600">Para grabar el canto del ave en vivo.</p>
              </div>
            </div>
            {micStatus === 'granted' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Permitido
              </span>
            ) : (
              <button
                type="button"
                onClick={requestMicrophone}
                disabled={isRequesting}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#263b2b] text-white hover:bg-[#1b2b1e] transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                Permitir
              </button>
            )}
          </div>

          {/* Gallery & audio files info row */}
          <div className="p-3.5 rounded-2xl bg-[#f4f7ee] border border-emerald-900/15 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#557544] shrink-0">
              <ImageIcon className="w-4 h-4" />
              <FileAudio className="w-4 h-4" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-700">
              <strong>Galería de fotos y archivos de audio:</strong> siempre disponibles al abrir o crear una ficha, tocando "Subir de galería" o "Subir archivo de audio".
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-3 p-3 rounded-xl bg-amber-100/70 border border-amber-900/20 text-xs text-[#5c310b] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#b66b22]" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-amber-900/15 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={dismiss}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:bg-amber-100 transition text-center"
          >
            Continuar sin activar ahora
          </button>
          <button
            type="button"
            onClick={requestBoth}
            disabled={isRequesting}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-md transition active:scale-95 text-center disabled:opacity-50 cursor-pointer"
          >
            {isRequesting ? 'Solicitando permisos...' : 'Permitir Cámara y Micrófono'}
          </button>
        </div>
      </div>
    </div>
  );
};
