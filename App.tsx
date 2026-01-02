
import React, { useState, useEffect, useRef } from 'react';
import { Subject, Topic, User, UserRole, Difficulty } from './types';
import { 
  MATH_TOPICS, 
  VIETNAMESE_TOPICS, 
  ETHICS_TOPICS, 
  NATURE_SOCIETY_TOPICS, 
  MUSIC_TOPICS, 
  ARTS_TOPICS, 
  EXPERIENTIAL_TOPICS, 
  ENGLISH_TOPICS,
  OLYMPIA_TOPICS,
  MOCK_EXAM_TOPICS
} from './constants';
import SubjectSelector from './components/SubjectSelector';
import TopicSelector from './components/TopicSelector';
import ExerciseCard from './components/ExerciseCard';
import TutorAI from './components/TutorAI';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import DifficultySelector from './components/DifficultySelector';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tintin_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Khởi tạo audio
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tintin_current_user', JSON.stringify(user));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tintin_current_user');
    setIsAdminView(false);
    setCurrentSubject(null);
    setCurrentTopic(null);
    setCurrentDifficulty(null);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Cần tương tác để phát nhạc"));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleSubjectSelect = (subject: Subject) => {
    setCurrentSubject(subject);
    setCurrentTopic(null);
    setCurrentDifficulty(null);
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setCurrentTopic(topic);
    // Nếu là Olympia hoặc Mock Exam, mặc định độ khó là MEDIUM và bắt đầu luôn
    if (currentSubject === Subject.OLYMPIA || currentSubject === Subject.MOCK_EXAM) {
      setCurrentDifficulty(Difficulty.MEDIUM);
    } else {
      setCurrentDifficulty(null);
    }
  };

  const handleDifficultySelect = (level: Difficulty) => {
    setCurrentDifficulty(level);
  };

  const handleBack = () => {
    if (currentDifficulty && currentSubject !== Subject.OLYMPIA && currentSubject !== Subject.MOCK_EXAM) {
      setCurrentDifficulty(null);
    } else if (currentTopic) {
      setCurrentTopic(null);
    } else {
      setCurrentSubject(null);
    }
  };

  const handleReturnHome = () => {
    setCurrentSubject(null);
    setCurrentTopic(null);
    setCurrentDifficulty(null);
  };

  const updateScore = (points: number, isCorrect: boolean) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      score: currentUser.score + points,
      streak: isCorrect ? currentUser.streak + 1 : 0
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('tintin_current_user', JSON.stringify(updatedUser));
    
    // Update in global users list
    const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { ...savedUsers[userIndex], score: updatedUser.score, streak: updatedUser.streak };
      localStorage.setItem('tintin_users', JSON.stringify(savedUsers));
    }
  };

  const handleLevelComplete = (topicId: string, correctCount: number) => {
    if (!currentUser) return;
    
    // Chỉ đánh dấu hoàn thành nếu là Olympia và đúng >= 15, hoặc các môn khác
    const isSpecial = currentSubject === Subject.OLYMPIA || currentSubject === Subject.MOCK_EXAM;
    if (currentSubject === Subject.OLYMPIA && correctCount < 15) return;

    if (!currentUser.completedTopics.includes(topicId)) {
      const updatedUser = {
        ...currentUser,
        completedTopics: [...currentUser.completedTopics, topicId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('tintin_current_user', JSON.stringify(updatedUser));

      // Update global users list
      const savedUsers = JSON.parse(localStorage.getItem('tintin_users') || '[]');
      const userIndex = savedUsers.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        savedUsers[userIndex].completedTopics = updatedUser.completedTopics;
        localStorage.setItem('tintin_users', JSON.stringify(savedUsers));
      }
    }
  };

  const getTopicsBySubject = (subject: Subject): Topic[] => {
    switch(subject) {
      case Subject.MATH: return MATH_TOPICS;
      case Subject.VIETNAMESE: return VIETNAMESE_TOPICS;
      case Subject.ETHICS: return ETHICS_TOPICS;
      case Subject.NATURE_SOCIETY: return NATURE_SOCIETY_TOPICS;
      case Subject.MUSIC: return MUSIC_TOPICS;
      case Subject.ARTS: return ARTS_TOPICS;
      case Subject.EXPERIENTIAL: return EXPERIENTIAL_TOPICS;
      case Subject.ENGLISH: return ENGLISH_TOPICS;
      case Subject.OLYMPIA: return OLYMPIA_TOPICS;
      case Subject.MOCK_EXAM: return MOCK_EXAM_TOPICS;
      default: return [];
    }
  };

  if (isAdminView && currentUser?.role === UserRole.ADMIN) {
    return (
      <div className="min-h-screen bg-indigo-50">
        <AdminDashboard onBack={() => setIsAdminView(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center p-2 sm:p-4 md:p-6 pb-20 md:pb-24">
      {/* Header */}
      <header className="w-full max-w-[1600px] flex justify-between items-center mb-4 md:mb-6 bg-white p-3 md:p-5 rounded-2xl md:rounded-[2rem] shadow-sm border-b-4 border-teal-200">
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={handleReturnHome}>
          <span className="text-2xl md:text-4xl">🎒</span>
          <h1 className="text-base md:text-2xl font-black text-teal-600 tracking-tight whitespace-nowrap">Học cùng Tin Tin!</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="hidden sm:flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-xl font-black text-xs shadow-md hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all border-b-4 border-yellow-600"
          >
            <span>🏆</span> BẢNG VÀNG
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 md:gap-4">
               {currentUser.role === UserRole.ADMIN && (
                 <button 
                  onClick={() => setIsAdminView(true)}
                  className="bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-[10px] md:text-xs hover:bg-indigo-200 transition-all border-2 border-indigo-200"
                 >
                   QUẢN TRỊ 🔮
                 </button>
               )}
               
               <div className="flex gap-1 md:gap-2">
                <div className="flex items-center bg-yellow-100 px-2 md:px-4 py-1.5 rounded-lg md:rounded-xl border border-yellow-200 shadow-sm">
                  <span className="mr-1 text-base">⭐</span>
                  <span className="font-black text-yellow-700 text-xs md:text-sm">{currentUser.score}</span>
                </div>
                <div className="hidden sm:flex items-center bg-orange-100 px-2 md:px-4 py-1.5 rounded-lg md:rounded-xl border border-orange-200 shadow-sm">
                  <span className="mr-1 text-base">🔥</span>
                  <span className="font-black text-orange-700 text-xs md:text-sm">{currentUser.streak}</span>
                </div>
              </div>

              <div className="group relative">
                <button className="w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-full border-2 border-teal-300 flex items-center justify-center text-lg md:text-xl shadow-sm">
                  🧒
                </button>
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl p-4 border-2 border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto min-w-[180px] z-50">
                  <p className="font-black text-slate-800 text-base mb-1">{currentUser.displayName}</p>
                  <p className="text-slate-400 font-bold text-[10px] mb-3 uppercase tracking-widest">@{currentUser.username}</p>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-rose-50 text-rose-600 py-2 rounded-lg font-bold text-xs hover:bg-rose-100 transition-all"
                  >
                    Đăng Xuất 🚪
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-xl font-black text-xs md:text-base shadow-lg hover:bg-teal-700 active:scale-95 transition-all"
            >
              ĐĂNG NHẬP 🚀
            </button>
          )}

          <button 
            onClick={toggleMusic}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl transition-all shadow-sm border-2 ${isMusicPlaying ? 'bg-teal-100 border-teal-300 text-teal-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
          >
            {isMusicPlaying ? '🎵' : '🔇'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`w-full flex-1 flex flex-col gap-4 ${currentSubject ? 'max-w-7xl' : 'max-w-[1600px]'}`}>
        {!currentSubject && (
          <SubjectSelector onSelect={handleSubjectSelect} />
        )}

        {currentSubject && !currentTopic && (
          <div className="animate-fade-in w-full mx-auto px-2">
            <button 
              onClick={handleBack}
              className="mb-3 md:mb-4 text-teal-600 font-bold flex items-center hover:underline text-sm md:text-lg"
            >
              <span className="mr-2 text-lg md:text-xl">←</span> Quay lại chọn môn học
            </button>
            <TopicSelector 
              topics={getTopicsBySubject(currentSubject)} 
              subject={currentSubject}
              currentUser={currentUser}
              onSelect={handleTopicSelect} 
            />
          </div>
        )}

        {currentTopic && !currentDifficulty && (
          <div className="animate-fade-in w-full mx-auto px-2">
            <DifficultySelector 
              topicTitle={currentTopic.title}
              onSelect={handleDifficultySelect}
              onBack={handleBack}
            />
          </div>
        )}

        {currentDifficulty && currentTopic && (
          <div className="animate-fade-in w-full mx-auto px-2">
            <button 
              onClick={handleBack}
              className="mb-2 md:mb-3 text-teal-600 font-bold flex items-center hover:underline text-sm md:text-lg"
            >
              <span className="mr-2 text-lg md:text-xl">←</span> Quay lại
            </button>
            <ExerciseCard 
              subject={currentSubject!} 
              topic={currentTopic} 
              difficulty={currentDifficulty}
              onScoreUpdate={updateScore}
              onLevelComplete={handleLevelComplete}
              onReturnHome={handleReturnHome}
            />
          </div>
        )}
      </main>

      {/* Persistent Tutor AI Component */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <TutorAI />
      </div>

      <footer className="mt-8 md:mt-12 mb-6 text-teal-600 text-lg md:text-4xl font-black italic text-center drop-shadow-sm animate-pulse px-4 leading-tight">
        "Học mà chơi, chơi mà học cùng Ba Vũ Phù Thủy! ✨🪄"
      </footer>

      {showAuth && <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />}
      {showLeaderboard && <Leaderboard currentUserId={currentUser?.id} onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
};

export default App;
