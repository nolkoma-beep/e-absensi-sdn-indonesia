
import React from 'react';
import { Home, ClipboardList, User as UserIcon, LogOut, BarChart2, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'beranda' | 'riwayat' | 'profil';
  setActiveTab: (tab: 'beranda' | 'riwayat' | 'profil') => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/5 shadow-2xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center p-1.5 glass-bright rounded-xl border border-white/10">
              <img 
                src="https://iili.io/fIonNl1.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-tight text-white uppercase italic">
                SD Negeri Indonesia
              </h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-0.5">E-Absensi Digital</p>
            </div>
            <div className="sm:hidden">
               <h1 className="text-xs font-black tracking-[0.3em] text-blue-500 uppercase italic">E-ABSENSI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 glass-bright rounded-full border border-white/5 shadow-inner group">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.1em]">Secure Online</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        {children}
      </main>

      {/* Floating Modern Navigation */}
      <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
        <nav className="glass max-w-sm w-full px-6 py-4 rounded-[2.5rem] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center pointer-events-auto">
          {[
            { id: 'beranda', icon: Home, label: 'Beranda' },
            { id: 'riwayat', icon: ClipboardList, label: 'Log' },
            { id: 'profil', icon: UserIcon, label: 'Profil' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {isActive && (
                  <div className="absolute -top-3 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
                )}
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
