<script lang="ts">
  import { AppState } from './store';
  import Result from './CoCsheet.svelte';
  $: state = $AppState;


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

let CharacteristicsStatus : Characteristics = {
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


function confirmStat(): void {

  if(!state.currentStats) {
    alert("먼저 특성치를 굴려주세요")
    console.log(CharacteristicsStatus)
    return
  };

    AppState.update(s => ({ ...s, isConfirmed: true }));

    if(chrome && chrome.storage) {
      chrome.storage.local.set({ confirmedStats: state.currentStats }, () => {
       console.log('확정된 능력치가 크롬 저장소에 저장되었습니다.');
        });
    }
}
 
</script>
{#if !$AppState.isConfirmed}

<main>
  <h1> 크툴루의 부름 탐사자 특성치 생성기 </h1>

  <button on:click={rollCOC}>특성치 생성</button>
  <button on:click={confirmStat}>확정하기</button>

  <p>근력 (STR): <strong>{CharacteristicsStatus?.str ?? 0}</strong></p>
  <p>건강 (CON): <strong>{CharacteristicsStatus?.con ?? 0}</strong></p>
  <p>크기 (SIZ): <strong>{CharacteristicsStatus?.siz ?? 0}</strong></p>
  <p>민첩성 (DEX): <strong>{CharacteristicsStatus?.dex ?? 0}</strong></p>
  <p>외모 (APP): <strong>{CharacteristicsStatus?.app ?? 0}</strong></p>
  <p>교육 (EDU): <strong>{CharacteristicsStatus?.edu ?? 0}</strong></p>
  <p>지능 (INT): <strong>{CharacteristicsStatus?.int ?? 0}</strong></p>
  <p>정신력 (POW): <strong>{CharacteristicsStatus?.pow ?? 0}</strong></p>
  <p>행운 (LUCK): <strong>{CharacteristicsStatus?.luc ?? 0}</strong></p>


</main>
{:else}
    <Result />
{/if}


<style>

</style>