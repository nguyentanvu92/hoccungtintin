import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, history, systemPrompt } = req.body;

    const contents = [
      ...(history || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    res.status(200).json({
      text: result.text || 'Ba Vũ đang suy nghĩ tiếp 🪄',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gemini API failed' });
  }
}
