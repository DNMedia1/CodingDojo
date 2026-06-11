import type { UserProgress } from '../models/learning';
import { loadProgress, saveProgress } from './progressService';

export interface ProgressRepository {
  load: () => UserProgress;
  save: (progress: UserProgress) => void;
}

export const localProgressRepository: ProgressRepository = {
  load: loadProgress,
  save: saveProgress
};

export function createMemoryProgressRepository(initialProgress: UserProgress): ProgressRepository {
  let currentProgress = initialProgress;

  return {
    load: () => currentProgress,
    save: (progress) => {
      currentProgress = progress;
    }
  };
}
