
import React, { useState, useRef, useEffect } from 'react';
import { User, AttendanceType, AttendanceLocation } from '../types';
import { Button } from './Button';
import { Camera, MapPin, X, BadgeCheck, Loader2, RefreshCw, AlertCircle, Clock } from 'lucide-react';

interface AbsenModalProps {
  user: User;
  type: AttendanceType;
  onClose: () => void;
  onSubmit: (type: AttendanceType, note?: string, location?: AttendanceLocation, photoData?: string) => void;
}

export const AbsenModal: React.FC<AbsenModalProps> = ({ user, type, onClose, onSubmit }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<AttendanceLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLate, setIsLate] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    getLiveLocation();
    checkLateness();
    return () => {
      stopCamera();
    };
  }, []);

  const checkLateness = () => {
    if (type === AttendanceType.DATANG) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // Late if after 07:31
      if (hours > 7 || (hours === 7 && minutes > 31)) {
        setIsLate(true);
      }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play()
        .then(() => setIsCameraReady(true))
        .catch((e) => {
          console.error("Video play failed:", e);
          setError("Gagal memutar pratinjau kamera.");
        });
    }
  }, [stream]);

  const startCamera = async () => {
    setIsCameraReady(false);
    setError(null);
    try {
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (err: any) {
      console.error("Camera Error:", err);
      if (err.name === 'NotAllowedError') {
        setError('Akses kamera ditolak. Harap izinkan kamera di pengaturan browser.');
      } else {
        setError(`Gagal mengakses kamera: ${err.message || 'Periksa koneksi kamera.'}`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        // Changed target aspect ratio to 4:5 (wider than 9:16) for a broader view
        const targetWidth = 800;
        const targetHeight = 1000;
        canvasRef.current.width = targetWidth;
        canvasRef.current.height = targetHeight;

        const sourceAspectRatio = videoWidth / videoHeight;
        const targetAspectRatio = targetWidth / targetHeight;

        let sx, sy, sWidth, sHeight;

        if (sourceAspectRatio > targetAspectRatio) {
          sHeight = videoHeight;
          sWidth = videoHeight * targetAspectRatio;
          sx = (videoWidth - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = videoWidth;
          sHeight = videoWidth / targetAspectRatio;
          sx = 0;
          sy = (videoHeight - sHeight) / 2;
        }

        context.save();
        context.scale(-1, 1);
        context.translate(-targetWidth, 0);

        context.drawImage(
          videoRef.current,
          sx, sy, sWidth, sHeight,
          0, 0, targetWidth, targetHeight
        );
        
        context.restore();

        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const getLiveLocation = () => {
    setLocating(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocating(false);
      },
      (err) => {
        let errMsg = 'Gagal mendapatkan lokasi.';
        if (err.code === 1) errMsg = 'Izin lokasi ditolak.';
        else if (err.code === 2) errMsg = 'Sinyal GPS lemah.';
        else if (err.code === 3) errMsg = 'Waktu permintaan habis.';
        setError(errMsg);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    if (!capturedImage) {
      alert('Harap ambil foto verifikasi wajah.');
      return;
    }
    if (!location) {
      alert('Harap tunggu lokasi GPS.');
      return;
    }
    const note = isLate ? 'Sistem: Terlambat (>07:31)' : '';
    onSubmit(type, note, location, capturedImage);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
      <div className="glass w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col max-h-[92vh] border-white/20 shadow-2xl transition-all">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Presensi <span className={type === AttendanceType.DATANG ? 'text-emerald-400' : 'text-rose-400'}>{type}</span>
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-widest">Verifikasi Biometrik & Lokasi</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6">
          {/* Lateness Notification */}
          {isLate && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Pemberitahuan Terlambat</p>
                <p className="text-sm text-amber-200/80 leading-tight">Waktu sudah melewati 07:31. Absen Anda akan tercatat terlambat.</p>
              </div>
            </div>
          )}

          {/* Status indicators */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-2xl border flex items-center gap-3 transition-all ${capturedImage ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
              <div className={`p-2 rounded-xl ${capturedImage ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                <Camera size={18} className={!capturedImage && isCameraReady ? 'animate-pulse' : ''} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider opacity-60">Status Foto</p>
                <p className="text-xs font-bold truncate">{capturedImage ? 'Terverifikasi' : 'Belum Ada'}</p>
              </div>
            </div>
            <div className={`p-3 sm:p-4 rounded-2xl border flex items-center gap-3 transition-all ${location ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
              <div className={`p-2 rounded-xl ${location ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                <MapPin size={18} className={locating ? 'animate-bounce' : ''} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider opacity-60">Status GPS</p>
                <p className="text-xs font-bold truncate">{location ? 'Terkunci' : locating ? 'Mencari...' : 'Menunggu'}</p>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-[3rem] bg-gray-900 overflow-hidden border-2 border-white/10 shadow-2xl group">
            {!capturedImage ? (
              <>
                {stream ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : !error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <div className="relative">
                       <Loader2 size={40} className="animate-spin text-blue-500" />
                       <Camera size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Memulai Kamera...</p>
                  </div>
                ) : null}

                {isCameraReady && !capturedImage && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Shrunk the face guide to force user to hold camera further away */}
                    <div className="w-32 h-44 sm:w-40 sm:h-52 border-2 border-white/20 rounded-[3rem] relative">
                       <div className="absolute inset-0 border border-white/10 rounded-[3rem] scale-110"></div>
                       {/* Face guides */}
                       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 border border-white/5 rounded-full"></div>
                    </div>
                    <p className="mt-6 text-[9px] text-white/60 uppercase font-black tracking-[0.3em] bg-black/60 px-5 py-2 rounded-full backdrop-blur-md">
                      Posisikan Wajah Di Kotak
                    </p>
                  </div>
                )}
                
                {isCameraReady && (
                  <button 
                    onClick={capturePhoto}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 p-6 bg-blue-600 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-110 active:scale-90 transition-all border-4 border-white/20 group"
                  >
                    <Camera size={32} className="text-white group-active:rotate-12 transition-transform" />
                  </button>
                )}
              </>
            ) : (
              <div className="relative w-full h-full animate-in zoom-in-95 duration-300">
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                  <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20">
                    <BadgeCheck size={14} /> FOTO TERVERIFIKASI
                  </div>
                  <button 
                    onClick={() => { setCapturedImage(null); startCamera(); }}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all border border-white/10 flex items-center gap-2 group"
                  >
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Ulangi</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          {location && (
             <div className="bg-white/5 border border-white/10 p-5 rounded-3xl animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Koordinat Presensi</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                    <MapPin size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-gray-200 tracking-tight">
                      Lat: <span className="text-blue-400">{location.latitude.toFixed(6)}</span>
                    </p>
                    <p className="font-mono text-sm text-gray-200 tracking-tight">
                      Lng: <span className="text-blue-400">{location.longitude.toFixed(6)}</span>
                    </p>
                  </div>
                </div>
             </div>
          )}

          {error && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-rose-500/20 rounded-2xl">
                <AlertCircle size={24} className="shrink-0" />
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Terjadi Kendala</p>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
                <button 
                  onClick={() => { setError(null); startCamera(); }}
                  className="w-full sm:w-auto text-[10px] font-black uppercase px-6 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-900/20"
                >
                  Coba Muat Ulang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-white/5 space-y-4 shrink-0">
          <Button 
            variant={type === AttendanceType.DATANG ? (isLate ? 'warning' : 'success') : 'danger'} 
            fullWidth 
            onClick={handleSubmit}
            disabled={!capturedImage || !location}
            className="rounded-2xl py-4 sm:py-5 font-black text-lg tracking-widest shadow-xl disabled:opacity-30 disabled:grayscale transition-all"
          >
            KIRIM PRESENSI {type} {isLate && '(TERLAMBAT)'}
          </Button>
          <p className="text-[9px] text-center text-gray-500 uppercase font-bold tracking-[0.4em]">
            E-ABSENSI SDN INDONESIA • SECURE BIOMETRIC
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
