import React, { useState, useRef, useEffect } from 'react';
import { TUTOR_PROMPT } from '../constants';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

type ChatMsg = {
  role: 'user' | 'tutor';
  text: string;
};

/* =========================
   GỌI API NỘI BỘ (AN TOÀN)
========================= */
async function askTutor(prompt: string, history: ChatMsg[]) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      history,
      systemPrompt: TUTOR_PROMPT,
    }),
  });

  if (!res.ok) {
    throw new Error('Tutor AI failed');
  }

  return res.json() as Promise<{ text: string }>;
}

const TutorAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  /* =========================
     SPEECH TO TEXT (WEB API)
  ========================= */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = 'vi-VN';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e: any) => {
      setMessage(e.results[0][0].transcript);
    };

    recognitionRef.current = rec;
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userText = message;
    setMessage('');
    setIsLoading(true);

    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const { text } = await askTutor(
        userText,
        chatHistory.slice(-4) // giữ ngữ cảnh ngắn
      );

      setChatHistory(prev => [...prev, { role: 'tutor', text }]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { role: 'tutor', text: 'Ba Vũ hơi mệt rồi, con thử hỏi lại nhé 🪄' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[calc(100vw-2rem)] sm:w-96 h-[500px] mb-4 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-teal-500">
          {/* HEADER */}
          <div className="bg-teal-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧙‍♂️</span>
              <span className="font-black text-sm">
                Ba Vũ – Phù Thủy Học Tập
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-black/20 w-8 h-8 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* CHAT */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-bl-none bg-white text-slate-900 shadow-sm border text-sm font-bold">
                Chào Tin Tin! Ba Vũ luôn ở đây để giúp con học tốt hơn 🪄
              </div>
            </div>

            {chatHistory.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm font-bold ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 rounded-bl-none border'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="italic text-teal-600 font-bold text-xs">
                Ba Vũ đang suy nghĩ phép thuật hay nhất...
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={
                    isListening ? 'Ba đang nghe...' : 'Hỏi Ba Vũ điều con thắc mắc'
                  }
                  className="w-full bg-slate-100 border-2 rounded-xl px-4 py-3 text-sm font-bold"
                />
                <button
                  onClick={() =>
                    isListening
                      ? recognitionRef.current?.stop()
                      : recognitionRef.current?.start()
                  }
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg ${
                    isListening ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                >
                  🎙️
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-teal-600 text-white w-12 h-12 rounded-xl"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-teal-500 rounded-full shadow-xl text-4xl border-4 border-white"
      >
        🧙‍♂️
      </button>
    </div>
  );
};

export default TutorAI;
