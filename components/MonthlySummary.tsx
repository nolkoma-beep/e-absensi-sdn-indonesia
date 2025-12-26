
import React from 'react';
import { AttendanceRecord, AttendanceType } from '../types';
import { PieChart, CalendarCheck, UserMinus, Thermometer, UserX, Info } from 'lucide-react';

interface MonthlySummaryProps {
  history: AttendanceRecord[];
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ history }) => {
  const now = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  // Statistics calculation
  const stats = history.reduce((acc, curr) => {
    const recordDate = new Date(curr.timestamp);
    if (recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear()) {
      if (curr.type === AttendanceType.DATANG) acc.hadir++;
      else if (curr.type === AttendanceType.IJIN) acc.izin++;
      else if (curr.type === AttendanceType.SAKIT) acc.sakit++;
    }
    return acc;
  }, { hadir: 0, izin: 0, sakit: 0 });

  // Mock total workdays for the month up to today
  const totalWorkDays = 22; 
  const alpa = Math.max(0, totalWorkDays - (stats.hadir + stats.izin + stats.sakit));
  const attendanceRate = Math.round(((stats.hadir + stats.izin + stats.sakit) / totalWorkDays) * 100);

  const StatCard = ({ title, value, icon, color, subtext }: { title: string, value: number, icon: React.ReactNode, color: string, subtext: string }) => (
    <div className={`glass p-6 rounded-[2.5rem] border-white/5 hover:border-${color}/30 transition-all group relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/10 blur-3xl -mr-8 -mt-8 rounded-full`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
          <p className={`text-4xl font-black text-gray-100`}>{value}</p>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-gray-400 font-medium italic border-t border-white/5 pt-3">
        {subtext}
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Rekapitulasi</h2>
          <p className="text-gray-400 text-sm font-medium">{currentMonthName} {currentYear}</p>
        </div>
        <div className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
          <PieChart size={18} className="text-blue-400" />
          <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Target: {totalWorkDays} Hari</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Hadir" 
          value={stats.hadir} 
          icon={<CalendarCheck size={24} />} 
          color="emerald-500" 
          subtext="Kehadiran fisik tercatat"
        />
        <StatCard 
          title="Izin" 
          value={stats.izin} 
          icon={<UserMinus size={24} />} 
          color="amber-500" 
          subtext="Permohonan izin disetujui"
        />
        <StatCard 
          title="Sakit" 
          value={stats.sakit} 
          icon={<Thermometer size={24} />} 
          color="rose-500" 
          subtext="Laporan sakit terverifikasi"
        />
        <StatCard 
          title="Alpa" 
          value={alpa} 
          icon={<UserX size={24} />} 
          color="gray-500" 
          subtext="Ketidakhadiran tanpa kabar"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[3rem] border-white/5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info size={18} className="text-blue-400" />
              Persentase Kehadiran
            </h3>
            <span className="text-2xl font-black text-blue-400">{attendanceRate}%</span>
          </div>
          
          <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Aktif</p>
              <p className="text-lg font-bold">{stats.hadir + stats.izin + stats.sakit}</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Rasio Sakit</p>
              <p className="text-lg font-bold">{Math.round((stats.sakit / totalWorkDays) * 100)}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Rasio Izin</p>
              <p className="text-lg font-bold">{Math.round((stats.izin / totalWorkDays) * 100)}%</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[3rem] border-white/5 space-y-6">
          <h3 className="font-bold text-gray-300">Catatan Kepegawaian</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "Kinerja kehadiran Anda bulan ini sangat baik. Pertahankan kedisiplinan demi kemajuan SDN Indonesia."
              </p>
            </div>
            <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Update Terakhir</p>
              <p className="text-xs font-medium text-blue-200">
                Data otomatis diperbarui setiap kali Anda melakukan presensi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
