<script lang="ts">
  import { AppState } from "./store";
  import { INITIAL_SKILLS } from "./CoCskill";
  import { createGooglesheetData, createCocoPalette } from "./CoCsheetStyle";
  import { onMount } from "svelte";

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

  function goBack(): void {
    // 탐사자의 특성치를 다시 초기화하고 특성치 생성 페이지로 복귀한다
    const zeroStats = {
      str: 0,
      con: 0,
      siz: 0,
      dex: 0,
      app: 0,
      edu: 0,
      int: 0,
      pow: 0,
      luc: 0,
    };

    AppState.set({ currentStats: zeroStats, isConfirmed: false });

    console.log("다시 만들기 수행 -> 생성 페이지로 복귀");

    console.log("AppState");
    console.log(AppState);
    console.log(zeroStats);
  }

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
    );

    const textarea = document.createElement("textarea");
    textarea.value = CoCInvData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드에 복사됨");
      alert(
        "탐사자 정보가 클립보드에 복사됐습니다 \n빈 구글 시트의 A1셀에 ctrl + v를 입력하세요",
      );
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }

  function copyToData(): void {
    if (!stats) {
      console.log("error : 특성치 미존재.");
      return;
    }

    const CoCInvData = createCocoPalette(
      stats,
      { hp, mp, sanity, damage },
      skillPoint,
      skills,
    );

    const textarea = document.createElement("textarea");
    textarea.value = CoCInvData;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("클립보드에 복사됨");
      alert(
        "탐사자 정보가 클립보드에 복사됐습니다 \n코코포리아의 채팅 팔레트에 ctrl + v를 입력하세요"
      );
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }
</script>

<main>
  <br /><br /><br /><br /><br />
  <div class="stats-grid">
    <p>근력 <strong>{stats?.str ?? "N/A"}</strong></p>
    <p>건강 <strong>{stats?.con ?? "N/A"}</strong></p>
    <p>크기 <strong>{stats?.siz ?? "N/A"}</strong></p>
    <p>민첩성 <strong>{stats?.dex ?? "N/A"}</strong></p>
    <p>외모 <strong>{stats?.app ?? "N/A"}</strong></p>
    <p>교육 <strong>{stats?.edu ?? "N/A"}</strong></p>
    <p>지능 <strong>{stats?.int ?? "N/A"}</strong></p>
    <p>정신력 <strong>{stats?.pow ?? "N/A"}</strong></p>
    <p>행운 <strong>{stats?.luc ?? "N/A"}</strong></p>
  </div>
  <hr />
  <div class="derived-stats-grid">
    <p>체력 <strong>{Math.floor(hp)}</strong></p>
    <p>마력<strong>{mp}</strong></p>
    <p>이성 <strong>{sanity}</strong></p>
    <p>체구 피해보너스<strong>{damage}</strong></p>
  </div>
  <hr />
  <h4>기능</h4>
  <p class="skill-points-display">
    남은 기능 점수: <strong>{skillPoint}</strong>
  </p>
  <div class="skill-grid-container">
    {#each skills as skill, i}
      <div class="skill-grid-item">
        <span class="skill-name">{skill.name} ({skill.base})</span>

        <input
          type="number"
          min="0"
          max={100 - skill.base}
          class="skill-input"
          bind:value={skill.point}
          on:input={() => adjustSkillPoint(i)}
        />

        <span class="skill-total-score">총점: {skill.point + skill.base}</span>
      </div>
    {/each}
  </div>
  <hr />

  <button on:click={goBack}>다시 만들기</button>
  <button on:click={copyToData}> 코코포리아에 붙여넣기</button>
  <button on:click={copyToSheet}> 구글 시트에 붙여넣기</button>
</main>

<style>
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
    border-radius: 4px;
    text-align: center;
    margin: 0;
    font-size: 0.9em;
    color: #fefeff;
  }

  .stats-grid strong {
    display: block;
    font-size: 1.2em;
    color: #063a73;
  }

  .derived-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
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
    grid-template-columns: repeat(4, 1fr);
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
    align-items: center;
    text-align: center;
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
</style>
