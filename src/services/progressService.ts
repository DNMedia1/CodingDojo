import type { LanguageId, LevelInfo, QuizAnswer, UserProgress } from '../models/learning';

const STORAGE_KEY = 'devpath-progress-v1';
const todayIso = () => new Date().toISOString().slice(0, 10);

export const defaultProgress: UserProgress = {
  displayName: 'Entwickler',
  avatarTone: 'blue',
  xp: 0,
  streak: 1,
  lastActiveDate: todayIso(),
  completedLessons: {},
  quizMistakes: [],
  dailyGoal: 2,
  theme: 'dark'
};

export function calculateLevel(xp: number): LevelInfo {
  const level = Math.floor(xp / 120) + 1;
  const currentLevelXp = (level - 1) * 120;
  const nextLevelXp = level * 120;
  const progress = Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));
  return { level, currentLevelXp, nextLevelXp, progress };
}

export function completeLesson(
  progress: UserProgress,
  courseId: LanguageId,
  lessonId: string,
  xp: number,
  date = todayIso()
): UserProgress {
  const courseLessons = progress.completedLessons[courseId] ?? [];
  if (courseLessons.includes(lessonId)) {
    return progress;
  }

  return {
    ...progress,
    xp: progress.xp + xp,
    streak: updateStreak(progress.lastActiveDate, progress.streak, date),
    lastActiveDate: date,
    completedLessons: {
      ...progress.completedLessons,
      [courseId]: [...courseLessons, lessonId]
    }
  };
}

export function gradeQuiz(answers: QuizAnswer[], progress: UserProgress) {
  const missed = answers.filter((answer) => answer.selectedOptionId !== answer.correctOptionId).map((answer) => answer.questionId);
  const score = answers.length - missed.length;
  const nextMistakes = Array.from(new Set([...progress.quizMistakes.filter((id) => !answers.some((a) => a.questionId === id)), ...missed]));

  return {
    score,
    total: answers.length,
    percentage: answers.length === 0 ? 0 : Math.round((score / answers.length) * 100),
    nextProgress: {
      ...progress,
      xp: progress.xp + score * 12,
      quizMistakes: nextMistakes,
      lastActiveDate: todayIso()
    }
  };
}

export function loadProgress(): UserProgress {
  if (typeof localStorage === 'undefined') return defaultProgress;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress;

  try {
    const stored = { ...defaultProgress, ...JSON.parse(raw) } as UserProgress;
    return stored.displayName === 'Developer' ? { ...stored, displayName: 'Entwickler' } : stored;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

function updateStreak(lastActiveDate: string, currentStreak: number, date: string) {
  const previous = new Date(`${lastActiveDate}T00:00:00`);
  const current = new Date(`${date}T00:00:00`);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
