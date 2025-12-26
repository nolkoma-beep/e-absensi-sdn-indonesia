
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceType, AttendanceLocation } from './types';
import { MOCK_USER, INITIAL_HISTORY } from './constants';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'beranda' | 'riwayat' | 'profil'>('beranda');

  useEffect(() => {
    // Merge initial history with user NIP if missing
    const enrichedHistory = INITIAL_HISTORY.map(h => ({
      ...h,
      userNip: h.userId === '1' ? MOCK_USER.nip : '19800000 000000 0 000'
    }));
    setHistory(enrichedHistory);
  }, []);

  const handleLogin = (username: string) => {
    if (username.length > 0) {
      setUser(MOCK_USER);
    }
  };

  const handleLogout = () => {
    // Menghapus confirm() native untuk menghilangkan hambatan saat logout
    setUser(null);
    setActiveTab('beranda');
  };

  const handleAbsen = (type: AttendanceType, note?: string, location?: AttendanceLocation, photoData?: string) => {
    if (!user) return;
    
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userNip: user.nip,
      type,
      timestamp: new Date(),
      note,
      location,
      photoData
    };

    setHistory(prev => [newRecord, ...prev]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
        {activeTab === 'beranda' && (
          <Dashboard user={user} onAbsen={handleAbsen} onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'riwayat' && (
          <HistoryView history={history} />
        )}
        {activeTab === 'profil' && (
          <ProfileView user={user} onLogout={handleLogout} />
        )}
      </div>
    </Layout>
  );
};

export default App;
