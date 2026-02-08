<script lang="ts">
  import { appState } from "../store.svelte";
  import image02 from "../assets/image02.png";
  import { _, locale } from "svelte-i18n";
  import "../i18n.ts";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();
  let currentView = "insPage";

  /**
   * 현재 애플리케이션의 표시 언어를 변경합니다.
   *
   * @param lang - 변경할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }

  //TRPG Call Of Cthulhu 7판(기본)의 탐사자 특성치를 무작위로 생성하는 func

  /**
   * 주사위를 반복 굴려 합산한 값을 계산합니다.
   *
   * @param times - 주사위를 굴리는 횟수
   * @param value - 주사위 한 면의 최대값
   * @returns 누적 합산된 주사위 결과
   */
  function rollDie(times: number, value: number): number {
    let rollResult = 0;

    for (let i = 0; i < times; i++) {
      rollResult += Math.floor(Math.random() * value) + 1;
    }
    return rollResult;
  }

  let tooltip = $state({ content: "", show: false, x: 0, y: 0 });

  //   /**
  //    * 능력치 요소에 마우스를 올렸을 때 툴팁을 표시합니다.
  //    *
  //    * @param event - 마우스 이벤트 객체
  //    * @param statKey - 설명을 표시할 능력치 키
  //    */
  //   function mouseOver(event: MouseEvent, statKey: string) {
  //     tooltip.content = StatDescriptions[statKey];
  //     tooltip.show = true;
  //     handleMouseMove(event);
  //   }

  /**
   * 마우스 이동에 따라 툴팁 위치를 갱신합니다.
   *
   * @param event - 마우스 이벤트 객체
   */
  function handleMouseMove(event: MouseEvent): void {
    if (tooltip.show) {
      // 커서 위치에서 살짝 오른쪽/아래(15px)로 툴팁을 이동시켜 커서 가림 방지
      tooltip.x = event.clientX + 15;
      tooltip.y = event.clientY + 15;
    }
  }

  /**
   * 마우스가 능력치 요소에서 벗어났을 때 툴팁을 숨깁니다.
   */
  function mouseOut(): void {
    tooltip.show = false;
    tooltip.content = "";
  }

  /**
   * 생성된 능력치를 초기값(0)으로 되돌립니다.
   */
  function resetIns(): void {
    appState.reset();
    console.log("특성치 초기화됨");
  }
</script>

