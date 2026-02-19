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
  let initialAfflicted: Stats = $state({
    hp: 6,
    san: 6,
    weapon: 0,
    painkillers: 0,
    omamori: 0,
    curiosity: "",
    fear: "-",
  });

  // 현재 선택된 특기들의 위치 정보를 담는 타입 정의(cIdx=열 정보, sIdx=행 정보)
  interface SelectedPos {
    cIdx: number;
    sIdx: number;
  }

  // 여러 특기를 선택할 수 있도록 배열로 상태 관리
  // 컴파일 오류 방지를 위해 변수 선언 시 타입을 명확히 지정합니다.
  let selectedPositions: SelectedPos[] = $state([]);

  // 초기 데이터 설정
  const categories: Category[] = INITIAL_CATEGORY;

  const fearOptions = categories.flatMap((cat) => cat.skill);

  /**
   * 거리 기반 판정 수치를 계산하는 함수
   * 여러 개의 선택된 특기 중 현재 위치에서 가장 가까운(최소값) 거리를 계산합니다.
   */
  function getSkillValue(cIdx: number, sIdx: number, skill: Skill): number {
    // 선택된 특기가 하나도 없으면 기본값 12
    if (selectedPositions.length === 0) return skill.base;

    // 현재 특기가 선택된 특기라면 판정치는 5가 됩니다.
    const isActuallySelected = selectedPositions.some(
      (pos) => pos.cIdx === cIdx && pos.sIdx === sIdx,
    );
    if (isActuallySelected) return 5;

    // 모든 선택된 특기로부터의 거리를 비교하여 가장 유리한(작은) 판정치를 찾습니다.
    let minCalculatedValue = 12;

    for (const pos of selectedPositions) {
      // 인세인 규칙: 동일 카테고리(열) 내에서 수직 거리를 계산합니다.
      if (pos.cIdx === cIdx) {
        const targetSkill = categories[pos.cIdx].skill[pos.sIdx];
        const distance = Math.abs(targetSkill.index - skill.index);
        const val = 5 + distance;
        if (val < minCalculatedValue) {
          minCalculatedValue = val;
        }
      }
    }

    // 결과값은 12를 초과할 수 없다
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
</script>

<main>
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
        <p>체력</p>
        <input
          type="number"
          bind:value={initialAfflicted.hp}
          min="1"
          max="6"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>이성</p>
        <input
          type="number"
          bind:value={initialAfflicted.san}
          min="1"
          max="6"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>무기</p>
        <input
          type="number"
          bind:value={initialAfflicted.weapon}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>진통제</p>
        <input
          type="number"
          bind:value={initialAfflicted.painkillers}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
      <div class="stat-item">
        <p>진통제</p>
        <input
          type="number"
          bind:value={initialAfflicted.omamori}
          min="0"
          max="2"
          placeholder="0"
        />
      </div>
    </div>
    <div class="derived-stats-grid-2">
      <div class="stat-item">
        <p>호기심</p>
        <select bind:value={initialAfflicted.curiosity}>
          {#each categories as category}
            <option value={category.type}>{$_(category.type)}</option>
          {/each}
        </select>
      </div>

      <div class="stat-item">
        <p>공포심</p>
        <select bind:value={initialAfflicted.fear}>
          {#each fearOptions as option}
            <option value={option.name}>{$_(option.name)}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="specialty-table">
      {#each categories as category, cIdx}
        <div
          class="category-section"
          class:highlighted={initialAfflicted.curiosity === category.type}
        >
          <h3>{$_(category.type)}</h3>
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
                <span class="skill-name">{$_(skill.name)}</span>
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

  .category-section.highlighted {
    border-color: #19d4c1;
    box-shadow: 0 14px 14px rgba(223, 178, 99, 0.4);
    background: #f59e0b;
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
</style>
