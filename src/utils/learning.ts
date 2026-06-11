import { courses } from '../data/courses';
import type { Course, LanguageId, UserProgress } from '../models/learning';

export function getCourseProgress(course: Course, progress: UserProgress) {
  const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completed = progress.completedLessons[course.id]?.length ?? 0;
  return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function getOverallProgress(progress: UserProgress) {
  const total = courses.reduce((sum, course) => sum + course.modules.reduce((moduleSum, module) => moduleSum + module.lessons.length, 0), 0);
  const completed = Object.values(progress.completedLessons).reduce((sum, ids) => sum + (ids?.length ?? 0), 0);
  return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function isLessonCompleted(progress: UserProgress, courseId: LanguageId, lessonId: string) {
  return progress.completedLessons[courseId]?.includes(lessonId) ?? false;
}
