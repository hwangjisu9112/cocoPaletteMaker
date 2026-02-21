import App from "./App.svelte";

/**
 * 크툴루의 부름 탐사자의 기본 특성치의 값 집합을 나타냅니다.
 */
interface CoCCharacteristics {
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
class AppState {
  // $state 룬으로 반응형 상태 선언
  currentStats = $state<CoCCharacteristics>({
    str: 0, con: 0, siz: 0, dex: 0, app: 0, edu: 0, int: 0, pow: 0, luc: 0
  });
  isConfirmed = $state(false);

  // 상태 업데이트 메서드
  setStats(newStats: CoCCharacteristics) {
    this.currentStats = newStats;
  }

  confirm() {
    this.isConfirmed = true;
  }

  reset() {
    this.currentStats = { str: 0, con: 0, siz: 0, dex: 0, app: 0, edu: 0, int: 0, pow: 0, luc: 0 };
    this.isConfirmed = false;
  }
}


/**
 * coc 탐사자의 현재 상태와 확정 여부를 관리하는 Svelte 스토어입니다.
 */
export const appState = new AppState();


/**
 * 인세인 봉마인의 기본 특성치의 값 집합을 나타냅니다.
 */
interface InsaneCharacteristics {
  hp: number;
  san: number;
  weapon: number;
  painkillers: number;
  omamori: number;
  curiosity: string;
  fear: string;
}