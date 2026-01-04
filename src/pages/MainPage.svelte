<script lang="ts">
  import { AppState } from "../store";
  import image02 from "../assets/image02.png";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

  // 현재 페이지 상태 관리 (기본값: 'main')
  let currentPage = $state("main");

  function navigate(page: string) {
    currentPage = page;
  }
</script>

<main>
  <div class="content-wrapper">
    <br />
    <img src={image02} alt="Icon" width="100" />
    <h2>TRPG Character Maker</h2>
    <h3>- Rules -</h3>
    <div class="button-container">
      <button>
        <span>🌌</span>
        Call Of Cthulhu 7th
      </button>
      <button>
        <span>📜</span>
        준비중...
      </button>
    </div>
  </div>


</main>

<style>
  main {
    display: flex;
    justify-content: center; /* 가운데 배치 */
  }

  .content-wrapper {
    width: 600px;
    margin: 0 auto;
    text-align: center;
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


  .button-container {
    display: flex;
    flex-direction: column; /* 아이템들을 세로 방향으로 배치 */
    gap: 10px; /* 버튼 사이 간격 (선택 사항) */
  }

  /* 버튼 자체의 스타일 (선택 사항) */
  .button-container button {
    padding: 10px 20px;
    margin-bottom: 5px;
  }
</style>
