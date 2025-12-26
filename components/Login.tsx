
import React, { useState } from 'react';
import { Button } from './Button';
import { Lock, User as UserIcon, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(username);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-28 h-28 mb-6 relative animate-float">
             <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
             <img 
               src="https://iili.io/fIonNl1.png" 
               alt="Logo SDN Indonesia" 
               className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
             />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white uppercase italic">
            E-Absensi
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-blue-500/50"></span>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">SD Negeri Indonesia</p>
            <span className="h-px w-8 bg-blue-500/50"></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 sm:p-10 rounded-[2.5rem] space-y-6 shadow-2xl border-white/5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Akses Pengguna</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Kunci Keamanan</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={isLoading} className="py-4 rounded-2xl shadow-blue-600/20">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} className="animate-pulse" /> Memverifikasi...
                </span>
              ) : 'Masuk ke Sistem'}
            </Button>
          </div>
        </form>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2024 SD NEGERI INDONESIA
          </p>
          <p className="text-[9px] text-slate-700 mt-2 font-medium">Layanan Digital Pendidikan Terpadu</p>
        </div>
      </div>
    </div>
  );
};