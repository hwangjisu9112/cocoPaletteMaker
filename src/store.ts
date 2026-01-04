import { writable, type Writable } from 'svelte/store';



/**
 * 탐사자의 기본 특성치의 값 집합을 나타냅니다.
 */
interface Characteristics  {
  str: number;
  con: number;
  siz: number;
  dex: number;
  app: number;
  edu: number;
  int: number;
  pow: number; 
  luc: number; 
}


/**
 * 애플리케이션 전역 상태 구조를 정의합니다.
 */
export interface AppState {
    currentStats: Characteristics | null;
    isConfirmed: boolean;
}

/**
 * 초기 상태를 정의합니다.
 */
const initialStats: Characteristics = {
    str: 0, con: 0, siz: 0, dex: 0, app: 0, edu: 0, int: 0, pow: 0, luc: 0
};


/**
 * 탐사자의 현재 상태와 확정 여부를 관리하는 Svelte 스토어입니다.
 */
export const AppState: Writable<AppState> = writable({
    currentStats: initialStats,
    isConfirmed: false
});