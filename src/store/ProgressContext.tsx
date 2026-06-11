import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { LanguageId, QuizAnswer, ThemeMode, UserProgress } from '../models/learning';
import { localProgressRepository } from '../services/progressRepository';
import { calculateLevel, completeLesson, defaultProgress, gradeQuiz } from '../services/progressService';

type ProgressContextValue = {
  progress: UserProgress;
  levelInfo: ReturnType<typeof calculateLevel>;
  complete: (courseId: LanguageId, lessonId: string, xp: number) => void;
  submitQuiz: (answers: QuizAnswer[]) => ReturnType<typeof gradeQuiz>;
  updateProfile: (displayName: string, dailyGoal: number) => void;
  setTheme: (theme: ThemeMode) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => localProgressRepository.load());

  useEffect(() => {
    localProgressRepository.save(progress);
    document.documentElement.dataset.theme = progress.theme;
  }, [progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      levelInfo: calculateLevel(progress.xp),
      complete: (courseId, lessonId, xp) => setProgress((current) => completeLesson(current, courseId, lessonId, xp)),
      submitQuiz: (answers) => {
        let result: ReturnType<typeof gradeQuiz> | null = null;
        setProgress((current) => {
          result = gradeQuiz(answers, current);
          return result.nextProgress;
        });
        if (!result) throw new Error('Quiz submission failed');
        return result;
      },
      updateProfile: (displayName, dailyGoal) => setProgress((current) => ({ ...current, displayName, dailyGoal })),
      setTheme: (theme) => setProgress((current) => ({ ...current, theme })),
      resetProgress: () => setProgress({ ...defaultProgress, theme: progress.theme })
    }),
    [progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used inside ProgressProvider');
  return context;
}
