import { Question, Subject, Difficulty, QuestionType } from "../types";

export async function generateQuestions(params: {
  subject: Subject;
  difficulty: Difficulty;
  type: QuestionType;
  count: number;
}): Promise<Question[]> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error("Failed to generate questions");
  }

  return res.json();
}
