
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface Props {
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
    setUsers(savedUsers);
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (window.confirm(`Ba Vũ có chắc chắn muốn xóa phù thủy nhí "${username}" khỏi lớp học không? 🪄`)) {
      const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
      const filteredUsers = savedUsers.filter((u: any) => u.id !== userId);
      localStorage.setItem('tintin_users', JSON.stringify(filteredUsers));
      setUsers(filteredUsers);
      showNotify(`Đã xóa phù thủy nhí ${username}!`);
    }
  };

  const handleResetScore = (userId: string, username: string) => {
    if (window.confirm(`Ba Vũ muốn reset điểm của "${username}" về 0 để con luyện tập lại từ đầu chứ? ⭐`)) {
      const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
      const userIndex = savedUsers.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        savedUsers[userIndex].score = 0;
        savedUsers[userIndex].streak = 0;
        localStorage.setItem('tintin_users', JSON.stringify(savedUsers));
        setUsers([...savedUsers]);
        showNotify(`Đã reset điểm cho ${username}!`);
      }
    }
  };

  const totalScore = users.reduce((acc, u) => acc + (u.score || 0), 0);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 animate-pop relative">
      {notification && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[150] px-8 py-4 rounded-2xl shadow-2xl font-black text-white animate-pop border-2 ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-rose-500 border-rose-400'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-indigo-900 mb-2">Vùng Quản Trị Phép Thuật 🔮</h2>
          <p className="text-indigo-600 font-bold text-xl italic">Nơi Ba Vũ quản lý lớp học của các con</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-white border-4 border-indigo-100 text-indigo-600 px-8 py-4 rounded-3xl font-black hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-lg"
        >
          <span>←</span> Quay Lại Lớp Học
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-indigo-100 flex flex-col items-center">
          <span className="text-5xl mb-4">🧙‍♂️</span>
          <span className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Tổng Phù Thủy Nhí</span>
          <span className="text-5xl font-black text-indigo-600">{users.length}</span>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-yellow-100 flex flex-col items-center">
          <span className="text-5xl mb-4">⭐</span>
          <span className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Tổng Sao Tích Lũy</span>
          <span className="text-5xl font-black text-yellow-500">{totalScore}</span>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-emerald-100 flex flex-col items-center">
          <span className="text-5xl mb-4">🔥</span>
          <span className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Kỷ Lục Chuỗi Đúng</span>
          <span className="text-5xl font-black text-emerald-500">
            {users.length > 0 ? Math.max(...users.map(u => u.streak || 0), 0) : 0}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-slate-100">
        <div className="bg-slate-50 p-8 border-b-2 border-slate-100 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800">Danh Sách Học Sinh</h3>
          <span className="text-slate-400 font-bold">Thao tác quản trị trực tiếp 🪄</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black uppercase text-xs tracking-widest border-b">
                <th className="px-8 py-6">Tên Hiển Thị</th>
                <th className="px-8 py-6">Tên Đăng Nhập</th>
                <th className="px-8 py-6">Vai Trò</th>
                <th className="px-8 py-6 text-center">Điểm Số</th>
                <th className="px-8 py-6 text-center">Chuỗi</th>
                <th className="px-8 py-6 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic text-xl">
                    Chưa có phù thủy nhí nào đăng ký lớp học này...
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-lg">🧒</div>
                        <span className="font-bold text-slate-800">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-500">@{user.username}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        user.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-yellow-600">{user.score || 0} ⭐</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-orange-500">{user.streak || 0} 🔥</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => handleResetScore(user.id, user.displayName)}
                          className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all shadow-sm"
                          title="Reset điểm số"
                        >
                          🔄
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.displayName)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Xóa người dùng"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-12 p-8 bg-indigo-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h4 className="text-2xl font-black mb-4 relative z-10">Mẹo nhỏ cho Ba Vũ Phù Thủy 🪄</h4>
        <ul className="space-y-3 opacity-80 font-bold relative z-10">
          <li>• Tài khoản quản trị mặc định (admin/Tintin@19) luôn có toàn quyền.</li>
          <li>• Phép thuật "Reset điểm" giúp Tin Tin học lại một chủ đề nếu con chưa nắm vững.</li>
          <li>• Hãy thường xuyên kiểm tra bảng xếp hạng để khen ngợi Tin Tin nhé!</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
