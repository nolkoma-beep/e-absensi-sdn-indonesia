
import React from 'react';
import { AttendanceRecord, AttendanceType } from '../types';
import { CheckCircle2, Clock, Info, MapPin, ExternalLink, Image as ImageIcon, BadgeCheck, AlertTriangle } from 'lucide-react';

interface HistoryViewProps {
  history: AttendanceRecord[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const getTypeStyles = (type: AttendanceType) => {
    switch (type) {
      case AttendanceType.DATANG: return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case AttendanceType.PULANG: return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      case AttendanceType.IJIN: return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case AttendanceType.SAKIT: return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getIcon = (type: AttendanceType) => {
    switch (type) {
      case AttendanceType.DATANG: return <CheckCircle2 size={16} />;
      case AttendanceType.PULANG: return <Clock size={16} />;
      case AttendanceType.IJIN:
      case AttendanceType.SAKIT: return <Info size={16} />;
      default: return null;
    }
  };

  const checkIfLate = (item: AttendanceRecord) => {
    if (item.type !== AttendanceType.DATANG) return false;
    const time = new Date(item.timestamp);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return hours > 7 || (hours === 7 && minutes > 31);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Riwayat Kehadiran</h2>
        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
          Sync Real-time
        </span>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="glass p-16 text-center rounded-[2.5rem] border-dashed border-2 border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
               <Clock size={32} />
            </div>
            <p className="text-gray-500 font-medium">Belum ada riwayat presensi hari ini.</p>
          </div>
        ) : (
          history.map((item) => {
            const isLate = checkIfLate(item);
            return (
              <div key={item.id} className="glass p-5 rounded-[2rem] flex flex-col gap-5 hover:bg-white/5 transition-all group border-white/5 hover:border-white/10">
                <div className="flex items-start gap-4">
                  {/* Avatar/Photo Preview */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-800 overflow-hidden border border-white/10 shadow-lg">
                      {item.photoData ? (
                        <img src={item.photoData} alt={item.userName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg border-2 border-gray-950 ${getTypeStyles(item.type)} shadow-lg`}>
                      {getIcon(item.type)}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-col mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-100 truncate group-hover:text-blue-400 transition-colors">{item.userName}</h4>
                        {isLate && (
                          <div className="flex items-center gap-1 bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                            <AlertTriangle size={10} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Terlambat</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">NIP: {item.userNip}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border tracking-wider ${getTypeStyles(item.type)}`}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                        <Clock size={12} className="text-gray-600" />
                        {item.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase">
                        {item.timestamp.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible/Extended Info */}
                {(item.location || item.photoData || item.note) && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                    {item.location && (
                      <a 
                        href={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/10"
                      >
                        <MapPin size={12} />
                        Lokasi GPS
                        <ExternalLink size={10} className="opacity-50" />
                      </a>
                    )}
                    {item.photoData && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                        <BadgeCheck size={12} />
                        Verified Photo
                      </div>
                    )}
                    {item.note && (
                      <div className="w-full mt-1 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                           <Info size={12} /> Keterangan
                         </p>
                         <p className="text-xs text-amber-200/70 italic">"{item.note}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
