import React, { useEffect, useState, useCallback } from 'react';
import { Subject, Topic, Question, Difficulty, QuestionType } from '../types';

interface Props {
  subject: Subject;
  topic: Topic;
  difficulty: Difficulty;
  onScoreUpdate: (points: number, isCorrect: boolean) => void;
  onLevelComplete?: (topicId: string, score: number) => void;
  onReturnHome: () => void;
}

const ExerciseCard: React.FC<Props> = ({
  subject,
  topic,
  difficulty,
  onScoreUpdate,
  onLevelComplete,
  onReturnHome
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  // ✅ CHỈ CÒN 1 HÀM DUY NHẤT
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setFinished(false);
    setCurrentIndex(0);

    const res = await fetch('/api/generateQuestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: topic.title,
        difficulty
      })
    });

    const data = await res.json();

    // ⚠️ TẠM THỜI: coi text là câu hỏi giả
    const fakeQuestions: Question[] = [
      {
        id: '1',
        content: data.text || 'Không có câu hỏi',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
        type: QuestionType.MULTIPLE_CHOICE
      }
    ];

    setQuestions(fakeQuestions);
    setLoading(false);
  }, [topic.title, difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  if (loading) {
    return <div className="p-8 text-center">⏳ Đang tạo câu hỏi...</div>;
  }

  if (finished) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Hoàn thành 🎉</h2>
        <button onClick={onReturnHome}>Về trang chủ</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="p-8">
      <h3 className="text-xl font-bold mb-4">{currentQ.content}</h3>

      <div className="flex gap-2">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            className="border px-4 py-2"
            onClick={() => {
              const correct = opt === currentQ.answer;
              onScoreUpdate(correct ? 10 : 0, correct);
              setFinished(true);
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;
