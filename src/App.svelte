<script lang="ts">
  import { AppState } from './store';
  import Result from './CoCsheet.svelte';


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

// AppState に合わせて常に同期
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

<main>
  <h2> 크툴루의 부름 탐사자 특성치 생성기 </h2>

  <button on:click={rollCOC}>특성치 생성</button>
  <button on:click={resetStats}>특성치 초기화</button>
  <button on:click={confirmStat}>확정하기</button>
<div class="stats-grid"> 
  <p>근력 (STR): <strong>{CharacteristicsStatus.str}</strong></p>
  <p>건강 (CON): <strong>{CharacteristicsStatus.con}</strong></p>
  <p>크기 (SIZ): <strong>{CharacteristicsStatus.siz}</strong></p>
  <p>민첩성 (DEX): <strong>{CharacteristicsStatus.dex}</strong></p>
  <p>외모 (APP): <strong>{CharacteristicsStatus.app }</strong></p>
  <p>교육 (EDU): <strong>{CharacteristicsStatus.edu }</strong></p>
  <p>지능 (INT): <strong>{CharacteristicsStatus.int }</strong></p>
  <p>정신력 (POW): <strong>{CharacteristicsStatus.pow }</strong></p>
  <p>행운 (LUCK): <strong>{CharacteristicsStatus.luc }</strong></p>
</div>

</main>
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
</style>