<script lang="ts">
  import { appStateIns } from "../store.svelte";
  import { get } from "svelte/store";
  import { _, json, locale, number } from "svelte-i18n";
  import "../i18n.ts";
  import { INITIAL_CATEGORY, type Category, type Skill } from "./InsaneSkill";
  import { createGooglesheetData, createCocoPalette } from "./InsaneSheetStyle";

  import { passive } from "svelte/legacy";
  import app from "../main";

  /**
   * 현재 애플리케이션의 표시 언어를 변경합니다.
   *
   * @param lang - 변경할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

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
  let skills = $state(JSON.parse(JSON.stringify(INITIAL_CATEGORY)));

  let stats = $state<Stats>({
    hp: appStateIns.currentStats.hp || 6,
    san: appStateIns.currentStats.san || 6,
    weapon: appStateIns.currentStats.weapon || 0,
    painkillers: appStateIns.currentStats.painkillers || 0,
    omamori: appStateIns.currentStats.omamori || 0,
    curiosity: appStateIns.currentStats.curiosity || "폭력",
    fear: appStateIns.currentStats.fear || "소각",
  });

  // svelte-ignore non_reactive_update
  let expandedIndex = $state<number | null>(null);

  /**
   * 클릭한 카드의 인덱스를 받아 토글합니다.
   */
  function toggleDescription(index: number) {
    if (expandedIndex === index) {
      expandedIndex = null; // 이미 열려있으면 닫기
      console.log("expandedIndex : " + expandedIndex);
    } else {
      expandedIndex = index; // 닫혀있으면 해당 인덱스 열기
      console.log("expandedIndex : " + expandedIndex);
    }
  }

  /**
   * 봉마인의 기본 능력치 값을 정의합니다.
   */

  interface Ability {
    name: string;
    type: string;
    specified?: string;
    description?: string;
  }

  let abilities = $state<Ability[]>([
    {
      name: "기본공격",
      type: "공격",
      specified: "-",
      description: "목표 1명을 선택해서 명중판정을 성공하고 목표가 회피판정을 실패 시 1D6의 대미지를 입힙니다.",
    },
    {
      name: "전장이동",
      type: "서포트",
      specified: "-",
      description: "캐릭터 전원이 다음 라운드에 플롯 변경을 합니다.",
    },
    { name: "", type: "-", specified: "", description: "" },
    { name: "", type: "-", specified: "", description: "" },
  ]);

  const abType = ["공격", "서포트", "장비"];
  let nonOption = "-";

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

  let fearOptions = categories.flatMap((cat) => cat.skill);

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
      const SourceCtgr = categories[pos.cIdx];

      let horizonDistance = Math.abs(pos.cIdx - cIdx) * 2;
      const targetSkill = categories[pos.cIdx].skill[pos.sIdx];
      const verticalDistance = Math.abs(targetSkill.index - skill.index);

      if (horizonDistance > 0 && stats.curiosity === SourceCtgr.type) {
        horizonDistance -= 1;
      }

      // 인세인 규칙: 동일 카테고리(열) 내에서 수직 거리를 계산합니다.
      // 최종 판정치 = 기본 성공치(5) + 수평 거리 + 수직 거리
      const totalDistance = horizonDistance + verticalDistance;
      const val = 5 + totalDistance;

      if (val < minCalculatedValue) {
        minCalculatedValue = val;
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
    console.log("Selected Position 변경됨 ~ :", selectedPositions);
  }

  function afflictedValidation() {
    if (stats.weapon + stats.painkillers + stats.omamori <= 1) {
      console.log(stats.weapon + stats.painkillers + stats.omamori);
      console.log("부적, 무기, 진통제의 양이 너무 적습니다");
    } else if (stats.weapon + stats.painkillers + stats.omamori >= 3) {
      console.log(stats.weapon + stats.painkillers + stats.omamori);
      console.log("부적, 무기, 진통제의 양이 너무 많습니다");
    }
  }

  /**
   * 구글시트용 캐릭터 데이터를 생성해 클립보드로 복사합니다.
   */
  function copyToSheet(): void {
    appStateIns.setStats({ ...stats });

    const selectedSkills = categories.flatMap((category, cIdx) =>
      category.skill.map((skill, sIdx) => {
        const value = getSkillValue(cIdx, sIdx, skill);
        const isPicked = selectedPositions.some(
          (p) => p.cIdx === cIdx && p.sIdx === sIdx,
        );

        return {
          ...skill,
          value: value,
          base: value,
          isPicked: isPicked,
        };
      }),
    );

    const afflictedData = createGooglesheetData(
      stats,
      { ...stats },
      selectedSkills,
      abilities, // $state로 관리되는 최신 배열
      (key) => get(_)(key),
    );

    const textarea = document.createElement("textarea");
    textarea.value = afflictedData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드 복사 완료:", stats);
      console.log("복사된 값");
      console.log(afflictedData);
      alert(
        get(_)("alert_sheet_success", {
          default: "클립보드에 복사되었습니다.",
        }),
      );
    } catch (err) {
      console.error("복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }


  function copyToData(): void {
    appStateIns.setStats({ ...stats });

    const selectedSkills = categories.flatMap((category, cIdx) =>
      category.skill.map((skill, sIdx) => {
        const value = getSkillValue(cIdx, sIdx, skill);
        const isPicked = selectedPositions.some(
          (p) => p.cIdx === cIdx && p.sIdx === sIdx,
        );

        return {
          ...skill,
          value: value,
          base: value,
          isPicked: isPicked,
        };
      }),
    );

    const afflictedData = createCocoPalette(
      stats,
      { ...stats },
      selectedSkills,
      abilities, // $state로 관리되는 최신 배열
      (key) => get(_)(key),
    );

    const textarea = document.createElement("textarea");
    textarea.value = afflictedData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드 복사 완료:", stats);
      console.log("복사된 값");
      console.log(afflictedData);
      alert(
        get(_)("alert_sheet_success", {
          default: "클립보드에 복사되었습니다.",
        }),
      );
    } catch (err) {
      console.error("복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }
  
</script>

<main>
<br />
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
    <h3 class="page-title">{$_("InS_result")}</h3>

    <div class="derived-stats-grid">
      <div class="stat-item">
        <p>체력</p>
        <input type="number" bind:value={stats.hp} min="1" max="6" />
      </div>
      <div class="stat-item">
        <p>이성</p>
        <input type="number" bind:value={stats.san} min="1" max="6" />
      </div>
      <div class="stat-item">
        <p>무기</p>
        <input type="number" bind:value={stats.weapon} min="0" max="2" />
      </div>
      <div class="stat-item">
        <p>부적</p>
        <input type="number" bind:value={stats.omamori} min="0" max="2" />
      </div>
      <div class="stat-item">
        <p>진통제</p>
        <input type="number" bind:value={stats.painkillers} min="0" max="2" />
      </div>
    </div>

    <div class="derived-stats-grid-2">
      <div class="inline-group">
        <p class="label-blue">호기심</p>
        <select bind:value={stats.curiosity} class="cf-select">
          {#each categories as category}
            <option value={category.type}>{$_(category.type)}</option>
          {/each}
        </select>
      </div>

      <div class="inline-group">
        <p class="label-blue">공포심</p>
        <select bind:value={stats.fear} class="cf-select">
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
          class:highlighted={stats.curiosity === category.type}
        >
          <h3 class="category-h3">{$_(category.type)}</h3>
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
                <span
                  class="skill-name"
                  class:highlighted={isPicked}
                  class:fear={skill.name === stats.fear}>{$_(skill.name)}</span
                >
                <span class="skill-value">{displayValue}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
      <br />
    </div>
    <h3>어빌리티 리스트</h3>

    <div class="ability-section">
      <div class="ability-header">
        <div class="header-item name">어빌리티</div>
        <div class="header-item type">타입</div>
        <div class="header-item skill">지정 특기</div>
        <div class="header-item dsc">설명</div>
      </div>
      <div class="ability-list">
        {#each abilities as ability, i}
          <div class="ability-card">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
              class="ability-row"
              onclick={() => toggleDescription(i)}
              role="button"
              tabindex="0"
            >
              <input class="input-name" type="text" bind:value={ability.name} />

              <select class="select-type" bind:value={ability.type}>
                {#each abType as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>

              <select class="input-skill" bind:value={ability.specified}>
                {#each fearOptions as option}
                  <option value={option.name}>{$_(option.name)}</option>
                {/each}
              </select>

              <span class="toggle-icon"
                >{expandedIndex === i ? "⬆️" : "⬇️"}</span
              >
            </div>

            <div class="desc-row" hidden={expandedIndex !== i}>
              <textarea
                bind:value={ability.description}
                placeholder="어빌리티의 효과를 입력하세요"
              ></textarea>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div>
      <div>
        <button onclick={copyToData} style="width:600px">{$_("copyToCoco")}</button>
        <button onclick={copyToSheet} style="width:600px">{$_("copyToSheet")}</button>
      </div>
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

  .derived-stats-grid,
  .derived-stats-grid-2 {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px; /* 항목 간 간격 살짝 축소 */
    max-width: 800px;
    width: 100%;
    margin: 0 auto 20px auto;
  }

  /* 상단 5개 아이템: 라벨과 입력창을 한 줄(row)로 배치 */
  .stat-item {
    display: flex;
    flex: 1; /* 5개가 800px을 균등하게 나눔 */
    align-items: center;
    background-color: #274d60;
    border-radius: 4px;
    overflow: hidden;
    height: 30px;
  }

  .stat-item p {
    flex: 1;
    color: #ebe2d6;
    margin: 0;
    font-size: 0.9rem;
    text-align: center;
    white-space: nowrap;
    padding: 0 5px;
  }

  .stat-item input[type="number"] {
    width: 50px; /* 입력창 크기 최적화 */
    height: 100%;
    border: none;
    border-left: 1px solid #1a3542;
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    background-color: #ebe2d6;
    color: #333;
    outline: none;
  }

  /* 하단 2개 아이템 (기존 스타일 유지 및 정렬 보정) */
  .inline-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    height: 30px;
  }

  .label-blue {
    background-color: #294d61;
    color: #d7cdcd;
    height: 20px;
    padding: 8px 15px;
    border-radius: 4px;
    font-weight: bold;
    min-width: 100px;
    text-align: center;
  }

  .cf-select {
    flex: 1;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #1a1a1a;
    color: #ccc;
    font-size: 1.1rem;

    padding: 0 10px;
    cursor: pointer;
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
    min-width: 90px;
    max-width: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #ebe2d6;
  }

  .category-section.highlighted {
    background: #eea830;
  }

  .category-h3 {
    margin-top: 0;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    font-size: 1rem;
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
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .skill-name.highlighted {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 50%,
      #40ddb3 15%
    );
  }

  .skill-name.fear {
    color: #b017de;
    text-shadow:
      0 0 10px #fff,
      0 0 20px #fff,
      0 0 30px #e60073,
      0 0 40px #9108d6;
  }

  .skill-value {
    font-family: monospace;
    font-weight: bold;
    font-size: 1rem;
    color: #777;
  }

  .ability-section {
    max-width: 800px;
    margin: 20px auto;
    width: 100%;
  }

  .ability-header {
    display: flex;
    background-color: #274d60;
    color: #40ddb3;
    padding: 5px 12px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    text-align: left;
  }

  .header-item.name {
    text-align: left;
    flex: 0.93;
  }
  .header-item.type {
    text-align: left;
    flex: 0.3;
  }
  .header-item.skill {
    text-align: left;
    flex: 0.2;
  }

  .header-item.dsc {
    text-align: right;
    flex: 0.1;
  }
  .header-item {
    padding: 0 5px;
  }

  .ability-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ability-card {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    height: auto;
    min-height: 15px; /* 최소 높이만 지정 */
    position: relative;
  }

  .ability-list {
    display: flex;
    flex-direction: column;
    border-top: none;
  }
  .ability-card {
    background-color: #ebe2d6;
    transition: background-color 0.2s;
  }

  .ability-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ability-section input,
  .ability-section select {
    border: 1px solid #000000;
    border-radius: 3px;
    font-size: 1.1rem;
  }

  .input-name {
    flex: 1;
  }
  .select-type {
    flex: 0.3;
  }
  .input-skill {
    width: 20px;
    flex: 0.3;
  }

  .toggle-icon {
    font-size: 1.2rem;
    color: #000000;
    width: 20px;
    text-align: center;
  }

  /* hidden 속성이 붙은 요소는 숨김 처리 */
  [hidden] {
    display: none !important;
  }
  .desc-row {
    padding: 8px 12px;
    border-top: 1px dashed #ddd;
    /* hidden이 아닐 때만 보임 */
  }

  .desc-row {
    padding: 8px 12px;
    background-color: rgb(162, 150, 133);
    border-top: 1px dashed #ddd;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .desc-row textarea {
    width: 100%;
    height: 70px;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    font-size: 0.85rem;
  }
</style>
