
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Difficulty, QuestionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSubjectName = (subject: Subject): string => {
  switch(subject) {
    case Subject.MATH: return 'Toán học';
    case Subject.VIETNAMESE: return 'Tiếng Việt';
    case Subject.ETHICS: return 'Đạo đức';
    case Subject.NATURE_SOCIETY: return 'Tự nhiên và Xã hội';
    case Subject.MUSIC: return 'Âm nhạc';
    case Subject.ARTS: return 'Mỹ thuật';
    case Subject.EXPERIENTIAL: return 'Hoạt động trải nghiệm';
    case Subject.ENGLISH: return 'Tiếng Anh';
    case Subject.OLYMPIA: return 'Đường lên đỉnh Olympia nhí (Tổng hợp)';
    case Subject.MOCK_EXAM: return 'Đề Thi Thử Học Kỳ I (Toán & Tiếng Việt tổng hợp)';
    default: return '';
  }
};

export async function generateQuestions(subject: Subject, topicTitle: string, difficulty: Difficulty = Difficulty.EASY, count: number = 10): Promise<Question[]> {
  const subjectName = getSubjectName(subject);
  const randomSalt = Math.random().toString(36).substring(7);
  
  // Logic bám sát nội dung PDF người dùng cung cấp
  const grade1KnowledgeBase = `
  DỰA TRÊN ĐỀ CƯƠNG ÔN TẬP LỚP 1 HỌC KỲ I:
  1. TOÁN HỌC:
     - Số học: Đếm, đọc, viết số phạm vi 10. So sánh (lớn nhất, bé nhất). Xếp thứ tự. 
     - Phép tính: Cộng trừ phạm vi 10, cộng trừ với số 0. Phép tính 3 thành phần (A + B + C = D). Tìm số thiếu trong ô trống (A + ? = B).
     - Hình học: Nhận dạng Khối lập phương, Khối hộp chữ nhật. ĐẶC BIỆT: Đếm số khối lập phương trong hình 3D xếp chồng.
     - Dãy số: Điền số còn thiếu vào dãy (0, 2, 4... hoặc 10, 8, 6...).
     - Nhìn hình viết phép tính: Ví dụ hình có 9 quả cam, gạch đi 4 quả -> Phép tính 9 - 4 = 5.
  2. TIẾNG VIỆT:
     - Chính tả: Phân biệt c/k (k đi với i, e, ê), g/gh, ng/ngh.
     - Vần khó: ip, âm, ươn, et, ăng, uôc, uôt, uôn, uông, iêng, ươp, at, ang, ăn...
     - Nối câu: Nối cụm từ Cột A với Cột B để tạo câu có nghĩa (Ví dụ: "Bông lúa" - "chín vàng", "Bố đóng" - "bàn ghế", "Ngựa phi" - "tung bờm").
     - Đọc hiểu: Trả lời câu hỏi về đoạn văn ngắn (như bài về 'Sở thú' hay 'Lan về quê thăm bà').
  `;

  let prompt = `Bạn là Ba Vũ Phù Thủy soạn đề thi cho Tin Tin. Hãy tạo ${count} câu hỏi trắc nghiệm.
  Môn: ${subjectName}. Chủ đề cụ thể: "${topicTitle}".
  Yêu cầu kiến thức: ${grade1KnowledgeBase}
  Mã phiên bản: ${randomSalt}

  QUY TẮC RIÊNG CHO TỪNG LOẠI:
  - Nếu là bài Nối câu: Trong 'content' hãy ghi "Nối cụm từ đúng:", 'options' là các cặp nối tiềm năng, 'answer' là đáp án đúng duy nhất.
  - Nếu là bài Đếm khối: 'content' ghi "Trong hình có bao nhiêu khối lập phương?", 'imagePrompt' phải mô tả cụ thể một cấu trúc khối xếp chồng 3D Pixar style.
  - Giải thích (explanation): Luôn bắt đầu bằng "Tin Tin ơi, ..." và giải thích theo cách dạy trẻ lớp 1.

  Cấu trúc JSON: [{id, type, content, options, answer, explanation, imagePrompt}]`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.8,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.FILL_IN_BLANK] },
            content: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["id", "type", "content", "options", "answer", "explanation", "imagePrompt"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text);
    return questions.map((q: any) => ({
      ...q,
      options: q.options.slice(0, 4)
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

export async function generateImageForQuestion(imagePrompt: string): Promise<string | undefined> {
  try {
    const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiImage.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt + ". Educational illustration for 6 year old child, simple, clear, white background, 3D clay style." }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
  return undefined;
}

export async function getTutorFeedback(question: string, userAnswer: string, isCorrect: boolean): Promise<string> {
  const prompt = `Câu hỏi: "${question}". Tin Tin trả lời: "${userAnswer}". Kết quả: ${isCorrect ? 'ĐÚNG' : 'SAI'}.
  Phản hồi với tư cách Ba Vũ Phù Thủy, ngắn gọn, khích lệ và dùng ngôn ngữ trẻ thơ lớp 1.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "Bạn là Ba Vũ, người cha phù thủy vui tính đang dạy con trai Tin Tin học bài.",
      temperature: 0.8
    }
  });

  return response.text || "Ba Vũ luôn bên con! ✨";
}
