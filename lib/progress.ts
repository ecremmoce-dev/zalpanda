export interface Progress {
  current: number;
  total: number;
  normalCount: number;
  moveCount: number;
  successCount: number;
  failCount: number;
  isCompleted: boolean;
}

const progressMap = new Map<string, Progress>();

export const createProgressKey = (companyId: string, platformId: string) => {
  return `sync_${companyId}_${platformId}`;
};

export const initProgress = (key: string, total: number) => {
  progressMap.set(key, {
    current: 0,
    total,
    normalCount: 0,
    moveCount: 0,
    successCount: 0,
    failCount: 0,
    isCompleted: false
  });
};

export const updateProgress = (key: string, update: Partial<Progress>) => {
  const current = progressMap.get(key) || {
    current: 0,
    total: 0,
    normalCount: 0,
    moveCount: 0,
    successCount: 0,
    failCount: 0,
    isCompleted: false
  };
  progressMap.set(key, { ...current, ...update });
};

export const getProgress = (key: string): Progress | null => {
  return progressMap.get(key) || null;
};

export const clearProgress = (key: string) => {
  progressMap.delete(key);
};

export const setProgress = (key: string, progress: Progress) => {
  progressMap.set(key, progress);
}; 