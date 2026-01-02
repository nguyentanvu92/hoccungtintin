import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, difficulty, type, count } = req.body;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Tạo ${count} câu hỏi môn ${subject}
Mức độ: ${difficulty}
Loại: ${type}
Trả về JSON hợp lệ.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json(JSON.parse(text));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
