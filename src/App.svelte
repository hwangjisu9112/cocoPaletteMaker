<script lang="ts">
  import Main from "./pages/MainPage.svelte";
  import CoCroll from "./pages/CoCRoll.svelte";

  // 현재 페이지 상태 관리 (기본값: 'main')
  let currentPage = $state("main");

  function navigate(page: string) {
    currentPage = page;
  }
</script>

<main>
{#if currentPage === 'main'}
    <Main onNavigate={navigate} />
   {:else if currentPage === 'CoCgen'}
     <CoCroll onNavigate={navigate} /> 
  {/if}
</main>

<style>

  
</style>
