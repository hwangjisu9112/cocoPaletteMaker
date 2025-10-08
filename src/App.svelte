<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

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

}
 
</script>

<main>
  <h1> 크툴루의 부름 탐사자 특성치 생성기 </h1>

  <button on:click={rollCOC}>능력치 굴리기</button>

  <p>근력 (STR): <strong>{CharacteristicsStatus.str}</strong></p>
  <p>건강 (CON): <strong>{CharacteristicsStatus.con}</strong></p>
  <p>크기 (SIZ): <strong>{CharacteristicsStatus.siz}</strong></p>
  <p>민첩성 (DEX): <strong>{CharacteristicsStatus.dex}</strong></p>
  <p>외모 (APP): <strong>{CharacteristicsStatus.app}</strong></p>
  <p>교육 (EDU): <strong>{CharacteristicsStatus.edu}</strong></p>
  <p>지능 (INT): <strong>{CharacteristicsStatus.int}</strong></p>
  <p>정신력 (POW): <strong>{CharacteristicsStatus.pow}</strong></p>
  <p>행운 (LUCK): <strong>{CharacteristicsStatus.luc}</strong></p>

</main>

<style>
  main {
    padding: 15px;
    font-family: Arial, sans-serif;
  }
  h1 {
    color: #4CAF50;
    font-size: 1.2em;
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
  }
  button {
    background-color: #008CBA;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 10px;
  }
</style>