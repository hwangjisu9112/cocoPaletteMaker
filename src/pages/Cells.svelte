<script lang="ts">
  import { _, locale, isLoading } from "svelte-i18n";
  import "../i18n";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

 let gridData = $state(Array.from({ length: 100 }, () => Array(10).fill("")));

  // 셀 붙여넣기 핸들러: 이벤트 객체만 받아서 현재 셀 위치를 추적
  function handlePaste(e: ClipboardEvent, rIdx: number, cIdx: number) {
    e.preventDefault();
    const data = e.clipboardData?.getData("text");
    if (!data) return;

    const rows = data.split(/\r?\n/);
    rows.forEach((rowStr, rIdxOffset) => {
      const cols = rowStr.split("\t");
      cols.forEach((val, cIdxOffset) => {
        const targetRow = rIdx + rIdxOffset;
        const targetCol = cIdx + cIdxOffset;
        if (targetRow < 200 && targetCol < 10) {
          gridData[targetRow][targetCol] = val;
        }
      });
    });
  }
</script>

<main>
  <div class="grid-container">
    {#each gridData as row, rIdx}
      {#each row as cell, cIdx}
        <input 
          value={gridData[rIdx][cIdx]}
          oninput={(e: any) => gridData[rIdx][cIdx] = e.target.value}
          onpaste={(e) => handlePaste(e, rIdx, cIdx)}
        />
      {/each}
    {/each}
  </div>
</main>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(10, 100px); 
    width: fit-content; 
    border: 1px solid #1654e3b3;
  }
  input {
    width: 100px;
    height: 25px;
    border: 1.5px solid #eee; 
    outline: none;
    font-size: 12px;
  }
  input:focus {
    background-color: #eef6ff; 
    border: 1.5px solid #0e0eab; 
  }
</style>