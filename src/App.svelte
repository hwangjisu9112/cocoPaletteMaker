<script lang="ts">
  import { AppState } from './store';
  import { StatDescriptions } from './CoCtooltip';
  import Result from './CoCsheet.svelte';
  import image01 from './assets/image01.png'


//TRPG Call Of Cthulhu 7판(기본)의 탐사자 특성치 정의

interface Characteristics {
  str: number;
  con: number;
  siz: number;
  dex: number;
  app: number;
  edu: number;
  int: number;
  pow: number; 
  luc: number; 

}

const zeroStats: Characteristics = {
  str: 0,
  con: 0,
  siz: 0,
  dex: 0,
  app: 0,
  edu: 0,
  int: 0,
  pow: 0,
  luc: 0
}

let CharacteristicsStatus: Characteristics = zeroStats;

$: CharacteristicsStatus = $AppState.currentStats ?? zeroStats;

//TRPG Call Of Cthulhu 7판(기본)의 탐사자 특성치를 무작위로 생성하는 func

function rollDie(times: number, value:number): number {

    let rollResult= 0;

    for (let i = 0; i < times; i++) {
        rollResult += Math.floor(Math.random() * value) + 1;
    }
    return rollResult;

}

function rollCOC(): void {

  const rolledStr = rollDie(3,6) * 5;
  const rolledCon = rollDie(3,6) * 5;
  const rolledSiz = (rollDie(2, 6) + 6) * 5;
  const rolledDex = rollDie(3,6) * 5;
  const rolledApp = rollDie(3,6) * 5;
  const rolledEdu = (rollDie(2, 6) + 6) * 5;
  const rolledInt = (rollDie(2, 6) + 6) * 5;
  const rolledPow = rollDie(3,6) * 5;
  const rolledLuc = rollDie(3,6) * 5;


   CharacteristicsStatus = {
    str: rolledStr,
    con: rolledCon,
    siz: rolledSiz,
    dex: rolledDex,
    app: rolledApp,
    edu: rolledEdu,
    int: rolledInt,
    pow: rolledPow,
    luc: rolledLuc
  };

  const newStat = {
    str: rolledStr,
    con: rolledCon,
    siz: rolledSiz,
    dex: rolledDex,
    app: rolledApp,
    edu: rolledEdu,
    int: rolledInt,
    pow: rolledPow,
    luc: rolledLuc
    
  };

  AppState.update(s => ({ ...s, currentStats: newStat }));

  console.log("특성치 생성됨")
  console.log(CharacteristicsStatus)

}
let tooltipContent: string = '';
let showTooltip: boolean = false;
let tooltipX: number = 0;
let tooltipY: number = 0;

function mouseOver(event: MouseEvent, statKey: keyof Characteristics) {
    tooltipContent = StatDescriptions[statKey];
    showTooltip = true;
    handleMouseMove(event); // 마우스 오버 시 바로 위치 설정
}

function handleMouseMove(event: MouseEvent): void {
    if (showTooltip) {
        // 커서 위치에서 살짝 오른쪽/아래(15px)로 툴팁을 이동시켜 커서 가림 방지
        tooltipX = event.clientX + 15; 
        tooltipY = event.clientY + 15;
    }
}

function mouseOut(): void {
    showTooltip = false;
    tooltipContent = '';
}


function resetStats() : void {
  CharacteristicsStatus = zeroStats;
  AppState.update(s => ({ ...s, currentStats: zeroStats })); 
  console.log("특성치 초기화됨");
  console.log(CharacteristicsStatus);
}

function confirmStat(): void {

   
    AppState.update(s => ({ ...s, isConfirmed: true }));
    console.log("확정 -> 다음 페이지 이동")
    console.log(CharacteristicsStatus)

}
 
</script>
{#if !$AppState.isConfirmed}

<main on:mousemove={handleMouseMove}>
  <img src= {image01} alt="Icon"  width="200">
  <h2> 크툴루의 부름 탐사자 특성치 생성기 </h2>

  <button on:click={rollCOC}>특성치 생성</button>
  <button on:click={resetStats}>특성치 초기화</button>
  <button on:click={confirmStat}>확정하기</button>
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div class="stats-grid"> 
  <p on:mouseover={(e) => mouseOver(e, 'str')} on:mouseout={mouseOut}>근력 (STR): <strong>{CharacteristicsStatus.str}</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'con')} on:mouseout={mouseOut}>건강 (CON): <strong>{CharacteristicsStatus.con}</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'siz')} on:mouseout={mouseOut}>크기 (SIZ): <strong>{CharacteristicsStatus.siz}</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'dex')} on:mouseout={mouseOut}>민첩성 (DEX): <strong>{CharacteristicsStatus.dex}</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'app')} on:mouseout={mouseOut}>외모 (APP): <strong>{CharacteristicsStatus.app }</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'edu')} on:mouseout={mouseOut}>교육 (EDU): <strong>{CharacteristicsStatus.edu }</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'int')} on:mouseout={mouseOut}>지능 (INT): <strong>{CharacteristicsStatus.int }</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'pow')} on:mouseout={mouseOut}>정신력 (POW): <strong>{CharacteristicsStatus.pow }</strong></p>
  <p on:mouseover={(e) => mouseOver(e, 'luc')} on:mouseout={mouseOut}>행운 (LUCK): <strong>{CharacteristicsStatus.luc }</strong></p>
</div>

<button class="guide-button">🤔 사용 방법</button>


</main>
{#if showTooltip}
    <div class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
        {tooltipContent}
    </div>
{/if}

{:else}
    <Result />
{/if}


<style>
    .stats-grid {
        display: grid;
        /* 3개의 열(column)을 만들고, 각 열이 동일한 공간(1fr)을 차지하도록 설정. */
        grid-template-columns: 1fr 1fr 1fr; 
        gap: 10px; 
        margin-bottom: 20px;

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

  .guide-button {
    width: 250px
  }
  
</style>