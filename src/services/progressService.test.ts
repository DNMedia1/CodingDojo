import { describe, expect, it } from 'vitest';
import { calculateLevel, completeLesson, gradeQuiz } from './progressService';
import type { UserProgress } from '../models/learning';

const baseProgress: UserProgress = {
  displayName: 'Dominik',
  avatarTone: 'blue',
  xp: 90,
  streak: 1,
  lastActiveDate: '2026-06-10',
  completedLessons: {},
  quizMistakes: [],
  dailyGoal: 2,
  theme: 'dark'
};

describe('progressService', () => {
  it('calculates developer levels from total XP', () => {
    expect(calculateLevel(0)).toEqual({ level: 1, currentLevelXp: 0, nextLevelXp: 120, progress: 0 });
    expect(calculateLevel(250).level).toBe(3);
    expect(calculateLevel(250).progress).toBeGreaterThan(0);
  });

  it('completes a lesson once and awards XP idempotently', () => {
    const first = completeLesson(baseProgress, 'python', 'python-variablen-und-typen', 40, '2026-06-11');
    const second = completeLesson(first, 'python', 'python-variablen-und-typen', 40, '2026-06-11');

    expect(first.xp).toBe(130);
    expect(first.completedLessons.python).toContain('python-variablen-und-typen');
    expect(second.xp).toBe(130);
    expect(second.completedLessons.python).toHaveLength(1);
  });

  it('grades quiz attempts and tracks missed question ids', () => {
    const result = gradeQuiz(
      [
        { questionId: 'q1', correctOptionId: 'a', selectedOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b', selectedOptionId: 'a' }
      ],
      baseProgress
    );

    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.nextProgress.quizMistakes).toContain('q2');
    expect(result.nextProgress.quizMistakes).not.toContain('q1');
  });
});
