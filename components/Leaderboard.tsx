
import React, { useEffect, useState } from 'react';
import { User } from '../types';

interface Props {
  currentUserId?: string;
  onClose: () => void;
}

const Leaderboard: React.FC<Props> = ({ currentUserId, onClose }) => {
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
    // Sắp xếp theo điểm giảm dần và lấy top 10
    const sorted = [...savedUsers].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);
    setTopUsers(sorted);
  }, []);

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 1: return 'bg-slate-100 border-slate-300 text-slate-600';
      case 2: return 'bg-orange-100 border-orange-300 text-orange-700';
      default: return 'bg-white border-slate-100 text-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-4 border-yellow-400 animate-pop relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 p-8 text-white text-center relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          <h2 className="text-3xl md:text-4xl font-black relative z-10 flex items-center justify-center gap-3">
            <span className="animate-bounce">🏆</span> Bảng Vàng Phù Thủy
          </h2>
          <p className="opacity-90 relative z-10 text-sm md:text-base font-bold mt-2">Vinh danh những phù thủy nhí xuất sắc nhất!</p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
          {topUsers.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-6xl block mb-4">🪄</span>
              <p className="text-slate-400 font-bold italic text-lg">Đang chờ những nhà kiến thức đầu tiên...</p>
            </div>
          ) : (
            topUsers.map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center p-4 md:p-5 rounded-2xl md:rounded-[2rem] border-2 transition-all hover:scale-[1.02] shadow-sm ${getRankColor(index)} ${user.id === currentUserId ? 'ring-4 ring-teal-400/30 ring-offset-2' : ''}`}
              >
                <div className="w-10 md:w-14 flex-shrink-0 text-xl md:text-3xl font-black text-center">
                  {getMedal(index) || `#${index + 1}`}
                </div>
                
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl mr-4 md:mr-6 border border-white shadow-inner">
                  🧒
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base md:text-xl truncate flex items-center gap-2">
                    {user.displayName}
                    {user.id === currentUserId && (
                      <span className="text-[8px] md:text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Bạn</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-xs md:text-sm font-bold opacity-70">
                    <span className="flex items-center gap-1">🔥 {user.streak || 0} chuỗi</span>
                    <span className="hidden md:inline">•</span>
                    <span className="truncate">@{user.username}</span>
                  </div>
                </div>

                <div className="text-right ml-2">
                  <span className="block text-xl md:text-3xl font-black">{user.score}</span>
                  <span className="text-[10px] md:text-xs font-black uppercase opacity-60 tracking-widest">Sao ⭐</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-slate-50 border-t-2 border-slate-100 flex-shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 text-white py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] font-black text-lg md:text-xl shadow-xl hover:bg-slate-900 active:scale-95 transition-all"
          >
            QUAY LẠI LỚP HỌC 🎒
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
