<script lang="ts">
  import { appState } from "../store.svelte";
  import { _, json, locale, number } from "svelte-i18n";
  import "../i18n.ts";
  import { INITIAL_CATEGORY, type Category } from "./InsaneSkill";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

  let insaneCategory = $state<Category[]>(
    JSON.parse(JSON.stringify(INITIAL_CATEGORY)),
  );

  /**
   * 현재 애플리케이션의 표시 언어를 변경합니다.
   *
   * @param lang - 변경할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }

  /**
   * 봉마인의 기본 능력치 값을 정의합니다.
   */
  interface Stats {
    hp: number;
    san: number;
    weapon: number;
    painkillers: number;
    omamori: number;
    curiosity: string;
    fear: string;
  }

  // 초기값 설정
  let initailAfflicted: Stats = {
    hp: 6,
    san: 6,
    weapon: 0,
    painkillers: 0,
    omamori: 0,
    curiosity: "폭력",
    fear: "공포1",
  };

  //
  const curiosityOptions = ["폭력", "정서", "지각", "기술", "과학", "괴이"];
  const fearOptions = ["공포1 ", "공포 2", "공포 3 ", "공포 4"];

  /**
   * 클릭 핸들러: 특기 이름을 클릭 시 실행
   * @param categoryIdx 카테고리 인덱스
   * @param abilityIdx 능력치 인덱스
   */
  function adjustSkillValue(categoryIdx: number, skillIdx: number) {
    const ability = insaneCategory[categoryIdx].skill[skillIdx];

    if (ability.base === 12) {
      ability.base = 5;
    } else {
      ability.base = 12;
    }
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
    <h2 class="page-title">inSANe 봉마인</h2>
    <div class="derived-stats-grid">
      <div class="stat-item">
        <p>HP</p>
        <input
          type="number"
          bind:value={initailAfflicted.hp}
          min="1"
          max="6"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>이성</p>
        <input
          type="number"
          bind:value={initailAfflicted.san}
          min="1"
          max="6"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>무기</p>
        <input
          type="number"
          bind:value={initailAfflicted.weapon}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>진통제</p>
        <input
          type="number"
          bind:value={initailAfflicted.painkillers}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>진통제</p>
        <input
          type="number"
          bind:value={initailAfflicted.omamori}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
    </div>
    <div class="derived-stats-grid-2">
      <div class="stat-item">
        <p>호기심</p>
        <select bind:value={initailAfflicted.curiosity}>
          {#each curiosityOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="stat-item">
        <p>공포심</p>
        <select bind:value={initailAfflicted.fear}>
          {#each fearOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="stats-container">
      <div class="category-column-1">
        <h3 class="category-title">◆</h3>
        <div class="ability-list">
          <p><strong>2</strong></p>
          <p><strong>3</strong></p>
          <p><strong>4</strong></p>
          <p><strong>5</strong></p>
          <p><strong>6</strong></p>
          <p><strong>7</strong></p>
          <p><strong>8</strong></p>
          <p><strong>9</strong></p>
          <p><strong>10</strong></p>
          <p><strong>11</strong></p>
          <p><strong>12</strong></p>
        </div>
      </div>
      <div class="category-column">
        <h3 class="category-title">1.폭력</h3>
        <div class="ability-list">
          <p><span>소각</span> <strong>12</strong></p>
          <p><span>고문</span> <strong>12</strong></p>
          <p><span>포박</span> <strong>12</strong></p>
          <p><span>협박</span> <strong>12</strong></p>
          <p><span>파괴</span> <strong>12</strong></p>
          <p><span>구타</span> <strong>12</strong></p>
          <p><span>절단</span> <strong>12</strong></p>
          <p><span>찌르기</span> <strong>12</strong></p>
          <p><span>사격</span> <strong>12</strong></p>
          <p><span>전쟁</span> <strong>12</strong></p>
          <p><span>매장</span> <strong>12</strong></p>
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
    </div>
    <br />

    <div class="result-btn">
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
    width: 800px;
    padding: 20px;
    text-align: center;
  }

  .content-wrapper button:not(.lang-btn) {
    width: 100%; /* 부모인 content-wrapper 너비에 맞춤 */
    max-width: 800px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
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
    max-width: 800px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
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

  /* 숫자 입력창 스타일 */
  input[type="number"] {
    width: 50px;
    padding: 2px 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    text-align: center;
    font-size: 0.9rem;
  }

  /* 드롭다운 스타일 */
  select {
    width: 80%;
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 0.85rem;
    cursor: pointer;
    background-color: #274d60;
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
    font-size: 1rem;
    text-align: center;
  }

  .stats-container {
    background-color: #ebe2d6;
    color: #0f172a;
    display: flex; /* 자식들을 가로로 나열 */
    flex-direction: row; /* 기본값이 가로지만 명시적으로 설정 */
    justify-content: center;
    align-items: flex-start; /* 상단 기준 정렬 */
    gap: 0; /* spacer가 있으므로 0으로 설정하거나 적절히 조절 */
    margin-top: 20px;
    width: 100%; /* 부모 너비에 꽉 차게 */
    text-align: left;
  }

  .category-column-1 {
    flex: 0 0 auto; /* 크기가 줄어들거나 늘어나지 않게 고정 */
    width: 12x; /* 각 열의 너비 */
    border: 1px solid #333;
  }

  .category-column {
    flex: 0 0 auto; /* 크기가 줄어들거나 늘어나지 않게 고정 */
    width: 120px; /* 각 열의 너비 */
    border: 1px solid #333;
  }
</style>