<main onmousemove={handleMouseMove}>
  <div class="content-wrapper">
    <br />
    <div class="nav-row">
      <button class="main-btn" onclick={() => onNavigate("main")}
        >{$_("main_btn")}</button
      >
      <button class="lang-btn" onclick={() => switchLang("kr")}>한국어</button>
      <button class="lang-btn" onclick={() => switchLang("jp")}>日本語</button>
      <button class="lang-btn" onclick={() => switchLang("en")}>ENG</button>
    </div>
    <br />
    <img src={image02} alt="Icon" width="80" />

    <h2 class="page-title">inSANe 봉마인</h2>
    <div class="derived-stats-grid">
      <p>HP</p>
      <p>이성</p>
      <p>무기</p>
      <p>부적</p>
      <p>진통제</p>
    </div>
    <div class="derived-stats-grid-2">
      <p>호기심</p>
      <p>공포심</p>
    </div>
    <div class="stats-container">
      <div class="category-column">
        <h3 class="category-title">1.폭력</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>

      <div class="spacer"></div>

      <div class="category-column">
        <h3 class="category-title">2.정서</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="category-column">
        <h3 class="category-title">3.지각</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="category-column">
        <h3 class="category-title">4.기술</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="category-column">
        <h3 class="category-title">5.지식</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="category-column">
        <h3 class="category-title">6.괴이</h3>
        <div class="ability-list">
          <p><span>ability 1</span> <strong>12</strong></p>
          <p><span>ability 2</span> <strong>12</strong></p>
          <p><span>ability 3</span> <strong>12</strong></p>
          <p><span>ability 4</span> <strong>12</strong></p>
          <p><span>ability 5</span> <strong>12</strong></p>
          <p><span>ability 6</span> <strong>12</strong></p>
          <p><span>ability 7</span> <strong>12</strong></p>
          <p><span>ability 8</span> <strong>12</strong></p>
          <p><span>ability 9</span> <strong>12</strong></p>
          <p><span>ability 10</span> <strong>12</strong></p>
          <p><span>ability 11</span> <strong>12</strong></p>
        </div>
      </div>
      <div class="stats-grid"></div>
    </div>
    <p>기본 공격<strong></strong></p>
    <p>기능<strong></strong></p>
    <p>기능<strong></strong></p>
    <p>기능<strong></strong></p>
    <br />
    <div>
      <button>{$_("copyToCoco")}</button>
      <button>{$_("copyToSheet")}</button>
      <button>초기화</button>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    margin: 0;
    width: 800px;
  }

  .content-wrapper {
    width: 500px;
    padding: 20px;
    text-align: center;
  }

  .content-wrapper button:not(.lang-btn) {
    width: 100%; /* 부모인 content-wrapper 너비에 맞춤 */
    max-width: 400px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
    height: 50px; /* 높이도 고정하면 언어별 폰트 높이 차이를 무시할 수 있음 */
    margin: 5px auto; /* 중앙 정렬 및 간격 */
    display: block; /* 한 줄에 하나씩 배치되도록 설정 */

    /* 텍스트가 길어져도 버튼 크기가 변하지 않게 함 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-title {
    width: 100%; /* 부모인 content-wrapper 너비에 맞춤 */
    max-width: 400px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
    height: 50px; /* 높이도 고정하면 언어별 폰트 높이 차이를 무시할 수 있음 */
    margin: 5px auto; /* 중앙 정렬 및 간격 */
    display: block; /* 한 줄에 하나씩 배치되도록 설정 */

    /* 텍스트가 길어져도 버튼 크기가 변하지 않게 함 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .derived-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .derived-stats-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .derived-stats-grid p {
    background-color: #274d60;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    margin: 0;
    font-size: 1.2em;
    color: #ebe2d6;
  }

  .derived-stats-grid-2 p {
    background-color: #274d60;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    margin: 0;
    font-size: 1.2em;
    color: #ebe2d6;
  }

  .derived-stats-grid strong {
    display: block;
    font-size: 1.2em;
    color: #ddd;
  }

  @keyframes stat-pop {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.8); /* 밝게 빛남 */
      color: #40ddb3;
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }

  .ability-list p span,
  .ability-list p strong {
    padding: 6px 4px;
    font-size: 0.85rem;
    text-align: center;
  }

  .stats-container {
    display: flex; /* 자식들을 가로로 나열 */
    flex-direction: row; /* 기본값이 가로지만 명시적으로 설정 */
    justify-content: center;
    align-items: flex-start; /* 상단 기준 정렬 */
    gap: 0; /* spacer가 있으므로 0으로 설정하거나 적절히 조절 */
    margin-top: 20px;
    width: 100%; /* 부모 너비에 꽉 차게 */
  }

  .category-column {
    flex: 0 0 auto; /* 크기가 줄어들거나 늘어나지 않게 고정 */
    width: 110px; /* 각 열의 너비 */
    border: 1px solid #333;
  }

  .stats-grid p {
    background: #274d60;
    padding: 12px 5px;
    border-radius: 8px;
    margin: 0;

    /* 핵심: 내부 텍스트 길이에 상관없이 박스 크기 유지 */
    display: flex;
    flex-direction: column; /* 라벨과 수치를 세로로 배치하고 싶을 때 유용 */
    justify-content: center;
    align-items: center;
    min-height: 60px; /* 높이를 고정하여 언어 변경 시 덜컥거림 방지 */

    color: white;
    font-size: 0.9rem;
  }

  .tooltip {
    position: fixed; /* 뷰포트 기준으로 위치를 고정하여 다른 요소에 영향 미치지 않음 */
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.8em;
    white-space: nowrap;
    z-index: 1000; /* 다른 요소 위에 표시 */
    pointer-events: none; /* 툴팁이 마우스 이벤트를 가로채지 않도록 설정 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
</style>
