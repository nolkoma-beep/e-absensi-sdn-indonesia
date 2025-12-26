
import React, { useState, useRef } from 'react';
import { User, AttendanceType } from '../types';
import { Button } from './Button';
// Added Loader2 to fix the "Cannot find name 'Loader2'" error on line 153
import { X, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Hash, UserCircle, FileText, Loader2 } from 'lucide-react';

interface IjinSakitModalProps {
  user: User;
  type: AttendanceType;
  onClose: () => void;
  onSubmit: (type: AttendanceType, note: string, photoData?: string) => void;
}

export const IjinSakitModal: React.FC<IjinSakitModalProps> = ({ user, type, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('Mohon isi keterangan.');
      return;
    }
    onSubmit(type, note, photoData || undefined);
  };

  const isSakit = type === AttendanceType.SAKIT;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
      <div className="glass w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col max-h-[92vh] border-white/20 shadow-2xl transition-all">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <h3 className={`text-xl font-bold tracking-tight ${isSakit ? 'text-rose-400' : 'text-amber-400'}`}>
              Form {isSakit ? 'Keterangan Sakit' : 'Permohonan Izin'}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-widest">Lengkapi Dokumen Pendukung</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Identity Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-gray-500">
                <UserCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Pegawai</p>
                <p className="text-xs font-bold text-gray-200 truncate">{user.name.split(',')[0]}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-gray-500">
                <Hash size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">NIP</p>
                <p className="text-xs font-mono text-gray-200 truncate tracking-tight">{user.nip.split(' ')[0]}...</p>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={14} className={isSakit ? 'text-rose-400' : 'text-amber-400'} />
                Alasan / Keterangan
              </label>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Wajib Diisi</span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isSakit ? "Sebutkan diagnosa singkat atau gejala..." : "Jelaskan keperluan izin secara singkat..."}
              className="w-full bg-gray-900 border border-white/10 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all min-h-[140px] text-gray-200 resize-none placeholder:text-gray-600 leading-relaxed"
              required
            />
          </div>

          {/* Gallery Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ImageIcon size={14} className={isSakit ? 'text-rose-400' : 'text-amber-400'} />
                Lampiran Foto
              </label>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Opsional</span>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${photoData ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'border-white/10 hover:border-amber-500/40 bg-white/5'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {photoData ? (
                <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                    <img src={photoData} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="bg-white/10 px-6 py-2.5 rounded-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                        Ganti Foto
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Foto Berhasil Dilampirkan</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 text-gray-500 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-all duration-300 shadow-xl border border-white/5">
                    <Upload size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Pilih dari Galeri</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest opacity-60">JPG, PNG, atau PDF</p>
                  </div>
                </>
              )}
            </div>
            
            {fileName && !photoData && (
              <div className="flex items-center justify-center gap-2 text-amber-500 animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Memproses file...</span>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-white/5 shrink-0 space-y-4">
          <Button 
            variant="warning" 
            fullWidth 
            onClick={handleSubmit}
            className={`rounded-2xl py-4 sm:py-5 font-black text-lg tracking-[0.2em] shadow-2xl transition-all ${isSakit ? 'bg-rose-600 hover:bg-rose-500' : ''}`}
          >
            KIRIM LAPORAN
          </Button>
          <div className="flex items-center justify-center gap-6">
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.4em]">E-ABSENSI SDN INDONESIA</p>
            <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.4em]">VERIFIED DOCUMENT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
