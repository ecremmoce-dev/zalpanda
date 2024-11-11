type Progress = {
  current: number;
  total: number;
  normalCount: number;
  moveCount: number;
  successCount: number;
  failCount: number;
};

const progressMap = new Map<string, Progress>();

export const createProgressKey = (companyId: string, platformId: string) => {
  return `${companyId}_${platformId}`;
};

export const initProgress = (key: string, total: number) => {
  progressMap.set(key, {
    current: 0,
    total,
    normalCount: 0,
    moveCount: 0,
    successCount: 0,
    failCount: 0
  });
};

export const updateProgress = (key: string, update: Partial<Progress>) => {
  const current = progressMap.get(key) || {
    current: 0,
    total: 0,
    normalCount: 0,
    moveCount: 0,
    successCount: 0,
    failCount: 0
  };
  progressMap.set(key, { ...current, ...update });
};

export const getProgress = (key: string) => {
  return progressMap.get(key);
};

export const clearProgress = (key: string) => {
  progressMap.delete(key);
}; 