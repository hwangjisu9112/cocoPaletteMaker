<script lang="ts">
  import { appState } from "../store.svelte";
  import { StatDescriptions } from "../CoCtooltip";
  import image02 from "../assets/image02.png";
  import { _, locale } from "svelte-i18n";
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
    <div>
      <br /><br />
      <div class="nav-row">
        <button class="main-btn" onclick={() => onNavigate("main")}
          >{$_("main_btn")}</button
        >
        <button class="lang-btn" onclick={() => switchLang("kr")}>한국어</button
        >
        <button class="lang-btn" onclick={() => switchLang("jp")}>日本語</button
        >
        <button class="lang-btn" onclick={() => switchLang("en")}>ENG</button>
      </div> <br />
      <img src={image02} alt="Icon" width="80" />
    
      <h2 class="page-title">{$_("CoCtitle")}</h2>

      <button onclick={rollCOC}>{$_("roll")}</button>
      <button onclick={resetCOC}>{$_("reset")}</button>
      <!-- svelte-ignore a11y_mouse_events_have_key_events -->
      <div class="stats-grid">
        <p onmouseover={(e) => mouseOver(e, "str")} onmouseout={mouseOut}>
          {$_("str")}: {#key appState.currentStats.str}<strong
              class="animate-pop">{appState.currentStats.str}</strong
            >
          {/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "con")} onmouseout={mouseOut}>
          {$_("con")}: {#key appState.currentStats.con}<strong
              class="animate-pop">{appState.currentStats.con}</strong
            >
          {/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "siz")} onmouseout={mouseOut}>
          {$_("siz")}: {#key appState.currentStats.siz}
            <strong class="animate-pop">{appState.currentStats.siz}</strong>
          {/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "dex")} onmouseout={mouseOut}>
          {$_("dex")}:{#key appState.currentStats.dex}<strong
              class="animate-pop">{appState.currentStats.dex}</strong
            >
          {/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "app")} onmouseout={mouseOut}>
          {$_("app")}:{#key appState.currentStats.app}<strong
              class="animate-pop">{appState.currentStats.app}</strong
            >{/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "edu")} onmouseout={mouseOut}>
          {$_("edu")}:{#key appState.currentStats.edu}
            <strong class="animate-pop">{appState.currentStats.edu}</strong
            >{/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "int")} onmouseout={mouseOut}>
          {$_("int")}:{#key appState.currentStats.int}
            <strong class="animate-pop">{appState.currentStats.int}</strong
            >{/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "pow")} onmouseout={mouseOut}>
          {$_("pow")}:{#key appState.currentStats.pow}
            <strong class="animate-pop">{appState.currentStats.pow}</strong
            >{/key}
        </p>
        <p onmouseover={(e) => mouseOver(e, "luc")} onmouseout={mouseOut}>
          {$_("luc")}:{#key appState.currentStats.luc}
            <strong class="animate-pop">{appState.currentStats.luc}</strong
            >{/key}
        </p>
      </div>
      <button onclick={() => onNavigate("CoCsht")}>{$_("confirm")}</button>
    </div>
    {#if tooltip.show}
      <div class="tooltip" style="left: {tooltip.x}px; top: {tooltip.y}px;">
        {tooltip.content}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 400px;
    display: flex;
    margin: 0;
  }

  .content-wrapper {
    width: 500px;
    padding: 20px;
    text-align: center;
  }

  .content-wrapper button:not(.lang-btn) {
    width: 100%; /* 부모인 content-wrapper 너비에 맞춤 */
    max-width: 400px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
    height: 50px; /* 높이도 고정하면 언어별 폰트 높이 차이를 무시할 수 있음 */
    margin: 5px auto; /* 중앙 정렬 및 간격 */
    display: block; /* 한 줄에 하나씩 배치되도록 설정 */

    /* 텍스트가 길어져도 버튼 크기가 변하지 않게 함 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-title {
    width: 100%; /* 부모인 content-wrapper 너비에 맞춤 */
    max-width: 400px; /* 너무 길어지는 것을 방지 (원하는 크기로 조절) */
    height: 50px; /* 높이도 고정하면 언어별 폰트 높이 차이를 무시할 수 있음 */
    margin: 5px auto; /* 중앙 정렬 및 간격 */
    display: block; /* 한 줄에 하나씩 배치되도록 설정 */

    /* 텍스트가 길어져도 버튼 크기가 변하지 않게 함 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @keyframes stat-pop {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.8); /* 밝게 빛남 */
      color: #40ddb3;
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }

  .animate-pop {
    display: inline-block; /* 크기 변화를 위해 인라인 블록 설정 */
    animation: stat-pop 0.4s ease-out; /* 0.4초 동안 부드럽게 실행 */
  }

  .stats-grid {
    display: grid;
    /* 3개의 열(column)을 만들고, 각 열이 동일한 공간(1fr)을 차지하도록 설정. */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }

  .stats-grid p {
    background: #274d60;
    padding: 12px 5px;
    border-radius: 8px;
    margin: 0;

    /* 핵심: 내부 텍스트 길이에 상관없이 박스 크기 유지 */
    display: flex;
    flex-direction: column; /* 라벨과 수치를 세로로 배치하고 싶을 때 유용 */
    justify-content: center;
    align-items: center;
    min-height: 60px; /* 높이를 고정하여 언어 변경 시 덜컥거림 방지 */

    color: white;
    font-size: 0.9rem;
  }

  .stats-grid p strong {
    display: block;
    margin-top: 4px;
    font-size: 1.1rem;
    color: white;
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
</style>
