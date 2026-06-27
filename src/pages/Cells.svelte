<script lang="ts">
  import { createGooglesheetData, createCocoPalette } from "./CoCsheetStyle";
  import { _, locale, isLoading } from "svelte-i18n";
  import "../i18n";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

  let gridData = $state(Array.from({ length: 100 }, () => Array(20).fill("")));

  // 데이터 저장(DB 기능)
  function saveGrid() {
    localStorage.setItem("insane-grid-data", JSON.stringify(gridData));
  }

  // 데이터 불러오기
  function loadGrid() {
    const saved = localStorage.getItem("insane-grid-data");
    if (saved) gridData = JSON.parse(saved);
  }

  function handlePaste(e: ClipboardEvent, startRow: number, startCol: number) {
    const data = e.clipboardData?.getData("text");
    if (!data) return;

    const rows = data.split(/\r?\n/);
    rows.forEach((rowStr, rIdx) => {
      const cols = rowStr.split("\t");
      cols.forEach((val, cIdx) => {
        const targetRow = startRow + rIdx;
        const targetCol = startCol + cIdx;
        if (targetRow < 100 && targetCol < 20) {
          gridData[targetRow][targetCol] = val;
        }
      });
    });
  }
</script>

<main>
  <div class="content-wrapper">
    <div>
      <br /><br />
      <div class="nav-row">
        <button class="main-btn" onclick={() => onNavigate("main")}
          >{$_("main_btn")}</button
        >
      </div>
      <div class="grid-container">
        {#each gridData as row, rIdx}
          {#each row as cell, cIdx}{/each}
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .grid-container {
    display: grid;
    /* 20개의 열을 40px씩 고정 */
    grid-template-columns: repeat(20, 40px);
  }
  input {
    width: 40px;
    height: 25px;
    border: 1px solid #ddd;
    outline: none;
  }
</style>
