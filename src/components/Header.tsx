import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, Download, Plus, Menu, X, Share2, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenNewSighting: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenShare?: () => void;
  onOpenLogbook?: () => void;
  onOpenPermissions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewSighting,
  activeTab,
  setActiveTab,
  onOpenShare,
  onOpenLogbook,
  onOpenPermissions
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'aves', label: 'Identificá un Ave' },
    { id: 'album', label: 'Mis Fichas de Campo' },
    { id: 'juegos', label: 'Juegos y Trivia' },
    { id: 'conservacion', label: 'Conservación' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fff9ed] border-b border-amber-900/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo & Brand: Wordmark logo */}
        <div 
          onClick={() => handleNavClick('aves')}
          className="flex items-center cursor-pointer group py-0.5"
          title="Eco-Quest • Villa Mercedes"
        >
          <img
            src="/logo_ecoquest.png?v=7"
            alt="Eco-Quest"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/isologo_transparent.png?v=7';
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-800">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-2 rounded-full transition ${
                activeTab === item.id
                  ? 'bg-[#3a1c36] text-white shadow-xs'
                  : 'hover:bg-[#3a1c36]/10 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right actions: Offline badge, PWA install, and Three-bars Menu (Compartir, Bitácora, Nueva Ficha) */}
        <div className="flex items-center gap-2.5" ref={menuContainerRef}>
          {/* Connectivity Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-900 border-emerald-500/20'
                : 'bg-amber-500/15 text-amber-950 border-amber-500/40 animate-pulse'
            }`}
            title={isOnline ? 'Conexión a internet activa' : 'Modo Sin Conexión activo: tus datos y fotos se guardan en el teléfono'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">En línea</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-700" />
                <span>Modo Campo (Offline)</span>
              </>
            )}
          </div>

          {/* PWA Install Button (desktop shortcut) */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#1c7692] text-white hover:bg-[#155d74] shadow-sm transition active:scale-95"
              title="Instalar la aplicación en tu celular para usarla en el campo"
            >
              <Download className="w-4 h-4" />
              Instalar App
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold border border-amber-900/20 text-slate-800 hover:bg-amber-100 transition"
            >
              <Download className="w-4 h-4" />
              Instalar en iPhone
            </button>
          )}

          {/* Three-bars (≡) Menu Toggle Button (Desktop & Mobile) */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-label="Abrir menú de herramientas (Compartir, Bitácora, Nueva Ficha)"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-extrabold border transition shadow-xs active:scale-95 ${
                menuOpen
                  ? 'bg-[#3a1c36] text-white border-[#3a1c36]'
                  : 'bg-white text-[#263b2b] border-amber-900/20 hover:bg-[#edd8ab]/60'
              }`}
              title="Menú de opciones: Nueva Ficha, Bitácora y Compartir"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#3a1c36]" />}
              <span className="hidden sm:inline">Menú</span>
            </button>

            {/* Dropdown Menu (Desktop & Mobile) */}
            {menuOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-3xl bg-[#fff9ed] border border-amber-900/20 shadow-2xl p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2">
                {/* Mobile section navigation */}
                <div className="lg:hidden space-y-1 pb-2 border-b border-amber-900/10">
                  <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    Secciones
                  </p>
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                        activeTab === item.id
                          ? 'bg-[#edd8ab] text-[#7e4218]'
                          : 'text-slate-700 hover:bg-amber-100/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>

                {/* Main 3 options: Nueva Ficha, Bitácora, Compartir */}
                <div className="space-y-1.5">
                  <p className="px-2.5 pt-1 text-[10px] font-extrabold uppercase tracking-widest text-[#3a1c36]">
                    Acciones de Campo
                  </p>

                  {/* 1. Nueva Ficha */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenNewSighting();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold bg-[#3a1c36] text-white hover:bg-[#281325] shadow-sm transition active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-[#f4bb29]" />
                    </div>
                    <div className="text-left">
                      <span className="block leading-tight">Nueva Ficha</span>
                      <span className="block text-[11px] font-normal text-white/80">Registrar un avistamiento</span>
                    </div>
                  </button>

                  {/* 2. Bitácora */}
                  {onOpenLogbook && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenLogbook();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold bg-[#edd8ab] text-[#263b2b] hover:bg-[#e4cc98] border border-amber-900/20 shadow-2xs transition active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#3a1c36]/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-[#3a1c36]" />
                      </div>
                      <div className="text-left">
                        <span className="block leading-tight">Mi Bitácora</span>
                        <span className="block text-[11px] font-medium text-[#263b2b]/75">Ver historial e imprimir</span>
                      </div>
                    </button>
                  )}

                  {/* 3. Compartir */}
                  {onOpenShare && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenShare();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold bg-white text-[#263b2b] hover:bg-amber-100/60 border border-amber-900/15 shadow-2xs transition active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1c7692]/10 flex items-center justify-center shrink-0">
                        <Share2 className="w-4 h-4 text-[#1c7692]" />
                      </div>
                      <div className="text-left">
                        <span className="block leading-tight">Compartir App</span>
                        <span className="block text-[11px] font-normal text-slate-600">Enlace corto y código QR</span>
                      </div>
                    </button>
                  )}

                  {/* 4. Permisos de Cámara y Audio */}
                  {onOpenPermissions && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenPermissions();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold bg-white text-[#263b2b] hover:bg-emerald-50 border border-emerald-900/15 shadow-2xs transition active:scale-[0.98]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#557544]/15 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#557544]" />
                      </div>
                      <div className="text-left">
                        <span className="block leading-tight">Permisos</span>
                        <span className="block text-[11px] font-normal text-slate-600">Activar cámara y micrófono</span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Mobile PWA Install inside drawer if applicable */}
                {(!isInstalled && (isInstallable || isIOS)) && (
                  <div className="md:hidden pt-2 border-t border-amber-900/10">
                    {isInstallable && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          install();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1c7692] text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Instalar App en el Celular
                      </button>
                    )}
                    {isIOS && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setShowIOSGuide(true);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-950"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Instalar en iPhone / Safari
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#fff9ed] p-6 shadow-2xl border-2 border-amber-900/20 text-slate-800">
            <h3 className="text-lg font-bold font-serif-fraunces text-[#263b2b]">
              Instalar en iPhone o iPad
            </h3>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              1. Tocá el botón <b>Compartir</b> (el cuadrito con la flecha hacia arriba) en la barra de Safari.<br /><br />
              2. Deslizá hacia abajo y seleccioná <b>"Agregar a pantalla de inicio"</b>.<br /><br />
              3. ¡Listo! Tendrás la guía y el mapa con GPS disponibles en el campo aunque no tengas internet.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-full bg-[#263b2b] py-2.5 text-xs font-bold text-white shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
