import { Question, Subject, Difficulty, QuestionType } from '../types';

export async function generateQuestion(
  subject: Subject,
  difficulty: Difficulty,
  type: QuestionType
): Promise<Question> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject,
      difficulty,
      type,
    }),
  });

  if (!res.ok) {
    throw new Error('Gemini API failed');
  }

  return await res.json();
}
