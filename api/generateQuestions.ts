import { GoogleGenerativeAI } from "@google/genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: any, res: any) {
  try {
    const { topic, difficulty } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
Tạo 5 câu hỏi trắc nghiệm
Chủ đề: ${topic}
Độ khó: ${difficulty}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Gemini error" });
  }
}
