
import React from 'react';
import { Subject } from '../types';
import { SUBJECT_CONFIG } from '../constants';

interface Props {
  onSelect: (subject: Subject) => void;
}

const SubjectSelector: React.FC<Props> = ({ onSelect }) => {
  const getColorHex = (colorName: string) => {
    const colors: Record<string, string> = {
      blue: '#1d4ed8',
      pink: '#be185d',
      yellow: '#a16207',
      emerald: '#047857',
      orange: '#c2410c',
      teal: '#0f766e',
      violet: '#6d28d9',
      rose: '#be123c'
    };
    return colors[colorName] || '#0d9488';
  };

  return (
    <div className="w-full mt-2 md:mt-4">
      <div className="text-center mb-10 md:mb-16 animate-pop px-4">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tight text-slate-900">
          Lớp học của Tin Tin ✨
        </h2>
        <p className="text-teal-700 font-black text-lg sm:text-2xl italic max-w-5xl mx-auto">
          "Chọn phép thuật để bắt đầu khám phá cùng Ba Vũ con nhé!"
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8">
        {SUBJECT_CONFIG.map((sub, index) => (
          <button 
            key={sub.type}
            onClick={() => onSelect(sub.type)}
            className="group relative bg-white p-8 rounded-[3rem] shadow-xl border-b-[12px] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center border border-teal-50"
            style={{ 
              borderBottomColor: getColorHex(sub.color),
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-4 shadow-inner bg-slate-50">
              {sub.icon}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {sub.label}
            </h3>
            
            <p className="text-sm font-black text-center leading-relaxed text-slate-700">
              {sub.desc}
            </p>
            
            <div className="mt-6 text-teal-600 font-black text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all uppercase">
              BẮT ĐẦU ✨
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
