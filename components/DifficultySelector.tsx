
import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTY_CONFIG } from '../constants';

interface Props {
  onSelect: (level: Difficulty) => void;
  onBack: () => void;
  topicTitle: string;
}

const DifficultySelector: React.FC<Props> = ({ onSelect, onBack, topicTitle }) => {
  return (
    <div className="w-full animate-pop space-y-8">
      <div className="text-center px-4">
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-2">
          Chọn thử thách cho bài <span className="text-teal-600">"{topicTitle}"</span>
        </h2>
        <p className="text-slate-500 font-bold italic">Tin Tin muốn thử sức ở mức độ nào?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DIFFICULTY_CONFIG.map((cfg) => (
          <button
            key={cfg.level}
            onClick={() => onSelect(cfg.level)}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-slate-100 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cfg.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="text-6xl mb-6 filter drop-shadow-md group-hover:scale-110 transition-transform">
              {cfg.icon}
            </div>
            
            <div className="text-center relative z-10">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                {cfg.subLabel}
              </span>
              <h3 className={`text-2xl font-black mb-3 bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}>
                {cfg.label}
              </h3>
              <p className="text-sm font-bold text-slate-500 leading-relaxed">
                {cfg.desc}
              </p>
            </div>

            <div className={`mt-8 w-12 h-12 rounded-full bg-gradient-to-r ${cfg.color} flex items-center justify-center text-white text-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0`}>
              ➜
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-teal-600 transition-colors flex items-center gap-2"
        >
          <span>←</span> Quay lại chọn chủ đề
        </button>
      </div>
    </div>
  );
};

export default DifficultySelector;
