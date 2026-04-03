<script lang="ts">
  import image02 from "../assets/image02.png";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();
</script>

<main>
  <div class="content-wrapper">
    <img src={image02} alt="Icon" width="200" />
    <h2>TRPG Character Maker</h2>
    <button
      class="how-to-use-btn"
      onclick={() =>
        window.open(
          "https://nice-surgeon-b5e.notion.site/Manual-TRPG-Character-Maker-33778a0f8bcb80659ad4dbf0a07024dd?pvs=73",
          "_blank",
        )}>🤔 How to Use</button
    >
    <h2>- Rules -</h2>
    <div class="button-container">
      <button onclick={() => onNavigate("CoCgen")}>
        - Call Of Cthulhu 7th -
      </button>
      <button onclick={() => onNavigate("Insgen")}> - inSANe - </button>
      <button> - 준비중 - </button>
      <button> - 준비중 - </button>
    </div>
    <br /><br /><br /><br />
    <h5 style="color:0C7075, opacity:0.4;">D.mong</h5>
  </div>
</main>

<style>
  main {
    height: 250px;
    display: flex;
    justify-content: center;
    margin: 0;
  }

  

  .content-wrapper {
    width: 500px;
    padding: 40px;
    text-align: center;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
    align-items: center;
  }

  .button-container button {
    width: 100%;
    max-width: 300px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
</style>
