
import React, { useState } from 'react';
import { User } from '../types';
import { BadgeCheck, Briefcase, Hash, UserCircle, LogOut, AlertCircle } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogoutClick = () => {
    if (confirmLogout) {
      onLogout();
    } else {
      setConfirmLogout(true);
      // Reset status konfirmasi jika tidak diklik lagi dalam 3 detik
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-2xl mx-auto">
      <div className="flex flex-col items-center">
        {/* Profile Photo */}
        <div className="relative mb-8">
          <div className="w-44 h-44 rounded-[3rem] overflow-hidden border-4 border-gray-800 shadow-2xl bg-gray-900 group">
            <img 
              src={user.photo} 
              alt={user.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2.5 rounded-2xl border-4 border-gray-950 text-white shadow-lg">
            <BadgeCheck size={28} />
          </div>
        </div>

        {/* Name & Identity */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight">{user.name}</h2>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <Briefcase size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">{user.jabatan}</span>
          </div>
        </div>

        {/* Detailed Info Cards */}
        <div className="w-full space-y-4">
          {/* NIP Card */}
          <div className="glass p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all border-white/5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gray-900 rounded-2xl text-gray-400 group-hover:text-blue-400 transition-colors">
                <Hash size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-1">Nomor Induk Pegawai (NIP)</p>
                <p className="font-mono text-xl text-gray-200">{user.nip}</p>
              </div>
            </div>
            <BadgeCheck size={20} className="text-emerald-500 opacity-40" />
          </div>

          {/* Employment Status Card */}
          <div className="glass p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all border-white/5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-gray-900 rounded-2xl text-gray-400 group-hover:text-emerald-400 transition-colors">
                <UserCircle size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-1">Status Kepegawaian</p>
                <p className="text-xl font-bold text-emerald-400">Pegawai Negeri Sipil (PNS) Aktif</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
              Verified
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleLogoutClick}
              className={`w-full p-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 group active:scale-[0.98] border shadow-xl ${
                confirmLogout 
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse' 
                : 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-rose-500'
              }`}
            >
              {confirmLogout ? (
                <>
                  <AlertCircle size={20} />
                  <span className="font-black text-sm uppercase tracking-[0.2em]">Yakin Ingin Keluar? Klik Lagi</span>
                </>
              ) : (
                <>
                  <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black text-sm uppercase tracking-[0.2em]">Keluar dari Akun</span>
                </>
              )}
            </button>
            <p className="text-center mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
              Versi Aplikasi 2.4.0 • SDN Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
