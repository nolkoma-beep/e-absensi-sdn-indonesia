
import React, { useState, useEffect } from 'react';
import { User, AttendanceType, AttendanceLocation } from '../types';
import { LogIn, LogOut, Calendar, Clock, AlertTriangle, MapPin, Fingerprint, ClipboardList } from 'lucide-react';
import { AbsenModal } from './AbsenModal';
import { IjinSakitModal } from './IjinSakitModal';

interface DashboardProps {
  user: User;
  onAbsen: (type: AttendanceType, note?: string, location?: AttendanceLocation, photoData?: string) => void;
  onNavigate: (tab: 'beranda' | 'riwayat' | 'profil') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onAbsen, onNavigate }) => {
  const [time, setTime] = useState(new Date());
  const [showAbsenModal, setShowAbsenModal] = useState<AttendanceType | null>(null);
  const [showIjinSakitModal, setShowIjinSakitModal] = useState<AttendanceType | null>(null);
  const [isPastLimit, setIsPastLimit] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setIsPastLimit(hours > 7 || (hours === 7 && minutes > 31));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const formattedTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const handleAbsenSubmit = (type: AttendanceType, note?: string, location?: AttendanceLocation, photoData?: string) => {
    onAbsen(type, note, location, photoData);
    setShowAbsenModal(null);
    setShowIjinSakitModal(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {showAbsenModal && (
        <AbsenModal 
          user={user} 
          type={showAbsenModal} 
          onClose={() => setShowAbsenModal(null)} 
          onSubmit={handleAbsenSubmit}
        />
      )}

      {showIjinSakitModal && (
        <IjinSakitModal
          user={user}
          type={showIjinSakitModal}
          onClose={() => setShowIjinSakitModal(null)}
          onSubmit={(type, note, photoData) => handleAbsenSubmit(type, note, undefined, photoData)}
        />
      )}

      {/* Hero Welcome Card */}
      <section className="glass rounded-[2.5rem] relative overflow-hidden border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-8">
           <Fingerprint className="text-white/5 w-32 h-32 rotate-12" />
        </div>
        
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 p-2.5 glass-bright rounded-2xl border border-white/10 shadow-inner group">
                 <img src="https://iili.io/fIonNl1.png" alt="Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-tight uppercase leading-none mb-1">SD Negeri Indonesia</h1>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <MapPin size={10} className="shrink-0" />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]">Serang Banten</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Selamat Datang,</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              {user.name.split(',')[0]}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-bright p-5 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Kalender</p>
                <p className="font-bold text-white text-sm">{formattedDate}</p>
              </div>
            </div>
            <div className={`glass-bright p-5 rounded-3xl border flex items-center gap-4 transition-colors ${isPastLimit ? 'border-rose-500/20' : 'border-white/5'}`}>
              <div className={`p-3 rounded-2xl border ${isPastLimit ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                <Clock size={22} />
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Jam Masuk</p>
                <div className="flex items-center gap-2">
                  <p className={`font-black tabular-nums text-lg ${isPastLimit ? 'text-rose-400' : 'text-emerald-400'}`}>{formattedTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2x2 Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Datang */}
        <button 
          onClick={() => setShowAbsenModal(AttendanceType.DATANG)}
          className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-white/5 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all active:scale-95 group"
        >
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-500/10">
            <LogIn size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Datang</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Presensi Masuk</p>
          </div>
        </button>

        {/* Pulang */}
        <button 
          onClick={() => setShowAbsenModal(AttendanceType.PULANG)}
          className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-white/5 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all active:scale-95 group"
        >
          <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform border border-rose-500/10">
            <LogOut size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Pulang</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Presensi Keluar</p>
          </div>
        </button>

        {/* Izin/Sakit */}
        <button 
          onClick={() => setShowIjinSakitModal(AttendanceType.IJIN)}
          className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-white/5 hover:bg-amber-500/5 hover:border-amber-500/20 transition-all active:scale-95 group"
        >
          <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform border border-amber-500/10">
            <AlertTriangle size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Izin / Sakit</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Lapor Halangan</p>
          </div>
        </button>

        {/* Log / Riwayat */}
        <button 
          onClick={() => onNavigate('riwayat')}
          className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-white/5 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all active:scale-95 group"
        >
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform border border-blue-500/10">
            <ClipboardList size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Log Riwayat</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cek Kehadiran</p>
          </div>
        </button>
      </div>
    </div>
  );
};
