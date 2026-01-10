<script lang="ts">
  import { appState } from "../store.svelte";
  import { get } from "svelte/store";
  import { INITIAL_SKILLS } from "./CoCskill";
  import { createGooglesheetData, createCocoPalette } from "./CoCsheetStyle";
  import { _, locale, isLoading } from "svelte-i18n";
  import "../i18n.ts";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

  /**
   * 현재 화면의 표시 언어를 변경합니다.
   *
   * @param lang - 설정할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }
  let skills = $state(JSON.parse(JSON.stringify(INITIAL_SKILLS)));

  let hp = (appState.currentStats.siz + appState.currentStats.con) / 10;
  let mp = appState.currentStats.pow / 5;
  let sanity = appState.currentStats.pow;
  let baseSkillPoint =
    appState.currentStats.edu * 4 + appState.currentStats.int * 2;

  let db = appState.currentStats.siz + appState.currentStats.str;

  let damage = "0";
  {
    if (db <= 64) {
      damage = "-2";
    } else if (db <= 84) {
      damage = "-1";
    } else if (db <= 124) {
      damage = "0";
    } else if (db <= 164) {
      damage = "1d4";
    } else {
      damage = "1d6";
    }
  }

  // 크툴루의 부름 탐사자 기능들에 대한 설명
  /**
   * 스킬 항목을 표현하는 자료 구조입니다.
   */
  interface Skills {
    name: string;
    point: number;
    base: number;
    evade?: "HALF_DEX";
    motherTongue?: "EDUCATION";
  }

  $effect(() => {
    const invDex = appState.currentStats.dex;
    const invEdu = appState.currentStats.edu;

    const dodge = skills.find((s: { evade: string; }) => s.evade === "HALF_DEX");
    if (dodge) dodge.base = Math.floor(invDex / 2);

    const native = skills.find((s: { motherTongue: string; }) => s.motherTongue === "EDUCATION");
    if (native) native.base = invEdu;
  });

  let totalInvested = $derived(
    skills.reduce((sum: any, skill: { point: any; }) => sum + (skill.point || 0), 0),
  );
  let remainingSkillPoint = $derived(baseSkillPoint - totalInvested);

  /**
   * 개별 스킬의 투자 포인트를 제한 범위 내에서 조정합니다.
   *
   * @param index - 조정할 스킬의 배열 인덱스
   */
  function adjustSkillPoint(index: number, newValue: number): void {
    const skill = skills[index];
    let points = Math.floor(newValue) || 0;

    // 제한 로직
    if (points < 0) points = 0;
    const maxForThisSkill = 100 - skill.base;
    if (points > maxForThisSkill) points = maxForThisSkill;

    // 예산 체크 (현재 스킬을 제외한 다른 스킬들의 합)
    const otherTotal = skills.reduce(
      (sum: any, s: { point: number; }, i: number) => sum + (i === index ? 0 : s.point),
      0,
    );
    const budgetLeft = baseSkillPoint - otherTotal;

    if (points > budgetLeft) points = Math.max(0, budgetLeft);

    skill.point = points; // $state이므로 내부 값만 바꿔도 즉시 반응합니다.
  }

  /**
   * 구글시트용 캐릭터 데이터를 생성해 클립보드로 복사합니다.
   */
  function copyToSheet(): void {
    if (!appState.currentStats) {
      console.log("error : 특성치 미존재.");
      return;
    }
    const CoCInvData = createGooglesheetData(
      appState.currentStats,
      { hp, mp, sanity, damage },
      remainingSkillPoint,
      skills,
      (key) => get(_)(key),
    );

    const textarea = document.createElement("textarea");
    textarea.value = CoCInvData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드에 복사됨");
      alert(get(_)("alert_sheet_success"));
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }

  /**
   * 코코포리아 채팅 팔레트용 캐릭터 데이터를 생성해 클립보드로 복사합니다.
   */
  function copyToData(): void {
    if (!appState.currentStats) {
      console.log("error : 특성치 미존재.");
      return;
    }

    const CoCInvData = createCocoPalette(
      appState.currentStats,
      { hp, mp, sanity, damage },
      skills,
      (key) => get(_)(key),
    );

    const textarea = document.createElement("textarea");
    textarea.value = CoCInvData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드에 복사됨");
      alert(get(_)("alert_coco_success"));
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }
</script>

