<script lang="ts">
  import image02 from "../assets/image02.png";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

</script>

<main>
  <div class="content-wrapper">
    <br />
    <img src={image02} alt="Icon" width="100" />
    <h2>TRPG Character Maker</h2>
    <h3>- Rules -</h3>
    <div class="button-container">
      <button onclick={()=> onNavigate('CoCgen')}>
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
    justify-content: center; 
  }

  .content-wrapper {
    width: 600px;
    margin: 0 auto;
    text-align: center;
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
