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
        if (targetRow < 100 && targetCol < 20) {
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
    grid-template-columns: repeat(20, 40px); /* 20개 열 */
    width: fit-content; /* 컨테이너 크기 조정 */
    border: 1px solid #ccc;
  }
  input {
    width: 40px;
    height: 25px;
    border: 0.5px solid #eee; /* 아주 얇은 테두리 */
    outline: none;
    font-size: 12px;
  }
  input:focus {
    background-color: #eef6ff; /* 포커스 시 색상 변경으로 위치 확인 */
    border: 1.5px solid #0e0eab; /* 아주 얇은 테두리 */
  }
</style>