<script lang="ts">
  import { AppState } from './store';

  
   // Store에서 확정된 크툴루의 부름 탐사자의 특성치를 연계한다 
    $: stats = $AppState.currentStats;

   // 탐사자의 특성치를 활용한 기타 능력치들을 생성한다
    $: sanity = stats ? stats.pow : 0;
    $: hp = stats ? (stats.siz + stats.con)/10 : 0;
    $: mp = stats ? (stats.pow)/5 : 0;

    $: featureOfInterest = stats ? (stats.int)*2 : 0;
    $: featureOfJob = stats ? (stats.edu)*4 : 0;

    $: db = stats ? (stats.siz + stats.str) : 0;


   function goBack() : void {
       // 탐사자의 특성치를 다시 초기화한다
        AppState.set({ currentStats: null, isConfirmed: false });
   }

</script>

<main>
<h1> 탐사자 생성 결과</h1>
<h2>특성치</h2>

<h2>기타 수치</h2>

<h2>기능치</h2>

<button on:click={goBack}>다시 만들기</button>
</main>