export type LanguageId = 'python' | 'csharp' | 'java' | 'html' | 'css' | 'javascript' | 'automation';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type ThemeMode = 'dark' | 'light';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface CodeExample {
  language: string;
  code: string;
}

export interface PracticeTask {
  prompt: string;
  checklist: string[];
  hint: string;
}

export interface CodingConceptCheck {
  id: string;
  label: string;
  pattern: string;
  hint: string;
}

export interface CodingChallenge {
  prompt: string;
  language: string;
  starterCode: string;
  solution: string;
  requiredConcepts: CodingConceptCheck[];
}

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  xp: number;
  theory: string;
  codeExample: CodeExample;
  quiz: QuizQuestion[];
  practice: PracticeTask;
  codingChallenge?: CodingChallenge;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: LanguageId;
  title: string;
  shortName: string;
  description: string;
  accent: string;
  gradient: string;
  icon: string;
  modules: CourseModule[];
}

export interface PracticeProject {
  id: string;
  courseId: LanguageId;
  title: string;
  difficulty: Difficulty;
  duration: string;
  summary: string;
  requirements: string[];
  hints: string[];
  solutionNotes: string[];
}

export interface UserProgress {
  displayName: string;
  avatarTone: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: Partial<Record<LanguageId, string[]>>;
  quizMistakes: string[];
  dailyGoal: number;
  theme: ThemeMode;
}

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
}

export interface QuizAnswer {
  questionId: string;
  correctOptionId: string;
  selectedOptionId: string;
}
