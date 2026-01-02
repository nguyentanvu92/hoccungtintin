
import React from 'react';
import { Topic, Subject, User } from '../types';

interface Props {
  topics: Topic[];
  subject: Subject | null;
  currentUser: User | null;
  onSelect: (topic: Topic) => void;
}

const TopicSelector: React.FC<Props> = ({ topics, subject, currentUser, onSelect }) => {
  
  const isTopicLocked = (topic: Topic, index: number) => {
    if (subject !== Subject.OLYMPIA) return false;
    if (index === 0) return false; // Level 1 luôn mở
    
    // Kiểm tra xem Level trước đó đã hoàn thành chưa
    const prevTopic = topics[index - 1];
    return !currentUser?.completedTopics.includes(prevTopic.id);
  };

  return (
    <div className="space-y-6 w-full animate-pop">
      <div className="flex items-center gap-3 border-l-4 border-teal-500 pl-4 mb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {subject === Subject.OLYMPIA ? 'Hành trình leo núi của Tin Tin:' : 'Bài học hôm nay:'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic, index) => {
          const locked = isTopicLocked(topic, index);
          
          return (
            <button
              key={topic.id}
              disabled={locked}
              onClick={() => onSelect(topic)}
              className={`group flex items-center p-6 bg-white rounded-[2rem] shadow-lg border-b-4 transition-all duration-300 text-left active:scale-[0.98] ${
                locked 
                  ? 'opacity-60 cursor-not-allowed border-slate-200 grayscale' 
                  : 'hover:border-teal-400 hover:shadow-teal-100 hover:shadow-xl border-slate-100'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 ${topic.color} rounded-2xl flex items-center justify-center text-4xl shadow-md ${!locked && 'group-hover:scale-110'} transition-transform relative`}>
                {topic.icon}
                {locked && <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center text-xl">🔒</div>}
              </div>
              
              <div className="ml-6 flex-1">
                <span className={`block text-xl font-bold ${locked ? 'text-slate-400' : 'text-slate-800 group-hover:text-teal-600'} transition-colors`}>
                  {topic.title}
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  {locked ? 'Hoàn thành Level trước để mở khóa nhé!' : 'Bấm để bắt đầu luyện tập ✨'}
                </span>
              </div>
              
              {!locked && (
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-teal-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  <span className="text-2xl">➜</span>
                </div>
              )}
              
              {currentUser?.completedTopics.includes(topic.id) && (
                <div className="ml-4 w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl shadow-inner border border-emerald-200">
                  ✅
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelector;
