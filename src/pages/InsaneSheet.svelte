<script lang="ts">
  import { appState } from "../store.svelte";
  import { _, json, locale, number } from "svelte-i18n";
  import "../i18n.ts";
  import { INITIAL_CATEGORY, type Category, type Skill } from "./InsaneSkill";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

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
    curiosity?: string;
    fear?: string;
  }

  // 초기값 설정
  let initailAfflicted: Stats = {
    hp: 6,
    san: 6,
    weapon: 0,
    painkillers: 0,
    omamori: 0,
    curiosity: "-",
    fear: "-",
  };

  const curiosityOptions = ["폭력", "정서", "지각", "기술", "과학", "괴이"];
  const fearOptions = ["공포1 ", "공포 2", "공포 3 ", "공포 4"];

  // 현재 선택된 특기들의 위치 정보를 담는 타입 정의
  interface SelectedPos {
    cIdx: number;
    sIdx: number;
  }

  // 여러 특기를 선택할 수 있도록 배열로 상태 관리
  // 컴파일 오류 방지를 위해 변수 선언 시 타입을 명확히 지정합니다.
  let selectedPositions: SelectedPos[] = $state([]);

  // 초기 데이터 설정
  const categories: Category[] = INITIAL_CATEGORY;

  /**
   * 거리 기반 판정 수치를 계산하는 함수
   * 여러 개의 선택된 특기 중 현재 위치에서 가장 가까운(최소값) 거리를 계산합니다.
   */
  function getSkillValue(cIdx: number, sIdx: number, skill: Skill): number {
    // 선택된 특기가 하나도 없으면 기본값 12
    if (selectedPositions.length === 0) return skill.base;

    // 현재 특기가 이미 습득(선택)된 특기라면 판정치는 5가 됩니다.
    const isActuallySelected = selectedPositions.some(
      (pos) => pos.cIdx === cIdx && pos.sIdx === sIdx,
    );
    if (isActuallySelected) return 5;

    // 모든 선택된 특기로부터의 거리를 비교하여 가장 유리한(작은) 판정치를 찾습니다.
    let minCalculatedValue = 12;

    for (const pos of selectedPositions) {
      // 인세인 규칙: 동일 카테고리(열) 내에서만 수직 거리를 계산합니다.
      if (pos.cIdx === cIdx) {
        const targetSkill = categories[pos.cIdx].skill[pos.sIdx];
        const distance = Math.abs(targetSkill.index - skill.index);
        const val = 5 + distance;
        if (val < minCalculatedValue) {
          minCalculatedValue = val;
        }
      }
    }

    // 결과값은 12를 초과할 수 없습니다.
    return Math.min(minCalculatedValue, 12);
  }

  /**
   * 스킬 클릭 핸들러 (다중 선택 및 토글 로직)
   */
  function handleSpecClick(cIdx: number, sIdx: number) {
    const existingIdx = selectedPositions.findIndex(
      (pos) => pos.cIdx === cIdx && pos.sIdx === sIdx,
    );

    if (existingIdx !== -1) {
      // 이미 선택된 특기라면 배열에서 제거하여 선택 해제
      selectedPositions = selectedPositions.filter((_, i) => i !== existingIdx);
    } else {
      // 새로운 특기라면 배열에 추가하여 습득 상태로 변경
      selectedPositions = [...selectedPositions, { cIdx, sIdx }];
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
    <h2 class="page-title">{$_("InS_result")}</h2>
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

    <div class="specialty-table">
      {#each categories as category, cIdx}
        <div class="category-section">
          <h3>{category.type.split("_").pop() || category.type}</h3>
          <div class="skill-list">
            {#each category.skill as skill, sIdx}
              {@const displayValue = getSkillValue(cIdx, sIdx, skill)}
              {@const isPicked = selectedPositions.some(
                (p) => p.cIdx === cIdx && p.sIdx === sIdx,
              )}
              {@const isBonus = !isPicked && displayValue < 12}

              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="skill-item"
                class:selected={isPicked}
                class:bonus={isBonus}
                onclick={() => handleSpecClick(cIdx, sIdx)}
              >
                <span class="skill-name">{skill.name}</span>
                <span class="skill-value">{displayValue}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
      <br />
    </div>
    <div class="result-btn">
      <button>{$_("copyToCoco")}</button>
      <button>{$_("copyToSheet")}</button>
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
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .derived-stats-grid-2 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
    background-color: #6da5c0;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    margin: 0;
    font-size: 1.2em;
    color: #012013;
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

  .specialty-table {
    display: flex;
    flex-direction: row; /* 수평 정렬 */
    gap: 12px;
    padding: 20px;
    width: 800px; /* 전체 너비 제한 */
    overflow-x: auto; /* 내용이 넘칠 경우 가로 스크롤 허용 */
    box-sizing: border-box;
  }

  .category-section {
    flex: 1;
    min-width: 130px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #ebe2d6;
  }

  h3 {
    margin-top: 0;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    font-size: 1.25rem;
    color: #1a1a1a;
  }

  .category-section {
    flex: 0 0 120px;
    border: 1px solid #ccc;
    background-color: #ebe2d6;
    color: #1a1a1a;

    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0;
    padding: 8px;
    font-size: 0.85rem;
    text-align: center;
    background-color: #333;
    color: #fff;
  }

  .skill-list {
    display: flex;
    flex-direction: column;
    padding: 4px;
  }

  .skill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 6px;
    margin-bottom: 2px;
    cursor: pointer;
    border-radius: 2px;
    transition: background-color 0.15s;
    border-bottom: 1px solid #eee;
  }

  .skill-item:hover {
    background-color: #f0f0f0;
  }

  .skill-name {
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .skill-value {
    font-family: monospace;
    font-weight: bold;
    font-size: 1.2rem;
    color: #777;
  }

  .skill-item.active {
    background-color: #fee2e2;
    border-color: #ef4444;
  }
  .skill-item.active .skill-name,
  .skill-item.active .skill-value {
    color: #b91c1c;
    font-weight: bold;
  }

  .skill-item.highlight {
    background-color: #eff6ff;
  }
  .skill-item.highlight .skill-name,
  .skill-item.highlight .skill-value {
    color: #1d4ed8;
  }

  .main-wrapper::-webkit-scrollbar {
    height: 6px;
  }
  .main-wrapper::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
</style>