<main>
  <div class="content-wrapper">
    <br /><br /><br />
    <div style="margin-top: 5px;">
      <br />
      <button onclick={() => onNavigate("main")}>M A I N</button>

      <button class="lang-btn" onclick={() => switchLang("kr")}>한</button>
      <button class="lang-btn" onclick={() => switchLang("jp")}>日</button>
      <button class="lang-btn" onclick={() => switchLang("en")}>EN</button>
    </div>
    <h4>{$_("title_after_confirm")}</h4>

    <div class="stats-grid">
      <p>{$_("str")}<strong>{appState.currentStats?.str ?? "N/A"}</strong></p>
      <p>{$_("con")} <strong>{appState.currentStats?.con ?? "N/A"}</strong></p>
      <p>{$_("siz")} <strong>{appState.currentStats?.siz ?? "N/A"}</strong></p>
      <p>{$_("dex")} <strong>{appState.currentStats?.dex ?? "N/A"}</strong></p>
      <p>{$_("app")} <strong>{appState.currentStats?.app ?? "N/A"}</strong></p>
      <p>{$_("edu")} <strong>{appState.currentStats?.edu ?? "N/A"}</strong></p>
      <p>{$_("int")} <strong>{appState.currentStats?.int ?? "N/A"}</strong></p>
      <p>{$_("pow")} <strong>{appState.currentStats?.pow ?? "N/A"}</strong></p>
      <p>{$_("luc")} <strong>{appState.currentStats?.luc ?? "N/A"}</strong></p>
    </div>
    <hr />
    <div class="derived-stats-grid">
      <p>{$_("hp")} <strong>{Math.floor(hp)}</strong></p>
      <p>{$_("mp")}<strong>{mp}</strong></p>
      <p>{$_("san")} <strong>{sanity}</strong></p>
      <p>{$_("db")}<strong>{damage}</strong></p>
    </div>
    <h4>{$_("skill_describe")}</h4>
    <p class="skill-points-display">
      {$_("skill_remaining")}: <strong>{remainingSkillPoint}</strong>
    </p>
    <div class="skill-grid-container">
      {#each skills as skill, i}
        <div class="skill-grid-item">
          <span class="skill-name">{$_(skill.name)} ({skill.base})</span>

          <input
            type="number"
            min="0"
            max={100 - skill.base}
            class="skill-input"
            bind:value={skill.point}
            oninput={() => adjustSkillPoint(i,parseInt(e.currentTarget.value))}
          />

          <span class="skill-total-score"
            >Total: {skill.point + skill.base}</span
          >
        </div>
      {/each}
    </div>
    <br />
    <div>
      <button onclick={copyToData}>{$_("copyToCoco")}</button>
      <button onclick={copyToSheet}>{$_("copyToSheet")}</button>
    </div>
    <br />
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center; /* 가운데 배치 */
  }

  .content-wrapper {
    width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  .lang-btn {
    background-color: dimgray;
  }
  .lang-btn {
    background-color: dimgray;
  }

  .stats-grid {
    display: grid;
    /* 3개의 열(column)을 만들고, 각 열이 동일한 공간(1fr)을 차지하도록 설정. */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }

  .stats-grid p {
    background-color: #70b5e7;
    padding: 8px;
    border-radius: 8px;
    text-align: center;
    margin: 0;
    font-size: 1em;
    color: #fefeff;
  }

  .stats-grid strong {
    display: block;
    font-size: 1.4em;
    color: #0f172a;
  }

  .derived-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .derived-stats-grid p {
    background-color: #4084ed;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    margin: 0;
    font-size: 0.9em;
    color: #fefeff;
  }

  .derived-stats-grid strong {
    display: block;
    font-size: 1.2em;
    color: #ddd;
  }

  .skill-points-display {
    font-size: 1.1em;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
    text-align: center;
    margin-bottom: 15px;
  }

  .skill-grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;

    max-height: 220px;
    overflow-y: auto;
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 5px;
  }

  .skill-grid-item {
    display: flex;
    flex-direction: column; /* 세로로 쌓기 */
    align-items: stretch;
    text-align: center;
    justify-content: space-between;
    background-color: #f9f9f9;
    padding: 5px;
    border-radius: 4px;
    font-size: 0.8em;
    color: #063a73;
    border: 1px solid #ddd;
  }

  .skill-name {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    margin-bottom: 2px;
  }

  .return-button {
    padding: 8px 15px 8px 15px;
    min-width: 250;
    height: auto;
    box-sizing: border-box;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    background-color: #5877f9;
    border: 2px solid #5877f9;
    color: #ffffff;
  }
</style>
