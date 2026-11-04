import React, { useState } from 'react';
import { Wifi, WifiOff, Download, Plus, Menu, X, MapPin } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenNewSighting: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewSighting,
  activeTab,
  setActiveTab
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'mapa', label: 'Mapa Villa Mercedes' },
    { id: 'aves', label: 'Catálogo de Aves' },
    { id: 'album', label: 'Mis Fichas de Campo' },
    { id: 'album-check', label: 'Álbum Checklist' },
    { id: 'juegos', label: 'Juegos y Trivia' },
    { id: 'conservacion', label: 'Conservación' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fff9ed]/95 border-b border-amber-900/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo & Brand: New wordmark logo */}
        <div 
          onClick={() => handleNavClick('mapa')}
          className="flex items-center cursor-pointer group py-0.5"
          title="Eco-Quest • Villa Mercedes"
        >
          <img
            src="/logo_ecoquest.png"
            alt="Eco-Quest"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/logo.png';
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
                  ? 'bg-[#edd8ab] text-[#7e4218]'
                  : 'hover:bg-amber-100/70 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right actions: Offline badge, PWA button, + New Sighting */}
        <div className="flex items-center gap-2.5">
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

          {/* PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#1c7692] text-white hover:bg-[#155d74] shadow-sm transition active:scale-95"
              title="Instalar la aplicación en tu celular para usarla en el campo"
            >
              <Download className="w-4 h-4" />
              Instalar App
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border border-amber-900/20 text-slate-800 hover:bg-amber-100 transition"
            >
              <Download className="w-4 h-4" />
              Instalar en iPhone
            </button>
          )}

          {/* Register Sighting Button */}
          <button
            onClick={onOpenNewSighting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-[#b66b22] text-white hover:bg-[#9a561d] shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Ficha</span>
            <span className="sm:hidden">Ficha</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-xl text-slate-700 hover:bg-amber-100/60 lg:hidden"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-900/10 bg-[#fff9ed] px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-[#edd8ab] text-[#7e4218]'
                  : 'text-slate-700 hover:bg-amber-100/60'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}

          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1c7692] text-white"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar App en el Celular
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-950"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar en iPhone / Safari
            </button>
          )}
        </div>
      )}

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
