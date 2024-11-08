// 진행 상태를 저장할 Map 객체
const progressMap = new Map<string, number>();

/**
 * 진행률을 설정하는 함수
 * @param key 진행률을 식별하는 키
 * @param value 진행률 값 (0-100)
 */
export function setProgress(key: string, value: number) {
  progressMap.set(key, Math.min(100, Math.max(0, value)));
}

/**
 * 진행률을 가져오는 함수
 * @param key 진행률을 식별하는 키
 * @returns 진행률 값 (0-100), 키가 없으면 0 반환
 */
export function getProgress(key: string): number {
  return progressMap.get(key) || 0;
}

/**
 * 진행률을 초기화하는 함수
 * @param key 진행률을 식별하는 키
 */
export function resetProgress(key: string) {
  progressMap.delete(key);
}

/**
 * 진행 상태 키를 생성하는 함수
 * @param companyId 회사 ID
 * @param platformId 플랫폼 ID
 * @returns 진행 상태 키
 */
export function createProgressKey(companyId: string, platformId: string): string {
  return `${companyId}:${platformId}`;
} 