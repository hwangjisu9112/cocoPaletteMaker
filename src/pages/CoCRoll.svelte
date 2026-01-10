<script lang="ts">
  import { appState } from "../store.svelte";
  import { StatDescriptions } from "../CoCtooltip";
  import image02 from "../assets/image02.png";
  import { _, locale, isLoading } from "svelte-i18n";
  import "../i18n.ts";

  let { onNavigate }: { onNavigate: (page: string) => void } = $props();

  /**
   * 현재 애플리케이션의 표시 언어를 변경합니다.
   *
   * @param lang - 변경할 언어 코드
   */
  function switchLang(lang: string): void {
    locale.set(lang);
  }

  //TRPG Call Of Cthulhu 7판(기본)의 탐사자 특성치를 무작위로 생성하는 func

  /**
   * 주사위를 반복 굴려 합산한 값을 계산합니다.
   *
   * @param times - 주사위를 굴리는 횟수
   * @param value - 주사위 한 면의 최대값
   * @returns 누적 합산된 주사위 결과
   */
  function rollDie(times: number, value: number): number {
    let rollResult = 0;

    for (let i = 0; i < times; i++) {
      rollResult += Math.floor(Math.random() * value) + 1;
    }
    return rollResult;
  }

  /**
   * 크툴루 규칙에 따라 탐사자의 능력치를 새로 생성합니다.
   */
  function rollCOC(): void {
    const newStats = {
      str: rollDie(3, 6) * 5,
      con: rollDie(3, 6) * 5,
      siz: (rollDie(2, 6) + 6) * 5,
      dex: rollDie(3, 6) * 5,
      app: rollDie(3, 6) * 5,
      edu: (rollDie(2, 6) + 6) * 5,
      int: (rollDie(2, 6) + 6) * 5,
      pow: rollDie(3, 6) * 5,
      luc: rollDie(3, 6) * 5,
    };
    appState.setStats(newStats);
    console.log(newStats);
    console.log("특성치 생성됨");
  }

  let tooltip = $state({ content: "", show: false, x: 0, y: 0 });

  /**
   * 능력치 요소에 마우스를 올렸을 때 툴팁을 표시합니다.
   *
   * @param event - 마우스 이벤트 객체
   * @param statKey - 설명을 표시할 능력치 키
   */
  function mouseOver(event: MouseEvent, statKey: string) {
    tooltip.content = StatDescriptions[statKey];
    tooltip.show = true;
    handleMouseMove(event);
  }

  /**
   * 마우스 이동에 따라 툴팁 위치를 갱신합니다.
   *
   * @param event - 마우스 이벤트 객체
   */
  function handleMouseMove(event: MouseEvent): void {
    if (tooltip.show) {
      // 커서 위치에서 살짝 오른쪽/아래(15px)로 툴팁을 이동시켜 커서 가림 방지
      tooltip.x = event.clientX + 15;
      tooltip.y = event.clientY + 15;
    }
  }

  /**
   * 마우스가 능력치 요소에서 벗어났을 때 툴팁을 숨깁니다.
   */
  function mouseOut(): void {
    tooltip.show = false;
    tooltip.content = "";
  }

  /**
   * 생성된 능력치를 초기값(0)으로 되돌립니다.
   */
  function resetCOC(): void {
    appState.reset();
    console.log("특성치 초기화됨");
  }
</script>

<main onmousemove={handleMouseMove}>
  <div class="content-wrapper">
    <div style="margin-top: 5px;">
      <br />
      <button onclick={() => onNavigate("main")}>M A I N</button>

      <button class="lang-btn" onclick={() => switchLang("kr")}>한</button>
      <button class="lang-btn" onclick={() => switchLang("jp")}>日</button>
      <button class="lang-btn" onclick={() => switchLang("en")}>EN</button>
    </div>
    <img src={image02} alt="Icon" width="100" />

    <h2>{$_("CoCtitle")}</h2>

    <button onclick={rollCOC}>{$_("roll")}</button>
    <button onclick={resetCOC}>{$_("reset")}</button>
    <button onclick={() => onNavigate("CoCsht")}>{$_("confirm")}</button>
      <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <div class="stats-grid">
        <p onmouseover={(e) => mouseOver(e, "str")} onmouseout={mouseOut}>
          {$_("str")}: <strong>{appState.currentStats.str}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "con")} onmouseout={mouseOut}>
          {$_("con")}: <strong>{appState.currentStats.con}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "siz")} onmouseout={mouseOut}>
          {$_("siz")}: <strong>{appState.currentStats.siz}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "dex")} onmouseout={mouseOut}>
          {$_("dex")}:<strong>{appState.currentStats.dex}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "app")} onmouseout={mouseOut}>
          {$_("app")}:<strong>{appState.currentStats.app}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "edu")} onmouseout={mouseOut}>
          {$_("edu")}: <strong>{appState.currentStats.edu}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "int")} onmouseout={mouseOut}>
          {$_("int")}: <strong>{appState.currentStats.int}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "pow")} onmouseout={mouseOut}>
          {$_("pow")}: <strong>{appState.currentStats.pow}</strong>
        </p>
        <p onmouseover={(e) => mouseOver(e, "luc")} onmouseout={mouseOut}>
          {$_("luc")}: <strong>{appState.currentStats.luc}</strong>
        </p>
      </div>
  </div>
  <br />
  <div>
    <button
      class="guide-button"
      onclick={() =>
        window.open(
          "https://www.postype.com/@dmong0304/post/20879624",
          "_blank",
        )}>guide</button
    >
  </div>

  {#if tooltip.show}
    <div class="tooltip" style="left: {tooltip.x}px; top: {tooltip.y}px;">
      {tooltip.content}
    </div>
  {/if}
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
  .lang-btn {
    background-color: dimgray;
  }

  .stats-grid {
    display: grid;
    /* 3개의 열(column)을 만들고, 각 열이 동일한 공간(1fr)을 차지하도록 설정. */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
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
