<script lang="ts">
  import { AppState } from './store';

  
   // Store에서 확정된 크툴루의 부름 탐사자의 특성치를 연계한다 
    $: stats = $AppState.currentStats;

   // 탐사자의 특성치를 활용한 기타 능력치들을 생성한다
    $: sanity = stats ? stats.pow : 0;
    $: hp = stats ? (stats.siz + stats.con)/10 : 0;
    $: mp = stats ? (stats.pow)/5 : 0;

    $: interest = stats ? (stats.int)*2 : 0;
    $: job = stats ? (stats.edu)*4 : 0;

      let skillPoint: number;
      $: skillPoint = interest+job;


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


   function goBack() : void {
       // 탐사자의 특성치를 다시 초기화한다
        AppState.set({ currentStats: null, isConfirmed: false });

        console.log("AppState" + AppState)
        console.log(stats)
   }


   // 크툴루의 부름 탐사자 기능들에 대한 설명
   interface Skills {
    name: string;
    point: number;

   }

   let skills: Skills[] = [
    {name: "Accounting" ,point: 0},
    {name: "Anthropology" ,point: 0},
    {name: "Appraise" ,point: 0},
    {name: "Archaeology" ,point: 0},
    {name: "Charm" ,point: 0},
    {name: "Climb" ,point: 0},
    {name: "Computer Use" ,point: 0},
    {name: "Credit" ,point: 0},
    {name: "Cthulhu Mythos" ,point: 0},
    {name: "Disguise" ,point: 0},
    {name: "Dodge" ,point: 0},
    {name: "Drive Auto" ,point: 0},
    {name: "Elec. Repair" ,point: 0},
    {name: "Electronics" ,point: 0},
    {name: "Fast Talk" ,point: 0},
    {name: "Fighting (Brawl)" ,point: 0},
    {name: "Firearms (Handgun)" ,point: 0},
    {name: "Firearms (Rifle/Shotgun)" ,point: 0},
    {name: "First Aid" ,point: 0},
    {name: "History" ,point: 0},
    {name: "Intimidate" ,point: 0},
    {name: "Jump" ,point: 0},
    {name: "Language(Mother)" ,point: 0},
    {name: "Language()" ,point: 0},
    {name: "Law" ,point: 0},
    {name: "Library Use" ,point: 0},
    {name: "Listen" ,point: 0},
    {name: "Locksmith" ,point: 0},
    {name: "Mech. Repair" ,point: 0},
    {name: "Medicine" ,point: 0},
    {name: "Natural World" ,point: 0},
    {name: "Navigate" ,point: 0},
    {name: "Occult" ,point: 0},
    {name: "Persuade" ,point: 0},
    {name: "Pilot()" ,point: 0},
    {name: "Psychoanalysis" ,point: 0},
    {name: "Psychology" ,point: 0},
    {name: "Ride" ,point: 0},
    {name: "Science()" ,point: 0},
    {name: "Sleight of Hand" ,point: 0},
    {name: "Spot Hidden" ,point: 0},
    {name: "Stealth" ,point: 0},
    {name: "Survival()" ,point: 0},
    {name: "Swim" ,point: 0},
    {name: "Throw" ,point: 0},
    {name: "Track" ,point: 0},
    {name: "[extra1]" ,point: 0},
    {name: "[extra2]" ,point: 0},
    {name: "[extra3]" ,point: 0},

  ]

