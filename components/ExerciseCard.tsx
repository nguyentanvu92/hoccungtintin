
import React, { useState, useEffect, useCallback } from 'react';
import { Subject, Topic, Question, Difficulty, QuestionType } from '../types';

interface Props {
  subject: Subject;
  topic: Topic;
  difficulty: Difficulty;
  onScoreUpdate: (points: number, isCorrect: boolean) => void;
  onLevelComplete?: (topicId: string, score: number) => void;
  onReturnHome: () => void;
}

const ExerciseCard: React.FC<Props> = ({ subject, topic, difficulty, onScoreUpdate, onLevelComplete, onReturnHome }) => {
  const fetchQuestions = async () => {
  try {
    const res = await fetch("/api/generateQuestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: props.topic?.name || "Hóa học",
        difficulty: "Trung bình"
      })
    });

    const data = await res.json();
    console.log("Kết quả từ API:", data.text);

  } catch (error) {
    console.error("Lỗi gọi API:", error);
  }
};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setFinished(false);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setFeedback(null);
    setIsCorrect(null);
    
    // Olympia giữ 20 câu, còn lại (Thi thử, Toán, TV...) là 10 câu
    const count = subject === Subject.OLYMPIA ? 20 : 10;
    const data = await generateQuestions(subject, topic.title, difficulty, count);
    setQuestions(data);
    setLoading(false);
  }, [subject, topic.title, difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const loadCurrentImage = useCallback(async () => {
    if (questions.length > 0 && currentIndex < questions.length && !questions[currentIndex].imageUrl && questions[currentIndex].imagePrompt) {
      setIsGeneratingImage(true);
      const url = await generateImageForQuestion(questions[currentIndex].imagePrompt!);
      if (url) {
        setQuestions(prev => {
          const updated = [...prev];
          if (updated[currentIndex]) {
            updated[currentIndex].imageUrl = url;
          }
          return updated;
        });
      }
      setIsGeneratingImage(false);
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    if (!loading && questions.length > 0 && !finished) {
      loadCurrentImage();
    }
  }, [currentIndex, loading, questions.length, loadCurrentImage, finished]);

  const handleSelect = async (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option.trim().toLowerCase() === questions[currentIndex].answer.trim().toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      onScoreUpdate(10, true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      onScoreUpdate(0, false);
    }

    const fb = await getTutorFeedback(questions[currentIndex].content, option, correct);
    setFeedback(fb);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      setIsCorrect(null);
    } else {
      // Logic hoàn thành
      if (subject === Subject.OLYMPIA && correctCount >= 15) {
        onLevelComplete?.(topic.id, correctCount);
      } else if (subject !== Subject.OLYMPIA) {
        onLevelComplete?.(topic.id, correctCount);
      }
      setFinished(true);
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return 'TRẮC NGHIỆM';
      case QuestionType.FILL_IN_BLANK:
        return 'ĐIỀN VÀO CHỖ TRỐNG';
      case QuestionType.TRUE_FALSE:
        return 'ĐÚNG HAY SAI';
      default:
        return 'BÀI TẬP';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl flex flex-col items-center justify-center animate-pop border-4 border-teal-100 min-h-[400px]">
        <div className="text-6xl mb-6 bubble-float">🪄</div>
        <p className="text-xl font-black text-teal-700 animate-pulse text-center">Ba Vũ đang dùng phép thuật soạn đề theo đề cương mới cho Tin Tin...</p>
      </div>
    );
  }

  if (finished) {
    const isOlympia = subject === Subject.OLYMPIA;
    const isMock = subject === Subject.MOCK_EXAM;
    const minToPass = isOlympia ? 15 : (isMock ? 8 : 1);
    const passed = correctCount >= minToPass;

    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center animate-pop border-b-8 border-orange-200 w-full max-w-2xl mx-auto">
        <div className="text-7xl mb-6">{passed ? '🏆' : '💪'}</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          {isMock ? (passed ? 'CHÚC MỪNG CON ĐÃ VƯỢT QUA KỲ THI THỬ!' : 'CỐ GẮNG THÊM TÍ NỮA LÀ ĐƯỢC ĐIỂM 10 RỒI!') : (passed ? 'Tuyệt vời quá Tin Tin!' : 'Làm lại một chút thôi!')}
        </h2>
        
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-8 w-full">
           <p className="text-slate-700 font-bold text-xl mb-2">Kết quả của con:</p>
           <div className="text-5xl font-black text-teal-600 mb-2">{correctCount} <span className="text-2xl text-slate-400">/ {questions.length}</span></div>
           <p className="text-slate-500 font-bold">Câu trả lời đúng</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={fetchQuestions}
            className="bg-teal-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex-1"
          >
            {isMock ? 'LÀM ĐỀ THI KHÁC 📄' : 'TIẾP TỤC KHÁM PHÁ 🚀'}
          </button>
          <button 
            onClick={onReturnHome}
            className="bg-slate-100 text-slate-600 px-8 py-5 rounded-2xl font-black text-lg shadow-md active:scale-95 transition-all border-2 border-slate-200 flex-1"
          >
            QUAY VỀ TRANG CHỦ 🏠
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-b-8 border-teal-100 w-full max-w-7xl mx-auto flex flex-col">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, backgroundColor: '#14b8a6', animationDelay: `${Math.random()}s` }} />
          ))}
        </div>
      )}

      {/* Header Progress Bar */}
      <div className="p-3 bg-slate-50 border-b flex justify-between items-center px-4 md:px-8 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto max-w-[60%] py-1 no-scrollbar">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 min-w-[0.5rem] md:min-w-[1rem] rounded-full shrink-0 transition-colors ${i <= currentIndex ? 'bg-teal-500' : 'bg-slate-200'}`}></div>
          ))}
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
             <span className="text-slate-400 font-black text-[8px] uppercase block">Câu hỏi</span>
             <span className="text-slate-900 font-black text-xs md:text-sm">{currentIndex + 1} <span className="text-slate-300">/ {questions.length}</span></span>
           </div>
           <div className="h-6 w-[1px] bg-slate-200"></div>
           <div className="text-right">
             <span className="text-teal-400 font-black text-[8px] uppercase block">Đúng</span>
             <span className="text-teal-600 font-black text-xs md:text-sm">{correctCount}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0 overflow-hidden">
        
        <div className="lg:col-span-5 p-4 md:p-8 bg-slate-50/50 flex flex-col justify-center border-r border-slate-100 overflow-y-auto">
          <div className="w-full aspect-video md:aspect-[16/10] bg-white rounded-2xl shadow-inner mb-4 flex items-center justify-center overflow-hidden border-2 border-slate-100 relative group shrink-0">
            {currentQ?.imageUrl ? (
              <img src={currentQ.imageUrl} className="w-full h-full object-contain animate-pop p-2 md:p-4" alt="quest" />
            ) : isGeneratingImage ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin text-3xl">🪄</div>
                <p className="text-slate-400 font-bold text-[10px] text-center px-2">Đang vẽ hình theo đề bài...</p>
              </div>
            ) : (
              <span className="text-7xl md:text-9xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{topic.icon}</span>
            )}
          </div>
          <div className="space-y-2 md:space-y-4">
            <span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
              {currentQ ? getQuestionTypeLabel(currentQ.type) : 'BÀI TẬP'}
            </span>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-[1.2] text-center lg:text-left">
              {currentQ?.content}
            </h3>
          </div>
        </div>

        <div className="lg:col-span-7 p-4 md:p-8 flex flex-col bg-white overflow-y-auto max-h-[80vh] lg:max-h-none">
          <div className="grid grid-cols-1 gap-3 md:gap-4 flex-1">
            {currentQ?.options.map((opt, idx) => {
              let btnClass = "bg-white border-2 border-slate-100 text-slate-900 hover:border-teal-400 hover:bg-teal-50 active:scale-[0.99]";
              if (selectedOption) {
                if (opt === currentQ.answer) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-900 scale-[1.01] shadow-emerald-100 shadow-lg";
                else if (selectedOption === opt) btnClass = "bg-rose-50 border-rose-500 text-rose-900 opacity-80";
                else btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={!!selectedOption}
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 md:p-5 rounded-2xl text-left text-sm md:text-xl font-black transition-all flex items-center group shadow-sm ${btnClass}`}
                >
                  <span className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center mr-4 transition-colors shrink-0 font-black text-xs md:text-lg ${
                    selectedOption ? (opt === currentQ.answer ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400') : 'bg-slate-100 text-slate-500 group-hover:bg-teal-500 group-hover:text-white'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 break-words leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 shrink-0 min-h-[120px] flex flex-col justify-end">
            {feedback ? (
              <div className={`p-4 md:p-6 rounded-2xl border-2 animate-pop shadow-md ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex gap-4 items-start">
                  <span className="text-3xl md:text-5xl shrink-0">🧙‍♂️</span>
                  <div className="space-y-3 flex-1">
                    <p className="text-slate-900 font-bold text-xs md:text-base leading-snug">
                      {feedback}
                    </p>
                    <button
                      onClick={nextQuestion}
                      className="w-full bg-slate-900 text-white py-3 md:py-4 rounded-xl font-black text-xs md:text-lg hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                      {currentIndex === questions.length - 1 ? 'XEM KẾT QUẢ CUỐI CÙNG 🏁' : 'CÂU TIẾP THEO ➜'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-16 md:h-20 flex items-center justify-center border-4 border-dashed border-slate-100 rounded-2xl bg-teal-50/30">
                 <p className="text-teal-700 font-black text-xs md:text-lg italic animate-pulse px-4 text-center">
                   Tin Tin ơi, suy nghĩ thật kỹ nhé! ✨
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
