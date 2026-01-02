
export enum Subject {
  MATH = 'MATH',
  VIETNAMESE = 'VIETNAMESE',
  ETHICS = 'ETHICS',
  NATURE_SOCIETY = 'NATURE_SOCIETY',
  MUSIC = 'MUSIC',
  ARTS = 'ARTS',
  EXPERIENTIAL = 'EXPERIENTIAL',
  ENGLISH = 'ENGLISH',
  OLYMPIA = 'OLYMPIA',
  MOCK_EXAM = 'MOCK_EXAM'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  score: number;
  streak: number;
  completedTopics: string[]; // Lưu ID của các topic/level đã hoàn thành
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  isLocked?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options: string[];
  answer: string;
  explanation: string;
  hint?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface UserState {
  score: number;
  streak: number;
  completedTopics: string[];
}
