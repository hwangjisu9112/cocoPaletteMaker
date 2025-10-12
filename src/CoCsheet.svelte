<script lang="ts">
    import { AppState, EMPTY_STATS} from './store';
  import { onMount } from 'svelte';
  
   // Store에서 확정된 크툴루의 부름 탐사자의 특성치를 연계한다 
    $: stats = $AppState.currentStats;

   // 탐사자의 특성치를 활용한 기타 능력치들을 생성한다
    $: sanity = stats ? stats.pow : 0;
    $: hp = stats ? (stats.siz + stats.con)/10 : 0;
    $: mp = stats ? (stats.pow)/5 : 0;

    $: interest = stats ? (stats.int)*2 : 0;
    $: job = stats ? (stats.edu)*4 : 0;

      let skillPoint: number;
      $: baseSkillPoint = interest+job;


    $: db = stats ? (stats.siz + stats.str) : 0;

      let damage : string = "0";
$: {
    if(db <= 64) {
      damage = "-2";
    } else if(db <= 84) {
      damage = "-1";
    } else if(db <= 124) {
      damage = "0";
    } else if(db <= 164) {
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

   }

   let skills: Skills[] = [
    {name: "예술/공예()" ,point: 0, base: 5},
    {name: "회계" ,point: 0, base: 5},
    {name: "인류학" ,point: 0, base: 5},
    {name: "감정" ,point: 0, base: 5},
    {name: "고고학" ,point: 0, base: 5},
    {name: "매혹" ,point: 0, base: 5},
    {name: "오르기" ,point: 0, base: 5},
    {name: "컴퓨터 사용" ,point: 0, base: 5},
    {name: "재력" ,point: 0, base: 5},
    {name: "변장" ,point: 0, base: 5},
    {name: "회피" ,point: 0, base: 5},
    {name: "자동차 운전" ,point: 0, base: 5},
    {name: "전기 수리" ,point: 0, base: 5},
    {name: "전자기기" ,point: 0, base: 5},
    {name: "말재주" ,point: 0, base: 5},
    {name: "근접전 (격투)" ,point: 0, base: 5},
    {name: "사격 (권총)" ,point: 0, base: 5},
    {name: "사격(라이플/산탄총)" ,point: 25, base: 5},
    {name: "응급처치" ,point: 0, base: 5},
    {name: "역사" ,point: 0, base: 5},
    {name: "위협" ,point: 0, base: 5},
    {name: "도약" ,point: 0, base: 5},
    {name: "언어(모국어)" ,point: 0, base: 5},
    {name: "언어()" ,point: 0, base: 5},
    {name: "법률" ,point: 0, base: 5},
    {name: "자료조사" ,point: 0, base: 5},
    {name: "듣기" ,point: 0, base: 5},
    {name: "열쇠공" ,point: 0, base: 5},
    {name: "기계 수리" ,point: 0, base: 5},
    {name: "의학" ,point: 0, base: 5},
    {name: "자연" ,point: 0, base: 5},
    {name: "항법" ,point: 0, base: 5},
    {name: "오컬트" ,point: 0, base: 5},
    {name: "설득" ,point: 0, base: 5},
    {name: "조종()" ,point: 0, base: 5},
    {name: "정신분석" ,point: 0, base: 5},
    {name: "심리학" ,point: 0, base: 5},
    {name: "승마" ,point: 0, base: 5},
    {name: "과학()" ,point: 0, base: 5},
    {name: "손놀림" ,point: 0, base: 5},
    {name: "관찰력" ,point: 0, base: 5},
    {name: "은밀행동" ,point: 0, base: 5},
    {name: "생존술()" ,point: 0, base: 5},
    {name: "수영" ,point: 0, base: 5},
    {name: "투척" ,point: 0, base: 5},
    {name: "추적" ,point: 0, base: 5},
    {name: "[추가기능 1]" ,point: 0, base: 5},
    {name: "[추가기능 2]" ,point: 0, base: 5},
    {name: "[추가기능 3]" ,point: 0, base: 5},

  ]

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
    
    
    const totalInvestedOthers = skills.reduce((sum, s, i) => sum + (i === index ? 0 : s.point), 0);
    
    const maxPointFromBudget = baseSkillPoint - totalInvestedOthers;
    
    if (newInvestedPoint > maxPointFromBudget) {
        newInvestedPoint = Math.max(0, maxPointFromBudget); 
    }
    
    skill.point = newInvestedPoint;
    skills = skills; 
  }


  
   function goBack() : void {
       // 탐사자의 특성치를 다시 초기화한다
        AppState.set({ currentStats: EMPTY_STATS, isConfirmed: false });

        console.log("다시 만들기 수행")
        console.log("AppState")
        console.log(AppState)
        console.log(AppState)
   }



</script>

<main>
<h2> 탐사자 생성 결과</h2>
<h3>특성치</h3>
<hr>
<div class="stats-grid"> 
    <p>근력 <strong>{stats?.str ?? 'N/A'}</strong></p>
    <p>건강 <strong>{stats?.con ?? 'N/A'}</strong></p>
    <p>크기 <strong>{stats?.siz ?? 'N/A'}</strong></p>
    <p>민첩성 <strong>{stats?.dex ?? 'N/A'}</strong></p>
    <p>외모 <strong>{stats?.app ?? 'N/A'}</strong></p>
    <p>교육 <strong>{stats?.edu ?? 'N/A'}</strong></p>
    <p>지능 <strong>{stats?.int ?? 'N/A'}</strong></p>
    <p>정신력 <strong>{stats?.pow ?? 'N/A'}</strong></p>
    <p>행운 <strong>{stats?.luc ?? 'N/A'}</strong></p>
</div>
<hr>
<h3>기타 수치</h3>
<hr>
  <div class="derived-stats-grid"> 
 <p>체력 <strong>{Math.floor(hp)}</strong></p>
 <p>마력<strong>{mp}</strong></p>
 <p>이성 <strong>{sanity}</strong></p>
 <p>체구 피해보너스<strong>{damage}</strong></p>
 </div>
<hr>
<h3>기능</h3>
<p class="skill-points-display">남은 기능 점수(지능 * 2 + 교육 * 4): <strong>{skillPoint}</strong></p>
<div class="skill-grid-container"> 

    {#each skills as skill, i}
      <div class="skill-grid-item">
            <span class="skill-name">{skill.name} ({skill.base})</span> 
            
            <input 
                type="number" 
                min="0" 
                max="{100 - skill.base}"
                class="skill-input"
                bind:value={skill.point}
                on:input={() => adjustSkillPoint(i)} 
            />
            
            <span class="skill-total-score">총점: {skill.point + skill.base}</span>

      </div>
    {/each}
</div>
<hr>

<button on:click={goBack}>다시 만들기</button>
<button>지금 바로 생성하기 </button>
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
        background-color: #f4f4f4;
        padding: 8px;
        border-radius: 4px;
        text-align: center;
        margin: 0; 
        font-size: 0.9em;
        color: #333;
    }
    
    .stats-grid strong {
        display: block; 
        font-size: 1.2em;
        color: #007bff; 
    }

    .derived-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr; 
        gap: 10px; 
        margin-bottom: 20px;
    }

    .derived-stats-grid p {
        background-color: #f4f4f4; 
        padding: 8px;
        border-radius: 4px;
        text-align: center;
        margin: 0;
        font-size: 0.9em;
        color: #333; 
    }
    
    .derived-stats-grid strong {
        display: block;
        font-size: 1.2em;
        color: #dc3545; 
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
        color: #333;
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