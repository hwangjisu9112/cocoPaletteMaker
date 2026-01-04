<script lang="ts">
  import Main from "./pages/MainPage.svelte";

  // 현재 페이지 상태 관리 (기본값: 'main')
  let currentPage = $state("main");

  function navigate(page: string) {
    currentPage = page;
  }
</script>

<main class="container">
  {#if currentPage === "main"}
    <Main onNavigate={navigate} />
  {/if}
  <br>
  <button  class="guide-button">만든이</button>
</main>

<style>
    .guide-button {
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
</style>
