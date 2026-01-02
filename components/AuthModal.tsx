
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && !displayName)) {
      setError('Điền đầy đủ thông tin con nhé!');
      return;
    }

    if (isLogin && username === 'admin' && password === 'Tintin@19') {
      const adminUser: User = {
        id: 'admin-hardcoded',
        username: 'admin',
        displayName: 'Ba Vũ Phù Thủy (Quản trị)',
        role: UserRole.ADMIN,
        score: 9999,
        streak: 99,
        completedTopics: []
      };
      onLogin(adminUser);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');

    if (isLogin) {
      const user = savedUsers.find((u: any) => u.username === username && u.password === password);
      if (user) {
        onLogin({
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          role: user.role,
          score: user.score || 0,
          streak: user.streak || 0,
          completedTopics: user.completedTopics || []
        });
      } else {
        setError('Tên phù thủy hoặc mật mã chưa đúng!');
      }
    } else {
      if (savedUsers.some((u: any) => u.username === username) || username === 'admin') {
        setError('Tên này đã có người dùng rồi!');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        displayName,
        role: UserRole.STUDENT,
        score: 0,
        streak: 0,
        completedTopics: []
      };

      savedUsers.push(newUser);
      localStorage.setItem('tintin_users', JSON.stringify(savedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-4 border-teal-500 animate-pop relative">
        <div className="bg-teal-600 p-8 text-white text-center">
           <h2 className="text-3xl font-black">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
           <p className="text-sm mt-2 font-bold">{isLogin ? 'Chào mừng Tin Tin quay lại!' : 'Bắt đầu hành trình cùng Ba Vũ!'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-sm font-black border-2 border-rose-200 animate-shake">
              ⚠️ {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-slate-900 font-black mb-2 ml-2">Tên của con:</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-black text-slate-900 placeholder:text-slate-400"
                placeholder="Ví dụ: Tin Tin"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-900 font-black mb-2 ml-2">Tên đăng nhập:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-black text-slate-900 placeholder:text-slate-400"
              placeholder="Tên phù thủy"
            />
          </div>

          <div>
            <label className="block text-slate-900 font-black mb-2 ml-2">Mật mã bí mật:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-6 py-4 focus:border-teal-500 outline-none font-black text-slate-900 placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95">
            {isLogin ? 'VÀO HỌC NGAY 🚀' : 'TẠO TÀI KHOẢN ✨'}
          </button>

          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-teal-700 font-black hover:underline">
            {isLogin ? 'Chưa có tài khoản? Đăng ký!' : 'Đã có tài khoản? Đăng nhập!'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
