
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { TUTOR_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const TutorAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'tutor', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (event: any) => setMessage(event.results[0][0].transcript);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const playMagicalVoice = async (text: string) => {
    if (!text) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    } catch (err) {
      console.error("Voice error:", err);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...chatHistory.slice(-4).map(m => (m.role === 'user' ? { role: 'user', parts: [{text: m.text}] } : { role: 'model', parts: [{text: m.text}] })), 
          { role: 'user', parts: [{text: userMsg}] }
        ],
        config: { 
          systemInstruction: TUTOR_PROMPT,
          temperature: 0.3, // Tăng nhẹ để câu trả lời tự nhiên và giàu thông tin hơn
        }
      });
      
      const tutorText = response.text || "Ba Vũ đang lắng nghe đây!";
      setChatHistory(prev => [...prev, { role: 'tutor', text: tutorText }]);
      playMagicalVoice(tutorText);
      
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'tutor', text: "Hết phép thuật rồi, chờ Ba Vũ tí nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[calc(100vw-2rem)] sm:w-96 h-[500px] mb-4 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-teal-500 animate-pop">
          <div className="bg-teal-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧙‍♂️</span>
              <span className="font-black text-sm">Ba Vũ Phù Thủy Tận Tâm</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-black/20 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-bl-none bg-white text-slate-900 shadow-sm border border-slate-200 text-sm font-bold leading-relaxed">
                Chào Tin Tin! Ba Vũ đã sẵn sàng giúp con học giỏi hơn đây! Con có thắc mắc gì cứ hỏi Ba nhé! 🪄
              </div>
            </div>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm font-bold leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl shadow-sm italic text-teal-600 font-black text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                  Ba Vũ đang suy nghĩ câu trả lời hay nhất...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Ba đang nghe..." : "Nhắn cho Ba Vũ..."}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-500 font-bold text-sm outline-none focus:border-teal-500 transition-all"
                />
                <button 
                  onClick={() => isListening ? recognitionRef.current.stop() : recognitionRef.current.start()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}
                >
                  {isListening ? '🛑' : '🎙️'}
                </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="bg-teal-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md active:scale-90 disabled:opacity-30 transition-all shrink-0"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-teal-500 rounded-full shadow-xl flex items-center justify-center text-4xl hover:scale-110 active:scale-90 transition-all border-4 border-white bubble-float relative"
      >
        <span>🧙‍♂️</span>
        {!isOpen && <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white animate-bounce shadow-sm">HỎI BA</div>}
      </button>
    </div>
  );
};

export default TutorAI;
