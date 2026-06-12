import type { Course, Exercise, Lesson, ReviewCard, UserProgress } from '../models/learning';

export type TodayPrimaryAction = 'review' | 'lesson' | 'challenge';

export interface TodayLearningRecommendation {
  dueReviewCount: number;
  nextLessonId: string;
  nextLessonTitle: string;
  nextCourseTitle: string;
  nextModuleTitle: string;
  miniChallengeExerciseId: string;
  miniChallengeTitle: string;
  miniChallengeLessonId: string;
  dailyGoalCurrent: number;
  dailyGoalTarget: number;
  dailyGoalPercent: number;
  primaryAction: TodayPrimaryAction;
  primaryActionLabel: string;
}

type RecommendationInput = {
  courses: Course[];
  progress: UserProgress;
  dueReviews: ReviewCard[];
  now?: string;
};

type LessonMatch = {
  course: Course;
  moduleTitle: string;
  lesson: Lesson;
};

const challengeTypes: Exercise['type'][] = ['code_completion', 'mini_project_step', 'debugging', 'code_output'];

export function getTodayLearningRecommendation({ courses, progress, dueReviews, now = new Date().toISOString() }: RecommendationInput): TodayLearningRecommendation {
  const nextLesson = findNextLesson(courses, progress) ?? findFirstLesson(courses);
  const miniChallenge = findMiniChallenge(nextLesson?.lesson);
  const dueReviewCount = dueReviews.filter((card) => new Date(card.nextReviewAt).getTime() <= new Date(now).getTime()).length;
  const dailyGoalCurrent = progress.daily.date === now.slice(0, 10) ? progress.daily.lessonsCompleted : 0;
  const dailyGoalTarget = Math.max(1, progress.dailyGoal);
  const dailyGoalPercent = Math.min(100, Math.round((dailyGoalCurrent / dailyGoalTarget) * 100));
  const primaryAction = choosePrimaryAction(dueReviewCount, dailyGoalCurrent, dailyGoalTarget);

  return {
    dueReviewCount,
    nextLessonId: nextLesson?.lesson.id ?? '',
    nextLessonTitle: nextLesson?.lesson.title ?? 'Keine Lektion offen',
    nextCourseTitle: nextLesson?.course.title ?? 'DevPath',
    nextModuleTitle: nextLesson?.moduleTitle ?? 'Lernpfad',
    miniChallengeExerciseId: miniChallenge?.id ?? '',
    miniChallengeTitle: miniChallenge ? titleForExercise(miniChallenge) : 'Mini-Challenge',
    miniChallengeLessonId: nextLesson?.lesson.id ?? '',
    dailyGoalCurrent,
    dailyGoalTarget,
    dailyGoalPercent,
    primaryAction,
    primaryActionLabel: actionLabel(primaryAction)
  };
}

function choosePrimaryAction(dueReviewCount: number, dailyGoalCurrent: number, dailyGoalTarget: number): TodayPrimaryAction {
  if (dueReviewCount > 0) return 'review';
  if (dailyGoalCurrent >= dailyGoalTarget) return 'challenge';
  return 'lesson';
}

function actionLabel(action: TodayPrimaryAction) {
  if (action === 'review') return 'Fehler wiederholen';
  if (action === 'challenge') return 'Mini-Challenge öffnen';
  return 'Lektion starten';
}

function findNextLesson(courses: Course[], progress: UserProgress): LessonMatch | null {
  for (const course of courses) {
    const completedIds = progress.completedLessons[course.id] ?? [];
    for (const module of course.modules) {
      const lesson = module.lessons.find((candidate) => !completedIds.includes(candidate.id));
      if (lesson) return { course, moduleTitle: module.title, lesson };
    }
  }
  return null;
}

function findFirstLesson(courses: Course[]): LessonMatch | null {
  const course = courses[0];
  const module = course?.modules[0];
  const lesson = module?.lessons[0];
  return course && module && lesson ? { course, moduleTitle: module.title, lesson } : null;
}

function findMiniChallenge(lesson?: Lesson) {
  if (!lesson) return null;
  return lesson.exercises.find((exercise) => challengeTypes.includes(exercise.type)) ?? lesson.exercises[0] ?? null;
}

function titleForExercise(exercise: Exercise) {
  if (exercise.type === 'code_completion') return 'Code-Bausteine einsetzen';
  if (exercise.type === 'mini_project_step') return 'Mini-Projekt-Schritt planen';
  if (exercise.type === 'debugging') return 'Fehler finden';
  if (exercise.type === 'code_output') return 'Code-Ausgabe vorhersagen';
  return 'Mini-Challenge lösen';
}
