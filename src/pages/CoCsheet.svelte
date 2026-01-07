<!-- <script lang="ts">
  import { appState } from "../store";
  import { get } from "svelte/store";
  import { INITIAL_SKILLS } from "./CoCskill";
  import { createGooglesheetData, createCocoPalette } from "./CoCsheetStyle";
  import { _, locale, isLoading } from "svelte-i18n";
  import "./i18n.js";

  /**
   * 현재 화면의 표시 언어를 변경합니다.
   *
   * @param lang - 설정할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }

  // Store에서 확정된 크툴루의 부름 탐사자의 특성치를 연계한다
  $: stats = $AppState.currentStats;

  // 탐사자의 특성치를 활용한 기타 능력치들을 생성한다
  $: sanity = stats ? stats.pow : 0;
  $: hp = stats ? (stats.siz + stats.con) / 10 : 0;
  $: mp = stats ? stats.pow / 5 : 0;

  $: interest = stats ? stats.int * 2 : 0;
  $: job = stats ? stats.edu * 4 : 0;

  let skillPoint: number;
  $: baseSkillPoint = interest + job;

  $: db = stats ? stats.siz + stats.str : 0;

  let damage: string = "0";
  $: {
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

  let skills: Skills[] = JSON.parse(JSON.stringify(INITIAL_SKILLS));

  $: if (stats) {
    const invDex = stats.dex;
    const invMotherTongue = stats.edu;

    const dodgeIndex = skills.findIndex((s) => s.evade === "HALF_DEX");
    const native = skills.findIndex((s) => s.motherTongue === "EDUCATION");

    if (dodgeIndex !== -1) {
      const basicDodge = Math.floor(invDex / 2);
      skills[dodgeIndex].base = basicDodge;
      skills = skills;
      adjustSkillPoint(dodgeIndex);
    }

    if (native !== -1) {
      const basicNative = invMotherTongue;
      skills[native].base = basicNative;
      skills = skills;
      adjustSkillPoint(native);
    }
  }

  $: {
    const totalInvested = skills.reduce((sum, skill) => sum + skill.point, 0);

    skillPoint = baseSkillPoint - totalInvested;
  }

  /**
   * 개별 스킬의 투자 포인트를 제한 범위 내에서 조정합니다.
   *
   * @param index - 조정할 스킬의 배열 인덱스
   */
  function adjustSkillPoint(index: number): void {
    const skill = skills[index];
    let newInvestedPoint = Math.floor(skill.point) || 0;

    if (newInvestedPoint < 0 || isNaN(newInvestedPoint)) {
      newInvestedPoint = 0;
    }
    const maxInvestForSkill = 100 - skill.base;
    if (newInvestedPoint > maxInvestForSkill) {
      newInvestedPoint = maxInvestForSkill;
    }

    const totalInvestedOthers = skills.reduce(
      (sum, s, i) => sum + (i === index ? 0 : s.point),
      0,
    );

    const maxPointFromBudget = baseSkillPoint - totalInvestedOthers;

    if (newInvestedPoint > maxPointFromBudget) {
      newInvestedPoint = Math.max(0, maxPointFromBudget);
    }

    skill.point = newInvestedPoint;
    skills = skills;
  }

  /**
   * 능력치를 초기화하고 능력치 생성 화면으로 되돌아갑니다.
   */


  /**
   * 구글시트용 캐릭터 데이터를 생성해 클립보드로 복사합니다.
   */
  function copyToSheet(): void {
    if (!stats) {
      console.log("error : 특성치 미존재.");
      return;
    }
    const CoCInvData = createGooglesheetData(
      stats,
      { hp, mp, sanity, damage },
      skillPoint,
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
    if (!stats) {
      console.log("error : 특성치 미존재.");
      return;
    }

    const CoCInvData = createCocoPalette(
      stats,
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
    <br /><br /><br /><br /><br /><br /><br />
    <div style="margin-top: 5px;">
      <br /><br /><br /><br /><br />
      <button class="lang-btn" on:click={() => switchLang("kr")}>한국어</button>
      <button class="lang-btn" on:click={() => switchLang("jp")}>日本語</button>
      <button class="lang-btn" on:click={() => switchLang("en")}>ENG</button>
    </div>
    <h4>{$_("title_after_confirm")}</h4>

    <div class="stats-grid">
      <p>{$_("str")}<strong>{stats?.str ?? "N/A"}</strong></p>
      <p>{$_("con")} <strong>{stats?.con ?? "N/A"}</strong></p>
      <p>{$_("siz")} <strong>{stats?.siz ?? "N/A"}</strong></p>
      <p>{$_("dex")} <strong>{stats?.dex ?? "N/A"}</strong></p>
      <p>{$_("app")} <strong>{stats?.app ?? "N/A"}</strong></p>
      <p>{$_("edu")} <strong>{stats?.edu ?? "N/A"}</strong></p>
      <p>{$_("int")} <strong>{stats?.int ?? "N/A"}</strong></p>
      <p>{$_("pow")} <strong>{stats?.pow ?? "N/A"}</strong></p>
      <p>{$_("luc")} <strong>{stats?.luc ?? "N/A"}</strong></p>
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
      {$_("skill_remaining")}: <strong>{skillPoint}</strong>
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
            on:input={() => adjustSkillPoint(i)}
          />

          <span class="skill-total-score"
            >Total: {skill.point + skill.base}</span
          >
        </div>
      {/each}
    </div>
    <br />
    <div>
      <button on:click={copyToData}>{$_("copyToCoco")}</button>
      <button on:click={copyToSheet}>{$_("copyToSheet")}</button>
    </div>
    <br />
    <button class="return-button" on:click={goBack}>{$_("remake")}</button>
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
</style> -->