function investSkill(index: number) : void {

  if(skillPoint > 0 && skills[index].point < 100) {
    skillPoint -=1 ;
    skills[index].point += 1;
    skills = skills;
  }
}

  function resetSkill(index: number) : void {

  if(skills[index].point > 0 ) {
    skillPoint +=1 ;
    skills[index].point -= 1;
    skills = skills;
  }

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
<p class="skill-points-display">남은 스킬 포인트: <strong>{skillPoint}</strong></p>
<div class="skill-grid-container"> 

    {#each skills as skill, i}
      <div class="skill-grid-item">
            <span class="skill-name">{skill.name}</span>
            <span class="skill-score">{skill.point}</span>
        <div class="skill-item-buttons">
            <button on:click={() => resetSkill(i)} disabled={skill.point === 0}>
                -
            </button>
            
            <button 
                on:click={() => investSkill(i)} 
                disabled={skillPoint === 0 || skill.point === 100}
            >
                +
            </button>
        </div>
      </div>
    {/each}
</div>
<hr>

<button on:click={goBack}>다시 만들기</button>
<button>지금 바로 생성하기 </button>
</main>


<style>

  /* 🌟 능력치 그리드 스타일 🌟 */
    .stats-grid {
        display: grid;
        /* 3개의 열(column)을 만들고, 각 열이 동일한 공간(1fr)을 차지하도록 설정합니다. */
        grid-template-columns: 1fr 1fr 1fr; 
        gap: 10px; /* 항목 사이의 간격 설정 */
        margin-bottom: 20px;
    }

    /* 그리드 항목(각 능력치 <p> 태그)의 스타일 */
    .stats-grid p {
        background-color: #f4f4f4; /* 배경색으로 항목 구분 */
        padding: 8px;
        border-radius: 4px;
        text-align: center;
        margin: 0; /* <p> 태그의 기본 마진 제거 */
        font-size: 0.9em;
        color: #333;
    }
    
    .stats-grid strong {
        display: block; /* 수치를 다음 줄로 내려서 강조 */
        font-size: 1.2em;
        color: #007bff; /* 능력치 값 색상 강조 */
    }


    /* 🌟 파생 수치 그리드 스타일 (1) 🌟 */
    .derived-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr; 
        gap: 10px; 
        margin-bottom: 20px;
    }

    /* 파생 수치 항목에도 기본 능력치와 동일한 스타일을 적용합니다. */
    .derived-stats-grid p {
        background-color: #f4f4f4; 
        padding: 8px;
        border-radius: 4px;
        text-align: center;
        margin: 0;
        font-size: 0.9em;
        color: #333; /* 능력치 이름 색상 */
    }
    
    .derived-stats-grid strong {
        display: block;
        font-size: 1.2em;
        color: #dc3545; /* 파생 수치는 빨간 계열로 구분하여 강조해보겠습니다. */
    }

      .skill-points-display {
        font-size: 1.1em;
        font-weight: bold;
        padding-bottom: 10px;
        border-bottom: 2px solid #ddd;
        text-align: center;
        margin-bottom: 15px;
    }

    /* 🌟 스킬 그리드 컨테이너 (스크롤 영역 + 4열 배치) 🌟 */
    .skill-grid-container {
        display: grid;
        /* 4개의 열을 만들고, 각 열이 동일한 공간을 차지하도록 설정 */
        grid-template-columns: repeat(4, 1fr); 
        gap: 8px; /* 그리드 항목 사이의 간격 */
        
        /* 팝업 창의 일반적인 높이 (400px)를 고려하여 스크롤 높이 지정 */
        max-height: 220px; 
        overflow-y: auto; /* 내용이 넘치면 수직 스크롤 생성 */
        padding: 5px; /* 스크롤바와 내용 사이의 여백 */
        border: 1px solid #eee;
        border-radius: 5px;
    }
    
    /* 🌟 개별 스킬 항목 스타일 🌟 */
    .skill-grid-item {
        display: flex; /* 항목 내부 요소 정렬을 위해 Flexbox 사용 */
        flex-direction: column; /* 세로로 쌓기 */
        align-items: center;
        text-align: center;
        background-color: #f9f9f9;
        padding: 5px;
        border-radius: 4px;
        font-size: 0.8em; /* 좁은 공간에 맞추어 글자 크기 조정 */
        color: #333;
        border: 1px solid #ddd;
    }
    
    .skill-name {
        font-weight: bold;
        /* 넘치는 스킬 이름 처리를 위해 설정 */
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; /* ... 표시 */
        max-width: 100%;
        margin-bottom: 2px;
    }
    
    .skill-score {
        font-size: 1.2em;
        color: #007bff;
        margin-bottom: 5px;
    }
    
    .skill-item-buttons {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .skill-item-buttons button {
        width: 40%; /* 버튼 너비를 좁혀서 공간 확보 */
        padding: 2px;
        font-size: 0.9em;
        /* ... (기존 버튼 스타일 유지) ... */
        margin: 0 2px;
    }
    

</style>