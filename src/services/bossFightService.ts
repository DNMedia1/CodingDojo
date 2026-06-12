import type { BossFight } from '../models/learning';

export type BossFightAnswerMap = Record<string, boolean>;

export function getBossFightScore(bossFight: BossFight, answers: BossFightAnswerMap) {
  const total = bossFight.exercises.length;
  const answered = bossFight.exercises.filter((exercise) => exercise.id in answers).length;
  const correct = bossFight.exercises.filter((exercise) => answers[exercise.id]).length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  return { correct, answered, total, percent };
}

export function isBossFightPassed(bossFight: BossFight, answers: BossFightAnswerMap) {
  return getBossFightScore(bossFight, answers).answered === bossFight.exercises.length;
}
